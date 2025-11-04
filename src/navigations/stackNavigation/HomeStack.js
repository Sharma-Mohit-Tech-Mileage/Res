import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewBillerHome from "../../components/home/NewBillerHome";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import AutoPayPCIConnector from "../../components/utility/AutoPayPCIConnector";
import { ActivityIndicator } from "react-native";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <HomeStack.Screen name="Dashboard" options={{ headerShown: false }}>
        {({ navigation }) => (
          <Suspense
            fallback={<ActivityIndicator size="large" color="#0000ff" />}
          >
            <NewBillerHome navigation={navigation} />
          </Suspense>
        )}
      </HomeStack.Screen>

      <HomeStack.Screen
        name="ArticalWindowUtility"
        component={ArticalWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <HomeStack.Screen
        name="AutoPayPCIConnector"
        component={AutoPayPCIConnector}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
