import AsyncStorage from '@react-native-community/async-storage';

const setUserToken = async (data) => {
    try {
      await AsyncStorage.setItem("USER_TOKEN", data)
    } catch (e) {
      console.log('Failed to save the data to the storage')
    }
  }

  export {setUserToken}
