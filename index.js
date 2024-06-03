import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { AppRegistry } from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { name as appName } from './app.json';
import CreateTicket from './src/components/support/ticket/CreateTicket.js';

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);

    if (remoteMessage.data && remoteMessage.data.title && remoteMessage.data.body) {
        const messageId = remoteMessage.messageId;
        if (!processedMessages.has(messageId)) {
            processedMessages.add(messageId);
            try {
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });

                await notifee.displayNotification({
                    title: remoteMessage.data.title,
                    body: remoteMessage.data.body,
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                });

                // Optional: Clear notification if required
                // await notifee.cancelNotification(messageId);
            } catch (error) {
                console.log('Error when setting background message: ', error);
            }
        } else {
            console.log('Duplicate message, not displaying notification.');
        }
    } else {
        console.log('Notification data is missing, not displaying notification.');
    }
});

// Foreground message handler
messaging().onMessage(async remoteMessage => {
    console.log('Push Notification Message: ', remoteMessage);

    const title = remoteMessage.notification?.title || remoteMessage.data?.title;
    const body = remoteMessage.notification?.body || remoteMessage.data?.body;
    const messageId = remoteMessage.messageId;

    if (title && body) {
        if (!processedMessages.has(messageId)) {
            processedMessages.add(messageId);
            try {
                const channelId = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                });

                await notifee.displayNotification({
                    title,
                    body,
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                });
            } catch (error) {
                console.log('Error when setting foreground message: ', error);
            }
        } else {
            console.log('Duplicate message, not displaying notification.');
        }
    } else {
        console.log('Notification or data is missing, not displaying notification.');
    }
});

AppRegistry.registerComponent(appName, () => App);
