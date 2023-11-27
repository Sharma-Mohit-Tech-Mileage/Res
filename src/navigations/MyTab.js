import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTabBarVisibility } from './TabBarVisibilityContext';
import AccountStackScreen from '../navigations/stackNavigation/AccountStack';
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
const Tab = createBottomTabNavigator();



const MyTabs = ({ route, navigation }) => {
  const { tabBarVisible } = useTabBarVisibility();
  return (
    <Tab.Navigator
      name='MyTab'
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { position: 'absolute', height: (Platform.OS == 'ios') ? 90 : 60, display: tabBarVisible ? 'flex' : 'none' },
        tabBarActiveTintColor: '#353091',
        tabBarInactiveTintColor: '#767676'

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ data: route }}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => focused ? <HomeIconSelected /> : <HomeIcon />
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen} // This will not be used, since we will override the onPress
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/115009159707-Data-Plans', title :'Shop'});
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
          tabBarIcon: ({ focused, size }) => (
            (focused) ? <SupportIconSelected /> : <SupportIcon />
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