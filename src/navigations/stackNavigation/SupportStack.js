// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import CreateTicket from "../../components/support/CreateTicket";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import TicketSupport from "../../components/support/TicketSupport";
import TicketView from "../../components/support/TicketView";
import ManageEquipment from "../../components/support/ManageEquipment";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import LiveSupportChat from "../../components/support/LiveSupportChat";

const SupportStack = createStackNavigator();

function SupportStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <SupportStack.Navigator initialRouteName="supportScreen">
      <SupportStack.Screen
        name="support"
        component={supportScreen}
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
        component={ManageEquipment}
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
        name="LiveChatTicketSupport"
        component={LiveSupportChat}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
    </SupportStack.Navigator>
  );
}

export default SupportStackScreen;
