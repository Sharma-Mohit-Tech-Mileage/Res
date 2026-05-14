// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import supportScreen from "../../components/support/supportScreen";
import Search from "../../components/support/Search";
import ArticleWindowUtility from "../../components/utility/ArticleWindowUtility";

const SupportStack = createNativeStackNavigator();

function SupportStackScreen({ route }) {
  return (
    <SupportStack.Navigator
      initialRouteName={
        route.params?.isManagementEquipment ? "ManageEquipment" : "support"
      }
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <SupportStack.Screen
        name="support"
        component={supportScreen}
        initialParams={route.params}
        options={{ headerShown: false }}
      />
      <SupportStack.Screen
        name="searchArticals"
        component={Search}
        options={{ headerShown: false }}
      />

      <SupportStack.Screen
        name="ArticleWindowUtility"
        component={ArticleWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </SupportStack.Navigator>
  );
}

export default SupportStackScreen;
