// MyServicesStack.js - Updated with DataUsage screen

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../../components/support/Search";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import MyServices from "../../components/services/MyServices";
import DataUsageScreen from "../../components/services/dataUsage/DataUsageScreen";

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
      
      {/* NEW: Data Usage Screen */}
      <ServiceStack.Screen
        name="DataUsage"
        component={DataUsageScreen}
        options={{ 
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true
        }}
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
    </ServiceStack.Navigator>
  );
}

export default MyServicesStack;