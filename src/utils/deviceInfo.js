import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export const getAppVersion = () => DeviceInfo.getVersion();
export const getBuildNumber = () => DeviceInfo.getBuildNumber();
export const getSystemVersion = () => DeviceInfo.getSystemVersion();
export const getModel = () => DeviceInfo.getModel();
export const getSystemName = () => DeviceInfo.getSystemName();
export const getUserAgent = () => DeviceInfo.getUserAgent(); // async (Promise)
export const getAndroidId = () => DeviceInfo.getAndroidId(); // async (Promise)

// Platform helpers — consolidated so callers don't sprinkle Platform.OS checks.
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Native tablet flag (hardware/form-factor based). Evaluated once; combine with a
// width breakpoint in utils/responsive.js for the final isTablet decision.
export const isTabletDevice = DeviceInfo.isTablet();

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
