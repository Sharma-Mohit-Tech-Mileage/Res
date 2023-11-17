import { TouchableOpacity, Text, StyleSheet, StatusBar,View } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation, title }) => {
  return (
    <View>
    <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
    <LinearGradient
      style={styles.header}
      locations={[0, 1]}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      useAngle={true}
      angle={90}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text>Close</Text>
      </TouchableOpacity>
    </LinearGradient>
    </View>
  );
};

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
          presentation: 'modal',
          tabBarIcon: ({ focused }) => (focused ? <ShopIconSelected /> : <ShopIcon />),
          header: () => <CustomHeader navigation={navigation} title="Shop" />,
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
const styles = StyleSheet.create({
  header: {
    height: 100, // Adjust as needed
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'white', // Adjust as needed
    // Other styling for the title
  },
  closeButton: {
    marginRight: 10,
    // Other styling for the close button
  },
});
export default MyTabs;