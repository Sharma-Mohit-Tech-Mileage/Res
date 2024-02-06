import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TroubleshootContainer from '../../components/support/Troubleshooting/TroubleshootContainer';
import AccountOutages from '../../components/support/Troubleshooting/AccountOutages';
import ModemConnectivityGuide from '../../components/support/Troubleshooting/ModemConnectivityGuide';
import ModemHealthy from '../../components/support/Troubleshooting/ModemHealthy';
import OutagesAlert from '../../components/support/Troubleshooting/OutagesAlert';
import PeriodicProblems from '../../components/support/Troubleshooting/PeriodicProblems';

const TroubleStack = createStackNavigator();

function TroubleShootStack() {
    return (
        <TroubleStack.Navigator initialRouteName="TroubleshootOverview"
            screenOptions={{
                gestureEnabled: true,
                headerBackVisible: false,
                headerShown: false,
            }}
        >
            <TroubleStack.Screen
                name="TroubleshootOverview"
                component={TroubleshootContainer}
            />

            <TroubleStack.Screen
                name="AccountOutages"
                component={AccountOutages}
            />
            <TroubleStack.Screen
                name="ModemConnectivityGuide"
                component={ModemConnectivityGuide}
            />
            <TroubleStack.Screen
                name="ModemHealthy"
                component={ModemHealthy}
            />
            <TroubleStack.Screen
                name="OutagesAlert"
                component={OutagesAlert}
            />
            <TroubleStack.Screen
                name="PeriodicProblems"
                component={PeriodicProblems}
            />

        </TroubleStack.Navigator>
    );
}

export default TroubleShootStack;
