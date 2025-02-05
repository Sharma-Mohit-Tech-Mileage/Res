import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from '../../components/account/AccountOverview';
import ProfileSettings from '../../components/userProfile/ProfileSettings';
import ProfileSettingsEdit from '../../components/userProfile/ProfileSettingsEdit';
import ChangePassword from '../../components/userProfile/ChangePassword';
import PasswordSecurity from '../../components/userProfile/PasswordSecurity';
import PasswordSecurityEdit from '../../components/userProfile/PasswordSecurityEdit';

// Import normal notification components
import Notifications from '../../components/notifiction/Notifications';
import EmailNotifications from '../../components/notifiction/EmailNotifications';
import AddEmailNotification from '../../components/notifiction/AddEmailNotification';
import InAppNotifications from '../../components/notifiction/InAppNotifications';
import TextNotifications from '../../components/notifiction/TextNotifications';

// Import ACP notification components
import Notifications_acp from '../../components/notifiction/Notifications_acp/Notifications';
import EmailNotifications_acp from '../../components/notifiction/Notifications_acp/EmailNotification';

import UserManagement from '../../components/userManagement/UserManagement';
import UserManagementEdit from '../../components/userManagement/UserManagementEdit';
import Feedback from '../../components/support/Feedback';
import ThumbsUp from '../../components/support/ThumbsUp';
import ArticalWindowUtility from '../../components/utility/ArticalWindowUtility';
import { useTabBarVisibility } from '../TabBarVisibilityContext';
import supportScreen from "../../components/support/supportScreen";

// Import your user info helper function (adjust the path as needed)
import { getUser } from '../../redux/utils/LocalStorage';

/**
 * A wrapper component for the "Notifications" route.
 * It checks the user type and conditionally renders either the ACP or the normal Notifications component.
 */
const NotificationsSwitch = (props) => {
  // Initially null so that we know when the user info has been loaded.
  const [isAcpUser, setIsAcpUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = await getUser();
        // If a user exists and user.isNormalUser is false, then it's an ACP user.
        setIsAcpUser(user && !user.isNormalUser);
      } catch (error) {
        console.error("Error fetching user type:", error);
        setIsAcpUser(false); // fallback to normal user if error occurs
      }
    };
    fetchUserType();
  }, []);

  // Until we have loaded the user information, render nothing (or a loader)
  if (isAcpUser === null) return null;

  // If ACP user, render the ACP Notifications component; otherwise, render the normal component.
  return isAcpUser ? <Notifications_acp {...props} /> : <Notifications {...props} />;
};

/**
 * A wrapper component for the "EmailNotifications" route.
 * It checks the user type and conditionally renders either the ACP or the normal EmailNotifications component.
 */
const EmailNotificationsSwitch = (props) => {
  const [isAcpUser, setIsAcpUser] = React.useState(null);

  React.useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = await getUser();
        setIsAcpUser(user && !user.isNormalUser);
      } catch (error) {
        console.error("Error fetching user type:", error);
        setIsAcpUser(false);
      }
    };
    fetchUserType();
  }, []);

  if (isAcpUser === null) return null;

  // If ACP user, render the ACP EmailNotifications component; otherwise, the normal one.
  return isAcpUser ? <EmailNotifications_acp {...props} /> : <EmailNotifications {...props} />;
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
        name="TextNotifications"
        component={TextNotifications}
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
        name="UserManagement"
        component={UserManagement}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setTabBarVisible(true),
          blur: () => setTabBarVisible(true),
        }}
      />
      <AccountStack.Screen
        name="UserManagementEdit"
        component={UserManagementEdit}
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
    </AccountStack.Navigator>
  );
}

export default AccountStackScreen;