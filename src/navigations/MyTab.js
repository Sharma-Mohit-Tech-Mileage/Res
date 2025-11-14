import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import HomeIcon from "../res/svgIcons/HomeIcon";
import BillingIcon from "../res/svgIcons/BillingIcon";
import SupportIcon from "../res/svgIcons/SupportIcon";
import NewSupportIcon from "../res/svgIcons/NewSupportIcon";
import HomeAccountIcon from "../res/svgIcons/HomeAccountIcon";
import { FontFamily, Color, FontSize } from "../../GlobalStyles";

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = {
  IOS: 90,
  ANDROID_MIN: 55,
  ANDROID_PADDING: 60,
};

const COMPONENT_MAP = {
  HomeStackScreen,
  BillingStackScreen,
  MyServicesStack,
  SupportStack,
  AccountStackScreen,
};

const ICON_MAP = {
  home: HomeIcon,
  billing: BillingIcon,
  services: SupportIcon,
  support: NewSupportIcon,
  account: HomeAccountIcon,
};

const getComponent = (componentName) => {
  return COMPONENT_MAP[componentName] || HomeStackScreen;
};

const getIconComponent = (tabId, focused) => {
  const IconComponent = ICON_MAP[tabId] || HomeIcon;
  const iconColor = focused
    ? Color.colorMidnightblue
    : Color.sparklightDarkGray;

  return <IconComponent color={iconColor} filled={focused} />;
};

const calculateTabBarHeight = (insets) => {
  return Platform.OS === "ios"
    ? TAB_BAR_HEIGHT.IOS
    : Math.max(
        TAB_BAR_HEIGHT.ANDROID_MIN,
        insets.bottom + TAB_BAR_HEIGHT.ANDROID_PADDING
      );
};

const MyTabs = ({ route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const visibleTabs = useVisibleTabs();
  const home = useSelector((state) => state.home);

  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  const tabBarHeight = useMemo(
    () => calculateTabBarHeight(insets),
    [insets.bottom]
  );

  const isWalkthroughActive = useMemo(
    () =>
      showWalkthrough &&
      home.walkThroughStep !== null &&
      home.walkThroughStep !== undefined,
    [showWalkthrough, home.walkThroughStep]
  );

  const isTabAccessible = useCallback(
    (tabIndex) => {
      if (!showWalkthrough) return true;
      if (home.walkThroughStep === null || home.walkThroughStep === undefined) {
        return true;
      }
      return home.walkThroughStep === tabIndex;
    },
    [showWalkthrough, home.walkThroughStep]
  );

  const isTabHiddenInWalkthrough = useCallback(
    (tabIndex) => isWalkthroughActive && home.walkThroughStep !== tabIndex,
    [isWalkthroughActive, home.walkThroughStep]
  );

  const handleWalkthroughFinish = useCallback(() => {
    setShowWalkthrough(false);
  }, []);

  const renderTabIcon = useCallback(
    (tab, focused) => {
      const isHidden = isTabHiddenInWalkthrough(tab.index);
      return (
        <View
          style={styles.tabIcon}
          accessible={false}
          importantForAccessibility={isHidden ? "no-hide-descendants" : "auto"}
        >
          {getIconComponent(tab.id, focused)}
        </View>
      );
    },
    [isTabHiddenInWalkthrough]
  );

  /**
   * NEW: tab-aware tabBarButton
   * We pass `tab` explicitly from each <Tab.Screen /> so we never rely on props.to.
   */
  const createTabBarButton = useCallback(
    (tab, props) => {
      const isAccessible = isTabAccessible(tab.index);

      // During walkthrough, determine if this is the active tab
      const isActiveTabInWalkthrough = isWalkthroughActive && isAccessible;
      const isNonActiveTabInWalkthrough = isWalkthroughActive && !isAccessible;

      // Non-active tabs during walkthrough: View only, not interactive, not focusable
      if (isNonActiveTabInWalkthrough) {
        return (
          <View
            style={[props.style, styles.disabledTab]}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
            pointerEvents="none"
          >
            {props.children}
          </View>
        );
      }

    return (
  <Pressable
    {...props}
    accessible={true}
    accessibilityRole="tab"
    accessibilityLabel={`${tab.name}`}
    accessibilityState={{
      ...props.accessibilityState,
    }}
    accessibilityHint={
      isActiveTabInWalkthrough
        ? "Use walkthrough controls to continue. This tab is temporarily not clickable."
        : props.accessibilityHint
    }
    importantForAccessibility="yes"
    onPress={(e) => {
      if (isActiveTabInWalkthrough) {
        e.preventDefault?.();
        return;
      }
      props.onPress?.(e);
    }}
  />
);
    },
    [isTabAccessible, isWalkthroughActive]
  );

  const createTabListeners = useCallback(
    (tab) => ({ navigation }) => ({
      tabPress: (e) => {
        if (
          !isTabAccessible(tab.index) &&
          (isScreenReaderEnabled || isWalkthroughActive)
        ) {
          e.preventDefault();
          return;
        }

        if (["billing", "support"].includes(tab.id)) {
          e.preventDefault();
          navigation.reset({
            index: 0,
            routes: [{ name: tab.screenName }],
          });
        }
      },
    }),
    [isTabAccessible, isScreenReaderEnabled, isWalkthroughActive]
  );

  useEffect(() => {
    const initWalkthrough = async () => {
      if (
        home.walkThroughStep !== null &&
        home.walkThroughStep !== undefined
      ) {
        setShowWalkthrough(true);
      }
    };

    initWalkthrough();
  }, [home.walkThroughStep]);

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

  if (visibleTabs.length === 0) {
    return null;
  }

  const screenOptions = useMemo(
    () => ({
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
      headerShown: false,
      swipeEnabled: false,
      tabBarAccessibilityLabel: "Navigation tabs",
    }),
    [tabBarHeight]
  );

  return (
    <>
      {showWalkthrough && (
        <WalkthroughOverlay
          visibleTabs={visibleTabs}
          currentStep={home.walkThroughStep || 0}
          onFinish={handleWalkthroughFinish}
          tabBarHeight={tabBarHeight}
        />
      )}

      <Tab.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        {visibleTabs.map((tab) => (
          <Tab.Screen
            key={tab.id}
            name={tab.screenName}
            component={getComponent(tab.component)}
            initialParams={{ data: route }}
            options={{
              tabBarLabel: tab.name,
              tabBarAccessibilityLabel: `${tab.name} tab`,
              tabBarIcon: ({ focused }) => renderTabIcon(tab, focused),
              tabBarLabelStyle: {
                fontSize: FontSize.size_xs,
                fontFamily: FontFamily.openSansRegular,
                fontWeight: "600",
              },
              // IMPORTANT: per-screen tabBarButton that knows which tab it is
              tabBarButton: (props) => createTabBarButton(tab, props),
            }}
            listeners={createTabListeners(tab)}
          />
        ))}
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledTab: {
    opacity: 0.3,
    pointerEvents: "none",
  },
});

export default React.memo(MyTabs);