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
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
  };

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute().name;

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
    const currentRoute = navigationRef.current.getRootState();
    const currentTab = currentRoute.routes[currentRoute.index];

    if (currentTab.state && currentTab.state.index > 0) {
      return false;
    } else if (navigationRef.current.canGoBack()) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    onReady();
    const unsubscribe = navigationRef.current.addListener('state', onStateChange);
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
      <AxiosInterceptorProvider>
        <MaintenanceWrapper>
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
      </MaintenanceWrapper>
    </AxiosInterceptorProvider>
  </NavigationContainer>
);
}

export default UserNavigations;
