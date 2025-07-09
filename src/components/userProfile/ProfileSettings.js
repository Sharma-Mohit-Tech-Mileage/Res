import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Linking, Pressable, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, Color, FontFamily, Border, FontSize, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import { getUserType, convertToSpecialCase, getRoleBasedMessage, } from "../utility/constant";
import NotificationAlert from "../common/customui/NotificationAlert";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import { RefreshToken } from "../user/Session";
import { GetApiRequest } from "../../network/APIClient";
import { shouldShowDisconnectedBanner } from "../../redux/selectors/profileSelectors";

const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isNewBiller, setIsNewBiller] = useState(false);
  const [isCancelService, setIsCancelService] = useState(true);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  const convertedRole = getUserType(profileDetails.memberType || "");
  const roleBasedInfo = getRoleBasedMessage(profileDetails.memberType || "");
  const showDisconnectedBanner = useSelector(shouldShowDisconnectedBanner);
  const accountDetails = useSelector(
      (state) => state.combinedReducers.profile?.accountDetails
    );

  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      try {
        RefreshToken();
      } catch (error) {
        navigation.navigate("Splash");
      }
      dispatch(fetchProfileDetails());
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);

  useEffect(() => {
    dispatch(fetchProfileDetails());
    if(accountDetails?.services.hsd){
      setIsCancelService(true);
      getPlanDetails();
    }
  }, [dispatch]);

  useEffect(() => {
    if (profileDetails?.accountNumber?.toString().length >= 16) {
      setIsNewBiller(true);
    }
  }, [profileDetails]);

  const makeCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const getPlanDetails = () => {
    const requestURL=`api/Plan/GetServiceDetails?accountNumber=${profileDetails.accountNumber}&includeEquipment=false&includeLocation=false`
    GetApiRequest(requestURL,onSuccess=(res)=>{}, onError=(error)=>{
      console.error("Error fetching plan details");
    });
  };

  return (
    <View style={{ zIndex: 1 }}>
      <ProfileSettingsHeader
        title="Profile"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView accessibilityLabel="Profile settings page.">
        <View style={{ flexDirection: "column", marginBottom: 300 }}>
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
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>
                    {isNewBiller ? "Customer Name" : "First Name"}
                  </Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {isNewBiller
                      ? profileDetails.fullName
                      : profileDetails.firstName}
                  </Text>
                </View>
                {!isNewBiller && (
                  <View style={styles.firstNameParent} accessible={true}>
                    <Text style={styles.firstName}>Last Name</Text>
                    <Text style={[styles.melissa, styles.melissaTypo]}>
                      {profileDetails.lastName}
                    </Text>
                  </View>
                )}
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>Username</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {profileDetails.userName}
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>Account Number</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {profileDetails.accountNumber}
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true}>
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
              <View
                style={[
                  { paddingHorizontal: Padding.p_5xl },
                  styles.frameParentSpaceBlock,
                ]}
              >
                <View style={styles.frameChild} />
              </View>
            </View>
          </View>
          <View style={[styles.frameGroup, { marginHorizontal: 16 }]}>
            <View style={{ padding: 20, flexDirection: "column" }}>
              <Text style={[styles.generalInformation, styles.melissaTypo]}>
                Manage My Service
              </Text>
              {showDisconnectedBanner ? (
                <View style={{ marginTop: 20 }}>
                  {Platform.OS === "android" ? (
                    <Text style={styles.manageSerTxt1}>
                      To reconnect your service, please call us at{" "}
                      <Text
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020"
                        accessibilityHint="Double tap to call customer service"
                      >
                        833-807-1020
                      </Text>
                      <Text
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessible={true}
                        importantForAccessibility="yes"
                      >
                        {" M-F 9:00 AM-6:00 PM CST."}
                      </Text>
                    </Text>
                  ) : (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                      <Text style={styles.manageSerTxt1}>
                        To reconnect your service, please call us at{" "}
                      </Text>
                      <Text
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020"
                        accessibilityHint="Double tap to call customer service"
                      >
                        833-807-1020
                      </Text>
                      <Text
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                      >
                        {" M-F 9:00 AM-6:00 PM CST."}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <>
                  {Platform.OS === "android" ? (
                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.manageSerTxt1}>
                        To cancel or change service, please call us at{" "}
                        <Text
                          style={styles.manageSerTxt2}
                          onPress={() => makeCall("833-807-1020")}
                          accessibilityRole="link"
                          accessibilityLabel="Call 833 807 1020"
                          accessibilityHint="Double tap to call customer service"
                        >
                          833-807-1020
                        </Text>
                        <Text
                          style={styles.manageSerTxt3}
                          accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                          accessible={true}
                          importantForAccessibility="yes"
                        >
                          {" M-F 9:00 AM-6:00 PM CST."}
                        </Text>
                      </Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginTop: 20 }}>
                      <Text style={styles.manageSerTxt1}>
                        To cancel or change service, please call us at{" "}
                      </Text>
                      <Text
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020"
                        accessibilityHint="Double tap to call customer service"
                      >
                        833-807-1020
                      </Text>
                      <Text
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                      >
                        {" M-F 9:00 AM-6:00 PM CST."}
                      </Text>
                    </View>
                  )}
                  {/* {isCancelService && (
                    <Pressable
                      style={{}}
                      onPress={() => navigation.navigate("cancelServiceSurvey")}
                      accessible={true}
                      accessibilityLabel="cancel Service"
                      accessibilityRole="button"
                    >
                      <Text style={[styles.manageSerTxt2,{marginVertical: 20,textDecorationLine: 'underline'}]}>
                        Cancel Service
                      </Text>
                    </Pressable>
                  )} */}
                </>
              )}
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
    fontWeight: "400",
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
    fontWeight: "400",
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
    marginTop: Padding.p_base,
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
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: "100%",
  },
  manageSerTxt1: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "400",
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.sparklightGray1,
    marginTop: 20,
  },
  manageSerTxt2: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorMidnightblue,
    fontWeight: "700",
    fontSize: FontSize.size_base,
  },
  manageSerTxt3: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    fontWeight: "700",
  },
});

export default ProfileSettings;