import React, { useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import analytics from "@react-native-firebase/analytics";
import SplashScreen from "../components/splash/SplashScreen";
import ArticalWindowUtility from "../components/utility/ArticalWindowUtility";
import EmailNotifications from "../components/entry/EmailNotifications";
import PushNotifications from "../components/entry/PushNotifications";
import TextNotifications from "../components/entry/TextNotifications";
import Terms from "../components/entry/Terms";
import MyTabs from "./MyTab";
import { AxiosInterceptorProvider } from "../network/RestApiClient";
import MaintenanceWrapper from "../components/maintenance/MaintenanceWrapper";
import { AnnouncementProvider } from "../contexts/AnnouncementContext";
import { useAnnouncement } from "../hooks/useAnnouncement";
const Stack = createNativeStackNavigator();
export const navigationRef = React.createRef();

const UserNavigations = (props) => {
  const routeNameRef = useRef();
  const { triggerOnAppLaunch } = useAnnouncement();

  useEffect(() => {
    triggerOnAppLaunch();
  }, [triggerOnAppLaunch]);
  const onReady = () => {
    if (navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      if (currentRoute) {
        routeNameRef.current = currentRoute.name;
      }
    }
  };

  const onStateChange = async () => {
    if (!navigationRef.current) return;

    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationRef.current.getCurrentRoute();
    const currentRouteName = currentRoute?.name;

    if (
      previousRouteName !== currentRouteName &&
      currentRouteName &&
      currentRouteName.trim() !== ""
    ) {
      try {
        await analytics().logEvent("screen_view", {
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }

      routeNameRef.current = currentRouteName;
    }
  };

  const handleBackButton = () => {
    if (!navigationRef.current) {
      return true;
    }

    try {
      const currentRoute = navigationRef.current.getRootState();

      if (!currentRoute || !currentRoute.routes) {
        return true;
      }

      const currentTab = currentRoute.routes[currentRoute.index];

      if (currentTab && currentTab.state && currentTab.state.index > 0) {
        return false;
      } else if (navigationRef.current.canGoBack()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in handleBackButton:", error);
      return true;
    }
  };

  useEffect(() => {
    let unsubscribe = null;
    let backHandler = null;

    const setupListeners = () => {
      try {
        if (navigationRef.current) {
          unsubscribe = navigationRef.current.addListener(
            "state",
            onStateChange
          );
        }
        backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          handleBackButton
        );
      } catch (error) {
        console.error("Error setting up listeners:", error);
      }
    };

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
          console.error("Error removing listener:", error);
        }
      }
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, []);

  return (
    <MaintenanceWrapper>
      <NavigationContainer
        ref={navigationRef}
        onReady={onReady}
        onStateChange={onStateChange}
      >
        <AxiosInterceptorProvider>
          <AnnouncementProvider>
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
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </AnnouncementProvider>
        </AxiosInterceptorProvider>
      </NavigationContainer>
    </MaintenanceWrapper>
  );
};

export default UserNavigations;
