import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../components/user/SplashScreen";
import ArticalWindowUtility from '../components/utility/ArticalWindowUtility'
import EmailNotifications from '../components/entry/EmailNotifications';
import PushNotifications from '../components/entry/PushNotifications';
import TextNotifications from '../components/entry/TextNotifications';
import Terms from '../components/entry/Terms';
import MyTabs from "./MyTab";

const Stack = createNativeStackNavigator();

const UserNavigations = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailNotifications"
          component={EmailNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PushNotifications"
          component={PushNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TextNotifications"
          component={TextNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />                        
        <Stack.Screen
          name="MyTab"
          component={MyTabs}
          initialParams={{ user: props.data }}
          options={{
            headerBackVisible: false,
            headerShown: false
          }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default UserNavigations;
