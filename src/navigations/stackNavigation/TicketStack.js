// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateTicket from "../../components/support/ticket/CreateTicket";
import ViewTicket from "../../components/support/ticket/ViewTicket";
import SupportTicket from "../../components/support/ticket/SupportTicket";
import { useTabBarVisibility } from "../TabBarVisibilityContext";

const TicketStack = createNativeStackNavigator();

function TicketStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <TicketStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
      <TicketStack.Screen
        name="SupportTicket"
        component={SupportTicket}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <TicketStack.Screen
        name="CreateTicket"
        component={CreateTicket}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

      <TicketStack.Screen
        name="ViewTicket"
        component={ViewTicket}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
    </TicketStack.Navigator>
  );
}

export default TicketStackScreen;
