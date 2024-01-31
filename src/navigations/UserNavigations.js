import * as React from "react";
import { useEffect, useRef } from "react";
import { BackHandler } from "react-native"; // Import BackHandler
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

  const handleBackButton = () => {
    // Log the current state of the entire navigation
    const currentRoute = navigationRef.current.getRootState();
    console.log("Current Navigation State:", currentRoute);

    // Check if there's a screen to go back to in the current tab's stack
    const currentTab = currentRoute.routes[currentRoute.index];
    console.log("Current Tab State:", currentTab.state);

    if (currentTab.state && currentTab.state.index > 0) {
      console.log("Going back within the current tab's stack");
      // navigation.goBack();
      return false;
    } else if (navigationRef.current.canGoBack()) {
      console.log("Going back in the outer stack");
      // navigation.goBack();
      return false;
    }

    console.log("No screen to go back to, default action proceeds");
    return true;
  };

  useEffect(() => {
    // Call onReady manually for the first load
    onReady();

    // Attach the listener
    const unsubscribe = navigationRef.current.addListener('state', onStateChange);

    // Add a listener for the hardware back button press
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Clean up the listeners when the component unmounts
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);
  return (
    <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
      <Stack.Navigator >
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
