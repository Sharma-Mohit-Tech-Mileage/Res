import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import NotificationSection from "./NotificationSection";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { getUser } from "../../..//redux/utils/LocalStorage";
import { Color, Padding } from "../../../../GlobalStyles";
import { getPrimaryEmail } from "../../utility/constant";
import { GetApiRequest } from "../../../network/APIClient";
import {
  fetchACPUserAccountDetails,
  getPaperlessStatus,
} from "../../../redux/actions/ProfileActionSuite";

const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const [phoneNumber,setPhoneNumber]=useState(undefined)

  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers.profile?.paperlessStatusAcp
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
        type: "Outage",
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
        type: "Outage",
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
        infoMessage: phoneNumber ? `Text alert are sent to ${phoneNumber}`
        : "You have not enabled text notifications.",
      },
      {
        id: "email",
        title: "Email Notifications",
        settings: emailSettings,
        infoMessage: profileData.emailAddress
          ? `Emails are sent to ${profileData.emailAddress}`
          : "You have not enabled email notifications.",
      },
      {
        id: "app",
        title: "In-App Notifications",
        isComingSoon: false,
        settings: InAppSettings,
        infoMessage: "Notifications sent from your application.",
      },
    ],
    [profileData, emailSettings]
  );

  const handleEdit = (section) => {
    console.log(`Editing ${section}`);

    if (section == "app") {
      navigation.navigate("InAppNotifications", {
        is_enrolled: profileData.emailAddress,
        additionalData:{optOut:InAppSettings[0].status=='On'? true:false,outageOptOut:InAppSettings[1].status=='On'? true:false,billingOptOutStatus:InAppSettings[2].status=='On'? true:false,phoneNumber:''}
      });
    } else if (section == "email") {
      navigation.navigate("EmailNotifications", {
        is_enrolled: profileData.emailAddress,
      });
    } else if (section == "text") {
      console.log('status',TextNotifSettings[1].status)
      navigation.navigate("TextNotifications", {
        is_enrolled: profileData.emailAddress,
         additionalData:{optOut:TextNotifSettings[0].status=='On'? true:false,outageOptOut:TextNotifSettings[1].status=='On'? true:false,billingOptOutStatus:TextNotifSettings[2].status=='On'? true:false,phoneNumber:phoneNumber}
      });
    }
  };

  const handleBackPress = () => navigation.navigate("Account");

  // Existing effect: when accountDetails change, update the paperless status using the new email.
  useEffect(() => {
    if (accountDetails) {
      const updatedPrimaryEmail = getPrimaryEmail(accountDetails);
      dispatch(getPaperlessStatus(updatedPrimaryEmail));
      //console.log('Account details',accountDetails)
    }
  }, [accountDetails, dispatch]);

  // On focus, trigger the Redux Saga to refresh account details.

  const getInAppNotificationsData = () => {
    getUser().then((res1) => {
      let requestUrl = `/api/mobilenotificationpreferences/newBillerP2har/mobilepreferences/${res1.userInfo?.accountNumber}`;
      console.log(requestUrl);
      GetApiRequest(
        requestUrl,
        (res) => {
          if (res) {
            console.log(
              "Response getInAppNotificationsData",
              JSON.stringify(res)
            );
            res[0]?.pushMessageType.forEach((value, index) => {
              //console.log(`Index: ${index}, Value: ${value}`);
              InAppSettings[index].status = value?.optOutFlag ? "On" : "Off";
            });
          }
        },
        (error) => {
          console.error("Error on retrying getInAppNotificationsData", error);
        }
      );
    });
  };

  const getTextNotificationsData = () => {
    setLoading(true)
    getUser().then((res1) => {
      let requestUrl = `api/SMS/sms?AccountNumber=${res1.userInfo?.accountNumber}`;
      console.log(requestUrl);
      GetApiRequest(
        requestUrl,
        (res) => {
          if (res) {
            console.log(
              "Response getTextNotificationsData",
              JSON.stringify(res)
            );
            
            res[0]?.smsMessageType.forEach((value, index) => {
              console.log(`Index: ${index}, Value: ${value}`);
              TextNotifSettings[index].status = value?.optOutFlag ? "On" : "Off";
            });
            let phoneNum=res[0].phoneNum ||''
            setPhoneNumber(phoneNum)
            
          }
             setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.error("Error on retrying getInAppNotificationsData", error);
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <NotificationSection
              key={section.id}
              {...section}
              onEdit={() => handleEdit(section.id)}
              isAdmin={profileData.isAdmin}
              isLoading={loading}
              phoneNumber={phoneNumber}

            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
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
