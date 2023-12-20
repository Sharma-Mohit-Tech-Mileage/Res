import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from 'react-redux';
import { getUserType, BOX_COLORS } from '../utility/constant';
import NotificationAlert from '../common/customui/NotificationAlert';
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite'
const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};

  // Ensure getUserType handles undefined inputs safely
  const convertedRole = getUserType(profileDetails.memberType || '');
  // Use optional chaining and provide a default empty string if undefined
  const normalizedRole = convertedRole?.replace(/\s+/g, '').toLowerCase() || '';
  const boxBackground = BOX_COLORS[normalizedRole] || Color.colorWhitesmoke_200;

  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      dispatch(fetchProfileDetails());
      // Reset the parameter so subsequent navigations are detected
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);
  
  useEffect(() => {
    if (profileDetails) {
      dispatch(fetchProfileDetails());
    }
  }, [dispatch]);

  return (
    <View style={{ zIndex: 1 }}>
      <ProfileSettingsHeader
        title="Profile Settings"
        onPressBack={() => navigation.navigate('Account')}
      />
      <ScrollView accessibilityLabel="Profile settings page.">
        <View style={styles.frameParent}>
          <NotificationAlert
            type="success"
            title="Update Successful"
            message="Your profile has been updated successfully."
            showCloseIcon={true}
            isVisible={showSuccessAlert}
            onClose={() => setShowSuccessAlert(false)}
          />
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <View style={[styles.generalInformationParent]}
            >
              <Text style={[styles.generalInformation, styles.melissaTypo]}>
                General Information
              </Text>
              <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={() => navigation.navigate("ProfileSettingsEdit")}
              >
                <Text style={[styles.makePayment, styles.text1Clr]}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.frameContainer}>
              <View style={styles.firstNameParent} accessible={true} accessibilityLabel="First Name: Melissa">
                <Text style={styles.firstName}>First Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.firstName}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Last Name: Smith">
                <Text style={styles.firstName}>Last Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>{profileDetails.lastName}</Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Username: MelSmith">
                <Text style={styles.firstName}>Username</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.userName}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Member Type: PRIMARY ADMIN">
                <Text style={styles.firstName}>Member Type</Text>
                <View style={styles.badgeWrapper}>
                  <View style={[styles.badge, styles.badgeBorder, { backgroundColor: boxBackground }]}>
                    <Text style={[styles.text, styles.textTypo]}>
                      {convertedRole}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.notificationsWrapper}>
                <NotificationAlert
                  type="info" // "info", "success", "warning"
                  title="Primary Admin"
                  showCloseIcon={false}
                  message="You are currently the primary admin
                          account. You can make another account
                          the primary admin account. By doing so
                          you will become an admin user under the
                          new primary admin account."
                />
              </View>
            </View>
            <View style={[styles.rectangleWrapper, styles.frameParent1SpaceBlock]}>
              <View style={styles.frameChild} />
            </View>
            <View style={styles.frameParent1SpaceBlock}>
              <View style={styles.contactInformationWrapper}>
                <Text style={[styles.generalInformation, styles.melissaTypo]}>
                  Contact Information
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Email</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.svEmailAddress}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Mobile Phone</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {profileDetails.phone || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  frameGroupSpaceBlock: {
    paddingVertical: Padding.p_13xl,
    alignSelf: "stretch",
    marginBottom: 200,
  },
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
  frameParent1SpaceBlock: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    flex: 1,
    fontWeight: '400'
  },
  makePayment: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
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
  notificationsChild: {
    width: 3,
    alignSelf: "stretch",
  },

  notificationsWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameContainer: {
    alignSelf: "stretch",
    marginTop: 16
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    paddingHorizontal: Padding.p_5xl,
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
  },
});

export default ProfileSettings;
