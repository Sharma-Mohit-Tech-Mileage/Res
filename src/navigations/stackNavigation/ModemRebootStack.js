// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemReboot from "../../components/support/ModemReboot";
import ModemRebootInstructions from "../../components/support/ModemRebootInstuction";
import SupportStackScreen from "./SupportStack";

const ModemRebootStack1 = createStackNavigator();

function ModemRebootStack({route}) {
  const { setTabBarVisible } = useTabBarVisibility();
  console.log('ModemRebootStack',JSON.stringify(route.params))
  return (
    <ModemRebootStack1.Navigator initialRouteName="ModemReboot" defaultNavigationOptions={{ gestureEnabled: true }}>
      <ModemRebootStack1.Screen
        name="ModemReboot"
        component={ModemReboot}
        initialParams={route.params}
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
      <ModemRebootStack1.Screen name="Support" component={SupportStackScreen}
      options={{ headerShown: false }}
      listeners={{
        focus: () => setTabBarVisible(true),
        blur: () => setTabBarVisible(true),
      }} />
     
      
    </ModemRebootStack1.Navigator>
  );
}

export default ModemRebootStack;
