// Support.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import { useTabBarVisibility } from "../TabBarVisibilityContext";
import BillingScreen from "../../components/billing/BillingScreen";
import BillingStatements from "../../components/billing/BillingStatements";
import AutoPayPCIConnector from "../../components/utility/AutoPayPCIConnector";
import PaymentHistoryScreen from "../../components/billing/PaymentHistory";
import BillingBreakDownScreen from "../../components/billing/BillingBreakDownScreen";
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
                name="BillingStatements"
                component={BillingStatements}
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
                name="PaymentHistory"
                component={PaymentHistoryScreen}
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
                name="BillingBreakDown"
                component={BillingBreakDownScreen}
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
