/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App.js';
import messaging from '@react-native-firebase/messaging';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
