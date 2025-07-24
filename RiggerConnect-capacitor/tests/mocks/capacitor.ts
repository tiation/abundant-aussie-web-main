// Mock Capacitor core
export const Capacitor = {
  getPlatform: jest.fn(() => 'web'),
  isNativePlatform: jest.fn(() => false),
  isPluginAvailable: jest.fn(() => true),
  convertFileSrc: jest.fn((src: string) => src),
};

// Mock Camera plugin
export const Camera = {
  getPhoto: jest.fn(() => Promise.resolve({
    base64String: 'mock-base64-image-data',
    dataUrl: 'data:image/jpeg;base64,mock-base64-image-data',
    path: '/mock/path/to/image.jpg',
    webPath: 'blob:mock-web-path',
    format: 'jpeg',
    saved: false,
  })),
  requestPermissions: jest.fn(() => Promise.resolve({
    camera: 'granted',
    photos: 'granted',
  })),
};

// Mock Geolocation plugin
export const Geolocation = {
  getCurrentPosition: jest.fn(() => Promise.resolve({
    coords: {
      latitude: -33.8688,
      longitude: 151.2093,
      accuracy: 5,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  })),
  watchPosition: jest.fn(() => Promise.resolve('watch-id')),
  clearWatch: jest.fn(() => Promise.resolve()),
  requestPermissions: jest.fn(() => Promise.resolve({
    location: 'granted',
    coarseLocation: 'granted',
  })),
};

// Mock Device plugin
export const Device = {
  getInfo: jest.fn(() => Promise.resolve({
    platform: 'ios',
    model: 'iPhone13,2',
    operatingSystem: 'ios',
    osVersion: '15.0',
    manufacturer: 'Apple',
    isVirtual: false,
    webViewVersion: '15.0',
    memUsed: 2048,
    diskFree: 64000,
    diskTotal: 128000,
    realDiskFree: 64000,
    realDiskTotal: 128000,
  })),
  getId: jest.fn(() => Promise.resolve({
    identifier: 'mock-device-id-12345',
  })),
  getBatteryInfo: jest.fn(() => Promise.resolve({
    batteryLevel: 0.85,
    isCharging: false,
  })),
  getLanguageCode: jest.fn(() => Promise.resolve({
    value: 'en',
  })),
};

// Mock Network plugin
export const Network = {
  getStatus: jest.fn(() => Promise.resolve({
    connected: true,
    connectionType: 'wifi',
  })),
  addListener: jest.fn(() => Promise.resolve({
    remove: jest.fn(),
  })),
};

// Mock Preferences plugin
export const Preferences = {
  get: jest.fn(({ key }: { key: string }) => Promise.resolve({
    value: `mock-value-for-${key}`,
  })),
  set: jest.fn(() => Promise.resolve()),
  remove: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  keys: jest.fn(() => Promise.resolve({
    keys: ['mock-key-1', 'mock-key-2'],
  })),
  migrate: jest.fn(() => Promise.resolve()),
};

// Mock Push Notifications plugin
export const PushNotifications = {
  requestPermissions: jest.fn(() => Promise.resolve({
    receive: 'granted',
  })),
  register: jest.fn(() => Promise.resolve()),
  getDeliveredNotifications: jest.fn(() => Promise.resolve({
    notifications: [],
  })),
  removeDeliveredNotifications: jest.fn(() => Promise.resolve()),
  removeAllDeliveredNotifications: jest.fn(() => Promise.resolve()),
  createChannel: jest.fn(() => Promise.resolve()),
  listChannels: jest.fn(() => Promise.resolve({
    channels: [],
  })),
  deleteChannel: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(() => Promise.resolve({
    remove: jest.fn(),
  })),
};

// Mock Haptics plugin
export const Haptics = {
  impact: jest.fn(() => Promise.resolve()),
  vibrate: jest.fn(() => Promise.resolve()),
  selectionStart: jest.fn(() => Promise.resolve()),
  selectionChanged: jest.fn(() => Promise.resolve()),
  selectionEnd: jest.fn(() => Promise.resolve()),
};

// Mock Status Bar plugin
export const StatusBar = {
  setStyle: jest.fn(() => Promise.resolve()),
  setBackgroundColor: jest.fn(() => Promise.resolve()),
  show: jest.fn(() => Promise.resolve()),
  hide: jest.fn(() => Promise.resolve()),
  getInfo: jest.fn(() => Promise.resolve({
    visible: true,
    style: 'default',
    color: '#000000',
    overlays: false,
  })),
  setOverlaysWebView: jest.fn(() => Promise.resolve()),
};

// Mock Keyboard plugin
export const Keyboard = {
  show: jest.fn(() => Promise.resolve()),
  hide: jest.fn(() => Promise.resolve()),
  setAccessoryBarVisible: jest.fn(() => Promise.resolve()),
  setScroll: jest.fn(() => Promise.resolve()),
  setStyle: jest.fn(() => Promise.resolve()),
  setResizeMode: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(() => Promise.resolve({
    remove: jest.fn(),
  })),
};

// Mock App plugin
export const App = {
  exitApp: jest.fn(() => Promise.resolve()),
  getInfo: jest.fn(() => Promise.resolve({
    name: 'RiggerConnect',
    id: 'net.tiation.riggerconnect',
    build: '1',
    version: '1.0.0',
  })),
  getState: jest.fn(() => Promise.resolve({
    isActive: true,
  })),
  minimizeApp: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(() => Promise.resolve({
    remove: jest.fn(),
  })),
};
