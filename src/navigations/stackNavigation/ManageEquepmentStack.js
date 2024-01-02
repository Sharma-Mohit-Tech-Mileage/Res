// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemRebootStack from "./ModemRebootStack";

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
        component={ModemRebootStack}
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
