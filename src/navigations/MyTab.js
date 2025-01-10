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
import ShopIcon from '../res/svgIcons/ShopIcon';
import ShopIconSelected from '../res/svgIcons/ShopIconSelected';
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
  const { tabBarVisible } = useTabBarVisibility();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};

  useEffect(() => {
    dispatch(fetchProfileDetails());
  }, [dispatch]);

  // Helper function to determine if a tab should be accessible during walkthrough
  const isTabAccessibleDuringWalkthrough = (tabIndex) => {
    if (!user?.isNormalUser || home.walkThroughStep === null || home.walkThroughStep === undefined) {
      return true;
    }
    return home.walkThroughStep === tabIndex;
  };

  function CustomTabBarButton({ onPress, isDisabled, focused, children, tabIndex }) {
    const handlePress = () => {
      if (isDisabled) {
        Alert.alert('Coming Soon', 'We are still working on it.');
      } else {
        onPress();
      }
    };
    
    const isAccessible = isTabAccessibleDuringWalkthrough(tabIndex);
  
    return (
      <Pressable 
        onPress={handlePress} 
        style={[
          styles.tabButton,
          !isAccessible && { pointerEvents: 'none' }
        ]}
        accessible={isAccessible}
        accessibilityElementsHidden={!isAccessible}
        importantForAccessibility={isAccessible ? 'yes' : 'no-hide-descendants'}
        accessibilityRole="tab"
        accessibilityState={{ 
          disabled: isDisabled || !isAccessible,
          selected: focused 
        }}
      >
        {focused ? <SupportIconSelected/> : <SupportIcon isNewBillerUser={!user?.isNormalUser}/>}
        {children}
      </Pressable>
    );
  }

  useEffect(() => {
    if (user?.isNormalUser) {
      if (home.walkThroughStep === 0) {          
        setShadowStyle(styles.shadowTabs);
        setShadowStyleLeft(styles.shadowTabsLeft);
      } else if (home.walkThroughStep === 1) {
        setShadowStyle([styles.shadowTabs, styles.shadowTabsStep2]);
        setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep2Left]);
      } else if (home.walkThroughStep === 2) {
        setShadowStyle([styles.shadowTabs, styles.shadowTabsStep3]);
        setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep3Left]);
      } else if (home.walkThroughStep === 3) {
        setShadowStyle([styles.shadowTabs, styles.shadowTabsStep4]);
        setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep4Left]);
      }
    }
  }, [home]);

  const getTabBarIconWrapper = (IconComponent, focused, tabIndex) => {
    const isAccessible = isTabAccessibleDuringWalkthrough(tabIndex);
    return (
      <View 
        style={[
          styles.tabItem,
          // Add pointerEvents none to completely disable interaction when not accessible
          !isAccessible && { pointerEvents: 'none' }
        ]}
        accessible={isAccessible}
        accessibilityElementsHidden={!isAccessible}
        importantForAccessibility={isAccessible ? 'yes' : 'no-hide-descendants'}
        accessibilityRole="tab"
        accessibilityState={{ 
          selected: focused,
          disabled: !isAccessible 
        }}
      >
        <IconComponent isSelected={focused} />
      </View>
    );
  };

  return (
    <>
      {user?.isNormalUser && home.walkThroughStep !== null && home.walkThroughStep !== undefined && (
        <>
          <View style={shadowStyleLeft}></View>
          <View style={shadowStyle}></View>
        </>
      )}
      <Tab.Navigator
        name='MyTab'
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarStyle: { 
            paddingVertical: 5, 
            position: 'absolute', 
            height: (Platform.OS == 'ios') ? 90 : 60, 
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
                  !isAccessible && { pointerEvents: 'none' }
                ]}
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
            tabBarAccessibilityLabel: isTabAccessibleDuringWalkthrough(0) ? 'Home tab' : undefined,
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
            tabBarAccessibilityLabel: isTabAccessibleDuringWalkthrough(1) ? 'Billing tab' : undefined,
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
              if (user?.isNormalUser) {
                navigation.navigate('MyServices')
              }
            },
          })}
          options={{
            tabBarLabel: 'Service',
            headerShown: false,
            tabBarIcon: (props) => (
              <CustomTabBarButton 
                {...props} 
                isDisabled={!user?.isNormalUser} 
                focused={props.focused} 
                tabIndex={2}
                onPress={() => navigation.navigate('MyServices')} 
              />
            ),
          }}
        />

        <Tab.Screen
          name="Support"
          component={SupportStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
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
                style={styles.tabItem}
                accessible={isTabAccessibleDuringWalkthrough(3)}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
              >
                <Image
                  style={{width:33, height:28}}
                  resizeMode='contain'
                  tintColor={focused ? '#353091' : '#767676'}
                  source={require("../../assets/phone-outgoing-03.png")}
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
    height: (Platform.OS == 'ios') ? 90 : 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    opacity: .7,
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
  shadowTabsStep4Left: {
    width: tabWidth * 4.1,
    left: 0,
  },
});

export default MyTabs;