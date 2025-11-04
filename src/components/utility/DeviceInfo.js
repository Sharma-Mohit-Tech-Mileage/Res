import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export const getDeviceMetadata = async () => {
  try {
    const [version, systemVersion, model] = await Promise.all([
      DeviceInfo.getVersion(),
      DeviceInfo.getSystemVersion(),
      DeviceInfo.getModel(),
    ]);

    return {
      appVersion: version,
      platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
      osVersion: systemVersion,
      deviceModel: model,
    };
  } catch (error) {
    console.error('Error fetching device metadata:', error);
    return {
      appVersion: 'Unknown',
      platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
      osVersion: 'Unknown',
      deviceModel: 'Unknown',
    };
  }
};