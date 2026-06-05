import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (value) => {
  try {
    await AsyncStorage.setItem("resi_user", JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getUser = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("resi_user"))
    return userData;
  } catch (error) {
   console.warn(error); 
  }
};

export const storeSsoToken = async (value) => {
  try {
    await AsyncStorage.setItem("idToken", JSON.stringify(value));
  } catch (error) {
    console.warn(error);
  }
};

// getting data
export const getSsoToken = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("idToken"))
    return userData;
  } catch (error) {
   console.warn(error); 
  }
};

export const cleanUserData = async () => {
  try {
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

