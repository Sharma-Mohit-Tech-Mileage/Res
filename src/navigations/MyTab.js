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
const calculateTabBarHeight = (insets) => {
  return Platform.OS === "ios"
    ? TAB_BAR_HEIGHT.IOS
    : Math.max(TAB_BAR_HEIGHT.ANDROID_MIN, insets.bottom + TAB_BAR_HEIGHT.ANDROID_PADDING);
};


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
    : Color.sparklightDarkGray;
  
  return <IconComponent color={iconColor} filled={focused} />;
};
  
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const visibleTabs = useVisibleTabs();
  const home = useSelector((state) => state.home);
  
  // Hardcode walkthrough as active for testing
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);


  const tabBarHeight = useMemo(
    () => calculateTabBarHeight(insets),
    [insets.bottom]
  );

  // Hardcode walkthrough as active for testing
  const isWalkthroughActive = true;

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
  (props) => {
    const tab = visibleTabs.find(
      (t) => t.screenName === props.to?.split("/").pop()
    );
    
    if (!tab) {
      return <Pressable {...props} />;
    }
    
    const isAccessible = isTabAccessible(tab.index);
    const shouldPreventPress = !isAccessible && 
      (isScreenReaderEnabled || isWalkthroughActive);

    return (
      <Pressable
        {...props}
        accessible={isAccessible && !isWalkthroughActive}
        importantForAccessibility={
          !isAccessible || isWalkthroughActive 
            ? "no-hide-descendants" 
            : "yes"
        }
        accessibilityElementsHidden={!isAccessible || isWalkthroughActive}
        accessibilityLabel={`${tab.name} tab`}
        accessibilityRole="tab"
        accessibilityState={{
          disabled: !isAccessible,
        }}
        style={[
          props.style,
          !isAccessible && styles.disabledTab,
        ]}
        pointerEvents={!isAccessible && isWalkthroughActive ? "none" : "auto"}
        onPress={(e) => {
          if (isWalkthroughActive || shouldPreventPress) {
            e.preventDefault();
            return;
          }
          props.onPress(e);
        }}
      />
    );
  },
  [visibleTabs, isTabAccessible, isScreenReaderEnabled, isWalkthroughActive]
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

        if (["billing", "support", "services","account"].includes(tab.id)) {
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
      if (home.walkThroughStep !== null && home.walkThroughStep !== undefined) {
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
      tabBarButton: createTabBarButton,
      tabBarAccessibilityLabel: isWalkthroughActive ? undefined : "Navigation tabs",
    }),
    [tabBarHeight, createTabBarButton, isWalkthroughActive]
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

      <View
        accessible={isWalkthroughActive}
        accessibilityElementsHidden={isWalkthroughActive}
        //importantForAccessibility={isWalkthroughActive ? "no-hide-descendants" : "yes"}
        style={{ flex: 1 }}
      >
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={screenOptions}
        >
          {visibleTabs.map((tab,index) => (
            <Tab.Screen
              key={tab.id}
              name={tab.screenName}
              component={getComponent(tab.component)}
              initialParams={{ data: route }}
              options={{      
                tabBarLabel: tab.name,
                tabBarAccessibilityLabel: `${tab.name} tab, step ${index + 1} of ${visibleTabs.length}`,
                tabBarIcon: ({ focused }) => renderTabIcon(tab, focused),
              }}
              listeners={createTabListeners(tab)}
            />
          ))}
        </Tab.Navigator>
      </View>
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