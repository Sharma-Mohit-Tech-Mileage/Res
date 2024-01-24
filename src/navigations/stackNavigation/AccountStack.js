import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../../components/account/AccountOverview';
import ProfileSettings from '../../components/userProfile/ProfileSettings';
import ProfileSettingsEdit from '../../components/userProfile/ProfileSettingsEdit';
import PasswordSecurity from '../../components/userProfile/PasswordSecurity';
import PasswordSecurityEdit from '../../components/userProfile/PasswordSecurityEdit';
import Notifications from '../../components/notifiction/Notifications';
import EmailNotifications from '../../components/notifiction/EmailNotifications'
import InAppNotifications from '../../components/notifiction/InAppNotifications'
import TextNotifications from '../../components/notifiction/TextNotifications'
import UserManagement from '../../components/userManagement/UserManagement';
import UserManagementEdit from '../../components/userManagement/UserManagementEdit';
import Feedback from '../../components/support/Feedback';
import ThumbsUp from '../../components/support/ThumbsUp';
import ArticalWindowUtility from '../../components/utility/ArticalWindowUtility';
import { useTabBarVisibility } from '../TabBarVisibilityContext';
import supportScreen from "../../components/support/supportScreen";
const AccountStack = createStackNavigator();
function AccountStackScreen() {
    const { setTabBarVisible } = useTabBarVisibility();
    return (
        <AccountStack.Navigator initialRouteName="Account" defaultNavigationOptions={{ gestureEnabled: true }}>
            <AccountStack.Screen
                name="Account"
                component={AccountScreen}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="support"
                component={supportScreen}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true),
                }}
            />
            <AccountStack.Screen
                name="ProfileSettings"
                component={ProfileSettings}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="ProfileSettingsEdit"
                component={ProfileSettingsEdit}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="PasswordSecurity"
                component={PasswordSecurity}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="PasswordSecurityEdit"
                component={PasswordSecurityEdit}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
             <AccountStack.Screen
                name="Notifications"
                component={Notifications}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="EmailNotifications"
                component={EmailNotifications}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="TextNotifications"
                component={TextNotifications}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="InAppNotifications"
                component={InAppNotifications}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="UserManagement"
                component={UserManagement}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="UserManagementEdit"
                component={UserManagementEdit}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            {/* Add other account-related screens here, if any */}
            <AccountStack.Screen
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
            <AccountStack.Screen
                name="Feedback"
                component={Feedback}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
            <AccountStack.Screen
                name="ThumbsUp"
                component={ThumbsUp}
                options={{ headerShown: false }}
                listeners={{
                    focus: () => setTabBarVisible(true),
                    blur: () => setTabBarVisible(true)
                }}
            />
        </AccountStack.Navigator>
    );
}

export default AccountStackScreen;
