const STORAGE_KEY = "tablet_dashboard_template_config_v1";
const HA_AUTH_PENDING_KEY = "tablet_dashboard_template_ha_auth_pending_v1";
const CAMERA_POSTER_CACHE_KEY = "tablet_dashboard_template_camera_posters_v1";
const DEFAULT_FEATURED_CAMERA_ENTITY_ID = "camera.featured_camera";
const DIRECT_HOME_ASSISTANT_BASE_URL = "http://homeassistant.example.local:8123";
const GO2RTC_BASE_URL = "http://go2rtc.example.local:1984";
const WEATHER_ENTITY_ID = "weather.home";
const POWER_ENTITY_ID = "sensor.home_power";
const PRICE_ENTITY_ID = "sensor.energy_price";
const PRICE_FORECAST_ENTITY_ID = "sensor.energy_price_forecast";
const PRICE_TOMORROW_AVAILABILITY_ENTITY_ID = "binary_sensor.energy_price_tomorrow_available";
const UTILITY_VIEW_CONFIG = {
  electric: {
    label: "Husets elforbrug nu",
    currentEntityId: POWER_ENTITY_ID,
    todayEntityId: "sensor.daily_energy_usage",
    historyEntityId: POWER_ENTITY_ID,
    historyMode: "average",
    unit: "W",
    chartUnit: "W",
    caption: "Elforbrug over dagen",
    todayLabel: "I dag",
    emptyLabel: "Strømmåler offline"
  },
  heat: {
    label: "Varmeforbrug nu",
    currentEntityId: "sensor.heat_power",
    todayEntityId: "sensor.heat_energy_today",
    historyEntityId: "sensor.heat_energy_today",
    historyMode: "delta",
    unit: "kW",
    chartUnit: "kWh",
    caption: "Varmeforbrug over dagen",
    todayLabel: "I dag",
    emptyLabel: "Varme offline"
  },
  water: {
    label: "Vandforbrug i dag",
    currentEntityId: "sensor.water_usage_today",
    todayEntityId: "sensor.water_flow",
    historyEntityId: "sensor.water_usage_today",
    historyMode: "delta",
    historyBucketMinutes: 30,
    unit: "m³",
    chartUnit: "m³",
    caption: "Vandforbrug over dagen",
    todayLabel: "Flow",
    emptyLabel: "Vandmåler offline"
  }
};
const AC_CLIMATE_ENTITY_IDS = ["climate.living_room", "climate.kitchen", "climate.bedroom"];
const KIOSK_ENTITY_IDS = {
  reboot: "button.kiosk_reboot",
  refresh: "button.kiosk_refresh",
  shutdown: "button.kiosk_shutdown",
  screenshot: "image.kiosk_screenshot",
  display: "light.kiosk_display",
  zoom: "number.kiosk_page_zoom",
  volume: "number.kiosk_volume",
  kiosk: "select.kiosk_mode",
  theme: "select.kiosk_theme",
  url: "text.kiosk_page_url",
  errors: "sensor.kiosk_errors",
  heartbeat: "sensor.kiosk_heartbeat",
  host: "sensor.kiosk_host_name",
  lastActive: "sensor.kiosk_last_active",
  memorySize: "sensor.kiosk_memory_size",
  memoryUsage: "sensor.kiosk_memory_usage",
  model: "sensor.kiosk_model",
  network: "sensor.kiosk_network_address",
  upgrades: "sensor.kiosk_package_upgrades",
  temperature: "sensor.kiosk_processor_temperature",
  cpu: "sensor.kiosk_processor_usage",
  uptime: "sensor.kiosk_up_time",
  version: "sensor.kiosk_version"
};
const WASTE_COLLECTION_SENSORS = [
  "sensor.waste_paper",
  "sensor.waste_recycling",
  "sensor.waste_general",
  "sensor.waste_bulk"
];
const EXPECTED_ROOM_DEFINITIONS = [
  { key: "living_room", label: "Living room", order: 0 },
  { key: "dining_room", label: "Dining room", order: 1 },
  { key: "kitchen", label: "Kitchen", order: 2 },
  { key: "utility", label: "Utility", order: 3 },
  { key: "office", label: "Office", order: 4 },
  { key: "bedroom", label: "Bedroom", order: 5 },
  { key: "bathroom", label: "Bathroom", order: 6 },
  { key: "garage", label: "Garage", order: 7 },
  { key: "outdoor", label: "Outdoor", order: 8 },
  { key: "guest_wc", label: "Guest WC", order: 9 }
];
const DASHBOARD_REFRESH_INTERVAL_SECONDS = 30;
const CAMERA_ROW_REFRESH_INTERVAL_MS = 5000;
const FEATURED_CAMERA_REFRESH_INTERVAL_MS = 2500;
const MODAL_CAMERA_REFRESH_INTERVAL_MS = 1600;
const POWER_HISTORY_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const CAMERA_EAGER_LOAD_COUNT = 4;
const CAMERA_PRIORITY_ORDER = [
  "driveway",
  "front_yard",
  "carport",
  "back_yard",
  "play_zone",
  "play_area",
  "terrace",
  "terrace_syd"
];
const AVAILABLE_THEMES = [
  "ember",
  "ember-light",
  "fjord",
  "fjord-light",
  "forest",
  "forest-light",
  "dune",
  "dune-light",
  "aurora",
  "aurora-light",
  "slate",
  "slate-light",
  "onyx-chrome",
  "onyx-chrome-light",
  "ios-glass",
  "ios-glass-dark"
];
const LIGHT_THEME_BY_DARK_THEME = {
  ember: "ember-light",
  fjord: "fjord-light",
  forest: "forest-light",
  dune: "dune-light",
  aurora: "aurora-light",
  slate: "slate-light",
  "onyx-chrome": "onyx-chrome-light",
  "ios-glass-dark": "ios-glass"
};
const DARK_THEME_BY_LIGHT_THEME = Object.fromEntries(
  Object.entries(LIGHT_THEME_BY_DARK_THEME).map(([darkTheme, lightTheme]) => [lightTheme, darkTheme])
);
const THEME_MODE_OPTIONS = ["dark", "light", "auto"];
const THEME_MODE_LABELS = {
  dark: "Mørk",
  light: "Lys",
  auto: "Auto"
};
const THEME_MODE_ICONS = {
  dark: "☾",
  light: "☼",
  auto: "◐"
};
const THEME_META = {
  ember: { label: "Ember", caption: "Varm kobber og mørk glød", chip: "Varm" },
  "ember-light": { label: "Ember Light", caption: "Kobbervarme i lys mode", chip: "Light" },
  fjord: { label: "Fjord", caption: "Kølig blå og ren kontrast", chip: "Kølig" },
  "fjord-light": { label: "Fjord Light", caption: "Klar blå i lys mode", chip: "Light" },
  forest: { label: "Forest", caption: "Dæmpet grøn og rolig dybde", chip: "Natur" },
  "forest-light": { label: "Forest Light", caption: "Grøn ro i lys mode", chip: "Light" },
  dune: { label: "Dune", caption: "Sand, sten og blød varme", chip: "Blød" },
  "dune-light": { label: "Dune Light", caption: "Sand og sol i lys mode", chip: "Light" },
  aurora: { label: "Aurora", caption: "Klar cyan med nordlys-glød", chip: "Lys" },
  "aurora-light": { label: "Aurora Light", caption: "Nordlys i lys mode", chip: "Light" },
  slate: { label: "Slate", caption: "Mørk skifer og kølig ro", chip: "Mørk" }
};
THEME_META.aurora = { label: "Aurora", caption: "Neon, nordlys og levende kontrast", chip: "Neon" };
THEME_META.slate = { label: "Slate", caption: "Grafit, stål og rolig minimalisme", chip: "Neutral" };
THEME_META["slate-light"] = { label: "Slate Light", caption: "Grafit og stål i lys mode", chip: "Light" };
THEME_META["onyx-chrome"] = { label: "Onyx Chrome", caption: "Sort glas, cyan kant og grøn energi", chip: "Ny" };
THEME_META["onyx-chrome-light"] = { label: "Onyx Chrome Light", caption: "Chrome-look i lys mode", chip: "Light" };
THEME_META["ios-glass"] = { label: "iOS Glas", caption: "Lyst glas, frost og bløde highlights", chip: "Glas" };
THEME_META["ios-glass-dark"] = { label: "iOS Glas mørk", caption: "Mørkt glas, dybde og klare highlights", chip: "Glas" };

const THEME_PREVIEW_SWATCHES = {
  ember: ["#ef9c45", "#ff6f61", "#2a1710"],
  "ember-light": ["#d26d2c", "#ffb486", "#fff3e8"],
  fjord: ["#5fd5ff", "#83e6d1", "#0b1821"],
  "fjord-light": ["#1c86b7", "#45b8a6", "#eefaff"],
  forest: ["#66d98f", "#d0a65f", "#131712"],
  "forest-light": ["#2d9360", "#c08a38", "#f3faef"],
  dune: ["#e2b36a", "#f0d39c", "#2a1f18"],
  "dune-light": ["#b87935", "#e8bc73", "#fff4e3"],
  aurora: ["#7cf7d4", "#9d7cff", "#ff6fd8"],
  "aurora-light": ["#129d93", "#7760d8", "#fff1fb"],
  slate: ["#9fc0d8", "#d7e2eb", "#26313c"],
  "slate-light": ["#526f86", "#92a9bb", "#f4f7fa"],
  "onyx-chrome": ["#00b8ff", "#00e676", "#000000"],
  "onyx-chrome-light": ["#0078c8", "#18a96a", "#f4f7fb"],
  "ios-glass": ["#4aa3ff", "#7ce0ff", "#ffffff"],
  "ios-glass-dark": ["#78b9ff", "#7ce0ff", "#122033"]
};

const HOUSE_MODE_CARDS = [
  {
    key: "living_room",
    name: "Living room",
    automationEntityId: "automation.living_room_presence_lighting",
    motionEntityId: "binary_sensor.living_room_presence",
    partyEntityId: "input_boolean.living_room_party_mode"
  },
  {
    key: "kitchen",
    name: "Kitchen",
    automationEntityId: "automation.kitchen_presence_lighting",
    motionEntityId: "binary_sensor.kitchen_presence",
    partyEntityId: "input_boolean.kitchen_party_mode"
  },
  {
    key: "office",
    name: "Office",
    automationEntityId: "automation.office_presence_lighting",
    motionEntityId: "binary_sensor.office_presence",
    partyEntityId: ""
  }
];
const HOUSE_GUEST_MODE_CARD = {
  key: "guest_override",
  name: "Gæster",
  entityId: "input_boolean.house_mode_guest_override"
};
const DEMO_CONFIG = {
  haUrl: "/ha",
  theme: "ember",
  themeMode: "dark",
  authMode: "manual",
  token: "",
  oauthAccessToken: "",
  oauthRefreshToken: "",
  oauthExpiresAt: 0,
  oauthClientId: "",
  refreshInterval: 15,
  entities: [
    "sensor.energy_price",
    "sensor.living_room_temperature",
    "sensor.living_room_humidity",
    "sensor.kitchen_temperature",
    "sensor.bedroom_temperature",
    "binary_sensor.windows",
    "binary_sensor.garage_door",
    "sensor.heating_savings_total"
  ],
  cameras: [
    { name: "Front door", entityId: "camera.front_door" },
    { name: "Front yard", entityId: "camera.front_yard" },
    { name: "Carport", entityId: "camera.carport" },
    { name: "Back yard", entityId: "camera.back_yard" },
    { name: "Side", entityId: "camera.side_path" },
    { name: "Driveway", entityId: "camera.driveway" },
    { name: "Terrace", entityId: "camera.terrace" },
    { name: "South terrace", entityId: "camera.south_terrace" },
    { name: "Play area", entityId: "camera.play_area" },
    { name: "Play zone", entityId: "camera.play_zone" },
    { name: "Bagdør", entityId: "camera.back_door" }
  ],
  dashboard: {
    coreEntities: {
      featuredCamera: DEFAULT_FEATURED_CAMERA_ENTITY_ID,
      weather: WEATHER_ENTITY_ID,
      power: POWER_ENTITY_ID,
      price: PRICE_ENTITY_ID,
      priceForecast: PRICE_FORECAST_ENTITY_ID,
      priceTomorrowAvailable: PRICE_TOMORROW_AVAILABILITY_ENTITY_ID
    },
    utilities: UTILITY_VIEW_CONFIG,
    acClimateEntityIds: AC_CLIMATE_ENTITY_IDS,
    wasteCollectionSensors: WASTE_COLLECTION_SENSORS,
    kioskEntities: KIOSK_ENTITY_IDS,
    vehicleEntities: {
      battery: "sensor.vehicle_battery",
      range: "sensor.vehicle_range",
      chargeStart: "sensor.vehicle_charge_start_text",
      chargeEnd: "sensor.vehicle_charge_end_text",
      chargeEndFallback: "sensor.vehicle_charge_end",
      chargePrice: "sensor.vehicle_charge_price",
      chargePriceFallback: "sensor.vehicle_charge_price_fallback",
      summary: "sensor.vehicle_charging_summary",
      status: "sensor.vehicle_status"
    },
    roomDefinitions: EXPECTED_ROOM_DEFINITIONS,
    roomPopupConfigs: {}
  }
};

const state = {
  activeDetectionCameraId: null,
  calendarEvents: [],
  calendarView: "upcoming",
  cameraEventTimestamps: new Map(),
  cameraRefreshInFlight: new Set(),
  config: loadConfig(),
  cameraEntities: new Map(),
  cameraPrewarmLayer: null,
  lastAllStates: [],
  lastSceneData: {
    weatherEntity: null,
    powerEntity: null,
    priceEntity: null,
    priceForecastEntity: null,
    vehicleData: null,
    securityData: null
  },
  weatherForecasts: {
    daily: [],
    hourly: [],
    fetchedAt: 0
  },
  mailPopupDragPointerId: null,
  mailPopupDragCarousel: null,
  mailPopupDragStartX: 0,
  mailPopupScrollStartLeft: 0,
  prewarmedCameraFrames: new Map(),
  cachedCameraSnapshotUrls: new Map(),
  detectionEntities: new Map(),
  dragMoved: false,
  dragPointerId: null,
  dragStartScrollLeft: 0,
  dragStartX: 0,
  cameraRowResetTimerId: null,
  featuredRefreshTimerId: null,
  imageRefreshTimerId: null,
  modalRefreshTimerId: null,
  modalCameraEntityId: "",
  utilityView: "electric",
  powerHistorySeries: [],
  powerMiniSignature: "",
  priceDragStartX: null,
  priceChartSignature: "",
  priceFutureIndex: 0,
  priceView: "today",
  renderedCameraSignature: "",
  weatherModalView: "day",
  acStatsView: "control",
  radiatorStatsView: "control",
  climateHistoryCache: new Map(),
  climateHistoryInFlight: new Map(),
  activeRoomKey: "",
  activeHouseModeKey: "",
  roomCards: [],
  roomModalView: "lights",
  roomRenderSignature: "",
  timerId: null,
  connectionTestInFlight: false,
  authStatusMessage: "",
  dashboardRefreshInFlight: false,
  lastPowerHistoryFetchAt: 0,
  lastPowerHistoryView: "",
  lastPowerHistoryEntityId: ""
};

loadCameraPosterCache();

const elements = {
  cameraCount: document.getElementById("cameraCount"),
  cameraGrid: document.getElementById("cameraGrid"),
  cameraModal: document.getElementById("cameraModal"),
  cameraModalTitle: document.getElementById("cameraModalTitle"),
  cameraModalViewport: document.getElementById("cameraModalViewport"),
  calendarDetailsButton: document.getElementById("calendarDetailsButton"),
  calendarModal: document.getElementById("calendarModal"),
  calendarModalBody: document.getElementById("calendarModalBody"),
  calendarModalTitle: document.getElementById("calendarModalTitle"),
  cameraTemplate: document.getElementById("cameraCardTemplate"),
  camerasInput: document.getElementById("camerasInput"),
  acClimateEntitiesInput: document.getElementById("acClimateEntitiesInput"),
  closeCalendarModalButton: document.getElementById("closeCalendarModalButton"),
  closeCameraModalButton: document.getElementById("closeCameraModalButton"),
  closeHouseModesModalButton: document.getElementById("closeHouseModesModalButton"),
  closeRoomModalButton: document.getElementById("closeRoomModalButton"),
  closeSecurityModalButton: document.getElementById("closeSecurityModalButton"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  closeVehicleModalButton: document.getElementById("closeVehicleModalButton"),
  closeTechniqueModalButton: document.getElementById("closeTechniqueModalButton"),
  closeWeatherModalButton: document.getElementById("closeWeatherModalButton"),
  connectionBadge: document.getElementById("connectionBadge"),
  coreEntitiesInput: document.getElementById("coreEntitiesInput"),
  currentDate: document.getElementById("currentDate"),
  currentTime: document.getElementById("currentTime"),
  entitiesInput: document.getElementById("entitiesInput"),
  entityCount: document.getElementById("entityCount"),
  entityGrid: document.getElementById("entityGrid"),
  entityPickerSelect: document.getElementById("entityPickerSelect"),
  featuredCameraWrap: document.getElementById("featuredCameraWrap"),
  haUrlInput: document.getElementById("haUrlInput"),
  authStatusText: document.getElementById("authStatusText"),
  houseModesButton: document.getElementById("houseModesButton"),
  houseModesModal: document.getElementById("houseModesModal"),
  houseModesModalBody: document.getElementById("houseModesModalBody"),
  lastUpdated: document.getElementById("lastUpdated"),
  loginWithHaButton: document.getElementById("loginWithHaButton"),
  logoutHaButton: document.getElementById("logoutHaButton"),
  mailCard: document.getElementById("mailCard"),
  mailClearButton: document.getElementById("mailClearButton"),
  mailMeta: document.getElementById("mailMeta"),
  mailMeter: document.getElementById("mailMeter"),
  mailState: document.getElementById("mailState"),
  powerNowMeta: document.getElementById("powerNowMeta"),
  powerMiniCaption: document.getElementById("powerMiniCaption"),
  powerMiniChart: document.getElementById("powerMiniChart"),
  powerNowValue: document.getElementById("powerNowValue"),
  utilityNowLabel: document.getElementById("utilityNowLabel"),
  utilityElectricButton: document.getElementById("utilityElectricButton"),
  utilityHeatButton: document.getElementById("utilityHeatButton"),
  utilityWaterButton: document.getElementById("utilityWaterButton"),
  priceChart: document.getElementById("priceChart"),
  priceChartCaption: document.getElementById("priceChartCaption"),
  priceCard: document.querySelector(".price-card"),
  priceDayPager: document.getElementById("priceDayPager"),
  priceFutureButton: document.getElementById("priceFutureButton"),
  pricePrimaryMeta: document.getElementById("pricePrimaryMeta"),
  pricePrimaryValue: document.getElementById("pricePrimaryValue"),
  priceTodayButton: document.getElementById("priceTodayButton"),
  priceTomorrowButton: document.getElementById("priceTomorrowButton"),
  refreshButton: document.getElementById("refreshButton"),
  refreshIntervalInput: document.getElementById("refreshIntervalInput"),
  resetButton: document.getElementById("resetButton"),
  roomDefinitionsInput: document.getElementById("roomDefinitionsInput"),
  roomPopupConfigsInput: document.getElementById("roomPopupConfigsInput"),
  roomModal: document.getElementById("roomModal"),
  roomModalBody: document.getElementById("roomModalBody"),
  roomModalTitle: document.getElementById("roomModalTitle"),
  roomTemplate: document.getElementById("roomCardTemplate"),
  settingsButton: document.getElementById("settingsButton"),
  settingsFeedback: document.getElementById("settingsFeedback"),
  settingsFeedbackBody: document.getElementById("settingsFeedbackBody"),
  settingsFeedbackTitle: document.getElementById("settingsFeedbackTitle"),
  settingsForm: document.getElementById("settingsForm"),
  settingsPanel: document.getElementById("settingsPanel"),
  securityAlarmMeta: document.getElementById("securityAlarmMeta"),
  securityAlarmState: document.getElementById("securityAlarmState"),
  securityCard: document.getElementById("securityCard"),
  securityDetailsButton: document.getElementById("securityDetailsButton") || document.getElementById("securityCard"),
  securityLockList: document.getElementById("securityLockList"),
  securityModal: document.getElementById("securityModal"),
  securityModalBody: document.getElementById("securityModalBody"),
  securityModalTitle: document.getElementById("securityModalTitle"),
  suggestEntitiesButton: document.getElementById("suggestEntitiesButton"),
  systemStatus: document.getElementById("systemStatus"),
  testConnectionButton: document.getElementById("testConnectionButton"),
  themeModeButton: document.getElementById("themeModeButton"),
  themeInput: document.getElementById("themeInput"),
  vehicleBatteryMeta: document.getElementById("vehicleBatteryMeta"),
  vehicleChargePlan: document.getElementById("vehicleChargePlan"),
  vehicleBatteryValue: document.getElementById("vehicleBatteryValue"),
  vehicleDetailsButton: document.getElementById("vehicleDetailsButton"),
  vehicleModal: document.getElementById("vehicleModal"),
  vehicleModalBody: document.getElementById("vehicleModalBody"),
  vehicleModalTitle: document.getElementById("vehicleModalTitle"),
  techniqueButton: document.getElementById("techniqueButton"),
  techniqueKioskStatus: document.getElementById("techniqueKioskStatus"),
  techniqueModal: document.getElementById("techniqueModal"),
  kioskPanel: document.getElementById("kioskPanel"),
  techniqueThemeGrid: document.getElementById("techniqueThemeGrid"),
  vehicleInput: document.getElementById("vehicleInput"),
  tokenInput: document.getElementById("tokenInput"),
  kioskInput: document.getElementById("kioskInput"),
  utilitiesInput: document.getElementById("utilitiesInput"),
  useTokenButton: document.getElementById("useTokenButton"),
  wasteSensorsInput: document.getElementById("wasteSensorsInput"),
  weatherCard: document.getElementById("weatherCard"),
  weatherDetailsButton: document.getElementById("weatherDetailsButton"),
  weatherForecast: document.getElementById("weatherForecast"),
  weatherHeroIcon: document.getElementById("weatherHeroIcon"),
  weatherMeta: document.getElementById("weatherMeta"),
  weatherModal: document.getElementById("weatherModal"),
  weatherModalBody: document.getElementById("weatherModalBody"),
  weatherModalTitle: document.getElementById("weatherModalTitle"),
  weatherStateValue: document.getElementById("weatherStateValue")
};

bindEvents();
initCameraPrewarmLayer();
applyTheme();
renderSettings();
renderCameras();
renderPlaceholderEntities();
renderClock();
startClockLoop();
startRefreshLoop();
bootstrapApp();

function isMobileLayout() {
  return document.documentElement.dataset.layout === "mobile";
}

async function bootstrapApp() {
  const authResult = await handleHomeAssistantAuthCallback();
  if (authResult && authResult.message) {
    state.authStatusMessage = authResult.message;
    renderSettings();
  }
  await refreshDashboard();
}

function bindEvents() {
  elements.calendarDetailsButton.addEventListener("click", openCalendarModal);
  elements.closeCalendarModalButton.addEventListener("click", closeCalendarModal);
  elements.houseModesButton.addEventListener("click", openHouseModesModal);
  elements.closeHouseModesModalButton.addEventListener("click", closeHouseModesModal);
  elements.techniqueButton.addEventListener("click", openTechniqueModal);
  document.getElementById("heatingSummaryBadge")?.addEventListener("click", openAcStatsModal);
  document.getElementById("closeAcStatsModalButton")?.addEventListener("click", closeAcStatsModal);
  document.getElementById("acStatsModalBody")?.addEventListener("click", handleClimateStatsModalClick);
  document.getElementById("radiatorStatsButton")?.addEventListener("click", openRadiatorStatsModal);
  document.getElementById("closeRadiatorStatsModalButton")?.addEventListener("click", closeRadiatorStatsModal);
  document.getElementById("radiatorStatsModalBody")?.addEventListener("click", handleClimateStatsModalClick);
  document.getElementById("wasteSummaryButton")?.addEventListener("click", openWasteInfoModal);
  document.getElementById("closeWasteInfoModalButton")?.addEventListener("click", closeWasteInfoModal);
  elements.settingsButton.addEventListener("click", handleTechniqueSettingsClick);
  elements.closeCameraModalButton.addEventListener("click", closeCameraModal);
  elements.closeRoomModalButton.addEventListener("click", closeRoomModal);
  elements.closeSecurityModalButton.addEventListener("click", closeSecurityModal);
  elements.closeSettingsButton.addEventListener("click", closeSettings);
  elements.closeVehicleModalButton.addEventListener("click", closeVehicleModal);
  elements.closeTechniqueModalButton.addEventListener("click", closeTechniqueModal);
  elements.closeWeatherModalButton.addEventListener("click", closeWeatherModal);
  elements.loginWithHaButton.addEventListener("click", startHomeAssistantLoginFromSettings);
  elements.logoutHaButton.addEventListener("click", logoutHomeAssistantSession);
  elements.refreshButton.addEventListener("click", handleTechniqueRefreshClick);
  elements.priceTodayButton.addEventListener("click", () => setPriceView("today"));
  elements.priceTomorrowButton.addEventListener("click", () => setPriceView("tomorrow"));
  elements.priceFutureButton.addEventListener("click", () => setPriceView("future"));
  [elements.utilityElectricButton, elements.utilityHeatButton, elements.utilityWaterButton].forEach((button) => {
    if (!button) {
      return;
    }
    button.addEventListener("click", () => setUtilityView(button.dataset.utilityView));
  });
  elements.resetButton.addEventListener("click", resetToDemoConfig);
  elements.testConnectionButton.addEventListener("click", testConnectionFromSettings);
  if (elements.themeModeButton) {
    elements.themeModeButton.addEventListener("click", cycleThemeMode);
  }
  elements.themeInput.addEventListener("change", () => applyTheme(elements.themeInput.value));
  if (elements.techniqueThemeGrid) {
    elements.techniqueThemeGrid.addEventListener("click", handleTechniqueThemeClick);
  }
  if (elements.techniqueModal) {
    elements.techniqueModal.addEventListener("click", handleTechniqueModalClick);
  }
  if (elements.securityCard) {
    elements.securityCard.addEventListener("click", handleSecurityCardClick);
    elements.securityCard.addEventListener("keydown", handleSecurityCardKeydown);
  }
  if (elements.securityDetailsButton) {
    elements.securityDetailsButton.addEventListener("click", openSecurityModal);
  }
  elements.securityLockList.addEventListener("click", handleSecuritySummaryClick);
  elements.mailCard.addEventListener("click", handleMailCardClick);
  elements.mailCard.addEventListener("keydown", handleMailCardKeydown);
  elements.mailClearButton.addEventListener("click", handleMailClearClick);
  elements.vehicleDetailsButton.addEventListener("click", openVehicleModal);
  elements.suggestEntitiesButton.addEventListener("click", suggestEntitiesFromHomeAssistant);
  elements.settingsForm.addEventListener("submit", handleSettingsSave);
  elements.useTokenButton.addEventListener("click", activateManualTokenMode);
  elements.weatherDetailsButton.addEventListener("click", openWeatherModal);
  elements.weatherModalBody.addEventListener("click", handleWeatherModalClick);
  elements.calendarModalBody.addEventListener("click", handleCalendarModalClick);
  elements.roomModalBody.addEventListener("click", handleRoomModalClick);
  elements.houseModesModalBody.addEventListener("click", handleHouseModesClick);
  elements.securityModalBody.addEventListener("click", handleSecurityModalClick);
  elements.securityModalBody.addEventListener("pointerdown", handleMailPopupPointerDown);
  elements.securityModalBody.addEventListener("pointermove", handleMailPopupPointerMove);
  elements.securityModalBody.addEventListener("pointerup", handleMailPopupPointerUp);
  elements.securityModalBody.addEventListener("pointercancel", handleMailPopupPointerUp);
  elements.securityModalBody.addEventListener("pointerleave", handleMailPopupPointerUp);
  elements.entityGrid.addEventListener("click", handleRoomGridClick);
  elements.entityGrid.addEventListener("keydown", handleRoomGridKeydown);
  elements.settingsForm.addEventListener("click", handleSettingsEntityPickerClick);
  bindPriceChartSwipe();
  bindCameraRowDrag();
  scheduleCameraRowReset();
  document.addEventListener("keydown", handleGlobalKeydown);
  elements.settingsPanel.addEventListener("click", (event) => {
    if (event.target === elements.settingsPanel) {
      closeSettings();
    }
  });
  elements.cameraModal.addEventListener("click", (event) => {
    if (event.target === elements.cameraModal) {
      closeCameraModal();
    }
  });
  elements.weatherModal.addEventListener("click", (event) => {
    if (event.target === elements.weatherModal) {
      closeWeatherModal();
    }
  });
  elements.houseModesModal.addEventListener("click", (event) => {
    if (event.target === elements.houseModesModal) {
      closeHouseModesModal();
    }
  });
  elements.roomModal.addEventListener("click", (event) => {
    if (event.target === elements.roomModal) {
      closeRoomModal();
    }
  });
  elements.vehicleModal.addEventListener("click", (event) => {
    if (event.target === elements.vehicleModal) {
      closeVehicleModal();
    }
  });
  elements.techniqueModal.addEventListener("click", (event) => {
    if (event.target === elements.techniqueModal) {
      closeTechniqueModal();
    }
  });
  elements.calendarModal.addEventListener("click", (event) => {
    if (event.target === elements.calendarModal) {
      closeCalendarModal();
    }
  });
  elements.securityModal.addEventListener("click", (event) => {
    if (event.target === elements.securityModal) {
      closeSecurityModal();
    }
  });
}

function scheduleCameraRowReset() {
  if (state.cameraRowResetTimerId) {
    clearTimeout(state.cameraRowResetTimerId);
  }

  state.cameraRowResetTimerId = window.setTimeout(() => {
    if (state.dragPointerId || !elements.cameraGrid) {
      scheduleCameraRowReset();
      return;
    }

    elements.cameraGrid.scrollTo({
      left: 0,
      behavior: "smooth"
    });
  }, 120000);
}

function handleSecuritySummaryClick(event) {
  const trigger = event.target.closest(".security-lock-chip");
  if (!trigger) {
    return;
  }

  openSecurityModal();
}

function handleMailCardClick(event) {
  if (event.target.closest("#mailClearButton")) {
    return;
  }
  openMailModal();
}

function handleMailCardKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  openMailModal();
}

async function setUtilityView(view) {
  if (!getUtilityConfigMap()[view] || state.utilityView === view) {
    return;
  }

  state.utilityView = view;
  state.powerMiniSignature = "";
  state.powerHistorySeries = [];
  state.lastPowerHistoryFetchAt = 0;
  renderUtilityToggleState();
  await refreshDashboard();
}

function renderUtilityToggleState() {
  [
    [elements.utilityElectricButton, "electric"],
    [elements.utilityHeatButton, "heat"],
    [elements.utilityWaterButton, "water"]
  ].forEach(([button, view]) => {
    if (!button) {
      return;
    }
    const active = state.utilityView === view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function handleMailPopupPointerDown(event) {
  const carousel = event.target.closest(".mail-popup-carousel");
  if (!carousel) {
    return;
  }

  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  state.mailPopupDragPointerId = event.pointerId;
  state.mailPopupDragCarousel = carousel;
  state.mailPopupDragStartX = event.clientX;
  state.mailPopupScrollStartLeft = carousel.scrollLeft;
  carousel.classList.add("dragging");
  event.preventDefault();
  carousel.setPointerCapture(event.pointerId);
}

function handleMailPopupPointerMove(event) {
  if (state.mailPopupDragPointerId !== event.pointerId) {
    return;
  }

  const carousel = state.mailPopupDragCarousel;
  if (!carousel) {
    return;
  }

  const deltaX = event.clientX - state.mailPopupDragStartX;
  carousel.scrollLeft = state.mailPopupScrollStartLeft - deltaX;
  event.preventDefault();
}

function handleMailPopupPointerUp(event) {
  if (state.mailPopupDragPointerId !== event.pointerId) {
    return;
  }

  const carousel = state.mailPopupDragCarousel;
  if (carousel) {
    carousel.classList.remove("dragging");
    try {
      carousel.releasePointerCapture(event.pointerId);
    } catch (error) {
      /* noop */
    }
  }

  state.mailPopupDragPointerId = null;
  state.mailPopupDragCarousel = null;
}

function handleSecurityCardClick(event) {
  openSecurityModal();
}

function handleSecurityCardKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  openSecurityModal();
}

async function handleMailClearClick(event) {
  event.stopPropagation();
  try {
    await toggleEntityFromModal("input_boolean.mail_present");
    await refreshDashboard();
  } catch (error) {
    console.error(error);
  }
}

function bindCameraRowDrag() {
  const openCameraFromPointer = (event) => {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const card = target ? target.closest(".camera-card") : null;
    if (!card) {
      return;
    }

    const index = Number(card.dataset.cameraIndex);
    const camera = state.config.cameras[index];
    if (camera) {
      openCameraModal(camera);
    }
  };

  elements.cameraGrid.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button, a")) {
      return;
    }
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    state.dragMoved = false;
    state.dragPointerId = event.pointerId;
    state.dragStartX = event.clientX;
    state.dragStartScrollLeft = elements.cameraGrid.scrollLeft;
    elements.cameraGrid.classList.add("dragging");
    elements.cameraGrid.setPointerCapture(event.pointerId);
    scheduleCameraRowReset();
  });

  elements.cameraGrid.addEventListener("pointermove", (event) => {
    if (state.dragPointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - state.dragStartX;
    if (Math.abs(deltaX) > 6) {
      state.dragMoved = true;
    }
    elements.cameraGrid.scrollLeft = state.dragStartScrollLeft - deltaX;
    scheduleCameraRowReset();
  });

  const stopDragging = (event) => {
    if (state.dragPointerId !== event.pointerId) {
      return;
    }

    const shouldOpenCamera = !state.dragMoved;
    elements.cameraGrid.classList.remove("dragging");
    try {
      elements.cameraGrid.releasePointerCapture(event.pointerId);
    } catch (error) {
    }
    state.dragPointerId = null;

    if (shouldOpenCamera) {
      openCameraFromPointer(event);
    }

    window.setTimeout(() => {
      state.dragMoved = false;
    }, 0);
    scheduleCameraRowReset();
  };

  elements.cameraGrid.addEventListener("pointerup", stopDragging);
  elements.cameraGrid.addEventListener("pointercancel", stopDragging);
  elements.cameraGrid.addEventListener("pointerleave", stopDragging);
  elements.cameraGrid.addEventListener("scroll", () => {
    scheduleCameraRowReset();
    updateActiveCameraCards();
  }, { passive: true });
  elements.cameraGrid.addEventListener("wheel", () => {
    scheduleCameraRowReset();
    window.requestAnimationFrame(() => updateActiveCameraCards());
  }, { passive: true });
  elements.cameraGrid.addEventListener("click", (event) => {
    if (state.dragMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
    scheduleCameraRowReset();
  }, true);
  window.addEventListener("resize", () => {
    window.requestAnimationFrame(() => updateActiveCameraCards());
  });
}

function bindPriceChartSwipe() {
  elements.priceChart.addEventListener("pointerdown", (event) => {
    if (state.priceView !== "future") {
      return;
    }

    state.priceDragStartX = event.clientX;
  });

  elements.priceChart.addEventListener("pointerup", (event) => {
    if (state.priceView !== "future" || state.priceDragStartX === null) {
      return;
    }

    const deltaX = event.clientX - state.priceDragStartX;
    state.priceDragStartX = null;
    if (Math.abs(deltaX) < 46) {
      return;
    }

    stepFuturePriceDay(deltaX < 0 ? 1 : -1);
  });

  elements.priceChart.addEventListener("pointerleave", () => {
    state.priceDragStartX = null;
  });

  elements.priceChart.addEventListener("pointercancel", () => {
    state.priceDragStartX = null;
  });
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return normalizeConfig(DEMO_CONFIG);
    }
    return normalizeConfig(JSON.parse(raw));
  } catch (error) {
    console.warn("Falling back to demo config", error);
    return normalizeConfig(DEMO_CONFIG);
  }
}

function normalizeConfig(input) {
  const source = input && typeof input === "object" ? input : {};
  const cameras = Array.isArray(source.cameras)
    ? source.cameras
      .map(normalizeCameraConfig)
      .filter((camera) => camera && (camera.url || camera.entityId))
      .filter(shouldIncludeCamera)
    : [...DEMO_CONFIG.cameras];
  const rawTheme = String(source.theme || "").trim();
  const normalizedTheme = AVAILABLE_THEMES.includes(rawTheme) ? rawTheme : DEMO_CONFIG.theme;
  const inferredThemeMode = DARK_THEME_BY_LIGHT_THEME[normalizedTheme] ? "light" : "";
  const themeMode = THEME_MODE_OPTIONS.includes(String(source.themeMode || "").trim())
    ? String(source.themeMode).trim()
    : (inferredThemeMode || DEMO_CONFIG.themeMode);

  return {
    haUrl: typeof source.haUrl === "string" ? source.haUrl.trim() : DEMO_CONFIG.haUrl,
    theme: getBaseThemeName(normalizedTheme),
    themeMode,
    authMode: source.authMode === "ha-user" ? "ha-user" : "manual",
    token: source.token || "",
    oauthAccessToken: source.oauthAccessToken || "",
    oauthRefreshToken: source.oauthRefreshToken || "",
    oauthExpiresAt: Number(source.oauthExpiresAt || 0),
    oauthClientId: source.oauthClientId || "",
    refreshInterval: Number(source.refreshInterval || DEMO_CONFIG.refreshInterval),
    entities: Array.isArray(source.entities) ? source.entities.filter(Boolean) : [...DEMO_CONFIG.entities],
    cameras: sortCamerasByPriority(cameras),
    dashboard: normalizeDashboardConfig(source.dashboard)
  };
}

function clonePlainObject(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function normalizeEntityId(value) {
  return String(value || "").trim();
}

function normalizeEntityIdList(value, fallback = []) {
  const source = Array.isArray(value) ? value : fallback;
  return source
    .map((entry) => normalizeEntityId(entry))
    .filter(Boolean);
}

function normalizeDashboardConfig(input = {}) {
  const fallback = DEMO_CONFIG.dashboard || {};
  return {
    coreEntities: {
      ...clonePlainObject(fallback.coreEntities),
      ...clonePlainObject(input.coreEntities)
    },
    utilities: normalizeUtilityConfigMap(input.utilities, fallback.utilities),
    acClimateEntityIds: normalizeEntityIdList(input.acClimateEntityIds, fallback.acClimateEntityIds),
    wasteCollectionSensors: normalizeEntityIdList(input.wasteCollectionSensors, fallback.wasteCollectionSensors),
    kioskEntities: {
      ...clonePlainObject(fallback.kioskEntities),
      ...clonePlainObject(input.kioskEntities)
    },
    vehicleEntities: {
      ...clonePlainObject(fallback.vehicleEntities),
      ...clonePlainObject(input.vehicleEntities)
    },
    roomDefinitions: normalizeRoomDefinitionConfig(input.roomDefinitions, fallback.roomDefinitions),
    roomPopupConfigs: clonePlainObject(input.roomPopupConfigs)
  };
}

function normalizeUtilityConfigMap(input = {}, fallback = {}) {
  const normalized = clonePlainObject(fallback);
  Object.entries(input || {}).forEach(([key, value]) => {
    if (!value || typeof value !== "object") {
      return;
    }
    normalized[key] = {
      ...(normalized[key] || {}),
      ...value
    };
  });
  return normalized;
}

function normalizeRoomDefinitionConfig(input, fallback = []) {
  const source = Array.isArray(input) && input.length ? input : fallback;
  return source
    .map((room, index) => ({
      key: normalizeEntityId(room && room.key),
      label: normalizeEntityId(room && (room.label || room.name)),
      aliases: Array.isArray(room && room.aliases) ? room.aliases.map((alias) => String(alias).trim()).filter(Boolean) : [],
      order: Number.isFinite(Number(room && room.order)) ? Number(room.order) : index
    }))
    .filter((room) => room.key && room.label);
}

function getDashboardConfig() {
  return (state.config && state.config.dashboard) || normalizeDashboardConfig();
}

function getCoreEntityId(key, fallback = "") {
  const coreEntities = getDashboardConfig().coreEntities || {};
  return normalizeEntityId(coreEntities[key]) || fallback;
}

function getUtilityConfigMap() {
  return getDashboardConfig().utilities || UTILITY_VIEW_CONFIG;
}

function getAcClimateEntityIds() {
  return normalizeEntityIdList(getDashboardConfig().acClimateEntityIds, AC_CLIMATE_ENTITY_IDS);
}

function getWasteCollectionSensors() {
  return normalizeEntityIdList(getDashboardConfig().wasteCollectionSensors, WASTE_COLLECTION_SENSORS);
}

function getKioskEntityIds() {
  return getDashboardConfig().kioskEntities || KIOSK_ENTITY_IDS;
}

function getVehicleEntityMap() {
  return getDashboardConfig().vehicleEntities || {};
}

function getConfiguredRoomDefinitions() {
  return normalizeRoomDefinitionConfig(getDashboardConfig().roomDefinitions, EXPECTED_ROOM_DEFINITIONS);
}

function getRoomDefinitionsForDashboard() {
  const configuredRooms = getConfiguredRoomDefinitions();
  const fallbackByKey = new Map((typeof ROOM_DEFINITIONS === "undefined" ? [] : ROOM_DEFINITIONS).map((room) => [room.key, room]));
  return configuredRooms.map((room) => ({
    ...(fallbackByKey.get(room.key) || {}),
    ...room,
    aliases: room.aliases && room.aliases.length
      ? room.aliases
      : ((fallbackByKey.get(room.key) && fallbackByKey.get(room.key).aliases) || [room.key, room.label])
  }));
}

function getRoomPopupConfigMap() {
  return {
    ...(typeof ROOM_POPUP_CONFIGS === "undefined" ? {} : ROOM_POPUP_CONFIGS),
    ...(getDashboardConfig().roomPopupConfigs || {})
  };
}

function shouldIncludeCamera(camera) {
  if (!camera) {
    return false;
  }

  const source = `${camera.name || ""} ${camera.entityId || ""} ${camera.url || ""}`.toLowerCase();
  return !/3d[_\s-]*printer|laser/.test(source);
}

function normalizeCameraConfig(camera) {
  if (!camera) {
    return null;
  }

  const rawName = typeof camera.name === "string" ? camera.name.trim() : "Camera";
  const rawEntityId = typeof camera.entityId === "string" ? camera.entityId.trim() : "";
  const rawUrl = typeof camera.url === "string" ? camera.url.trim() : "";
  const inferredEntityId = rawEntityId || inferCameraEntityId(rawUrl);

  if (inferredEntityId) {
    return { name: rawName, entityId: canonicalizeCameraEntityId(inferredEntityId) };
  }

  if (rawUrl) {
    return { name: rawName, url: rawUrl };
  }

  return null;
}

function sortCamerasByPriority(cameras) {
  return [...cameras].sort((left, right) => {
    const leftPriority = getCameraPriorityIndex(left);
    const rightPriority = getCameraPriorityIndex(right);
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return getCameraDisplayName(left).localeCompare(getCameraDisplayName(right), "da-DK");
  });
}

function getCameraPriorityIndex(camera) {
  const source = String(camera.entityId || camera.url || camera.name || "").toLowerCase();
  const matchIndex = CAMERA_PRIORITY_ORDER.findIndex((token) => source.includes(token));
  return matchIndex === -1 ? CAMERA_PRIORITY_ORDER.length + 1 : matchIndex;
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
}

function loadCameraPosterCache() {
  try {
    const raw = sessionStorage.getItem(CAMERA_POSTER_CACHE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);
    Object.entries(parsed || {}).forEach(([key, value]) => {
      if (key && typeof value === "string") {
        state.cachedCameraSnapshotUrls.set(key, value);
      }
    });
  } catch (error) {
  }
}

function saveCameraPosterCache() {
  try {
    const entries = Array.from(state.cachedCameraSnapshotUrls.entries()).slice(-36);
    sessionStorage.setItem(CAMERA_POSTER_CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch (error) {
  }
}

function renderSettings() {
  elements.haUrlInput.value = state.config.haUrl;
  elements.tokenInput.value = state.config.token;
  elements.refreshIntervalInput.value = String(state.config.refreshInterval);
  elements.themeInput.value = state.config.theme || DEMO_CONFIG.theme;
  elements.entitiesInput.value = state.config.entities.join("\n");
  elements.camerasInput.value = state.config.cameras
    .map((camera) => `${camera.name}|${camera.entityId || camera.url}`)
    .join("\n");
  renderAdvancedEntitySettings();
  updateAuthStatus();
  renderThemeModeButton();
  renderTechniqueModal();
}

function renderAdvancedEntitySettings() {
  const dashboardConfig = getDashboardConfig();
  setOptionalInputValue(elements.coreEntitiesInput, formatKeyValueLines(dashboardConfig.coreEntities));
  setOptionalInputValue(elements.utilitiesInput, formatJsonForSettings(dashboardConfig.utilities));
  setOptionalInputValue(elements.wasteSensorsInput, (dashboardConfig.wasteCollectionSensors || []).join("\n"));
  setOptionalInputValue(elements.acClimateEntitiesInput, (dashboardConfig.acClimateEntityIds || []).join("\n"));
  setOptionalInputValue(elements.kioskInput, formatJsonForSettings(dashboardConfig.kioskEntities));
  setOptionalInputValue(elements.vehicleInput, formatJsonForSettings(dashboardConfig.vehicleEntities));
  setOptionalInputValue(elements.roomDefinitionsInput, formatJsonForSettings(dashboardConfig.roomDefinitions));
  setOptionalInputValue(elements.roomPopupConfigsInput, formatJsonForSettings(dashboardConfig.roomPopupConfigs));
  renderEntityPickerOptions(state.lastAllStates);
}

function renderEntityPickerOptions(allStates = []) {
  if (!elements.entityPickerSelect) {
    return;
  }
  const previousValue = elements.entityPickerSelect.value;
  const options = Array.isArray(allStates) && allStates.length
    ? allStates
      .slice()
      .sort((left, right) => left.entity_id.localeCompare(right.entity_id))
      .map((entity) => {
        const option = document.createElement("option");
        option.value = entity.entity_id;
        option.textContent = `${entity.entity_id} — ${getFriendlyName(entity)}`;
        option.dataset.domain = entity.entity_id.split(".")[0] || "";
        return option;
      })
    : [];
  elements.entityPickerSelect.replaceChildren();
  if (!options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Connect to Home Assistant and press Test/Suggest";
    elements.entityPickerSelect.appendChild(option);
    return;
  }
  options.forEach((option) => elements.entityPickerSelect.appendChild(option));
  if (previousValue && allStates.some((entity) => entity.entity_id === previousValue)) {
    elements.entityPickerSelect.value = previousValue;
  }
}

function setOptionalInputValue(element, value) {
  if (element) {
    element.value = value || "";
  }
}

function formatJsonForSettings(value) {
  return JSON.stringify(value || {}, null, 2);
}

function formatKeyValueLines(value) {
  return Object.entries(value || {})
    .map(([key, entityId]) => `${key}=${entityId || ""}`)
    .join("\n");
}

function parseKeyValueLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((result, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return result;
      }
      const key = line.slice(0, separatorIndex).trim();
      const entityId = line.slice(separatorIndex + 1).trim();
      if (key) {
        result[key] = entityId;
      }
      return result;
    }, {});
}

function parseSettingsJson(value, fallback) {
  const raw = String(value || "").trim();
  if (!raw) {
    return fallback;
  }
  return JSON.parse(raw);
}

function readEntityIdLines(element) {
  return String((element && element.value) || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readAdvancedEntitySettings() {
  const fallback = getDashboardConfig();
  return normalizeDashboardConfig({
    coreEntities: parseKeyValueLines(elements.coreEntitiesInput && elements.coreEntitiesInput.value),
    utilities: parseSettingsJson(elements.utilitiesInput && elements.utilitiesInput.value, fallback.utilities),
    wasteCollectionSensors: readEntityIdLines(elements.wasteSensorsInput),
    acClimateEntityIds: readEntityIdLines(elements.acClimateEntitiesInput),
    kioskEntities: parseSettingsJson(elements.kioskInput && elements.kioskInput.value, fallback.kioskEntities),
    vehicleEntities: parseSettingsJson(elements.vehicleInput && elements.vehicleInput.value, fallback.vehicleEntities),
    roomDefinitions: parseSettingsJson(elements.roomDefinitionsInput && elements.roomDefinitionsInput.value, fallback.roomDefinitions),
    roomPopupConfigs: parseSettingsJson(elements.roomPopupConfigsInput && elements.roomPopupConfigsInput.value, fallback.roomPopupConfigs)
  });
}

function handleSettingsEntityPickerClick(event) {
  const actionButton = event.target.closest("[data-picker-target]");
  if (!actionButton || !elements.entityPickerSelect) {
    return;
  }
  const entityId = elements.entityPickerSelect.value;
  if (!entityId) {
    showSettingsFeedback("error", "No entity selected", "Hent entities med Test/Suggest, og vælg derefter en entity.");
    return;
  }
  addPickedEntityToSettings(entityId, actionButton.dataset.pickerTarget);
}

function appendUniqueLine(element, value, formatter = (entry) => entry) {
  if (!element || !value) {
    return;
  }
  const nextLine = formatter(value);
  const lines = String(element.value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.includes(nextLine)) {
    lines.push(nextLine);
  }
  element.value = lines.join("\n");
}

function updateCoreEntityInput(key, entityId) {
  const current = parseKeyValueLines(elements.coreEntitiesInput && elements.coreEntitiesInput.value);
  current[key] = entityId;
  setOptionalInputValue(elements.coreEntitiesInput, formatKeyValueLines(current));
}

function addPickedEntityToSettings(entityId, target) {
  if (target === "visible") {
    appendUniqueLine(elements.entitiesInput, entityId);
  } else if (target === "weather") {
    updateCoreEntityInput("weather", entityId);
  } else if (target === "power") {
    updateCoreEntityInput("power", entityId);
    let utilities;
    try {
      utilities = parseSettingsJson(elements.utilitiesInput && elements.utilitiesInput.value, getDashboardConfig().utilities);
    } catch (error) {
      showSettingsFeedback("error", "Config error", "Utility JSON skal være gyldig før entity-picker kan opdatere den.");
      return;
    }
    utilities.electric = {
      ...(utilities.electric || {}),
      currentEntityId: entityId,
      historyEntityId: entityId
    };
    setOptionalInputValue(elements.utilitiesInput, formatJsonForSettings(utilities));
  } else if (target === "price") {
    updateCoreEntityInput("price", entityId);
  } else if (target === "camera") {
    const entity = state.lastAllStates.find((candidate) => candidate.entity_id === entityId);
    appendUniqueLine(elements.camerasInput, entityId, () => `${entity ? formatCameraName(entity) : entityId}|${entityId}`);
    updateCoreEntityInput("featuredCamera", entityId);
  } else if (target === "waste") {
    appendUniqueLine(elements.wasteSensorsInput, entityId);
  } else if (target === "climate") {
    appendUniqueLine(elements.acClimateEntitiesInput, entityId);
  }
  showSettingsFeedback("success", "Entity added", `${entityId} blev indsat i ${target}. Husk at trykke Save and load.`);
}

function readConfigFromInputs() {
  const nextConfig = normalizeConfig({
    ...state.config,
    haUrl: elements.haUrlInput.value.trim(),
    token: elements.tokenInput.value.trim(),
    refreshInterval: elements.refreshIntervalInput.value,
    theme: elements.themeInput.value,
    entities: elements.entitiesInput.value.split("\n").map((line) => line.trim()),
    dashboard: readAdvancedEntitySettings(),
    cameras: elements.camerasInput.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|");
        const name = (parts[0] || "Camera").trim();
        const value = (parts[1] || parts[0] || "").trim();
        const inferredEntityId = inferCameraEntityId(value);
        if (inferredEntityId) {
          return { name, entityId: canonicalizeCameraEntityId(inferredEntityId) };
        }
        return { name, url: value };
      })
  });

  if (resolveHomeAssistantBaseUrl(nextConfig.haUrl) !== resolveHomeAssistantBaseUrl(state.config.haUrl)) {
    clearOAuthSession(nextConfig);
    nextConfig.authMode = "manual";
  }

  return nextConfig;
}

async function handleSettingsSave(event) {
  event.preventDefault();
  try {
    state.config = readConfigFromInputs();
  } catch (error) {
    showSettingsFeedback("error", "Config error", error.message || "Tjek JSON-felterne i dashboard mapping.");
    return;
  }

  if (state.config.authMode !== "ha-user" && state.config.token) {
    state.config.authMode = "manual";
  }

  saveConfig();
  applyTheme();
  renderSettings();
  renderCameras();
  startRefreshLoop();
  closeSettings();
  await refreshDashboard();
}

function clearOAuthSession(config) {
  config.oauthAccessToken = "";
  config.oauthRefreshToken = "";
  config.oauthExpiresAt = 0;
  config.oauthClientId = "";
}

function hasManualToken(config) {
  return Boolean(config && String(config.token || "").trim());
}

function hasOAuthSession(config) {
  return Boolean(config && String(config.oauthRefreshToken || config.oauthAccessToken || "").trim());
}

function hasHomeAssistantCredentials(config) {
  if (!config || !config.haUrl) {
    return false;
  }

  if (config.authMode === "ha-user") {
    if (hasOAuthSession(config)) {
      return true;
    }
  }

  return hasManualToken(config) || canUseHomeAssistantProxySession(config);
}

function canUseHomeAssistantProxySession(config) {
  if (!config || typeof config.haUrl !== "string") {
    return false;
  }

  const value = config.haUrl.trim();
  return value === "/ha" || value === "/ha/";
}

function buildHomeAssistantClientId() {
  return `${window.location.origin}${window.location.pathname}`;
}

function buildHomeAssistantRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`;
}

function resolveHomeAssistantAuthorizeBaseUrl(value) {
  const resolved = resolveHomeAssistantBaseUrl(value);
  if (resolved.startsWith("/")) {
    return DIRECT_HOME_ASSISTANT_BASE_URL;
  }
  return resolved;
}

function buildAuthStatusText() {
  if (state.config.authMode === "ha-user" && hasOAuthSession(state.config)) {
    return state.authStatusMessage || "Aktiv metode: Home Assistant-login.";
  }

  if (hasManualToken(state.config)) {
    return hasOAuthSession(state.config)
      ? "Aktiv metode: manuelt token. Gemt Home Assistant-login kan genbruges."
      : "Aktiv metode: manuelt token.";
  }

  return state.authStatusMessage || "Ingen aktiv session endnu.";
}

function updateAuthStatus() {
  if (elements.authStatusText) {
    elements.authStatusText.textContent = buildAuthStatusText();
  }

  if (elements.logoutHaButton) {
    elements.logoutHaButton.disabled = !hasOAuthSession(state.config);
  }
}

function resetToDemoConfig() {
  state.config = normalizeConfig(DEMO_CONFIG);
  saveConfig();
  applyTheme();
  renderSettings();
  renderCameras();
  renderPlaceholderEntities();
  setPendingState("Demo settings restored. Add your Home Assistant details.");
}

function openSettings() {
  closeTechniqueModal();
  document.body.classList.add("modal-open");
  elements.settingsPanel.classList.add("open");
  elements.settingsPanel.setAttribute("aria-hidden", "false");
  if (elements.settingsFeedback.hidden) {
    showSettingsFeedback("pending", "Ready", "Test forbindelsen eller hent forslag direkte fra Home Assistant.");
  }
  window.setTimeout(() => {
    elements.haUrlInput.focus();
    elements.haUrlInput.select();
  }, 0);
}

function applyTheme(themeName = state.config.theme, themeMode = state.config.themeMode) {
  const baseTheme = getBaseThemeName(themeName || state.config.theme || DEMO_CONFIG.theme);
  const resolvedTheme = resolveThemeForMode(baseTheme, themeMode || state.config.themeMode || DEMO_CONFIG.themeMode);
  const previousTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-mode", getEffectiveThemeMode(themeMode || state.config.themeMode || DEMO_CONFIG.themeMode));
  if (resolvedTheme !== previousTheme && elements.techniqueThemeGrid && elements.techniqueModal.classList.contains("open")) {
    renderTechniqueModal();
  }
  renderThemeModeButton();
}

function closeSettings() {
  document.body.classList.remove("modal-open");
  elements.settingsPanel.classList.remove("open");
  elements.settingsPanel.setAttribute("aria-hidden", "true");
}

function handleGlobalKeydown(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (elements.cameraModal.classList.contains("open")) {
    closeCameraModal();
    return;
  }

  if (elements.vehicleModal.classList.contains("open")) {
    closeVehicleModal();
    return;
  }

  if (elements.roomModal.classList.contains("open")) {
    closeRoomModal();
    return;
  }

  if (elements.securityModal.classList.contains("open")) {
    closeSecurityModal();
    return;
  }

  if (elements.calendarModal.classList.contains("open")) {
    closeCalendarModal();
    return;
  }

  if (elements.weatherModal.classList.contains("open")) {
    closeWeatherModal();
    return;
  }

  if (elements.techniqueModal.classList.contains("open")) {
    closeTechniqueModal();
    return;
  }

  if (elements.houseModesModal.classList.contains("open")) {
    closeHouseModesModal();
    return;
  }

  if (elements.settingsPanel.classList.contains("open")) {
    closeSettings();
  }
}

function renderClock() {
  const now = new Date();
  elements.currentTime.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  elements.currentDate.textContent = now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  elements.systemStatus.textContent = formatNextDanishHoliday(now);
  if (state.config.themeMode === "auto") {
    applyTheme();
  }
}

function startClockLoop() {
  window.setInterval(renderClock, 1000);
}

function setPendingState(message) {
  renderSceneOverview(null, null, null);
  renderCompactRoomHeader([]);
}

function setSuccessState(message, entities) {
}

function setErrorState(message) {
  renderSceneOverview(null, null, null);
  renderCompactRoomHeader([]);
}

function renderPlaceholderEntities() {
  renderRooms(buildPlaceholderRooms());
  renderSceneOverview(null, null, null);
  renderCompactRoomHeader([]);
}

function renderEntities(entities) {
  renderRooms(buildRoomCards(entities));
}

function renderRooms(rooms) {
  state.roomCards = rooms;
  const nextSignature = rooms.map((room) => room.key || room.name).join("|");
  const needsFullRender =
    !elements.entityGrid.children.length ||
    elements.entityGrid.children.length !== rooms.length ||
    nextSignature !== state.roomRenderSignature;

  if (needsFullRender) {
    elements.entityGrid.innerHTML = "";
    const fragment = document.createDocumentFragment();

    rooms.forEach((room, index) => {
      const card = elements.roomTemplate.content.firstElementChild.cloneNode(true);
      applyRoomCardData(card, room, index);
      fragment.appendChild(card);
    });

    elements.entityGrid.appendChild(fragment);
    state.roomRenderSignature = nextSignature;
  } else {
    Array.from(elements.entityGrid.children).forEach((card, index) => {
      applyRoomCardData(card, rooms[index], index);
    });
  }

  if (elements.entityCount) {
    elements.entityCount.textContent = String(rooms.length);
  }
}

function setDashboardTheme(themeName) {
  const nextTheme = getBaseThemeName(themeName);
  state.config.theme = nextTheme;
  saveConfig();
  applyTheme();
  if (elements.themeInput) {
    elements.themeInput.value = nextTheme;
  }
  renderTechniqueModal();
}

function setThemeMode(themeMode) {
  const nextMode = THEME_MODE_OPTIONS.includes(String(themeMode || "").trim())
    ? String(themeMode).trim()
    : DEMO_CONFIG.themeMode;
  state.config.themeMode = nextMode;
  state.config.theme = getBaseThemeName(state.config.theme);
  saveConfig();
  applyTheme();
  renderTechniqueModal();
}

function cycleThemeMode() {
  const currentIndex = THEME_MODE_OPTIONS.indexOf(state.config.themeMode);
  const nextMode = THEME_MODE_OPTIONS[(currentIndex + 1) % THEME_MODE_OPTIONS.length] || DEMO_CONFIG.themeMode;
  setThemeMode(nextMode);
}

function renderThemeModeButton() {
  if (!elements.themeModeButton) {
    return;
  }

  const configuredMode = THEME_MODE_OPTIONS.includes(state.config.themeMode) ? state.config.themeMode : DEMO_CONFIG.themeMode;
  const effectiveMode = getEffectiveThemeMode(configuredMode);
  const modeLabel = THEME_MODE_LABELS[configuredMode] || THEME_MODE_LABELS.dark;
  const effectiveLabel = THEME_MODE_LABELS[effectiveMode] || THEME_MODE_LABELS.dark;
  const suffix = configuredMode === "auto" ? ` (${effectiveLabel})` : "";
  elements.themeModeButton.dataset.themeMode = configuredMode;
  elements.themeModeButton.setAttribute("aria-label", `Tema mode: ${modeLabel}${suffix}`);
  elements.themeModeButton.innerHTML = `
    <span class="status-card-icon" aria-hidden="true">${THEME_MODE_ICONS[configuredMode] || THEME_MODE_ICONS.dark}</span>
    <span>${modeLabel}${suffix}</span>
  `;
}

function getBaseThemeName(themeName) {
  const candidate = String(themeName || "").trim();
  if (DARK_THEME_BY_LIGHT_THEME[candidate]) {
    return DARK_THEME_BY_LIGHT_THEME[candidate];
  }
  return LIGHT_THEME_BY_DARK_THEME[candidate] ? candidate : DEMO_CONFIG.theme;
}

function getEffectiveThemeMode(themeMode) {
  const mode = THEME_MODE_OPTIONS.includes(String(themeMode || "").trim())
    ? String(themeMode).trim()
    : DEMO_CONFIG.themeMode;
  if (mode !== "auto") {
    return mode;
  }

  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "light" : "dark";
}

function resolveThemeForMode(themeName, themeMode) {
  const baseTheme = getBaseThemeName(themeName);
  const effectiveMode = getEffectiveThemeMode(themeMode);
  if (effectiveMode === "light") {
    return LIGHT_THEME_BY_DARK_THEME[baseTheme] || baseTheme;
  }
  return baseTheme;
}

function renderCompactRoomHeader(allStates) {
  const lookup = new Map((allStates || []).map((entity) => [entity.entity_id, entity]));
  const acButton = document.getElementById("heatingSummaryBadge");
  const acLabel = document.getElementById("heatingSummaryLabel");
  const acMeta = document.getElementById("heatingSummaryMeta");
  const radiatorButton = document.getElementById("radiatorStatsButton");
  const radiatorLabel = document.getElementById("radiatorStatsLabel");
  const radiatorMeta = document.getElementById("radiatorStatsMeta");
  const wasteButton = document.getElementById("wasteSummaryButton");
  const wasteLabel = document.getElementById("wasteSummaryLabel");
  const wasteMeta = document.getElementById("wasteSummaryMeta");

  const acEntities = getAcClimateEntityIds().map((id) => lookup.get(id)).filter(Boolean);
  const activeAc = acEntities.filter((entity) => isClimateRunning(entity));
  const cooling = activeAc.filter((entity) => String(entity.attributes && entity.attributes.hvac_action || entity.state || "").toLowerCase().includes("cool")).length;
  const heating = activeAc.filter((entity) => String(entity.attributes && entity.attributes.hvac_action || entity.state || "").toLowerCase().includes("heat")).length;
  if (acButton && acLabel && acMeta) {
    acButton.classList.toggle("active", activeAc.length > 0);
    acButton.classList.toggle("idle", activeAc.length === 0);
    acLabel.textContent = "AC";
    const modeLabel = cooling && heating ? `${cooling} køler · ${heating} varmer` : cooling ? "Køler" : heating ? "Heating" : "Rolig";
    acMeta.innerHTML = `<span class="heating-summary-chip ${activeAc.length ? "active" : "idle"}">${activeAc.length}/3 kører</span><span class="heating-summary-chip">${modeLabel}</span>`;
  }

  const radiatorEntities = (allStates || []).filter((entity) => entity && entity.entity_id && entity.entity_id.startsWith("climate.") && entity.attributes && entity.attributes.calibration_balance);
  const activeRadiators = radiatorEntities.filter((entity) => String(entity.attributes.hvac_action || entity.state || "").toLowerCase() === "heating");
  if (radiatorButton && radiatorLabel && radiatorMeta) {
    radiatorButton.classList.toggle("active", activeRadiators.length > 0);
    radiatorButton.classList.toggle("idle", activeRadiators.length === 0);
    radiatorLabel.textContent = `${activeRadiators.length} aktive`;
    radiatorMeta.textContent = activeRadiators.length ? "Radiatorer varmer" : "Ingen varmer";
  }

  const wasteItems = getWasteCollectionSensors().map((id) => lookup.get(id)).filter(Boolean)
    .map((entity) => ({ entity, days: Number(entity.state), name: entity.attributes && entity.attributes.name ? entity.attributes.name : getFriendlyName(entity) }))
    .sort((left, right) => (Number.isFinite(left.days) ? left.days : 9999) - (Number.isFinite(right.days) ? right.days : 9999));
  const nextWaste = wasteItems[0] || null;
  if (wasteButton && wasteLabel && wasteMeta) {
    wasteButton.classList.toggle("active", Boolean(nextWaste));
    wasteButton.classList.toggle("idle", !nextWaste);
    wasteLabel.textContent = nextWaste && Number.isFinite(nextWaste.days) ? `${nextWaste.days} dage` : "Ingen data";
    wasteMeta.textContent = nextWaste ? nextWaste.name : "Åbn info";
  }
}

function isClimateRunning(entity) {
  const action = String(entity && entity.attributes && entity.attributes.hvac_action || "").toLowerCase();
  const stateValue = String(entity && entity.state || "").toLowerCase();
  return ["heating", "cooling"].includes(action) || ["heat", "cool"].includes(stateValue);
}

async function openAcStatsModal() {
  const modal = document.getElementById("acStatsModal");
  const body = document.getElementById("acStatsModalBody");
  if (!modal || !body) return;
  const lookup = new Map((state.lastAllStates || []).map((entity) => [entity.entity_id, entity]));
  const rows = getAcClimateEntityIds().map((id) => lookup.get(id)).filter(Boolean);
  const history = state.acStatsView === "stats" ? getCachedClimateHistoryStats(rows) : new Map();
  body.innerHTML = rows.length
    ? `${buildClimateModalTabs("ac", state.acStatsView)}<div class="climate-modal-content" data-view="${state.acStatsView}"><div class="radiator-history-list">${rows.map((entity) => buildSimpleClimateStatusCard(entity, history.get(entity.entity_id), "ac")).join("")}</div></div>`
    : `<div class="calendar-loading">Ingen AC-enheder fundet.</div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  if (rows.length && state.acStatsView === "stats" && !history.size) {
    body.querySelector(".climate-modal-content")?.classList.add("is-loading");
    fetchClimateHistoryStats(rows).then((freshHistory) => {
      if (modal.classList.contains("open") && state.acStatsView === "stats") {
        body.innerHTML = `${buildClimateModalTabs("ac", state.acStatsView)}<div class="climate-modal-content" data-view="${state.acStatsView}"><div class="radiator-history-list">${rows.map((entity) => buildSimpleClimateStatusCard(entity, freshHistory.get(entity.entity_id), "ac")).join("")}</div></div>`;
      }
    }).catch((error) => console.error("Unable to render AC history", error));
  }
}

function closeAcStatsModal() {
  const modal = document.getElementById("acStatsModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

async function openRadiatorStatsModal() {
  const modal = document.getElementById("radiatorStatsModal");
  const body = document.getElementById("radiatorStatsModalBody");
  if (!modal || !body) return;
  const rows = (state.lastAllStates || []).filter((entity) => entity && entity.entity_id && entity.entity_id.startsWith("climate.") && entity.attributes && entity.attributes.calibration_balance);
  const history = state.radiatorStatsView === "stats" ? getCachedClimateHistoryStats(rows) : new Map();
  body.innerHTML = rows.length
    ? `${buildClimateModalTabs("radiator", state.radiatorStatsView)}<div class="climate-modal-content" data-view="${state.radiatorStatsView}"><div class="radiator-history-list">${rows.map((entity) => buildSimpleClimateStatusCard(entity, history.get(entity.entity_id), "radiator")).join("")}</div></div>`
    : `<div class="calendar-loading">Ingen Better Thermostat radiatorer fundet.</div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  if (rows.length && state.radiatorStatsView === "stats" && !history.size) {
    body.querySelector(".climate-modal-content")?.classList.add("is-loading");
    fetchClimateHistoryStats(rows).then((freshHistory) => {
      if (modal.classList.contains("open") && state.radiatorStatsView === "stats") {
        body.innerHTML = `${buildClimateModalTabs("radiator", state.radiatorStatsView)}<div class="climate-modal-content" data-view="${state.radiatorStatsView}"><div class="radiator-history-list">${rows.map((entity) => buildSimpleClimateStatusCard(entity, freshHistory.get(entity.entity_id), "radiator")).join("")}</div></div>`;
      }
    }).catch((error) => console.error("Unable to render radiator history", error));
  }
}

function closeRadiatorStatsModal() {
  const modal = document.getElementById("radiatorStatsModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function openWasteInfoModal() {
  const modal = document.getElementById("wasteInfoModal");
  const body = document.getElementById("wasteInfoModalBody");
  if (!modal || !body) return;
  const lookup = new Map((state.lastAllStates || []).map((entity) => [entity.entity_id, entity]));
  const rows = getWasteCollectionSensors().map((id) => lookup.get(id)).filter(Boolean)
    .sort((left, right) => Number(left.state) - Number(right.state));
  body.innerHTML = rows.length
    ? `<div class="waste-list">${rows.map((entity) => buildWasteStatusCard(entity)).join("")}</div>`
    : `<div class="calendar-loading">Ingen AffaldDK-data fundet.</div>`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeWasteInfoModal() {
  const modal = document.getElementById("wasteInfoModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function buildClimateModalTabs(type, activeView) {
  const active = activeView === "stats" ? "stats" : "control";
  return `
    <div class="climate-modal-tabs" role="tablist" aria-label="${type === "ac" ? "AC" : "Radiator"} visning">
      <button type="button" class="${active === "control" ? "active" : ""}" data-climate-modal-view="control" data-climate-modal-type="${type}" aria-selected="${active === "control"}">Styring</button>
      <button type="button" class="${active === "stats" ? "active" : ""}" data-climate-modal-view="stats" data-climate-modal-type="${type}" aria-selected="${active === "stats"}">Statistik 24t</button>
    </div>
  `;
}

async function handleClimateStatsModalClick(event) {
  const tabButton = event.target.closest("[data-climate-modal-view]");
  if (tabButton) {
    const nextView = tabButton.dataset.climateModalView === "stats" ? "stats" : "control";
    const type = tabButton.dataset.climateModalType === "ac" ? "ac" : "radiator";
    if (type === "ac") {
      state.acStatsView = nextView;
      await openAcStatsModal();
    } else {
      state.radiatorStatsView = nextView;
      await openRadiatorStatsModal();
    }
    return;
  }

  const button = event.target.closest("[data-climate-stats-action]");
  if (!button) return;

  const entityId = button.dataset.entityId;
  const action = button.dataset.climateStatsAction;
  if (!entityId || !action) return;

  button.disabled = true;
  try {
    if (action === "temp-delta") {
      const delta = Number(button.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const nextTemperature = Math.round(((Number.isFinite(current) ? current : 21) + delta) * 10) / 10;
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: nextTemperature
      });
    } else if (action === "mode") {
      await callHomeAssistantService(state.config, "climate", "set_hvac_mode", {
        entity_id: entityId,
        hvac_mode: button.dataset.hvacMode
      });
    }
    await refreshClimateStatesOnly();
    state.climateHistoryCache.clear();
    if (button.closest("#acStatsModalBody")) {
      await openAcStatsModal();
    } else {
      await openRadiatorStatsModal();
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (button.isConnected) {
      button.disabled = false;
    }
  }
}

async function refreshClimateStatesOnly() {
  if (!hasHomeAssistantCredentials(state.config)) {
    return;
  }
  try {
    state.lastAllStates = await fetchStates(state.config);
  } catch (error) {
    console.error("Unable to refresh climate states", error);
  }
}

function getClimateHistoryCacheKey(entities) {
  return (entities || [])
    .map((entity) => entity && entity.entity_id)
    .filter(Boolean)
    .sort()
    .join(",");
}

function getCachedClimateHistoryStats(entities) {
  const key = getClimateHistoryCacheKey(entities);
  const cached = key ? state.climateHistoryCache.get(key) : null;
  return cached && (Date.now() - cached.fetchedAt) < 5 * 60 * 1000 ? cached.history : new Map();
}

async function fetchClimateHistoryStats(entities) {
  const result = new Map();
  const ids = (entities || []).map((entity) => entity && entity.entity_id).filter(Boolean);
  if (!ids.length || !hasHomeAssistantCredentials(state.config)) return result;
  const cacheKey = getClimateHistoryCacheKey(entities);
  const cached = cacheKey ? state.climateHistoryCache.get(cacheKey) : null;
  if (cached && (Date.now() - cached.fetchedAt) < 5 * 60 * 1000) {
    return cached.history;
  }
  if (cacheKey && state.climateHistoryInFlight.has(cacheKey)) {
    return state.climateHistoryInFlight.get(cacheKey);
  }

  const start = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const path = `/api/history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(ids.join(","))}&minimal_response`;
  const request = (async () => {
  try {
    const response = await fetchFromHomeAssistant(state.config, path);
    if (!response.ok) return result;
    const payload = await response.json();
    (Array.isArray(payload) ? payload : []).forEach((series) => {
      if (!Array.isArray(series) || !series.length) return;
      const id = series[0].entity_id;
      let activeMinutes = 0;
      const buckets = Array.from({ length: 24 }, () => ({ heating: 0, cooling: 0, idle: 0 }));
      const statusMinutes = { heating: 0, cooling: 0, idle: 0 };
      let changes = 0;
      series.forEach((entry, index) => {
        const next = series[index + 1];
        const from = Math.max(new Date(entry.last_changed || entry.last_updated || start).getTime(), start.getTime());
        const to = next ? new Date(next.last_changed || next.last_updated || Date.now()).getTime() : Date.now();
        const action = String(entry.attributes && entry.attributes.hvac_action || entry.state || "").toLowerCase();
        const status = action === "heating" || action === "heat" ? "heating" : action === "cooling" || action === "cool" ? "cooling" : "idle";
        if (Number.isFinite(from) && Number.isFinite(to) && to > from) {
          const minutes = Math.round((to - from) / 60000);
          if (status !== "idle") activeMinutes += minutes;
          statusMinutes[status] += minutes;
          addClimateHistoryBuckets(buckets, from, to, status, start.getTime());
        }
        if (index > 0) changes += 1;
      });
      result.set(id, { activeMinutes, changes, buckets, statusMinutes, startMs: start.getTime() });
    });
      if (cacheKey) {
        state.climateHistoryCache.set(cacheKey, { fetchedAt: Date.now(), history: result });
      }
    } catch (error) {
      console.error("Unable to fetch climate history", error);
    } finally {
      if (cacheKey) {
        state.climateHistoryInFlight.delete(cacheKey);
      }
    }
    return result;
  })();
  if (cacheKey) {
    state.climateHistoryInFlight.set(cacheKey, request);
  }
  return request;
}

function addClimateHistoryBuckets(buckets, from, to, status, startMs) {
  const hourMs = 60 * 60 * 1000;
  for (let index = 0; index < buckets.length; index += 1) {
    const bucketStart = startMs + (index * hourMs);
    const bucketEnd = bucketStart + hourMs;
    const overlap = Math.max(0, Math.min(to, bucketEnd) - Math.max(from, bucketStart));
    if (overlap > 0) {
      buckets[index][status] += Math.round(overlap / 60000);
    }
  }
}

function buildSimpleClimateStatusCard(entity, history = null, type = "radiator") {
  const attrs = entity.attributes || {};
  const action = attrs.hvac_action || entity.state || "idle";
  const target = attrs.temperature !== undefined ? `${formatNumber(attrs.temperature, 1)}°` : "--";
  const current = attrs.current_temperature !== undefined ? `${formatNumber(attrs.current_temperature, 1)}°` : "--";
  const modeButtons = type === "ac"
    ? [
      { label: "Køl", mode: "cool" },
      { label: "Varme", mode: "heat" },
      { label: "Off", mode: "off" }
    ]
    : [
      { label: "Varme", mode: "heat" },
      { label: "Off", mode: "off" }
    ];
  const activity = history ? `${formatClimateMinutes(history.activeMinutes)} aktiv · ${history.changes} skift` : "24t statistik hentes ved åbning";
  const statusSummary = history
    ? [
      history.statusMinutes.heating ? `Varme ${formatClimateMinutes(history.statusMinutes.heating)}` : "",
      history.statusMinutes.cooling ? `Køl ${formatClimateMinutes(history.statusMinutes.cooling)}` : "",
      `Pause ${formatClimateMinutes(history.statusMinutes.idle)}`
    ].filter(Boolean).join(" · ")
    : "Ingen historik endnu";
  return `
    <article class="radiator-history-card ${isClimateRunning(entity) ? "is-active" : ""}">
      <div class="radiator-history-head">
        <div>
          <strong>${escapeHtml(getClimateLocationName(entity))}</strong>
          <p>${escapeHtml(String(action))} · ${escapeHtml(entity.entity_id)}</p>
        </div>
        <span>${current}</span>
      </div>
      <div class="radiator-history-meta"><span>Mål ${target}</span><span>${activity}</span></div>
      <div class="climate-stat-controls">
        <button type="button" class="living_room-temp-step" data-climate-stats-action="temp-delta" data-entity-id="${entity.entity_id}" data-delta="-0.5">-</button>
        <span>${escapeHtml(isClimateRunning(entity) ? "Aktiv" : "Pause")}</span>
        <button type="button" class="living_room-temp-step" data-climate-stats-action="temp-delta" data-entity-id="${entity.entity_id}" data-delta="0.5">+</button>
      </div>
      <div class="climate-stat-mode-row">
        ${modeButtons.map((item) => `<button type="button" class="living_room-mini-action ${String(entity.state).toLowerCase() === item.mode ? "is-active" : ""}" data-climate-stats-action="mode" data-entity-id="${entity.entity_id}" data-hvac-mode="${item.mode}">${item.label}</button>`).join("")}
      </div>
      <div class="climate-stat-section">
        <div class="climate-stat-section-head"><span>Statistik 24t</span><strong>${statusSummary}</strong></div>
        ${buildClimateHistoryBars(history)}
      </div>
    </article>
  `;
}

function getClimateLocationName(entity) {
  const raw = getFriendlyName(entity)
    .replace(/\bclimate\b/gi, "")
    .replace(/\bbetter thermostat\b/gi, "")
    .replace(/\bthermostate?\b/gi, "")
    .replace(/\bthermostat\b/gi, "")
    .replace(/\bhvac\b/gi, "")
    .replace(/\bclimate\b/gi, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (/^living_room$/i.test(raw)) return "LivingRoom";
  return raw || toTitleCase(entity.entity_id.replace(/^climate\./, ""));
}

function buildClimateHistoryBars(history) {
  const buckets = history && Array.isArray(history.buckets) ? history.buckets : [];
  if (!buckets.length) {
    return `<div class="climate-history-bars is-empty"><span></span></div>`;
  }
  const startMs = Number(history.startMs || Date.now() - 24 * 60 * 60 * 1000);
  return `
    <div class="climate-history-bars" aria-label="Aktivitet de sidste 24 timer">
      ${buckets.map((bucket, index) => {
        const total = Math.max(bucket.heating + bucket.cooling + bucket.idle, 1);
        const heat = Math.round((bucket.heating / total) * 100);
        const cool = Math.round((bucket.cooling / total) * 100);
        const idle = Math.max(0, 100 - heat - cool);
        return `<span title="${escapeHtml(formatClimateBucketLabel(startMs, index))} · Varme ${bucket.heating}m · Køl ${bucket.cooling}m · Pause ${bucket.idle}m"><i style="height:${heat}%" class="heat"></i><i style="height:${cool}%" class="cool"></i><i style="height:${idle}%" class="idle"></i></span>`;
      }).join("")}
    </div>
  `;
}

function formatClimateBucketLabel(startMs, index) {
  const from = new Date(startMs + index * 60 * 60 * 1000);
  const to = new Date(from.getTime() + 60 * 60 * 1000);
  return `${from.toLocaleDateString("da-DK", { weekday: "short" })} ${from.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}-${to.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}`;
}

function formatClimateMinutes(minutes) {
  const safe = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  if (hours > 0) return `${hours}t ${rest}m`;
  return `${rest}m`;
}

function buildWasteStatusCard(entity) {
  const attrs = entity.attributes || {};
  const name = attrs.name || getFriendlyName(entity);
  const date = attrs.date_short || attrs.date_long || attrs.date || "";
  const description = attrs.description || "";
  const days = Number(entity.state);
  const picture = attrs.entity_picture ? String(attrs.entity_picture) : "";
  const pictureUrl = picture && picture.startsWith("/")
    ? `${resolveHomeAssistantBaseUrl(state.config.haUrl)}${picture}`
    : picture;
  const icon = pictureUrl ? `<img src="${escapeHtml(pictureUrl)}" alt="">` : getWasteFallbackIcon(name);
  return `
    <article class="waste-list-card">
      <span class="waste-category-icon ${picture ? "has-image" : ""}" aria-hidden="true">${icon}</span>
      <div class="waste-list-copy">
        <strong>${escapeHtml(name)}</strong>
        <p>${escapeHtml(description || entity.entity_id)}</p>
      </div>
      <div class="waste-list-date">
        <strong>${Number.isFinite(days) ? days : "--"}</strong>
        <span>${escapeHtml(date || "dage")}</span>
      </div>
    </article>
  `;
}

function getWasteFallbackIcon(name) {
  const normalized = String(name || "").toLowerCase();
  if (/pap|paper/.test(normalized)) return "▤";
  if (/plast|glas|metal|madkarton/.test(normalized)) return "♻";
  if (/rest|mad/.test(normalized)) return "◒";
  if (/stor/.test(normalized)) return "▣";
  return "♻";
}

function applyRoomCardData(card, room, index) {
  if (!card || !room) {
    return;
  }

  card.dataset.roomIndex = String(index);
  card.dataset.roomKey = room.key || "";
  card.setAttribute("aria-label", `${room.name} detaljer`);
  card.querySelector(".room-name").textContent = room.name;
  const presenceBadge = card.querySelector(".room-presence");
  const lightBadge = card.querySelector(".room-light-pill");
  presenceBadge.textContent = room.presenceLabel || (room.presenceActive ? "Presence" : "Tom");
  presenceBadge.dataset.tone = room.presenceActive ? "on" : "off";
  lightBadge.textContent = room.lightBadgeLabel || room.lightLabel;
  lightBadge.dataset.tone = room.lightOn ? "on" : "off";
  card.querySelector(".room-temperature").textContent = room.temperatureLabel;
  card.querySelector(".room-humidity").textContent = room.humidityLabel;
  card.querySelector(".room-meta").textContent = room.meta || room.statusLabel || "";
  card.dataset.presence = room.presenceActive ? "on" : "off";
  card.dataset.light = room.lightOn ? "on" : "off";
  if (room.lightRgb) {
    card.style.setProperty("--room-light-rgb", room.lightRgb);
  } else {
    card.style.removeProperty("--room-light-rgb");
  }
}

function renderCameras() {
  elements.cameraGrid.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const rowCameras = getTopRowCameras();
  const useLiveMobileRows = isMobileLayout();

  rowCameras.forEach((camera, index) => {
    const card = elements.cameraTemplate.content.firstElementChild.cloneNode(true);
    const frame = card.querySelector(".camera-frame");
    const image = card.querySelector(".camera-image");
    const displayName = getCameraDisplayName(camera);
    const resolvedEntityId = camera.entityId ? resolveCameraEntityId(camera.entityId, "low") : "";
    card.dataset.cameraIndex = String(index);
    card.dataset.cameraEntityId = camera.entityId || "";
    card.title = displayName;
    card.setAttribute("aria-label", displayName);
    card.tabIndex = 0;
    image.setAttribute("draggable", "false");
    image.loading = index < CAMERA_EAGER_LOAD_COUNT ? "eager" : "lazy";
    image.decoding = index < CAMERA_EAGER_LOAD_COUNT ? "sync" : "async";
    image.fetchPriority = index < CAMERA_EAGER_LOAD_COUNT ? "high" : "low";
    const quality = "low";
    const renderUrl = getRenderableCameraUrl(camera, quality);
    const isImageCamera = camera.entityId || isImageCameraUrl(renderUrl);
    const go2rtcRowUrl = getGo2RtcRowUrl(camera);

    frame.dataset.liveSrc = go2rtcRowUrl || "";
    frame.title = displayName;
    frame.allow = "autoplay; fullscreen; picture-in-picture";
    frame.loading = useLiveMobileRows ? "eager" : "lazy";

    if (useLiveMobileRows && go2rtcRowUrl) {
      card.dataset.mobileLiveCamera = "true";
      card.dataset.mobileLiveReady = "false";
      const go2rtcSnapshotUrl = getGo2RtcSnapshotUrl(camera, true);
      if (go2rtcSnapshotUrl) {
        const cachedSnapshotUrl = state.cachedCameraSnapshotUrls.get(buildCameraSnapshotCacheKey(camera, true));
        image.alt = displayName;
        image.style.display = "block";
        image.dataset.cameraEntityId = resolveCameraEntityId(camera.entityId, quality);
        image.dataset.cameraMode = "row";
        image.dataset.cameraIndex = String(index);
        image.dataset.go2rtc = "true";
        image.src = cachedSnapshotUrl || go2rtcSnapshotUrl;
      } else {
        image.style.display = "none";
        image.removeAttribute("src");
      }
      frame.src = go2rtcRowUrl;
      frame.style.display = "block";
      frame.addEventListener("load", () => {
        card.dataset.mobileLiveReady = "true";
      }, { once: true });
    } else if (isImageCamera) {
      image.alt = displayName;
      image.style.display = "block";
      frame.style.display = "none";
      frame.removeAttribute("src");
      if (camera.entityId) {
        image.dataset.cameraEntityId = resolveCameraEntityId(camera.entityId, quality);
        image.dataset.cameraMode = "row";
        image.dataset.cameraIndex = String(index);
        image.dataset.fallbackSrc = "";
        image.dataset.snapshotStamp = "";
        if (resolvedEntityId) {
          image.dataset.baseEntityId = resolvedEntityId.replace(/_(low|medium|high)_resolution_channel(?:_insecure)?$/, "");
        }
        const go2rtcSnapshotUrl = getGo2RtcSnapshotUrl(camera, true);
        if (go2rtcSnapshotUrl) {
          const cachedSnapshotUrl = state.cachedCameraSnapshotUrls.get(buildCameraSnapshotCacheKey(camera, true));
          image.src = cachedSnapshotUrl || go2rtcSnapshotUrl;
          image.dataset.go2rtc = "true";
        }
      } else {
        image.src = renderUrl;
      }
    } else {
      frame.src = renderUrl;
      frame.title = displayName;
      frame.style.display = "block";
      image.style.display = "none";
      image.removeAttribute("src");
    }

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCameraModal(camera);
      }
    });
    card.addEventListener("pointerenter", () => {
      prewarmCameraPopup(camera);
    });
    card.addEventListener("focus", () => {
      prewarmCameraPopup(camera);
    });
    card.addEventListener("pointerdown", () => {
      prewarmCameraPopup(camera);
    });
    fragment.appendChild(card);
  });

  elements.cameraGrid.appendChild(fragment);
  updateActiveCameraCards();
  renderFeaturedCamera();
  state.renderedCameraSignature = buildCameraRenderSignature();
}

function ensureCameraRendering() {
  const nextSignature = buildCameraRenderSignature();
  if (!elements.cameraGrid.children.length || nextSignature !== state.renderedCameraSignature) {
    renderCameras();
    return;
  }

  updateActiveCameraCards();
  refreshFeaturedCameraIfNeeded();
}

function renderFeaturedCamera() {
  const featured = getFeaturedCamera();
  const go2rtcViewerUrl = featured ? getGo2RtcPrimaryViewUrl(featured) : "";
  const nextEntityId = featured && featured.entityId
    ? resolveCameraEntityId(featured.entityId, "high")
    : "";
  const currentEntityId = elements.featuredCameraWrap.dataset.cameraEntityId || "";
  const currentViewerUrl = elements.featuredCameraWrap.dataset.viewerUrl || "";

  if (featured && elements.featuredCameraWrap.children.length && currentEntityId === nextEntityId && currentViewerUrl === go2rtcViewerUrl) {
    return;
  }

  elements.featuredCameraWrap.innerHTML = "";

  if (!featured) {
    elements.featuredCameraWrap.className = "featured-camera empty";
    elements.featuredCameraWrap.dataset.cameraEntityId = "";
    elements.featuredCameraWrap.dataset.viewerUrl = "";
    const placeholder = document.createElement("div");
    placeholder.className = "featured-empty";
    placeholder.innerHTML = "<div><span>Featured camera</span><strong>Add a camera URL in Settings</strong></div>";
    elements.featuredCameraWrap.appendChild(placeholder);
    return;
  }

  elements.featuredCameraWrap.className = "featured-camera";
  elements.featuredCameraWrap.dataset.cameraEntityId = nextEntityId;
  elements.featuredCameraWrap.dataset.viewerUrl = go2rtcViewerUrl || "";
  if (go2rtcViewerUrl) {
    const frame = document.createElement("iframe");
    frame.loading = "eager";
    frame.referrerPolicy = "no-referrer";
    frame.allow = "autoplay; fullscreen; picture-in-picture";
    frame.title = featured.name;
    frame.src = go2rtcViewerUrl;
    elements.featuredCameraWrap.appendChild(frame);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "featured-empty";
    placeholder.innerHTML = `<div><span>Primary view</span><strong>go2rtc stream mangler for ${featured.name}</strong></div>`;
    elements.featuredCameraWrap.appendChild(placeholder);
  }
}

function refreshFeaturedCameraIfNeeded() {
  const featured = getFeaturedCamera();
  const nextEntityId = featured && featured.entityId ? resolveCameraEntityId(featured.entityId, "high") : "";
  const currentEntityId = elements.featuredCameraWrap.dataset.cameraEntityId || "";

  if (nextEntityId !== currentEntityId) {
    renderFeaturedCamera();
  }
}

function getFeaturedCamera() {
  if (state.activeDetectionCameraId) {
    const detected = state.config.cameras.find((camera) => camera.entityId === state.activeDetectionCameraId);
    if (detected) {
      return detected;
    }
  }

  const defaultCamera = state.config.cameras.find((camera) => camera.entityId === getCoreEntityId("featuredCamera", DEFAULT_FEATURED_CAMERA_ENTITY_ID));
  if (defaultCamera) {
    return defaultCamera;
  }

  return state.config.cameras[0];
}

function buildCameraRenderSignature() {
  const cameraList = getTopRowCameras()
    .map((camera) => `${camera.name}|${camera.entityId || camera.url || ""}`)
    .join(";");
  return cameraList;
}

function updateActiveCameraCards() {
  const cards = elements.cameraGrid.querySelectorAll(".camera-card");
  cards.forEach((card) => {
    const isActive = Boolean(
      state.activeDetectionCameraId &&
      card.dataset.cameraEntityId &&
      card.dataset.cameraEntityId === state.activeDetectionCameraId
    );
    card.classList.toggle("camera-card-active", isActive);

    const frame = card.querySelector(".camera-frame");
    const image = card.querySelector(".camera-image");
    if (!frame || !image) {
      return;
    }

    const liveSrc = frame.dataset.liveSrc || "";
    if (isMobileLayout() && card.dataset.mobileLiveCamera === "true") {
      if (liveSrc && !frame.hasAttribute("src")) {
        frame.src = liveSrc;
      }
      frame.style.display = "block";
      image.style.display = card.dataset.mobileLiveReady === "true" ? "none" : "block";
      return;
    }

    if (frame.hasAttribute("src")) {
      frame.removeAttribute("src");
    }
    frame.style.display = "none";
    image.style.display = "block";
  });
}

function getTopRowCameras() {
  const seen = new Set();
  return state.config.cameras.filter((camera) => {
    if (!camera) {
      return false;
    }

    const key = camera.entityId
      ? `entity:${getCameraSlug(camera.entityId)}`
      : `url:${String(camera.url || camera.name || "").trim().toLowerCase()}`;

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function openCameraModal(camera) {
  const displayName = getCameraDisplayName(camera);
  const go2rtcViewerUrl = getGo2RtcPopupUrl(camera);
  elements.cameraModalTitle.textContent = displayName;
  elements.cameraModalViewport.innerHTML = "";
  elements.cameraModalViewport.classList.remove("ready");

  if (go2rtcViewerUrl) {
    const frame = takePrewarmedCameraFrame(go2rtcViewerUrl) || createCameraFrame(go2rtcViewerUrl, displayName);
    elements.cameraModalViewport.appendChild(frame);
    state.modalCameraEntityId = "";
    elements.cameraModalViewport.classList.add("ready");
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "featured-empty";
    placeholder.innerHTML = `<div><span>Kamera</span><strong>go2rtc stream mangler for ${displayName}</strong></div>`;
    elements.cameraModalViewport.appendChild(placeholder);
    state.modalCameraEntityId = "";
    elements.cameraModalViewport.classList.add("ready");
  }

  document.body.classList.add("modal-open");
  elements.cameraModal.classList.add("open");
  elements.cameraModal.setAttribute("aria-hidden", "false");
}

function closeCameraModal() {
  document.body.classList.remove("modal-open");
  elements.cameraModal.classList.remove("open");
  elements.cameraModal.setAttribute("aria-hidden", "true");
  const activeFrame = elements.cameraModalViewport.querySelector("iframe[data-prewarm-url]");
  if (activeFrame) {
    storePrewarmedCameraFrame(activeFrame);
  }
  elements.cameraModalViewport.innerHTML = "";
  elements.cameraModalViewport.classList.remove("ready");
  state.modalCameraEntityId = "";
  if (state.modalRefreshTimerId) {
    window.clearInterval(state.modalRefreshTimerId);
    state.modalRefreshTimerId = null;
  }
}

async function openWeatherModal() {
  const { weatherEntity, powerEntity, priceEntity } = state.lastSceneData;
  state.weatherModalView = "day";
  elements.weatherModalTitle.textContent = "Detaljeret vejrudsigt";
  elements.weatherModalBody.innerHTML = buildWeatherModalMarkup(weatherEntity, powerEntity, priceEntity, state.weatherForecasts);
  document.body.classList.add("modal-open");
  elements.weatherModal.classList.add("open");
  elements.weatherModal.setAttribute("aria-hidden", "false");

  const staleForecast = !state.weatherForecasts.fetchedAt || (Date.now() - state.weatherForecasts.fetchedAt) > (30 * 60 * 1000);
  if (!weatherEntity || !staleForecast) {
    return;
  }

  try {
    state.weatherForecasts = await fetchWeatherForecasts(state.config, weatherEntity.entity_id);
    if (elements.weatherModal.classList.contains("open")) {
      elements.weatherModalBody.innerHTML = buildWeatherModalMarkup(weatherEntity, powerEntity, priceEntity, state.weatherForecasts);
    }
  } catch (error) {
    console.error("Unable to fetch weather forecasts", error);
  }
}

function closeWeatherModal() {
  document.body.classList.remove("modal-open");
  elements.weatherModal.classList.remove("open");
  elements.weatherModal.setAttribute("aria-hidden", "true");
}

function handleWeatherModalClick(event) {
  const tabButton = event.target.closest("[data-weather-view]");
  if (!tabButton) {
    return;
  }

  const nextView = tabButton.dataset.weatherView === "week" ? "week" : "day";
  if (nextView === state.weatherModalView) {
    return;
  }

  state.weatherModalView = nextView;
  const { weatherEntity, powerEntity, priceEntity } = state.lastSceneData;
  elements.weatherModalBody.innerHTML = buildWeatherModalMarkup(weatherEntity, powerEntity, priceEntity, state.weatherForecasts);
}

function openVehicleModal() {
  elements.vehicleModalTitle.textContent = "Vehicle detaljer";
  elements.vehicleModalBody.innerHTML = buildVehicleModalMarkup(state.lastSceneData.vehicleData);
  document.body.classList.add("modal-open");
  elements.vehicleModal.classList.add("open");
  elements.vehicleModal.setAttribute("aria-hidden", "false");
}

function closeVehicleModal() {
  document.body.classList.remove("modal-open");
  elements.vehicleModal.classList.remove("open");
  elements.vehicleModal.setAttribute("aria-hidden", "true");
}

function openSecurityModal() {
  elements.securityModalTitle.textContent = "Sikkerhed";
  elements.securityModalBody.innerHTML = buildSecurityModalMarkup(state.lastSceneData.securityData);
  document.body.classList.add("modal-open");
  elements.securityModal.classList.add("open");
  elements.securityModal.setAttribute("aria-hidden", "false");
}

function openMailModal() {
  elements.securityModalTitle.textContent = "Mailbox";
  elements.securityModalBody.innerHTML = buildMailModalMarkup();
  document.body.classList.add("modal-open");
  elements.securityModal.classList.add("open");
  elements.securityModal.setAttribute("aria-hidden", "false");
}

function closeSecurityModal() {
  document.body.classList.remove("modal-open");
  elements.securityModal.classList.remove("open");
  elements.securityModal.setAttribute("aria-hidden", "true");
}

async function handleSecurityModalClick(event) {
  const button = event.target.closest("[data-security-action]");
  if (!button) {
    return;
  }

  const domain = button.dataset.domain;
  const service = button.dataset.service;
  const entityId = button.dataset.entityId;
  if (!domain || !service || !entityId) {
    return;
  }

  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Arbejder...";

  try {
    await callHomeAssistantService(state.config, domain, service, { entity_id: entityId });
    await refreshDashboard();
    elements.securityModalBody.innerHTML = buildSecurityModalMarkup(state.lastSceneData.securityData);
  } catch (error) {
    console.error(error);
    button.textContent = "Fejl";
    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = original;
    }, 900);
  }
}

async function openCalendarModal() {
  elements.calendarModalTitle.textContent = "Kommende aftaler";
  elements.calendarModalBody.innerHTML = "<div class=\"calendar-loading\">Henter kalender...</div>";
  document.body.classList.add("modal-open");
  elements.calendarModal.classList.add("open");
  elements.calendarModal.setAttribute("aria-hidden", "false");

  try {
    const events = await fetchCalendarEvents(state.config);
    state.calendarEvents = events;
    elements.calendarModalBody.innerHTML = buildCalendarModalMarkup(events);
  } catch (error) {
    elements.calendarModalBody.innerHTML = `<div class="calendar-loading">Kunne ikke hente kalender: ${buildUserFacingError(error)}</div>`;
  }
}

function closeCalendarModal() {
  document.body.classList.remove("modal-open");
  elements.calendarModal.classList.remove("open");
  elements.calendarModal.setAttribute("aria-hidden", "true");
}

function handleCalendarModalClick(event) {
  const tabButton = event.target.closest("[data-calendar-view]");
  if (!tabButton) {
    return;
  }

  const nextView = tabButton.dataset.calendarView;
  if (nextView !== "upcoming" && nextView !== "week") {
    return;
  }

  state.calendarView = nextView;
  elements.calendarModalBody.innerHTML = buildCalendarModalMarkup(state.calendarEvents || []);
}

function updateFocusMetric(entities) {
  return entities.find((entity) => hasUsefulValue(entity.state)) || entities[0] || null;
}

function buildSummaryLines(entities) {
  return entities.slice(0, 3).map((entity) => {
    const unit = entity.attributes && entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : "";
    return `${getFriendlyName(entity)}: ${entity.state}${unit}`.trim();
  });
}

function getFriendlyName(entity) {
  return entity.attributes && entity.attributes.friendly_name
    ? entity.attributes.friendly_name
    : toTitleCase(entity.entity_id.split(".").slice(1).join(" "));
}

function hasUsefulValue(value) {
  return value !== undefined && value !== null && value !== "" && value !== "unknown" && value !== "unavailable" && value !== "--";
}

function toTitleCase(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function startRefreshLoop() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
  }
  const intervalMs = Math.max(DASHBOARD_REFRESH_INTERVAL_SECONDS, Number(state.config.refreshInterval || DASHBOARD_REFRESH_INTERVAL_SECONDS)) * 1000;
  state.timerId = window.setInterval(refreshDashboard, intervalMs);
}

function startCameraImageLoop() {
  if (state.imageRefreshTimerId) {
    window.clearInterval(state.imageRefreshTimerId);
  }

  state.imageRefreshTimerId = window.setInterval(refreshCameraSnapshots, CAMERA_ROW_REFRESH_INTERVAL_MS);
}

function startFeaturedCameraLoop() {
  if (state.featuredRefreshTimerId) {
    window.clearInterval(state.featuredRefreshTimerId);
  }

  state.featuredRefreshTimerId = window.setInterval(() => {
    const featuredImage = elements.featuredCameraWrap.querySelector("img[data-camera-entity-id]");
    if (featuredImage) {
      refreshSingleCameraImage(featuredImage, { force: true });
    }
  }, FEATURED_CAMERA_REFRESH_INTERVAL_MS);
}

function startModalCameraLoop() {
  if (state.modalRefreshTimerId) {
    window.clearInterval(state.modalRefreshTimerId);
  }

  if (!state.modalCameraEntityId) {
    return;
  }

  state.modalRefreshTimerId = window.setInterval(() => {
    const modalImage = elements.cameraModalViewport.querySelector("img[data-camera-entity-id]");
    if (modalImage) {
      refreshSingleCameraImage(modalImage, { force: true });
    }
  }, MODAL_CAMERA_REFRESH_INTERVAL_MS);
}

async function refreshDashboard() {
  if (!hasHomeAssistantCredentials(state.config)) {
    renderPlaceholderEntities();
    setPendingState("Vælg Home Assistant-login eller indsæt et token i Settings.");
    return;
  }

  if (state.dashboardRefreshInFlight || document.hidden) {
    return;
  }

  state.dashboardRefreshInFlight = true;
  try {
    const allStates = await fetchStates(state.config);
    state.lastAllStates = allStates;
    renderEntityPickerOptions(allStates);
    updateCameraEntityLookup(allStates);
    updateDetectionState(allStates);
    const weatherEntity = allStates.find((entity) => entity.entity_id === getCoreEntityId("weather", WEATHER_ENTITY_ID)) || null;
    const powerEntity = allStates.find((entity) => entity.entity_id === getCoreEntityId("power", POWER_ENTITY_ID)) || null;
    const priceEntity = allStates.find((entity) => entity.entity_id === getCoreEntityId("price", PRICE_ENTITY_ID)) || null;
    const priceForecastEntity = allStates.find((entity) => entity.entity_id === getCoreEntityId("priceForecast", PRICE_FORECAST_ENTITY_ID)) || null;
    const utilityConfig = getActiveUtilityConfig();
    const utilityEntity = allStates.find((entity) => entity.entity_id === utilityConfig.currentEntityId) || null;
    const vehicleEntities = getVehicleEntityMap();
    const vehicleData = {
      battery: findEntityByConfiguredId(allStates, vehicleEntities.battery) || findVehicleBatteryEntity(allStates),
      range: findEntityByConfiguredId(allStates, vehicleEntities.range),
      chargeStart: findEntityByConfiguredId(allStates, vehicleEntities.chargeStart),
      chargeEnd: findEntityByConfiguredId(allStates, vehicleEntities.chargeEnd) || findEntityByConfiguredId(allStates, vehicleEntities.chargeEndFallback),
      chargePrice: findEntityByConfiguredId(allStates, vehicleEntities.chargePrice) || findEntityByConfiguredId(allStates, vehicleEntities.chargePriceFallback),
      summary: findEntityByConfiguredId(allStates, vehicleEntities.summary),
      status: findEntityByConfiguredId(allStates, vehicleEntities.status)
    };
    const securityData = extractSecurityData(allStates);

    renderSceneOverview(
      weatherEntity,
      utilityEntity || powerEntity,
      priceEntity,
      priceForecastEntity,
      vehicleData,
      securityData
    );
    const roomCards = buildRoomCards(allStates);
    renderRooms(roomCards);
    renderCompactRoomHeader(allStates);
    ensureCameraRendering();
    startCameraImageLoop();
    startFeaturedCameraLoop();
    refreshCameraSnapshots();
    setSuccessState(`Loaded ${roomCards.length} rum fra Home Assistant.`, roomCards);

    if (shouldRefreshWeatherForecasts()) {
      state.weatherForecasts = await fetchWeatherForecasts(state.config, weatherEntity && weatherEntity.entity_id);
      renderSceneOverview(
        weatherEntity,
        utilityEntity || powerEntity,
        priceEntity,
        priceForecastEntity,
        vehicleData,
        securityData
      );
    }

    if (shouldRefreshPowerHistory()) {
      state.powerHistorySeries = await fetchPowerHistory(state.config, utilityConfig.historyEntityId, utilityConfig.historyMode, utilityConfig.historyBucketMinutes);
      state.lastPowerHistoryFetchAt = Date.now();
      state.lastPowerHistoryView = state.utilityView;
      state.lastPowerHistoryEntityId = utilityConfig.historyEntityId;
      renderSceneOverview(
        weatherEntity,
        utilityEntity || powerEntity,
        priceEntity,
        priceForecastEntity,
        vehicleData,
        securityData
      );
    }

    if (elements.lastUpdated) {
      elements.lastUpdated.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  } catch (error) {
    console.error(error);
    setErrorState(buildUserFacingError(error));
  } finally {
    state.dashboardRefreshInFlight = false;
  }
}

function shouldRefreshWeatherForecasts() {
  return !state.weatherForecasts.fetchedAt || (Date.now() - state.weatherForecasts.fetchedAt) > (30 * 60 * 1000);
}

function shouldRefreshPowerHistory() {
  const utilityConfig = getActiveUtilityConfig();
  return !state.powerHistorySeries.length
    || state.lastPowerHistoryView !== state.utilityView
    || state.lastPowerHistoryEntityId !== utilityConfig.historyEntityId
    || !state.lastPowerHistoryFetchAt
    || (Date.now() - state.lastPowerHistoryFetchAt) >= POWER_HISTORY_REFRESH_INTERVAL_MS;
}

async function fetchPowerHistory(config, entityId = getCoreEntityId("power", POWER_ENTITY_ID), mode = "average", bucketMinutes = 30) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  const response = await fetchFromHomeAssistant(
    config,
    `/api/history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${encodeURIComponent(end.toISOString())}&minimal_response`
  );

  if (!response.ok) {
    return [];
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) && Array.isArray(payload[0]) ? payload[0] : [];
  if (!rows.length) {
    return [];
  }

  const minutesPerBucket = Number.isFinite(Number(bucketMinutes)) && Number(bucketMinutes) > 0 ? Number(bucketMinutes) : 30;
  const bucketsPerHour = Math.max(1, Math.floor(60 / minutesPerBucket));
  const bucketCount = 24 * bucketsPerHour;
  const buckets = new Map();
  rows.forEach((entry) => {
    const value = Number(entry && entry.state);
    if (!Number.isFinite(value)) {
      return;
    }

    const changed = entry && (entry.last_changed || entry.last_updated);
    const date = changed ? new Date(changed) : null;
    if (!date || Number.isNaN(date.getTime())) {
      return;
    }

    const bucketKey = date.getHours() * bucketsPerHour + Math.floor(date.getMinutes() / minutesPerBucket);
    const bucket = buckets.get(bucketKey) || { values: [], first: value, last: value };
    bucket.values.push(value);
    bucket.first = bucket.values.length === 1 ? value : bucket.first;
    bucket.last = value;
    buckets.set(bucketKey, bucket);
  });

  const now = new Date();
  const currentBucketKey = now.getHours() * bucketsPerHour + Math.floor(now.getMinutes() / minutesPerBucket);

  let lastKnownValue = null;
  let previousBucketLast = null;

  return Array.from({ length: bucketCount }, (_, bucketKey) => {
    const bucket = buckets.get(bucketKey);
    const values = bucket ? bucket.values : [];
    const averaged = values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
    const deltaBase = bucket && previousBucketLast !== null ? previousBucketLast : (bucket ? bucket.first : 0);
    const delta = bucket ? Math.max(0, bucket.last - deltaBase) : 0;
    const last = bucket ? bucket.last : 0;
    if (bucket && mode === "last") {
      lastKnownValue = bucket.last;
    }
    if (bucket) {
      previousBucketLast = bucket.last;
    }
    const carriedLast = mode === "last" && lastKnownValue !== null && bucketKey <= currentBucketKey ? lastKnownValue : last;
    const hour = Math.floor(bucketKey / bucketsPerHour);
    const minute = (bucketKey % bucketsPerHour) * minutesPerBucket;
    return {
      label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      value: mode === "delta" ? delta : (mode === "last" ? carriedLast : averaged),
      hasData: values.length > 0 || (mode === "last" && lastKnownValue !== null && bucketKey <= currentBucketKey),
      isFuture: bucketKey > currentBucketKey
    };
  });
}

async function fetchCalendarEvents(config) {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  const calendars = getCalendarEntityIds(state.lastAllStates || []);
  const allEvents = [];

  for (const calendarId of calendars) {
    const response = await fetchFromHomeAssistant(
      config,
      `/api/calendars/${calendarId}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`
    );

    if (!response.ok) {
      continue;
    }

    const payload = await response.json();
    const events = Array.isArray(payload) ? payload : payload && Array.isArray(payload.value) ? payload.value : [];
    events.forEach((event) => {
      allEvents.push({
        ...event,
        calendarId,
        calendarName: prettifyCalendarName(calendarId)
      });
    });
  }

  return allEvents.sort((left, right) => getCalendarEventTimestamp(left) - getCalendarEventTimestamp(right));
}

function renderSceneOverview(weatherEntity, powerEntity, priceEntity) {
  if (!weatherEntity) {
    elements.weatherStateValue.textContent = "--";
    elements.weatherMeta.textContent = "Vejrdata ikke tilg?ngelig";
  } else {
    const weatherState = translateWeatherState(weatherEntity.state);
    const temperature = weatherEntity.attributes && weatherEntity.attributes.temperature !== undefined
      ? `${formatNumber(weatherEntity.attributes.temperature, 1)} °C`
      : weatherState;
    const humidity = weatherEntity.attributes && weatherEntity.attributes.humidity !== undefined
      ? `${Math.round(Number(weatherEntity.attributes.humidity))}% fugt`
      : getFriendlyName(weatherEntity);
    elements.weatherStateValue.textContent = temperature;
    elements.weatherMeta.textContent = `${weatherState} ? ${humidity}`;
  }

  if (!powerEntity || !hasUsefulValue(powerEntity.state)) {
    elements.powerNowValue.textContent = "--";
    elements.powerNowMeta.textContent = "Str?mm?ler offline";
  } else {
    const watts = Number(powerEntity.state);
    elements.powerNowValue.textContent = watts >= 1000
      ? `${formatNumber(watts / 1000, 2)} kW`
      : `${Math.round(watts)} W`;
    elements.powerNowMeta.textContent = "Aktuelt husforbrug";
  }

  const priceSummary = buildPriceSummary(priceEntity);
  elements.priceTodayValue.textContent = priceSummary.todayValue;
  elements.priceTodayMeta.textContent = priceSummary.todayMeta;
  elements.priceTomorrowValue.textContent = priceSummary.tomorrowValue;
  elements.priceTomorrowMeta.textContent = priceSummary.tomorrowMeta;
}

function buildPriceSummary(priceEntity) {
  const fallback = {
    todayValue: "--",
    todayMeta: "Dagens priser ikke tilg?ngelige",
    tomorrowValue: "--",
    tomorrowMeta: "Morgendagens priser ikke tilg?ngelige"
  };

  if (!priceEntity || !priceEntity.attributes) {
    return fallback;
  }

  const current = Number(priceEntity.attributes.current_price ?? priceEntity.state);
  const todayValues = getPriceValues(getTodayPriceSource(priceEntity));
  const tomorrowValues = getPriceValues(priceEntity.attributes.raw_tomorrow || priceEntity.attributes.tomorrow);

  return {
    todayValue: Number.isFinite(current) ? `${formatNumber(current, 2)} kr` : "--",
    todayMeta: todayValues.length
      ? `Lav ${formatNumber(Math.min(...todayValues), 2)} ? H?j ${formatNumber(Math.max(...todayValues), 2)}`
      : fallback.todayMeta,
    tomorrowValue: tomorrowValues.length
      ? `${formatNumber(Math.min(...tomorrowValues), 2)} - ${formatNumber(Math.max(...tomorrowValues), 2)} kr/kWh`
      : "--",
    tomorrowMeta: tomorrowValues.length ? "Laveste og h?jeste pris i morgen" : fallback.tomorrowMeta
  };
}

function getPriceValues(source) {
  if (!source) {
    return [];
  }

  const list = Array.isArray(source.value) ? source.value : Array.isArray(source) ? source : [];
  return list
    .map((entry) => {
      if (typeof entry === "number") {
        return entry;
      }
      if (entry && typeof entry.value === "number") {
        return entry.value;
      }
      if (entry && typeof entry.price === "number") {
        return entry.price;
      }
      return Number(entry && entry.value !== undefined ? entry.value : entry && entry.price !== undefined ? entry.price : entry);
    })
    .filter((value) => Number.isFinite(value));
}

function getTodayPriceSource(priceEntity) {
  if (!priceEntity || !priceEntity.attributes) {
    return null;
  }

  return priceEntity.attributes.raw_today
    || priceEntity.attributes.today
    || priceEntity.attributes.prices
    || null;
}

function getCurrentHourlyPrice(source, fallbackValue = NaN) {
  const list = Array.isArray(source && source.value) ? source.value : Array.isArray(source) ? source : [];
  if (!list.length) {
    return Number.isFinite(fallbackValue) ? fallbackValue : NaN;
  }

  const now = Date.now();
  for (let index = 0; index < list.length; index += 1) {
    const entry = list[index];
    const numericValue = typeof entry === "number"
      ? entry
      : entry && typeof entry.value === "number"
        ? entry.value
        : entry && typeof entry.price === "number"
          ? entry.price
          : Number(entry && entry.value !== undefined ? entry.value : entry && entry.price !== undefined ? entry.price : entry);
    if (!Number.isFinite(numericValue)) {
      continue;
    }

    const timestamp = entry && (entry.start || entry.time || entry.timestamp || entry.hour);
    if (!timestamp) {
      continue;
    }

    const start = new Date(timestamp).getTime();
    if (!Number.isFinite(start)) {
      continue;
    }

    if (now >= start && now < start + 60 * 60 * 1000) {
      return numericValue;
    }
  }

  return Number.isFinite(fallbackValue) ? fallbackValue : NaN;
}

function formatNumber(value, decimals = 0) {
  return Number(value).toLocaleString("da-DK", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function translateWeatherState(value) {
  const labels = {
    sunny: "Solrigt",
    clear: "Klart",
    cloudy: "Skyet",
    partlycloudy: "Let skyet",
    rainy: "Regn",
    pouring: "Kraftig regn",
    snowy: "Sne",
    fog: "Tåge",
    windy: "Blåst"
  };

  return labels[value] || toTitleCase(String(value || ""));
}

function persistAuthConfigIfNeeded(config) {
  if (config !== state.config) {
    return;
  }

  saveConfig();
  renderSettings();
}

async function startHomeAssistantLoginFromSettings() {
  if (state.connectionTestInFlight) {
    return;
  }

  const nextConfig = readConfigFromInputs();
  if (hasOAuthSession(nextConfig)) {
    state.config = nextConfig;
    state.config.authMode = "ha-user";
    state.authStatusMessage = "Aktiv metode: Home Assistant-login.";
    saveConfig();
    renderSettings();
    showSettingsFeedback("success", "HA-login valgt", "Dashboardet bruger nu den gemte Home Assistant-session.");
    await refreshDashboard();
    return;
  }

  if (!nextConfig.haUrl) {
    showSettingsFeedback("error", "Mangler adresse", "Indtast f?rst din Home Assistant-adresse eller brug /ha.");
    return;
  }

  state.config = nextConfig;
  saveConfig();
  renderSettings();

  const authState = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(HA_AUTH_PENDING_KEY, JSON.stringify({
    haUrl: nextConfig.haUrl,
    state: authState
  }));

  const baseUrl = resolveHomeAssistantBaseUrl(nextConfig.haUrl);
  const authorizeBaseUrl = resolveHomeAssistantAuthorizeBaseUrl(nextConfig.haUrl);
  const redirectUri = buildHomeAssistantRedirectUri();
  const clientId = buildHomeAssistantClientId();
  const authorizeUrl = `${authorizeBaseUrl}/auth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(authState)}&response_type=code`;

  showSettingsFeedback("pending", "Logger ind", "Du videresendes nu til Home Assistant-login.");
  window.location.assign(authorizeUrl);
}

async function handleHomeAssistantAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("code") && !params.has("error")) {
    return null;
  }

  const pendingRaw = sessionStorage.getItem(HA_AUTH_PENDING_KEY);
  sessionStorage.removeItem(HA_AUTH_PENDING_KEY);
  clearAuthQueryParams();

  if (!pendingRaw) {
    return { type: "error", message: "Home Assistant-login kunne ikke fuldf?res, fordi login-sessionen mangler." };
  }

  const pending = JSON.parse(pendingRaw);
  if (params.get("state") !== pending.state) {
    return { type: "error", message: "Home Assistant-login blev afvist, fordi login-state ikke matcher." };
  }

  if (params.has("error")) {
    const reason = params.get("error_description") || params.get("error") || "ukendt fejl";
    return { type: "error", message: `Home Assistant-login blev afbrudt: ${reason}` };
  }

  try {
    const tokenData = await exchangeAuthorizationCodeForToken(pending.haUrl, params.get("code"));
    state.config = normalizeConfig({
      ...state.config,
      haUrl: pending.haUrl || state.config.haUrl,
      authMode: "ha-user",
      oauthAccessToken: tokenData.access_token || "",
      oauthRefreshToken: tokenData.refresh_token || "",
      oauthExpiresAt: Date.now() + (Number(tokenData.expires_in || 1800) * 1000),
      oauthClientId: buildHomeAssistantClientId()
    });
    state.authStatusMessage = "Aktiv metode: Home Assistant-login.";
    saveConfig();
    renderSettings();
    return { type: "success", message: "Home Assistant-login er klar." };
  } catch (error) {
    clearOAuthSession(state.config);
    state.config.authMode = "manual";
    saveConfig();
    renderSettings();
    return { type: "error", message: buildUserFacingError(error) };
  }
}

function clearAuthQueryParams() {
  const url = new URL(window.location.href);
  ["code", "state", "error", "error_description"].forEach((key) => url.searchParams.delete(key));
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, document.title, nextUrl);
}

async function exchangeAuthorizationCodeForToken(haUrl, code) {
  const response = await fetch(`${resolveHomeAssistantBaseUrl(haUrl)}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: buildHomeAssistantClientId(),
      redirect_uri: buildHomeAssistantRedirectUri()
    }).toString()
  });

  if (!response.ok) {
    throw new Error(`HA_AUTH_${response.status}`);
  }

  return response.json();
}

async function refreshOAuthAccessToken(config, forceRefresh = false) {
  if (!hasOAuthSession(config)) {
    throw new Error("HA_AUTH_MISSING");
  }

  const expiresSoon = !config.oauthExpiresAt || Date.now() >= (Number(config.oauthExpiresAt) - 60000);
  if (!forceRefresh && config.oauthAccessToken && !expiresSoon) {
    return config.oauthAccessToken;
  }

  const response = await fetch(`${resolveHomeAssistantBaseUrl(config.haUrl)}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: config.oauthRefreshToken,
      client_id: config.oauthClientId || buildHomeAssistantClientId()
    }).toString()
  });

  if (!response.ok) {
    clearOAuthSession(config);
    config.authMode = "manual";
    persistAuthConfigIfNeeded(config);
    throw new Error(`HA_AUTH_${response.status}`);
  }

  const payload = await response.json();
  config.oauthAccessToken = payload.access_token || "";
  config.oauthRefreshToken = payload.refresh_token || config.oauthRefreshToken;
  config.oauthExpiresAt = Date.now() + (Number(payload.expires_in || 1800) * 1000);
  config.oauthClientId = config.oauthClientId || buildHomeAssistantClientId();
  persistAuthConfigIfNeeded(config);
  return config.oauthAccessToken;
}

async function getHomeAssistantAccessToken(config, options = {}) {
  if (config.authMode === "ha-user") {
    return refreshOAuthAccessToken(config, options.forceRefresh);
  }

  if (hasManualToken(config)) {
    return config.token.trim();
  }

  throw new Error("HA_AUTH_MISSING");
}

async function fetchFromHomeAssistant(config, path, options = {}) {
  const canUseProxySession = !hasManualToken(config) && !hasOAuthSession(config) && canUseHomeAssistantProxySession(config);

  if (canUseProxySession) {
    return fetch(`${resolveHomeAssistantBaseUrl(config.haUrl)}${path}`, {
      ...options,
      credentials: "same-origin"
    });
  }

  const performRequest = async (forceRefresh = false) => {
    const token = await getHomeAssistantAccessToken(config, { forceRefresh });
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
      headers.set("Content-Type", "application/json");
    }

    return fetch(`${resolveHomeAssistantBaseUrl(config.haUrl)}${path}`, {
      ...options,
      headers
    });
  };

  let response = await performRequest(false);
  if (response.status === 401 && config.authMode === "ha-user") {
    response = await performRequest(true);
  }
  return response;
}

async function activateManualTokenMode() {
  const nextConfig = readConfigFromInputs();
  if (!hasManualToken(nextConfig)) {
    showSettingsFeedback("error", "Manglende token", "Inds?t f?rst et long-lived access token for at bruge token-tilstand.");
    return;
  }

  state.config = nextConfig;
  state.config.authMode = "manual";
  state.authStatusMessage = "Aktiv metode: manuelt token.";
  saveConfig();
  renderSettings();
  showSettingsFeedback("success", "Token valgt", "Dashboardet bruger nu det manuelle token igen.");
  await refreshDashboard();
}

async function logoutHomeAssistantSession() {
  if (!hasOAuthSession(state.config)) {
    return;
  }

  clearOAuthSession(state.config);
  state.config.authMode = "manual";
  state.authStatusMessage = hasManualToken(state.config)
    ? "Aktiv metode: manuelt token."
    : "Ingen aktiv session endnu.";
  saveConfig();
  renderSettings();
  showSettingsFeedback("success", "HA-login fjernet", "Den lokale Home Assistant-session er fjernet fra dashboardet.");
  await refreshDashboard();
}

async function testConnectionFromSettings() {
  if (state.connectionTestInFlight) {
    return;
  }

  let nextConfig;
  try {
    nextConfig = readConfigFromInputs();
  } catch (error) {
    showSettingsFeedback("error", "Config error", error.message || "Tjek JSON-felterne i dashboard mapping.");
    return;
  }
  if (!hasHomeAssistantCredentials(nextConfig)) {
    showSettingsFeedback("error", "Missing details", "Brug enten Home Assistant-login eller indsæt et long-lived access token før testen.");
    return;
  }

  state.connectionTestInFlight = true;
  toggleSettingsButtons(true);
  showSettingsFeedback("pending", "Testing connection", "Trying to reach Home Assistant and validate your token.");

  try {
    const states = await fetchStates(nextConfig);
    state.lastAllStates = states;
    renderEntityPickerOptions(states);
    updateCameraEntityLookup(states);
    updateDetectionState(states);
    const suggested = buildSuggestedEntities(states);
    const cameraCount = states.filter((entity) => entity.entity_id.startsWith("camera.")).length;
    showSettingsFeedback(
      "success",
      "Connected",
      `Connection OK. Found ${states.length} entities, ${cameraCount} camera entities, and ${suggested.length} good dashboard candidates.`
    );
  } catch (error) {
    console.error(error);
    showSettingsFeedback("error", "Connection failed", buildUserFacingError(error));
  } finally {
    state.connectionTestInFlight = false;
    toggleSettingsButtons(false);
  }
}

async function suggestEntitiesFromHomeAssistant() {
  if (state.connectionTestInFlight) {
    return;
  }

  let nextConfig;
  try {
    nextConfig = readConfigFromInputs();
  } catch (error) {
    showSettingsFeedback("error", "Config error", error.message || "Tjek JSON-felterne i dashboard mapping.");
    return;
  }
  if (!hasHomeAssistantCredentials(nextConfig)) {
    showSettingsFeedback("error", "Missing details", "Brug enten Home Assistant-login eller indsæt et long-lived access token først.");
    return;
  }

  state.connectionTestInFlight = true;
  toggleSettingsButtons(true);
  showSettingsFeedback("pending", "Reading Home Assistant", "Fetching entities and building a starter setup for the dashboard.");

  try {
    const states = await fetchStates(nextConfig);
    state.lastAllStates = states;
    renderEntityPickerOptions(states);
    updateCameraEntityLookup(states);
    updateDetectionState(states);
    const suggestedEntities = buildSuggestedEntities(states);
    const suggestedCameras = buildSuggestedCameraLines(states, nextConfig.haUrl);
    const suggestedDashboardConfig = buildSuggestedDashboardConfig(states, nextConfig.dashboard);

    elements.entitiesInput.value = suggestedEntities.join("\n");
    nextConfig.dashboard = suggestedDashboardConfig;
    state.config = nextConfig;
    renderAdvancedEntitySettings();

    if (suggestedCameras.length) {
      elements.camerasInput.value = suggestedCameras.join("\n");
    }

    const cameraMessage = suggestedCameras.length
      ? `Added ${suggestedCameras.length} Protect medium camera links.`
      : "No browser-ready camera links were inferred automatically.";
    showSettingsFeedback("success", "Suggestions ready", `Added ${suggestedEntities.length} suggested entities. ${cameraMessage}`);
  } catch (error) {
    console.error(error);
    showSettingsFeedback("error", "Suggestion failed", buildUserFacingError(error));
  } finally {
    state.connectionTestInFlight = false;
    toggleSettingsButtons(false);
  }
}

async function fetchStates(config) {
  const response = await fetchFromHomeAssistant(config, "/api/states");

  if (!response.ok) {
    throw new Error(`HA_HTTP_${response.status}`);
  }

  return response.json();
}

async function callHomeAssistantService(config, domain, service, serviceData = {}) {
  const response = await fetchFromHomeAssistant(config, `/api/services/${domain}/${service}`, {
    method: "POST",
    body: JSON.stringify(serviceData)
  });

  if (!response.ok) {
    throw new Error(`HA_HTTP_${response.status}`);
  }

  return response.json().catch(() => null);
}

function extractWeatherForecastSeries(serviceResponse, entityId) {
  const firstPayload = Array.isArray(serviceResponse) ? serviceResponse[0] : serviceResponse;
  if (!firstPayload || typeof firstPayload !== "object") {
    return [];
  }

  const responsePayload = firstPayload.service_response && typeof firstPayload.service_response === "object"
    ? firstPayload.service_response
    : firstPayload;
  const entityPayload = responsePayload[entityId];
  if (entityPayload && Array.isArray(entityPayload.forecast)) {
    return entityPayload.forecast;
  }

  if (Array.isArray(responsePayload.forecast)) {
    return responsePayload.forecast;
  }

  return [];
}

async function fetchWeatherForecasts(config, weatherEntityId) {
  if (!weatherEntityId) {
    return { daily: [], hourly: [], fetchedAt: Date.now() };
  }

  const [dailyResponse, hourlyResponse] = await Promise.all([
    fetchFromHomeAssistant(config, "/api/services/weather/get_forecasts?return_response", {
      method: "POST",
      body: JSON.stringify({
        type: "daily",
        entity_id: weatherEntityId
      })
    }).then((response) => response.ok ? response.json() : null).catch(() => null),
    fetchFromHomeAssistant(config, "/api/services/weather/get_forecasts?return_response", {
      method: "POST",
      body: JSON.stringify({
        type: "hourly",
        entity_id: weatherEntityId
      })
    }).then((response) => response.ok ? response.json() : null).catch(() => null)
  ]);

  return {
    daily: extractWeatherForecastSeries(dailyResponse, weatherEntityId),
    hourly: extractWeatherForecastSeries(hourlyResponse, weatherEntityId),
    fetchedAt: Date.now()
  };
}

function pickConfiguredEntities(allStates, configuredEntities) {
  const requested = new Set(configuredEntities);
  const matched = allStates.filter((entity) => requested.has(entity.entity_id));
  if (!matched.length) {
    throw new Error("No configured entities were found. Check entity ids in Settings.");
  }

  return matched;
}

function findEntityByConfiguredId(allStates, entityId) {
  const normalizedId = normalizeEntityId(entityId);
  if (!normalizedId) {
    return null;
  }
  return allStates.find((entity) => entity.entity_id === normalizedId) || null;
}

function resolveHomeAssistantBaseUrl(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return "/ha";
  }

  if (trimmed.startsWith("/")) {
    return trimmed.replace(/\/+$/, "");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/+$/, "");
  }

  return `http://${trimmed.replace(/\/+$/, "")}`;
}

function buildSuggestedEntities(allStates) {
  const preferredDomains = ["sensor", "binary_sensor", "climate", "weather", "person", "light"];
  const preferredKeywords = ["temp", "temperature", "humidity", "door", "window", "power", "energy", "climate", "weather", "motion", "presence"];
  const picked = [];

  preferredDomains.forEach((domain) => {
    const matches = allStates
      .filter((entity) => entity.entity_id.startsWith(`${domain}.`))
      .filter((entity) => {
        if (domain === "weather" || domain === "person") {
          return true;
        }
        const id = entity.entity_id.toLowerCase();
        const name = getFriendlyName(entity).toLowerCase();
        return preferredKeywords.some((keyword) => id.includes(keyword) || name.includes(keyword));
      })
      .slice(0, domain === "sensor" ? 4 : 2);

    matches.forEach((entity) => {
      if (!picked.includes(entity.entity_id)) {
        picked.push(entity.entity_id);
      }
    });
  });

  return picked.slice(0, 10);
}

function buildSuggestedDashboardConfig(allStates, currentDashboardConfig = {}) {
  const fallback = normalizeDashboardConfig(currentDashboardConfig);
  const findFirstId = (predicate) => {
    const match = allStates.find(predicate);
    return match ? match.entity_id : "";
  };
  const idIncludes = (...tokens) => (entity) => {
    const haystack = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
    return tokens.some((token) => haystack.includes(token));
  };

  const weather = findFirstId((entity) => entity.entity_id.startsWith("weather."));
  const power = findFirstId((entity) => entity.entity_id.startsWith("sensor.") && idIncludes("power", "watt", "strom", "electric")(entity));
  const price = findFirstId((entity) => entity.entity_id.startsWith("sensor.") && idIncludes("price", "pris", "tariff", "nordpool")(entity));
  const priceForecast = findFirstId((entity) => entity.entity_id.startsWith("sensor.") && idIncludes("forecast", "prices", "priser")(entity));
  const featuredCamera = findFirstId((entity) => entity.entity_id.startsWith("camera."));
  const climateIds = allStates
    .filter((entity) => entity.entity_id.startsWith("climate."))
    .map((entity) => entity.entity_id)
    .slice(0, 8);
  const wasteIds = allStates
    .filter((entity) => entity.entity_id.startsWith("sensor."))
    .filter(idIncludes("waste", "affald", "trash", "garbage", "recycling"))
    .map((entity) => entity.entity_id)
    .slice(0, 8);

  const utilities = normalizeUtilityConfigMap({
    electric: power ? { currentEntityId: power, historyEntityId: power } : {},
    heat: findFirstId(idIncludes("heat", "varme")) ? {
      currentEntityId: findFirstId(idIncludes("heat", "varme")),
      historyEntityId: findFirstId(idIncludes("heat", "varme"))
    } : {},
    water: findFirstId(idIncludes("water", "vand")) ? {
      currentEntityId: findFirstId(idIncludes("water", "vand")),
      historyEntityId: findFirstId(idIncludes("water", "vand"))
    } : {}
  }, fallback.utilities);

  return normalizeDashboardConfig({
    ...fallback,
    coreEntities: {
      ...fallback.coreEntities,
      ...(featuredCamera ? { featuredCamera } : {}),
      ...(weather ? { weather } : {}),
      ...(power ? { power } : {}),
      ...(price ? { price } : {}),
      ...(priceForecast ? { priceForecast } : {})
    },
    utilities,
    acClimateEntityIds: climateIds.length ? climateIds : fallback.acClimateEntityIds,
    wasteCollectionSensors: wasteIds.length ? wasteIds : fallback.wasteCollectionSensors
  });
}

function buildSuggestedCameraLines(allStates, haUrl) {
  const preferred = allStates
    .filter((entity) => entity.entity_id.startsWith("camera."))
    .filter((entity) => entity.entity_id.includes("_medium_resolution_channel"))
    .filter((entity) => !/3d_printer|laser/i.test(entity.entity_id))
    .filter((entity) => !/3d printer|laser/i.test(getFriendlyName(entity)))
    .sort((left, right) => getFriendlyName(left).localeCompare(getFriendlyName(right), "da-DK"));

  return preferred
    .map((entity) => `${formatCameraName(entity)}|${canonicalizeCameraEntityId(entity.entity_id)}`)
    .filter(Boolean)
    .slice(0, 24);
}

function formatCameraName(entity) {
  return shortenCameraName(getFriendlyName(entity)
    .replace(/\s*-\s*UniFi Protect\s*-\s*Mellem oplåsning/i, "")
    .replace(/\s*-\s*UniFi Protect\s*-\s*Medium resolution/i, "")
    .trim());
}

function isImageCameraUrl(url) {
  return /\/api\/camera_proxy(_stream)?\//i.test(url) || /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
}

function inferCameraEntityId(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("camera.")) {
    return trimmed;
  }

  const entityMatch = trimmed.match(/camera\.[a-z0-9_]+(?:_(?:low|medium|high)_resolution_channel(?:_insecure)?)?/i);
  return entityMatch ? entityMatch[0].toLowerCase() : "";
}

function canonicalizeCameraEntityId(entityId) {
  const trimmed = String(entityId || "").trim().toLowerCase();
  if (!trimmed.startsWith("camera.")) {
    return trimmed;
  }

  return trimmed
    .replace(/_medium_resolution_channel(?=_insecure|$)/, "_high_resolution_channel")
    .replace(/_low_resolution_channel(?=_insecure|$)/, "_high_resolution_channel");
}

function getRenderableCameraUrl(camera, preferredQuality = "medium") {
  if (!camera) {
    return "";
  }

  if (camera.entityId) {
    const resolvedEntityId = resolveCameraEntityId(camera.entityId, preferredQuality);
    const entity = state.cameraEntities.get(resolvedEntityId) || state.cameraEntities.get(camera.entityId);
    if (entity && entity.attributes && entity.attributes.access_token) {
      return buildProtectedCameraSnapshotUrl(entity.entity_id, entity.attributes.access_token);
    }
  }

  const url = camera.url || "";
  if (!url) {
    return "";
  }

  if (/^http:\/\/10\.0\.0\.25:8123\/api\/camera_proxy\//i.test(url)) {
    return url.replace("/api/camera_proxy/", "/api/camera_proxy_stream/");
  }

  return url;
}

function getGo2RtcViewerUrl(camera, useSubStream = false) {
  const streamName = getGo2RtcStreamName(camera, useSubStream);
  if (!streamName) {
    return "";
  }

  return `${GO2RTC_BASE_URL}/stream.html?src=${encodeURIComponent(streamName)}&mode=webrtc`;
}

function getGo2RtcMainStreamName(camera) {
  return getGo2RtcStreamName(camera, false);
}

function getGo2RtcPrimaryViewUrl(camera) {
  const streamName = getGo2RtcMainStreamName(camera);
  if (!streamName) {
    return "";
  }

  const position = getCameraPlayerPosition(camera);
  return `./camera-player.html?v=20260511-camera-watchdog-01&src=${encodeURIComponent(streamName)}&position=${encodeURIComponent(position)}`;
}

function getGo2RtcPopupUrl(camera) {
  const streamName = getGo2RtcMainStreamName(camera);
  if (!streamName) {
    return "";
  }

  return `./camera-player.html?v=20260511-camera-watchdog-01&src=${encodeURIComponent(streamName)}&position=${encodeURIComponent(getCameraPlayerPosition(camera))}`;
}

function getGo2RtcRowUrl(camera) {
  const streamName = getGo2RtcStreamName(camera, true);
  if (!streamName) {
    return "";
  }

  return `./camera-player.html?v=20260511-camera-watchdog-01&src=${encodeURIComponent(streamName)}`;
}

function getGo2RtcSnapshotUrl(camera, useSubStream = false) {
  const streamName = getGo2RtcStreamName(camera, useSubStream);
  if (!streamName) {
    return "";
  }

  return `${GO2RTC_BASE_URL}/api/frame.jpeg?src=${encodeURIComponent(streamName)}`;
}

function getGo2RtcStreamName(camera, useSubStream = false) {
  if (!camera || !camera.entityId) {
    return "";
  }

  const slug = getCameraSlug(camera.entityId);
  const mapping = {
    front_door: ["FrontDoor"],
    front_yard: ["Front yard"],
    carport: ["carport"],
    back_yard: ["Back yard"],
    side_path: ["Langs_huset"],
    driveway: ["Driveway"],
    terrace: ["Terrace"],
    terrace_syd: ["Terrace_syd"],
    play_area: ["play_area"],
    play_zone: ["play_zone"],
    bag_indgang: ["Bag_indgang"]
  };

  const candidates = mapping[slug] || [];
  const base = candidates.find(Boolean) || "";
  if (!base) {
    return "";
  }

  return useSubStream ? `${base}_sub` : base;
}

function buildProtectedCameraSnapshotUrl(entityId, accessToken) {
  return `${resolveHomeAssistantBaseUrl(state.config.haUrl)}/api/camera_proxy/${entityId}?token=${accessToken}`;
}

function buildProtectedCameraSnapshotUrlDirect(entityId, accessToken) {
  return `${DIRECT_HOME_ASSISTANT_BASE_URL}/api/camera_proxy/${entityId}?token=${accessToken}`;
}

function buildProtectedCameraStreamUrlDirect(entityId, accessToken) {
  return `${DIRECT_HOME_ASSISTANT_BASE_URL}/api/camera_proxy_stream/${entityId}?token=${accessToken}`;
}

function resolveCameraEntityId(entityId, preferredQuality) {
  if (!entityId) {
    return entityId;
  }

  const insecureSuffix = entityId.endsWith("_insecure") ? "_insecure" : "";
  const baseEntityId = entityId.replace(/_(low|medium|high)_resolution_channel(?:_insecure)?$/, "");
  const preferred = `${baseEntityId}_${preferredQuality}_resolution_channel${insecureSuffix}`;

  if (state.cameraEntities.has(preferred)) {
    return preferred;
  }

  const mediumFallback = `${baseEntityId}_medium_resolution_channel${insecureSuffix}`;
  if (state.cameraEntities.has(mediumFallback)) {
    return mediumFallback;
  }

  const lowFallback = `${baseEntityId}_low_resolution_channel${insecureSuffix}`;
  if (state.cameraEntities.has(lowFallback)) {
    return lowFallback;
  }

  return entityId;
}

function updateCameraEntityLookup(allStates) {
  state.cameraEntities = new Map(
    allStates
      .filter((entity) => entity.entity_id.startsWith("camera."))
      .map((entity) => [entity.entity_id, entity])
  );
}

function updateDetectionState(allStates) {
  state.detectionEntities = new Map(
    allStates
      .filter((entity) => entity.entity_id.startsWith("binary_sensor."))
      .map((entity) => [entity.entity_id, entity])
  );

  const cameraEvents = new Map();
  const activeCandidates = [];

  state.config.cameras.forEach((camera) => {
    if (!camera.entityId) {
      return;
    }

    const detection = getCameraDetectionSignals(camera.entityId);
    const candidates = detection.all;
    const latestEvent = candidates.reduce((latest, entity) => {
      const timestamp = entity && entity.last_changed ? Date.parse(entity.last_changed) : 0;
      return timestamp > latest ? timestamp : latest;
    }, 0);

    cameraEvents.set(camera.entityId, latestEvent);

    const primaryActive = detection.primary.some((entity) => entity.state === "on");
    const dogActive = detection.dog ? detection.dog.state === "on" : false;
    const isCurrentlyActive = primaryActive || dogActive;
    if (!isCurrentlyActive) {
      return;
    }

    const priority = primaryActive ? 2 : 1;
    activeCandidates.push({
      entityId: camera.entityId,
      timestamp: latestEvent,
      priority
    });
  });

  state.cameraEventTimestamps = cameraEvents;

  if (!activeCandidates.length) {
    state.activeDetectionCameraId = null;
    return;
  }

  const currentActiveCandidate = state.activeDetectionCameraId
    ? activeCandidates.find((candidate) => candidate.entityId === state.activeDetectionCameraId)
    : null;

  if (currentActiveCandidate) {
    return;
  }

  const nextActive = activeCandidates.sort((left, right) => {
    if (left.priority !== right.priority) {
      return right.priority - left.priority;
    }

    return right.timestamp - left.timestamp;
  })[0] || null;

  state.activeDetectionCameraId = nextActive ? nextActive.entityId : null;
}

async function refreshCameraSnapshots() {
  if (!state.config.haUrl || document.hidden) {
    return;
  }

  const images = Array.from(document.querySelectorAll("img[data-camera-entity-id]"));
  images.forEach((image) => {
    if (image.dataset.cameraMode === "modal") {
      refreshSingleCameraImage(image);
      return;
    }

    if (image.dataset.cameraMode === "featured") {
      refreshSingleCameraImage(image);
      return;
    }

    if (!state.dragPointerId && isCameraImageWorthRefreshing(image)) {
      refreshSingleCameraImage(image);
    }
  });
}

function isCameraImageWorthRefreshing(image) {
  if (!image || !image.isConnected) {
    return false;
  }

  const rect = image.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;

  return rect.bottom >= -80 &&
    rect.right >= -80 &&
    rect.top <= viewportHeight + 80 &&
    rect.left <= viewportWidth + 80;
}

function buildCameraSnapshotCacheKey(camera, useSubStream = false) {
  if (!camera || !camera.entityId) {
    return "";
  }

  return `${camera.entityId}::${useSubStream ? "sub" : "main"}`;
}

function refreshSingleCameraImage(image, options = {}) {
  const entityId = image.dataset.cameraEntityId;
  if (!entityId) {
    return;
  }

  const cameraIndex = Number(image.dataset.cameraIndex || "-1");
  const camera = Number.isInteger(cameraIndex) && cameraIndex >= 0 ? state.config.cameras[cameraIndex] : null;
  const useSubStream = image.dataset.cameraMode === "row";
  const go2rtcSnapshotUrl = camera ? getGo2RtcSnapshotUrl(camera, useSubStream) : "";

  if (go2rtcSnapshotUrl) {
    const cacheKey = buildCameraSnapshotCacheKey(camera, useSubStream);
    if (image.dataset.cameraMode === "row" && image.dataset.go2rtc !== "true") {
      const nextStamp = String(getCameraEventTimestamp(entityId));
      if (!options.force && image.src && image.dataset.snapshotStamp === nextStamp) {
        return;
      }
      image.dataset.snapshotStamp = nextStamp;
    }

    const nextUrl = `${go2rtcSnapshotUrl}${go2rtcSnapshotUrl.includes("?") ? "&" : "?"}_ts=${Date.now()}`;
    const preloader = new Image();
    preloader.decoding = image.dataset.cameraMode === "row" ? "sync" : "async";
    preloader.onload = () => {
      image.src = nextUrl;
      image.dataset.go2rtc = "true";
      if (cacheKey) {
        state.cachedCameraSnapshotUrls.set(cacheKey, nextUrl);
        saveCameraPosterCache();
      }
    };
    preloader.src = nextUrl;
    return;
  }

  const entity = state.cameraEntities.get(entityId);
  if (!entity || !entity.attributes || !entity.attributes.access_token) {
    return;
  }

  if (state.cameraRefreshInFlight.has(entityId)) {
    return;
  }

  if (image.dataset.cameraMode === "row") {
    const nextStamp = String(getCameraEventTimestamp(entityId));
    if (!options.force && image.src && image.dataset.snapshotStamp === nextStamp) {
      return;
    }
    image.dataset.snapshotStamp = nextStamp;
  }

  state.cameraRefreshInFlight.add(entityId);
  const nextUrl = `${buildProtectedCameraSnapshotUrl(entityId, entity.attributes.access_token)}&_ts=${Date.now()}`;
  const preloader = new Image();
  preloader.decoding = "async";
  preloader.onload = () => {
    image.src = nextUrl;
    if (image.dataset.cameraMode === "row") {
      image.dataset.fallbackSrc = nextUrl;
      const cameraIndex = Number(image.dataset.cameraIndex || "-1");
      const camera = Number.isInteger(cameraIndex) && cameraIndex >= 0 ? state.config.cameras[cameraIndex] : null;
      const cacheKey = buildCameraSnapshotCacheKey(camera, true);
      if (cacheKey) {
        state.cachedCameraSnapshotUrls.set(cacheKey, nextUrl);
        saveCameraPosterCache();
      }
    }
    if (image.dataset.cameraMode === "modal") {
      elements.cameraModalViewport.classList.add("ready");
    }
    state.cameraRefreshInFlight.delete(entityId);
  };
  preloader.onerror = () => {
    state.cameraRefreshInFlight.delete(entityId);
  };
  preloader.src = nextUrl;
}

function getProtectedCameraSnapshotUrl(entityId, options = {}) {
  const entity = state.cameraEntities.get(entityId);
  if (!entity || !entity.attributes || !entity.attributes.access_token) {
    return "";
  }

  if (options.direct) {
    return buildProtectedCameraSnapshotUrlDirect(entityId, entity.attributes.access_token);
  }

  return buildProtectedCameraSnapshotUrl(entityId, entity.attributes.access_token);
}

function getProtectedCameraStreamUrl(entityId, options = {}) {
  const entity = state.cameraEntities.get(entityId);
  if (!entity || !entity.attributes || !entity.attributes.access_token) {
    return "";
  }

  if (options.direct) {
    return buildProtectedCameraStreamUrlDirect(entityId, entity.attributes.access_token);
  }

  return "";
}


function getVisibleCameraSource(camera) {
  if (!camera || !camera.entityId) {
    return "";
  }

  const lowEntityId = resolveCameraEntityId(camera.entityId, "low");
  const mediumEntityId = resolveCameraEntityId(camera.entityId, "medium");
  const selector = [
    `img[data-camera-entity-id="${cssEscape(lowEntityId)}"]`,
    `img[data-camera-entity-id="${cssEscape(mediumEntityId)}"][data-camera-mode="featured"]`,
    `img[data-camera-entity-id="${cssEscape(camera.entityId)}"]`
  ].join(",");
  const visibleImage = document.querySelector(selector);
  return visibleImage && visibleImage.src ? visibleImage.src : "";
}

function getCameraEventTimestamp(entityId) {
  const baseEntityId = entityId.replace(/_(low|medium|high)_resolution_channel(?:_insecure)?$/, "");
  const cameraEntityId = `${baseEntityId}_medium_resolution_channel`;
  return state.cameraEventTimestamps.get(cameraEntityId) || state.cameraEventTimestamps.get(`${baseEntityId}_low_resolution_channel`) || state.cameraEventTimestamps.get(`${baseEntityId}_high_resolution_channel`) || 0;
}

function cssEscape(value) {
  if (window.CSS && typeof window.CSS.escape === "function") {
    return window.CSS.escape(value);
  }

  return String(value).replace(/"/g, "\\\"");
}

function getCameraSlug(entityId) {
  return entityId
    .replace(/^camera\./, "")
    .replace(/_medium_resolution_channel(?:_insecure)?$/, "")
    .replace(/_high_resolution_channel(?:_insecure)?$/, "")
    .replace(/_low_resolution_channel(?:_insecure)?$/, "");
}

function getCameraPlayerPosition(camera) {
  const slug = camera && camera.entityId ? getCameraSlug(camera.entityId) : "";
  if (slug === "front_door") {
    return "front_door";
  }
  return "center";
}

function isWidescreenCropCamera(camera) {
  return Boolean(camera && camera.entityId && getCameraSlug(camera.entityId) === "front_door");
}

function isCenteredPrimaryCamera(camera) {
  return Boolean(camera && camera.entityId && getCameraSlug(camera.entityId) === "front_door");
}

function initCameraPrewarmLayer() {
  const layer = document.createElement("div");
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  state.cameraPrewarmLayer = layer;
}

function prewarmCameraPopup(camera) {
  const url = getGo2RtcPopupUrl(camera);
  if (!url || state.prewarmedCameraFrames.has(url) || state.prewarmedCameraFrames.size >= 3) {
    return;
  }

  const frame = createCameraFrame(url, getCameraDisplayName(camera));
  frame.dataset.prewarmUrl = url;
  frame.style.width = "1px";
  frame.style.height = "1px";
  frame.style.position = "absolute";
  frame.style.opacity = "0.01";
  frame.style.pointerEvents = "none";
  state.cameraPrewarmLayer.appendChild(frame);
  state.prewarmedCameraFrames.set(url, frame);
}

function createCameraFrame(url, title) {
  const frame = document.createElement("iframe");
  frame.loading = "eager";
  frame.referrerPolicy = "no-referrer";
  frame.allow = "autoplay; fullscreen; picture-in-picture";
  frame.title = title;
  frame.src = url;
  return frame;
}

function takePrewarmedCameraFrame(url) {
  const frame = state.prewarmedCameraFrames.get(url);
  if (!frame) {
    return null;
  }

  state.prewarmedCameraFrames.delete(url);
  frame.style.width = "";
  frame.style.height = "";
  frame.style.position = "";
  frame.style.opacity = "";
  frame.style.pointerEvents = "";
  return frame;
}

function storePrewarmedCameraFrame(frame) {
  const url = frame.dataset.prewarmUrl;
  if (!url) {
    return;
  }

  frame.style.width = "1px";
  frame.style.height = "1px";
  frame.style.position = "absolute";
  frame.style.opacity = "0.01";
  frame.style.pointerEvents = "none";
  state.cameraPrewarmLayer.appendChild(frame);
  state.prewarmedCameraFrames.set(url, frame);
}

function getCameraDisplayName(camera) {
  return shortenCameraName(camera && camera.name ? camera.name : "Camera");
}

function shortenCameraName(name) {
  const normalized = String(name || "Camera")
    .replace(/\s*medium.*$/i, "")
    .replace(/\s*low.*$/i, "")
    .replace(/\s*high.*$/i, "")
    .trim();

  const aliases = {
    "Bag indgang": "Bagdør",
    "Back yard": "Back yard",
    "Front yard": "Front yard",
    "Langs huset": "Side",
    "Terrace Syd": "South terrace",
    "Play area": "Play area",
    "FrontDoor": "Front door",
    "Driveway": "Driveway"
  };

  return aliases[normalized] || normalized;
}

function isCameraDetectionActive(camera) {
  if (!camera || !camera.entityId) {
    return false;
  }

  const detection = getCameraDetectionSignals(camera.entityId);
  return detection.all.some((entity) => entity.state === "on");
}

function getCameraDetectionSignals(entityId) {
  const slug = getCameraSlug(entityId);
  const person = state.detectionEntities.get(`binary_sensor.${slug}_person_detected`);
  const vehicle = state.detectionEntities.get(`binary_sensor.${slug}_vehicle_detected`);
  const dog = state.detectionEntities.get(`binary_sensor.${slug}_dog_detected`);

  return {
    primary: [person, vehicle].filter(Boolean),
    dog,
    all: [person, vehicle, dog].filter(Boolean)
  };
}

function toggleSettingsButtons(disabled) {
  elements.testConnectionButton.disabled = disabled;
  elements.suggestEntitiesButton.disabled = disabled;
  elements.loginWithHaButton.disabled = disabled;
  elements.useTokenButton.disabled = disabled;
  elements.logoutHaButton.disabled = disabled || !hasOAuthSession(state.config);
}

function showSettingsFeedback(type, title, body) {
  elements.settingsFeedback.hidden = false;
  elements.settingsFeedback.className = `settings-feedback ${type}`;
  elements.settingsFeedbackTitle.textContent = title;
  elements.settingsFeedbackBody.textContent = body;
}

function buildUserFacingError(error) {
  const message = error && error.message ? error.message : "Unknown error while talking to Home Assistant.";

  if (message === "HA_AUTH_MISSING") {
    return "Der mangler en aktiv Home Assistant-login-session eller et manuelt token.";
  }
  if (message.startsWith("HA_AUTH_")) {
    return `Home Assistant-login fejlede med ${message.replace("HA_AUTH_", "HTTP ")}. Prøv at logge ind igen eller brug manuelt token.`;
  }
  if (message === "Failed to fetch") {
    return "Browseren kunne ikke nå Home Assistant. Tjek URL'en, at nginx proxyer `/ha`, og at der ikke er mixed-content eller netværksproblemer.";
  }
  if (message === "HA_HTTP_401") {
    return "Home Assistant afviste login eller token med 401 Unauthorized. Log ind igen eller indsæt et gyldigt long-lived access token.";
  }
  if (message === "HA_HTTP_403") {
    return "Home Assistant svarede 403 Forbidden. Tokenet eller proxyen giver ikke adgang til API'et.";
  }
  if (message === "HA_HTTP_404") {
    return "API-stien blev ikke fundet. Tjek at Home Assistant er tilgængelig på `/ha` eller brug den fulde HA-URL.";
  }
  if (message.startsWith("HA_HTTP_")) {
    return `Home Assistant API svarede med ${message.replace("HA_HTTP_", "HTTP ")}. Tjek URL, token og proxyopsætning.`;
  }

  return message;
}

function formatNextDanishHoliday(fromDate) {
  const year = fromDate.getFullYear();
  const candidates = [
    ...buildDanishHolidayList(year),
    ...buildDanishHolidayList(year + 1)
  ]
    .filter((holiday) => holiday.date >= startOfDay(fromDate))
    .sort((left, right) => left.date - right.date);

  const next = candidates[0];
  if (!next) {
    return "";
  }

  const label = next.date.toLocaleDateString("da-DK", { day: "numeric", month: "long" });
  return `Næste mærkedag: ${next.name} · ${label}`;
}

function buildDanishHolidayList(year) {
  const easterSunday = getEasterSunday(year);
  return [
    { name: "Nytårsdag", date: new Date(year, 0, 1) },
    { name: "Palmesøndag", date: addDays(easterSunday, -7) },
    { name: "Skærtorsdag", date: addDays(easterSunday, -3) },
    { name: "Langfredag", date: addDays(easterSunday, -2) },
    { name: "Påskedag", date: easterSunday },
    { name: "2. påskedag", date: addDays(easterSunday, 1) },
    { name: "Store bededag", date: addDays(easterSunday, 26) },
    { name: "Kristi himmelfartsdag", date: addDays(easterSunday, 39) },
    { name: "Pinsedag", date: addDays(easterSunday, 49) },
    { name: "2. pinsedag", date: addDays(easterSunday, 50) },
    { name: "Grundlovsdag", date: new Date(year, 5, 5) },
    { name: "Juleaftensdag", date: new Date(year, 11, 24) },
    { name: "Juledag", date: new Date(year, 11, 25) },
    { name: "2. juledag", date: new Date(year, 11, 26) },
    { name: "Nytårsaftensdag", date: new Date(year, 11, 31) }
  ];
}

function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return startOfDay(copy);
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function renderSceneOverview(weatherEntity, powerEntity, priceEntity, priceForecastEntity = null, vehicleData = null, securityData = null) {
  state.lastSceneData = { weatherEntity, powerEntity, priceEntity, priceForecastEntity, vehicleData, securityData };
  renderUtilityToggleState();

  if (!weatherEntity) {
    elements.weatherStateValue.textContent = "--";
    elements.weatherMeta.textContent = "Vejrdata ikke tilgængelig";
    elements.weatherDetailsButton.disabled = true;
    elements.weatherForecast.innerHTML = "";
    if (elements.weatherHeroIcon) {
      elements.weatherHeroIcon.textContent = "☾";
    }
    if (elements.weatherCard) {
      elements.weatherCard.dataset.weatherVisual = "night";
    }
  } else {
    const weatherState = translateWeatherState(weatherEntity.state);
    const weatherVisual = getWeatherVisual(weatherEntity.state);
    const temperature = weatherEntity.attributes && weatherEntity.attributes.temperature !== undefined
      ? `${formatNumber(weatherEntity.attributes.temperature, 1)} °C`
      : weatherState;
    const wind = weatherEntity.attributes && weatherEntity.attributes.wind_speed !== undefined
      ? `${formatNumber(weatherEntity.attributes.wind_speed, 1)} ${formatWeatherSpeedUnit(weatherEntity.attributes.wind_speed_unit)} vind`
      : weatherState;
    elements.weatherStateValue.textContent = temperature;
    const humidity = weatherEntity.attributes && weatherEntity.attributes.humidity !== undefined
      ? `${Math.round(Number(weatherEntity.attributes.humidity))}% fugt`
      : "";
    elements.weatherMeta.textContent = [weatherState, wind, humidity].filter(Boolean).join(" · ");
    elements.weatherDetailsButton.disabled = false;
    if (elements.weatherHeroIcon) {
      elements.weatherHeroIcon.textContent = weatherVisual.icon;
    }
    if (elements.weatherCard) {
      elements.weatherCard.dataset.weatherVisual = weatherVisual.visual;
    }
    renderWeatherForecast(weatherEntity, state.weatherForecasts);
  }

  const utilityConfig = getActiveUtilityConfig();
  const allStates = state.lastAllStates || [];
  const utilityTodayEntity = allStates.find((entity) => entity.entity_id === utilityConfig.todayEntityId) || null;
  if (elements.utilityNowLabel) {
    elements.utilityNowLabel.textContent = utilityConfig.label;
  }

  if (!powerEntity || !hasUsefulValue(powerEntity.state)) {
    elements.powerNowValue.textContent = "--";
    elements.powerNowMeta.textContent = utilityConfig.emptyLabel;
  } else {
    elements.powerNowValue.textContent = formatUtilityEntityValue(powerEntity, utilityConfig);
    elements.powerNowMeta.textContent = formatUtilityMeta(utilityTodayEntity, utilityConfig);
  }

  renderPowerMiniChart(state.powerHistorySeries);
  renderVehicleBatteryCard(vehicleData);
  renderSecurityCard(securityData);
  renderMailCard(securityData);

  renderPriceCard(priceEntity, priceForecastEntity);
}

function getWeatherVisual(rawState) {
  const normalized = String(rawState || "").toLowerCase().trim();

  if (/(lightning|thunder)/.test(normalized)) {
    return { icon: "⚡", visual: "storm" };
  }
  if (/(pouring|rainy|rain|hail|shower)/.test(normalized)) {
    return { icon: "☔", visual: "rain" };
  }
  if (/(snowy|snow|sleet|ice)/.test(normalized)) {
    return { icon: "❄", visual: "snow" };
  }
  if (/(fog|mist|haze|foggy)/.test(normalized)) {
    return { icon: "○", visual: "fog" };
  }
  if (/(windy|wind)/.test(normalized)) {
    return { icon: "➝", visual: "wind" };
  }
  if (/(partlycloudy|partly cloudy|cloudy|overcast)/.test(normalized)) {
    return { icon: "☁", visual: "cloud" };
  }
  if (/(sunny|clear-day|clear)/.test(normalized)) {
    return { icon: "☀", visual: "sun" };
  }

  return { icon: "☾", visual: "night" };
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen låse eller alarm fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Låse";
  elements.securityAlarmMeta.textContent = securityData.alarm
    ? `${getFriendlyName(securityData.alarm)} ? ${securityData.locks.length} låse`
    : `${securityData.locks.length} låse fundet`;

  elements.securityLockList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  securityData.locks.slice(0, 6).forEach((lock) => {
    const chip = document.createElement("div");
    chip.className = `security-lock-chip ${getLockStateClass(lock.state)}`;
    chip.title = `${getSecurityShortLabel(lock)} ? ${formatSecurityState(lock)}`;
    chip.setAttribute("aria-label", `${getSecurityShortLabel(lock)} ${formatSecurityState(lock)}`);
    chip.innerHTML = `
      <span class="security-lock-glyph">${getSecurityGlyph(lock)}</span>
      <strong>${formatSecurityState(lock)}</strong>
    `;
    fragment.appendChild(chip);
  });
  elements.securityLockList.appendChild(fragment);
}

function renderPowerMiniChart(series) {
  const utilityConfig = getActiveUtilityConfig();
  const isWaterChart = utilityConfig.chartUnit === "m³";
  const signature = buildPowerMiniSignature(series);
  if (signature === state.powerMiniSignature) {
    return;
  }
  state.powerMiniSignature = signature;

  elements.powerMiniChart.innerHTML = "";
  elements.powerMiniChart.classList.toggle("is-water", isWaterChart);

  if (!series.length) {
    elements.powerMiniCaption.textContent = "Ingen historik endnu";
    return;
  }

  const rawMax = Math.max(...series.map((item) => item.value), 1);
  const max = Math.min(17000, getNicePowerScaleMax(rawMax));
  const min = 0;
  const width = 100;
  const height = 72;
  const topPadding = 8;
  const bottomPadding = 10;
  const chartHeight = height - topPadding - bottomPadding;
  const points = series.map((item, index) => {
    const x = series.length === 1 ? width / 2 : (index / (series.length - 1)) * width;
    const clamped = Math.min(Math.max(item.value, min), max);
    const y = topPadding + (chartHeight - ((clamped - min) / (max - min)) * chartHeight);
    return { x, y, value: item.value, label: item.label };
  });

  const linePath = buildSmoothSvgPath(points);
  const areaPath = `${linePath} L ${width},${height - bottomPadding} L 0,${height - bottomPadding} Z`;
  const latest = points[points.length - 1];
  const normalized = Math.min(Math.max((latest.value - min) / (max - min), 0), 1);
  const hue = 160 - (normalized * 160);
  const scaleLabel = max >= 1000 ? `${formatNumber(max / 1000, 1)} kW` : `${Math.round(max)} W`;

  elements.powerMiniChart.innerHTML = `
    <div class="power-mini-shell">
      <span class="power-mini-scale power-mini-scale-top">${scaleLabel}</span>
      <span class="power-mini-scale power-mini-scale-bottom">0</span>
      <svg class="power-mini-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Forbrug over dagen som linjegraf">
        <defs>
          <linearGradient id="powerLineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stop-color="hsl(44 96% 60%)"></stop>
            <stop offset="100%" stop-color="hsl(${Math.max(28 - normalized * 18, 12)} 94% 56%)"></stop>
          </linearGradient>
          <linearGradient id="powerAreaGradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="hsla(42 95% 60% / 0.34)"></stop>
            <stop offset="100%" stop-color="hsla(28 88% 48% / 0)"></stop>
          </linearGradient>
        </defs>
        <line class="power-mini-grid" x1="0" y1="${topPadding}" x2="${width}" y2="${topPadding}"></line>
        <line class="power-mini-grid power-mini-grid-mid" x1="0" y1="${topPadding + chartHeight / 2}" x2="${width}" y2="${topPadding + chartHeight / 2}"></line>
        <line class="power-mini-grid" x1="0" y1="${height - bottomPadding}" x2="${width}" y2="${height - bottomPadding}"></line>
        <path class="power-mini-area" d="${areaPath}"></path>
        <path class="power-mini-line" d="${linePath}"></path>
        <circle class="power-mini-dot" cx="${latest.x}" cy="${latest.y}" r="2.4"></circle>
      </svg>
    </div>
  `;
  elements.powerMiniChart.title = `${latest.label} ? ${latest.value >= 1000 ? formatNumber(latest.value / 1000, 2) + " kW" : Math.round(latest.value) + " W"} / 17,00 kW max`;
  elements.powerMiniCaption.textContent = `Forbrug over dagen ? ${series[series.length - 1].label}`;
}

function getTodayPowerConsumption(series) {
  if (!Array.isArray(series) || !series.length) {
    return 0;
  }

  const intervals = series.length;
  const hoursPerSample = 24 / intervals;
  const wattHours = series.reduce((sum, item) => sum + (Number(item.value) * hoursPerSample), 0);
  return wattHours / 1000;
}

function getNicePowerScaleMax(value) {
  const steps = [1000, 2000, 3000, 5000, 7000, 10000, 12000, 15000, 17000];
  return steps.find((step) => value <= step) || 17000;
}

function extractSecurityData(allStates) {
  const alarm = allStates.find((entity) =>
    entity.entity_id.startsWith("alarm_control_panel.") &&
    !/vehicle|vehicle|vehicle|vehicle|car/i.test(entity.entity_id + getFriendlyName(entity))
  ) || null;

  const orderedMatchers = [
    { key: "utility", patterns: [/brygger/], domains: ["lock"] },
    { key: "front", patterns: [/front/, /front/], domains: ["lock"] },
    { key: "garage", patterns: [/garage.*d[?o]r/, /garaged[?o]r/, /garage/], domains: ["lock"] },
    { key: "garageport", ids: ["binary_sensor.garageport_contact"], domains: ["binary_sensor", "cover"] },
    { key: "terrace", ids: ["binary_sensor.terracedor_las_contact"], patterns: [/terrace/], domains: ["binary_sensor", "lock", "cover"] }
  ];

  const taken = new Set();
  const locks = [];

  orderedMatchers.forEach((matcher) => {
    const entity = findSecurityEntityMatch(allStates, matcher, taken);
    if (entity) {
      taken.add(entity.entity_id);
      locks.push(entity);
    }
  });

  const fallback = allStates
    .filter((entity) => /^(lock|cover|binary_sensor)\./.test(entity.entity_id))
    .filter((entity) => !taken.has(entity.entity_id))
    .filter((entity) => !/vehicle|vehicle|vehicle|vehicle|car|charger|window|vindue/i.test(entity.entity_id + getFriendlyName(entity)))
    .filter((entity) => /(d[?o]r|door|garage|port|gate|terrace|brygger|front)/i.test(entity.entity_id + getFriendlyName(entity)))
    .slice(0, 3);

  locks.push(...fallback);

  return { alarm, locks };
}

function findSecurityEntityMatch(allStates, matcher, taken) {
  if (Array.isArray(matcher.ids)) {
    for (const id of matcher.ids) {
      const exact = allStates.find((entity) => entity.entity_id === id && !taken.has(entity.entity_id));
      if (exact) {
        return exact;
      }
    }
  }

  return allStates.find((entity) => {
    if (taken.has(entity.entity_id)) {
      return false;
    }
    const domain = entity.entity_id.split(".")[0];
    if (matcher.domains && !matcher.domains.includes(domain)) {
      return false;
    }
    const source = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
    return Array.isArray(matcher.patterns) && matcher.patterns.some((pattern) => pattern.test(source));
  }) || null;
}

function shortenSecurityName(name) {
  const shortened = name
    .replace(/\b(front|main|door|lock|lås)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return shortened || name;
}

function formatAlarmState(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "disarmed") return "Frakoblet";
  if (normalized === "armed_home") return "Hjemme";
  if (normalized === "armed_away") return "Ude";
  if (normalized === "armed_night") return "Nat";
  if (normalized === "triggered") return "Alarm";
  if (normalized === "arming") return "Aktiverer";
  if (normalized === "pending") return "Afventer";
  return normalized || "--";
}

function formatLockState(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "locked") return "Låst";
  if (normalized === "unlocked") return "Ulåst";
  if (normalized === "locking") return "Låser";
  if (normalized === "unlocking") return "Låser op";
  return normalized || "--";
}

function getLockStateClass(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "locked" || normalized === "locking") return "is-locked";
  if (normalized === "unlocked" || normalized === "unlocking") return "is-unlocked";
  if (normalized === "on" || normalized === "open" || normalized === "opening") return "is-unlocked";
  if (normalized === "off" || normalized === "closed" || normalized === "closing") return "is-locked";
  return "is-unknown";
}

function formatSecurityState(entity) {
  const domain = entity.entity_id.split(".")[0];
  const normalized = String(entity.state || "").toLowerCase();
  if (domain === "binary_sensor") {
    if (normalized === "on") return "Åben";
    if (normalized === "off") return "Lukket";
  }
  if (domain === "cover") {
    if (normalized === "open") return "Åben";
    if (normalized === "closed") return "Lukket";
    if (normalized === "opening") return "Åbner";
    if (normalized === "closing") return "Lukker";
  }
  return formatLockState(entity.state);
}

function getSecurityShortLabel(entity) {
  const source = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
  if (/garage|port|gate/.test(source)) return "Garage";
  if (/terrace/.test(source)) return "Terrace";
  if (/brygger/.test(source)) return "Utility";
  if (/front/.test(source)) return "Hoveddør";
  if (/bag/.test(source)) return "Bagdør";
  return shortenSecurityName(getFriendlyName(entity));
}

function getSecurityGlyph(entity) {
  const source = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
  if (/garageport|port|gate/.test(source)) return "→";
  if (/garage/.test(source)) return "▦";
  if (/terrace/.test(source)) return "◫";
  if (/front/.test(source)) return "⌂";
  if (/brygger/.test(source)) return "▤";
  if (/door|dør|bag/.test(source)) return "▥";
  return "◧";
}

function buildSmoothSvgPath(points) {
  if (!points.length) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x},${points[0].y}`;
  }

  let path = `M ${points[0].x},${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX},${current.y} ${controlX},${next.y} ${next.x},${next.y}`;
  }
  return path;
}

function findVehicleBatteryEntity(allStates) {
  const preferred = allStates.filter((entity) => {
    const id = entity.entity_id.toLowerCase();
    const name = getFriendlyName(entity).toLowerCase();
    return (
      id.startsWith("sensor.") &&
      (id.includes("battery") || name.includes("battery")) &&
      (id.includes("vehicle") || name.includes("vehicle") || id.includes("vehicle") || id.includes("vehicle") || name.includes("vehicle") || name.includes("vehicle"))
    );
  });

  if (!preferred.length) {
    return null;
  }

  return preferred.find((entity) => {
    const unit = entity.attributes && entity.attributes.unit_of_measurement;
    return unit === "%" || entity.entity_id.toLowerCase().includes("battery_level");
  }) || preferred[0];
}

function renderVehicleBatteryCard(vehicleData) {
  const batteryEntity = vehicleData && vehicleData.battery ? vehicleData.battery : null;

  if (!batteryEntity || !hasUsefulValue(batteryEntity.state)) {
    elements.vehicleBatteryValue.textContent = "--";
    elements.vehicleBatteryMeta.textContent = "No vehicle data yet";
    elements.vehicleChargePlan.innerHTML = "";
    const vehicleCard = document.getElementById("vehicleCard");
    if (vehicleCard) {
      vehicleCard.dataset.vehicleTone = "idle";
      vehicleCard.dataset.vehicleCharging = "off";
    }
    return;
  }

  const batteryPercent = Number(batteryEntity.state);
  const unit = batteryEntity.attributes && batteryEntity.attributes.unit_of_measurement ? ` ${batteryEntity.attributes.unit_of_measurement}` : "";
  const friendlyName = "Vehicle";
  const rangeValue = vehicleData && vehicleData.range && hasUsefulValue(vehicleData.range.state)
    ? Number(vehicleData.range.state)
    : (batteryEntity.attributes && (batteryEntity.attributes.battery_range ?? batteryEntity.attributes.rated_battery_range));
  const lookup = new Map((state.lastAllStates || []).map((entity) => [entity.entity_id, entity]));
  const chargePowerEntity = lookup.get("sensor.vehicle_charger_power") || lookup.get("sensor.vehicle_charger_power") || null;
  const energyTodayEntity = lookup.get("sensor.vehicle_charger_energy_today") || null;
  const scheduleEntity = lookup.get("sensor.vehicle_last_charge") || null;
  const rawChargePower = chargePowerEntity && hasUsefulValue(chargePowerEntity.state) ? Number(chargePowerEntity.state) : 0;
  const chargePowerKw = Number.isFinite(rawChargePower) ? (Math.abs(rawChargePower) > 100 ? rawChargePower / 1000 : rawChargePower) : 0;
  const energyToday = energyTodayEntity && hasUsefulValue(energyTodayEntity.state) ? Number(energyTodayEntity.state) : 0;
  const charging = chargePowerKw > 0.05;
  const scheduleState = scheduleEntity && hasUsefulValue(scheduleEntity.state) ? String(scheduleEntity.state).toLowerCase() : "";
  const rangeText = rangeValue !== null && rangeValue !== undefined && Number.isFinite(Number(rangeValue))
    ? `${formatNumber(rangeValue, 0)} km`
    : "--";

  elements.vehicleBatteryValue.textContent = `${Math.round(batteryPercent)}${unit}`.trim();
  elements.vehicleBatteryMeta.textContent = `${friendlyName} · ${rangeText}`;
  elements.vehicleChargePlan.innerHTML = `
    <div class="vehicle-compact-panel">
      <div class="vehicle-meter ${charging ? "active" : "idle"}" aria-hidden="true">
        ${buildVehicleBatterySegments(batteryPercent, charging)}
      </div>
      <div class="vehicle-compact-meta">
        <span class="vehicle-compact-label">${charging ? "Lader" : (scheduleState === "scheduled" ? "Scheduled" : "Status")}</span>
        <span class="vehicle-compact-value">${buildVehicleCompactSwap(charging, chargePowerKw, energyToday)}</span>
      </div>
      <span class="vehicle-card-icon" aria-hidden="true"></span>
    </div>
  `;

  const vehicleCard = document.getElementById("vehicleCard");
  if (vehicleCard) {
    vehicleCard.dataset.vehicleTone = getVehicleTone(batteryPercent);
    vehicleCard.dataset.vehicleCharging = charging ? "on" : "off";
  }
}

function getVehicleTone(percent) {
  if (percent < 10) return "critical";
  if (percent < 25) return "low";
  if (percent < 50) return "medium";
  if (percent < 80) return "good";
  return "full";
}

function buildVehicleBatterySegments(percent, charging) {
  const thresholds = [5, 20, 40, 60, 80];
  const tone = getVehicleTone(percent);
  return thresholds.map((threshold, index) => {
    const isOn = percent >= threshold;
    const classes = [
      "vehicle-battery-segment",
      isOn ? "is-on" : "is-off",
      isOn ? `is-${tone}` : "",
      charging && isOn ? `d${index + 1}` : ""
    ].filter(Boolean).join(" ");
    return `<span class="${classes}"></span>`;
  }).join("");
}

function buildVehicleCompactSwap(charging, chargePowerKw, energyToday) {
  const kwText = `${formatNumber(chargePowerKw, 1)} kW`;
  const kwhText = `${formatNumber(energyToday, 2)} kWh`;
  if (!charging) {
    return kwhText;
  }

  return `
    <span class="vehicle-swap-small" aria-label="${kwText} og ${kwhText}">
      <span class="a">${kwText}</span>
      <span class="b">${kwhText}</span>
    </span>
  `;
}

function buildVehicleModalMarkup(vehicleData) {
  const battery = vehicleData && vehicleData.battery ? vehicleData.battery : null;
  if (!battery) {
    return "<div class=\"calendar-loading\">No vehicle data yet</div>";
  }

  const lookup = new Map((state.lastAllStates || []).map((entity) => [entity.entity_id, entity]));
  const rows = [
    ["Batteri", `${battery.state}${battery.attributes && battery.attributes.unit_of_measurement ? ` ${battery.attributes.unit_of_measurement}` : ""}`],
    ["Rækkevidde", readEntityValue(lookup.get("sensor.vehicle_range"), "km")],
    ["Daglig kørsel", readEntityValue(lookup.get("sensor.vehicle_daily"), "km")],
    ["Ladepris", readEntityValue(lookup.get("sensor.vehicle_charging_price_estimate"), "kr")],
    ["Mangler væg-kWh", readEntityValue(lookup.get("sensor.vehicle_missing_wall_kwh"), "kWh")],
    ["Mangler batteri-kWh", readEntityValue(lookup.get("sensor.vehicle_missing_battery_kwh"), "kWh")],
    ["Ladeeffekt", readEntityValue(lookup.get("sensor.vehicle_charger_power"), "kW")],
    ["Ladetid tilbage", readEntityValue(lookup.get("sensor.vehicle_charging_time_remaining"))],
    ["Klar kl.", readEntityValue(lookup.get("sensor.vehicle_charging_finish_time"))],
    ["Udetemp", readEntityValue(lookup.get("sensor.vehicle_temperature_outside"), "C")],
    ["Indetemp", readEntityValue(lookup.get("sensor.vehicle_temperature_inside"), "C")],
    ["Døre", readEntityValue(lookup.get("lock.vehicle_doors"))],
    ["Vinduer", readEntityValue(lookup.get("cover.vehicle_windows"))],
    ["Charger", readEntityValue(lookup.get("binary_sensor.vehicle_charger"))],
    ["Online", readEntityValue(lookup.get("binary_sensor.vehicle_online"))],
    ["Sidst opdateret", readEntityValue(lookup.get("sensor.vehicle_data_last_update_time"))]
  ];

  const chargeStart = vehicleData.chargeStart && hasUsefulValue(vehicleData.chargeStart.state) ? vehicleData.chargeStart.state : "--";
  const chargeEnd = vehicleData.chargeEnd && hasUsefulValue(vehicleData.chargeEnd.state) ? vehicleData.chargeEnd.state : "--";
  const chargePrice = vehicleData.chargePrice && hasUsefulValue(vehicleData.chargePrice.state) ? `${formatNumber(vehicleData.chargePrice.state, 2)} kr` : "--";

  return `
    <div class="info-grid vehicle-info-grid">
      <article class="info-metric info-metric-wide">
        <span class="scene-metric-label">Billigste ladetid</span>
        <strong>${chargeStart} - ${chargeEnd}</strong>
        <p>Bedste pris ${chargePrice}</p>
      </article>
      ${rows.map(([label, value]) => `
        <article class="info-metric">
          <span class="scene-metric-label">${label}</span>
          <strong>${value || "--"}</strong>
        </article>
      `).join("")}
    </div>
  `;
}

function buildSecurityModalMarkup(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length)) {
    return "<div class=\"calendar-loading\">Ingen låse eller alarm fundet i Home Assistant.</div>";
  }

  const alarmMarkup = securityData.alarm ? `
    <article class="info-metric info-metric-wide security-modal-alarm">
      <span class="scene-metric-label">Alarm</span>
      <strong>${formatAlarmState(securityData.alarm.state)}</strong>
      <p>${getFriendlyName(securityData.alarm)}</p>
      <div class="security-actions">
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_disarm" data-entity-id="${securityData.alarm.entity_id}">Frakobl</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_home" data-entity-id="${securityData.alarm.entity_id}">Hjemme</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_away" data-entity-id="${securityData.alarm.entity_id}">Ude</button>
      </div>
    </article>
  ` : "";

  const locksMarkup = securityData.locks.map((lock) => `
    <article class="info-metric security-lock-metric">
      <span class="scene-metric-label">${shortenSecurityName(getFriendlyName(lock))}</span>
      <strong>${formatSecurityState(lock)}</strong>
      <p>${lock.entity_id}</p>
      <div class="security-actions">
        ${buildSecurityActionButtons(lock)}
      </div>
    </article>
  `).join("");

  return `
    <div class="info-grid security-info-grid">
      ${alarmMarkup}
      ${locksMarkup}
    </div>
  `;
}

renderMailCard = function renderMailCard(securityData) {
  if (!elements.mailCard || !elements.mailState || !elements.mailMeta || !elements.mailMeter) {
    return;
  }

  const mailItems = securityData && securityData.mailCount && hasUsefulValue(securityData.mailCount.state)
    ? Math.max(0, Number(securityData.mailCount.state) || 0)
    : 0;
  const mailToggleActive = Boolean(
    securityData &&
    securityData.hasMail &&
    String(securityData.hasMail.state || "").toLowerCase() === "on"
  );
  const hasMail = mailItems > 0 || mailToggleActive;

  elements.mailState.textContent = hasMail ? "Ny post" : "Tom";
  elements.mailMeta.textContent = hasMail
    ? (mailItems > 0 ? `${mailItems} registreringer i mailbox` : "Mail detected")
    : "Ingen post";
  elements.mailMeter.innerHTML = buildSecurityMailMeter(mailItems, hasMail);
  elements.mailCard.classList.toggle("is-active", hasMail);
  elements.mailCard.setAttribute("aria-label", hasMail ? "Ny post. Åbn mailboxoversigt" : "Tom mailbox. Åbn mailboxoversigt");

  if (elements.mailClearButton) {
    elements.mailClearButton.disabled = !securityData || !securityData.hasMail;
  }
};

renderSecurityCard = function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const mainState = counts.unsecured > 0 ? "Åben" : (securityData.locks.length ? "Låst" : "Ukendt");
  const alarmLabel = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Sikkerhed";
  const meterItems = securityData.locks.map((item) => {
    const domain = item.entity_id.split(".")[0];
    const normalized = String(item.state || "").toLowerCase();
    const secure = domain === "lock"
      ? normalized === "locked"
      : !(normalized === "on" || normalized === "open" || normalized === "opening");
    return `<span class="security-mini-meter-segment ${secure ? "is-secure" : "is-open"}"></span>`;
  }).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = mainState;
  elements.securityAlarmMeta.textContent = alarmLabel;
  elements.securityLockList.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <div class="security-summary-meter">${meterItems}</div>
      </div>
      <div class="security-summary-bg" aria-hidden="true">${counts.unsecured > 0 ? "?" : "?"}</div>
    </div>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${doorIssues > 0 ? "is-unlocked" : "is-locked"}" aria-label="Døre ${doorIssues}">
      <span class="security-lock-label">Døre</span>
      <strong>${doorIssues}</strong>
    </button>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${windowsOpen > 0 ? "is-unlocked" : "is-locked"}" aria-label="Vinduer ${windowsOpen}">
      <span class="security-lock-label">Vinduer</span>
      <strong>${windowsOpen}</strong>
    </button>
  `;
};

function buildMailModalMarkup() {
  const snapshotSources = [
    {
      label: "Carport",
      entityId: "input_text.mailbox_snapshot_one_url",
      fallback: "/local/snapshots/mailbox/camera_one_latest.jpg"
    },
    {
      label: "Front yard",
      entityId: "input_text.mailbox_snapshot_two_url",
      fallback: "/local/snapshots/mailbox/camera_two_latest.jpg"
    },
    {
      label: "Driveway",
      entityId: "input_text.mailbox_snapshot_three_url",
      fallback: "/local/snapshots/mailbox/camera_three_latest.jpg"
    }
  ];

  snapshotSources.sort((left, right) => {
    if (left.label === "Front yard") {
      return -1;
    }
    if (right.label === "Front yard") {
      return 1;
    }
    return 0;
  });

  const snapshots = snapshotSources.map((item) => {
    const entity = findEntityById(item.entityId);
    const url = hasUsefulValue(entity && entity.state) ? String(entity.state) : item.fallback;
    return {
      label: item.label,
      url
    };
  });

  const descriptionEntity = findEntityById("input_text.mailbox_ai_description");
  const description = hasUsefulValue(descriptionEntity && descriptionEntity.state)
    ? escapeHtml(String(descriptionEntity.state))
    : "Ingen beskrivelse endnu";

  return `
    <div class="mail-popup-card">
      <div class="mail-popup-head">
        <div class="mail-popup-title">Mailbox</div>
        <div class="mail-popup-badge">3 snapshots</div>
      </div>
      <div class="mail-popup-layout">
        <div class="mail-popup-carousel" aria-label="Mailbox snapshots">
          ${snapshots.map((snapshot, index) => `
            <figure class="mail-popup-slide" ${index === 0 ? 'data-active="true"' : ""}>
              <div class="post-popup-image-label">${snapshot.label}</div>
              <div class="post-popup-image">
                <img src="${snapshot.url}" alt="${snapshot.label} snapshot" loading="lazy">
              </div>
            </figure>
          `).join("")}
        </div>
        <div class="mail-popup-description-block">
          <div class="mail-popup-description-title">Seneste AI-beskrivelse</div>
          <div class="mail-popup-description">${description}</div>
          <div class="mail-popup-swipe-hint">Swipe for at se de andre billeder</div>
        </div>
      </div>
      <div class="mail-popup-bg mail-popup-bg-mailbox" aria-hidden="true"></div>
    </div>
  `;
}

renderSecurityCard = function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const mainState = counts.unsecured > 0 ? "Åben" : (securityData.locks.length ? "Låst" : "Ukendt");
  const alarmLabel = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Sikkerhed";
  const meterItems = securityData.locks.map((item) => {
    const domain = item.entity_id.split(".")[0];
    const normalized = String(item.state || "").toLowerCase();
    const secure = domain === "lock"
      ? normalized === "locked"
      : !(normalized === "on" || normalized === "open" || normalized === "opening");
    return `<span class="security-mini-meter-segment ${secure ? "is-secure" : "is-open"}"></span>`;
  }).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = mainState;
  elements.securityAlarmMeta.textContent = alarmLabel;
  elements.securityLockList.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <div class="security-summary-meter">${meterItems}</div>
      </div>
    </div>
  `;
  elements.securityCard?.classList.toggle("is-alert", counts.unsecured > 0);
};

function renderMailCard(securityData) {
  if (!elements.mailCard || !elements.mailState || !elements.mailMeta || !elements.mailMeter) {
    return;
  }

  const mailItems = securityData && securityData.mailCount && hasUsefulValue(securityData.mailCount.state)
    ? Math.max(0, Number(securityData.mailCount.state) || 0)
    : 0;
  const mailToggleActive = Boolean(
    securityData &&
    securityData.hasMail &&
    String(securityData.hasMail.state || "").toLowerCase() === "on"
  );
  const hasMail = mailItems > 0 || mailToggleActive;

  elements.mailState.textContent = hasMail ? "Ny post" : "Tom";
  elements.mailMeta.textContent = hasMail
    ? (mailItems > 0 ? `${mailItems} registreringer i mailbox` : "Mail detected")
    : "Ingen post";
  elements.mailMeter.innerHTML = buildSecurityMailMeter(mailItems, hasMail);
  elements.mailCard.classList.toggle("is-active", hasMail);
  elements.mailCard.setAttribute("aria-label", hasMail ? "Ny post. Åbn mailboxoversigt" : "Tom mailbox. Åbn mailboxoversigt");

  if (elements.mailClearButton) {
    elements.mailClearButton.disabled = !securityData || !securityData.hasMail;
  }
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const doorIssues = counts.unlocked + counts.open;
  const windowsOpen = counts.windows;
  const mainState = counts.unsecured > 0 ? "Åben" : (securityData.locks.length ? "Låst" : "Ukendt");
  const alarmLabel = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Sikkerhed";
  const meterItems = securityData.locks.map((item) => {
    const domain = item.entity_id.split(".")[0];
    const normalized = String(item.state || "").toLowerCase();
    const secure = domain === "lock"
      ? normalized === "locked"
      : !(normalized === "on" || normalized === "open" || normalized === "opening");
    return `<span class="security-mini-meter-segment ${secure ? "is-secure" : "is-open"}"></span>`;
  }).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = mainState;
  elements.securityAlarmMeta.textContent = alarmLabel;
  elements.securityLockList.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <div class="security-summary-meter">${meterItems}</div>
      </div>
      <div class="security-summary-bg" aria-hidden="true">${counts.unsecured > 0 ? "?" : "?"}</div>
    </div>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${doorIssues > 0 ? "is-unlocked" : "is-locked"}" aria-label="Døre ${doorIssues}">
      <span class="security-lock-label">Døre</span>
      <strong>${doorIssues}</strong>
    </button>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${windowsOpen > 0 ? "is-unlocked" : "is-locked"}" aria-label="Vinduer ${windowsOpen}">
      <span class="security-lock-label">Vinduer</span>
      <strong>${windowsOpen}</strong>
    </button>
  `;
}

function renderMailCard(securityData) {
  if (!elements.mailCard || !elements.mailState || !elements.mailMeta || !elements.mailMeter) {
    return;
  }

  const mailItems = securityData && securityData.mailCount && hasUsefulValue(securityData.mailCount.state)
    ? Math.max(0, Number(securityData.mailCount.state) || 0)
    : 0;
  const mailToggleActive = Boolean(
    securityData &&
    securityData.hasMail &&
    String(securityData.hasMail.state || "").toLowerCase() === "on"
  );
  const hasMail = mailItems > 0 || mailToggleActive;

  elements.mailState.textContent = hasMail ? "Ny post" : "Tom";
  elements.mailMeta.textContent = hasMail
    ? (mailItems > 0 ? `${mailItems} registreringer i mailbox` : "Mail detected")
    : "Ingen post";
  elements.mailMeter.innerHTML = buildSecurityMailMeter(mailItems, hasMail);
  elements.mailCard.classList.toggle("is-active", hasMail);
  elements.mailCard.setAttribute("aria-label", hasMail ? "Ny post. Åbn mailboxoversigt" : "Tom mailbox. Åbn mailboxoversigt");

  if (elements.mailClearButton) {
    elements.mailClearButton.disabled = !securityData || !securityData.hasMail;
  }
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const doorIssues = counts.unlocked + counts.open;
  const windowsOpen = counts.windows;
  const mainState = counts.unsecured > 0 ? "Åben" : (securityData.locks.length ? "Låst" : "Ukendt");
  const alarmLabel = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Sikkerhed";

  const meterItems = securityData.locks.map((item) => {
    const domain = item.entity_id.split(".")[0];
    const normalized = String(item.state || "").toLowerCase();
    const secure = domain === "lock"
      ? normalized === "locked"
      : !(normalized === "on" || normalized === "open" || normalized === "opening");
    return `<span class="security-mini-meter-segment ${secure ? "is-secure" : "is-open"}"></span>`;
  }).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = mainState;
  elements.securityAlarmMeta.textContent = alarmLabel;
  elements.securityLockList.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <div class="security-summary-meter">${meterItems}</div>
      </div>
      <div class="security-summary-bg" aria-hidden="true">${counts.unsecured > 0 ? "?" : "?"}</div>
    </div>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${doorIssues > 0 ? "is-unlocked" : "is-locked"}" aria-label="Døre ${doorIssues}">
      <span class="security-lock-label">Døre</span>
      <strong>${doorIssues}</strong>
    </button>
    <button type="button" class="security-lock-chip security-lock-chip-compact ${windowsOpen > 0 ? "is-unlocked" : "is-locked"}" aria-label="Vinduer ${windowsOpen}">
      <span class="security-lock-label">Vinduer</span>
      <strong>${windowsOpen}</strong>
    </button>
  `;
}

function buildLivingRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const targetEntity = findEntityById("number.smart_heating_styring_living_room_living_room_ai_mal_styring");
  const setPoint = targetEntity && hasUsefulValue(targetEntity.state)
    ? `${formatNumber(targetEntity.state, 1)}°`
    : thermostat && thermostat.attributes && thermostat.attributes.temperature !== undefined
      ? `${formatNumber(thermostat.attributes.temperature, 1)}°`
      : "--";
  const valveLabel = readLivingRoomValveLabel(thermostat);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Vindue åbent</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">LivingRoom</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}° <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `Føles som ${formatNumber(feels, 1)}°` : "Føles som --"}</p>
        </div>
        <div class="living_room-hero-controls">
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="0.5">+</button>
          <div class="living_room-setpoint">
            <span>${windowsOpen ? "OFF" : setPoint}</span>
            <strong>${valveLabel || "AI mål"}</strong>
          </div>
          <button
            type="button"
            class="living_room-setpoint living_room-climate-trigger ${coolingActive ? "is-active" : ""}"
            data-room-action="open-climate-panel"
            data-entity-id="${cooling && cooling.entity_id ? cooling.entity_id : "climate.climate_living_room"}"
          >
            <span>${coolingActive ? "AC aktiv" : "AC"}</span>
            <strong>${cooling && cooling.state ? escapeHtml(String(cooling.state)) : "Status"}</strong>
          </button>
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="-0.5">-</button>
        </div>
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securitySummary.innerHTML = `
      <div class="security-summary-mini">
        <div class="security-summary-main">
          <strong id="securityAlarmState">--</strong>
          <div class="security-summary-meter"></div>
          <p id="securityAlarmMeta" class="scene-metric-meta">Ingen sikkerhedsdata fundet</p>
        </div>
        <div class="security-summary-bg" aria-hidden="true">?</div>
      </div>
    `;
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const unsecuredDoors = counts.unlocked + counts.open;
  const windowsOpen = counts.windows;
  const allSecure = counts.unsecured === 0 && securityData.locks.length > 0;
  const alarmLabel = securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Sikkerhed";
  const valueLabel = counts.unsecured > 0 ? "Åben" : allSecure ? "Låst" : "Ukendt";
  const iconSymbol = securityData.alarm && String(securityData.alarm.state || "").toLowerCase() === "triggered"
    ? "?"
    : counts.unsecured > 0
      ? "?"
      : "?";
  const meterMarkup = securityData.locks.slice(0, 5).map((entity) => {
    const domain = entity.entity_id.split(".")[0];
    const normalized = String(entity.state || "").toLowerCase();
    const secure = domain === "lock"
      ? normalized === "locked"
      : !(normalized === "on" || normalized === "open" || normalized === "opening");
    return `<span class="security-mini-meter-segment ${secure ? "is-secure" : "is-open"}"></span>`;
  }).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securitySummary.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <strong id="securityAlarmState">${valueLabel}</strong>
        <div class="security-summary-meter">${meterMarkup}</div>
        <p id="securityAlarmMeta" class="scene-metric-meta">${escapeHtml(alarmLabel)}</p>
      </div>
      <div class="security-summary-bg" aria-hidden="true">${iconSymbol}</div>
    </div>
  `;

  elements.securityLockList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  [
    { label: "Døre", value: unsecuredDoors, tone: unsecuredDoors ? "is-unlocked" : "is-locked" },
    { label: "Vinduer", value: windowsOpen, tone: windowsOpen ? "is-unlocked" : "is-locked" }
  ].forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `security-lock-chip security-lock-chip-compact ${item.tone}`;
    chip.title = `${item.label}: ${item.value}. Åbn mere info`;
    chip.setAttribute("aria-label", `${item.label}: ${item.value}. Åbn sikkerhedsoversigt`);
    chip.innerHTML = `
      <span class="security-lock-label">${item.label}</span>
      <strong>${item.value}</strong>
    `;
    fragment.appendChild(chip);
  });
  elements.securityLockList.appendChild(fragment);
}

const ROOM_POPUP_CONFIGS = {};

async function handleRoomModalClick(event) {
  const tabButton = event.target.closest("[data-room-tab]");
  if (tabButton) {
    state.roomModalView = tabButton.dataset.roomTab || "lights";
    refreshOpenRoomModal();
    return;
  }

  const actionButton = event.target.closest("[data-room-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.roomAction;
  actionButton.disabled = true;

  try {
    if (action === "number-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const numberEntity = findEntityById(entityId);
      const current = Number(numberEntity && numberEntity.state);
      const min = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.min : NaN);
      const max = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.max : NaN);
      const step = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.step : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const rawNext = base + delta;
      const clamped = Math.min(Number.isFinite(max) ? max : rawNext, Math.max(Number.isFinite(min) ? min : rawNext, rawNext));
      const resolvedStep = Number.isFinite(step) && step > 0 ? step : 0.5;
      const nextValue = Math.round(clamped / resolvedStep) * resolvedStep;
      await callHomeAssistantService(state.config, "number", "set_value", {
        entity_id: entityId,
        value: Math.round(nextValue * 100) / 100
      });
    } else if (action === "climate-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const nextTemperature = Math.round((base + delta) * 10) / 10;
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: nextTemperature
      });
    } else if (action === "toggle-entity") {
      const entityId = actionButton.dataset.entityId;
      await toggleEntityFromModal(entityId);
    } else if (action === "run-script") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "script", "turn_on", { entity_id: entityId });
    } else if (action === "activate-scene") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "scene", "turn_on", { entity_id: entityId });
    } else if (action === "vacuum-service") {
      const entityId = actionButton.dataset.entityId;
      const service = actionButton.dataset.service;
      if (!entityId || !service) {
        throw new Error("VACUUM_ACTION_MISSING");
      }
      await callHomeAssistantService(state.config, "vacuum", service, { entity_id: entityId });
    } else if (action === "open-climate-panel") {
      const entityId = actionButton.dataset.entityId || "";
      state.activeRoomClimateEntityId = state.activeRoomClimateEntityId === entityId ? "" : entityId;
      refreshOpenRoomModal();
      return;
    } else if (action === "climate-mode") {
      const entityId = actionButton.dataset.entityId;
      const hvacMode = actionButton.dataset.hvacMode;
      await callHomeAssistantService(state.config, "climate", "set_hvac_mode", {
        entity_id: entityId,
        hvac_mode: hvacMode
      });
    } else if (action === "climate-temp-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const min = Number(climate && climate.attributes ? climate.attributes.min_temp : NaN);
      const max = Number(climate && climate.attributes ? climate.attributes.max_temp : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const nextValue = Math.min(Number.isFinite(max) ? max : base + delta, Math.max(Number.isFinite(min) ? min : base + delta, base + delta));
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: Math.round(nextValue * 10) / 10
      });
    }

    await refreshDashboard();
    refreshOpenRoomModal();
  } catch (error) {
    console.error(error);
    actionButton.disabled = false;
  }
}

function buildRoomModalMarkup(room) {
  const popupConfigs = getRoomPopupConfigMap();
  if (room && popupConfigs[room.key]) {
    return buildConfiguredRoomModalMarkup(room, state.roomModalView || "lights", popupConfigs[room.key]);
  }

  return buildDefaultRoomModalMarkup(room);
}

function buildDefaultRoomModalMarkup(room) {
  const sections = [
    { label: "Presence", value: room.presenceLabel, meta: room.presence ? room.presence.entity_id : "Ingen presence fundet" },
    { label: "Temperatur", value: room.temperatureLabel, meta: room.temperature ? room.temperature.entity_id : "Ingen temperatur fundet" },
    { label: "Fugt", value: room.humidityLabel, meta: room.humidity ? room.humidity.entity_id : "Ingen fugt fundet" },
    { label: "Lys", value: room.lightLabel, meta: room.lights.length ? room.lights.map((entity) => getFriendlyName(entity)).join(" · ") : "Ingen lys fundet" }
  ];

  const entitiesMarkup = room.entities
    .map((entity) => `
      <article class="info-metric room-entity-metric">
        <span class="scene-metric-label">${getFriendlyName(entity)}</span>
        <strong>${formatRoomEntityState(entity)}</strong>
        <p>${entity.entity_id}</p>
      </article>
    `)
    .join("");

  return `
    <div class="info-grid room-info-grid">
      ${sections.map((section) => `
        <article class="info-metric">
          <span class="scene-metric-label">${section.label}</span>
          <strong>${section.value}</strong>
          <p>${section.meta}</p>
        </article>
      `).join("")}
      ${entitiesMarkup}
    </div>
  `;
}

function buildConfiguredRoomModalMarkup(room, activeTab, config) {
  const lookup = buildEntityLookup();
  const tabs = [
    { key: "lights", label: "Overblik" },
    { key: "info", label: "Info" },
    { key: "media", label: "Media" }
  ];

  return `
    <div class="room-popup-shell room-popup-living_room">
      ${buildConfiguredRoomHeroCard(room, lookup, config)}
      ${buildConfiguredSceneButtons(config.scenes || [])}
      <div class="room-popup-tabs">
        ${tabs.map((tab) => `
          <button class="room-popup-tab ${activeTab === tab.key ? "active" : ""}" type="button" data-room-tab="${tab.key}">
            <span>${tab.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="room-popup-panel">
        ${activeTab === "info"
          ? buildConfiguredInfoPanel(lookup, config.info || [])
          : activeTab === "media"
            ? buildConfiguredMediaPanel(lookup, config.media || [], config.mediaActions || [])
            : buildConfiguredLightsPanel(lookup, config.lights || [])}
      </div>
    </div>
  `;
}

function buildConfiguredRoomHeroCard(room, lookup, config) {
  const feelsLike = config.feelsLikeEntityId ? lookup.get(config.feelsLikeEntityId) : null;
  const thermostat = config.thermostatEntityId ? lookup.get(config.thermostatEntityId) : null;
  const windowContacts = config.windowEntityId ? lookup.get(config.windowEntityId) : null;
  const cooling = config.coolingEntityId ? lookup.get(config.coolingEntityId) : null;
  const co2Entity = config.air && config.air.co2EntityId ? lookup.get(config.air.co2EntityId) : null;
  const pm25Entity = config.air && config.air.pm25EntityId ? lookup.get(config.air.pm25EntityId) : null;
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const windowsOpen = windowContacts && isOnEntity(windowContacts);
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">${escapeHtml(config.windowOpenLabel || "Åbent")}</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`,
    config.statusEntityId && lookup.get(config.statusEntityId) ? `<span class="living_room-hero-badge idle">${escapeHtml(formatRoomEntityState(lookup.get(config.statusEntityId)))}</span>` : ""
  ].filter(Boolean).join("");

  const climateControlMarkup = buildRoomClimateControlStack(thermostat, cooling, config.displayName || room.name, windowsOpen);

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">${escapeHtml(config.displayName || room.name)}</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}° <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `Føles som ${formatNumber(feels, 1)}°` : room.meta || "Rumstatus"}</p>
          ${co2Entity ? `<p class="living_room-hero-meta living_room-hero-air">${buildCo2Summary(co2Entity)}</p>` : ""}
          ${pm25Entity ? `<p class="living_room-hero-meta living_room-hero-air">${buildPm25Summary(pm25Entity)}</p>` : ""}
        </div>
        ${climateControlMarkup}
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function buildConfiguredSceneButtons(scenes) {
  const usable = scenes.filter((scene) => scene && scene.entityId);
  if (!usable.length) {
    return "";
  }

  return `
    <section class="living_room-scene-grid">
      ${usable.map((scene) => `
        <button class="living_room-scene-button" type="button" data-tone="${scene.tone || "neutral"}" data-room-action="${scene.action || "run-script"}" data-entity-id="${scene.entityId}">
          <span class="living_room-scene-icon">${escapeHtml(scene.kicker || "Scene")}</span>
          <strong>${escapeHtml(scene.label || "Kør")}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function buildConfiguredLightsPanel(lookup, entityIds) {
  const lights = entityIds.map((entityId) => lookup.get(entityId)).filter(Boolean);
  return `<div class="living_room-tile-grid">${lights.map((entity) => buildLivingRoomLightTile(entity)).join("")}</div>`;
}

function buildConfiguredInfoPanel(lookup, items) {
  const markup = items.map((item) => renderConfiguredInfoTile(lookup, item)).filter(Boolean).join("");
  return `<div class="living_room-tile-grid">${markup || "<div class=\"calendar-loading\">Ingen ekstra info endnu</div>"}</div>`;
}

function buildConfiguredMediaPanel(lookup, mediaItems, actions) {
  const mediaMarkup = mediaItems
    .map((item) => buildMediaStatusTile(lookup.get(item.entityId), item.label, item.caption))
    .filter(Boolean)
    .join("");
  const actionMarkup = actions.length ? `
    <div class="living_room-media-actions">
      ${actions.map((action) => `<button class="living_room-media-button" type="button" data-room-action="${action.action || "run-script"}" data-entity-id="${action.entityId}">${escapeHtml(action.label)}</button>`).join("")}
    </div>
  ` : "";
  return `<div class="living_room-media-shell"><div class="living_room-tile-grid">${mediaMarkup || "<div class=\"calendar-loading\">Ingen media fundet</div>"}</div>${actionMarkup}</div>`;
}

function buildRoomClimateControlStack(thermostat, cooling = null, label = "Rum", disabledByWindow = false) {
  const cards = [
    buildCompactClimateControlCard({
      entity: thermostat,
      title: "Radiator",
      step: 0.5,
      disabled: disabledByWindow,
      modes: ["heat", "off"]
    }),
    buildCompactClimateControlCard({
      entity: cooling,
      title: "AC",
      step: 1,
      modes: ["cool", "heat", "off"]
    })
  ].filter(Boolean).join("");

  return cards ? `<div class="room-climate-stack" aria-label="${escapeHtml(label)} klima">${cards}</div>` : "";
}

function buildCompactClimateControlCard({ entity, title, step = 0.5, disabled = false, modes = [] }) {
  if (!entity) {
    return "";
  }

  const attrs = entity.attributes || {};
  const stateValue = String(entity.state || "off").toLowerCase();
  const action = String(attrs.hvac_action || stateValue || "idle").toLowerCase();
  const target = attrs.temperature !== undefined ? `${formatNumber(attrs.temperature, 1)}°` : "--";
  const current = attrs.current_temperature !== undefined ? `${formatNumber(attrs.current_temperature, 1)}°` : "";
  const supportedModes = Array.isArray(attrs.hvac_modes) ? attrs.hvac_modes : [];
  const modeLabels = { heat: "Varme", cool: "Køl", off: "Off" };
  const modeButtons = modes
    .filter((mode) => !supportedModes.length || supportedModes.includes(mode))
    .map((mode) => `
      <button type="button" class="room-climate-mode ${stateValue === mode ? "active" : ""}" data-room-action="climate-mode" data-entity-id="${entity.entity_id}" data-hvac-mode="${mode}">
        ${modeLabels[mode] || mode}
      </button>
    `).join("");

  return `
    <article class="room-climate-control-card ${action === "heating" || action === "heat" ? "is-heating" : ""} ${action === "cooling" || action === "cool" ? "is-cooling" : ""}">
      <div class="room-climate-control-head">
        <span>${escapeHtml(title)}</span>
        <strong>${disabled ? "OFF" : escapeHtml(target)}</strong>
      </div>
      <div class="room-climate-control-body">
        <button type="button" class="living_room-temp-step" data-room-action="climate-temp-delta" data-entity-id="${entity.entity_id}" data-delta="${-step}">-</button>
        <p>${escapeHtml(formatClimateActionLabel(action))}${current ? ` · ${escapeHtml(current)}` : ""}</p>
        <button type="button" class="living_room-temp-step" data-room-action="climate-temp-delta" data-entity-id="${entity.entity_id}" data-delta="${step}">+</button>
      </div>
      ${modeButtons ? `<div class="room-climate-mode-row">${modeButtons}</div>` : ""}
    </article>
  `;
}

function formatClimateActionLabel(action) {
  const labels = {
    heating: "Heating",
    heat: "Varme",
    cooling: "Køler",
    cool: "Køl",
    idle: "Pause",
    off: "Slukket",
    fan_only: "Ventilator",
    dry: "Dry"
  };
  return labels[String(action || "").toLowerCase()] || toTitleCase(String(action || "status"));
}

function renderConfiguredInfoTile(lookup, item) {
  if (!item || !item.entityId) {
    return "";
  }
  const entity = lookup.get(item.entityId);
  if (!entity) {
    return "";
  }

  if (item.kind === "binary") {
    return buildBinaryStateTile(entity, item.label, item.offLabel, item.onLabel);
  }
  if (item.kind === "fan") {
    return buildFanTile(entity, item.label);
  }
  if (item.kind === "toggle") {
    return buildToggleTile(entity, item.label);
  }
  if (item.kind === "vacuum") {
    return buildVacuumTile(entity, item.label);
  }
  return buildStatusTile(entity, item.label);
}

function buildStatusTile(entity, label) {
  return `
    <article class="living_room-tile">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
      </div>
      <strong>${escapeHtml(formatRoomEntityState(entity))}</strong>
    </article>
  `;
}

function buildClimateControlPanel(entity, label) {
  if (!entity) {
    return "";
  }

  const currentMode = String(entity.state || "").toLowerCase();
  const currentTemperature = entity.attributes && entity.attributes.temperature !== undefined
    ? `${formatNumber(entity.attributes.temperature, 1)}°`
    : "--";
  const modeMap = {
    off: "Slukket",
    heat: "Varme",
    cool: "Køl"
  };
  const modeButtons = [
    { label: "Sluk", value: "off" },
    { label: "Varme", value: "heat" },
    { label: "Køl", value: "cool" }
  ].map((mode) => `
    <button
      type="button"
      class="climate-mode-button ${currentMode === mode.value ? "active" : ""}"
      data-room-action="climate-mode"
      data-entity-id="${entity.entity_id}"
      data-hvac-mode="${mode.value}"
    >
      ${mode.label}
    </button>
  `).join("");

  return `
    <section class="room-popup-panel climate-control-panel">
      <div class="climate-control-head">
        <div class="climate-control-copy">
          <p class="living_room-hero-eyebrow">${escapeHtml(label)} AC</p>
          <strong class="climate-control-value">${escapeHtml(currentTemperature)}</strong>
          <p class="climate-control-meta">${escapeHtml(modeMap[currentMode] || toTitleCase(currentMode || "off"))} · ${escapeHtml(getFriendlyName(entity))}</p>
        </div>
        <div class="climate-mode-row">${modeButtons}</div>
      </div>
      <div class="climate-temp-row">
        <button type="button" class="living_room-temp-step" data-room-action="climate-temp-delta" data-entity-id="${entity.entity_id}" data-delta="-1">-</button>
        <div class="climate-setpoint-card">
          <span>Setpunkt</span>
          <strong>${escapeHtml(currentTemperature)}</strong>
        </div>
        <button type="button" class="living_room-temp-step" data-room-action="climate-temp-delta" data-entity-id="${entity.entity_id}" data-delta="1">+</button>
      </div>
    </section>
  `;
}

function buildVacuumTile(entity, label) {
  if (!entity) {
    return "";
  }

  const stateLabel = formatVacuumState(entity.state);
  const actionButtons = [];
  const normalized = String(entity.state || "").toLowerCase();

  if (["docked", "idle"].includes(normalized)) {
    actionButtons.push(`<button type="button" class="living_room-mini-action" data-room-action="vacuum-service" data-service="start" data-entity-id="${entity.entity_id}">Start</button>`);
  }
  if (["cleaning", "returning", "error", "paused"].includes(normalized)) {
    actionButtons.push(`<button type="button" class="living_room-mini-action" data-room-action="vacuum-service" data-service="return_to_base" data-entity-id="${entity.entity_id}">Hjem</button>`);
  }
  if (["cleaning", "paused"].includes(normalized)) {
    actionButtons.push(`<button type="button" class="living_room-mini-action" data-room-action="vacuum-service" data-service="stop" data-entity-id="${entity.entity_id}">Stop</button>`);
  }

  return `
    <article class="living_room-tile ${normalized === "cleaning" ? "is-on" : ""}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
        <div class="living_room-mini-actions">${actionButtons.join("")}</div>
      </div>
      <strong>${escapeHtml(stateLabel)}</strong>
    </article>
  `;
}

function formatVacuumState(value) {
  const normalized = String(value || "").toLowerCase();
  const labels = {
    docked: "Docked",
    cleaning: "Reng?r",
    idle: "Klar",
    paused: "Pauset",
    returning: "Kører hjem",
    error: "Fejl"
  };
  return labels[normalized] || toTitleCase(normalized);
}

function buildKokkenRoomModalMarkup(room, activeTab) {
  const lookup = buildEntityLookup();
  const feelsLike = lookup.get("sensor.weather_sensor_feels_like_temperature_kitchen") || null;
  const thermostat = lookup.get("climate.kitchen") || null;
  const windowContacts = lookup.get("binary_sensor.kitchenet_vinduer") || null;
  const cooling = lookup.get("climate.climate_kitchen") || lookup.get("climate.climate_living_room") || null;
  const tabs = [
    { key: "lights", label: "Overblik" },
    { key: "info", label: "Info" },
    { key: "media", label: "Styring" }
  ];

  return `
    <div class="room-popup-shell room-popup-living_room">
      ${buildKokkenHeroCard(room, feelsLike, thermostat, windowContacts, cooling)}
      ${buildKokkenSceneButtons()}
      <div class="room-popup-tabs">
        ${tabs.map((tab) => `
          <button
            class="room-popup-tab ${activeTab === tab.key ? "active" : ""}"
            type="button"
            data-room-tab="${tab.key}"
          >
            <span>${tab.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="room-popup-panel">
        ${activeTab === "info" ? buildKokkenInfoPanel(lookup) : activeTab === "media" ? buildKokkenControlPanel(lookup) : buildKokkenLightsPanel(lookup)}
      </div>
    </div>
  `;
}

function buildKokkenHeroCard(room, feelsLike, thermostat, windowContacts, cooling) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Vinduer Åbne</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">Kitchen</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}° <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `Føles som ${formatNumber(feels, 1)}°` : "Føles som --"}</p>
        </div>
        ${buildRoomClimateControlStack(thermostat, cooling, "Kitchen", windowsOpen)}
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function buildKokkenSceneButtons() {
  const scenes = [
    { label: "Klar", kicker: "Scene", script: "script.set_kitchen_presence_nar_overstyret_klar", tone: "neutral" },
    { label: "Energi", kicker: "Eco", script: "script.set_kitchen_presence_nar_overstyret_energi", tone: "cyan" },
    { label: "Dæmpet", kicker: "Aften", script: "script.set_kitchen_presence_nar_overstyret_daempet", tone: "amber" },
    { label: "Natlys", kicker: "Nat", script: "script.set_kitchen_presence_nar_overstyret_nat", tone: "orange" }
  ];

  return `
    <section class="living_room-scene-grid">
      ${scenes.map((scene) => `
        <button class="living_room-scene-button" type="button" data-tone="${scene.tone}" data-room-action="run-script" data-entity-id="${scene.script}">
          <span class="living_room-scene-icon">${scene.kicker}</span>
          <strong>${scene.label}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function buildKokkenLightsPanel(lookup) {
  const lights = [
    "light.kitchen_spisebord_2",
    "light.kitchen_spot",
    "light.ledstrips_kitchen"
  ].map((entityId) => lookup.get(entityId)).filter(Boolean);

  return `
    <div class="living_room-tile-grid">
      ${lights.map((entity) => buildLivingRoomLightTile(entity)).join("")}
    </div>
  `;
}

function buildKokkenInfoPanel(lookup) {
  const tiles = [
    buildBinaryStateTile(lookup.get("binary_sensor.kitchenvindue_th"), "Terracedør", "Lukket", "Åben"),
    buildBinaryStateTile(lookup.get("binary_sensor.kitchenvindue_tv"), "Mod have", "Lukket", "Åben"),
    buildBinaryStateTile(lookup.get("binary_sensor.hps_kkkenet_presence_2"), "Person i rummet", "Ingen", "Bevægelse")
  ].filter(Boolean).join("");

  return `<div class="living_room-tile-grid">${tiles}</div>`;
}

function buildKokkenControlPanel(lookup) {
  const tiles = [
    buildToggleTileFromService(
      lookup.get("automation.presence_kitchen") || lookup.get("automation.precens_kitchen_lav"),
      "Presence",
      "script.toggle_automations_kitchen"
    ),
    buildToggleTile(lookup.get("automation.kitchen_aktiver_ambient_ved_slukning_af_alt_lys_om_natten"), "Ambient lys"),
    buildToggleTile(lookup.get("input_boolean.toggle_kitchen_presence_high_low"), "Scene høj/lav")
  ].filter(Boolean).join("");

  return `<div class="living_room-tile-grid">${tiles}</div>`;
}

function buildToggleTileFromService(entity, label, serviceEntityId) {
  if (!entity) {
    return "";
  }
  const on = String(entity.state).toLowerCase() === "on";
  return `
    <article class="living_room-tile ${on ? "is-on" : "is-off"}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
        <button type="button" class="living_room-mini-action" data-room-action="run-script" data-entity-id="${serviceEntityId}">
          ${on ? "Kør" : "Kør"}
        </button>
      </div>
      <strong>${on ? "Aktiv" : "Inaktiv"}</strong>
    </article>
  `;
}

function buildLivingRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const targetEntity = findEntityById("number.smart_heating_styring_living_room_living_room_ai_mal_styring");
  const setPoint = targetEntity && hasUsefulValue(targetEntity.state)
    ? `${formatNumber(targetEntity.state, 1)}?`
    : "--";
  const valveLabel = readLivingRoomValveLabel(thermostat);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Vindue Åbent</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">LivingRoom</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}? <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `F?les som ${formatNumber(feels, 1)}?` : "F?les som --"}</p>
        </div>
        <div class="living_room-hero-controls">
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="0.5">+</button>
          <div class="living_room-setpoint">
            <span>${windowsOpen ? "OFF" : setPoint}</span>
            <strong>${valveLabel || "AI m?l"}</strong>
          </div>
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="-0.5">-</button>
        </div>
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function buildDiningRoomRoomModalMarkup(room, activeTab) {
  const lookup = buildEntityLookup();
  const feelsLike = lookup.get("sensor.weather_sensor_feels_like_temperature_dining_room") || null;
  const thermostat = lookup.get("climate.thermostate_dining_room") || null;
  const windowContacts = lookup.get("binary_sensor.front_door") || null;
  const cooling = lookup.get("climate.climate_living_room") || null;
  const co2Entity = lookup.get("sensor.temperature_humidity_dining_room_carbon_dioxide") || null;
  const pm25Entity = lookup.get("sensor.temperature_humidity_dining_room_pm2_5") || null;

  const tabs = [
    { key: "lights", label: "Overblik" },
    { key: "info", label: "Info" },
    { key: "media", label: "Media" }
  ];

  return `
    <div class="room-popup-shell room-popup-living_room">
      ${buildDiningRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling, co2Entity, pm25Entity)}
      ${buildDiningRoomSceneButtons()}
      <div class="room-popup-tabs">
        ${tabs.map((tab) => `
          <button
            class="room-popup-tab ${activeTab === tab.key ? "active" : ""}"
            type="button"
            data-room-tab="${tab.key}"
          >
            <span>${tab.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="room-popup-panel">
        ${activeTab === "info"
          ? buildDiningRoomInfoPanel(lookup)
          : activeTab === "media"
            ? buildDiningRoomMediaPanel(lookup)
            : buildDiningRoomLightsPanel(lookup)}
      </div>
    </div>
  `;
}

function buildDiningRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling, co2Entity, pm25Entity) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const co2Markup = buildCo2Summary(co2Entity);
  const pm25Markup = buildPm25Summary(pm25Entity);
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Hoveddør Åben</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">DiningRoom</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}° <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `Føles som ${formatNumber(feels, 1)}°` : "Føles som --"}</p>
          <p class="living_room-hero-meta living_room-hero-air">${co2Markup}</p>
          <p class="living_room-hero-meta living_room-hero-air">${pm25Markup}</p>
        </div>
        ${buildRoomClimateControlStack(thermostat, cooling, "DiningRoom", windowsOpen)}
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function buildDiningRoomSceneButtons() {
  const scenes = [
    { label: "Klar", kicker: "Scene", script: "script.set_dining_room_presence_nar_overstyret_klar", tone: "neutral" },
    { label: "Energi", kicker: "Eco", script: "script.set_dining_room_presence_nar_overstyret_energi", tone: "cyan" },
    { label: "Dæmpet", kicker: "Aften", script: "script.set_dining_room_presence_nar_overstyret_daempet", tone: "amber" },
    { label: "Natlys", kicker: "Nat", script: "script.set_dining_room_presence_nar_overstyret_nat", tone: "orange" }
  ];

  return `
    <section class="living_room-scene-grid">
      ${scenes.map((scene) => `
        <button class="living_room-scene-button" type="button" data-tone="${scene.tone}" data-room-action="run-script" data-entity-id="${scene.script}">
          <span class="living_room-scene-icon">${scene.kicker}</span>
          <strong>${scene.label}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function buildDiningRoomLightsPanel(lookup) {
  const lights = [
    "light.spisebord_5",
    "light.spots_dining_room",
    "light.spot_gang",
    "light.lille_pantella_2"
  ].map((entityId) => lookup.get(entityId)).filter(Boolean);

  return `
    <div class="living_room-tile-grid">
      ${lights.map((entity) => buildLivingRoomLightTile(entity)).join("")}
    </div>
  `;
}

function buildDiningRoomInfoPanel(lookup) {
  const tiles = [
    buildBinaryStateTile(lookup.get("binary_sensor.hps_dining_room_presence"), "Person i rummet", "Ingen", "Bevægelse"),
    buildToggleTile(lookup.get("automation.presence_dining_room"), "Presence", "automation.presence_dining_room"),
    buildToggleTile(lookup.get("automation.dining_room_aktiver_ambient_ved_slukning_af_alt_lys_om_natten"), "Ambient lys", "automation.dining_room_aktiver_ambient_ved_slukning_af_alt_lys_om_natten"),
    buildToggleTile(lookup.get("input_boolean.toggle_dining_room_presence_high_low"), "Scene høj/lav", "input_boolean.toggle_dining_room_presence_high_low")
  ].filter(Boolean).join("");

  return `<div class="living_room-tile-grid">${tiles}</div>`;
}

function buildDiningRoomMediaPanel(lookup) {
  const player = lookup.get("media_player.dining_room_venstre") || lookup.get("media_player.dining_room");
  const mediaCards = [
    buildMediaStatusTile(player, "DiningRoom", "Lyd")
  ].filter(Boolean).join("");

  return `
    <div class="living_room-media-shell">
      <div class="living_room-tile-grid">${mediaCards}</div>
    </div>
  `;
}

function buildCo2Summary(entity) {
  const co2 = Number(entity && entity.state);
  if (!Number.isFinite(co2)) {
    return "CO? -- ppm";
  }
  let quality = "God";
  if (co2 > 1400) quality = "Høj";
  else if (co2 > 1000) quality = "Middel";
  return `CO? ${formatNumber(co2, 0)} ppm ? ${quality}`;
}

function buildPm25Summary(entity) {
  const pm = Number(entity && entity.state);
  if (!Number.isFinite(pm)) {
    return "PM2.5 --";
  }
  let label = "God";
  if (pm > 35) label = "D?rlig";
  else if (pm > 12) label = "Middel";
  return `PM2.5 ${label} ? ${formatNumber(pm, 1)} ?g/m?`;
}

function readValveLabel(entity, preferredKeys = []) {
  const raw = entity && entity.attributes ? entity.attributes.calibration_balance : "";
  if (!raw) {
    return "";
  }

  try {
    const payload = JSON.parse(raw);
    for (const key of preferredKeys) {
      if (payload && payload[key] && payload[key]["valve%"] !== undefined) {
        return `${formatNumber(payload[key]["valve%"], 0)}%`;
      }
    }

    const fallback = Object.values(payload || {}).find((entry) => entry && entry["valve%"] !== undefined);
    return fallback ? `${formatNumber(fallback["valve%"], 0)}%` : "";
  } catch (error) {
    return "";
  }
}

async function handleRoomModalClick(event) {
  const tabButton = event.target.closest("[data-room-tab]");
  if (tabButton) {
    state.roomModalView = tabButton.dataset.roomTab || "lights";
    refreshOpenRoomModal();
    return;
  }

  const actionButton = event.target.closest("[data-room-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.roomAction;
  actionButton.disabled = true;

  try {
    if (action === "number-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const numberEntity = findEntityById(entityId);
      const current = Number(numberEntity && numberEntity.state);
      const min = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.min : NaN);
      const max = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.max : NaN);
      const step = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.step : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const rawNext = base + delta;
      const clamped = Math.min(Number.isFinite(max) ? max : rawNext, Math.max(Number.isFinite(min) ? min : rawNext, rawNext));
      const resolvedStep = Number.isFinite(step) && step > 0 ? step : 0.5;
      const nextValue = Math.round(clamped / resolvedStep) * resolvedStep;
      await callHomeAssistantService(state.config, "number", "set_value", {
        entity_id: entityId,
        value: Math.round(nextValue * 100) / 100
      });
    } else if (action === "climate-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const nextTemperature = Math.round((base + delta) * 10) / 10;
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: nextTemperature
      });
    } else if (action === "number-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const numberEntity = findEntityById(entityId);
      const current = Number(numberEntity && numberEntity.state);
      const min = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.min : NaN);
      const max = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.max : NaN);
      const step = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.step : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const rawNext = base + delta;
      const clamped = Math.min(Number.isFinite(max) ? max : rawNext, Math.max(Number.isFinite(min) ? min : rawNext, rawNext));
      const resolvedStep = Number.isFinite(step) && step > 0 ? step : 0.5;
      const nextValue = Math.round(clamped / resolvedStep) * resolvedStep;
      await callHomeAssistantService(state.config, "number", "set_value", {
        entity_id: entityId,
        value: Math.round(nextValue * 100) / 100
      });
    } else if (action === "toggle-entity") {
      const entityId = actionButton.dataset.entityId;
      await toggleEntityFromModal(entityId);
    } else if (action === "run-script") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "script", "turn_on", {
        entity_id: entityId
      });
    } else if (action === "activate-scene") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "scene", "turn_on", { entity_id: entityId });
    } else if (action === "vacuum-service") {
      const entityId = actionButton.dataset.entityId;
      const service = actionButton.dataset.service;
      if (!entityId || !service) {
        throw new Error("VACUUM_ACTION_MISSING");
      }
      await callHomeAssistantService(state.config, "vacuum", service, { entity_id: entityId });
    } else if (action === "open-climate-panel") {
      const entityId = actionButton.dataset.entityId || "";
      state.activeRoomClimateEntityId = state.activeRoomClimateEntityId === entityId ? "" : entityId;
      refreshOpenRoomModal();
      return;
    } else if (action === "climate-mode") {
      const entityId = actionButton.dataset.entityId;
      const hvacMode = actionButton.dataset.hvacMode;
      await callHomeAssistantService(state.config, "climate", "set_hvac_mode", {
        entity_id: entityId,
        hvac_mode: hvacMode
      });
    } else if (action === "climate-temp-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const min = Number(climate && climate.attributes ? climate.attributes.min_temp : NaN);
      const max = Number(climate && climate.attributes ? climate.attributes.max_temp : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const nextValue = Math.min(Number.isFinite(max) ? max : base + delta, Math.max(Number.isFinite(min) ? min : base + delta, base + delta));
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: Math.round(nextValue * 10) / 10
      });
    }

    await refreshDashboard();
    refreshOpenRoomModal();
  } catch (error) {
    console.error(error);
    actionButton.disabled = false;
  }
}

function buildLivingRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const targetEntity = findEntityById("number.smart_heating_styring_living_room_living_room_ai_mal_styring");
  const setPoint = targetEntity && hasUsefulValue(targetEntity.state)
    ? `${formatNumber(targetEntity.state, 1)}?`
    : "--";
  const valveLabel = readLivingRoomValveLabel(thermostat);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Vindue Åbent</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">LivingRoom</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}? <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `F?les som ${formatNumber(feels, 1)}?` : "F?les som --"}</p>
        </div>
        <div class="living_room-hero-controls">
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="0.5">+</button>
          <div class="living_room-setpoint">
            <span>${windowsOpen ? "OFF" : setPoint}</span>
            <strong>${valveLabel || "AI m?l"}</strong>
          </div>
          <button type="button" class="living_room-temp-step" data-room-action="number-delta" data-entity-id="number.smart_heating_styring_living_room_living_room_ai_mal_styring" data-delta="-0.5">-</button>
        </div>
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function openTechniqueModal() {
  renderTechniqueModal();
  document.body.classList.add("modal-open");
  elements.techniqueModal.classList.add("open");
  elements.techniqueModal.setAttribute("aria-hidden", "false");
}

function closeTechniqueModal() {
  document.body.classList.remove("modal-open");
  elements.techniqueModal.classList.remove("open");
  elements.techniqueModal.setAttribute("aria-hidden", "true");
}

function handleTechniqueSettingsClick() {
  closeTechniqueModal();
  openSettings();
}

async function handleTechniqueRefreshClick() {
  if (!elements.refreshButton) {
    return;
  }

  elements.refreshButton.disabled = true;
  setTechniqueKioskStatus("Opdaterer dashboard...");
  try {
    await refreshDashboard();
    setTechniqueKioskStatus(`Dashboard opdateret ${new Date().toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}.`, "success");
  } catch (error) {
    console.error(error);
    setTechniqueKioskStatus("Kunne ikke opdatere dashboard.", "error");
  } finally {
    elements.refreshButton.disabled = false;
  }
}

async function handleTechniqueModalClick(event) {
  const kioskButton = event.target.closest("[data-kiosk-action]");
  if (kioskButton) {
    await handleKioskAction(kioskButton);
    return;
  }

}

async function handleKioskAction(actionButton) {
  const action = actionButton.dataset.kioskAction;
  const entityId = actionButton.dataset.entityId || "";
  const label = actionButton.dataset.label || actionButton.textContent.trim() || "Kiosk";
  actionButton.disabled = true;
  setTechniqueKioskStatus(`Sender ${label}...`);

  try {
    if (action === "button") {
      await callHomeAssistantService(state.config, "button", "press", { entity_id: entityId });
    } else if (action === "light-toggle") {
      await callHomeAssistantService(state.config, "light", "toggle", { entity_id: entityId });
    } else if (action === "light-on") {
      await callHomeAssistantService(state.config, "light", "turn_on", { entity_id: entityId });
    } else if (action === "light-off") {
      await callHomeAssistantService(state.config, "light", "turn_off", { entity_id: entityId });
    } else if (action === "number-delta") {
      const entity = findEntityById(entityId);
      const delta = Number(actionButton.dataset.delta || "0");
      const current = Number(entity && entity.state);
      const min = Number(entity && entity.attributes ? entity.attributes.min : NaN);
      const max = Number(entity && entity.attributes ? entity.attributes.max : NaN);
      const step = Number(entity && entity.attributes ? entity.attributes.step : NaN);
      const raw = (Number.isFinite(current) ? current : 0) + delta;
      const clamped = Math.min(Number.isFinite(max) ? max : raw, Math.max(Number.isFinite(min) ? min : raw, raw));
      const resolvedStep = Number.isFinite(step) && step > 0 ? step : 1;
      await callHomeAssistantService(state.config, "number", "set_value", {
        entity_id: entityId,
        value: Math.round(clamped / resolvedStep) * resolvedStep
      });
    } else if (action === "select") {
      await callHomeAssistantService(state.config, "select", "select_option", {
        entity_id: entityId,
        option: actionButton.dataset.option || ""
      });
    } else if (action === "url") {
      await callHomeAssistantService(state.config, "text", "set_value", {
        entity_id: entityId,
        value: actionButton.dataset.value || ""
      });
    }

    await refreshDashboard();
    renderTechniqueModal();
    setTechniqueKioskStatus(`${label} sendt.`, "success");
  } catch (error) {
    console.error(error);
    setTechniqueKioskStatus(`${label} fejlede.`, "error");
  } finally {
    actionButton.disabled = false;
  }
}

function setTechniqueKioskStatus(message, tone = "") {
  if (!elements.techniqueKioskStatus) {
    return;
  }

  elements.techniqueKioskStatus.textContent = message;
  elements.techniqueKioskStatus.dataset.tone = tone;
}

function renderTechniqueModal() {
  renderKioskPanel();

  if (!elements.techniqueThemeGrid) {
    return;
  }

  const activeTheme = getBaseThemeName(state.config.theme || DEMO_CONFIG.theme);
  const themeChoices = Object.keys(LIGHT_THEME_BY_DARK_THEME);
  elements.techniqueThemeGrid.innerHTML = themeChoices.map((themeName) => {
    const meta = THEME_META[themeName] || { label: themeName, caption: "", chip: "" };
    const swatches = THEME_PREVIEW_SWATCHES[themeName] || ["#ffffff", "#cccccc", "#333333"];
    const swatchStyle = `--theme-preview-a:${swatches[0]};--theme-preview-b:${swatches[1]};--theme-preview-c:${swatches[2]};`;
    return `
      <button
        type="button"
        class="technique-theme-card ${themeName === activeTheme ? "active" : ""}"
        data-theme-choice="${themeName}"
        aria-pressed="${themeName === activeTheme ? "true" : "false"}"
        style="${swatchStyle}"
      >
        <span class="technique-theme-chip">${escapeHtml(meta.chip)}</span>
        <strong>${escapeHtml(meta.label)}</strong>
        <span>${escapeHtml(meta.caption)}</span>
        <span class="technique-theme-swatches" aria-hidden="true">
          <i class="swatch swatch-a"></i>
          <i class="swatch swatch-b"></i>
          <i class="swatch swatch-c"></i>
        </span>
      </button>
    `;
  }).join("");
}

function renderKioskPanel() {
  if (!elements.kioskPanel) {
    return;
  }

  const ids = getKioskEntityIds();
  const display = findEntityById(ids.display);
  const zoom = findEntityById(ids.zoom);
  const volume = findEntityById(ids.volume);
  const kiosk = findEntityById(ids.kiosk);
  const theme = findEntityById(ids.theme);
  const screenshot = findEntityById(ids.screenshot);
  const currentUrl = findEntityById(ids.url);
  const screenshotUrl = buildKioskImageUrl(screenshot);
  const dashboardUrl = new URL("/", window.location.origin).href;
  const verticalUrl = new URL("/vertical", window.location.origin).href;

  const commandButtons = [
    { entityId: ids.refresh, label: "Refresh", icon: "↻" },
    { entityId: ids.reboot, label: "Reboot", icon: "⟳" },
    { entityId: ids.shutdown, label: "Shutdown", icon: "⏻", danger: true }
  ].map((item) => buildKioskButton(item)).join("");

  elements.kioskPanel.innerHTML = `
    <div class="kiosk-top">
      <article class="kiosk-screen">
        ${screenshotUrl ? `<img src="${escapeHtml(screenshotUrl)}" alt="Kiosk screenshot">` : `<div class="kiosk-screen-empty">Ingen screenshot</div>`}
      </article>
      <div class="kiosk-quick">
        ${commandButtons}
        <button class="ghost-button technique-action-button" type="button" data-kiosk-action="light-toggle" data-entity-id="${ids.display}" data-label="Display">
          <span>◐</span><strong>Display</strong><small>${escapeHtml(formatOnOff(display))}</small>
        </button>
      </div>
    </div>
    <div class="kiosk-controls">
      ${buildKioskNumberControl("Zoom", zoom, "%", 5)}
      ${buildKioskNumberControl("Volume", volume, "%", 5)}
      ${buildKioskSelectControl("Kiosk", kiosk, ids.kiosk)}
      ${buildKioskSelectControl("Tema", theme, ids.theme)}
    </div>
    <div class="kiosk-url-actions">
      <button class="ghost-button technique-action-button" type="button" data-kiosk-action="url" data-entity-id="${ids.url}" data-value="${escapeHtml(dashboardUrl)}" data-label="Normal visning">Normal</button>
      <button class="ghost-button technique-action-button" type="button" data-kiosk-action="url" data-entity-id="${ids.url}" data-value="${escapeHtml(verticalUrl)}" data-label="Vertical visning">Vertical</button>
      <p>${escapeHtml(currentUrl && currentUrl.state ? currentUrl.state : "Ingen URL")}</p>
    </div>
    <div class="kiosk-status-grid">
      ${buildKioskMetric("Heartbeat", ids.heartbeat)}
      ${buildKioskMetric("Sidst aktiv", ids.lastActive)}
      ${buildKioskMetric("Uptime", ids.uptime)}
      ${buildKioskMetric("CPU", ids.cpu)}
      ${buildKioskMetric("Temp", ids.temperature)}
      ${buildKioskMetric("Memory", ids.memoryUsage)}
      ${buildKioskMetric("Fejl", ids.errors)}
      ${buildKioskMetric("Updates", ids.upgrades)}
      ${buildKioskMetric("IP", ids.network)}
      ${buildKioskMetric("Model", ids.model)}
      ${buildKioskMetric("Version", ids.version)}
      ${buildKioskMetric("Host", ids.host)}
    </div>
  `;
}

function buildKioskButton({ entityId, label, icon, danger = false }) {
  const entity = findEntityById(entityId);
  const disabled = entity && String(entity.state).toLowerCase() === "unavailable";
  return `
    <button class="ghost-button technique-action-button kiosk-command ${danger ? "danger" : ""}" type="button" data-kiosk-action="button" data-entity-id="${entityId}" data-label="${escapeHtml(label)}" ${disabled ? "disabled" : ""}>
      <span>${escapeHtml(icon)}</span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(formatKioskLastChanged(entity))}</small>
    </button>
  `;
}

function buildKioskNumberControl(label, entity, unit, step) {
  const entityId = entity ? entity.entity_id : "";
  const value = entity && hasUsefulValue(entity.state) ? `${formatNumber(entity.state, 0)}${unit}` : "--";
  return `
    <article class="kiosk-control">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <div class="kiosk-stepper">
        <button type="button" class="living_room-temp-step" data-kiosk-action="number-delta" data-entity-id="${entityId}" data-delta="${-step}" data-label="${escapeHtml(label)} ned">-</button>
        <button type="button" class="living_room-temp-step" data-kiosk-action="number-delta" data-entity-id="${entityId}" data-delta="${step}" data-label="${escapeHtml(label)} op">+</button>
      </div>
    </article>
  `;
}

function buildKioskSelectControl(label, entity, entityId) {
  const options = entity && entity.attributes && Array.isArray(entity.attributes.options) ? entity.attributes.options : [];
  const current = entity && hasUsefulValue(entity.state) ? String(entity.state) : "--";
  return `
    <article class="kiosk-control">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(current)}</strong>
      <div class="kiosk-option-row">
        ${options.map((option) => `<button type="button" class="kiosk-option ${option === current ? "active" : ""}" data-kiosk-action="select" data-entity-id="${entityId}" data-option="${escapeHtml(option)}" data-label="${escapeHtml(label)} ${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
      </div>
    </article>
  `;
}

function buildKioskMetric(label, entityId) {
  const entity = findEntityById(entityId);
  const value = entity ? formatKioskEntityValue(entity) : "--";
  return `
    <article class="kiosk-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function buildKioskImageUrl(entity) {
  if (!entity || !entity.attributes) {
    return "";
  }
  const picture = entity.attributes.entity_picture || "";
  if (!picture) {
    return "";
  }
  return /^https?:\/\//i.test(picture) ? picture : `${resolveHomeAssistantBaseUrl(state.config.haUrl)}${picture}`;
}

function formatKioskEntityValue(entity) {
  if (!entity || !hasUsefulValue(entity.state)) {
    return "--";
  }
  const unit = normalizeUtilityUnit(entity.attributes && entity.attributes.unit_of_measurement, "");
  if (entity.entity_id === getKioskEntityIds().heartbeat) {
    const date = new Date(entity.attributes && entity.attributes.date ? entity.attributes.date : entity.state);
    return Number.isNaN(date.getTime()) ? String(entity.state) : date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
  }
  if (entity.entity_id === getKioskEntityIds().network) {
    return String(entity.state);
  }
  return `${entity.state}${unit ? ` ${unit}` : ""}`.trim();
}

function formatKioskLastChanged(entity) {
  if (!entity || !entity.last_changed) {
    return "";
  }
  const date = new Date(entity.last_changed);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
}

function formatOnOff(entity) {
  const stateValue = entity && entity.state ? String(entity.state).toLowerCase() : "";
  if (stateValue === "on") {
    return "Tændt";
  }
  if (stateValue === "off") {
    return "Slukket";
  }
  return "--";
}

function handleTechniqueThemeClick(event) {
  const themeButton = event.target.closest("[data-theme-choice]");
  if (!themeButton) {
    return;
  }

  const nextTheme = String(themeButton.dataset.themeChoice || "").trim();
  if (!AVAILABLE_THEMES.includes(nextTheme) || nextTheme === state.config.theme) {
    return;
  }

  setDashboardTheme(nextTheme);
}

function openHouseModesModal() {
  closeTechniqueModal();
  document.body.classList.add("modal-open");
  elements.houseModesModal.classList.add("open");
  elements.houseModesModal.setAttribute("aria-hidden", "false");
  renderHouseModesModal();
}

function closeHouseModesModal() {
  document.body.classList.remove("modal-open");
  elements.houseModesModal.classList.remove("open");
  elements.houseModesModal.setAttribute("aria-hidden", "true");
  state.activeHouseModeKey = "";
}

function renderHouseModesModal() {
  elements.houseModesModalBody.innerHTML = buildHouseModesMarkup();
}

function buildHouseModesMarkup() {
  const lookup = buildEntityLookup();
  const globalParty = lookup.get("input_boolean.party_mode");
  const globalPartyActive = isOnEntity(globalParty);

  return `
    <div class="house-modes-shell">
      <div class="house-modes-grid">
        ${buildGuestHouseModeCard(lookup)}
        ${HOUSE_MODE_CARDS.map((card) => buildHouseModeCard(card, lookup, globalPartyActive)).join("")}
      </div>
    </div>
  `;
}

function buildGuestHouseModeCard(lookup) {
  const entity = lookup.get(HOUSE_GUEST_MODE_CARD.entityId) || null;
  const active = isOnEntity(entity);
  const cardClasses = ["house-mode-card", active ? "is-guest" : "is-off"];
  const statusLabel = active ? "Aktiv g?stetilstand" : "Manuel g?stetilstand";

  return `
    <article class="${cardClasses.join(" ")}" data-house-mode-key="${HOUSE_GUEST_MODE_CARD.key}">
      <button type="button" class="house-mode-trigger" data-house-mode-action="toggle-guest-mode" data-house-mode-key="${HOUSE_GUEST_MODE_CARD.key}">
        <div class="house-mode-copy">
          <span class="house-mode-name">${escapeHtml(HOUSE_GUEST_MODE_CARD.name)}</span>
          <strong class="house-mode-badge ${active ? "guest" : "off"}">${active ? "ON" : "OFF"}</strong>
          <p class="house-mode-status">${escapeHtml(statusLabel)}</p>
        </div>
        <div class="house-mode-bg-icon" aria-hidden="true">◉</div>
      </button>
    </article>
  `;
}

function buildHouseModeCard(config, lookup, globalPartyActive) {
  const automation = lookup.get(config.automationEntityId) || null;
  const motion = lookup.get(config.motionEntityId) || null;
  const party = config.partyEntityId ? lookup.get(config.partyEntityId) || null : null;
  const automationOn = isOnEntity(automation);
  const motionOn = isOnEntity(motion);
  const partyOn = globalPartyActive || isOnEntity(party);
  const currentMode = partyOn ? "party" : automationOn ? "auto" : "off";
  const expanded = state.activeHouseModeKey === config.key;
  const modeLabel = partyOn ? "PARTY" : automationOn ? "AUTO" : "OFF";
  const statusLabel = partyOn
    ? "Festtilstand aktiv"
    : motionOn
      ? "Bevægelse registreret"
      : "Tryk for tilstande";
  const cardClasses = ["house-mode-card", `is-${currentMode}`];
  if (expanded) {
    cardClasses.push("is-expanded");
  }

  return `
    <article class="${cardClasses.join(" ")}" data-house-mode-key="${config.key}">
      <button type="button" class="house-mode-trigger" data-house-mode-action="toggle-popover" data-house-mode-key="${config.key}">
        <div class="house-mode-copy">
          <span class="house-mode-name">${escapeHtml(config.name)}</span>
          <strong class="house-mode-badge ${currentMode}">${modeLabel}</strong>
          <p class="house-mode-status">${escapeHtml(statusLabel)}</p>
        </div>
        <div class="house-mode-bg-icon" aria-hidden="true">${motionOn ? "◔" : "○"}</div>
      </button>
      ${expanded ? buildHouseModePopover(config, currentMode) : ""}
    </article>
  `;
}

function buildHouseModePopover(config, currentMode) {
  const supportsParty = Boolean(config.partyEntityId);
  return `
    <div class="house-mode-popover">
      <button type="button" class="house-mode-option ${currentMode === "off" ? "active" : ""}" data-house-mode-action="set-mode" data-house-mode-key="${config.key}" data-mode="off">
        <span>OFF</span>
        <strong>Slukket</strong>
      </button>
      <button type="button" class="house-mode-option ${currentMode === "auto" ? "active" : ""}" data-house-mode-action="set-mode" data-house-mode-key="${config.key}" data-mode="auto">
        <span>AUTO</span>
        <strong>Automatik</strong>
      </button>
      <button type="button" class="house-mode-option ${currentMode === "party" ? "active" : ""} ${supportsParty ? "" : "disabled"}" data-house-mode-action="set-mode" data-house-mode-key="${config.key}" data-mode="party" ${supportsParty ? "" : "disabled"}>
        <span>PARTY</span>
        <strong>${supportsParty ? "Festtilstand" : "Ikke aktiv"}</strong>
      </button>
    </div>
  `;
}

async function handleHouseModesClick(event) {
  const actionButton = event.target.closest("[data-house-mode-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.houseModeAction;
  if (action === "toggle-guest-mode") {
    actionButton.disabled = true;
    try {
      const shouldContinue = window.confirm(
        "Skift G?ster/Party mode?\n\nVed aktivering:\n- Party-lyslogik aktiveres\n- Normal lys-automatik pauses\n- G?r automatisk tilbage til normal drift kl. 06:00 n?ste dag\n\nVed deaktivering gendannes normal drift med det samme."
      );
      if (!shouldContinue) {
        return;
      }
      await toggleEntityFromModal(HOUSE_GUEST_MODE_CARD.entityId);
      await refreshDashboard();
      renderHouseModesModal();
    } catch (error) {
      console.error(error);
    } finally {
      if (actionButton.isConnected) {
        actionButton.disabled = false;
      }
    }
    return;
  }

  const key = actionButton.dataset.houseModeKey || "";
  const config = HOUSE_MODE_CARDS.find((item) => item.key === key);
  if (!config) {
    return;
  }

  if (action === "toggle-popover") {
    state.activeHouseModeKey = state.activeHouseModeKey === key ? "" : key;
    renderHouseModesModal();
    return;
  }

  if (action !== "set-mode") {
    return;
  }

  const mode = actionButton.dataset.mode || "off";
  actionButton.disabled = true;

  try {
    await setHouseMode(config, mode);
    state.activeHouseModeKey = key;
    await refreshDashboard();
    renderHouseModesModal();
  } catch (error) {
    console.error(error);
  } finally {
    if (actionButton.isConnected) {
      actionButton.disabled = false;
    }
  }
}

async function setHouseMode(config, mode) {
  if (!config || !config.automationEntityId) {
    return;
  }

  if (mode === "off") {
    await callHomeAssistantService(state.config, "automation", "turn_off", { entity_id: config.automationEntityId });
    if (config.partyEntityId) {
      await callHomeAssistantService(state.config, "input_boolean", "turn_off", { entity_id: config.partyEntityId });
    }
    return;
  }

  if (mode === "auto") {
    await callHomeAssistantService(state.config, "automation", "turn_on", { entity_id: config.automationEntityId });
    if (config.partyEntityId) {
      await callHomeAssistantService(state.config, "input_boolean", "turn_off", { entity_id: config.partyEntityId });
    }
    return;
  }

  if (mode === "party" && config.partyEntityId) {
    await callHomeAssistantService(state.config, "automation", "turn_on", { entity_id: config.automationEntityId });
    await callHomeAssistantService(state.config, "input_boolean", "turn_on", { entity_id: config.partyEntityId });
  }
}

function openRoomModal(room) {
  if (!room) {
    return;
  }

  state.activeRoomKey = room.key || "";
  state.activeRoomClimateEntityId = "";
  state.roomModalView = "lights";
  elements.roomModalTitle.textContent = room.name;
  elements.roomModalBody.innerHTML = buildRoomModalMarkup(room);
  document.body.classList.add("modal-open");
  elements.roomModal.classList.add("open");
  elements.roomModal.setAttribute("aria-hidden", "false");
}

function closeRoomModal() {
  document.body.classList.remove("modal-open");
  elements.roomModal.classList.remove("open");
  elements.roomModal.setAttribute("aria-hidden", "true");
  state.activeRoomKey = "";
  state.activeRoomClimateEntityId = "";
  state.roomModalView = "lights";
}

function handleRoomGridClick(event) {
  const card = event.target.closest(".room-card");
  if (!card) {
    return;
  }

  const room = state.roomCards[Number(card.dataset.roomIndex)];
  openRoomModal(room);
}

function handleRoomGridKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".room-card");
  if (!card) {
    return;
  }

  event.preventDefault();
  const room = state.roomCards[Number(card.dataset.roomIndex)];
  openRoomModal(room);
}

async function handleRoomModalClick(event) {
  const tabButton = event.target.closest("[data-room-tab]");
  if (tabButton) {
    state.roomModalView = tabButton.dataset.roomTab || "lights";
    refreshOpenRoomModal();
    return;
  }

  const actionButton = event.target.closest("[data-room-action]");
  if (!actionButton) {
    return;
  }

  const action = actionButton.dataset.roomAction;
  actionButton.disabled = true;

  try {
    if (action === "open-climate-panel") {
      const entityId = actionButton.dataset.entityId || "";
      state.activeRoomClimateEntityId = state.activeRoomClimateEntityId === entityId ? "" : entityId;
      refreshOpenRoomModal();
      return;
    } else if (action === "climate-mode") {
      const entityId = actionButton.dataset.entityId;
      const hvacMode = actionButton.dataset.hvacMode;
      await callHomeAssistantService(state.config, "climate", "set_hvac_mode", {
        entity_id: entityId,
        hvac_mode: hvacMode
      });
    } else if (action === "climate-temp-delta" || action === "climate-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const climate = findEntityById(entityId);
      const current = Number(climate && climate.attributes ? climate.attributes.temperature : NaN);
      const base = Number.isFinite(current) ? current : 21;
      const nextTemperature = Math.round((base + delta) * 10) / 10;
      await callHomeAssistantService(state.config, "climate", "set_temperature", {
        entity_id: entityId,
        temperature: nextTemperature
      });
    } else if (action === "number-delta") {
      const entityId = actionButton.dataset.entityId;
      const delta = Number(actionButton.dataset.delta || "0");
      const numberEntity = findEntityById(entityId);
      const current = Number(numberEntity ? numberEntity.state : NaN);
      const step = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.step : NaN);
      const min = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.min : NaN);
      const max = Number(numberEntity && numberEntity.attributes ? numberEntity.attributes.max : NaN);
      const actualStep = Number.isFinite(step) && step > 0 ? step : Math.abs(delta) || 0.5;
      let nextValue = Number.isFinite(current) ? current + delta : 21 + delta;
      nextValue = Math.round(nextValue / actualStep) * actualStep;
      if (Number.isFinite(min)) {
        nextValue = Math.max(min, nextValue);
      }
      if (Number.isFinite(max)) {
        nextValue = Math.min(max, nextValue);
      }
      await callHomeAssistantService(state.config, "number", "set_value", {
        entity_id: entityId,
        value: Number(nextValue.toFixed(2))
      });
    } else if (action === "toggle-entity") {
      const entityId = actionButton.dataset.entityId;
      await toggleEntityFromModal(entityId);
    } else if (action === "activate-scene") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "scene", "turn_on", {
        entity_id: entityId
      });
    } else if (action === "run-script") {
      const entityId = actionButton.dataset.entityId;
      await callHomeAssistantService(state.config, "script", "turn_on", {
        entity_id: entityId
      });
    } else if (action === "vacuum-service") {
      const entityId = actionButton.dataset.entityId;
      const service = actionButton.dataset.service;
      if (!entityId || !service) {
        return;
      }
      await callHomeAssistantService(state.config, "vacuum", service, {
        entity_id: entityId
      });
    }

    await refreshDashboard();
    refreshOpenRoomModal();
  } catch (error) {
    console.error(error);
  } finally {
    if (actionButton.isConnected) {
      actionButton.disabled = false;
    }
  }
}

function buildPlaceholderRooms() {
  return getConfiguredRoomDefinitions()
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((room) => ({
      key: room.key,
      name: room.label,
      presenceLabel: "Empty",
      presenceActive: false,
      lightLabel: "Ingen lys",
      lightBadgeLabel: "0 lys",
      lightOn: false,
      temperatureLabel: "--",
      humidityLabel: "--",
      meta: "Afventer Home Assistant",
      entities: [],
      lights: []
    }));
}

function formatWeatherSpeedUnit(unit) {
  const normalized = String(unit || "km/h").trim();
  return normalized === "km/h" ? "km/t" : normalized;
}

function getActiveUtilityConfig() {
  const utilityConfig = getUtilityConfigMap();
  return utilityConfig[state.utilityView] || utilityConfig.electric || UTILITY_VIEW_CONFIG.electric;
}

function formatUtilityEntityValue(entity, config) {
  const value = Number(entity && entity.state);
  if (!Number.isFinite(value)) {
    return "--";
  }

  if (config.unit === "W") {
    return value >= 1000 ? `${formatNumber(value / 1000, 2)} kW` : `${Math.round(value)} W`;
  }

  if (config.unit === "kW") {
    return `${formatNumber(value, value >= 10 ? 1 : 2)} kW`;
  }

  if (config.unit === "m³") {
    return `${formatNumber(value, 3)} m³`;
  }

  return `${formatNumber(value, 2)} ${config.unit}`.trim();
}

function formatUtilityMeta(entity, config) {
  if (!entity || !hasUsefulValue(entity.state)) {
    return `${config.todayLabel} --`;
  }

  const unit = normalizeUtilityUnit(entity.attributes && entity.attributes.unit_of_measurement, config.chartUnit);
  const value = Number(entity.state);
  if (!Number.isFinite(value)) {
    return `${config.todayLabel} ${entity.state}`;
  }

  if (unit === "L/h") {
    return `${config.todayLabel} ${Math.round(value)} L/h`;
  }

  if (unit === "kWh") {
    return `${config.todayLabel} ${formatNumber(value, 2)} kWh`;
  }

  if (unit === "m³") {
    return `${config.todayLabel} ${formatNumber(value, 3)} m³`;
  }

  return `${config.todayLabel} ${formatNumber(value, 2)} ${unit}`.trim();
}

function buildRoomCards(allStates) {
  if (!Array.isArray(allStates) || !allStates.length) {
    return buildPlaceholderRooms();
  }

  const roomNames = new Map();
  allStates.forEach((entity) => {
    const key = getRoomKeyForEntity(entity);
    if (!key) {
      return;
    }
    if (!roomNames.has(key)) {
      roomNames.set(key, formatRoomName(key));
    }
  });

  if (!roomNames.size) {
    return buildPlaceholderRooms();
  }

  getRoomDefinitionsForDashboard().forEach((room) => {
    if (!roomNames.has(room.key)) {
      roomNames.set(room.key, room.label);
    }
  });

  return Array.from(roomNames.entries())
    .map(([key, name]) => buildRoomCard(allStates, key, name))
    .filter(Boolean)
    .sort((left, right) => compareRoomCards(left, right))
    .slice(0, 12);
}

function getRoomCardLightEntities(allStates, roomKey, roomEntities) {
  const explicitLightsByRoom = {};

  const popupConfigs = getRoomPopupConfigMap();
  const configuredLightIds = explicitLightsByRoom[roomKey] ||
    (popupConfigs[roomKey] && Array.isArray(popupConfigs[roomKey].lights)
      ? popupConfigs[roomKey].lights
      : []);

  if (configuredLightIds.length) {
    const configuredLights = configuredLightIds
      .map((entityId) => allStates.find((entity) => entity.entity_id === entityId))
      .filter(Boolean);

    if (configuredLights.length) {
      return configuredLights;
    }
  }

  return roomEntities.filter((entity) => entity.entity_id.startsWith("light."));
}

function buildRoomCard(allStates, roomKey, roomName) {
  const roomEntities = allStates.filter((entity) => getRoomKeyForEntity(entity) === roomKey);
  const temperature = findPreferredRoomEntity(allStates, roomKey, "temperature") ||
    pickBestRoomEntity(roomEntities, (entity) => isRoomTemperatureEntity(entity));
  const humidity = findPreferredRoomEntity(allStates, roomKey, "humidity") ||
    pickBestRoomEntity(roomEntities, (entity) => isRoomHumidityEntity(entity));
  const presence = pickBestRoomEntity(roomEntities, (entity) =>
    /^(binary_sensor|person|device_tracker|sensor)\./.test(entity.entity_id) &&
    /(presence|occup|bev|motion|person|home|gruppe)/i.test(entity.entity_id + getFriendlyName(entity))
  );
  const lightEntities = getRoomCardLightEntities(allStates, roomKey, roomEntities);

  const lightsOn = lightEntities.filter((entity) => isOnEntity(entity)).length;
  const activeRgbLight = lightEntities.find((entity) => isOnEntity(entity) && entity && entity.attributes && Array.isArray(entity.attributes.rgb_color) && entity.attributes.rgb_color.length >= 3);
  const lightRgb = activeRgbLight ? activeRgbLight.attributes.rgb_color.slice(0, 3).join(", ") : "";
  const lightLabel = lightEntities.length ? (lightsOn > 0 ? `${lightsOn} lys tændt` : "Lys slukket") : "Ingen lys";
  const presenceActive = Boolean(presence && isPresenceActive(presence));
  const presenceLabel = presenceActive ? "Presence" : "Tom";
  const temperatureLabel = readRoomValue(temperature, "°C", 1);
  const humidityLabel = readRoomValue(humidity, "%", 0);
  const lightBadgeLabel = lightEntities.length ? `${lightsOn} lys` : "0 lys";
  const statusLabel = presenceActive ? "Aktiv nu" : "Rolig lige nu";
  const metaParts = [];
  if (temperature && hasUsefulValue(temperature.state)) metaParts.push(getFriendlyName(temperature));
  if (humidity && hasUsefulValue(humidity.state)) metaParts.push(getFriendlyName(humidity));

  return {
    key: roomKey,
    name: roomName,
    presenceLabel,
    presenceActive,
    lightLabel,
    lightBadgeLabel,
    lightOn: lightsOn > 0,
    lightCount: lightsOn,
    lightRgb,
    temperatureLabel,
    humidityLabel,
    statusLabel,
    meta: metaParts.join(" · ") || "Tryk for flere detaljer",
    entities: roomEntities.sort((left, right) => getFriendlyName(left).localeCompare(getFriendlyName(right), "da-DK")),
    temperature,
    humidity,
    presence,
    lights: lightEntities
  };
}

function buildRoomModalMarkup(room) {
  const popupConfigs = getRoomPopupConfigMap();
  if (room && popupConfigs[room.key]) {
    return buildConfiguredRoomModalMarkup(room, state.roomModalView || "lights", popupConfigs[room.key]);
  }

  return buildDefaultRoomModalMarkup(room);
}

function buildLivingRoomRoomModalMarkup(room, activeTab) {
  const lookup = buildEntityLookup();
  const feelsLike = lookup.get("sensor.weather_sensor_feels_like_temperature_living_room") || null;
  const thermostat = lookup.get("climate.thermostate_living_room") || null;
  const windowContacts = lookup.get("binary_sensor.living_room_abningerkontakter") || null;
  const cooling = lookup.get("climate.climate_living_room") || null;

  const tabs = [
    { key: "lights", label: "Overblik", icon: "mdi:lamp" },
    { key: "info", label: "Info", icon: "mdi:information" },
    { key: "media", label: "Media", icon: "mdi:television-classic" }
  ];

  return `
    <div class="room-popup-shell room-popup-living_room">
      ${buildLivingRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling)}
      ${buildLivingRoomSceneButtons()}
      <div class="room-popup-tabs">
        ${tabs.map((tab) => `
          <button
            class="room-popup-tab ${activeTab === tab.key ? "active" : ""}"
            type="button"
            data-room-tab="${tab.key}"
          >
            <span>${tab.label}</span>
          </button>
        `).join("")}
      </div>
      <div class="room-popup-panel">
        ${activeTab === "info" ? buildLivingRoomInfoPanel(lookup) : activeTab === "media" ? buildLivingRoomMediaPanel(lookup) : buildLivingRoomLightsPanel(lookup)}
      </div>
    </div>
  `;
}

function buildLivingRoomHeroCard(room, feelsLike, thermostat, windowContacts, cooling) {
  const temperature = Number(room.temperature && room.temperature.state);
  const humidity = Number(room.humidity && room.humidity.state);
  const feels = Number(feelsLike && feelsLike.state);
  const comfortLevel = feelsLike && feelsLike.attributes ? feelsLike.attributes.comfort_level : "";
  const comfortLabel = translateComfortLevel(comfortLevel);
  const windowsOpen = windowContacts && String(windowContacts.state).toLowerCase() === "on";
  const heating = thermostat && thermostat.attributes && thermostat.attributes.hvac_action === "heating";
  const coolingActive = cooling && String(cooling.state).toLowerCase() === "cool";
  const badges = [
    windowsOpen ? `<span class="living_room-hero-badge warning">Vindue Åbent</span>` : "",
    heating && !windowsOpen ? `<span class="living_room-hero-badge heat">Heating</span>` : "",
    coolingActive && !windowsOpen ? `<span class="living_room-hero-badge cool">Køler</span>` : "",
    room.presenceActive ? `<span class="living_room-hero-badge active">Presence</span>` : `<span class="living_room-hero-badge idle">Empty</span>`
  ].filter(Boolean).join("");

  return `
    <section class="living_room-hero-card">
      <div class="living_room-hero-main">
        <div class="living_room-hero-copy">
          <p class="living_room-hero-eyebrow">LivingRoom</p>
          <h3>${Number.isFinite(temperature) ? formatNumber(temperature, 1) : "--"}° <span>${Number.isFinite(humidity) ? `${formatNumber(humidity, 0)}%` : "--"}</span></h3>
          <p class="living_room-hero-subtitle">${comfortLabel ? `Komfort: ${comfortLabel}` : "Rumstatus"}</p>
          <p class="living_room-hero-meta">${Number.isFinite(feels) ? `Føles som ${formatNumber(feels, 1)}°` : "Føles som --"}</p>
        </div>
        ${buildRoomClimateControlStack(thermostat, cooling, "LivingRoom", windowsOpen)}
      </div>
      <div class="living_room-hero-badges">${badges}</div>
    </section>
  `;
}

function buildLivingRoomSceneButtons() {
  const scenes = [
    { label: "Klar", kicker: "Scene", script: "script.set_living_room_presence_nar_overstyret_klar", tone: "neutral" },
    { label: "Energi", kicker: "Eco", script: "script.set_living_room_presence_nar_overstyret_energi", tone: "cyan" },
    { label: "Dæmpet", kicker: "Aften", script: "script.set_living_room_presence_nar_overstyret_dampet", tone: "amber" },
    { label: "Natlys", kicker: "Nat", script: "script.set_living_room_presence_nar_overstyret_ambient", tone: "orange" }
  ];

  return `
    <section class="living_room-scene-grid">
      ${scenes.map((scene) => `
        <button class="living_room-scene-button" type="button" data-tone="${scene.tone}" data-room-action="run-script" data-entity-id="${scene.script}">
          <span class="living_room-scene-icon">${scene.kicker}</span>
          <strong>${scene.label}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

function buildLivingRoomLightsPanel(lookup) {
  const lights = [
    "light.living_room_midt_3_lamper",
    "light.spot_living_room",
    "light.stor_pantella_2",
    "light.sofa_living_room_2"
  ].map((entityId) => lookup.get(entityId)).filter(Boolean);

  return `
    <div class="living_room-tile-grid">
      ${lights.map((entity) => buildLivingRoomLightTile(entity)).join("")}
    </div>
  `;
}

function buildLivingRoomInfoPanel(lookup) {
  const tiles = [
    buildBinaryStateTile(lookup.get("binary_sensor.living_room_terracedor"), "Terracedør", "Lukket", "Åben"),
    buildBinaryStateTile(lookup.get("binary_sensor.living_room_vindue_mod_have"), "Mod have", "Lukket", "Åben"),
    buildBinaryStateTile(lookup.get("binary_sensor.living_roomvindue_mod_vej"), "Mod vej", "Lukket", "Åben"),
    buildBinaryStateTile(lookup.get("binary_sensor.presence_gruppe_living_room"), "Person i rummet", "Ingen", "Bevægelse"),
    buildFanTile(lookup.get("fan.braendeovn"), "Blæser i brændeovn"),
    buildToggleTile(lookup.get("automation.presence_living_room"), "Presence living_room", "automation.presence_living_room"),
    buildToggleTile(lookup.get("automation.living_room_aktiver_ambient_ved_slukning_af_alt_lys_om_natten"), "Ambient lys", "automation.living_room_aktiver_ambient_ved_slukning_af_alt_lys_om_natten"),
    buildToggleTile(lookup.get("input_boolean.toggle_living_room_presence_high_low"), "Scene høj/lav", "input_boolean.toggle_living_room_presence_high_low")
  ].filter(Boolean).join("");

  return `<div class="living_room-tile-grid">${tiles}</div>`;
}

function buildLivingRoomMediaPanel(lookup) {
  const nad = lookup.get("media_player.nad_hifi_2");
  const appleTv = lookup.get("media_player.apple_tv_living_room");
  const mediaCards = [
    buildMediaStatusTile(nad, "NAD HiFi", "Lyd"),
    buildMediaStatusTile(appleTv, "Apple TV", "TV")
  ].filter(Boolean).join("");

  const actions = [
    { label: "Vol -", entityId: "script.lg_tv_living_room_vol_down" },
    { label: "Mute", entityId: "script.lg_tv_living_room_mute" },
    { label: "Vol +", entityId: "script.lgtv_living_room_vol_up" }
  ];

  return `
    <div class="living_room-media-shell">
      <div class="living_room-tile-grid">${mediaCards}</div>
      <div class="living_room-media-actions">
        ${actions.map((action) => `
          <button class="living_room-media-button" type="button" data-room-action="run-script" data-entity-id="${action.entityId}">
            ${action.label}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function buildLivingRoomLightTile(entity) {
  const brightness = Number(entity.attributes && entity.attributes.brightness);
  const percent = Number.isFinite(brightness) ? Math.round((brightness / 255) * 100) : 0;
  const on = String(entity.state).toLowerCase() === "on";

  return `
    <article class="living_room-tile ${on ? "is-on" : ""}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(shortenRoomTileName(getFriendlyName(entity)))}</span>
        <button type="button" class="living_room-mini-action" data-room-action="toggle-entity" data-entity-id="${entity.entity_id}">
          ${on ? "Sluk" : "Tænd"}
        </button>
      </div>
      <strong>${on ? `${percent}%` : "Off"}</strong>
      <div class="living_room-level-bar"><span style="width:${on ? Math.max(8, percent) : 8}%"></span></div>
    </article>
  `;
}

function buildBinaryStateTile(entity, label, offLabel, onLabel) {
  if (!entity) {
    return "";
  }
  const on = String(entity.state).toLowerCase() === "on";
  return `
    <article class="living_room-tile ${on ? "is-alert" : ""}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
      </div>
      <strong>${on ? onLabel : offLabel}</strong>
    </article>
  `;
}

function buildFanTile(entity, label) {
  if (!entity) {
    return "";
  }
  const on = String(entity.state).toLowerCase() === "on";
  return `
    <article class="living_room-tile ${on ? "is-on" : ""}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
        <button type="button" class="living_room-mini-action" data-room-action="toggle-entity" data-entity-id="${entity.entity_id}">
          ${on ? "Sluk" : "Tænd"}
        </button>
      </div>
      <strong>${on ? "Tændt" : "Slukket"}</strong>
    </article>
  `;
}

function buildToggleTile(entity, label) {
  if (!entity) {
    return "";
  }
  const on = String(entity.state).toLowerCase() === "on";
  return `
    <article class="living_room-tile ${on ? "is-on" : "is-off"}">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
        <button type="button" class="living_room-mini-action" data-room-action="toggle-entity" data-entity-id="${entity.entity_id}">
          ${on ? "Fra" : "Til"}
        </button>
      </div>
      <strong>${on ? "Aktiv" : "Inaktiv"}</strong>
    </article>
  `;
}

function buildMediaStatusTile(entity, label, caption) {
  if (!entity) {
    return "";
  }
  const stateLabel = formatRoomEntityState(entity);
  const source = entity.attributes && entity.attributes.source ? String(entity.attributes.source) : "";
  return `
    <article class="living_room-tile living_room-media-tile">
      <div class="living_room-tile-head">
        <span class="living_room-tile-label">${escapeHtml(label)}</span>
      </div>
      <strong>${escapeHtml(stateLabel)}</strong>
      <p>${escapeHtml(source || caption)}</p>
    </article>
  `;
}

function buildEntityLookup() {
  return new Map((state.lastAllStates || []).map((entity) => [entity.entity_id, entity]));
}

function findEntityById(entityId) {
  return (state.lastAllStates || []).find((entity) => entity.entity_id === entityId) || null;
}

async function toggleEntityFromModal(entityId) {
  const entity = findEntityById(entityId);
  if (!entity || !entityId.includes(".")) {
    throw new Error("ROOM_ENTITY_MISSING");
  }

  const domain = entityId.split(".")[0];
  const on = isOnEntity(entity);
  const service = on ? "turn_off" : "turn_on";
  await callHomeAssistantService(state.config, domain, service, { entity_id: entityId });
}

function refreshOpenRoomModal() {
  if (!elements.roomModal.classList.contains("open") || !state.activeRoomKey) {
    return;
  }
  const room = state.roomCards.find((entry) => entry.key === state.activeRoomKey);
  if (!room) {
    return;
  }
  elements.roomModalTitle.textContent = room.name;
  elements.roomModalBody.innerHTML = buildRoomModalMarkup(room);
}

function translateComfortLevel(value) {
  const map = {
    comfortable: "Behageligt",
    slightly_warm: "Lidt varmt",
    warm: "Varmt",
    hot: "Meget varmt",
    slightly_cool: "Lidt køligt",
    cool: "Køligt",
    cold: "Koldt"
  };
  return map[value] || (value ? toTitleCase(String(value).replace(/_/g, " ")) : "");
}

function readLivingRoomValveLabel(entity) {
  const raw = entity && entity.attributes ? entity.attributes.calibration_balance : "";
  if (!raw) {
    return "";
  }

  try {
    const payload = JSON.parse(raw);
    const value =
      payload && payload["climate.living_room_thermostat_mod_haven"] && payload["climate.living_room_thermostat_mod_haven"]["valve%"] !== undefined
        ? payload["climate.living_room_thermostat_mod_haven"]["valve%"]
        : payload && payload["climate.living_room_thermostat_mod_vej"] && payload["climate.living_room_thermostat_mod_vej"]["valve%"] !== undefined
          ? payload["climate.living_room_thermostat_mod_vej"]["valve%"]
          : null;
    return value !== null && value !== undefined ? `${formatNumber(value, 0)}%` : "";
  } catch (error) {
    return "";
  }
}

function shortenRoomTileName(value) {
  return String(value || "")
    .replace(/^LivingRoom?\s+/i, "")
    .replace(/^LivingRoom\s+/i, "")
    .trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function pickBestRoomEntity(entities, predicate) {
  const filtered = entities.filter((entity) => predicate(entity));
  const preferred = filtered.filter((entity) => !isSecondaryRoomSensor(entity));
  return preferred.find((entity) => hasUsefulValue(entity.state)) ||
    filtered.find((entity) => hasUsefulValue(entity.state)) ||
    preferred[0] ||
    filtered[0] ||
    null;
}

function isOnEntity(entity) {
  return ["on", "open", "opening", "home"].includes(String(entity && entity.state || "").toLowerCase());
}

function isPresenceActive(entity) {
  const normalized = String(entity.state || "").toLowerCase();
  if (["on", "home", "occupied", "detected", "present"].includes(normalized)) {
    return true;
  }
  if (normalized === "off" || normalized === "not_home" || normalized === "clear") {
    return false;
  }
  return hasUsefulValue(entity.state) && normalized !== "0";
}

function readRoomValue(entity, suffix, decimals) {
  if (!entity || !hasUsefulValue(entity.state) || Number.isNaN(Number(entity.state))) {
    return "--";
  }
  return `${formatNumber(entity.state, decimals)} ${suffix}`.trim();
}

function formatRoomEntityState(entity) {
  if (!entity) {
    return "--";
  }

  const unit = entity.attributes && entity.attributes.unit_of_measurement ? ` ${entity.attributes.unit_of_measurement}` : "";
  return `${entity.state}${unit}`.trim();
}

function isSecondaryRoomSensor(entity) {
  const source = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
  return /(?:^|[_\s-])2(?:$|[_\s-])/.test(source) || /temp\s*&\s*fugtighed.*_2/i.test(source);
}

function isRoomTemperatureEntity(entity) {
  if (!entity || !entity.entity_id.startsWith("sensor.")) {
    return false;
  }

  const entityId = entity.entity_id.toLowerCase();
  const friendlyName = getFriendlyName(entity).toLowerCase();
  const unit = String(entity.attributes && entity.attributes.unit_of_measurement || "").toLowerCase();
  const deviceClass = String(entity.attributes && entity.attributes.device_class || "").toLowerCase();

  if (deviceClass === "humidity" || /humidity|fugt/.test(entityId) || unit === "%") {
    return false;
  }

  return deviceClass === "temperature" ||
    /_temperature\b/.test(entityId) ||
    /(^|[_\s-])temperature($|[_\s-])/.test(entityId) ||
    /temperatur/.test(entityId) ||
    (/temperatur/.test(friendlyName) && !/fugt/.test(friendlyName)) ||
    unit.includes("c");
}

function isRoomHumidityEntity(entity) {
  if (!entity || !entity.entity_id.startsWith("sensor.")) {
    return false;
  }

  const entityId = entity.entity_id.toLowerCase();
  const friendlyName = getFriendlyName(entity).toLowerCase();
  const unit = String(entity.attributes && entity.attributes.unit_of_measurement || "").toLowerCase();
  const deviceClass = String(entity.attributes && entity.attributes.device_class || "").toLowerCase();

  if (deviceClass === "temperature" || /temperature|temperatur/.test(entityId) || unit.includes("c")) {
    return false;
  }

  return deviceClass === "humidity" ||
    /_humidity\b/.test(entityId) ||
    /(^|[_\s-])humidity($|[_\s-])/.test(entityId) ||
    /fugt/.test(entityId) ||
    (/fugt/.test(friendlyName) && !/temperatur/.test(friendlyName)) ||
    unit === "%";
}

function getRoomKeyForEntity(entity) {
  const source = `${entity.entity_id} ${getFriendlyName(entity)}`.toLowerCase();
  const match = getRoomDefinitionsForDashboard().find((room) => room.aliases.some((alias) => source.includes(alias)));
  return match ? match.key : "";
}

function formatRoomName(key) {
  const room = getRoomDefinitionsForDashboard().find((entry) => entry.key === key);
  return room ? room.label : toTitleCase(key);
}

function findPreferredRoomEntity(allStates, roomKey, kind) {
  const explicitIds = ROOM_SENSOR_IDS[roomKey] && ROOM_SENSOR_IDS[roomKey][kind];
  const sensorBases = ROOM_SENSOR_BASES[roomKey];
  const exactIds = Array.isArray(explicitIds) && explicitIds.length
    ? explicitIds
    : (Array.isArray(sensorBases) && sensorBases.length ? sensorBases.map((base) => `sensor.${base}_${kind}`) : []);

  if (!exactIds.length) {
    return null;
  }

  for (const entityId of exactIds) {
    const match = allStates.find((entity) => entity.entity_id === entityId);
    if (match) {
      return match;
    }
  }

  return null;
}

function compareRoomCards(left, right) {
  return getRoomOrder(left.key) - getRoomOrder(right.key) || left.name.localeCompare(right.name, "da-DK");
}

function getRoomOrder(key) {
  const roomDefinitions = getRoomDefinitionsForDashboard();
  const index = roomDefinitions.findIndex((room) => room.key === key);
  return index === -1 ? roomDefinitions.length + 1 : index;
}

const ROOM_SENSOR_BASES = {
  living_room: ["living_room"],
  dining_room: ["dining_room"],
  kitchen: ["kitchen"],
  utility: ["utility"],
  office: ["office"],
  bedroom: ["bedroom"],
  bathroom: ["bathroom"],
  garage: ["garage"],
  outdoor: ["outdoor"],
  guest_wc: ["guest_wc"]
};

const ROOM_SENSOR_IDS = {
  utility: {
    temperature: ["sensor.utility_rog_temperatur_2"],
    humidity: ["sensor.utility_rog_luftfugtighed_2"]
  }
};

const ROOM_DEFINITIONS = [
  { key: "living_room", label: "LivingRoom", aliases: [" temp & fugtighed living_room", "temperature_humidity_living_room", " living_room ", ".living_room", "_living_room"], sensorBases: ["temperature_humidity_living_room"], order: 0 },
  { key: "dining_room", label: "DiningRoom", aliases: ["temp & fugtighed dining_room", "dining_room", "dining_room"], sensorBases: ["temperature_humidity_dining_room"], order: 1 },
  { key: "kitchen", label: "Kitchen", aliases: ["temp & fugtighed kitchen", "temperature_humidity_kitchen", "kitchen", "kitchen"], order: 2 },
  { key: "utility", label: "Utility", aliases: ["utility"], order: 3 },
  { key: "office", label: "Office", aliases: ["temp & fugtighed office", "office"], order: 4 },
  { key: "room_one", label: "Room One", aliases: ["temp & fugtighed room_one", "room_one"], order: 5 },
  { key: "room_two", label: "Room Two", aliases: ["temp & fugtighed room_two", "room_two"], order: 6 },
  { key: "bedroom", label: "Bedroom", aliases: ["temp & fugtighed bedroom", "bedroom", "bedroom"], order: 7 },
  { key: "bathroom", label: "Bathroom", aliases: ["temp & fugtighed bathroom", "bathroom", "bathroom"], order: 8 },
  { key: "garage", label: "Garage", aliases: ["temp & fugtighed garage", "garage", "garage"], order: 9 },
  { key: "terrace", label: "Udendørs", aliases: ["temp & fugtighed terrace", "temperature_humidity_terrace", "temperature_humidity_udendors", "temperature_humidity_udendoers", "udendors", "udendørs", "terrace"], order: 10 },
  { key: "guest_wc", label: "Lille WC", aliases: ["temp & fugtighed lille wc", "temperature_humidity_guest_wc", "guest_wc", "lille wc", "toilet"], order: 11 }
];

function extractSecurityData(allStates) {
  const alarm = allStates.find((entity) =>
    entity.entity_id.startsWith("alarm_control_panel.") &&
    !/vehicle|vehicle|vehicle|vehicle|car/i.test(entity.entity_id + getFriendlyName(entity))
  ) || null;

  const exactOrder = [
    "lock.utility_door",
    "lock.front_door",
    "lock.garage_door",
    "binary_sensor.garageport_contact",
    "binary_sensor.terracedor_las_contact"
  ];

  const aliasMatchers = [
    /brygger.*d[?o]r|utilityd[?o]r/i,
    /front.*d[?o]r|front.*d[?o]r/i,
    /garage.*d[?o]r|garaged[?o]r|garage/i,
    /garage.*port|garageport/i,
    /terrace.*d[?o]r|terracedor/i
  ];

  const locks = exactOrder
    .map((entityId, index) =>
      allStates.find((entity) => entity.entity_id === entityId) ||
      allStates.find((entity) => /^(lock|cover|binary_sensor)\./.test(entity.entity_id) && aliasMatchers[index].test(`${entity.entity_id} ${getFriendlyName(entity)}`))
    )
    .filter(Boolean);

  return {
    alarm,
    locks,
    openWindows: allStates.find((entity) => entity.entity_id === "sensor.open_windows") || null,
    hasMail: allStates.find((entity) => entity.entity_id === "input_boolean.mail_present") || null
  };
}

function countSecurityStates(entities, openWindowsEntity = null) {
  const base = entities.reduce((acc, entity) => {
    const domain = entity.entity_id.split(".")[0];
    const normalized = String(entity.state || "").toLowerCase();
    if (domain === "binary_sensor" || domain === "cover") {
      if (normalized === "on" || normalized === "open" || normalized === "opening") {
        acc.open += 1;
      } else {
        acc.locked += 1;
      }
    } else if (normalized === "unlocked" || normalized === "unlocking") {
      acc.unlocked += 1;
    } else {
      acc.locked += 1;
    }
    return acc;
  }, { unlocked: 0, open: 0, locked: 0 });

  const openWindows = openWindowsEntity && hasUsefulValue(openWindowsEntity.state)
    ? Math.max(0, Number(openWindowsEntity.state) || 0)
    : 0;

  return {
    ...base,
    windows: openWindows,
    unsecured: base.unlocked + base.open + openWindows
  };
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows && !securityData.hasMail)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const mailActive = securityData.hasMail && String(securityData.hasMail.state).toLowerCase() === "on";
  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = counts.unsecured > 0
    ? `${counts.unsecured} Åbne`
    : (mailActive ? "Mail detected" : (securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Alt lukket"));
  elements.securityAlarmMeta.textContent = [
    securityData.alarm ? `Alarm ${formatAlarmState(securityData.alarm.state).toLowerCase()}` : null,
    `${counts.unlocked} ulåste`,
    `${counts.open + counts.windows} døre/vinduer åbne`,
    mailActive ? "Post i mailbox" : "Ingen post"
  ].filter(Boolean).join(" · ");

  elements.securityLockList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  [
    { glyph: "◫", label: "Åbne", value: counts.open + counts.windows, tone: (counts.open + counts.windows) ? "is-unlocked" : "is-locked" },
    { glyph: "●", label: "Låse", value: counts.unlocked > 0 ? `${counts.unlocked}` : "OK", tone: counts.unlocked > 0 ? "is-unlocked" : "is-locked" },
    { glyph: "✉", label: "Post", value: mailActive ? "JA" : "NEJ", tone: mailActive ? "is-alert" : "is-locked" }
  ].forEach((item) => {
    const chip = document.createElement("div");
    chip.className = `security-lock-chip ${item.tone}`;
    chip.title = `${item.label}: ${item.value}`;
    chip.innerHTML = `
      <span class="security-lock-glyph">${item.glyph}</span>
      <span class="security-lock-label">${item.label}</span>
      <strong>${item.value}</strong>
    `;
    fragment.appendChild(chip);
  });
  elements.securityLockList.appendChild(fragment);
}

function buildSecurityActionButtons(entity) {
  if (entity.entity_id.startsWith("binary_sensor.")) {
    return `<span class="security-action-hint">Kun status</span>`;
  }

  if (entity.entity_id.startsWith("cover.")) {
    return `
      <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="cover" data-service="close_cover" data-entity-id="${entity.entity_id}">Luk</button>
      <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="cover" data-service="open_cover" data-entity-id="${entity.entity_id}">Åbn</button>
    `;
  }

  return `
    <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="lock" data-service="lock" data-entity-id="${entity.entity_id}">Lås</button>
    <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="lock" data-service="unlock" data-entity-id="${entity.entity_id}">Lås op</button>
  `;
}

function buildCalendarModalMarkup(events) {
  if (!events.length) {
    return "<div class=\"calendar-loading\">Ingen kommende aftaler i de næste 7 dage</div>";
  }

  const grouped = new Map();
  events.forEach((event) => {
    const keyDate = getCalendarEventDate(event);
    const key = keyDate.toISOString().slice(0, 10);
    const list = grouped.get(key) || [];
    list.push(event);
    grouped.set(key, list);
  });

  const upcoming = events.slice(0, 6).map((event) => `
    <article class="calendar-event-card">
      <span class="calendar-event-time">${formatCalendarEventRange(event)}</span>
      <strong>${event.summary || "Aftale"}</strong>
      <p>${event.calendarName}${event.location ? ` · ${event.location}` : ""}</p>
    </article>
  `).join("");

  const week = Array.from(grouped.entries()).map(([key, list]) => `
    <section class="calendar-day-group">
      <div class="calendar-day-head">
        <strong>${new Date(key).toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })}</strong>
        <span>${list.length} aftaler</span>
      </div>
      <div class="calendar-day-events">
        ${list.map((event) => `
          <article class="calendar-list-item">
            <span>${formatCalendarEventRange(event)}</span>
            <strong>${event.summary || "Aftale"}</strong>
            <p>${event.calendarName}${event.description ? ` · ${event.description}` : ""}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  const activeView = state.calendarView === "week" ? "week" : "upcoming";

  return `
    <div class="calendar-switcher" role="tablist" aria-label="Kalendervisning">
      <button class="calendar-switcher-button${activeView === "upcoming" ? " active" : ""}" type="button" data-calendar-view="upcoming" aria-selected="${activeView === "upcoming"}">Næste</button>
      <button class="calendar-switcher-button${activeView === "week" ? " active" : ""}" type="button" data-calendar-view="week" aria-selected="${activeView === "week"}">Uge</button>
    </div>
    <div class="calendar-pages">
      <section class="calendar-page${activeView === "upcoming" ? " active" : ""}" data-page="upcoming">
        <p class="panel-label">Næste par dage</p>
        <div class="calendar-upcoming">${upcoming}</div>
      </section>
      <section class="calendar-page${activeView === "week" ? " active" : ""}" data-page="week">
        <p class="panel-label">Ugevisning</p>
        <div class="calendar-week">${week}</div>
      </section>
    </div>
  `;
}

function getCalendarEntityIds(allStates) {
  const preferredOrder = [
    "calendar.th_faelles",
    "calendar.familie",
    "calendar.kids_calendar",
    "calendar.mette_arbejde",
    "calendar.room_one",
    "calendar.john_thorn_halle",
    "calendar.bordtennis",
    "calendar.mette_thorn_halle"
  ];

  const available = new Set(
    allStates
      .filter((entity) => entity.entity_id.startsWith("calendar."))
      .map((entity) => entity.entity_id)
  );

  return preferredOrder.filter((entityId) => available.has(entityId));
}

function prettifyCalendarName(entityId) {
  const entity = (state.lastAllStates || []).find((item) => item.entity_id === entityId);
  return entity ? getFriendlyName(entity) : entityId.replace(/^calendar\./, "").replace(/_/g, " ");
}

function getCalendarEventTimestamp(event) {
  return getCalendarEventDate(event).getTime();
}

function getCalendarEventDate(event) {
  if (event.start && event.start.dateTime) {
    return new Date(event.start.dateTime);
  }
  if (event.start && event.start.date) {
    return new Date(event.start.date);
  }
  return new Date();
}

function formatCalendarEventRange(event) {
  if (event.start && event.start.date) {
    return "Hele dagen";
  }

  const start = event.start && event.start.dateTime ? new Date(event.start.dateTime) : null;
  const end = event.end && event.end.dateTime ? new Date(event.end.dateTime) : null;
  if (!start) {
    return "--";
  }

  const startText = start.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" });
  const endText = end ? end.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" }) : "";
  return endText ? `${startText} - ${endText}` : startText;
}

function readEntityValue(entity, unitOverride = "") {
  if (!entity || !hasUsefulValue(entity.state)) {
    return "--";
  }

  if (entity.attributes && entity.attributes.device_class === "timestamp") {
    const date = new Date(entity.state);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    }
  }

  const unit = unitOverride || (entity.attributes && entity.attributes.unit_of_measurement) || "";
  return `${entity.state}${unit ? ` ${unit}` : ""}`.trim();
}

function renderPowerMiniChart(series) {
  const utilityConfig = getActiveUtilityConfig();
  const isWaterChart = utilityConfig.chartUnit === "m³";
  elements.powerMiniChart.classList.toggle("is-water", isWaterChart);

  const signature = buildPowerMiniSignature(series);
  if (signature === state.powerMiniSignature) {
    return;
  }
  state.powerMiniSignature = signature;

  elements.powerMiniChart.innerHTML = "";

  if (!series.length) {
    elements.powerMiniCaption.textContent = "Ingen historik endnu";
    return;
  }

  const populated = series.filter((item) => item.hasData);
  const populatedValues = populated.map((item) => Number(item.value) || 0);
  const waterValues = populatedValues.filter((value) => value > 0);
  const rawMax = isWaterChart
    ? (waterValues.length ? Math.max(...waterValues) : 0)
    : (populatedValues.length ? Math.max(...populatedValues, 1) : 1);
  const max = getUtilityChartScaleMax(rawMax, utilityConfig);
  const fragment = document.createDocumentFragment();

  series.forEach((item, index) => {
    const bar = document.createElement("span");
    const isEmpty = !item.hasData;
    bar.className = `power-mini-bar${isEmpty ? " is-empty" : ""}${item.isFuture ? " is-future" : ""}`;
    bar.style.setProperty("--delay", `${index * 10}ms`);
    const normalized = Math.min((item.value || 0) / max, 1);
    const hue = isWaterChart ? 198 - (normalized * 42) : 160 - (normalized * 160);
    bar.style.height = `${isEmpty ? (isWaterChart ? 0 : 8) : Math.max(isWaterChart ? 8 : 12, normalized * 100)}%`;
    bar.style.setProperty("--power-color-top", isEmpty ? "rgba(255,255,255,0.08)" : `hsl(${Math.max(hue - 10, 0)} 88% ${isWaterChart ? 64 : 62}%)`);
    bar.style.setProperty("--power-color-bottom", isEmpty ? "rgba(255,255,255,0.03)" : `hsl(${Math.max(hue - 20, 0)} 82% ${isWaterChart ? 43 : 46}%)`);
    if (!isEmpty) {
      bar.setAttribute("tabindex", "0");
      const valueLabel = formatUtilityChartValue(item.value, utilityConfig);
      bar.setAttribute("aria-label", `${item.label}: ${valueLabel}`);
      const tooltip = document.createElement("span");
      tooltip.className = "power-mini-tooltip";
      tooltip.textContent = `${item.label} · ${valueLabel}`;
      bar.appendChild(tooltip);
    } else {
      bar.setAttribute("aria-hidden", "true");
    }
    fragment.appendChild(bar);
  });

  elements.powerMiniChart.appendChild(fragment);
  const latest = [...series].reverse().find((item) => item.hasData);
  elements.powerMiniCaption.textContent = latest ? `${utilityConfig.caption} · senest ${latest.label}` : utilityConfig.caption;
}

function getUtilityChartScaleMax(rawMax, config) {
  if (config.chartUnit === "W") {
    return Math.max(getNicePowerScaleMax(rawMax), rawMax);
  }

  if (config.chartUnit === "kW" || config.chartUnit === "kWh") {
    return Math.max(1, Math.ceil(rawMax * 10) / 10);
  }

  if (config.chartUnit === "m³") {
    return rawMax > 0 ? rawMax : 0.001;
  }

  return Math.max(rawMax, 1);
}

function formatUtilityChartValue(value, config) {
  if (config.chartUnit === "W") {
    return value >= 1000 ? `${formatNumber(value / 1000, 2)} kW` : `${Math.round(value)} W`;
  }

  if (config.chartUnit === "kW" || config.chartUnit === "kWh") {
    return `${formatNumber(value, value >= 10 ? 1 : 2)} ${config.chartUnit}`;
  }

  if (config.chartUnit === "m³") {
    return `${formatNumber(value, 3)} m³`;
  }

  return `${formatNumber(value, 2)} ${config.chartUnit}`.trim();
}

function normalizeUtilityUnit(unit, fallback = "") {
  return String(unit || fallback || "")
    .replace("m3", "m³")
    .replace("Â°C", "°C");
}

function renderWeatherForecast(weatherEntity, weatherForecasts = state.weatherForecasts) {
  const attrs = weatherEntity && weatherEntity.attributes ? weatherEntity.attributes : {};
  const forecast = weatherForecasts && Array.isArray(weatherForecasts.daily) && weatherForecasts.daily.length
    ? weatherForecasts.daily.slice(0, 4)
    : (Array.isArray(attrs.forecast) ? attrs.forecast.slice(0, 4) : []);

  elements.weatherForecast.innerHTML = "";
  if (!forecast.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  forecast.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "weather-forecast-item";

    const day = document.createElement("span");
    day.className = "weather-forecast-day";
    day.textContent = entry.datetime
      ? new Date(entry.datetime).toLocaleDateString("da-DK", { weekday: "short" })
      : "Senere";

    const temp = document.createElement("strong");
    temp.className = "weather-forecast-temp";
    const high = entry.temperature !== undefined ? `${formatNumber(entry.temperature, 0)}°` : "--";
    const low = entry.templow !== undefined ? `/${formatNumber(entry.templow, 0)}°` : "";
    temp.textContent = `${high}${low}`;

    const condition = document.createElement("span");
    condition.className = "weather-forecast-condition";
    const rain = entry.precipitation_probability !== undefined
      ? `${Math.round(Number(entry.precipitation_probability))}%`
      : translateWeatherState(entry.condition);
    condition.textContent = rain;

    card.append(day, temp, condition);
    fragment.appendChild(card);
  });

  elements.weatherForecast.appendChild(fragment);
}

function renderPriceCard(priceEntity, priceForecastEntity = null) {
  const summary = buildPriceSummary(priceEntity, priceForecastEntity, state.priceView);
  const forecastAvailable = Boolean(priceForecastEntity);
  elements.pricePrimaryValue.textContent = summary.value;
  elements.pricePrimaryMeta.textContent = summary.meta;
  if (state.priceView === "future") {
    elements.pricePrimaryMeta.textContent = "Swipe for mere data";
    elements.pricePrimaryMeta.hidden = false;
  } else {
    elements.pricePrimaryMeta.hidden = !summary.meta;
  }
  elements.priceChartCaption.textContent =
    state.priceView === "future" || state.priceView === "tomorrow" ? "" : summary.caption;
  elements.priceChartCaption.hidden = state.priceView === "future" || state.priceView === "tomorrow";
  if (elements.priceCard) {
    elements.priceCard.dataset.priceView = summary.view || state.priceView;
    elements.priceCard.dataset.priceSourceType = summary.sourceType || "default";
  }
  elements.priceTodayButton.classList.toggle("active", state.priceView === "today");
  elements.priceTomorrowButton.classList.toggle("active", state.priceView === "tomorrow");
  elements.priceFutureButton.classList.toggle("active", state.priceView === "future");
  elements.priceFutureButton.hidden = !(forecastAvailable || summary.hasFutureDays);
  elements.priceFutureButton.disabled = false;
  const chartSignature = buildPriceChartSignature(summary);
  if (chartSignature !== state.priceChartSignature) {
    state.priceChartSignature = chartSignature;
    renderPriceDayPager(summary);
    elements.priceChart.classList.toggle("is-swipable", state.priceView === "future" && summary.futureDayCount > 1);
    renderPriceChart(summary);
  }
}

function buildPriceSummary(priceEntity, priceForecastEntity, view) {
  const label = view === "tomorrow" ? "i morgen" : view === "future" ? "frem" : "i dag";
  const fallback = {
    view,
    value: "--",
    meta: `Ingen priser ${label}`,
    caption: "",
    series: [],
    highlightIndex: -1,
    hasFutureDays: false,
    futureDayCount: 0,
    futureDayLabel: "",
    sourceType: "default",
    sourceLabel: "",
    leadPrice: null
  };

  if (!priceEntity || !priceEntity.attributes) {
    return fallback;
  }

  const todaySource = getTodayPriceSource(priceEntity);
  const current = getCurrentHourlyPrice(
    todaySource,
    Number(priceEntity.attributes.current_price ?? priceEntity.state)
  );
  const dayCollections = collectAdditionalPriceDays(priceEntity, priceForecastEntity);
  const tomorrowCollection = dayCollections.find((entry) => entry.offset === 1) || null;
  const futureDays = dayCollections.filter((entry) => entry.offset >= 2);
  if (view === "future" && futureDays.length) {
    state.priceFutureIndex = Math.max(0, Math.min(state.priceFutureIndex, futureDays.length - 1));
  } else if (!futureDays.length) {
    state.priceFutureIndex = 0;
  }

  const tomorrowChoice = selectTomorrowPriceSource(priceEntity, priceForecastEntity, tomorrowCollection);
  const tomorrowSource = tomorrowChoice.source;
  const source = view === "tomorrow"
    ? tomorrowSource
    : view === "future"
      ? (futureDays[state.priceFutureIndex] ? futureDays[state.priceFutureIndex].source : null)
      : todaySource;
  const values = getPriceValues(source);
  const series = view === "future" && futureDays[state.priceFutureIndex]
    ? futureDays[state.priceFutureIndex].series
    : view === "tomorrow" && tomorrowChoice.series.length
      ? tomorrowChoice.series
      : buildHourlyPriceSeries(source);

  if (!values.length || !series.length) {
    return {
      ...fallback,
      hasFutureDays: futureDays.length > 0,
      futureDayCount: futureDays.length,
      futureDayLabel: futureDays[state.priceFutureIndex] ? futureDays[state.priceFutureIndex].label : ""
    };
  }

  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const highlightIndex = view === "today" ? new Date().getHours() : -1;
  const futureDay = futureDays[state.priceFutureIndex] || null;
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const tomorrowMeta = `${tomorrowChoice.sourceLabel} · Lav ${formatNumber(minValue, 2)} · Høj ${formatNumber(maxValue, 2)}`;
  const tomorrowCaption = tomorrowChoice.sourceType === "forecast"
    ? "Forecast bruges indtil de officielle priser kommer."
    : "Officielle priser for i morgen.";

  return {
    view,
    value: view === "future" && futureDay
      ? futureDay.label
      : view === "today" && Number.isFinite(current)
        ? `${formatNumber(current, 2)} kr/kWh`
        : `${formatNumber(avg, 2)} kr/kWh`,
    meta: view === "future"
      ? ""
      : view === "tomorrow"
        ? tomorrowMeta
        : `Lav ${formatNumber(minValue, 2)} · Høj ${formatNumber(maxValue, 2)}`,
    caption: view === "future" && futureDayCountLabel(futureDays.length)
      ? `${futureDay ? futureDay.label : ""}`
      : view === "tomorrow"
        ? tomorrowCaption
        : "",
    series,
    highlightIndex,
    hasFutureDays: futureDays.length > 0,
    futureDayCount: futureDays.length,
    futureDayLabel: futureDay ? futureDay.label : "",
    sourceType: view === "tomorrow" ? tomorrowChoice.sourceType : "default",
    sourceLabel: view === "tomorrow" ? tomorrowChoice.sourceLabel : "",
    leadPrice: view === "tomorrow" ? tomorrowChoice.leadPrice : null
  };
}

function renderPriceChart(summary) {
  const { series, highlightIndex, view, sourceType } = summary;
  elements.priceChart.innerHTML = "";

  if (!series.length) {
    const empty = document.createElement("div");
    empty.className = "price-chart-empty";
    empty.textContent = "Ingen prisdata endnu";
    elements.priceChart.appendChild(empty);
    return;
  }

  const max = Math.max(...series.map((item) => item.value), 0.01);
  const min = Math.min(...series.map((item) => item.value));
  const minIndex = series.findIndex((item) => item.value === min);
  const maxIndex = series.findIndex((item) => item.value === max);
  const fragment = document.createDocumentFragment();

  series.forEach((item, index) => {
    const bar = document.createElement("button");
    bar.type = "button";
    bar.className = "price-bar";
    bar.style.setProperty("--delay", `${index * 18}ms`);
    bar.dataset.tooltip = `${item.label}:00 ? ${formatNumber(item.value, 2)} kr/kWh`;
    bar.setAttribute("aria-label", `${item.label}: ${formatNumber(item.value, 2)} kr/kWh`);
    if (index === highlightIndex) {
      bar.classList.add("is-current");
    }
    if (view === "tomorrow" && index === minIndex) {
      bar.classList.add("is-min");
    }
    if (view === "tomorrow" && index === maxIndex) {
      bar.classList.add("is-max");
    }

    const fill = document.createElement("span");
    fill.className = "price-bar-fill";
    fill.style.height = `${Math.max(10, (item.value / max) * 100)}%`;
    const spread = Math.max(max - min, 0.0001);
    const normalized = Math.min(Math.max((item.value - min) / spread, 0), 1);
    const hue = 170 - (normalized * 170);
    fill.style.setProperty("--price-color-top", `hsl(${Math.max(hue - 8, 0)} 88% 64%)`);
    fill.style.setProperty("--price-color-bottom", `hsl(${Math.max(hue - 18, 0)} 82% 48%)`);

    const value = document.createElement("span");
    value.className = "price-bar-value";
    value.textContent = formatNumber(item.value, 2);

    const labelNode = document.createElement("span");
    labelNode.className = "price-bar-label";
    labelNode.textContent = item.label;

    const tooltip = document.createElement("span");
    tooltip.className = "price-bar-tooltip";
    tooltip.textContent = `${item.label}:00 ? ${formatNumber(item.value, 2)} kr/kWh`;

    bar.append(fill, value, labelNode, tooltip);
    fragment.appendChild(bar);
  });

  elements.priceChart.appendChild(fragment);
}

function buildPowerMiniSignature(series) {
  if (!Array.isArray(series) || !series.length) {
    return "empty";
  }

  return series
    .map((item) => `${state.utilityView}:${item.label}:${Number(item.value || 0).toFixed(3)}:${item.hasData ? "1" : "0"}:${item.isFuture ? "1" : "0"}`)
    .join("|");
}

function buildPriceChartSignature(summary) {
  const seriesSignature = Array.isArray(summary.series)
    ? summary.series.map((item) => `${item.label}:${Number(item.value).toFixed(2)}`).join("|")
    : "empty";

  return [
    state.priceView,
    state.priceFutureIndex,
    summary.highlightIndex,
    summary.futureDayLabel || "",
    summary.sourceType || "",
    summary.hasFutureDays ? "1" : "0",
    seriesSignature
  ].join("::");
}

function buildHourlyPriceSeries(source) {
  const list = Array.isArray(source && source.value) ? source.value : Array.isArray(source) ? source : [];
  if (!list.length) {
    return [];
  }

  const buckets = new Map();
  list.forEach((entry, index) => {
    const numericValue = typeof entry === "number"
      ? entry
      : entry && typeof entry.value === "number"
        ? entry.value
        : entry && typeof entry.price === "number"
          ? entry.price
        : Number(entry && entry.value !== undefined ? entry.value : entry);
    if (!Number.isFinite(numericValue)) {
      return;
    }

    const timestamp = entry && (entry.start || entry.hour || entry.time || entry.timestamp || entry.end);
    const date = timestamp ? new Date(timestamp) : new Date(Date.now() + index * 15 * 60 * 1000);
    const hour = date.getHours();
    const currentBucket = buckets.get(hour) || [];
    currentBucket.push(numericValue);
    buckets.set(hour, currentBucket);
  });

  return Array.from(buckets.entries())
    .sort((left, right) => left[0] - right[0])
    .map(([hour, values]) => ({
      hour,
      label: `${String(hour).padStart(2, "0")}`,
      value: values.reduce((sum, value) => sum + value, 0) / values.length
    }));
}

function selectTomorrowPriceSource(priceEntity, priceForecastEntity, tomorrowCollection) {
  const availabilityEntity = (state.lastAllStates || []).find((entity) => entity.entity_id === getCoreEntityId("priceTomorrowAvailable", PRICE_TOMORROW_AVAILABILITY_ENTITY_ID)) || null;
  const availabilityPrices = Array.isArray(availabilityEntity && availabilityEntity.attributes && availabilityEntity.attributes.prices)
    ? availabilityEntity.attributes.prices
    : [];
  const availabilitySource = availabilityPrices.length ? availabilityPrices : null;
  const availabilitySeries = availabilitySource ? buildHourlyPriceSeries(availabilitySource) : [];
  const officialTomorrowSource = priceEntity && priceEntity.attributes
    ? (priceEntity.attributes.raw_tomorrow || priceEntity.attributes.tomorrow)
    : null;
  const officialValues = getPriceValues(officialTomorrowSource);
  const collectionValues = tomorrowCollection ? getPriceValues(tomorrowCollection.source) : [];

  if (availabilitySource && availabilitySeries.length) {
    const isForecast = availabilityEntity && availabilityEntity.attributes && availabilityEntity.attributes.forecast_data === true;
    return {
      source: availabilitySource,
      series: availabilitySeries,
      sourceType: isForecast ? "forecast" : "official",
      sourceLabel: isForecast ? "Forecast priser" : "Officielle priser",
      leadPrice: Number(availabilityPrices[0] && availabilityPrices[0].price)
    };
  }

  if (officialValues.length) {
    return {
      source: officialTomorrowSource,
      series: buildHourlyPriceSeries(officialTomorrowSource),
      sourceType: "official",
      sourceLabel: "Officielle priser",
      leadPrice: officialValues.length ? officialValues[0] : null
    };
  }

  if (tomorrowCollection && collectionValues.length) {
    return {
      source: tomorrowCollection.source,
      series: tomorrowCollection.series,
      sourceType: "forecast",
      sourceLabel: "Forecast priser",
      leadPrice: collectionValues.length ? collectionValues[0] : null
    };
  }

  return {
    source: null,
    series: [],
    sourceType: "default",
    sourceLabel: "Ingen prisdata",
    leadPrice: null
  };
}

function getTomorrowPriceBarColors(value, sourceType = "forecast") {
  const top = sourceType === "forecast" ? 68 : 64;
  const bottom = sourceType === "forecast" ? 52 : 48;

  if (value >= 5.49) {
    return {
      top: `hsl(7 88% ${top}%)`,
      bottom: `hsl(7 76% ${bottom}%)`
    };
  }
  if (value >= 3.99) {
    return {
      top: `hsl(18 88% ${top}%)`,
      bottom: `hsl(18 76% ${bottom}%)`
    };
  }
  if (value >= 1.99) {
    return {
      top: `hsl(38 88% ${top}%)`,
      bottom: `hsl(38 76% ${bottom}%)`
    };
  }

  return {
    top: `hsl(148 72% ${top}%)`,
    bottom: `hsl(148 68% ${bottom}%)`
  };
}

function setPriceView(view) {
  if (view !== "today" && view !== "tomorrow" && view !== "future") {
    return;
  }

  state.priceView = view;
  renderPriceCard(state.lastSceneData.priceEntity, state.lastSceneData.priceForecastEntity);
}

function renderPriceDayPager(summary) {
  if (state.priceView !== "future" || !summary.hasFutureDays) {
    elements.priceDayPager.hidden = true;
    elements.priceDayPager.innerHTML = "";
    return;
  }
  elements.priceDayPager.hidden = true;
  elements.priceDayPager.innerHTML = "";
}

function stepFuturePriceDay(delta) {
  const days = collectAdditionalPriceDays(state.lastSceneData.priceEntity, state.lastSceneData.priceForecastEntity);
  const futureDays = days.filter((entry) => entry.offset >= 2);
  if (state.priceView !== "future" || futureDays.length < 2) {
    return;
  }

  const nextIndex = Math.max(0, Math.min(state.priceFutureIndex + delta, futureDays.length - 1));
  if (nextIndex === state.priceFutureIndex) {
    return;
  }

  state.priceFutureIndex = nextIndex;
  renderPriceCard(state.lastSceneData.priceEntity, state.lastSceneData.priceForecastEntity);
}

function formatLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function collectAdditionalPriceDays(priceEntity, priceForecastEntity) {
  const sources = [
    priceForecastEntity && priceForecastEntity.attributes ? priceForecastEntity.attributes : null,
    priceEntity && priceEntity.attributes ? priceEntity.attributes : null
  ].filter(Boolean);

  if (!sources.length) {
    return [];
  }

  const todayDate = new Date();
  const todayStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const todayKey = formatLocalDateKey(todayStart);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStart = new Date(tomorrowDate.getFullYear(), tomorrowDate.getMonth(), tomorrowDate.getDate());
  const tomorrowKey = formatLocalDateKey(tomorrowStart);
  const buckets = new Map();

  sources.forEach((attributes) => {
    Object.entries(attributes).forEach(([key, source]) => {
      const list = Array.isArray(source && source.value) ? source.value : Array.isArray(source) ? source : [];
      if (!list.length) {
        return;
      }

      const explicitSeries = buildDailySeriesMap(list);
      explicitSeries.forEach((series, dateKey) => {
        const existing = buckets.get(dateKey);
        if (!existing || series.length > existing.series.length) {
          buckets.set(dateKey, {
            dateKey,
            source: list.filter((entry) => {
              const timestamp = entry && (entry.start || entry.hour || entry.time || entry.timestamp);
              return timestamp && formatLocalDateKey(new Date(timestamp)) === dateKey;
            }),
            series
          });
        }
      });

      if (!explicitSeries.size) {
        const impliedDateKey = /tomorrow/i.test(key) ? tomorrowKey : /today/i.test(key) ? todayKey : "";
        if (!impliedDateKey) {
          return;
        }
        const series = buildHourlyPriceSeries(source);
        const existing = buckets.get(impliedDateKey);
        if (!existing || series.length > existing.series.length) {
          buckets.set(impliedDateKey, { dateKey: impliedDateKey, source, series });
        }
      }
    });
  });

  return Array.from(buckets.values())
    .map((entry) => {
      const date = new Date(`${entry.dateKey}T00:00:00`);
      const offset = Math.round((date.getTime() - todayStart.getTime()) / 86400000);
      return {
        ...entry,
        offset,
        label: date.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })
      };
    })
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey));
}

function buildDailySeriesMap(list) {
  const buckets = new Map();

  list.forEach((entry, index) => {
    const numericValue = typeof entry === "number"
      ? entry
      : entry && typeof entry.value === "number"
        ? entry.value
        : entry && typeof entry.price === "number"
          ? entry.price
        : Number(entry && entry.value !== undefined ? entry.value : entry);
    if (!Number.isFinite(numericValue)) {
      return;
    }

    const timestamp = entry && (entry.start || entry.hour || entry.time || entry.timestamp || entry.end);
    if (!timestamp) {
      return;
    }

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dateKey = formatLocalDateKey(date);
    const bucket = buckets.get(dateKey) || [];
    bucket.push({
      order: index,
      hour: date.getHours(),
      label: `${String(date.getHours()).padStart(2, "0")}`,
      value: numericValue
    });
    buckets.set(dateKey, bucket);
  });

  return new Map(
    Array.from(buckets.entries()).map(([dateKey, entries]) => [
      dateKey,
      entries
        .sort((left, right) => left.hour - right.hour || left.order - right.order)
        .map(({ hour, label, value }) => ({ hour, label, value }))
    ])
  );
}

function futureDayCountLabel(count) {
  return count > 0 ? `${count}` : "";
}

function buildWeatherModalMarkup(weatherEntity, powerEntity, priceEntity, weatherForecasts = null) {
  const attrs = weatherEntity && weatherEntity.attributes ? weatherEntity.attributes : {};
  const weatherState = weatherEntity ? translateWeatherState(weatherEntity.state) : "Ikke tilgængelig";
  const visual = getWeatherVisual(weatherEntity && weatherEntity.state);
  const temperature = attrs.temperature !== undefined ? `${formatNumber(attrs.temperature, 1)} °C` : "--";
  const apparent = attrs.apparent_temperature !== undefined ? `${formatNumber(attrs.apparent_temperature, 1)} °C` : "--";
  const humidity = attrs.humidity !== undefined ? `${Math.round(Number(attrs.humidity))}%` : "--";
  const pressure = attrs.pressure !== undefined ? `${formatNumber(attrs.pressure, 0)} hPa` : "--";
  const dewPoint = attrs.dew_point !== undefined ? `${formatNumber(attrs.dew_point, 1)} °C` : "--";
  const windUnit = formatWeatherSpeedUnit(attrs.wind_speed_unit);
  const wind = attrs.wind_speed !== undefined ? `${formatNumber(attrs.wind_speed, 1)} ${windUnit}` : "--";
  const windGust = attrs.wind_gust_speed !== undefined ? `${formatNumber(attrs.wind_gust_speed, 1)} ${windUnit}` : "--";
  const windBearing = attrs.wind_bearing !== undefined ? `${Math.round(Number(attrs.wind_bearing))}°` : "--";
  const precipitationUnit = attrs.precipitation_unit || "mm";
  const precipitation = attrs.precipitation !== undefined ? `${formatNumber(Number(attrs.precipitation || 0), 1)} ${precipitationUnit}` : "--";
  const visibility = attrs.visibility !== undefined ? `${formatNumber(attrs.visibility, 1)} ${attrs.visibility_unit || "km"}` : "--";
  const uvIndex = attrs.uv_index !== undefined ? `${formatNumber(attrs.uv_index, 1)}` : "--";
  const cloudCoverage = attrs.cloud_coverage !== undefined ? `${formatNumber(attrs.cloud_coverage, 0)}%` : "--";
  const attribution = attrs.attribution || "Google Weather";
  const sourceForecast = weatherForecasts && Array.isArray(weatherForecasts.daily) && weatherForecasts.daily.length
    ? weatherForecasts.daily
    : (Array.isArray(attrs.forecast) ? attrs.forecast : []);
  const hourlyCandidates = weatherForecasts && Array.isArray(weatherForecasts.hourly) && weatherForecasts.hourly.length
    ? weatherForecasts.hourly
    : ([
      attrs.forecast_hourly,
      attrs.hourly_forecast,
      attrs.hourly,
      attrs.forecastHourly
    ].find((entry) => Array.isArray(entry) && entry.length) || []);

  const normalizeForecastEntry = (entry, index) => {
    const rawTime = entry && (entry.datetime || entry.start || entry.time || entry.timestamp);
    const parsedTime = rawTime ? new Date(rawTime) : new Date(Date.now() + (index * 3600000));
    const temperatureValue = entry && entry.temperature !== undefined ? Number(entry.temperature) : NaN;
    const lowValue = entry && entry.templow !== undefined ? Number(entry.templow) : NaN;
    const precipitationValue = entry && entry.precipitation !== undefined ? Number(entry.precipitation) : NaN;
    const precipitationProbabilityValue = entry && entry.precipitation_probability !== undefined
      ? Number(entry.precipitation_probability)
      : NaN;

    return {
      time: parsedTime,
      temperature: Number.isFinite(temperatureValue) ? temperatureValue : NaN,
      low: Number.isFinite(lowValue) ? lowValue : NaN,
      precipitation: Number.isFinite(precipitationValue) ? precipitationValue : NaN,
      precipitationProbability: Number.isFinite(precipitationProbabilityValue) ? precipitationProbabilityValue : NaN,
      condition: translateWeatherState(entry && entry.condition),
      visual: getWeatherVisual(entry && entry.condition)
    };
  };

  const hourlyForecast = hourlyCandidates
    .map((entry, index) => normalizeForecastEntry(entry, index))
    .filter((entry) => !Number.isNaN(entry.time.getTime()))
    .slice(0, 12);

  const dailyForecast = sourceForecast
    .map((entry, index) => normalizeForecastEntry(entry, index))
    .filter((entry) => !Number.isNaN(entry.time.getTime()))
    .slice(0, 7);
  const nextRainChance = hourlyForecast.find((entry) => Number.isFinite(entry.precipitationProbability));
  const precipitationSummary = precipitation !== "--"
    ? precipitation
    : (nextRainChance ? `${Math.round(nextRainChance.precipitationProbability)}% chance` : "--");

  const hasHourly = hourlyForecast.length >= 4;
  const activeView = hasHourly ? state.weatherModalView : "week";

  const tabsMarkup = `
    <div class="weather-modal-switcher">
      <button class="calendar-switcher-button${activeView === "day" ? " active" : ""}" type="button" data-weather-view="day" aria-selected="${activeView === "day"}"${hasHourly ? "" : " disabled"}>I dag</button>
      <button class="calendar-switcher-button${activeView === "week" ? " active" : ""}" type="button" data-weather-view="week" aria-selected="${activeView === "week"}">Uge</button>
    </div>
  `;

  const hourlyMarkup = hasHourly
    ? `
      <div class="weather-hourly-strip">
        ${hourlyForecast.map((entry) => `
          <article class="weather-hour-card">
            <span class="weather-hour-time">${entry.time.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}</span>
            <span class="weather-hour-icon" aria-hidden="true">${entry.visual.icon}</span>
            <strong class="weather-hour-temp">${Number.isFinite(entry.temperature) ? `${formatNumber(entry.temperature, 0)}°` : "--"}</strong>
            <span class="weather-hour-meta">${Number.isFinite(entry.precipitationProbability) ? `${Math.round(entry.precipitationProbability)}% regn` : entry.condition}</span>
          </article>
        `).join("")}
      </div>
    `
    : `
      <div class="weather-empty-state">
        Timebaseret prognose er ikke tilgængelig lige nu. Ugevisningen viser de næste dage.
      </div>
    `;

  const weekMarkup = dailyForecast.length
    ? `
      <div class="weather-week-grid">
        ${dailyForecast.map((entry) => `
          <article class="weather-week-card">
            <div class="weather-week-head">
              <span class="weather-week-day">${entry.time.toLocaleDateString("da-DK", { weekday: "short", day: "numeric", month: "short" })}</span>
              <span class="weather-week-icon" aria-hidden="true">${entry.visual.icon}</span>
            </div>
            <div class="weather-week-temps">
              <strong>${Number.isFinite(entry.temperature) ? `${formatNumber(entry.temperature, 0)}°` : "--"}</strong>
              <span>${Number.isFinite(entry.low) ? `${formatNumber(entry.low, 0)}°` : "--"}</span>
            </div>
            <p class="weather-week-condition">${entry.condition}</p>
            <p class="weather-week-rain">${Number.isFinite(entry.precipitation) ? `${formatNumber(entry.precipitation, 1)} ${precipitationUnit}` : "Ingen data"}</p>
          </article>
        `).join("")}
      </div>
    `
    : `
      <div class="weather-empty-state">
        Ingen ugeprognose fundet endnu.
      </div>
    `;

  const forecastBodyMarkup = activeView === "day" ? hourlyMarkup : weekMarkup;
  const forecastTitle = activeView === "day" ? "Time for time" : "Næste dage";
  const forecastDescription = activeView === "day"
    ? "Grafisk dagsvisning med temperatur, ikon og regnchance."
    : "Ugeblik med temperaturspænd, forhold og nedbør.";

  return `
    <div class="weather-modal-layout weather-visual-${visual.visual}">
      <section class="weather-modal-hero">
        <div class="weather-modal-hero-main">
          <span class="scene-metric-label">Avanceret vejroversigt</span>
          <strong class="weather-modal-temp">${temperature}</strong>
          <p class="weather-modal-state">${weatherState}</p>
          <p class="weather-modal-subline">${new Date().toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div class="weather-modal-hero-icon" aria-hidden="true">${visual.icon}</div>
      </section>

      <section class="weather-modal-chip-row">
        <article class="hero-chip weather-hero-chip-card">
          <span>Føles som</span>
          <strong>${apparent}</strong>
        </article>
        <article class="hero-chip weather-hero-chip-card">
          <span>Vind</span>
          <strong>${wind}</strong>
        </article>
        <article class="hero-chip weather-hero-chip-card">
          <span>Fugt</span>
          <strong>${humidity}</strong>
        </article>
        <article class="hero-chip weather-hero-chip-card">
          <span>Nedbør</span>
          <strong>${precipitationSummary}</strong>
        </article>
      </section>

      <section class="weather-forecast-panel">
        <div class="weather-forecast-header">
          <div>
            <span class="scene-metric-label">${forecastTitle}</span>
            <p class="weather-forecast-attribution">${forecastDescription}</p>
          </div>
          ${tabsMarkup}
        </div>
        ${forecastBodyMarkup}
      </section>

      <div class="info-grid weather-details-grid">
        <article class="info-metric">
          <span class="scene-metric-label">Lige nu</span>
          <strong>${temperature}</strong>
          <p>${weatherState}</p>
        </article>
        <article class="info-metric">
          <span class="scene-metric-label">Tryk og skyer</span>
          <strong>${pressure}</strong>
          <p>Skydække ${cloudCoverage}</p>
        </article>
        <article class="info-metric">
          <span class="scene-metric-label">Vindretning</span>
          <strong>${windBearing}</strong>
          <p>Vindstød ${windGust}</p>
        </article>
        <article class="info-metric">
          <span class="scene-metric-label">Dugpunkt</span>
          <strong>${dewPoint}</strong>
          <p>Føles som ${apparent}</p>
        </article>
        <article class="info-metric">
          <span class="scene-metric-label">Sigt og UV</span>
          <strong>${visibility}</strong>
          <p>UV ${uvIndex}</p>
        </article>
        <article class="info-metric">
          <span class="scene-metric-label">Kilde</span>
          <strong>${attribution}</strong>
          <p>Live-data fra Google Weather</p>
        </article>
      </div>
    </div>
  `;
}
function formatNextDanishHoliday(fromDate) {
  const year = fromDate.getFullYear();
  const candidates = [
    ...buildDanishHolidayList(year),
    ...buildDanishHolidayList(year + 1)
  ]
    .filter((holiday) => holiday.date >= startOfDay(fromDate))
    .sort((left, right) => left.date - right.date);

  const next = candidates[0];
  if (!next) {
    return "";
  }

  const label = next.date.toLocaleDateString("da-DK", { day: "numeric", month: "long" });
  return `${next.name} ? ${label}`;
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks);
  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = counts.unsecured > 0
    ? `${counts.unsecured} ulåst`
    : (securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Alt låst");
  elements.securityAlarmMeta.textContent = [
    securityData.alarm ? `Alarm ${formatAlarmState(securityData.alarm.state).toLowerCase()}` : null,
    `${counts.unlocked} ulåste`,
    `${counts.open} Åbne`,
    `${counts.locked} låste`
  ].filter(Boolean).join(" · ");

  elements.securityLockList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  [
    { glyph: "●", label: "Ulåst", value: counts.unlocked, tone: counts.unlocked ? "is-unlocked" : "is-locked" },
    { glyph: "◫", label: "Åben", value: counts.open, tone: counts.open ? "is-unlocked" : "is-locked" },
    { glyph: "▣", label: "Låst", value: counts.locked, tone: "is-locked" }
  ].forEach((item) => {
    const chip = document.createElement("div");
    chip.className = `security-lock-chip ${item.tone}`;
    chip.title = `${item.label}: ${item.value}`;
    chip.innerHTML = `
      <span class="security-lock-glyph">${item.glyph}</span>
      <strong>${item.value}</strong>
    `;
    fragment.appendChild(chip);
  });
  elements.securityLockList.appendChild(fragment);
}

function extractSecurityData(allStates) {
  const alarm = allStates.find((entity) =>
    entity.entity_id.startsWith("alarm_control_panel.") &&
    !/vehicle|vehicle|vehicle|vehicle|car/i.test(entity.entity_id + getFriendlyName(entity))
  ) || null;

  const orderedMatchers = [
    { ids: ["lock.utility_door"], patterns: [/brygger/], domains: ["lock"] },
    { ids: ["lock.front_door"], patterns: [/front/, /front/], domains: ["lock"] },
    { ids: ["lock.garage_door"], patterns: [/garage.*d[?o]r/, /garaged[?o]r/, /garage/], domains: ["lock"] },
    { ids: ["binary_sensor.garageport_contact"], patterns: [/garageport/, /garage.*port/, /port/], domains: ["binary_sensor", "cover"] },
    { ids: ["binary_sensor.terracedor_las_contact"], patterns: [/terrace/], domains: ["binary_sensor", "lock", "cover"] }
  ];

  const taken = new Set();
  const locks = [];

  orderedMatchers.forEach((matcher) => {
    const entity = findSecurityEntityMatch(allStates, matcher, taken);
    if (entity) {
      taken.add(entity.entity_id);
      locks.push(entity);
    }
  });

  const fallback = allStates
    .filter((entity) => /^(lock|cover|binary_sensor)\./.test(entity.entity_id))
    .filter((entity) => !taken.has(entity.entity_id))
    .filter((entity) => !/vehicle|vehicle|vehicle|vehicle|car|charger|window|vindue/i.test(entity.entity_id + getFriendlyName(entity)))
    .filter((entity) => /(d[?o]r|door|garage|port|gate|terrace|brygger|front|l[?a]s)/i.test(entity.entity_id + getFriendlyName(entity)))
    .sort((left, right) => getSecuritySortKey(left).localeCompare(getSecuritySortKey(right), "da-DK"));

  locks.push(...fallback);

  return {
    alarm,
    locks: locks.filter((entity, index, list) => list.findIndex((candidate) => candidate.entity_id === entity.entity_id) === index)
  };
}

function countSecurityStates(entities) {
  return entities.reduce((acc, entity) => {
    const domain = entity.entity_id.split(".")[0];
    const normalized = String(entity.state || "").toLowerCase();
    if (domain === "binary_sensor" || domain === "cover") {
      if (normalized === "on" || normalized === "open" || normalized === "opening") {
        acc.open += 1;
      } else {
        acc.locked += 1;
      }
    } else if (normalized === "unlocked" || normalized === "unlocking") {
      acc.unlocked += 1;
    } else {
      acc.locked += 1;
    }
    acc.unsecured = acc.unlocked + acc.open;
    return acc;
  }, { unlocked: 0, open: 0, locked: 0, unsecured: 0 });
}

function getSecuritySortKey(entity) {
  const label = getSecurityShortLabel(entity).toLowerCase();
  const order = ["utility", "front", "garage", "terrace", "bag"];
  const index = order.findIndex((item) => label.includes(item));
  return `${String(index === -1 ? 99 : index).padStart(2, "0")}-${label}`;
}

function buildSecurityModalMarkup(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length)) {
    return "<div class=\"calendar-loading\">Ingen sikkerhedsdata fundet i Home Assistant.</div>";
  }

  const counts = countSecurityStates(securityData.locks);
  const alarmMarkup = securityData.alarm ? `
    <article class="info-metric info-metric-wide security-modal-alarm">
      <span class="scene-metric-label">Alarm</span>
      <strong>${formatAlarmState(securityData.alarm.state)}</strong>
      <p>${getFriendlyName(securityData.alarm)}</p>
      <div class="security-actions">
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_disarm" data-entity-id="${securityData.alarm.entity_id}">Frakobl</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_home" data-entity-id="${securityData.alarm.entity_id}">Hjemme</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_away" data-entity-id="${securityData.alarm.entity_id}">Ude</button>
      </div>
    </article>
  ` : "";

  const summaryMarkup = `
    <article class="info-metric">
      <span class="scene-metric-label">Ulåste</span>
      <strong>${counts.unlocked}</strong>
    </article>
    <article class="info-metric">
      <span class="scene-metric-label">Åbne</span>
      <strong>${counts.open}</strong>
    </article>
    <article class="info-metric">
      <span class="scene-metric-label">Låste</span>
      <strong>${counts.locked}</strong>
    </article>
  `;

  const locksMarkup = securityData.locks.map((lock) => `
    <article class="info-metric security-lock-metric">
      <span class="scene-metric-label">${getSecurityShortLabel(lock)}</span>
      <strong>${formatSecurityState(lock)}</strong>
      <p>${lock.entity_id}</p>
      <div class="security-actions">
        ${buildSecurityActionButtons(lock)}
      </div>
    </article>
  `).join("");

  return `
    <div class="info-grid security-info-grid">
      ${alarmMarkup}
      ${summaryMarkup}
      ${locksMarkup}
    </div>
  `;
}

function extractSecurityData(allStates) {
  const alarm = allStates.find((entity) =>
    entity.entity_id.startsWith("alarm_control_panel.") &&
    !/vehicle|vehicle|vehicle|vehicle|car/i.test(entity.entity_id + getFriendlyName(entity))
  ) || null;

  const exactOrder = [
    "lock.utility_door",
    "lock.front_door",
    "lock.garage_door",
    "binary_sensor.garageport_contact",
    "binary_sensor.terracedor_las_contact"
  ];

  const aliasMatchers = [
    /brygger.*d[?o]r|utilityd[?o]r/i,
    /front.*d[?o]r|front.*d[?o]r/i,
    /garage.*d[?o]r|garaged[?o]r|garage/i,
    /garage.*port|garageport/i,
    /terrace.*d[?o]r|terracedor/i
  ];

  const locks = exactOrder
    .map((entityId, index) =>
      allStates.find((entity) => entity.entity_id === entityId) ||
      allStates.find((entity) => /^(lock|cover|binary_sensor)\./.test(entity.entity_id) && aliasMatchers[index].test(`${entity.entity_id} ${getFriendlyName(entity)}`))
    )
    .filter(Boolean);

  const openWindows = allStates.find((entity) => entity.entity_id === "sensor.open_windows") || null;
  const mailCount = allStates.find((entity) => entity.entity_id === "sensor.mailbox_count") || null;
  const hasMail = allStates.find((entity) => entity.entity_id === "input_boolean.mail_present") || null;

  return {
    alarm,
    locks,
    openWindows,
    mailCount,
    hasMail
  };
}

function countSecurityStates(entities, openWindowsEntity = null) {
  const base = entities.reduce((acc, entity) => {
    const domain = entity.entity_id.split(".")[0];
    const normalized = String(entity.state || "").toLowerCase();
    if (domain === "binary_sensor" || domain === "cover") {
      if (normalized === "on" || normalized === "open" || normalized === "opening") {
        acc.open += 1;
      } else {
        acc.locked += 1;
      }
    } else if (normalized === "unlocked" || normalized === "unlocking") {
      acc.unlocked += 1;
    } else {
      acc.locked += 1;
    }
    return acc;
  }, { unlocked: 0, open: 0, locked: 0 });

  const openWindows = openWindowsEntity && hasUsefulValue(openWindowsEntity.state)
    ? Math.max(0, Number(openWindowsEntity.state) || 0)
    : 0;

  return {
    ...base,
    windows: openWindows,
    unsecured: base.unlocked + base.open + openWindows
  };
}

function buildSecurityMailMeter(count, active) {
  const segments = Array.from({ length: 5 }, (_, index) => {
    const on = active ? true : index === 0;
    const stateClass = on ? "is-on" : "is-off";
    const stepClass = active ? `d${index + 1}` : "";
    return `<span class="security-mail-segment ${stateClass} ${stepClass}"></span>`;
  }).join("");

  return `
    <span class="security-mail-meter ${active ? "active" : "idle"}" aria-hidden="true">
      ${segments}
    </span>
  `;
}

function renderSecurityCard(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows && !securityData.mailCount && !securityData.hasMail)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const openCount = counts.open + counts.windows;
  const mailItems = securityData.mailCount && hasUsefulValue(securityData.mailCount.state)
    ? Math.max(0, Number(securityData.mailCount.state) || 0)
    : 0;
  const mailToggleActive = securityData.hasMail && String(securityData.hasMail.state || "").toLowerCase() === "on";
  const mailActive = mailItems > 0 || mailToggleActive;
  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = counts.unsecured > 0
    ? `${counts.unsecured} Åbne`
    : (mailActive ? "Ny post" : (securityData.alarm ? formatAlarmState(securityData.alarm.state) : "Alt lukket"));
  elements.securityAlarmMeta.textContent = [
    securityData.alarm ? `Alarm ${formatAlarmState(securityData.alarm.state).toLowerCase()}` : null,
    `${counts.unlocked} ulåste`,
    `${openCount} Åbne døre/vinduer`,
    mailActive ? `${mailItems || 1} post registreret` : "Ingen post"
  ].filter(Boolean).join(" ? ");

  elements.securityLockList.innerHTML = "";
  const fragment = document.createDocumentFragment();
  [
    { label: "Ulåst", value: counts.unlocked, tone: counts.unlocked ? "is-unlocked" : "is-locked", role: "locks" },
    { label: "Åbne", value: openCount, tone: openCount ? "is-unlocked" : "is-locked", role: "open" },
    {
      label: "Post",
      value: mailActive ? "Fuld" : "Tom",
      tone: mailActive ? "is-alert" : "is-locked",
      role: "mail"
    }
  ].forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `security-lock-chip ${item.tone} security-lock-chip-${item.role}`;
    chip.title = `${item.label}: ${item.value}. Åbn mere info`;
    chip.setAttribute("aria-label", `${item.label}: ${item.value}. Åbn sikkerhedsoversigt`);
    chip.innerHTML = `
      <span class="security-lock-glyph security-lock-glyph-${item.role}" aria-hidden="true"></span>
      <span class="security-lock-label">${item.label}</span>
      <strong>${item.value}</strong>
      ${item.meter || ""}
    `;
    fragment.appendChild(chip);
  });
  elements.securityLockList.appendChild(fragment);
}

function buildSecurityModalMarkup(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    return "<div class=\"calendar-loading\">Ingen sikkerhedsdata fundet i Home Assistant.</div>";
  }

  const alarmMarkup = securityData.alarm ? `
    <article class="info-metric info-metric-wide security-modal-alarm">
      <span class="scene-metric-label">Alarm</span>
      <strong>${formatAlarmState(securityData.alarm.state)}</strong>
      <p>${getFriendlyName(securityData.alarm)}</p>
      <div class="security-actions">
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_disarm" data-entity-id="${securityData.alarm.entity_id}">Frakobl</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_home" data-entity-id="${securityData.alarm.entity_id}">Hjemme</button>
        <button class="ghost-button security-action-button" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_away" data-entity-id="${securityData.alarm.entity_id}">Ude</button>
      </div>
    </article>
  ` : "";

  const locksMarkup = securityData.locks.map((lock) => `
    <article class="info-metric security-lock-metric">
      <span class="scene-metric-label">${getSecurityShortLabel(lock)}</span>
      <strong>${formatSecurityState(lock)}</strong>
      <p>${lock.entity_id}</p>
      <div class="security-actions">
        ${buildSecurityActionButtons(lock)}
      </div>
    </article>
  `).join("");

  return `
    <div class="info-grid security-info-grid">
      ${alarmMarkup}
      ${locksMarkup}
    </div>
  `;
}

function getRelativeTimeLabel(timestamp) {
  if (!timestamp) {
    return "Nu";
  }

  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.max(0, now - past);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${days === 1 ? "dag" : "dage"} siden`;
  if (hours > 0) return `${hours} ${hours === 1 ? "time" : "timer"} siden`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? "minut" : "minutter"} siden`;
  return "Nu";
}

function getSecurityLockBatteryEntityId(entityId) {
  const map = {
    "lock.utility_door": "sensor.utility_door_battery",
    "lock.front_door": "sensor.front_door_battery",
    "lock.garage_door": "sensor.garage_door_battery"
  };
  return map[entityId] || "";
}

function buildSecurityAlarmHero(securityData) {
  if (!securityData.alarm) {
    return "";
  }

  const alarm = securityData.alarm;
  const stateValue = String(alarm.state || "").toLowerCase();
  const badge = stateValue === "disarmed"
    ? "DISARMED"
    : stateValue === "armed_home"
      ? "HOME"
      : stateValue === "armed_away"
        ? "AWAY"
        : stateValue === "triggered"
          ? "TRIGGERED"
          : "UNKNOWN";
  const title = stateValue === "disarmed"
    ? "Frakoblet"
    : stateValue === "armed_home"
      ? "Armeret hjemme"
      : stateValue === "armed_away"
        ? "Armeret ude"
        : stateValue === "triggered"
          ? "Alarm udlåst"
          : "Ukendt status";
  const icon = stateValue === "disarmed"
    ? "shield-lock-open-outline"
    : stateValue === "armed_home"
      ? "shield-moon-outline"
      : stateValue === "armed_away"
        ? "shield-lock-outline"
        : stateValue === "triggered"
          ? "shield-alert-outline"
          : "shield-outline";
  const tone = stateValue === "disarmed"
    ? "is-disarmed"
    : stateValue === "armed_home"
      ? "is-home"
      : stateValue === "armed_away" || stateValue === "triggered"
        ? "is-away"
        : "is-idle";

  return `
    <article class="security-hero-card ${tone}">
      <div class="security-hero-badge">${badge}</div>
      <div class="security-hero-title">${title}</div>
      <div class="security-hero-subtitle">Sidst ?ndret ${getRelativeTimeLabel(alarm.last_changed)}</div>
      <div class="security-hero-controls">
        <button class="security-hero-action ${stateValue === "disarmed" ? "is-active is-active-green" : ""}" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_disarm" data-entity-id="${alarm.entity_id}">Frakoblet</button>
        <button class="security-hero-action ${stateValue === "armed_home" ? "is-active is-active-amber" : ""}" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_home" data-entity-id="${alarm.entity_id}">Hjemme</button>
        <button class="security-hero-action ${(stateValue === "armed_away" || stateValue === "triggered") ? "is-active is-active-red" : ""}" type="button" data-security-action="1" data-domain="alarm_control_panel" data-service="alarm_arm_away" data-entity-id="${alarm.entity_id}">Ude</button>
      </div>
      <div class="security-hero-icon security-hero-icon-${icon}" aria-hidden="true"></div>
    </article>
  `;
}

function buildSecurityLockDetailCard(entity) {
  const domain = entity.entity_id.split(".")[0];
  const stateValue = String(entity.state || "").toLowerCase();
  const isLock = domain === "lock";
  const isSecure = isLock
    ? stateValue === "locked" || stateValue === "locking"
    : !(stateValue === "on" || stateValue === "open" || stateValue === "opening");
  const tone = isSecure ? "is-locked" : "is-unlocked";
  const title = getSecurityShortLabel(entity);
  const badge = isSecure ? "L?ST" : "UL?ST";
  const batteryEntityId = isLock ? getSecurityLockBatteryEntityId(entity.entity_id) : "";
  const batteryEntity = batteryEntityId ? findEntityById(batteryEntityId) : null;
  const batteryText = batteryEntity && hasUsefulValue(batteryEntity.state)
    ? `${batteryEntity.state}% batteri`
    : "";
  const subtitleBase = `${isSecure ? "Låst" : "Åbnet"} ? ${getRelativeTimeLabel(entity.last_changed)}`;
  const subtitle = batteryText ? `${subtitleBase} ? ${batteryText}` : subtitleBase;
  const icon = isSecure ? "lock-outline" : "lock-open-variant-outline";
  const actions = isLock ? `
    <div class="security-lock-detail-controls">
      <button class="security-lock-detail-action ${!isSecure ? "is-active is-active-amber" : ""}" type="button" data-security-action="1" data-domain="lock" data-service="unlock" data-entity-id="${entity.entity_id}">Lås op</button>
      <button class="security-lock-detail-action ${isSecure ? "is-active is-active-green" : ""}" type="button" data-security-action="1" data-domain="lock" data-service="lock" data-entity-id="${entity.entity_id}">Lås</button>
    </div>
  ` : "";

  return `
    <article class="security-lock-detail-card ${tone}">
      <div class="security-lock-detail-badge">${badge}</div>
      <div class="security-lock-detail-title">${title}</div>
      <div class="security-lock-detail-subtitle">${subtitle}</div>
      ${actions}
      <div class="security-lock-detail-icon security-lock-detail-icon-${icon}" aria-hidden="true"></div>
    </article>
  `;
}

buildSecurityModalMarkup = function buildSecurityModalMarkup(securityData) {
  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    return "<div class=\"calendar-loading\">Ingen sikkerhedsdata fundet i Home Assistant.</div>";
  }

  const alarmMarkup = buildSecurityAlarmHero(securityData);
  const lockCards = securityData.locks.map((lock) => buildSecurityLockDetailCard(lock)).join("");

  return `
    <div class="security-popup-shell">
      ${alarmMarkup}
      <div class="security-popup-grid">
        ${lockCards}
      </div>
    </div>
  `;
};

renderSecurityCard = function renderSecurityCard(securityData) {
  if (!elements.securityAlarmState || !elements.securityAlarmMeta || !elements.securityLockList || !elements.securityDetailsButton) {
    return;
  }

  if (!securityData || (!securityData.alarm && !securityData.locks.length && !securityData.openWindows)) {
    elements.securityAlarmState.textContent = "--";
    elements.securityAlarmMeta.textContent = "Ingen sikkerhedsdata fundet";
    elements.securityLockList.innerHTML = "";
    elements.securityDetailsButton.disabled = true;
    return;
  }

  const counts = countSecurityStates(securityData.locks, securityData.openWindows);
  const mainState = counts.unsecured > 0 ? "Åben" : (securityData.locks.length ? "Låst" : "Ukendt");
  const alarmLabel = securityData.alarm
    ? formatAlarmState(securityData.alarm.state)
    : (counts.unsecured > 0 ? "Noget er Åbent" : "Frakoblet");

  const meterItems = [
    { tone: counts.unlocked > 0 || counts.open > 0 ? "is-alert" : "is-ok" },
    { tone: counts.unlocked > 0 ? "is-alert" : "is-ok" },
    { tone: counts.open > 0 ? "is-alert" : "is-ok" },
    { tone: counts.windows > 0 ? "is-alert" : "is-ok" },
    { tone: securityData.alarm && String(securityData.alarm.state || "").toLowerCase() === "armed_away" ? "is-alert" : "is-ok" }
  ].map((item) => `<span class="security-mail-segment ${item.tone}"></span>`).join("");

  elements.securityDetailsButton.disabled = false;
  elements.securityAlarmState.textContent = mainState;
  elements.securityAlarmMeta.textContent = alarmLabel;
  elements.securityLockList.innerHTML = `
    <div class="security-summary-mini">
      <div class="security-summary-main">
        <div class="security-summary-meter">${meterItems}</div>
      </div>
    </div>
  `;
};
