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
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackHandler } from 'react-native';
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from 'react-redux';
import { FontFamily } from '../../GlobalStyles';
import { Env } from '../network/apis/account/Constants';

const Tab = createBottomTabNavigator();

const MyTabs = ({ route, navigation }) => {
  const [secondStepActive, setSecondStepActive] = useState(true);
  const [lastEvent, setLastEvent] = useState(null);
  const [shadowStyleLeft, setShadowStyleLeft] = useState(styles.shadowTabsLeft);
  const [shadowStyle, setShadowStyle] = useState(styles.shadowTabs);
  const { tabBarVisible } = useTabBarVisibility();
  const navigation = useNavigation();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);

  useEffect(() => {
    const backAction = () => {
      // Log the current state of the entire navigation
      const currentRoute = navigation.getState();
      console.log("Current Navigation State:", currentRoute);

      // Check if there's a screen to go back to in the current tab's stack
      const currentTab = currentRoute.routes[currentRoute.index];
      console.log("Current Tab State:", currentTab.state);

      if (currentTab.state && currentTab.state.index > 0) {
        console.log("Going back within the current tab's stack");
       // navigation.goBack();
        return false;
      } else if (navigation.canGoBack()) {
        console.log("Going back in the outer stack");
       // navigation.goBack();
        return false;
      }

      console.log("No screen to go back to, default action proceeds");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the event listener when the component unmounts
    return () => {
      console.log("Removing back button listener");
      backHandler.remove();
    };
  }, [navigation]);


  useEffect(() => {
    console.log('MyTabHome: ', home);
    if (home.walkThroughStep === 0) {
      setShadowStyle(styles.shadowTabs);
      setShadowStyleLeft(styles.shadowTabsLeft);
    } else if (home.walkThroughStep === 1) {
      setShadowStyle([styles.shadowTabs, styles.shadowTabsStep2]);
      setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep2Left]);
    } else if (home.walkThroughStep === 2) {
      setShadowStyle([styles.shadowTabs, styles.shadowTabsStep3]);
      setShadowStyleLeft([styles.shadowTabs, styles.shadowTabsStep3Left]);
    }
  }, [home]);

  return (
    <>
    <View style={shadowStyleLeft}>
    </View>       
    <View style={shadowStyle}>
    </View>      
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
              <View style={styles.tabItem}>
                {focused ? <HomeIconSelected /> : <HomeIcon />}
              </View>
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
                          url: `${Env.URL}/residential/services/upgrade`,
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
              <View style={styles.tabItem}>
                {focused ? <SupportIconSelected /> : <SupportIcon />}
              </View>
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
              <View style={styles.tabItem}>
                <AccountIcon focused={focused} data={user.userInfo} />
              </View>
            );
          }          
        }}
      />
    </Tab.Navigator>    
    </>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    textAlign: "center",
  },
  shadowTabs: {
    backgroundColor: 'black',
    height: 90,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    bottom: 0,
    opacity: .7,
    left: 100
  },
  shadowTabsStep2: {
    left: 280,
  },
  shadowTabsStep3: {
    left: 380,
  },
  shadowTabsLeft: {

  },
  shadowTabsStep2Left: {
    width: 190,
    left: 0
  },
  shadowTabsStep3Left: {
    width: 280,
    left: 0
  },  
});

export default MyTabs;