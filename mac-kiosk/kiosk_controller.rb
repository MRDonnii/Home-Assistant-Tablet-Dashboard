#!/usr/bin/env ruby

require "rubygems"
require "json"
require "logger"
require "mqtt"
require "open3"
require "time"
require "uri"
require "socket"
require "base64"

APP_DIR = File.expand_path("~/.kiosk")
CONFIG_PATH = File.join(APP_DIR, "kiosk-config.json")
STATE_PATH = File.join(APP_DIR, "state.json")
LOG_PATH = File.expand_path("~/Library/Logs/kiosk-controller.log")
BLANK_PAGE = "file://#{File.join(APP_DIR, 'blank.html')}"
WINDOW_HYGIENE_SCRIPT = File.join(APP_DIR, "window_hygiene.applescript")
CHROME_APP = "/Applications/Google Chrome.app"
SCREENSHOT_PATH = "/tmp/kiosk-screenshot.jpg"

def run(*command)
  output, status = Open3.capture2e(*command)
  safe_output = output.to_s.dup.force_encoding("UTF-8")
  safe_output = safe_output.encode("UTF-8", invalid: :replace, undef: :replace, replace: "")
  [safe_output, "", status.success?]
rescue StandardError => e
  ["", e.message, false]
end

def valid_url?(value)
  uri = URI.parse(value)
  %w[http https file].include?(uri.scheme)
rescue URI::InvalidURIError
  false
end

class KioskController
  def initialize
    Dir.mkdir(APP_DIR) unless Dir.exist?(APP_DIR)
    @logger = Logger.new(LOG_PATH, 10, 1_048_576)
    @logger.level = Logger::INFO
    @config = JSON.parse(File.read(CONFIG_PATH))
    @state = load_state
    @state["current_url"] ||= @config["startup_url"]
    @state["previous_url"] ||= ""
    @state["blanked"] = !!@state["blanked"]
    @state["display_sleeping"] = false
    @state["kiosk_enabled"] = @config.fetch("kiosk_enabled", true) if @state["kiosk_enabled"].nil?
    @state["kiosk_mode_enabled"] = @config.fetch("kiosk_mode_enabled", true) if @state["kiosk_mode_enabled"].nil?
    @state["window_hygiene_enabled"] = @config.fetch("window_hygiene_enabled", true) if @state["window_hygiene_enabled"].nil?
    if @state["kiosk_enabled"]
      @state["kiosk_mode_enabled"] = true
      @state["window_hygiene_enabled"] = true
    end
    @state["last_command"] ||= ""
    @state["last_command_at"] ||= 0
    save_state
    @base_topic = @config.fetch("base_topic").sub(%r{/$}, "")
    @startup_url = @config.fetch("startup_url")
    @status_interval = @config.fetch("status_interval_seconds", 30).to_i
    @window_hygiene_interval = @config.fetch("window_hygiene_interval_seconds", 15).to_i
    @browser_watchdog_interval = @config.fetch("browser_watchdog_interval_seconds", 20).to_i
    @close_browser_on_display_sleep = @config.fetch("close_browser_on_display_sleep", true)
    @thermal_metrics_interval = @config.fetch("thermal_metrics_interval_seconds", 300).to_i
    @battery_details_interval = @config.fetch("battery_details_interval_seconds", 1800).to_i
    @network_details_interval = @config.fetch("network_details_interval_seconds", 300).to_i
    @disk_metrics_interval = @config.fetch("disk_metrics_interval_seconds", 600).to_i
    @metric_cache = {}
    @keep_running = true
    @keep_awake_pid = nil
    @client = nil
  end

  def load_state
    return {} unless File.exist?(STATE_PATH)

    JSON.parse(File.read(STATE_PATH))
  rescue JSON::ParserError
    {}
  end

  def save_state
    File.write(STATE_PATH, JSON.pretty_generate(@state))
  end

  def chrome_running?
    _, _, ok = run("/usr/bin/pgrep", "-x", "Google Chrome")
    ok
  end

  def parse_top_line(text, label)
    line = text.lines.find { |entry| entry.start_with?(label) }
    line.to_s
  end

  def cached_metric(key, interval)
    now = Time.now.to_i
    cached = @metric_cache[key]
    if cached && (now - cached[:at]) < interval
      return cached[:value].dup
    end

    value = yield
    @metric_cache[key] = { at: now, value: value }
    value.dup
  end

  def battery_info
    output, _, = run("/usr/bin/pmset", "-g", "batt")
    info = {
      "battery_percent" => nil,
      "battery_charging" => nil,
      "battery_present" => nil,
      "battery_time_remaining_min" => nil,
      "power_source" => nil
    }
    output.each_line do |line|
      if line.include?("Now drawing from")
        info["power_source"] = line[/Now drawing from '([^']+)'/, 1]
      elsif line.include?("InternalBattery")
        info["battery_percent"] = line[/(\d+)%/, 1]&.to_i
        info["battery_charging"] = line.include?("charging")
        info["battery_present"] = line.include?("present: true")
        if (match = line.match(/(\d+):(\d+) remaining/))
          info["battery_time_remaining_min"] = (match[1].to_i * 60) + match[2].to_i
        end
      end
    end

    details = cached_metric("battery_details", @battery_details_interval) do
      power_output, _, = run("/usr/sbin/system_profiler", "SPPowerDataType")
      data = {}
      if (match = power_output.match(/Cycle Count:\s+(\d+)/))
        data["battery_cycle_count"] = match[1].to_i
      end
      if (match = power_output.match(/Condition:\s+(.+)/))
        data["battery_condition"] = match[1].strip
      end
      data
    end
    info.merge!(details)
    info
  end

  def volume_info
    volume_output, _, = run("/usr/bin/osascript", "-e", "output volume of (get volume settings)")
    muted_output, _, = run("/usr/bin/osascript", "-e", "output muted of (get volume settings)")
    {
      "volume_output_percent" => volume_output.strip.empty? ? nil : volume_output.strip.to_i,
      "volume_muted" => muted_output.strip.downcase == "true"
    }
  end

  def brightness_info
    output, _, = run("/usr/sbin/ioreg", "-n", "AppleBacklightDisplay", "-r", "-d", "1")
    if (match = output.match(/"brightness"=\{"min"=(\d+),"max"=(\d+),"value"=(\d+)\}/))
      min = match[1].to_f
      max = match[2].to_f
      value = match[3].to_f
      percent = max > min ? (((value - min) / (max - min)) * 100.0).round : nil
      return { "brightness_percent" => percent }
    end
    {}
  end

  def network_info
    cached_metric("network_details", @network_details_interval) do
      ip_output, _, = run("/usr/sbin/ipconfig", "getifaddr", "en0")
      airport_output, _, = run(
        "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport",
        "-I"
      )
      {
        "wifi_ip" => ip_output.strip.empty? ? nil : ip_output.strip,
        "wifi_ssid" => airport_output[/\bSSID:\s+(.+)/, 1]&.strip,
        "wifi_rssi" => airport_output[/\bagrCtlRSSI:\s+(-?\d+)/, 1]&.to_i,
        "wifi_noise" => airport_output[/\bagrCtlNoise:\s+(-?\d+)/, 1]&.to_i,
        "wifi_tx_rate" => airport_output[/\blastTxRate:\s+(\d+)/, 1]&.to_i,
        "wifi_channel" => airport_output[/\bchannel:\s+(.+)/, 1]&.strip
      }
    end
  end

  def disk_info
    cached_metric("disk_metrics", @disk_metrics_interval) do
      output, _, = run("/bin/df", "-k", "/")
      fields = output.lines.last.to_s.split
      next {} if fields.length < 6

      total_kb = fields[1].to_i
      available_kb = fields[3].to_i
      used_percent = fields[4].to_s.delete("%").to_i
      {
        "disk_total_gb" => (total_kb / 1024.0 / 1024.0).round(1),
        "disk_free_gb" => (available_kb / 1024.0 / 1024.0).round(1),
        "disk_used_percent" => used_percent
      }
    end
  end

  def system_metrics
    top_output, _, = run("/usr/bin/top", "-l", "1", "-n", "0")
    cpu_line = parse_top_line(top_output, "CPU usage:")
    mem_line = parse_top_line(top_output, "PhysMem:")

    metrics = {
      "hostname" => Socket.gethostname,
      "cpu_user_percent" => cpu_line[/CPU usage:\s+([\d.]+)% user/, 1]&.to_f,
      "cpu_sys_percent" => cpu_line[/,\s+([\d.]+)% sys/, 1]&.to_f,
      "cpu_idle_percent" => cpu_line[/,\s+([\d.]+)% idle/, 1]&.to_f,
      "memory_used_mb" => mem_line[/PhysMem:\s+(\d+)M used/, 1]&.to_i,
      "memory_unused_mb" => mem_line[/,\s+(\d+)M unused/, 1]&.to_i
    }

    thermal_metrics = cached_metric("thermal_metrics", @thermal_metrics_interval) do
      data = {}
      thermal_output, _, = run("/usr/sbin/sysctl", "-n", "machdep.xcpm.cpu_thermal_level")
      gpu_thermal_output, _, = run("/usr/sbin/sysctl", "-n", "machdep.xcpm.gpu_thermal_level")
      io_thermal_output, _, = run("/usr/sbin/sysctl", "-n", "machdep.xcpm.io_thermal_level")
      data["cpu_thermal_level"] = thermal_output.strip.to_i unless thermal_output.strip.empty?
      data["gpu_thermal_level"] = gpu_thermal_output.strip.to_i unless gpu_thermal_output.strip.empty?
      data["io_thermal_level"] = io_thermal_output.strip.to_i unless io_thermal_output.strip.empty?

      powermetrics_output, _, = run("/usr/bin/sudo", "-n", "/usr/bin/powermetrics", "--samplers", "smc", "-n", "1")
      if (match = powermetrics_output.match(/CPU die temperature:\s+([\d.]+)\s+C/))
        data["cpu_temp_c"] = match[1].to_f
      end
      if (match = powermetrics_output.match(/Fan:\s+(\d+)\s+rpm/))
        data["fan_rpm"] = match[1].to_i
      end
      data
    end
    metrics.merge!(thermal_metrics)

    metrics.merge!(battery_info)
    metrics.merge!(volume_info)
    metrics.merge!(brightness_info)
    metrics.merge!(network_info)
    metrics.merge!(disk_info)
    metrics
  end

  def start_keep_awake
    return unless @config.fetch("keep_awake", true)
    return if @keep_awake_pid

    @keep_awake_pid = spawn("/usr/bin/caffeinate", "-dimsu", out: "/dev/null", err: "/dev/null")
    @logger.info("Started caffeinate pid=#{@keep_awake_pid}")
  end

  def stop_keep_awake
    return unless @keep_awake_pid

    Process.kill("TERM", @keep_awake_pid)
    Process.wait(@keep_awake_pid)
  rescue StandardError
    nil
  ensure
    @keep_awake_pid = nil
  end

  def ensure_chrome
    return unless browser_should_run?
    return if chrome_running?

    open_chrome(@state["current_url"] || @startup_url)
    sleep 2
  end

  def stop_chrome
    run("/usr/bin/pkill", "-x", "Google Chrome")
  end

  def browser_should_run?
    return false if @close_browser_on_display_sleep && @state["display_sleeping"]

    true
  end

  def relaunch_chrome(url)
    stop_chrome
    sleep 2
    return unless browser_should_run?

    open_chrome(url)
    sleep 2
    enforce_window_hygiene if kiosk_controls_enabled?
  end

  def enforce_window_hygiene
    return unless kiosk_controls_enabled?
    return unless @state.fetch("window_hygiene_enabled", @config.fetch("window_hygiene_enabled", true))
    return unless File.exist?(WINDOW_HYGIENE_SCRIPT)

    foreground_app = @config.fetch("foreground_app", "Google Chrome")
    allowed_apps = @config.fetch("allowed_visible_apps", ["Google Chrome"])
    run(
      "/usr/bin/osascript",
      WINDOW_HYGIENE_SCRIPT,
      foreground_app,
      allowed_apps.join(",")
    )
  end

  def open_chrome(url)
    args = [
      "/usr/bin/open",
      "-na",
      @config.fetch("chrome_path", CHROME_APP),
      "--args"
    ]
    if kiosk_mode_active?
      args.concat([
        "--kiosk",
        "--new-window"
      ])
    else
      args.concat([
        "--new-window"
      ])
    end
    args.concat([
      "--disable-session-crashed-bubble",
      "--disable-background-networking",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-domain-reliability",
      "--disable-features=TranslateUI,AutofillServerCommunication,CertificateTransparencyComponentUpdater,DialMediaRouteProvider,GlobalMediaControls,InterestFeedContentSuggestions,MediaRouter,OptimizationHints",
      "--disable-hang-monitor",
      "--overscroll-history-navigation=0",
      "--disable-prompt-on-repost",
      "--disable-sync",
      "--metrics-recording-only",
      "--no-default-browser-check",
      "--no-first-run",
      "--password-store=basic",
      "--process-per-site",
      "--disable-pinch",
      url
    ])
    _, stderr, ok = run(*args)
    @logger.warn("open failed: #{stderr.strip}") unless ok
    @state["current_url"] = url
    @state["blanked"] = (url == BLANK_PAGE)
    save_state
  end

  def set_url(url, remember: true)
    raise "Invalid URL: #{url}" unless valid_url?(url)

    if remember && @state["current_url"] && @state["current_url"] != BLANK_PAGE
      @state["previous_url"] = @state["current_url"]
    end
    relaunch_chrome(url)
    @state["current_url"] = url
    @state["blanked"] = (url == BLANK_PAGE)
    save_state
    publish_status
  end

  def refresh
    relaunch_chrome(@state["current_url"] || @startup_url)
    publish_status
  end

  def restart_browser
    relaunch_chrome(@state["current_url"] || @startup_url)
    publish_status
  end

  def blank_on
    current_url = @state["current_url"] || @startup_url
    @state["previous_url"] = current_url unless current_url == BLANK_PAGE
    save_state
    set_url(BLANK_PAGE, remember: false)
  end

  def blank_off
    set_url(@state["previous_url"].to_s.empty? ? @startup_url : @state["previous_url"], remember: false)
  end

  def display_sleep
    @state["display_sleeping"] = true
    save_state
    stop_chrome if @close_browser_on_display_sleep
    run("/usr/bin/pmset", "displaysleepnow")
    publish_status("display_state" => "sleep")
  end

  def display_wake
    run("/usr/bin/caffeinate", "-u", "-t", "2")
    @state["display_sleeping"] = false
    save_state
    if kiosk_controls_enabled?
      if kiosk_mode_active?
        relaunch_chrome(@state["current_url"] || @startup_url)
        sleep 2
        force_fullscreen
      else
        ensure_chrome
      end
    end
    publish_status("display_state" => "awake")
  end

  def force_fullscreen
    run("/usr/bin/osascript", "-e", 'tell application "Google Chrome" to activate')
    sleep 1
    run(
      "/usr/bin/osascript",
      "-e",
      'tell application "System Events" to keystroke "f" using {control down, command down}'
    )
    publish_status
  end

  def reset_zoom
    run("/usr/bin/osascript", "-e", 'tell application "Google Chrome" to activate')
    sleep 0.5
    run(
      "/usr/bin/osascript",
      "-e",
      'tell application "System Events" to keystroke "0" using {command down}'
    )
    publish_status
  end

  def status_payload(extra = {})
    {
      "current_url" => @state["current_url"],
      "previous_url" => @state["previous_url"],
      "blanked" => @state["blanked"],
      "display_sleeping" => @state["display_sleeping"],
      "kiosk_enabled" => @state.fetch("kiosk_enabled", @config.fetch("kiosk_enabled", true)),
      "kiosk_mode_enabled" => @state.fetch("kiosk_mode_enabled", @config.fetch("kiosk_mode_enabled", true)),
      "window_hygiene_enabled" => @state.fetch("window_hygiene_enabled", @config.fetch("window_hygiene_enabled", true)),
      "chrome_running" => chrome_running?,
      "last_command" => @state["last_command"],
      "last_command_at" => @state["last_command_at"]
    }.merge(system_metrics).merge(extra)
  end

  def publish(topic, payload, retain: false)
    return unless @client && @client.connected?
    @client.publish(topic, payload, retain)
  end

  def publish_availability(state)
    publish("#{@base_topic}/availability", state, retain: true)
  end

  def publish_status(extra = {})
    publish("#{@base_topic}/status", JSON.generate(status_payload(extra)), retain: true)
  end

  def capture_screenshot
    run("/usr/sbin/screencapture", "-x", "-t", "jpg", SCREENSHOT_PATH)
    return unless File.exist?(SCREENSHOT_PATH)

    payload = File.binread(SCREENSHOT_PATH)
    publish("#{@base_topic}/screenshot/image", payload, retain: false)
    publish(
      "#{@base_topic}/screenshot/meta",
      JSON.generate({ "captured_at" => Time.now.to_i, "path" => SCREENSHOT_PATH }),
      retain: false
    )
  end

  def set_volume(percent)
    run("/usr/bin/osascript", "-e", "set volume output volume #{percent.to_i}")
    publish_status
  end

  def mute_volume
    run("/usr/bin/osascript", "-e", "set volume with output muted")
    publish_status
  end

  def unmute_volume
    run("/usr/bin/osascript", "-e", "set volume without output muted")
    publish_status
  end

  def set_window_hygiene(enabled)
    @state["window_hygiene_enabled"] = !!enabled
    save_state
    enforce_window_hygiene if kiosk_controls_enabled? && @state["window_hygiene_enabled"]
    publish_status
  end

  def set_kiosk_mode(enabled)
    @state["kiosk_mode_enabled"] = !!enabled
    save_state
    relaunch_chrome(@state["current_url"] || @startup_url)
    publish_status
  end

  def kiosk_controls_enabled?
    @state.fetch("kiosk_enabled", @config.fetch("kiosk_enabled", true))
  end

  def kiosk_mode_active?
    kiosk_controls_enabled? && @state.fetch("kiosk_mode_enabled", @config.fetch("kiosk_mode_enabled", true))
  end

  def set_kiosk_enabled(enabled)
    @state["kiosk_enabled"] = !!enabled
    if @state["kiosk_enabled"]
      @state["kiosk_mode_enabled"] = true
      @state["window_hygiene_enabled"] = true
    else
      @state["kiosk_mode_enabled"] = false
      @state["window_hygiene_enabled"] = false
    end
    save_state
    relaunch_chrome(@state["current_url"] || @startup_url)
    publish_status
  end

  def brightness_key(code, repeats = 1)
    repeats.to_i.times do
      run("/usr/bin/osascript", "-e", %(tell application "System Events" to key code #{code}))
      sleep 0.2
    end
  end

  def brightness_up(steps = 1)
    brightness_key(145, steps)
    publish_status
  end

  def brightness_down(steps = 1)
    brightness_key(144, steps)
    publish_status
  end

  def publish_discovery
    device = {
      "identifiers" => ["kiosk_device-kiosk"],
      "name" => "MacBook Pro 2017 Kiosk",
      "manufacturer" => "Apple",
      "model" => "MacBookPro14,1",
      "sw_version" => "macOS kiosk controller"
    }
    discovery = {
      "homeassistant/button/kiosk_device_kiosk_refresh/config" => {
        "name" => "Kiosk Refresh",
        "command_topic" => "#{@base_topic}/refresh/set",
        "payload_press" => "refresh",
        "unique_id" => "kiosk_device_kiosk_refresh",
        "device" => device
      },
      "homeassistant/button/kiosk_device_kiosk_restart/config" => {
        "name" => "Kiosk Restart Browser",
        "command_topic" => "#{@base_topic}/restart_browser/set",
        "payload_press" => "restart_browser",
        "unique_id" => "kiosk_device_kiosk_restart",
        "device" => device
      },
      "homeassistant/button/kiosk_device_kiosk_display_sleep/config" => {
        "name" => "Kiosk Display Sleep",
        "command_topic" => "#{@base_topic}/display_sleep/set",
        "payload_press" => "display_sleep",
        "unique_id" => "kiosk_device_kiosk_display_sleep",
        "device" => device
      },
      "homeassistant/button/kiosk_device_kiosk_display_wake/config" => {
        "name" => "Kiosk Display Wake",
        "command_topic" => "#{@base_topic}/display_wake/set",
        "payload_press" => "display_wake",
        "unique_id" => "kiosk_device_kiosk_display_wake",
        "device" => device
      },
      "homeassistant/button/kiosk_device_kiosk_force_fullscreen/config" => {
        "name" => "Kiosk Force Full Screen",
        "command_topic" => "#{@base_topic}/force_fullscreen/set",
        "payload_press" => "force_fullscreen",
        "unique_id" => "kiosk_device_kiosk_force_fullscreen",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/switch/kiosk_device_kiosk_blank/config" => {
        "name" => "Kiosk Blank Screen",
        "command_topic" => "#{@base_topic}/blank/set",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.blanked | string | lower }}",
        "payload_on" => "ON",
        "payload_off" => "OFF",
        "state_on" => "true",
        "state_off" => "false",
        "unique_id" => "kiosk_device_kiosk_blank",
        "device" => device
      },
      "homeassistant/switch/kiosk_device_kiosk_enabled/config" => {
        "name" => "Kiosk Enabled",
        "command_topic" => "#{@base_topic}/kiosk_enabled/set",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.kiosk_enabled | string | lower }}",
        "payload_on" => "ON",
        "payload_off" => "OFF",
        "state_on" => "true",
        "state_off" => "false",
        "unique_id" => "kiosk_device_kiosk_enabled",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/text/kiosk_device_kiosk_url/config" => {
        "name" => "Kiosk URL",
        "command_topic" => "#{@base_topic}/command",
        "state_topic" => "#{@base_topic}/status",
        "command_template" => "{\"action\":\"set_url\",\"url\":{{ value | tojson }}}",
        "value_template" => "{{ value_json.current_url }}",
        "mode" => "text",
        "unique_id" => "kiosk_device_kiosk_url",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_battery/config" => {
        "name" => "Kiosk Battery",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.battery_percent }}",
        "unit_of_measurement" => "%",
        "device_class" => "battery",
        "state_class" => "measurement",
        "unique_id" => "kiosk_device_kiosk_battery",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/binary_sensor/kiosk_device_kiosk_charging/config" => {
        "name" => "Kiosk Charging",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.battery_charging }}",
        "payload_on" => "true",
        "payload_off" => "false",
        "device_class" => "battery_charging",
        "unique_id" => "kiosk_device_kiosk_charging",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_battery_cycles/config" => {
        "name" => "Kiosk Battery Cycles",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.battery_cycle_count }}",
        "state_class" => "measurement",
        "icon" => "mdi:battery-sync",
        "unique_id" => "kiosk_device_kiosk_battery_cycles",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_cpu_user/config" => {
        "name" => "Kiosk CPU User",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.cpu_user_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "icon" => "mdi:chip",
        "unique_id" => "kiosk_device_kiosk_cpu_user",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_cpu_system/config" => {
        "name" => "Kiosk CPU System",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.cpu_sys_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "icon" => "mdi:chip",
        "unique_id" => "kiosk_device_kiosk_cpu_system",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_cpu_idle/config" => {
        "name" => "Kiosk CPU Idle",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.cpu_idle_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "icon" => "mdi:chip",
        "unique_id" => "kiosk_device_kiosk_cpu_idle",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_memory_used/config" => {
        "name" => "Kiosk RAM Used",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.memory_used_mb }}",
        "unit_of_measurement" => "MB",
        "state_class" => "measurement",
        "device_class" => "data_size",
        "unique_id" => "kiosk_device_kiosk_memory_used",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_memory_free/config" => {
        "name" => "Kiosk RAM Free",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.memory_unused_mb }}",
        "unit_of_measurement" => "MB",
        "state_class" => "measurement",
        "device_class" => "data_size",
        "unique_id" => "kiosk_device_kiosk_memory_free",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_cpu_temp/config" => {
        "name" => "Kiosk CPU Temp",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.cpu_temp_c }}",
        "unit_of_measurement" => "Â°C",
        "state_class" => "measurement",
        "device_class" => "temperature",
        "icon" => "mdi:thermometer",
        "unique_id" => "kiosk_device_kiosk_cpu_temp",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_fan_rpm/config" => {
        "name" => "Kiosk Fan RPM",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.fan_rpm }}",
        "unit_of_measurement" => "rpm",
        "state_class" => "measurement",
        "icon" => "mdi:fan",
        "unique_id" => "kiosk_device_kiosk_fan_rpm",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_power_source/config" => {
        "name" => "Kiosk Power Source",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.power_source }}",
        "icon" => "mdi:power-plug",
        "unique_id" => "kiosk_device_kiosk_power_source",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/binary_sensor/kiosk_device_kiosk_online/config" => {
        "name" => "Kiosk Online",
        "state_topic" => "#{@base_topic}/availability",
        "payload_on" => "online",
        "payload_off" => "offline",
        "device_class" => "connectivity",
        "unique_id" => "kiosk_device_kiosk_online",
        "device" => device
      },
      "homeassistant/sensor/kiosk_device_kiosk_wifi_rssi/config" => {
        "name" => "Kiosk WiFi RSSI",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.wifi_rssi }}",
        "unit_of_measurement" => "dBm",
        "state_class" => "measurement",
        "device_class" => "signal_strength",
        "unique_id" => "kiosk_device_kiosk_wifi_rssi",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_wifi_ssid/config" => {
        "name" => "Kiosk WiFi SSID",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.wifi_ssid }}",
        "icon" => "mdi:wifi",
        "unique_id" => "kiosk_device_kiosk_wifi_ssid",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_wifi_ip/config" => {
        "name" => "Kiosk WiFi IP",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.wifi_ip }}",
        "icon" => "mdi:ip-network",
        "unique_id" => "kiosk_device_kiosk_wifi_ip",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_disk_free/config" => {
        "name" => "Kiosk Disk Free",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.disk_free_gb }}",
        "unit_of_measurement" => "GB",
        "state_class" => "measurement",
        "device_class" => "data_size",
        "unique_id" => "kiosk_device_kiosk_disk_free",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_disk_used/config" => {
        "name" => "Kiosk Disk Used",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.disk_used_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "unique_id" => "kiosk_device_kiosk_disk_used",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_volume/config" => {
        "name" => "Kiosk Volume",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.volume_output_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "icon" => "mdi:volume-high",
        "unique_id" => "kiosk_device_kiosk_volume",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/binary_sensor/kiosk_device_kiosk_muted/config" => {
        "name" => "Kiosk Muted",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.volume_muted }}",
        "payload_on" => "true",
        "payload_off" => "false",
        "unique_id" => "kiosk_device_kiosk_muted",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/sensor/kiosk_device_kiosk_brightness/config" => {
        "name" => "Kiosk Brightness",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.brightness_percent }}",
        "unit_of_measurement" => "%",
        "state_class" => "measurement",
        "icon" => "mdi:brightness-6",
        "unique_id" => "kiosk_device_kiosk_brightness",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/button/kiosk_device_kiosk_screenshot/config" => {
        "name" => "Kiosk Screenshot",
        "command_topic" => "#{@base_topic}/screenshot_capture/set",
        "payload_press" => "capture",
        "unique_id" => "kiosk_device_kiosk_screenshot",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/camera/kiosk_device_kiosk_screenshot/config" => {
        "name" => "Kiosk Screenshot Camera",
        "topic" => "#{@base_topic}/screenshot/image",
        "unique_id" => "kiosk_device_kiosk_screenshot_camera",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/button/kiosk_device_kiosk_mute/config" => {
        "name" => "Kiosk Mute",
        "command_topic" => "#{@base_topic}/mute/set",
        "payload_press" => "mute",
        "unique_id" => "kiosk_device_kiosk_mute",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/button/kiosk_device_kiosk_unmute/config" => {
        "name" => "Kiosk Unmute",
        "command_topic" => "#{@base_topic}/unmute/set",
        "payload_press" => "unmute",
        "unique_id" => "kiosk_device_kiosk_unmute",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/number/kiosk_device_kiosk_volume_set/config" => {
        "name" => "Kiosk Volume Set",
        "command_topic" => "#{@base_topic}/volume/set",
        "state_topic" => "#{@base_topic}/status",
        "value_template" => "{{ value_json.volume_output_percent }}",
        "min" => 0,
        "max" => 100,
        "step" => 1,
        "mode" => "slider",
        "unique_id" => "kiosk_device_kiosk_volume_set",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/button/kiosk_device_kiosk_brightness_up/config" => {
        "name" => "Kiosk Brightness Up",
        "command_topic" => "#{@base_topic}/brightness_up/set",
        "payload_press" => "up",
        "unique_id" => "kiosk_device_kiosk_brightness_up",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      },
      "homeassistant/button/kiosk_device_kiosk_brightness_down/config" => {
        "name" => "Kiosk Brightness Down",
        "command_topic" => "#{@base_topic}/brightness_down/set",
        "payload_press" => "down",
        "unique_id" => "kiosk_device_kiosk_brightness_down",
        "device" => device,
        "availability_topic" => "#{@base_topic}/availability"
      }
    }

    discovery.each do |topic, payload|
      publish(topic, JSON.generate(payload), retain: true)
    end
    [
      "homeassistant/switch/kiosk_device_kiosk_mode/config",
      "homeassistant/switch/kiosk_device_kiosk_window_hygiene/config"
    ].each do |topic|
      publish(topic, "", retain: true)
    end
  end

  def parse_message(topic, payload)
    text = payload.to_s.strip
    suffix = topic.sub(/^#{Regexp.escape(@base_topic)}\//, "")
    @logger.info("Received topic=#{topic} payload=#{text}")
    return [suffix, {}] unless suffix == "command"

    begin
      data = JSON.parse(text)
      [data["action"].to_s, data]
    rescue JSON::ParserError
      if text.start_with?("{") && text.end_with?("}")
        pairs = text[1..-2].split(",").map do |pair|
          key, value = pair.split(":", 2)
          [key.to_s.strip, value.to_s.strip]
        end.to_h
        return [pairs["action"].to_s, pairs]
      end
      [text, {}]
    end
  end

  def handle_action(action, payload = {})
    @logger.info("Handling action=#{action} payload=#{payload.inspect}")
    case action
    when "set_url", "url"
      url = payload["url"] || payload["value"]
      raise "set_url requires a url" if url.to_s.empty?

      set_url(url)
    when "refresh", "refresh/set"
      refresh
    when "restart_browser", "restart_browser/set"
      restart_browser
    when "blank_on"
      blank_on
    when "blank_off"
      blank_off
    when "blank/set"
      payload.to_s.upcase == "ON" ? blank_on : blank_off
    when "display_sleep", "display_sleep/set"
      display_sleep
    when "display_wake", "display_wake/set"
      display_wake
    when "force_fullscreen", "force_fullscreen/set"
      force_fullscreen
    when "zoom_normal", "zoom_normal/set"
      reset_zoom
    when "kiosk_enabled_on"
      set_kiosk_enabled(true)
    when "kiosk_enabled_off"
      set_kiosk_enabled(false)
    when "kiosk_enabled/set"
      set_kiosk_enabled(payload.to_s.strip.upcase == "ON")
    when "kiosk_mode_on"
      set_kiosk_mode(true)
    when "kiosk_mode_off"
      set_kiosk_mode(false)
    when "kiosk_mode/set"
      set_kiosk_mode(payload.to_s.strip.upcase == "ON")
    when "window_hygiene_on"
      set_window_hygiene(true)
    when "window_hygiene_off"
      set_window_hygiene(false)
    when "window_hygiene/set"
      set_window_hygiene(payload.to_s.strip.upcase == "ON")
    when "screenshot_capture", "screenshot_capture/set"
      capture_screenshot
    when "mute", "mute/set"
      mute_volume
    when "unmute", "unmute/set"
      unmute_volume
    when "volume/set"
      set_volume(payload.to_s)
    when "brightness_up", "brightness_up/set"
      brightness_up
    when "brightness_down", "brightness_down/set"
      brightness_down
    when "url/set"
      set_url(payload.to_s)
    else
      raise "Unsupported action: #{action}"
    end

    @state["last_command"] = action
    @state["last_command_at"] = Time.now.to_i
    save_state
    publish_status
  end

  def start_status_thread
    Thread.new do
      Thread.current[:kiosk_status_thread] = true
      while @keep_running
        publish_status if @client && @client.connected?
        sleep @status_interval
      end
    end
  end

  def start_browser_watchdog_thread
      Thread.new do
      Thread.current[:kiosk_browser_watchdog_thread] = true
      while @keep_running
        if kiosk_mode_active? && browser_should_run? && !chrome_running?
          relaunch_chrome(@state["current_url"] || @startup_url)
        end
        sleep @browser_watchdog_interval
      end
    end
  end

  def start_window_hygiene_thread
    return unless @config.fetch("window_hygiene_enabled", true)

    Thread.new do
      Thread.current[:kiosk_window_hygiene_thread] = true
      while @keep_running
        enforce_window_hygiene
        sleep @window_hygiene_interval
      end
    end
  end

  def connect_mqtt
    options = {
      host: @config.fetch("broker_host"),
      port: @config.fetch("broker_port", 1883).to_i,
      keep_alive: 60
    }
    username = @config["broker_username"].to_s
    options[:username] = username unless username.empty?
    password = @config["broker_password"].to_s
    options[:password] = password unless password.empty?
    @logger.info("Connecting to MQTT host=#{options[:host]} port=#{options[:port]} username=#{username}")
    @client = MQTT::Client.connect(options)
    [
      "#{@base_topic}/command",
      "#{@base_topic}/url/set",
      "#{@base_topic}/refresh/set",
      "#{@base_topic}/restart_browser/set",
      "#{@base_topic}/blank/set",
      "#{@base_topic}/display_sleep/set",
      "#{@base_topic}/display_wake/set",
      "#{@base_topic}/force_fullscreen/set",
      "#{@base_topic}/kiosk_enabled/set",
      "#{@base_topic}/kiosk_mode/set",
      "#{@base_topic}/window_hygiene/set",
      "#{@base_topic}/screenshot_capture/set",
      "#{@base_topic}/mute/set",
      "#{@base_topic}/unmute/set",
      "#{@base_topic}/volume/set",
      "#{@base_topic}/brightness_up/set",
      "#{@base_topic}/brightness_down/set"
    ].each do |topic|
      @client.subscribe(topic)
      @logger.info("Subscribed to #{topic}")
    end
    publish_availability("online")
    publish_discovery
    publish_status
  end

  def start
    start_keep_awake
    open_chrome(@state["current_url"] || @startup_url)
    while @keep_running
      begin
        connect_mqtt
        start_status_thread if Thread.list.none? { |thread| thread[:kiosk_status_thread] }
        start_window_hygiene_thread if Thread.list.none? { |thread| thread[:kiosk_window_hygiene_thread] }
        start_browser_watchdog_thread if Thread.list.none? { |thread| thread[:kiosk_browser_watchdog_thread] }
        @client.get do |topic, payload|
          action, data = parse_message(topic, payload)
          if action == "blank/set"
            handle_action(action, payload)
          elsif action == "force_fullscreen/set"
            handle_action(action, data)
          elsif action == "kiosk_enabled/set"
            handle_action(action, payload)
          elsif action == "kiosk_mode/set"
            handle_action(action, payload)
          elsif action == "window_hygiene/set"
            handle_action(action, payload)
          elsif action == "url/set"
            handle_action(action, payload)
          else
            handle_action(action, data)
          end
        end
      rescue StandardError => e
        @logger.error("MQTT loop failed: #{e.class}: #{e.message}")
        sleep 5
      ensure
        @client.disconnect if @client && @client.connected?
      end
    end
  end

  def stop
    @keep_running = false
    stop_keep_awake
    publish_availability("offline")
    @client.disconnect if @client && @client.connected?
  rescue StandardError
    nil
  end
end

controller = KioskController.new

Signal.trap("TERM") do
  controller.stop
  exit 0
end

Signal.trap("INT") do
  controller.stop
  exit 0
end

controller.start
