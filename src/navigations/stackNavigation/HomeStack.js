import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../components/home/Home";
import NewBillerHome from "../../components/home/NewBillerHome";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import ModemStackScreen from "./ManageEquepmentStack";
import ModemSpeedTest from "../../components/common/speedTest/ModemSpeedTest";
import AutoPayPCIConnector from '../../components/utility/AutoPayPCIConnector'
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import MyServices from "../../components/services/MyServices";

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  const route = useRoute();
  const isNormalUser = route.params?.isNormalUser ?? true;

  return (
    <HomeStack.Navigator
      initialRouteName="Dashboard"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      {/* Dashboard Screen */}
      <HomeStack.Screen
        name="Dashboard"
        options={{ headerShown: false }}
      >
        {({ navigation }) => (
          <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
            {isNormalUser ? (
              <HomeScreen navigation={navigation} />
            ) : (
              <NewBillerHome navigation={navigation} />
            )}
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
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

  
      <HomeStack.Screen
        name="ManageEquipment"
        component={ModemStackScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

  
      <HomeStack.Screen
        name="AutoPayPCIConnector"
        component={AutoPayPCIConnector}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

    
      <HomeStack.Screen
        name="ModemSpeedTest"
        component={ModemSpeedTest}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
