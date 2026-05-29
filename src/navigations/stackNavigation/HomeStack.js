import React, { Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewBillerHome from "../../components/home/NewBillerHome";
import ArticleWindowUtility from "../../components/utility/ArticleWindowUtility";
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
        name="ArticleWindowUtility"
        component={ArticleWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
