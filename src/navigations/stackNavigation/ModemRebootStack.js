// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemReboot from "../../components/support/ModemReboot";
import ModemRebootInstructions from "../../components/support/ModemRebootInstuction";

const ModemRebootStack1 = createStackNavigator();

function ModemRebootStack() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ModemRebootStack1.Navigator initialRouteName="ModemReboot" defaultNavigationOptions={{ gestureEnabled: true }}>
      <ModemRebootStack1.Screen
        name="ModemReboot"
        component={ModemReboot}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <ModemRebootStack1.Screen
        name="ModemRebootInstructions"
        component={ModemRebootInstructions}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
     
      
    </ModemRebootStack1.Navigator>
  );
}

export default ModemRebootStack;
