// HomeStack.js

import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../components/home/Home';
import OklaSpeedTest from '../../components/home/OklaSpeedTest';


const HomeStack = createStackNavigator();

function HomeStackScreen() {
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
            
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;
