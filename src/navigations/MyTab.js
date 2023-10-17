import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountScreen from '../components/home/Account';
import ShopScreen from '../components/home/Shop';
import SupportScreen from '../components/home/Support';
import HomeScreen from '../components/home/Home';
const Tab = createBottomTabNavigator();

const MyTabs=()=> {
  return (
    <Tab.Navigator
      name='MyTab'
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        
        options={{
          tabBarLabel: 'Home',
          //tabBarIcon: ({ color, size }) => (
            //<MaterialCommunityIcons name="home" color={color} size={size} />
          //),
        }}
      />
      <Tab.Screen
        name="Shope"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
        //   tabBarIcon: ({ color, size }) => (
        //     <MaterialCommunityIcons name="bell" color={color} size={size} />
        //   ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarLabel: 'Support',
        //   tabBarIcon: ({ color, size }) => (
        //     <MaterialCommunityIcons name="account" color={color} size={size} />
        //   ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
        //   tabBarIcon: ({ color, size }) => (
        //     <MaterialCommunityIcons name="account" color={color} size={size} />
        //   ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;