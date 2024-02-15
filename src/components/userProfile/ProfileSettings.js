import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from 'react-redux';
import { getUserType, isPrimaryAdmin, convertToSpecialCase, transformResponse, initializeSettings, getRoleBasedMessage } from '../utility/constant';
import NotificationAlert from '../common/customui/NotificationAlert';
import { fetchProfileDetails, fetchSMSSelection } from '../../redux/actions/ProfileActionSuite'
import PubSub from 'pubsub-js'
const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  //const smsSubscription = profile.smsSubscription || [];
  //const data = transformResponse(smsSubscription);
  //const smsPayload = initializeSettings(data);
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const convertedRole = getUserType(profileDetails.memberType || '');
  const roleBasedInfo = getRoleBasedMessage(profileDetails.memberType || '');
  const emailAlertNeeded = !profileDetails.svEmailAddress || profileDetails.multipleEmails;
  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      dispatch(fetchProfileDetails());
      // if (isPrimary)
      //   dispatch(fetchSMSSelection());
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);

  useEffect(() => {
    dispatch(fetchProfileDetails());
  }, [dispatch]);

  // useEffect(() => {
  //   if (isPrimary) {
  //     dispatch(fetchSMSSelection());
  //   }
  // }, [isPrimary, dispatch]);

  return (
    <View style={{ zIndex: 1 }}>
      <ProfileSettingsHeader title="Profile Settings" onPressBack={() => navigation.navigate('Account')} />
      <ScrollView accessibilityLabel="Profile settings page.">
        <View style={styles.frameParent}>
          <View style={[styles.frameGroup]}>
            <View style={styles.infoWrapper}>
              <NotificationAlert
                type="success"
                title="Success"
                message="Your profile settings have been successfully saved."
                showCloseIcon={true}
                isVisible={showSuccessAlert}
                onClose={() => setShowSuccessAlert(false)}
              />
            </View>
            <View style={[styles.generalInformationParent]}>
              <Text style={[styles.generalInformation, styles.melissaTypo]}>
                General Information
              </Text>
              <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                // onPress={() => navigation.navigate("ProfileSettingsEdit", { smsPayload: smsPayload })}>
                onPress={() => navigation.navigate("ProfileSettingsEdit")}>
                <Text style={[styles.makePayment, styles.text1Clr]}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.frameContainer}>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>First Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.firstName}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Last Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>{profileDetails.lastName}</Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Username</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.userName}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Member Type</Text>
                <View style={styles.badgeWrapper}>
                  <View style={[styles.badge, styles.badgeBorder]}>
                    <Text style={[styles.text, styles.textTypo]}>
                      {convertedRole}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.notificationsWrapper}>
                <NotificationAlert
                  type="info" // "info", "success", "warning"
                  title={convertToSpecialCase(convertedRole)}
                  showCloseIcon={false}
                  message={roleBasedInfo}
                />
              </View>
            </View>
            <View style={[{ paddingHorizontal: Padding.p_5xl }, styles.frameParentSpaceBlock]}>
              <View style={styles.frameChild} />
            </View>
            <View style={styles.frameParentSpaceBlock}>
              <View style={styles.contactInformationWrapper}>
                <Text style={[styles.generalInformation, styles.melissaTypo]}>
                  Contact Information
                </Text>
              </View>
              {emailAlertNeeded && isPrimary && (
                <View style={styles.notificationsWrapper}>
                  <NotificationAlert
                    type={"warning"}
                    title={profileDetails.multipleEmails ? "There is a problem retrieving your email address" : "No email address on file"}
                    showCloseIcon={false}
                    message={profileDetails.multipleEmails ? <Text style={styles.messageText}>
                      {'We are not able to retrieve the email address for your account. Please'}
                      <Text
                        style={styles.contactUsText}
                        onPress={() => {
                          navigation.navigate('Support');
                          setTimeout(() => {
                            PubSub.publish('event.contactUsEvent', {});
                          }, 500);
                        }}
                      >
                        {' contact us '}
                      </Text>
                      {'for assistance.'}
                    </Text> : "We don't have your email address on file. Please add your email."}
                  /></View>
              )}

              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Email</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.multipleEmails ? '' : profileDetails.svEmailAddress}
                </Text>
              </View>
              {/* {!smsPayload.phoneNumber && isPrimary && (
                <View style={styles.notificationsWrapper}>
                  <NotificationAlert
                    type={"warning"}
                    title={"No mobile phone number on file"}
                    showCloseIcon={false}
                    message={"We don't have your phone number on file. Please add your phone number"}
                  /></View>
              )}
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Mobile Phone</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {smsPayload.phoneNumber || ''}
                </Text>
              </View> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  melissaTypo: {
    color: Color.sparklightGray1,
    lineHeight: 28,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  buttonsLayout: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  text1Clr: {
    color: Color.colorWhitesmoke_200,
    textAlign: "center",
  },
  badgeBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  textTypo: {
    lineHeight: 18,
    fontSize: FontSize.size_xs,
    fontWeight: "600",
  },
  frameParentSpaceBlock: {
    marginTop: Padding.p_base,
    alignSelf: "stretch",
  },
  generalInformation: {
    flex: 1,
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    fontWeight: '400'
  },
  makePayment: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  contactUsText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    paddingLeft: 5,
    flexWrap: 'wrap'
  },
  buttons: {
    marginLeft: Padding.p_3xs,
    backgroundColor: Color.colorMidnightblue,
  },
  generalInformationParent: {
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    flexDirection: "row",
  },
  firstName: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
  },
  melissa: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: '400'
  },
  firstNameParent: {
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  text: {
    color: Color.success700,
    fontFamily: FontFamily.openSansSemiBold,
    textAlign: "center",
  },
  badge: {
    borderColor: Color.colorAquamarine,
    backgroundColor: Color.success50,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignItems: "center",
    flexDirection: "row",
  },
  badgeWrapper: {
    marginTop: 6,
    alignItems: "center",
    flexDirection: "row",
  },
  notificationsWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  infoWrapper: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameContainer: {
    alignSelf: "stretch",
    marginTop: Padding.p_base
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  contactInformationWrapper: {
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameGroup: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  frameParent: {
    paddingVertical: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
    width: '100%',
    marginBottom: 200,
  },
});

export default ProfileSettings;
