import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export const getAppVersion = () => DeviceInfo.getVersion();
export const getBuildNumber = () => DeviceInfo.getBuildNumber();
export const getSystemVersion = () => DeviceInfo.getSystemVersion();
export const getModel = () => DeviceInfo.getModel();

// getDeviceMetadata() — bundled snapshot for analytics/logging payloads.
export const getDeviceMetadata = async () => {
  try {
    return {
      appVersion: DeviceInfo.getVersion(),
      platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
      osVersion: DeviceInfo.getSystemVersion(),
      deviceModel: DeviceInfo.getModel(),
    };
  } catch (_) {
    return {
      appVersion: 'Unknown',
      platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
      osVersion: 'Unknown',
      deviceModel: 'Unknown',
    };
  }
};
