// ContactUsStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../../components/support/Search";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import SupportScreen from "../../components/support/supportScreen";
import MyServices from "../../components/services/MyServices";
import ModemStackScreen from "./ManageEquepmentStack";
import ModemConnectivityGuide from '../../components/support/Troubleshooting/ModemConnectivityGuide';
import ShareWifiScreen from "../../components/support/ShareWifiScreen";

import TroubleShootStack from "./TroubleShootStack";  
const ServiceStack = createNativeStackNavigator();

function MyServicesStack({route}) {
  console.log('Support',JSON.stringify(route))
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ServiceStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
        <ServiceStack.Screen
        name="MyService"
        component={MyServices}
        initialParams={route.params}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <ServiceStack.Screen
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
      
      <ServiceStack.Screen
        name="searchArticles"
        component={Search}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
      

<ServiceStack.Screen
        name="ManageEquipment"
        component={ModemStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
      <ServiceStack.Screen
        name="DiagnosticFlow"
        component={TroubleShootStack}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <ServiceStack.Screen
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
        name="ModemConnectivityGuide"
        component={ModemConnectivityGuide}
      />

      <ServiceStack.Screen
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
        name="ShareWifiScreen"
        component={ShareWifiScreen}
      />


    </ServiceStack.Navigator>
  );
}

export default MyServicesStack;
