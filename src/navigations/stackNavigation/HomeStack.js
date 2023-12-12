// HomeStack.js

import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../components/home/Home';
import OklaSpeedTest from '../../components/home/OklaSpeedTest';
import ArticalWindowUtility from '../../components/utility/ArticalWindowUtility';
import { useTabBarVisibility } from '../TabBarVisibilityContext';

const HomeStack = createStackNavigator();

function HomeStackScreen() {

    const { setTabBarVisible } = useTabBarVisibility();
    
    return (
        <HomeStack.Navigator initialRouteName="Dashboard">
            <HomeStack.Screen
                name="Dashboard"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen
                name="OklaSpeedTest"
                component={OklaSpeedTest}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen
                name="ArticalWindowUtility"
                component={ArticalWindowUtility}
                options={{
                    headerBackVisible: false,
                    headerShown: false
                }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;
