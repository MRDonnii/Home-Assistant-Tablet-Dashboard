macOS kiosk controller for Chrome with MQTT control.

Files:
- `kiosk_controller.rb`: MQTT listener and Chrome/display controller.
- `com.example.kiosk-controller.plist.example`: LaunchAgent example for auto-start at login.
- `kiosk-config.json.example`: Example config to copy to the Mac.
- `blank.html`: Fullscreen black page used for "blank screen".
- `window_hygiene.applescript`: Hides/minimizes other visible apps and keeps Chrome frontmost.
