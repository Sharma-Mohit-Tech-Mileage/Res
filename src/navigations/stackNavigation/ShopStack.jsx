// SupportStack.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from '../../components/home/ShopScreen';
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import MyServices from "../../components/services/MyServices";

const ShopStack = createNativeStackNavigator();

function ServiceStackScreen() {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <ShopStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
            
            <ShopStack.Screen
                name="MyServices"
                component={MyServices}
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

export default ServiceStackScreen;
