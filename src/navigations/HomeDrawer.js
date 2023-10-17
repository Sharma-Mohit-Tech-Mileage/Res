import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DashboardScreen from '../components/home/Home.js';
import SettingsScreen from '../components/user/SettingsScreen.js';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="DashboardScreen">
        <Drawer.Screen name="Home" component={DashboardScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default  HomeDrawer ;