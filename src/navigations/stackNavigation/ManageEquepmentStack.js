// Support.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemRebootStack from "./ModemRebootStack";
import ModemExchangeInstructions from "../../components/support/ModemExchangeInstructions";
import UpdateModemPassword from "../../components/support/UpdateModemPassword";
import EEroFeatures from "../../components/support/EEroFeatures";
import RetrieveModemPassword from "../../components/support/RetrieveModemPassword";
import ModemConnectivityGuide from "../../components/support/Troubleshooting/ModemConnectivityGuide";
import PeriodicProblems from "../../components/support/Troubleshooting/PeriodicProblems";
import ModemSpeedTest from "../../components/common/speedTest/ModemSpeedTest";
import SupportStack from "../../components/support/supportScreen";
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
        name="UpdateModemPassword"
        component={UpdateModemPassword}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
        <ModemStack.Screen
        name="EEroFeatures"
        component={EEroFeatures}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
        <ModemStack.Screen
        name="RetrieveModemPassword"
        component={RetrieveModemPassword}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
      <ModemStack.Screen
        name="SupportStack"
        component={SupportStack}
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
       <ModemStack.Screen
        name="ModemSpeedTest"
        component={ModemSpeedTest}
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
