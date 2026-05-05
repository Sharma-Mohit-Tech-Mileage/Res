import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Padding,
  Color,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import NotificationAlert from "../common/customui/NotificationAlert";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import { getPrimaryEmail } from "../utility/constant";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import Vector from "../../../src/res/svgIcons/Vector";
const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector((state) => state.profile || {});

  const handleArrowPress = (fieldType) => {
    console.log(`Arrow pressed for: ${fieldType}`);
    // Add your callback logic here
  };
  const profileDetails = profile.profileDetails || {};
  const accountDetails = profile.accountDetails || {};

  

  const customerFirstName =
    accountDetails.first_name ||
    accountDetails.firstName ||
    profileDetails.firstName ||
    "";
  const customerLastName =
    accountDetails.last_name ||
    accountDetails.lastName ||
    profileDetails.lastName ||
    "";
  const customerName =
    `${customerFirstName} ${customerLastName}`.trim() ||
    profileDetails.fullName ||
    "";

  const userInfo = useSelector(
    (state) => state.user.userData.userInfo
  );

  const serviceAddress = () => {
    const serviceAddr = accountDetails.service_address || {};
    const { line1, line2, city, state, zip } = serviceAddr;
    return `${line1 || ""}${line2 ? ", " + line2 : ""}${
      city ? ", " + city : ""
    }${state ? ", " + state : ""}${zip ? " " + zip : ""}`;
  }

  const billingAddress = () => {
    const billingAddr = accountDetails.bill_to_address || {};
    const { line1, line2, city, state, zip } = billingAddr;
    return `${line1 || ""}${line2 ? ", " + line2 : ""}${
      city ? ", " + city : ""
    }${state ? ", " + state : ""}${zip ? " " + zip : ""}`;
  }

const numberToWordsForAccessibility = (numStr) => {
  if (!numStr) return "";
  const digitsMap = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  };
  return numStr
    .split("")
    .map((digit) => digitsMap[digit] || digit)
    .join(" ");
};

  const showReconnectMessage = userInfo
    ? isAccountDisconnected(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate
      )
    : false;
  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      dispatch(fetchProfileDetails());
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);

  const makeCall = (number) => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
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
              {/* <View style={styles.infoWrapper}>
                <NotificationAlert
                  type="success"
                  title="Success"
                  message="Your profile settings have been successfully saved."
                  showCloseIcon={true}
                  isVisible={showSuccessAlert}
                  onClose={() => setShowSuccessAlert(false)}
                />
              </View> */}
              <View style={[styles.generalInformationParent,{marginTop: Padding.p_base}]}>
                <Text style={[styles.generalInformation, styles.melissaTypo]} accessible={true} accessibilityRole="header" accessibilityLevel={2}>
                  General Information
                </Text>
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>{"Customer Name"}</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {customerName}
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>Username</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {profileDetails.userName}
                  </Text>
                </View>

               <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>   
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel={`Email address`} accessibilityRole="text">
                  <Text style={styles.firstName}>Email Address</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {getPrimaryEmail(accountDetails) || "N/A"}
                  </Text>
                </View> 
               <Pressable 
                  style={{justifyContent: 'flex-end', paddingRight: Padding.p_base}}
                  onPress={() => handleArrowPress('email')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Edit email address">
                  <Vector/> 
                </Pressable>
               </View>  
                 
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={[styles.firstNameParent,{marginBottom: Padding.p_base}]} accessible={true} accessibilityLabel={`Mobile number`} accessibilityRole="text">
                  <Text style={styles.firstName}>Mobile Number</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {profileDetails.accountNumber}
                  </Text>
                </View>   
                <Pressable 
                  style={{justifyContent: 'flex-end', paddingRight: Padding.p_base}}
                  onPress={() => handleArrowPress('mobile')}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Edit mobile number">
                  <Vector/> 
                </Pressable>
               </View>
              </View>
             
            </View>
          </View>


          <View style={styles.frameParent}>
            <View style={[styles.frameGroup]}>
              <View style={[styles.generalInformationParent]}>
                <Text style={[styles.generalInformation, styles.melissaTypo,{marginTop: Padding.p_base}]} accessible={true} accessibilityRole="header" accessibilityLevel={2}>
                  Addresses
                </Text>
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>{"Service Address"}</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {serviceAddress() || "N/A"}
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true}>
                  <Text style={styles.firstName}>Billing Address</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    {billingAddress() || "N/A"}
                  </Text>
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
          <View style={[styles.frameGroup, { marginHorizontal: Padding.p_base }]}>
            <View style={{ padding: Padding.p_xl, flexDirection: "column" }}>
              <Text style={[styles.generalInformation, styles.melissaTypo]} accessible={true} accessibilityRole="header" accessibilityLevel={2}>
                Manage My Service
              </Text>
              {showReconnectMessage ? (
                // Show reconnect message, no link
                Platform.OS === "android" ? (
                  <View style={{ marginTop: 20 }}>
                    <Text style={styles.manageSerTxt1}>
                      To reconnect your service, please call us at{" "}
                      <Text
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessibilityHint="Double tap to call customer service 833 807 1020"
                      >
                        833-807-1020
                        <Text
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessible={true}
                        importantForAccessibility="yes"
                      >
                        {" Monday-Friday 9:00 AM-6:00 PM CST."}
                      </Text>
                      </Text>
                      
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text style={styles.manageSerTxt1}>
                      To reconnect your service, please call us at{" "}
                    </Text>
                    <Text
                      style={styles.manageSerTxt2}
                      onPress={() => makeCall("833-807-1020")}
                      accessibilityRole="link"
                      accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                      accessibilityHint="Double tap to call customer service 833 807 1020"
                    >
                      833-807-1020
                      <Text
                      style={styles.manageSerTxt3}
                      accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                    >
                      {" Monday-Friday 9:00 AM-6:00 PM CST."}
                    </Text>
                    </Text>
                    
                  </View>
                )
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
                          accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                          accessibilityHint="Double tap to call customer service 833 807 1020"
                        >
                          833-807-1020
                          <Text
                          style={styles.manageSerTxt3}
                          accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                          accessible={true}
                          importantForAccessibility="yes"
                        >
                          {" Monday-Friday 9:00 AM-6:00 PM CST."}
                        </Text>
                        </Text>
                        
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text style={styles.manageSerTxt1}>
                        To cancel or change service, please call us at{" "}
                      </Text>
                      <Text
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessibilityHint="Double tap to call customer service 833 807 1020"
                      >
                        833-807-1020
                        <Text
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                      >
                        {" Monday-Friday 9:00 AM-6:00 PM CST."}
                      </Text>
                      </Text>
                      
                    </View>
                  )}
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
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
    flexDirection: "row",
  },
  firstName: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
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
    paddingHorizontal: Padding.p_xl,
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
    paddingHorizontal: Padding.p_xl,
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
    color: "#000000",
    marginTop: 5,
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
