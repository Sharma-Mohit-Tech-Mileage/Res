// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemRebootStack from "./ModemRebootStack";
import ModemExchangeInstructions from "../../components/support/ModemExchangeInstructions";
import SupportStackScreen from "./SupportStack";
import ModemConnectivityGuide from "../../components/support/Troubleshooting/ModemConnectivityGuide";
import PeriodicProblems from "../../components/support/Troubleshooting/PeriodicProblems";

const ModemStack = createNativeStackNavigator();

function ModemStackScreen({route}) {
  console.log('Manage equipment')
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ModemStack.Navigator
      initialRouteName="ManageEquipmentScreen"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <ModemStack.Screen
        name="ManageEquipmentScreen"
        component={ManageEquipment}
        options={{ headerShown: false }}
        initialParams={route.params}
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

      <ModemStack.Screen
        name="PeriodicProblems"
        component={PeriodicProblems}
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
