// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemRebootStack from "./ModemRebootStack";
import ModemExchangeInstructions from "../../components/support/ModemExchangeInstructions";

const ModemStack = createStackNavigator();

function ModemStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ModemStack.Navigator initialRouteName="ManageEquipment" defaultNavigationOptions={{ gestureEnabled: true }}>
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
       <ModemStack.Screen
        name="ModemExchange"
        component={ModemExchangeInstructions}
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
