// Support.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import BillingScreen from "../../components/billing/BillingScreen";
import AutoPayPCIConnector from "../../components/utility/AutoPayPCIConnector";

const BillingStack = createNativeStackNavigator();

function BillingStackScreen({route}) {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <BillingStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
            <BillingStack.Screen
                name="Billing"
                initialParams={{ isWeb:route?.params?.isWeb }}
                component={BillingScreen}
                options={{
                    headerBackVisible: false,
                    headerShown: false,
                }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true),
                }}
            />

      <BillingStack.Screen
        name="ArticalWindowUtility"
        component={ArticalWindowUtility}
        options={{ headerBackVisible: false, headerShown: false, }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

     <BillingStack.Screen
        name="AutoPayPCIConnector"
        component={AutoPayPCIConnector}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />


            
        </BillingStack.Navigator>
    );
}

export default BillingStackScreen;
