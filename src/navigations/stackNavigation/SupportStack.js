// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import TicketStackScreen from "./TicketStack";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";

import { useTabBarVisibility } from "../TabBarVisibilityContext";

const SupportStack = createNativeStackNavigator();

function SupportStackScreen({route}) {
  
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <SupportStack.Navigator initialRouteName={(route.params?.isManagementEquipment)?"ManageEquipment":"support"} defaultNavigationOptions={{ gestureEnabled: true }}>
      <SupportStack.Screen
        name="support"
        component={supportScreen}
        initialParams={route.params}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        name="searchArticals"
        component={Search}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        name="TicketStackScreen"
        component={TicketStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
     
      
      <SupportStack.Screen
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

    </SupportStack.Navigator>
  );
}

export default SupportStackScreen;
