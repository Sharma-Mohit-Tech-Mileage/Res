import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (value) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

// getting data
export const getUser = async () => {
  try {
    const userData = JSON.parse(await AsyncStorage.getItem("user"))
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
// getting data
export const cleanUserData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
} catch (error) {
    console.error('Error clearing app data.');
}
};


