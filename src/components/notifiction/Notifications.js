import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { fetchSMSSelection, fetchPushNotifications, fetchBillingPaper, } from '../../redux/actions/ProfileActionSuite';
import { transformResponse, transformNotificationPreferences, isPrimaryAdmin } from '../../components/utility/constant';
import { useDispatch, useSelector } from 'react-redux';
import NotificationAlert from "../common/customui/NotificationAlert";

const Notifications = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedSection, setUpdatedSection] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute(); // Use the useRoute hook
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const smsSubscription = profile.smsSubscription || [];
  const profileDetails = profile.profileDetails || {};
  const paperLessInfo = profile.paperLessInfo || {};
  const transformedNotification = transformNotificationPreferences(profile.pushNotifications || {});
  const data = transformResponse(smsSubscription);
  const emailAddress = paperLessInfo.emailAddress;
  const emailStatus = paperLessInfo.emailStatus || 'Pending';
  const isEmailVerified = emailStatus === 'Verified';
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const isFreshEntry = (entry) => {
    
    return !(
      entry.emailAddress !== "" &&
      entry.paperlessStatus === "InActive" &&
      entry.emailStatus === "Verified"
    );
  };
  const notRegistered = isFreshEntry(paperLessInfo);
  let notificationsTitle, infoText, isDisabled;
  if (emailAddress) {
    notificationsTitle = isEmailVerified ? "" : "Email verification pending";
    infoText = isEmailVerified ? `Emails are sent to ` : `Email ${emailAddress} is being verified. Please verify your email address to continue.`;
    isDisabled = !isEmailVerified;
  } else {
    if (profileDetails.multipleEmails) {
      isDisabled = true;
      notificationsTitle = "There is a problem retrieving your email address";
      infoText = "We are not able to retrieve the email address for your account. Please contact us for assistance";
    } else if (profileDetails.svEmailAddress) {
      isDisabled = false;
    }
    else {
      isDisabled = true;
      notificationsTitle = "No email address on file";
      infoText = "We don’t have your email address on file. Go to Profile Settings to add your email.";
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchBillingPaper());
        await dispatch(fetchSMSSelection());
        await dispatch(fetchPushNotifications());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [dispatch]);


  useEffect(() => {
    if (route.params?.updateSuccess) {
      const updatedType = route.params.updatedType || 'Notification';
      setUpdatedSection(updatedType);
      setSuccessMessage(`${updatedType} settings have been updated successfully.`);
      setShowSuccessAlert(true);
      dispatch(fetchBillingPaper());
      dispatch(fetchSMSSelection());
      dispatch(fetchPushNotifications());
      navigation.setParams({ updateSuccess: undefined, updatedType: undefined });
    }
  }, [route.params, navigation, dispatch]);

  return (
    <View style={styles.notifications}>
      <ProfileSettingsHeader title="Notifications"
        onPressBack={() => navigation.navigate('Account')}
      />
      <ScrollView>
        <View style={[styles.notificationsInner]}>
          <NotificationSection
            title="Text Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'Text'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={() => setShowSuccessAlert(false)}
            isDisabled={!data.phoneNum}
            notificationsTitle="No mobile phone number on file"
            infoText={data.phoneNum ? `Text alerts are sent to ` : 'We don’t have your mobile phone number on file. Go to Profile Settings to add your phone number.'}
            number={data.phoneNum}
            transformedData={data}
            navigationTarget="TextNotifications"
            additionalSettings={data.subscriptionDetails}
            isAdmin={!isPrimary}
          />
          <View style={{ marginBottom: Padding.p_base }} />
          <NotificationSection
            title="Email Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'Email'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={() => setShowSuccessAlert(false)}
            isDisabled={isDisabled}
            notificationsTitle={notificationsTitle}
            infoText={infoText}
            email={paperLessInfo.emailAddress}
            navigationTarget="EmailNotifications"
            transformedData={{ status: paperLessInfo?.paperlessStatus === 'Active', email: profileDetails.svEmailAddress, isNew: isFreshEntry(paperLessInfo) }}
            additionalSettings={[{ type: 'Paperless Billing', status: paperLessInfo?.paperlessStatus === 'Active' ? 'On' : 'Off'}]}
            isAdmin={!isPrimary}
          />
          <View style={{ marginBottom: Padding.p_base }} />
          <NotificationSection
            title="In-App Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'App'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={() => setShowSuccessAlert(false)}
            isDisabled={false}
            notificationsTitle="Mobile No is missing"
            infoText="Notifications sent from your application."
            navigationTarget="InAppNotifications"
            transformedData={transformedNotification}
            additionalSettings={transformedNotification}
            isAdmin={false}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const NotificationSection = ({
  title,
  successMessage,
  showNotification,
  showSuccessAlert,
  setShowSuccessAlert,
  isDisabled,
  notificationsTitle,
  infoText,
  number,
  transformedData,
  email,
  navigationTarget,
  additionalSettings = [],
  isAdmin
}) => {

  const navigation = useNavigation();
  const handleClose = () => { setShowSuccessAlert(false); };

  return (
    <View style={[styles.frameParent2, styles.frameBorder]}>
      {showNotification && (
        <View style={styles.infoWrapper}>
          <NotificationAlert
            type="success"
            title="Update Successful"
            message={successMessage}
            showCloseIcon={true}
            isVisible={showSuccessAlert}
            onClose={handleClose}
          />
        </View>
      )}
      <View style={[styles.textNotificationsParent, styles.parentSpaceBlock]}>
        <Text style={styles.textNotifications}>{title}</Text>
        {!isAdmin && <Pressable
          style={[styles.buttons, styles.buttonsBg, isDisabled && styles.buttonDisabled]}
          onPress={() => isDisabled ? {} : navigation.navigate(navigationTarget, { additionalData: transformedData })}
          disabled={isDisabled}
        >
          <Text style={isDisabled ? styles.makePaymentDisabled : styles.makePayment}>Edit</Text>
        </Pressable>}
      </View>
      <View style={styles.frameWrapper}>
        {!isAdmin && isDisabled ?
          <NotificationAlert
            type="warning"
            title={notificationsTitle}
            showCloseIcon={false}
            message={infoText}
          />
          : null}
        {isAdmin ?
          <NotificationAlert
            type="warning"
            title={""}
            showCloseIcon={false}
            message={"Only Primary Admin can make changes"}
          />
          : null}
        {isAdmin ? <View style={{ marginVertical: 8 }} /> : null}
        {(!isDisabled && infoText) ? <View style={styles.frameView}>
          <View style={styles.infoCircleWrapper}>
            <Image
              style={styles.infoCircleIcon}
              resizeMode="contain"
              source={require("../../../assets/infocircle.png")}
            />
          </View>
          <Text style={[styles.notificationsSentFrom, styles.notificationsSentFromTypo]}>
            {infoText}
            {number && (
              <Text style={[styles.text]} accessibilityLabel={`Phone Number: ${number}`}>
                {number}
              </Text>
            )}
            {email && (
              <Text style={styles.text} accessibilityLabel={`Email Address: ${email}`}>
                {email}
              </Text>
            )}
          </Text>
        </View> : null}
      </View>
      {additionalSettings.map((setting, index) => (
        <NotificationType key={index} type={setting.type} status={setting.status} />
      ))}
    </View>
  );
};

const NotificationType = ({ type, status }) => {
  let displayStatus;
  let imageSource;
  switch (status) {
    case 'On':
    case 'Subscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle.png");
      break;
    case 'Off':
    case 'Unsubscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle1.png");
      break;
    default:
      displayStatus = 'Unknown';
      imageSource = require("../../../assets/checkcircle1.png");
      break;
  }
  return (
    <View style={styles.frameWrapperBorder}>
      <View style={[styles.parentSpaceBlock]}>
        <Text style={[styles.appointments, styles.subscribedTypo]}>{type}</Text>
        <View style={[styles.checkCircleParent]}>
          <Image
            style={styles.infoCircleIcon}
            resizeMode="cover"
            source={imageSource}
          />
          <Text style={[styles.subscribed, styles.subscribedTypo]}>{displayStatus}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameBorder: {
    borderWidth: 1,
    justifyContent: "center",
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
    paddingTop: Padding.p_base
  },
  parentSpaceBlock: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_200,
    marginLeft: 8,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  frameWrapperBorder: {
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },
  subscribedTypo: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    fontWeight: '400'
  },
  textNotifications: {
    fontSize: FontSize.size_3xl,
    color: Color.sparklightGray1,
    textAlign: "left",
    lineHeight: 28,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
    fontWeight: '400'
  },
  makePayment: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  makePaymentDisabled: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.colorGray_200,
  },
  textNotificationsParent: {
    alignSelf: "stretch",
  },
  infoCircleIcon: {
    width: 18,
    height: 18,
    marginTop: -5
  },
  infoCircleWrapper: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  text: {
    color: Color.colorGray_100,
    fontWeight: "600",
    fontSize: 14
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameView: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_7xs,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper: {
    width: 382,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
  },
  appointments: {
    flex: 1,
  },
  subscribed: {
    marginLeft: 10,
  },
  checkCircleParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent2: {
    alignItems: "center",
  },
  notificationsSentFrom: {
    marginLeft: 8,
    color: Color.colorGray_100,
    fontWeight: '400',

  },
  notificationsInner: {
    paddingVertical: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200
  },
  buttonsBg: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  notifications: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200
  },
});

export default Notifications;
