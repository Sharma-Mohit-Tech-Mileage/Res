// HomeStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../components/home/Home";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemStackScreen from "./ManageEquepmentStack";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <HomeStack.Screen
        name="Dashboard"
        component={HomeScreen}
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

    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
