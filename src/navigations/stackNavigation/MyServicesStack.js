// ContactUsStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../../components/support/Search";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import SupportScreen from "../../components/support/supportScreen";
import MyServices from "../../components/services/MyServices";
const ServiceStack = createNativeStackNavigator();

function MyServicesStack({route}) {
  console.log('Support',JSON.stringify(route))
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <ServiceStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
        <ServiceStack.Screen
        name="MySerives"
        component={MyServices}
        initialParams={route.params}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <ServiceStack.Screen
        name="support"
        component={SupportScreen}
        initialParams={route.params}
        options={{ headerShown: false }}
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
        name="ArticleWindowUtility"
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

    </ServiceStack.Navigator>
  );
}

export default MyServicesStack;
