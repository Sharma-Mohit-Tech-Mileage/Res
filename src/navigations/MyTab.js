import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTabBarVisibility } from './TabBarVisibilityContext';
import AccountStackScreen from '../navigations/stackNavigation/AccountStack';
import HomeStackScreen from './stackNavigation/HomeStack';
import ShopScreen from '../components/home/Shop';
import HomeScreen from '../components/home/Home';
import SupportStack from '../navigations/stackNavigation/SupportStack';
import HomeIconSelected from '../res/svgIcons/HomeIconSelected';
import HomeIcon from '../res/svgIcons/HomeIcon';
import ShopIcon from '../res/svgIcons/ShopIcon';
import ShopIconSelected from '../res/svgIcons/ShopIconSelected';
import SupportIcon from '../res/svgIcons/SupportIcon';
import AccountIcon from '../res/svgIcons/AccountIcone';
import SupportIconSelected from '../res/svgIcons/SupportIconSelected';
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";
import React, { useEffect, useState } from "react";
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
    // Alert.alert(('hello'));
    // setTimeout(() => {
    // start();
    //   Alert.alert(('timeout'));
    // }, 10000);
  }, []);

  return (
    <Tab.Navigator
      name='MyTab'
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { paddingVertical: 5,position: 'absolute', height: (Platform.OS == 'ios') ? 90 : 60, display: tabBarVisible ? 'flex' : 'none',  },
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
        component={ShopScreen} // This will not be used, since we will override the onPress
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('ArticalWindowUtility', { url: 'https://customer.uat.sparklight.com/residential/services/upgrade', name :'Shop'});
          },
        })}
        options={{
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