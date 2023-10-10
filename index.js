/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App.js';
//import LoginScreen from './src/components/user/login.js';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
