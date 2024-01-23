// SupportStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ShopScreen from '../../components/home/ShopScreen';
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";

const ShopStack = createStackNavigator();

function ShopStackScreen() {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <ShopStack.Navigator>
            
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
