import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from "../../components/home/ShopScreen";
import MyServices from "../../components/services/MyServices";
import TroubleShootStack from "./TroubleShootStack";

const ShopStack = createNativeStackNavigator();

function ServiceStackScreen() {
  return (
    <ShopStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
      <ShopStack.Screen
        name="MyServices"
        component={MyServices}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <ShopStack.Screen
        name="DiagnosticFlow"
        component={TroubleShootStack}
        options={{ headerShown: false }}
      />
      <ShopStack.Screen
        name="shopHome"
        component={ShopScreen}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </ShopStack.Navigator>
  );
}

export default ServiceStackScreen;
