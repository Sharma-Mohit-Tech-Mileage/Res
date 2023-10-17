import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../components/user/login";
import SignupScreen from "../components/user/signup";
import MyTabs from "./MyTab";

const Stack = createNativeStackNavigator();

const UserNavigations = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Home"
          component={MyTabs}
          options={{
            headerBackVisible: false,
            headerShown:false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default UserNavigations;
