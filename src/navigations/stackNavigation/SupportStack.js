// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import CreateTicket from "../../components/support/CreateTicket";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import TicketSupport from "../../components/support/TicketSupport";
import TicketView from "../../components/support/TicketView";
import TroubleShootStack from "./TroubleShootStack";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemStackScreen from "./ManageEquepmentStack";
import ModemConnectivityGuide from '../../components/support/Troubleshooting/ModemConnectivityGuide';
const SupportStack = createStackNavigator();

function SupportStackScreen({route}) {
  console.log('Support',JSON.stringify(route))
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
        name="CreateTicket"
        component={CreateTicket}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        name="ManageEquipment"
        component={ModemStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        name="TicketView"
        component={TicketView}
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
      <SupportStack.Screen
        name="TicketSupport"
        component={TicketSupport}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        name="DiagnosticFlow"
        component={TroubleShootStack}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <SupportStack.Screen
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
        name="ModemConnectivityGuide"
        component={ModemConnectivityGuide}
      />
    </SupportStack.Navigator>
  );
}

export default SupportStackScreen;
