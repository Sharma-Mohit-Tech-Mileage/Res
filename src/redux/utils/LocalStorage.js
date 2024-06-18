import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (value) => {
  try {
    await AsyncStorage.setItem("resi_user", JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getUser = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("resi_user"))
    return userData;
  } catch (error) {
   console.log(error); 
  }
};

// getting data
export const getUserBusi = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("busi_user"))
    return userData;
  } catch (error) {
   console.log(error); 
  }
};

export const storeSsoToken = async (value) => {
  try {
    await AsyncStorage.setItem("idToken", JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getSsoToken = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("idToken"))
    return userData;
  } catch (error) {
   console.log(error); 
  }
};

export const cleanUserData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const keysToRemove = keys.filter(key => !key.includes("pushNotificationStatus"));

    await AsyncStorage.multiRemove(keysToRemove);
  } catch (error) {
    console.error('Error selectively clearing app data.', error);
  }
};

export const storePushNotificationStatus = async (value) => {
  try {
    let user = await getUser();
    const userName = user.userInfo?.userName || '';
    const key = `pushNotificationStatus_${userName}`;
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
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
   console.log(error); 
  }
};

export const storeUpgradeToken = async (value) => {
  try {
    await AsyncStorage.setItem("upgradeToken", JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getUpgradeToken = async () => {
  try {
    const upgradeData = JSON.parse(await AsyncStorage.getItem("upgradeToken"));
    return upgradeData;
  } catch (error) {
   console.log(error); 
  }
};

