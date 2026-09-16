// MyServicesStack.js - Updated with DataUsage screen

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../../components/support/Search";
import ArticleWindowUtility from "../../components/utility/ArticleWindowUtility";
import MyServices from "../../components/services/MyServices";
import DataUsageScreen from "../../components/services/dataUsage/DataUsageScreen";
import ManageEquipmentScreen from "../../components/services/manageEquipment/ManageEquipmentScreen";
import RebootModemScreen from "../../components/services/manageEquipment/RebootModemScreen";

import ModemSpeedTestScreen from "../../components/services/speedTest/ModemSpeedTestScreen";
import WiFiSpeedTestScreen from "../../components/services/speedTest/WifiSpeedTestRunning";

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
        name="manageEquipment"
        component={ManageEquipmentScreen}
         options={{ 
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true
        }}
      />
      
      <ServiceStack.Screen name="ModemSpeedTest" component={ModemSpeedTestScreen} options={{ headerShown: false }} />
      <ServiceStack.Screen name="WifiSpeedTest" component={WiFiSpeedTestScreen} options={{ headerShown: false }} />
      <ServiceStack.Screen
        name="RebootModem"
        component={RebootModemScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <ServiceStack.Screen
        name="ArticleWindowUtility"
        component={ArticleWindowUtility}
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
