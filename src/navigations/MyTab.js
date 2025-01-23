import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Platform, Alert, Pressable, Image, AccessibilityInfo } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTabBarVisibility } from './TabBarVisibilityContext';
import AccountStackScreen from '../navigations/stackNavigation/AccountStack';
import SupportStack from '../navigations/stackNavigation/SupportStack';
import HomeStackScreen from './stackNavigation/HomeStack';
import ShopStack from '../navigations/stackNavigation/ShopStack';
import HomeIconSelected from '../res/svgIcons/HomeIconSelected';
import HomeIcon from '../res/svgIcons/HomeIcon';
import SupportIcon from '../res/svgIcons/SupportIcon';
import AccountIcon from '../res/svgIcons/AccountIcone';
import SupportIconSelected from '../res/svgIcons/SupportIconSelected';
import { FontFamily } from '../../GlobalStyles';
import { Env } from '../network/apis/account/Constants';
import { fetchProfileDetails } from '../redux/actions/ProfileActionSuite';
import BillingIcon from "../res/svgIcons/BillingIcon";
import BillingStackScreen from "./stackNavigation/BillingStack";
import MyServicesStack from "./stackNavigation/MyServicesStack";

const { width } = Dimensions.get('window');
const tabWidth = Number(width / 5);
const Tab = createBottomTabNavigator();

const MyTabs = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [shadowStyleLeft, setShadowStyleLeft] = useState(styles.shadowTabsLeft);
  const [shadowStyle, setShadowStyle] = useState(styles.shadowTabs);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const { tabBarVisible } = useTabBarVisibility();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);

  useEffect(() => {
    dispatch(fetchProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    const checkScreenReader = async () => {
      const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(screenReaderEnabled);
    };
    checkScreenReader();
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        setIsScreenReaderEnabled(enabled);
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const isTabAccessibleDuringWalkthrough = (tabIndex) => {
    if (!user?.isNormalUser || home.walkThroughStep === null || home.walkThroughStep === undefined) {
      return true;
    }
    return home.walkThroughStep === tabIndex;
  };

  const isWalkthroughActive = () => {
    return user?.isNormalUser && home.walkThroughStep !== null && home.walkThroughStep !== undefined;
  };

  const getTabBarIconWrapper = (IconComponent, focused, tabIndex) => {
    const isAccessible = isTabAccessibleDuringWalkthrough(tabIndex);
    return (
      <View 
        style={[
          styles.tabItem,
          !isAccessible && styles.disabledTab
        ]}
        accessible={false}
        importantForAccessibility="no"
      >
        <IconComponent focused={focused} />
      </View>
    );
  };

  function CustomTabBarButton({ onPress, isDisabled, focused, children, tabIndex }) {
    const isAccessible = isTabAccessibleDuringWalkthrough(tabIndex);
    const handlePress = () => {
      if (isDisabled) {
        Alert.alert('Coming Soon', 'We are still working on it.');
        return;
      }
      if ((!isAccessible && isScreenReaderEnabled) || isWalkthroughActive()) {
        return;
      }
      onPress();
    };

    return (
      <Pressable 
        onPress={handlePress} 
        style={[
          styles.tabButton,
          !isAccessible && styles.disabledTab
        ]}
        accessible={isAccessible}
        accessibilityElementsHidden={!isAccessible}
        importantForAccessibility={isAccessible ? 'yes' : 'no-hide-descendants'}
        accessibilityRole="tab"
        accessibilityState={{ 
          disabled: !isAccessible || isDisabled,
          selected: focused 
        }}
        accessibilityLabel={`${isDisabled ? 'Coming soon' : children?.props?.accessibilityLabel || ''}`}
      >
        <View accessible={false} importantForAccessibility="no">
          {focused ? <SupportIconSelected/> : <SupportIcon isNewBillerUser={!user?.isNormalUser}/>}
          {children}
        </View>
      </Pressable>
    );
  }

  useEffect(() => {
    if (user?.isNormalUser) {
      switch(home.walkThroughStep) {
        case 0:
          setShadowStyle(styles.shadowTabs);
          setShadowStyleLeft(styles.shadowTabsLeft);
          break;
        case 1:
          setShadowStyle([styles.shadowTabs, styles.shadowTabsStep2]);
          setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep2Left]);
          break;
        case 2:
          setShadowStyle([styles.shadowTabs, styles.shadowTabsStep32]);
          setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep31Left]);
          break;
        case 3:
          setShadowStyle([styles.shadowTabs, styles.shadowTabsStep3]);
          setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep3Left]);
          break;
        case 4:
          setShadowStyle([styles.shadowTabs, styles.shadowTabsStep4]);
          setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep4Left]);
          break;
      }
    }
  }, [home, user?.isNormalUser]);

  return (
    <>
      {user?.isNormalUser && home.walkThroughStep !== null && home.walkThroughStep !== undefined && (
        <>
          <View style={shadowStyleLeft} />
          <View style={shadowStyle} />
        </>
      )}
      <Tab.Navigator
        name='MyTab'
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarStyle: { 
            paddingVertical: 5, 
            position: 'absolute', 
            height: (Platform.OS === 'ios') ? 90 : 60, 
            display: tabBarVisible ? 'flex' : 'none' 
          },
          tabBarActiveTintColor: '#353091',
          tabBarInactiveTintColor: '#767676',
          tabBarLabelStyle: { 
            fontSize: 12, 
            fontFamily: FontFamily.openSansRegular, 
            fontWeight: '600' 
          },
          tabBarButton: (props) => {
            const tabIndex = ["Home", "BillingTab", "MyServices", "Support", "account"].indexOf(route.name);
            const isAccessible = isTabAccessibleDuringWalkthrough(tabIndex);
            
            return (
              <Pressable
                {...props}
                accessible={isAccessible}
                accessibilityElementsHidden={!isAccessible}
                importantForAccessibility={isAccessible ? 'yes' : 'no-hide-descendants'}
                style={[
                  props.style,
                  !isAccessible && styles.disabledTab
                ]}
                onPress={(e) => {
                  if ((!isAccessible && isScreenReaderEnabled) || isWalkthroughActive()) {
                    return;
                  }
                  props.onPress(e);
                }}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          initialParams={{ data: route, isNormalUser: user?.isNormalUser }}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Home',
            tabBarAccessibilityLabel: isTabAccessibleDuringWalkthrough(0) ? 'Home' : undefined,
            tabBarIcon: ({ focused }) => getTabBarIconWrapper(
              focused ? HomeIconSelected : HomeIcon,
              focused,
              0
            ),
          }}
        />
        
        <Tab.Screen
          name="BillingTab"
          component={BillingStackScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              if (!isTabAccessibleDuringWalkthrough(1) && isScreenReaderEnabled) {
                e.preventDefault();
                return;
              }
              if (!user?.isNormalUser) {
                e.preventDefault();
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'BillingTab',
                      state: {
                        routes: [
                          {
                            name: 'ArticalWindowUtility',
                            params: {
                              url: `${Env.PAYMENTURLNEW}`,
                              name: 'Billing Details',
                              isExpandable: true,
                            },
                          },
                        ],
                      },
                    },
                  ],
                });
              }
            },
          })}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Billing',
            tabBarAccessibilityLabel: isTabAccessibleDuringWalkthrough(1) ? 'Billing' : undefined,
            tabBarIcon: ({ focused }) => getTabBarIconWrapper(
              BillingIcon,
              focused,
              1
            ),
          }}
        />

        <Tab.Screen
          name="MyServices"
          component={MyServicesStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (!isTabAccessibleDuringWalkthrough(2) && isScreenReaderEnabled) {
                return;
              }
              if (!user?.isNormalUser) {
                Alert.alert('Coming Soon', 'We are still working on it.');
                return;
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'MyServices' }],
              });
            },
          })}
          options={{
            headerShown: false,
            tabBarLabel: 'Service',
            tabBarAccessibilityLabel: isTabAccessibleDuringWalkthrough(2) ? 'Service' : undefined,
            tabBarIcon: ({ focused }) => (
              <View 
                style={[
                  styles.tabItem,
                  !isTabAccessibleDuringWalkthrough(2) && styles.disabledTab
                ]}
                accessible={false}
                importantForAccessibility="no"
              >
                {focused ? <SupportIconSelected/> : <SupportIcon isNewBillerUser={!user?.isNormalUser}/>}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Support"
          component={SupportStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (!isTabAccessibleDuringWalkthrough(3) && isScreenReaderEnabled) {
                return;
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'Support' }],
              });
            },
          })}
          options={{
            headerShown: false,
            tabBarLabel: 'Support',
            tabBarIcon: ({ focused }) => (
              <View 
                style={[
                  styles.tabItem,
                  !isTabAccessibleDuringWalkthrough(3) && styles.disabledTab
                ]}
                accessible={false}
                importantForAccessibility="no"
              >
                <Image
                  style={{width:33, height:28}}
                  resizeMode='contain'
                  tintColor={focused ? '#353091' : '#767676'}
                  source={require("../../assets/phone-outgoing-03.png")}
                  accessible={false}
                  importantForAccessibility="no"
                />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="account"
          component={AccountStackScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (!isTabAccessibleDuringWalkthrough(4) && isScreenReaderEnabled) {
                return;
              }
              navigation.navigate('account', { screen: 'Account' });
            },
          })}
          options={{
            headerShown: false,
            tabBarLabel: 'Account',
            tabBarIcon: ({ focused }) => getTabBarIconWrapper(
              AccountIcon,
              focused,
              4
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    textAlign: "center",
  },
  shadowTabs: {
    backgroundColor: 'black',
    height: (Platform.OS === 'ios') ? 90 : 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    opacity: 0.7,
    left: 80,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowTabsStep2: {
    left: tabWidth * 1.99,
  },
  shadowTabsStep32: {
    left: tabWidth * 3.0,
  },
  shadowTabsStep3: {
    left: tabWidth * 4.0,
  },
  shadowTabsStep4: {
    left: tabWidth * 5,
  },
  shadowTabsLeft: {},
  shadowTabsStep2Left: {
    width: tabWidth * 0.88,
    left: 0,
  },
  shadowTabsStep3Left: {
    width: tabWidth * 2.99,
    left: 0,
  },
  shadowTabsStep31Left: {
    width: tabWidth * 2.00,
    left: 0,
  },
  shadowTabsStep4Left: {
    width: tabWidth * 4.1,
    left: 0,
  },
  disabledTab: {
    pointerEvents: 'none'
  }
});

export default MyTabs;