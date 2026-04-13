import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import {
  getMessaging,
  hasPermission,
  requestPermission,
  getToken,
  onNotificationOpenedApp,
  getInitialNotification,
  onMessage,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import * as Keychain from 'react-native-keychain';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import DeviceInfo from 'react-native-device-info';

const requestUserPermission = async () => {
  let granted;
  let logMessage = '';

  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (alreadyGranted) {
      granted = true;
      logMessage = `Android API ${Platform.Version} POST_NOTIFICATIONS Permission: already granted`;
    } else {
      const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      granted = (status === PermissionsAndroid.RESULTS.GRANTED);
      logMessage = `Android API ${Platform.Version} POST_NOTIFICATIONS Permission: ${status}`;
    }
  } else {
    const authStatus = await hasPermission(getMessaging());
    if (authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL) {
      granted = true;
      logMessage = 'FCM Authorization Status: Already authorized/provisional';
    } else {
      const requestStatus = await requestPermission(getMessaging());
      granted =
        requestStatus === AuthorizationStatus.AUTHORIZED ||
        requestStatus === AuthorizationStatus.PROVISIONAL;
      logMessage = `FCM Authorization Status: ${granted ? 'authorized/provisional' : 'denied/undetermined'}`;
    }
  }

  console.log(logMessage);

  return granted;
};

const notifyPermission = async () => {
  let authStatus = await hasPermission(getMessaging());

  if (authStatus === AuthorizationStatus.NOT_DETERMINED) {
    authStatus = await requestPermission(getMessaging());
  }

  console.log('Notification permission status:', authStatus);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (authStatus === AuthorizationStatus.DENIED) {
    Alert.alert(
      'Sparklight Would Like to Send You Notifications',
      'Receive app alerts related to your account, updates from Sparklight. Please go to your Settings and allow Notifications.',
      [
        {
          text: 'Go to Settings',
          style: 'cancel',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  }

  return enabled;
};


const getFcmToken = async () => {
  try {
    const newFcmToken = await getToken(getMessaging());
    console.log(newFcmToken);
    return newFcmToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const notificationListener = () => {

  onNotificationOpenedApp(getMessaging(), remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Quiet and Background State -> Check whether an initial notification is available
  getInitialNotification(getMessaging())
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    })
    .catch(error => console.log('failed', error));

  // Foreground State
  onMessage(getMessaging(), async remoteMessage => {
    console.log('foreground', remoteMessage);
  });
};

const getDeviceUniqueId = async () => {
  let uniqueId = null;

  if (Platform.OS === 'ios') {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        uniqueId = credentials.password;
      }
    } catch (error) {
      console.error("Keychain couldn't be accessed!", error);
    }
  } else if (Platform.OS === 'android') {
    try {
      uniqueId = await DeviceInfo.getAndroidId();
    } catch (error) {
      console.error("Encrypted Storage couldn't be accessed!", error);
    }
  }

  return uniqueId;
};

export const initializeApp = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/; 

    if (credentials && uuidPattern.test(credentials.password)) {
      return credentials.password; 
    }

    const uuid = uuidv4();
    await Keychain.setGenericPassword('uniqueId', uuid);
    return uuid;
  } catch (error) {
    console.error("Keychain couldn't be accessed!", error);
    const newUuid = uuidv4();
    await Keychain.setGenericPassword('uniqueId', newUuid);
    return newUuid;
  }
};


export {
  getFcmToken,
  requestUserPermission,
  notificationListener,
  notifyPermission,
  getDeviceUniqueId
};