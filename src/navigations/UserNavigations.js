import * as React from "react";
import { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import analytics from '@react-native-firebase/analytics';
import SplashScreen from "../components/user/SplashScreen";
import ArticalWindowUtility from '../components/utility/ArticalWindowUtility'
import EmailNotifications from '../components/entry/EmailNotifications';
import PushNotifications from '../components/entry/PushNotifications';
import TextNotifications from '../components/entry/TextNotifications';
import Terms from '../components/entry/Terms';
import MyTabs from "./MyTab";

const Stack = createNativeStackNavigator();

const UserNavigations = (props) => {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  const onReady = () => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
  };

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute().name;

    if (previousRouteName !== currentRouteName) {
      try {
        await analytics().logEvent('screen_view', {
          screen_name: currentRouteName,
          screen_class: currentRouteName
        });
        // The event was successfully queued for sending
        console.log(`Screen view event queued for: ${currentRouteName}`);
      } catch (error) {
        // Handle any errors that occurred during logging
        console.error('Error logging screen view event:', error);
      }

      routeNameRef.current = currentRouteName;
    }
  };


  useEffect(() => {
    // Call onReady manually for the first load
    onReady();

    // Attach the listener
    const unsubscribe = navigationRef.current.addListener('state', onStateChange);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  return (
    <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EntryEmailNotifications"
          component={EmailNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EntryPushNotifications"
          component={PushNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EntryTextNotifications"
          component={TextNotifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />   
        <Stack.Screen
          name="ArticalWindowUtility"
          component={ArticalWindowUtility}
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
