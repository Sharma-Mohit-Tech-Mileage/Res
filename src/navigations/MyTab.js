import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountScreen from '../components/home/Account';
import ShopScreen from '../components/home/Shop';
import SupportScreen from '../components/home/Support';
import HomeScreen from '../components/home/Home';
import HomeIconSelected from '../res/svgIcons/HomeIconSelected';
import HomeIcone from '../res/svgIcons/HomeIcon';
import ShopIcon from '../res/svgIcons/ShopIcon';
import ShopIconSelected from '../res/svgIcons/ShopIconSelected';
import SupportIcon from '../res/svgIcons/SupportIcon';
import AccountIcon from '../res/svgIcons/AccountIcone';
import SupportIconSelected from '../res/svgIcons/SupportIconSelected';

const Tab = createBottomTabNavigator();

const MyTabs=({route,navigation})=> {
  return (
    <Tab.Navigator
      name='MyTab'
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { position: 'absolute',height:90 },
        tabBarActiveTintColor: '#353091',
        tabBarInactiveTintColor:'#767676'
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{data:route}}
        options={{
          headerShown:false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, size }) => (
           (focused)? <HomeIconSelected />:<HomeIcone/>
          ),
        }}
      />
      <Tab.Screen
        name="Shope"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ focused, size }) => (
            focused?<ShopIconSelected/>:<ShopIcon/>
          ),
          
        }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarLabel: 'Support',
          tabBarIcon: ({ focused, size }) => (
           (focused)?<SupportIconSelected/>: <SupportIcon  />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, size }) => (
            <AccountIcon focused={focused} data={route} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;