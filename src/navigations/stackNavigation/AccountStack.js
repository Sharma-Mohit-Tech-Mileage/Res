import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../../components/account/AccountOverview";
import ProfileSettings from "../../components/userProfile/ProfileSettings";
import ProfileSettingsEdit from "../../components/userProfile/ProfileSettingsEdit";
import ChangePassword from "../../components/userProfile/ChangePassword";
import PasswordSecurity from "../../components/userProfile/PasswordSecurity";
import PasswordSecurityEdit from "../../components/userProfile/PasswordSecurityEdit";
import Notifications from "../../components/notifiction/Notifications";
import AddEmailNotification from "../../components/notifiction/EmailNotification";
import EmailNotifications_acp from "../../components/notifiction/EmailNotification";
import InAppNotifications from "../../components/notifiction/InAppNotifications";
import TextNotifications from "../../components/notifiction/TextNotifications";
import Feedback from "../../components/Feedback/Feedback";
import ThumbsUp from "../../components/Feedback/ThumbsUp";
import ArticalWindowUtility from "../../components/utility/ArticalWindowUtility";
import supportScreen from "../../components/support/supportScreen";
import Survey from "../../components/cancelservice/Survey";
import CancellationSummary from "../../components/cancelservice/CancellationSummary";

const AccountStack = createNativeStackNavigator();

function AccountStackScreen() {
  return (
    <AccountStack.Navigator
      initialRouteName="Account"
      defaultNavigationOptions={{ gestureEnabled: true }}
    >
      <AccountStack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="support"
        component={supportScreen}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="ProfileSettingsEdit"
        component={ProfileSettingsEdit}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="PasswordSecurity"
        component={PasswordSecurity}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="PasswordSecurityEdit"
        component={PasswordSecurityEdit}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="PasswordEdit"
        component={ChangePassword}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="EmailNotifications"
        component={EmailNotifications_acp}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="InAppNotifications"
        component={InAppNotifications}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="TextNotifications"
        component={TextNotifications}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="ArticalWindowUtility"
        component={ArticalWindowUtility}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <AccountStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="ThumbsUp"
        component={ThumbsUp}
        options={{ headerShown: false }}
      />
      <AccountStack.Screen
        name="AddEmailNotification"
        component={AddEmailNotification}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="cancelServiceSurvey"
        component={Survey}
        options={{ headerShown: false }}
      />

      <AccountStack.Screen
        name="cancelServiceSummary"
        component={CancellationSummary}
        options={{ headerShown: false }}
      />
    </AccountStack.Navigator>
  );
}

export default AccountStackScreen;
