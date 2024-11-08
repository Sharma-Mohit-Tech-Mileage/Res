import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
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
import ArticalWindowUtility from "../components/utility/ArticalWindowUtility";


const { width } = Dimensions.get('window');
const tabWidth = Number(width / 4);
const Tab = createBottomTabNavigator();

const MyTabs = ({ route }) => {
  const dispatch = useDispatch();
  const [shadowStyleLeft, setShadowStyleLeft] = useState(styles.shadowTabsLeft);
  const [shadowStyle, setShadowStyle] = useState(styles.shadowTabs);
  const { tabBarVisible } = useTabBarVisibility();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  console.log('Profile details...........................................................................................................', JSON.stringify(profileDetails));

  useEffect(() => {
    // Fetch user profile details once when the component is initialized
    dispatch(fetchProfileDetails());
  }, [dispatch]);

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
      }else if (home.walkThroughStep === 3) {
        setShadowStyle([styles.shadowTabs, styles.shadowTabsStep4]);
        setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep4Left]);
      }
    }
  }, [home]);

  return (
    <>
      {user?.isNormalUser && home.walkThroughStep !== null && home.walkThroughStep !== undefined &&
        (
          <>
            <View style={shadowStyleLeft}></View>
            <View style={shadowStyle}></View>
          </>
        )
      }
      <Tab.Navigator
        name='MyTab'
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: { paddingVertical: 5, position: 'absolute', height: (Platform.OS == 'ios') ? 90 : 60, display: tabBarVisible ? 'flex' : 'none', },
          tabBarActiveTintColor: '#353091',
          tabBarInactiveTintColor: '#767676',
          tabBarLabelStyle: { fontSize: 12, fontFamily: FontFamily.openSansRegular, fontWeight: '600' },
        }}
      >
        {/* Tab Screens */}
        {/* Home Screen */}
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          initialParams={{ data: route ,isNormalUser: user?.isNormalUser }}
          options={{
            headerShown: false,
            swipeEnabled: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                {focused ? <HomeIconSelected /> : <HomeIcon />}
              </View>
            ),
          }}
        />
        
        {/* Billing Screen */}
         <Tab.Screen
          name="BillingTab"
          component={BillingStackScreen }
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
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
               <BillingIcon isSelected={focused} />
              </View>
            ),
          }}
        />
        {/* Billing Screen */}

        {/* Shop Screen */}
        <Tab.Screen
          name="Shop"
          component={ShopStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (user?.isNormalUser) {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Shop',
                      state: {
                        routes: [
                          {
                            name: 'ArticalWindowUtility',
                            params: {
                              url: `${Env.URL}/services/upgrade`,
                              name: 'Shop',
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
            tabBarLabel: 'Shop',
            headerShown: false,
            tabBarIcon: ({ focused }) => (focused ? <ShopIconSelected isNewBillerUser={!user?.isNormalUser} /> : <ShopIcon isNewBillerUser={!user?.isNormalUser} />)
          }}
        />
        {/* Support Screen */}
        <Tab.Screen
          name="Support"
          component={SupportStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              if (user?.isNormalUser) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Support' }],
                });
              }
            },
          })}
          options={{
            headerShown: false,
            tabBarLabel: 'Support',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                {focused ? <SupportIconSelected /> : <SupportIcon isNewBillerUser={!user?.isNormalUser} />}
              </View>
            ),
          }}
        />
        {/* Account Screen */}
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
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <AccountIcon focused={focused} />
              </View>
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
  shadowTabsStep2: {
    left: tabWidth * 3.2,
  },
  shadowTabsStep3: {
    left: tabWidth * 4,
  },
  shadowTabsStep4: {
    left: tabWidth * 5,
  },
  shadowTabsLeft: {},
  shadowTabsStep2Left: {
    width: tabWidth * 2.3,
    left: 0,
  },
  shadowTabsStep3Left: {
    width: tabWidth * 3.1,
    left: 0,
  },shadowTabsStep4Left: {
    width: tabWidth * 3.1,
    left: 0,
  },
});

export default MyTabs;