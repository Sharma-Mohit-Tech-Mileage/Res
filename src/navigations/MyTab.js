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
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";
import React, { useEffect, useState } from "react";
import { BackHandler } from 'react-native';
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from 'react-redux';
import { FontFamily } from '../../GlobalStyles';

const Tab = createBottomTabNavigator();

const WalkthroughableView = walkthroughable(View);

const MyTabs = ({ route, navigation }) => {
  const { start, copilotEvents } = useCopilot();
  const [secondStepActive, setSecondStepActive] = useState(true);
  const [lastEvent, setLastEvent] = useState(null);
  const { tabBarVisible } = useTabBarVisibility();
  const user = useSelector(state => state.combinedReducers.user.userData);

  useEffect(() => {
    copilotEvents.on("stepChange", (step) => {
      setLastEvent(`stepChange: ${step.name}`);
    });
    copilotEvents.on("start", () => {
      setLastEvent(`start`);
    });
    copilotEvents.on("stop", () => {
      setLastEvent(`stop`);
    });
  }, [copilotEvents]); 

  useEffect(() => {
    const backAction = () => {
      // Check if there's a screen to go back to in the navigation stack
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevents the default back action, navigates back
      }
      // If no previous screen is available, do nothing and let the default action proceed
      return false; // Allows the default back action to proceed
    };

    // Add the back button listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the listener on component unmount
    return () => backHandler.remove();
  }, [navigation]);





  return (
    <Tab.Navigator
      name='MyTab'
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { paddingVertical: 5, position: 'absolute', height: (Platform.OS == 'ios') ? 90 : 60, display: tabBarVisible ? 'flex' : 'none',  },
        tabBarActiveTintColor: '#353091',
        tabBarInactiveTintColor: '#767676',
        tabBarLabelStyle:{fontSize:12,fontFamily:FontFamily.openSansRegular,fontWeight:'600'},

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        initialParams={{ data: route }}
        options={{
          headerShown: false,
          swipeEnabled: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => {
            return (
              <CopilotStep
                text="View information related to your internet health, billing, service and more."
                order={1}
                name="first"
              >
                <WalkthroughableView style={styles.tabItem}>
                  {focused ? <HomeIconSelected /> : <HomeIcon />}
                </WalkthroughableView>
              </CopilotStep>   
            );
          }
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopStack} // This will not be used, since we will override the onPress
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            // Reset the stack and navigate to ArticalWindowUtility
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
                          url: 'https://customer.uat.sparklight.com/residential/services/upgrade',
                          name: 'Shop'
                        },
                      },
                    ],
                  },
                },
              ],
            });
          },
        })}

        options={{
          tabBarLabel: 'Shop',
          headerShown: false,
          tabBarIcon: ({ focused }) => (focused ? <ShopIconSelected /> : <ShopIcon />)
        }}
      />

      <Tab.Screen
        name="Support"
        component={SupportStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Support',
          tabBarIcon: ({ focused }) => {
            return (
              <CopilotStep
                text="View information related to your internet health, billing, service and more."
                order={2}
                name="second"
              >
                <WalkthroughableView style={styles.tabItem}>
                  {focused ? <SupportIconSelected /> : <SupportIcon />}
                </WalkthroughableView>
              </CopilotStep>   
            );
          }
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => {
            return (
              <CopilotStep
                text="Manage your profile settings, notifications, users and more."
                order={3}
                name="third"
              >
                <WalkthroughableView style={styles.tabItem}>
                  <AccountIcon focused={focused} data={user.userInfo} />
                </WalkthroughableView>
              </CopilotStep>   
            );
          }          
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    textAlign: "center",
  },
});

export default MyTabs;