/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';
import OklaSpeedTest from './src/components/home/OklaSpeedTest.js';
import {name as appName} from './app.json';
import LiveSupportChat from './src/components/support/LiveSupportChat.js';

// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
  
AppRegistry.registerComponent(appName, () => App);
