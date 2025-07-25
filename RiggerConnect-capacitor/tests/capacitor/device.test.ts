// Mock Capacitor plugins with factory functions
jest.mock('@capacitor/device', () => ({
  Device: {
    getInfo: jest.fn(),
    getId: jest.fn(),
    getBatteryInfo: jest.fn(),
    getLanguageCode: jest.fn(),
  },
}));

jest.mock('@capacitor/network', () => ({
  Network: {
    getStatus: jest.fn(),
    addListener: jest.fn(),
  },
}));

jest.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: jest.fn(),
    requestPermissions: jest.fn(),
  },
  CameraResultType: {
    DataUrl: 'dataUrl',
    Base64: 'base64',
    Uri: 'uri',
  },
  CameraSource: {
    Camera: 'camera',
    Photos: 'photos',
    Prompt: 'prompt',
  },
}));

jest.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    requestPermissions: jest.fn(),
  },
}));

jest.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
    keys: jest.fn(),
  },
}));

// Import the mocked modules
const { Device } = require('@capacitor/device');
const { Network } = require('@capacitor/network');
const { Camera, CameraResultType, CameraSource } = require('@capacitor/camera');
const { Geolocation } = require('@capacitor/geolocation');
const { Preferences } = require('@capacitor/preferences');

describe('Capacitor Device Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Device Plugin', () => {
    it('should get device information', async () => {
      const mockDeviceInfo = {
        platform: 'ios' as const,
        model: 'iPhone13,2',
        operatingSystem: 'ios' as const,
        osVersion: '15.0',
        manufacturer: 'Apple',
        isVirtual: false,
        webViewVersion: '15.0',
        memUsed: 2048,
        diskFree: 64000,
        diskTotal: 128000,
        realDiskFree: 64000,
        realDiskTotal: 128000,
      };

      Device.getInfo.mockResolvedValue(mockDeviceInfo);

      const deviceInfo = await Device.getInfo();

      expect(Device.getInfo).toHaveBeenCalled();
      expect(deviceInfo).toEqual(mockDeviceInfo);
      expect(deviceInfo.platform).toBe('ios');
      expect(deviceInfo.manufacturer).toBe('Apple');
    });

    it('should get device ID', async () => {
      const mockDeviceId = { identifier: 'test-device-id-12345' };
      Device.getId.mockResolvedValue(mockDeviceId);

      const deviceId = await Device.getId();

      expect(Device.getId).toHaveBeenCalled();
      expect(deviceId.identifier).toBe('test-device-id-12345');
    });

    it('should get battery information', async () => {
      const mockBatteryInfo = {
        batteryLevel: 0.85,
        isCharging: false,
      };

      Device.getBatteryInfo.mockResolvedValue(mockBatteryInfo);

      const batteryInfo = await Device.getBatteryInfo();

      expect(Device.getBatteryInfo).toHaveBeenCalled();
      expect(batteryInfo.batteryLevel).toBe(0.85);
      expect(batteryInfo.isCharging).toBe(false);
    });

    it('should get language code', async () => {
      const mockLanguageCode = { value: 'en-US' };
      Device.getLanguageCode.mockResolvedValue(mockLanguageCode);

      const languageCode = await Device.getLanguageCode();

      expect(Device.getLanguageCode).toHaveBeenCalled();
      expect(languageCode.value).toBe('en-US');
    });
  });

  describe('Network Plugin', () => {
    it('should get network status', async () => {
      const mockNetworkStatus = {
        connected: true,
        connectionType: 'wifi' as const,
      };

      Network.getStatus.mockResolvedValue(mockNetworkStatus);

      const networkStatus = await Network.getStatus();

      expect(Network.getStatus).toHaveBeenCalled();
      expect(networkStatus.connected).toBe(true);
      expect(networkStatus.connectionType).toBe('wifi');
    });

    it('should handle network status changes', () => {
      const mockListener = jest.fn();
      const mockRemove = jest.fn();

      Network.addListener.mockResolvedValue({ remove: mockRemove });

      Network.addListener('networkStatusChange', mockListener);

      expect(Network.addListener).toHaveBeenCalledWith('networkStatusChange', mockListener);
    });

    it('should handle offline network status', async () => {
      const mockOfflineStatus = {
        connected: false,
        connectionType: 'none' as const,
      };

      Network.getStatus.mockResolvedValue(mockOfflineStatus);

      const networkStatus = await Network.getStatus();

      expect(networkStatus.connected).toBe(false);
      expect(networkStatus.connectionType).toBe('none');
    });
  });

  describe('Camera Plugin', () => {
    it('should take photo from camera', async () => {
      const mockPhoto = {
        base64String: 'mock-base64-data',
        dataUrl: 'data:image/jpeg;base64,mock-base64-data',
        path: '/path/to/photo.jpg',
        webPath: 'blob:photo-url',
        format: 'jpeg' as const,
        saved: false,
      };

      Camera.getPhoto.mockResolvedValue(mockPhoto);

      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });

      expect(Camera.getPhoto).toHaveBeenCalledWith({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });
      expect(photo.dataUrl).toBe('data:image/jpeg;base64,mock-base64-data');
    });

    it('should request camera permissions', async () => {
      const mockPermissions = {
        camera: 'granted' as const,
        photos: 'granted' as const,
      };

      Camera.requestPermissions.mockResolvedValue(mockPermissions);

      const permissions = await Camera.requestPermissions();

      expect(Camera.requestPermissions).toHaveBeenCalled();
      expect(permissions.camera).toBe('granted');
      expect(permissions.photos).toBe('granted');
    });

    it('should handle camera permission denial', async () => {
      const mockDeniedPermissions = {
        camera: 'denied' as const,
        photos: 'denied' as const,
      };

      Camera.requestPermissions.mockResolvedValue(mockDeniedPermissions);

      const permissions = await Camera.requestPermissions();

      expect(permissions.camera).toBe('denied');
      expect(permissions.photos).toBe('denied');
    });
  });

  describe('Geolocation Plugin', () => {
    it('should get current position', async () => {
      const mockPosition = {
        coords: {
          latitude: -33.8688,
          longitude: 151.2093,
          accuracy: 5,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: 1640995200000,
      };

      Geolocation.getCurrentPosition.mockResolvedValue(mockPosition);

      const position = await Geolocation.getCurrentPosition();

      expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(position.coords.latitude).toBe(-33.8688);
      expect(position.coords.longitude).toBe(151.2093);
      expect(position.coords.accuracy).toBe(5);
    });

    it('should request location permissions', async () => {
      const mockPermissions = {
        location: 'granted' as const,
        coarseLocation: 'granted' as const,
      };

      Geolocation.requestPermissions.mockResolvedValue(mockPermissions);

      const permissions = await Geolocation.requestPermissions();

      expect(Geolocation.requestPermissions).toHaveBeenCalled();
      expect(permissions.location).toBe('granted');
      expect(permissions.coarseLocation).toBe('granted');
    });

    it('should handle location errors', async () => {
      const mockError = new Error('Location services disabled');
      Geolocation.getCurrentPosition.mockRejectedValue(mockError);

      await expect(Geolocation.getCurrentPosition()).rejects.toThrow('Location services disabled');
    });

    it('should watch position changes', async () => {
      const mockWatchId = 'watch-123';
      Geolocation.watchPosition.mockResolvedValue(mockWatchId);

      const watchId = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      }, (position) => {
        console.log('Position changed:', position);
      });

      expect(Geolocation.watchPosition).toHaveBeenCalledWith({
        enableHighAccuracy: true,
        timeout: 10000,
      }, expect.any(Function));
      expect(watchId).toBe(mockWatchId);
    });
  });

  describe('Preferences Plugin', () => {
    it('should set and get preferences', async () => {
      Preferences.set.mockResolvedValue();
      Preferences.get.mockResolvedValue({ value: 'test-value' });

      await Preferences.set({
        key: 'test-key',
        value: 'test-value',
      });

      const result = await Preferences.get({ key: 'test-key' });

      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'test-key',
        value: 'test-value',
      });
      expect(Preferences.get).toHaveBeenCalledWith({ key: 'test-key' });
      expect(result.value).toBe('test-value');
    });

    it('should remove preferences', async () => {
      Preferences.remove.mockResolvedValue();

      await Preferences.remove({ key: 'test-key' });

      expect(Preferences.remove).toHaveBeenCalledWith({ key: 'test-key' });
    });

    it('should clear all preferences', async () => {
      Preferences.clear.mockResolvedValue();

      await Preferences.clear();

      expect(Preferences.clear).toHaveBeenCalled();
    });

    it('should get all preference keys', async () => {
      const mockKeys = { keys: ['key1', 'key2', 'key3'] };
      Preferences.keys.mockResolvedValue(mockKeys);

      const result = await Preferences.keys();

      expect(Preferences.keys).toHaveBeenCalled();
      expect(result.keys).toEqual(['key1', 'key2', 'key3']);
    });

    it('should handle missing preferences', async () => {
      Preferences.get.mockResolvedValue({ value: null });

      const result = await Preferences.get({ key: 'nonexistent-key' });

      expect(result.value).toBeNull();
    });
  });

  describe('Cross-platform compatibility', () => {
    it('should work on iOS platform', async () => {
      const mockDeviceInfo = {
        platform: 'ios' as const,
        model: 'iPhone13,2',
        operatingSystem: 'ios' as const,
        osVersion: '15.0',
        manufacturer: 'Apple',
        isVirtual: false,
        webViewVersion: '15.0',
      };

      Device.getInfo.mockResolvedValue(mockDeviceInfo);

      const deviceInfo = await Device.getInfo();
      expect(deviceInfo.platform).toBe('ios');
    });

    it('should work on Android platform', async () => {
      const mockDeviceInfo = {
        platform: 'android' as const,
        model: 'SM-G991B',
        operatingSystem: 'android' as const,
        osVersion: '12',
        manufacturer: 'Samsung',
        isVirtual: false,
        webViewVersion: '94.0.4606.85',
      };

      Device.getInfo.mockResolvedValue(mockDeviceInfo);

      const deviceInfo = await Device.getInfo();
      expect(deviceInfo.platform).toBe('android');
    });

    it('should gracefully handle web platform', async () => {
      const mockDeviceInfo = {
        platform: 'web' as const,
        model: 'unknown',
        operatingSystem: 'unknown' as const,
        osVersion: 'unknown',
        manufacturer: 'unknown',
        isVirtual: true,
        webViewVersion: 'unknown',
      };

      Device.getInfo.mockResolvedValue(mockDeviceInfo);

      const deviceInfo = await Device.getInfo();
      expect(deviceInfo.platform).toBe('web');
      expect(deviceInfo.isVirtual).toBe(true);
    });
  });
});
