/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';
import ModemReboot from './src/components/support/ModemRebootInstuction.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
