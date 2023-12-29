// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemReboot from "../../components/support/ModemReboot";

const ModemStack = createStackNavigator();

function ModemStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ModemStack.Navigator initialRouteName="ManageEquipment">
      <ModemStack.Screen
        name="ManageEquipment"
        component={ManageEquipment}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <ModemStack.Screen
        name="ModemRebootScreen"
        component={ModemReboot}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
     
      
    </ModemStack.Navigator>
  );
}

export default ModemStackScreen;
