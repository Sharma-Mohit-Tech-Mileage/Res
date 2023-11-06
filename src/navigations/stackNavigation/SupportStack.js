// SupportStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import supportScreen from '../../components/support/supportScreen';

import ArticleModal from '../../components/support/ArticleModal';

const SupportStack = createStackNavigator();

function SupportStackScreen() {
    return (
        <SupportStack.Navigator initialRouteName="supportScreen">
            <SupportStack.Screen
                name="supportTeam"
                component={supportScreen}
                options={{ headerShown: false }}
            />
            <SupportStack.Screen
                name="Support Article"
                component={ArticleModal}
                options={{
                    presentation: 'modal'}}
            />
        </SupportStack.Navigator>
    );
}

export default SupportStackScreen;
