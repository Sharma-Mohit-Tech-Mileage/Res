import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from '../../components/account/AccountOverview';
import ProfileSettings from '../../components/userProfile/ProfileSettings';
import ProfileSettingsEdit from '../../components/userProfile/ProfileSettingsEdit';
import ChangePassword from '../../components/userProfile/ChangePassword';
import PasswordSecurity from '../../components/userProfile/PasswordSecurity';
import PasswordSecurityEdit from '../../components/userProfile/PasswordSecurityEdit';

// Import normal notification components
import Notifications from '../../components/notifiction/Notifications_acp/Notifications';
import AddEmailNotification from '../../components/notifiction/Notifications_acp/EmailNotification';
import EmailNotifications_acp from '../../components/notifiction/Notifications_acp/EmailNotification';
import InAppNotifications from '../../components/notifiction/Notifications_acp/InAppNotifications';

import Feedback from '../../components/support/Feedback';
import ThumbsUp from '../../components/support/ThumbsUp';
import ArticalWindowUtility from '../../components/utility/ArticalWindowUtility';
import { useTabBarVisibility } from '../TabBarVisibilityContext';
import supportScreen from "../../components/support/supportScreen";
import Survey from '../../components/cancelservice/Survey';
import CancellationSummary from '../../components/cancelservice/CancellationSummary';

/**
 * A wrapper component for the "Notifications" route.
 * It checks the user type and conditionally renders either the ACP or the normal Notifications component.
 */
const NotificationsSwitch = (props) => {
  return <Notifications {...props} />
};

/**
 * A wrapper component for the "EmailNotifications" route.
 * It checks the user type and conditionally renders either the ACP or the normal EmailNotifications component.
 */
const EmailNotificationsSwitch = (props) => {
  return  <EmailNotifications_acp {...props} /> 
};

const AccountStack = createNativeStackNavigator();

function AccountStackScreen() {
  const { setTabBarVisible } = useTabBarVisibility();
  return (
    <AccountStack.Navigator
      initialRouteName="Account"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
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
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="ProfileSettingsEdit"
        component={ProfileSettingsEdit}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="PasswordSecurity"
        component={PasswordSecurity}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="PasswordSecurityEdit"
        component={PasswordSecurityEdit}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="PasswordEdit"
        component={ChangePassword}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

      {/** 
       * Here we use the switch components in place of the static assignments.
       * Based on the user type (fetched from local storage),
       * the Notifications route renders either the ACP or the normal Notifications component,
       * and the EmailNotifications route renders the ACP or normal EmailNotifications accordingly.
       **/}
      <AccountStack.Screen
        name="Notifications"
        component={NotificationsSwitch}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="EmailNotifications"
        component={EmailNotificationsSwitch}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
      <AccountStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      
      <AccountStack.Screen
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
      <AccountStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="ThumbsUp"
        component={ThumbsUp}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="AddEmailNotification"
        component={AddEmailNotification}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

      <AccountStack.Screen
        name="cancelServiceSurvey"
        component={Survey}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

      <AccountStack.Screen
        name="cancelServiceSummary"
        component={CancellationSummary}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />

    </AccountStack.Navigator>
  );
}

export default AccountStackScreen;