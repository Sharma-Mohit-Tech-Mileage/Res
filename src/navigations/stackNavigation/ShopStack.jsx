// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from '../../components/home/ShopScreen';
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";

const ShopStack = createNativeStackNavigator();

function ShopStackScreen() {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <ShopStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
            
            <ShopStack.Screen
                name="ArticalWindowUtility"
                component={ArticalWindowUtility}
                options={{
                    headerBackVisible: false,
                    headerShown: false,
                }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true),
                }}
            />
            <ShopStack.Screen
                name="shopHome"
                component={ShopScreen}
                options={{
                    headerBackVisible: false,
                    headerShown: false,
                }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true),
                }}
            />
            
        </ShopStack.Navigator>
    );
}

export default ShopStackScreen;
