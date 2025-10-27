/**
 * ============================================================================
 * BOTTOM TAB NAVIGATOR
 * ============================================================================
 * 
 * Main tab navigation with dynamic visibility based on user context.
 * 
 * KEY FEATURES:
 * - Dynamic tab visibility
 * - Walkthrough integration
 * - Accessibility support
 * 
 * ========================x====================================================
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Platform, Pressable, AccessibilityInfo } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useVisibleTabs } from "../hooks/useVisibleTabs";
import { fetchProfileDetails } from "../redux/actions/ProfileActionSuite";
import WalkthroughOverlay from "../components/walkthrough/WalkthroughOverlay";
import AccountStackScreen from "./stackNavigation/AccountStack";
import SupportStack from "./stackNavigation/SupportStack";
import HomeStackScreen from "./stackNavigation/HomeStack";
import BillingStackScreen from "./stackNavigation/BillingStack";
import MyServicesStack from "./stackNavigation/MyServicesStack";
import HomeIconSelected from "../res/svgIcons/HomeIconSelected";
import HomeIcon from "../res/svgIcons/HomeIcon";
import SupportIcon from "../res/svgIcons/SupportIcon";
import SupportIconSelected from "../res/svgIcons/SupportIconSelected";
import BillingIcon from "../res/svgIcons/BillingIcon";
import NewSupportIcon from "../res/svgIcons/NewSupportIcon";
import HomeAccountIcon from "../res/svgIcons/HomeAccountIcon";
import { FontFamily, Color, FontSize } from "../../GlobalStyles";

const Tab = createBottomTabNavigator();

const MyTabs = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const visibleTabs = useVisibleTabs();
  const home = useSelector((state) => state.home);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  useEffect(() => {
    const checkScreenReader = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(enabled);
    };

    checkScreenReader();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );

    return () => subscription.remove();
  }, []);


  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProfileDetails());
    }, [dispatch])
  );

  /**
   * Get component for tab ID
   */
  const getComponent = (componentName) => {
    const componentMap = {
      HomeStackScreen,
      BillingStackScreen,
      MyServicesStack,
      SupportStack,
      AccountStackScreen,
    };
    return componentMap[componentName] || HomeStackScreen;
  };

  /**
   * Get icon for tab
   */
  const getIcon = (tab, focused) => {
    const iconMap = {
      home: focused ? HomeIconSelected : HomeIcon,
      billing: BillingIcon,
      services: focused ? SupportIconSelected : SupportIcon,
      support: NewSupportIcon,
      account: HomeAccountIcon,
    };

    const IconComponent = iconMap[tab.id] || HomeIcon;
    return <IconComponent focused={focused} />;
  };

  /**
   * Check if tab is accessible during walkthrough
   */
  const isTabAccessible = (tabIndex) => {
    if (!showWalkthrough) return true;
    if (home.walkThroughStep === null || home.walkThroughStep === undefined) {
      return true;
    }
    return home.walkThroughStep === tabIndex;
  };

  /**
   * Check if walkthrough is active
   */
  const isWalkthroughActive = () => {
    return (
      showWalkthrough &&
      home.walkThroughStep !== null &&
      home.walkThroughStep !== undefined
    );
  };

  // Calculate tab bar height
  const tabBarHeight =
    Platform.OS === "ios"
      ? 90
      : Math.max(55, insets.bottom + 60);

  // Wait for tabs to load
  if (visibleTabs.length === 0) {
    return null; // Or loading indicator
  }

  return (
    <>
     {showWalkthrough && (
        <WalkthroughOverlay
          visibleTabs={visibleTabs}
          currentStep={home.walkThroughStep || 0}
          onFinish={() => setShowWalkthrough(false)}
          tabBarHeight={tabBarHeight}
        />
      )}

      {/* Tab Navigator */}
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {
            paddingVertical: 5,
            position: "absolute",
            height: tabBarHeight,
          },
          tabBarActiveTintColor: Color.colorMidnightblue,
          tabBarInactiveTintColor: Color.sparklightDarkGray,
          tabBarLabelStyle: {
            fontSize: FontSize.size_xs,
            fontFamily: FontFamily.openSansRegular,
            fontWeight: "600",
          },
          tabBarButton: (props) => {
            // Find tab by screen name
            const tab = visibleTabs.find(
              (t) => t.screenName === props.to?.split("/").pop()
            );
            const isAccessible = tab ? isTabAccessible(tab.index) : true;

            return (
              <Pressable
                {...props}
                accessible={isAccessible}
                accessibilityElementsHidden={!isAccessible}
                importantForAccessibility={
                  isAccessible ? "yes" : "no-hide-descendants"
                }
                style={[props.style, !isAccessible && styles.disabledTab]}
                onPress={(e) => {
                  if (
                    !isAccessible &&
                    (isScreenReaderEnabled || isWalkthroughActive())
                  ) {
                    return;
                  }
                  props.onPress(e);
                }}
              />
            );
          },
        }}
      >
        {visibleTabs.map((tab) => (
          <Tab.Screen
            key={tab.id}
            name={tab.screenName}
            component={getComponent(tab.component)}
            initialParams={{ data: route }}
            options={{
              headerShown: false,
              swipeEnabled: false,
              tabBarLabel: tab.name,
              tabBarAccessibilityLabel: isTabAccessible(tab.index)
                ? tab.name
                : undefined,
              tabBarIcon: ({ focused }) => (
                <View
                  style={[ styles.tabIcon, !isTabAccessible(tab.index) && styles.disabledTab, ]}
                  accessible={false}
                  importantForAccessibility="no"
                >
                  {getIcon(tab, focused)}
                </View>
              ),
            }}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                if (
                  !isTabAccessible(tab.index) &&
                  (isScreenReaderEnabled || isWalkthroughActive())
                ) {
                  e.preventDefault();
                  return;
                }

                // Reset navigation for specific tabs
                if (["billing", "support"].includes(tab.id)) {
                  e.preventDefault();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: tab.screenName }],
                  });
                }
              },
            })}
          />
        ))}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: "center",
  },
  disabledTab: {
    pointerEvents: "none",
    opacity: 0.5,
  },
});

export default MyTabs;