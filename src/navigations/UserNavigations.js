import React, { useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import SplashScreen from "../components/splash/SplashScreen";
import ArticleWindowUtility from "../components/utility/ArticleWindowUtility";
import EmailNotifications from "../components/entry/EmailNotifications";
import PushNotifications from "../components/entry/PushNotifications";
import TextNotifications from "../components/entry/TextNotifications";
import Terms from "../components/entry/Terms";
import MyTabs from "./MyTab";
import { AxiosInterceptorProvider } from "../network/RestApiClient";
import MaintenanceWrapper from "../components/maintenance/MaintenanceWrapper";
import { AnnouncementProvider } from "../contexts/AnnouncementContext";

const Stack = createNativeStackNavigator();

export const navigationRef = React.createRef();

const UserNavigations = (props) => {
  const routeNameRef = useRef();

  const onReady = () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    if (currentRoute) {
      routeNameRef.current = currentRoute.name;
    }
  };

  // Single registration via the NavigationContainer prop — a second 'state' listener double-fires screen_view.
  const onStateChange = async () => {
    if (!navigationRef.current) return;

    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
    if (!currentRouteName || currentRouteName.trim() === "" || currentRouteName === previousRouteName) return;

    // Update the ref before the await so a re-entrant state event can't pass the guard twice.
    routeNameRef.current = currentRouteName;

    // ArticleWindowUtility fires its own screen_view with the real page label, so skip the generic one.
    if (currentRouteName === "ArticleWindowUtility") return;
    try {
      await logEvent(getAnalytics(), "screen_view", {
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    } catch (error) {
      console.warn("Analytics error:", error);
    }
  };

  // Returning true hands back to the OS default (exit); false lets React Navigation pop.
  const handleBackButton = () => {
    if (!navigationRef.current) {
      return true;
    }
    try {
      const rootState = navigationRef.current.getRootState();
      if (!rootState || !rootState.routes) {
        return true;
      }
      const currentTab = rootState.routes[rootState.index];
      if (currentTab?.state && currentTab.state.index > 0) {
        return false;
      }
      if (navigationRef.current.canGoBack()) {
        return false;
      }
      return true;
    } catch (error) {
      console.warn("Error in handleBackButton:", error);
      return true;
    }
  };

  useEffect(() => {
    let backHandler = null;

    // Delay so the container ref is populated before the first back press or route read.
    const timeoutId = setTimeout(() => {
      onReady();
      try {
        backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
      } catch (error) {
        console.warn("Error setting up listeners:", error);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, []);

  return (
    <MaintenanceWrapper>
      <NavigationContainer ref={navigationRef} onReady={onReady} onStateChange={onStateChange}>
        <AxiosInterceptorProvider>
          <AnnouncementProvider>
            <Stack.Navigator>
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EntryEmailNotifications" component={EmailNotifications} options={{ headerShown: false }} />
              <Stack.Screen name="EntryPushNotifications" component={PushNotifications} options={{ headerShown: false }} />
              <Stack.Screen name="EntryTextNotifications" component={TextNotifications} options={{ headerShown: false }} />
              <Stack.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
              <Stack.Screen name="ArticleWindowUtility" component={ArticleWindowUtility} options={{ headerShown: false }} />
              <Stack.Screen
                name="MyTab"
                component={MyTabs}
                initialParams={{ user: props.data }}
                options={{ headerBackVisible: false, headerShown: false }}
              />
            </Stack.Navigator>
          </AnnouncementProvider>
        </AxiosInterceptorProvider>
      </NavigationContainer>
    </MaintenanceWrapper>
  );
};

export default UserNavigations;
