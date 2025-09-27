// ContactUsStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../../components/support/Search";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import MyServices from "../../components/services/MyServices";
const ServiceStack = createNativeStackNavigator();
function MyServicesStack({ route }) {
  return (
    <ServiceStack.Navigator
      initialRouteName={
        route.params?.isManagementEquipment ? "ManageEquipment" : "MyService"
      }
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <ServiceStack.Screen
        name="MyService"
        component={MyServices}
        initialParams={route.params}
        options={{ headerShown: false }}
      />
      <ServiceStack.Screen
        name="ArticalWindowUtility"
        component={ArticalWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <ServiceStack.Screen
        name="searchArticles"
        component={Search}
        options={{ headerShown: false }}
      />
      <ServiceStack.Screen
        name="DiagnosticFlow"
        component={TroubleShootStack}
        options={{ headerShown: false }}
      />
      <ServiceStack.Screen
        options={{ headerShown: false }}
        name="ModemConnectivityGuide"
        component={ModemConnectivityGuide}
      />
    </ServiceStack.Navigator>
  );
}

export default MyServicesStack;
