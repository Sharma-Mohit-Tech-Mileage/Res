// HomeStack.js

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../components/home/Home";
import NewBillerHome from "../../components/home/NewBillerHome";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemStackScreen from "./ManageEquepmentStack";
import ModemSpeedTest from "../../components/common/speedTest/ModemSpeedTest";
import AutoPayPCIConnector from '../../components/utility/AutoPayPCIConnector'
import { useSelector } from 'react-redux';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  const isNormalUser = useSelector(state => state.combinedReducers.user.isNormalUser);

  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <HomeStack.Screen
        name="Dashboard"
        component={!isNormalUser? NewBillerHome : HomeScreen}
        options={{ headerShown: false }}
      />

      <HomeStack.Screen
        name="ArticalWindowUtility"
        component={ArticalWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <HomeStack.Screen
        name="ManageEquipment"
        component={ModemStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <HomeStack.Screen
            name="AutoPayPCIConnector"
            component={AutoPayPCIConnector}
            options={{ headerShown: false }}
            listeners={{
              focus: () => setTabBarVisible(true),
              blur: () => setTabBarVisible(true),
            }}
          />
      <HomeStack.Screen
        name="ModemSpeedTest"
        component={ModemSpeedTest}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
