import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountStackScreen from '../navigations/stackNavigation/AccountStack';
import ShopScreen from '../components/home/Shop';
import SupportScreen from '../components/home/Support';
import HomeScreen from '../components/home/Home';
import SupportStack from '../navigations/stackNavigation/SupportStack';
import HomeIconSelected from '../res/svgIcons/HomeIconSelected';
import HomeIcon from '../res/svgIcons/HomeIcon';
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
        tabBarStyle: {position: 'absolute',height:(Platform.OS=='ios')? 90:60 },
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
          tabBarIcon: ({ focused }) => focused ? <HomeIconSelected /> : <HomeIcon />
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={({ navigation }) => ({
          // headerShown: false,
          presentation: 'modal',
          tabBarIcon: ({ focused }) => (focused ? <ShopIconSelected /> : <ShopIcon />),
          headerTitle: "Shop",
          headerTitleAlign: 'center', // This centers the title
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
              {/* Assuming you have an icon component for the close button */}
              <Text >Close</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Support"
        component={SupportStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Support',
          tabBarIcon: ({ focused, size }) => (
           (focused)?<SupportIconSelected/>: <SupportIcon  />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStackScreen}
        options={{
          headerShown: false,
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