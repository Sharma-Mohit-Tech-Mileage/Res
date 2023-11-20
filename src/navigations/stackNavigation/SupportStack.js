// SupportStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import supportScreen from '../../components/support/supportScreen';
import Search from '../../components/support/Search';
import CreateTicket from '../../components/support/CreateTicket';
import Feedback from '../../components/support/Feedback';
import ThumbsUp from '../../components/support/ThumbsUp';
import TicketSupport from '../../components/support/TicketSupport';
import TicketView from '../../components/support/TicketView';
import { useTabBarVisibility } from '../TabBarVisibilityContext';

const SupportStack = createStackNavigator();

function SupportStackScreen() {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <SupportStack.Navigator initialRouteName="ThumbsUp">
            <SupportStack.Screen
                name="support"
                component={supportScreen}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="searchArticals"
                component={Search}
                options={{ headerShown: false, presentation: 'modal' }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="CreateTicket"
                component={CreateTicket}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="TicketView"
                component={TicketView}
                options={{ headerShown: false,  }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="TicketSupport"
                component={TicketSupport}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="Feedback"
                component={Feedback}
                options={{ headerShown: false, presentation: 'modal' }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <SupportStack.Screen
                name="ThumbsUp"
                component={ThumbsUp}
                options={{ headerShown: false, presentation: 'modal' }}
                listeners={{
                    focus: () => setTabBarVisible(false),
                    blur: () => setTabBarVisible(true)
                }}
            />
        </SupportStack.Navigator>
    );
}

export default SupportStackScreen;
