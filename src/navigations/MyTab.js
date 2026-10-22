import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, AccessibilityInfo } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useVisibleTabs } from "../hooks/useVisibleTabs";
import Touchable from "../components/common/customui/Touchable";
import { useAnnouncement } from "../hooks/useAnnouncement";
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
import { FontFamily, Color, FontSize } from "../styles/GlobalStyles";
import { calculateTabBarHeight } from "./tabBarHeight";
const Tab = createBottomTabNavigator();


const HARD_CODE_WALKTHROUGH_FOR_TESTING = false;
const HARD_CODE_WALKTHROUGH_STEP_FOR_TESTING = 0;

const MyTabs = ({ route }) => {



  const COMPONENT_MAP = {
    HomeStackScreen: HomeStackScreen,
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
      : Color.sparklightGray1;

    return <IconComponent color={iconColor} filled={focused} />;
  };

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const visibleTabs = useVisibleTabs();
  const home = useSelector((state) => state.home);
  const userData = useSelector((state) => state.user.userData);
  const { triggerOnAppLaunch } = useAnnouncement();

  const [showWalkthrough, setShowWalkthrough] = useState(
    HARD_CODE_WALKTHROUGH_FOR_TESTING
  );
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);


  const tabBarHeight = useMemo(
    () => calculateTabBarHeight(insets),
    [insets.bottom]
  );

  const walkthroughStep = useMemo(() => {
    if (home.walkThroughStep !== null && home.walkThroughStep !== undefined) {
      return home.walkThroughStep;
    }

    if (HARD_CODE_WALKTHROUGH_FOR_TESTING) {
      return HARD_CODE_WALKTHROUGH_STEP_FOR_TESTING;
    }

    return null;
  }, [home.walkThroughStep]);

  const isWalkthroughActive =
    showWalkthrough &&
    walkthroughStep !== null &&
    walkthroughStep !== undefined;

  const isTabAccessible = useCallback(
    (tabIndex) => {
      if (!isWalkthroughActive) return true;
      return walkthroughStep === tabIndex;
    },
    [isWalkthroughActive, walkthroughStep]
  );


  const handleWalkthroughFinish = useCallback(() => {
    setShowWalkthrough(false);
  }, []);


  const renderTabIcon = useCallback(
    (tab, focused) => (
      <View style={styles.tabIcon}>
        {getIconComponent(tab.id, focused)}
      </View>
    ),
    []
  );

  const createTabBarButton = useCallback(
    (props, tab, tabPosition, tabCount) => {
      if (!tab) {
        return <Touchable {...props} minSize={0} accessibilityRole="tab" />;
      }

      const isAccessible = isTabAccessible(tab.index);
      const hideFromAccessibility =
        isScreenReaderEnabled && isWalkthroughActive && !isAccessible;
      const shouldPreventPress = isWalkthroughActive && !isAccessible;

      return (
        <Touchable
          {...props}
          minSize={0}
          accessible={!hideFromAccessibility}
          importantForAccessibility={hideFromAccessibility ? "no-hide-descendants" : "yes"}
          accessibilityElementsHidden={hideFromAccessibility}
          accessibilityLabel={`${tab.name}, ${tabPosition} of ${tabCount}, tab`}
          accessibilityRole="tab"
          accessibilityState={{
            ...props.accessibilityState,
            disabled: shouldPreventPress || props.accessibilityState?.disabled,
          }}
          style={[
            props.style,
            { alignItems: "stretch" },
            shouldPreventPress && styles.disabledTab,
          ]}
          pointerEvents={shouldPreventPress ? "none" : "auto"}
          onPress={(e) => {
            if (shouldPreventPress) {
              e.preventDefault();
              return;
            }
            props.onPress?.(e);
          }}
        />
      );
    },
    [isTabAccessible, isScreenReaderEnabled, isWalkthroughActive]
  );


  const createTabListeners = useCallback(
    (tab) => ({ navigation }) => ({
      tabPress: (e) => {
        if (isWalkthroughActive && !isTabAccessible(tab.index)) {
          e.preventDefault();
          return;
        }

        if (["billing", "support", "services", "account"].includes(tab.id)) {
          e.preventDefault();
          navigation.reset({
            index: 0,
            routes: [{ name: tab.screenName }],
          });
        }
      },
    }),
    [isTabAccessible, isWalkthroughActive]
  );


  useEffect(() => {
    if (HARD_CODE_WALKTHROUGH_FOR_TESTING) {
      return;
    }

    setShowWalkthrough(
      home.walkThroughStep !== null && home.walkThroughStep !== undefined
    );
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

  useEffect(() => {
    const isNewUser = !userData?.userInfo?.mobileTCAcceptanceFlag;
    const isWalkthroughRunning = home.walkThroughStep !== null && home.walkThroughStep !== undefined;

    if (!isNewUser && !isWalkthroughRunning) {
      const timer = setTimeout(() => {
        triggerOnAppLaunch();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [userData?.userInfo?.mobileTCAcceptanceFlag, home.walkThroughStep, triggerOnAppLaunch]);

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
      tabBarInactiveTintColor: Color.sparklightGray1,
      tabBarLabelPosition: "below-icon",
      tabBarLabelStyle: {
        fontSize: FontSize.size_xs,
        fontFamily: FontFamily.RadioCanadaRegular,
        fontWeight: "600",
      },
      headerShown: false,
      swipeEnabled: false,
      tabBarAccessibilityLabel:
        isWalkthroughActive && isScreenReaderEnabled ? undefined : "Navigation tabs",
    }),
    [tabBarHeight, isWalkthroughActive, isScreenReaderEnabled]
  );


  return (
    <>
      <View
        style={{ flex: 1 }}
        accessibilityElementsHidden={isWalkthroughActive && isScreenReaderEnabled}
        importantForAccessibility={
          isWalkthroughActive && isScreenReaderEnabled
            ? "no-hide-descendants"
            : "auto"
        }
        pointerEvents={isWalkthroughActive ? "none" : "auto"}
      >
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
          {visibleTabs.map((tab, index) => (
            <Tab.Screen
              key={tab.id}
              name={tab.screenName}
              component={getComponent(tab.component)}
              initialParams={{ data: route }}
              options={{
                tabBarLabel: tab.name,
                tabBarAccessibilityLabel: `${tab.name}, ${index + 1} of ${visibleTabs.length}, tab`,
                tabBarIcon: ({ focused }) => renderTabIcon(tab, focused),
                tabBarButton: (props) =>
                  createTabBarButton(props, tab, index + 1, visibleTabs.length),
              }}
              listeners={createTabListeners(tab)}
            />
          ))}
        </Tab.Navigator>
      </View>

      {showWalkthrough && (
        <WalkthroughOverlay
          visibleTabs={visibleTabs}
          currentStep={home.walkThroughStep || 0}
          onFinish={handleWalkthroughFinish}
          tabBarHeight={tabBarHeight}
        />
      )}
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
