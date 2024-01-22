/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';
import TroubleshootingFirst from './src/components/support/troubleshooting/TroubleShootingScreenFirst.js';
import {name as appName} from './app.json';

// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//TroubleshootingSelectType
//   });
  
AppRegistry.registerComponent(appName, () => App);
