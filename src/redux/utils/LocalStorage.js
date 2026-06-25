import AsyncStorage from '@react-native-async-storage/async-storage';
import SecureStore, { SECURE_KEYS } from '../../utils/SecureStore';

export const storeUser = async (value) => {
  try {
    const { refreshToken, ...rest } = value || {};
    if (refreshToken != null) {
      await SecureStore.set(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    await AsyncStorage.setItem("resi_user", JSON.stringify(rest));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getUser = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("resi_user"));
    if (!userData) return userData;
    let refreshToken = await SecureStore.get(SECURE_KEYS.REFRESH_TOKEN);
    if (refreshToken == null && userData.refreshToken != null) {
      refreshToken = userData.refreshToken;
      await SecureStore.set(SECURE_KEYS.REFRESH_TOKEN, refreshToken);
      delete userData.refreshToken;
      await AsyncStorage.setItem("resi_user", JSON.stringify(userData));
    }
    return { ...userData, refreshToken };
  } catch (error) {
   console.warn(error);
  }
};

export const storeSsoToken = async (value) => {
  try {
    await SecureStore.set(SECURE_KEYS.ID_TOKEN, value == null ? null : JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getSsoToken = async () => {
  try {
    const secure = await SecureStore.get(SECURE_KEYS.ID_TOKEN);
    if (secure != null) return JSON.parse(secure);
    const legacy = await AsyncStorage.getItem("idToken");
    if (legacy != null) {
      await SecureStore.set(SECURE_KEYS.ID_TOKEN, legacy);
      await AsyncStorage.removeItem("idToken");
      return JSON.parse(legacy);
    }
    return null;
  } catch (error) {
   console.warn(error);
  }
};

export const cleanUserData = async () => {
  try {
    await SecureStore.clear();
    const keys = await AsyncStorage.getAllKeys();
    const keysToRemove = keys.filter(
      key =>
        !key.includes("pushNotificationStatus") &&
        key !== "FEATURE_ANNOUNCEMENTS_STATE" &&
        key !== "LAST_APP_VERSION"
    );

    await AsyncStorage.multiRemove(keysToRemove);
  } catch (error) {
    console.warn('Error selectively clearing app data.', error);
  }
};

export const storePushNotificationStatus = async (value) => {
  try {
    let user = await getUser();
    const userName = user.userInfo?.userName || '';
    const key = `pushNotificationStatus_${userName}`;
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getPushNotificationStatus = async () => {
  try {
    let user = await getUser();
    const userName = user.userInfo?.userName || '';
    const key = `pushNotificationStatus_${userName}`;
    const userData = JSON.parse(await AsyncStorage.getItem(key))
    return userData;
  } catch (error) {
   console.warn(error); 
  }
};

export const storeUpgradeToken = async (value) => {
  try {
    await AsyncStorage.setItem("upgradeToken", JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getUpgradeToken = async () => {
  try {
    const upgradeData = JSON.parse(await AsyncStorage.getItem("upgradeToken"));
    return upgradeData;
  } catch (error) {
   console.warn(error); 
  }
};

// store pending tickets
export const storeValue = async (value) => {
  try {
    await AsyncStorage.setItem("ptickets", JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getPendingTicket = async () => {
  try {
    const data = JSON.parse(await AsyncStorage.getItem("ptickets"));
    return data;
  } catch (error) {
   console.warn(error); 
  }
};

