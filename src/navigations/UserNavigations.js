import React, { useEffect, useRef, useState } from "react";
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

// Use useRef instead of createRef for better stability
export const navigationRef = React.createRef();

const UserNavigations = (props) => {
  const routeNameRef = useRef();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const onReady = () => {
    // Only proceed if navigation ref is available
    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
      setIsNavigationReady(true);
    }
  };

  const onStateChange = async () => {
    // Add null checks
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
    // CRITICAL: Add comprehensive null checks
    if (!navigationRef.current) {
      console.warn('Navigation ref not available, allowing default back behavior');
      return true; // Allow default back button behavior
    }

    try {
      const rootState = navigationRef.current.getRootState();
      if (!rootState || !rootState.routes) {
        console.warn('Navigation state not available, allowing default back behavior');
        return true;
      }

      const currentTab = rootState.routes[rootState.index];
      
      // Check if we're in a nested navigator with multiple screens
      if (currentTab?.state && currentTab.state.index > 0) {
        return false; // Let React Navigation handle the back action
      } 
      
      // Check if we can go back in the main stack
      if (navigationRef.current.canGoBack()) {
        return false; // Let React Navigation handle the back action
      }

      // If we're at the root, allow the app to exit
      return true;
      
    } catch (error) {
      console.error('Error in handleBackButton:', error);
      // On error, allow default behavior to prevent crash
      return true;
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    let backHandler = null;

    // Only set up listeners after navigation is ready
    if (isNavigationReady && navigationRef.current) {
      try {
        unsubscribe = navigationRef.current.addListener('state', onStateChange);
        backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      } catch (error) {
        console.error('Error setting up navigation listeners:', error);
      }
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error removing navigation listener:', error);
        }
      }
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [isNavigationReady]); // Re-run when navigation becomes ready

  return (
    <MaintenanceWrapper>
      <NavigationContainer 
        ref={navigationRef} 
        onReady={onReady} 
        onStateChange={onStateChange}
      >
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