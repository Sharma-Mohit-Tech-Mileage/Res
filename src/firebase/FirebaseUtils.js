import { Alert, Linking, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('Authorization status:', authStatus);

    return enabled;  
  };

  const notifyPermission = async () => {
    let authStatus = await messaging().hasPermission();
  
    if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      authStatus = await messaging().requestPermission();
    }
  
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (authStatus === messaging.AuthorizationStatus.DENIED) {
      Alert.alert(
        'Sparklight Would Like to Send You Notifications',
        'Receive app alerts related to your account, updates from Sparklight. Please go to your Settings and allow Notifications.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Go to Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
    }
  
    return enabled;
  };
  

  const getFcmToken = async () => {
    try {
      const newFcmToken = await messaging().getToken();
      console.log(newFcmToken);
      return newFcmToken;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const notificationListener = () => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
  
    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
      .getInitialNotification()
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
    messaging().onMessage(async remoteMessage => {
      console.log('foreground', remoteMessage);
    });
  };

  export {
    getFcmToken,
    requestUserPermission,
    notificationListener,
    notifyPermission
  };