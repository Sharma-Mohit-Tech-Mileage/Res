// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemRebootStack from "./ModemRebootStack";
import ModemExchangeInstructions from "../../components/support/ModemExchangeInstructions";
import SupportStackScreen from "./SupportStack";
import ModemConnectivityGuide from "../../components/support/Troubleshooting/ModemConnectivityGuide";

const ModemStack = createStackNavigator();

function ModemStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ModemStack.Navigator initialRouteName="ManageEquipmentScreen" defaultNavigationOptions={{ gestureEnabled: true }}>
      <ModemStack.Screen
        name="ManageEquipmentScreen"
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
     <ModemStack.Screen
        name="SupportStack"
        component={SupportStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
       <ModemStack.Screen
        name="ModemConnectivityGuide"
        component={ModemConnectivityGuide}
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

