import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../components/user/login";
import SignupScreen from "../components/user/signup";
import SplashScreen from "../components/user/SplashScreen";
import MyTabs from "./MyTab";

const Stack = createNativeStackNavigator();

const UserNavigations = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
          
        /> 
        <Stack.Screen
          name="Home"
          component={MyTabs}
          initialParams={{user:props.data}}
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
