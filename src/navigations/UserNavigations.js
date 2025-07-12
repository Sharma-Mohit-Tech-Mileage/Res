import React, { useEffect, useRef } from "react";
import { BackHandler } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import analytics from '@react-native-firebase/analytics';
import SplashScreen from "../components/user/SplashScreen";
import ArticalWindowUtility from '../components/utility/ArticalWindowUtility';
import EmailNotifications from '../components/entry/EmailNotifications';
import PushNotifications from '../components/entry/PushNotifications';
import TextNotifications from '../components/entry/TextNotifications';
import Terms from '../components/entry/Terms';
import MyTabs from "./MyTab";
import { AxiosInterceptorProvider } from '../network/RestApiClient';
import MaintenanceWrapper from '../components/maintenance/MaintenanceWrapper';

const Stack = createNativeStackNavigator();

// Export the navigation reference for global use
export const navigationRef = React.createRef();

const UserNavigations = (props) => {
  const routeNameRef = useRef();

  const onReady = () => {
    // Add null check to prevent crash
    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
    }
  };

  const onStateChange = async () => {
    // Add null check to prevent crash
    if (!navigationRef.current) return;
    
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.current.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (previousRouteName !== currentRouteName && currentRouteName && currentRouteName.trim() !== "") {
      try {
        await analytics().logEvent('screen_view', {
          screen_name: currentRouteName,
          screen_class: currentRouteName
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }

      routeNameRef.current = currentRouteName;
    }
  };

  const handleBackButton = () => {
    // CRITICAL FIX: Add null checks to prevent crash
    if (!navigationRef.current) {
      return true; // Allow default back behavior if navigation not ready
    }

    try {
      const currentRoute = navigationRef.current.getRootState();
      
      // Additional safety check
      if (!currentRoute || !currentRoute.routes) {
        return true; // Allow default back behavior
      }
      
      const currentTab = currentRoute.routes[currentRoute.index];

      if (currentTab && currentTab.state && currentTab.state.index > 0) {
        return false;
      } else if (navigationRef.current.canGoBack()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in handleBackButton:', error);
      return true; // Allow default back behavior on error
    }
  };

  useEffect(() => {
    // Add safety checks and delay listener setup
    let unsubscribe = null;
    let backHandler = null;

    const setupListeners = () => {
      try {
        if (navigationRef.current) {
          unsubscribe = navigationRef.current.addListener('state', onStateChange);
        }
        backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      } catch (error) {
        console.error('Error setting up listeners:', error);
      }
    };

    // Small delay to ensure navigation is ready
    const timeoutId = setTimeout(() => {
      onReady();
      setupListeners();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error removing listener:', error);
        }
      }
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, []);

  return (
     <MaintenanceWrapper>
    <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
      <AxiosInterceptorProvider>
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
     
    </AxiosInterceptorProvider>
  </NavigationContainer>
   </MaintenanceWrapper>
);
}

export default UserNavigations;