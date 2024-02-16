/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {name as appName} from './app.json';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {     
    console.log('Message handled in the background Again!', remoteMessage);
    try {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
            channelId,
            //smallIcon: remoteMessage.notification.android.imageUrl, // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
            },
        });
    } catch (error) {
        console.log('Error when setting background message: ', error);
    }
});

messaging().onMessage(async remoteMessage => {
    console.log('Push Notification Message: ', remoteMessage);
    try {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
            channelId,
            //smallIcon: remoteMessage.notification.android.imageUrl, // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
            },
        });
    } catch (error) {
        console.log('Error when setting background message: ', error);
    }
});

AppRegistry.registerComponent(appName, () => App);
