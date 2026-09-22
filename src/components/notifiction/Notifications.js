import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import NotificationSection from "./NotificationSection";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { getUser } from "../../redux/utils/LocalStorage";
import { Color, Padding } from "../../../GlobalStyles";
import { getPrimaryEmail } from "../utility/constant";
import { GetApiRequest } from "../../network/RestApiClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import AppStyles from "../../styles/AppStyles";
import { ScreenScroll } from "../common/customui/Screen";

const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [textNotificationLoading, setTextNotificationLoading] = useState(false);
  const [inAppNotificationLoading, setInAppNotificationLoading] =
    useState(false);
  const [phoneNumber, setPhoneNumber] = useState(undefined);

  const accountDetails = useSelector((state) => state.profile?.accountDetails);
  const paperlessStatusAcp = useSelector(
    (state) => state.profile?.paperlessStatusAcp
  );

  const paperlessLoading = useSelector(
    (state) => state.profile?.isPaperLessStatusLoading
  );

  const profileData = useMemo(() => {
    return accountDetails
      ? {
          emailAddress: getPrimaryEmail(accountDetails),
          isAdmin: accountDetails.isAdmin || false,
          phoneNumber: accountDetails.phoneNumber || null,
        }
      : {};
  }, [accountDetails]);

  const emailSettings = useMemo(
    () => [
      {
        id: "critical",
        type: "Critical Notifications",
        status: profileData.emailAddress ? "On" : "Off",
      },
      {
        id: "paperless",
        type: "Paperless Billing",
        status: paperlessStatusAcp ? "On" : "Off",
      },
    ],
    [profileData.emailAddress, paperlessStatusAcp]
  );

  const InAppSettings = useMemo(
    () => [
      {
        id: "Appointment",
        type: "Appointments",
        status: "Off",
      },
      {
        id: "outage",
        type: "Outage Alerts",
        status: "Off",
      },
      {
        id: "billing",
        type: "Billing",
        status: "Off",
      },
    ],
    []
  );

  const TextNotifSettings = useMemo(
    () => [
      {
        id: "Appointment",
        type: "Appointments",
        status: "Off",
      },
      {
        id: "outage",
        type: "Outage Alerts",
        status: "Off",
      },
      {
        id: "billing",
        type: "Billing",
        status: "Off",
      },
    ],
    []
  );

  const sections = useMemo(
    () => [
      {
        id: "text",
        title: "Text Notifications",
        isComingSoon: false,
        settings: TextNotifSettings,
        infoMessage: phoneNumber
          ? `Text alerts are sent to ${phoneNumber}`
          : "You have not enabled text notifications.",
        isLoading: textNotificationLoading,
      },
      {
        id: "email",
        title: "Email Notifications",
        settings: emailSettings,
        infoMessage: profileData.emailAddress
          ? `Emails are sent to ${profileData.emailAddress}`
          : "You have not enabled email notifications.",
        isLoading: paperlessLoading,
      },
      {
        id: "app",
        title: "In-App Notifications",
        isComingSoon: false,
        settings: InAppSettings,
        infoMessage: "Notifications sent from your application.",
        isLoading: inAppNotificationLoading,
      },
    ],
    [
      profileData,
      emailSettings,
      textNotificationLoading,
      paperlessLoading,
      inAppNotificationLoading,
      phoneNumber,
    ]
  );

  const handleEdit = (section) => {

    if (section == "app") {
      navigation.navigate("InAppNotifications", {
        is_enrolled: profileData.emailAddress,
        additionalData: {
          optOut: InAppSettings[0].status == "On" ? true : false,
          outageOptOut: InAppSettings[1].status == "On" ? true : false,
          billingOptOutStatus: InAppSettings[2].status == "On" ? true : false,
        },
      });
    } else if (section == "email") {
      navigation.navigate("EmailNotifications", {
        is_enrolled: profileData.emailAddress,
        isPaperlessEnabled: paperlessStatusAcp,
      });
    } else if (section == "text") {
      navigation.navigate("TextNotifications", {
        is_enrolled: profileData.emailAddress,
        additionalData: {
          optOut: TextNotifSettings[0].status == "On" ? true : false,
          outageOptOut: TextNotifSettings[1].status == "On" ? true : false,
          billingOptOutStatus:
            TextNotifSettings[2].status == "On" ? true : false,
          phoneNumber: phoneNumber,
        },
      });
    }
  };

  const handleBackPress = () => navigation.navigate("Account");

  const getInAppNotificationsData = () => {
    setInAppNotificationLoading(true);
    getUser().then((res1) => {
      const endpointUrl = getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS_ACCOUNT, { userName: res1.userInfo?.userName, accountNumber: res1.userInfo?.accountNumber });
      GetApiRequest(
        endpointUrl,
        (res) => {
          if (res) {
            res[0]?.pushMessageType.forEach((value, index) => {
              InAppSettings[index].status = value?.optOutFlag ? "Off" : "On";
            });
          }
          setInAppNotificationLoading(false);
        },
        (error) => {
          setInAppNotificationLoading(false);
          console.warn("Error on retrying getInAppNotificationsData", error);
        }
      );
    });
  };

  const getTextNotificationsData = () => {
    setTextNotificationLoading(true);
    getUser().then((res1) => {
      const endpointUrl = getEndpoint(ENDPOINTS.SMS_NOTIFICATION_PREFS, { accountNumber: res1.userInfo?.accountNumber });
      GetApiRequest(
        endpointUrl,
        (res) => {
          if (res) {
            res[0]?.smsMessageType.forEach((value, index) => {
              TextNotifSettings[index].status = value?.optOutFlag
                ? "Off"
                : "On";
            });
            let phoneNum = res[0]?.phoneNum || "";
            setPhoneNumber(phoneNum);
            
          }
          setTextNotificationLoading(false);
        },
        (error) => {
          setTextNotificationLoading(false);
          console.warn("Error on retrying getTextNotificationsData", error);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchACPUserAccountDetails());
      getInAppNotificationsData();
      getTextNotificationsData();
    }, [dispatch])
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Notifications"
        onPressBack={handleBackPress}
      />
      <ScreenScroll style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <NotificationSection
              key={section.id}
              {...section}
              onEdit={() => handleEdit(section.id)}
              isAdmin={profileData.isAdmin}
              isLoading={section.isLoading}
              phoneNumber={phoneNumber}
            />
          ))}
        </View>
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray300,
  },
  content: { flex: 1 },

  sectionsContainer: {
    paddingHorizontal: Padding.p_base,
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_13xl,
    marginBottom: 200,
  },
});

export default Notifications;
