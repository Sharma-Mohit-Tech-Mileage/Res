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
import { View, StyleSheet, Dimensions} from "react-native";
import { useSelector } from 'react-redux';
import { FontFamily } from '../../GlobalStyles';
import { Env } from '../network/apis/account/Constants';
const { width } = Dimensions.get('window');
const tabWidth = Number(width/4);

const Tab = createBottomTabNavigator();

const MyTabs = ({ route, navigation }) => {
  const [shadowStyleLeft, setShadowStyleLeft] = useState(styles.shadowTabsLeft);
  const [shadowStyle, setShadowStyle] = useState(styles.shadowTabs);
  const { tabBarVisible } = useTabBarVisibility();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);

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
    { home.walkThroughStep !== null && home.walkThroughStep !== undefined &&
      (
        <>
          <View style={shadowStyleLeft}>
          </View>       
          <View style={shadowStyle}>
          </View>     
        </>
      )
    } 
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
        component={ShopStack} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
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
                          isExpandable:true
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Support',
                  //params: { triggerEvent: true }
                },
              ],
            });
          },
        })}
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
        {/* <Tab.Screen
          name="Support"
          component={SupportStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Support',
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                {focused ? <SupportIconSelected /> : <SupportIcon />}
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              if (route.params?.triggerEvent) {
                e.preventDefault();
                navigation.navigate('Support', {
                  screen: 'support',
                  params: { triggerEvent: true },
                });
              }
            },
          })}
        /> */}

      <Tab.Screen
        name="account"
        component={AccountStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.tabItem}>
                <AccountIcon focused={focused} data={user?.userInfo} />
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
    height: (Platform.OS == 'ios') ? 90 : 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    bottom: 0,
    opacity: .7,
    left: 100
  },
  shadowTabsStep2: {
    left: tabWidth * 3,
  },
  shadowTabsStep3: {
    left: tabWidth * 4,
  },
  shadowTabsLeft: {

  },
  shadowTabsStep2Left: {
    width: tabWidth * 2,
    left: 0
  },
  shadowTabsStep3Left: {
    width: tabWidth * 3,
    left: 0
  },  
});

export default MyTabs;