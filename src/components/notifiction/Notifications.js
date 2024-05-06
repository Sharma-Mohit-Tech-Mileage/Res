import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { Padding, Color, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import { fetchSMSSelection, fetchPushNotifications, fetchBillingPaper, fetchProfileDetails, resentEmailVerifiction } from '../../redux/actions/ProfileActionSuite';
import { transformResponse, transformNotificationPreferences, isPrimaryAdmin, isAdminRole, isFreshEntry, extractAcknowledgementEmail } from '../../components/utility/constant';
const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedSection, setUpdatedSection] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const smsSubscription = profile.smsSubscription || [];
  const profileDetails = profile.profileDetails || {};
  const paperLessInfo = profile.paperLessInfo || {};
  const transformedNotification = transformNotificationPreferences(profile.pushNotifications || {});
  const data = transformResponse(smsSubscription);
  const emailAddress = paperLessInfo.emailAddress||'';
  const isEmailVerified = paperLessInfo.emailStatus === 'Verified';
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const isAdmin = isAdminRole(profileDetails.memberType);
  const acknowledgement = extractAcknowledgementEmail(paperLessInfo);

  let notificationsTitle = '', infoText = '', isDisabled = false;
  if (profileDetails.multipleEmails) {
    isDisabled = true
    notificationsTitle = "Unable to retrieve email address.";
    infoText = 'We are not able to retrieve the email address for your account. Please contact us for assistance.'
    
  }
  else if (profileDetails.multipleEmails === false) {
    if (emailAddress || acknowledgement) {
      notificationsTitle = isEmailVerified ? '' : 'Email verification pending';
      infoText = isEmailVerified ? (<Text>Emails are sent to <Text style={styles.text}>{emailAddress}</Text></Text>) :
        (<View>
          <Text style={{lineHeight:28}}><Text style={styles.contactUsText}>{acknowledgement}</Text> is awaiting confirmation.
          {isPrimary && (
            <>
              <Text>Check your inbox for our verification link.</Text> 
            </>
          )}</Text>
            {isPrimary && (<Text
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Resend Confirmation Email"
                accessibilityHint="Activates the email verification process again"
                style={styles.contactUsText}
                hitSlop={{ top: 20, bottom:20, left: 20, right: 20 }}
                onPress={() => dispatch(resentEmailVerifiction(navigation))}
              >{'Resend Confirmation Email'}
              </Text>
          )}
        </View>);
    }
    else if (profileDetails.svEmailAddress) {
      infoText = (<Text style={[styles.text]} >Emails are sent to <Text style={styles.text}>{profileDetails.svEmailAddress}</Text></Text>);
    }
  }

  useEffect(() => {
    dispatch(fetchProfileDetails());
    dispatch(fetchSMSSelection());
    dispatch(fetchPushNotifications());
    dispatch(fetchBillingPaper());
  }, []);

  useEffect(() => {
    if (route.params?.updateSuccess) {
      const updatedType = route.params.updatedType || 'Notification';
      switch (updatedType) {
        case 'Email':
          dispatch(fetchBillingPaper());
          dispatch(fetchProfileDetails());
          break;
        case 'Text':
          dispatch(fetchSMSSelection());
          break;
        case 'App':
          dispatch(fetchPushNotifications());
          break;
        default:
          dispatch(fetchProfileDetails());
          dispatch(fetchBillingPaper());
          dispatch(fetchProfileDetails());
          dispatch(fetchPushNotifications());
      }
      setUpdatedSection(updatedType);
      setSuccessMessage(`${updatedType} settings have been updated successfully.`);
      setShowSuccessAlert(true);
      navigation.setParams({ updateSuccess: undefined, updatedType: undefined });
    }
  }, [route.params, navigation, dispatch]);

  useEffect(() => {
    if (route.params?.resentNotification) {
      const updatedType = route.params.updatedType;
      setUpdatedSection('Email');
      setSuccessMessage(updatedType ? 'Verification email resent' : 'Resend failed. Try again');
      setShowSuccessAlert(true);
      navigation.setParams({ resentNotification: undefined, updatedType: undefined });
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
            isDisabled={false}
            notificationsTitle="No mobile phone number on file"
            infoText = {data.phoneNum ? <Text>Text alerts are sent to <Text style={[styles.text]}>{data.phoneNum}</Text></Text> : <Text></Text>}          
            number={data.phoneNum}
            transformedData={data}
            navigationTarget="TextNotifications"
            additionalSettings={data.subscriptionDetails}
            isAdmin={isAdmin}
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
            transformedData={{
              status: paperLessInfo?.paperlessStatus === 'Active',
              email: paperLessInfo.emailAddress || profileDetails.svEmailAddress,
              isNew: isFreshEntry(paperLessInfo),
              critNotif: !!profileDetails.svEmailAddress
            }}
            additionalSettings={[
              { type: 'Critical notifications', status: !!profileDetails.svEmailAddress ? 'On' : 'Off' },
              { type: 'Paperless Billing', status: paperLessInfo?.paperlessStatus === 'Active' ? 'On' : 'Off' }
            ]}
            isAdmin={isAdmin}
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
            infoText = {<View ><Text>Notifications sent from your application.</Text></View>}
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
    <View style={{ ...styles.frameBorder, alignItems: "center" }}>
      {showNotification && (
        <View style={styles.infoWrapper}>
          <NotificationAlert
            type="success"
            title="Successful"
            message={successMessage}
            showCloseIcon={true}
            isVisible={showSuccessAlert}
            onClose={handleClose}
          />
        </View>
      )}
      <View style={{ ...styles.parentSpaceBlock, alignSelf: "stretch" }}>
        <Text style={styles.textNotifications}>{title}</Text>
        {!isAdmin && <Pressable
           style={({ pressed }) => [
            styles.buttons,
            styles.buttonsBg,
            isDisabled && styles.buttonDisabled,
            { opacity: pressed ? 0.7 : (isDisabled ? 0.5 : 1.0) }
          ]}
          onPress={() => isDisabled ? {} : navigation.navigate(navigationTarget, { additionalData: transformedData })}
          disabled={isDisabled}>
          <Text style={isDisabled ? styles.makePaymentDisabled : styles.makePayment}>Edit</Text>
        </Pressable>}
      </View>
      <View style={styles.frameWrapper}>
        {!isAdmin && isDisabled &&
          <NotificationAlert
            type="warning"
            title={notificationsTitle}
            showCloseIcon={false}
            message={infoText} />}
        {isAdmin &&
          <NotificationAlert
            type="warning"
            title={""}
            showCloseIcon={false}
            message={"Only Primary Admin can make changes"} />}
        {isAdmin && <View style={{ marginVertical: 8 }} />}
        {(!isDisabled && infoText) && <View style={styles.frameView}>
          <View style={styles.infoCircleWrapper}>
            <Image
              style={styles.infoCircleIcon}
              resizeMode="contain"
              source={require("../../../assets/infocircle.png")}
            />
          </View>
          <View style={[styles.notificationsSentFrom, styles.notificationsSentFromTypo]}>
            {infoText}
          </View>
        </View>}
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
        <Text style={{ ...styles.subscribedTypo, flex: 1 }}>{type}</Text>
        <View style={[styles.checkCircleParent]}>
          <Image
            style={styles.infoCircleIcon}
            resizeMode="cover"
            source={imageSource}
          />
          <Text style={{ ...styles.subscribedTypo, marginLeft: 10, }}>{displayStatus}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contactUsText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    //paddingLeft: 5,
    flexWrap: 'wrap',
    lineHeight:28
  },
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
  // notificationsSentFromTypo: {
  //   color: Color.colorGray_200,
  //   marginLeft: 8,
  //   fontSize: FontSize.textXsSemibold_size,
  //   textAlign: "left",
  //   lineHeight: 28,
  //   flex: 1,
  // },
  notificationsSentFrom: {
    flex: 1,  // Take available space
    justifyContent: 'center', // Center content vertically in the container
    alignItems: 'center', // Center content horizontally in the container
    marginLeft: 8,
    backgroundColor: Color.colorWhitesmoke_100, // Example background color
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_100,
    fontWeight: '400',
    fontSize: FontSize.textXsSemibold_size,
    textAlign: 'center', // Ensures text itself is centered if it doesn't fill the full width
    lineHeight: 28,
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
  infoCircleIcon: {
    width: 18,
    height: 18,
    marginTop: -3
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  text: {
    color: Color.colorGray_100,
    fontWeight: "600",
    lineHeight:28,
    fontSize: 14,
    flex: 1,
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
  checkCircleParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  // notificationsSentFrom: {
  //   marginLeft: 8,
  //   color: Color.colorGray_100,
  //   fontWeight: '400',
  // },
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
