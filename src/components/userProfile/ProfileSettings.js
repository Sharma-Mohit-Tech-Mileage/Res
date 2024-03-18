import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from "../../redux/utils/LocalStorage";
import { getUserType, isPrimaryAdmin, convertToSpecialCase, getRoleBasedMessage } from '../utility/constant';
import NotificationAlert from '../common/customui/NotificationAlert';
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite';
import { RefreshToken } from '../user/Session';
const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [accountObj, setAccountObj] = useState({});
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const convertedRole = getUserType(profileDetails.memberType || '');
  const roleBasedInfo = getRoleBasedMessage(profileDetails.memberType || '');
  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      RefreshToken();
      dispatch(fetchProfileDetails());
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);

  useEffect(() => {
    dispatch(fetchProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      if (data) { setAccountObj(data?.userInfo) }
    };
    fetchUserData();
  }, []);
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
              {/* {!isPrimary && <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={() => navigation.navigate("ProfileSettingsEdit")}>
                <Text style={[styles.makePayment, styles.text1Clr]}>Edit</Text>
              </Pressable>} */}
            </View>
            <View style={styles.frameContainer}>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>First Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>
                  {isPrimary ? accountObj.firstName : profileDetails.firstName}
                </Text>
              </View>
              <View style={styles.firstNameParent} accessible={true} >
                <Text style={styles.firstName}>Last Name</Text>
                <Text style={[styles.melissa, styles.melissaTypo]}>{isPrimary ? accountObj.lastName : profileDetails.lastName}</Text>
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
                  type="info"
                  title={convertToSpecialCase(convertedRole)}
                  showCloseIcon={false}
                  message={roleBasedInfo}
                />
              </View>
            </View>
            <View style={[{ paddingHorizontal: Padding.p_5xl }, styles.frameParentSpaceBlock]}>
              <View style={styles.frameChild} />
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
