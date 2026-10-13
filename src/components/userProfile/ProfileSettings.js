import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, View, Linking, Platform } from "react-native";
import Touchable from "../common/customui/Touchable";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Padding,
  Color,
  FontFamily,
  Border,
  FontSize,
} from "../../styles/GlobalStyles";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import { getPrimaryEmail } from "../utility/constant";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import EditIcon from "../../../assets/svgs/EditIcon";
import { A11Y } from "../../styles/theme";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import AppStyles from "../../styles/AppStyles";
import { container } from "../../styles/utilities";
import {
  SectionTitle,
  FieldTitle,
  FieldContent,
  Hyperlink,
} from "../common/customui/Typography";
import { A11y } from "react-native-a11y-order";
import AddIcon from "../../res/svgIcons/AddIcon";
import { ScreenScroll } from "../common/customui/Screen";
import { logError } from "../../utils/logger";

const ProfileSettings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [showPhoneLoading, setShowPhoneLoading] = useState(false);
  const [showEmailLoading, setShowEmailLoading] = useState(false);
  const profile = useSelector((state) => state.profile || {});
  const profileDetails = profile.profileDetails || {};
  const accountDetails = profile.accountDetails || {};

  const emailAddress = getPrimaryEmail(accountDetails);

  useEffect(() => {
    setShowEmailLoading(false);
  }, [profile, emailAddress]);

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
    [],
  );

  const handleArrowPress = (fieldType) => {
    if (fieldType === "email") {
      navigation.navigate("EmailNotifications", {
        is_enrolled: emailAddress,
        email: emailAddress,
      });
    } else if (fieldType === "mobile") {
      navigation.navigate("TextNotifications", {
        additionalData: {
          optOut: TextNotifSettings[0].status == "On" ? true : false,
          outageOptOut: TextNotifSettings[1].status == "On" ? true : false,
          billingOptOutStatus:
            TextNotifSettings[2].status == "On" ? true : false,
          phoneNumber: phoneNumber,
        },
      });
    } else if (fieldType === "username") {
      navigation.navigate("ProfileSettingsEdit", { field: "userName" });
    }
  };

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

  const userInfo = useSelector((state) => state.user.userData.userInfo);

  const formatAddressPart = (value) => {
    const input = (value || "").trim();
    if (!input) return "";

    return input
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatStatePart = (value) => {
    const input = (value || "").trim();
    if (!input) return "";

    return input.toUpperCase();
  };

  const serviceAddress = () => {
    const serviceAddr = accountDetails.service_address || {};
    const { line1, line2, city, state, zip, postal_code } = serviceAddr;
    const formattedLine1 = formatAddressPart(line1);
    const formattedLine2 = formatAddressPart(line2);
    const formattedCity = formatAddressPart(city);
    const formattedState = formatStatePart(state);
    const rawZip = (zip || postal_code || "").toString().trim();
    const formattedZip = rawZip ? rawZip.slice(0, 5) : "";
    const firstLine = `${formattedLine1}${
      formattedLine2 ? " " + formattedLine2 : ""
    }`.trim();
    const secondLine = `${formattedCity}${
      formattedState ? ", " + formattedState : ""
    }${formattedZip ? " " + formattedZip : ""}`.trim();

    return `${firstLine}${secondLine ? "\n" + secondLine : ""}`;
  };

  const billingAddress = () => {
    const billingAddr = accountDetails.bill_to_address || {};
    const { line1, line2, city, state, zip, postal_code } = billingAddr;
    const formattedLine1 = formatAddressPart(line1);
    const formattedLine2 = formatAddressPart(line2);
    const formattedCity = formatAddressPart(city);
    const formattedState = formatStatePart(state);
    const rawZip = (zip || postal_code || "").toString().trim();
    const formattedZip = rawZip ? rawZip.slice(0, 5) : "";
    const firstLine = `${formattedLine1}${
      formattedLine2 ? " " + formattedLine2 : ""
    }`.trim();
    const secondLine = `${formattedCity}${
      formattedState ? ", " + formattedState : ""
    }${formattedZip ? " " + formattedZip : ""}`.trim();

    return `${firstLine}${secondLine ? "\n" + secondLine : ""}`;
  };

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

  const formatAddressForAccessibility = (address) => {
    const addressText = (address || "").toString();
    if (!addressText) return "N/A";

    return addressText.replace(/\d+/g, (match) =>
      numberToWordsForAccessibility(match),
    );
  };

  const getTextNotificationsData = () => {
    setShowPhoneLoading(true);
    getUser().then((res1) => {
      const endpointUrl = getEndpoint(ENDPOINTS.SMS_NOTIFICATION_PREFS, {
        accountNumber: res1.userInfo?.accountNumber,
      });
      GetApiRequest(
        endpointUrl,
        (res) => {
          setShowPhoneLoading(false);
          if (res) {
            if (res[0]?.smsMessageType) {
              res[0]?.smsMessageType.forEach((value, index) => {
                TextNotifSettings[index].status = value?.optOutFlag
                  ? "Off"
                  : "On";
              });
              let phoneNum = res[0]?.phoneNum || "";
              setPhoneNumber(phoneNum);
            }
          }
          setShowPhoneLoading(false);
        },
        (error) => {
          setShowPhoneLoading(false);
          logError("Error on retrying getTextNotificationsData", error);
        },
      );
    });
  };

  const showReconnectMessage = userInfo
    ? isAccountDisconnected(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate,
      )
    : false;


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Call your API here
      dispatch(fetchProfileDetails());
      setShowEmailLoading(true);
      getTextNotificationsData();
    });
    return unsubscribe;
  }, [navigation]);

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
    <View style={{ flex: 1, zIndex: 1 }}>
      <ProfileSettingsHeader
        title="Profile"
        onPressBack={() => navigation.goBack()}
      />
      <ScreenScroll framed accessibilityLabel="Profile settings page.">
        <View style={container.stack}>
          <View style={styles.frameParent}>
            <View style={[AppStyles.card]}>
              <View
                style={[
                  styles.generalInformationParent,
                  { marginTop: Padding.p_base },
                ]}
              >
                <SectionTitle
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLevel={2}
                >
                  General Information
                </SectionTitle>
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent}>
                  <FieldTitle>{"Customer Name"}</FieldTitle>
                  <FieldContent
                    style={[styles.melissa, styles.melissaTypo]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`Customer Name: ${
                      customerName || "N/A"
                    }`}
                  >
                    {customerName}
                  </FieldContent>
                </View>
                <A11y.Order style={styles.editableRow}>
                  <A11y.Index index={0}>
                    <View style={[styles.editableContent, { marginBottom: Padding.p_9xs }]}>
                      <FieldTitle
                        style={styles.firstName}
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel="Username"
                      >
                        Username
                      </FieldTitle>

                      <FieldContent
                        style={[styles.melissa, styles.melissaTypo]}
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel={`Username: ${
                          profileDetails.userName || "No username on file."
                        }`}
                      >
                        {profileDetails.userName || "No username on file."}
                      </FieldContent>
                    </View>
                  </A11y.Index>
                  <A11y.Index index={1}>
                    <Touchable
                      style={styles.editButton}
                      onPress={() => handleArrowPress("username")}
                      accessibilityRole="button"
                      accessibilityLabel={
                        profileDetails.userName ? "Edit username" : "Add username"
                      }
                      accessibilityHint={
                        profileDetails.userName
                          ? "Double tap to edit your username"
                          : "Double tap to add your username"
                      }
                    >
                      {profileDetails.userName ? <EditIcon /> : <AddIcon />}
                    </Touchable>
                  </A11y.Index>
                </A11y.Order>

                <View style={styles.firstNameParent}>
                  <FieldTitle>Account Number</FieldTitle>
                  <FieldContent
                    style={[styles.melissa, styles.melissaTypo]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`Account Number ${
                      profileDetails.accountNumber
                        ? numberToWordsForAccessibility(
                            profileDetails.accountNumber.toString(),
                          )
                        : "N/A"
                    }`}
                  >
                    {profileDetails.accountNumber}
                  </FieldContent>
                </View>
                {showEmailLoading ? (
                  <SkeletonPlaceholder>
                    <View style={styles.profileFieldSkeleton} />
                  </SkeletonPlaceholder>
                ) : (
                  
                    <A11y.Order style={styles.editableRow}>
                      <A11y.Index index={0} style={[
                          styles.editableContent,
                          { marginBottom: Padding.p_9xs },
                        ]}>
                      <View
                        
                      >
                        <FieldTitle
                          style={styles.firstName}
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel="Email Address"
                        >
                          Email Address
                        </FieldTitle>
                    
                        <FieldContent
                          style={[styles.melissa, styles.melissaTypo]}
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel={`Email Address: ${
                            emailAddress || "No email address on file."
                          }`}
                        >
                          {emailAddress || "No email address on file."}
                        </FieldContent>
                      </View>
                      </A11y.Index>
                      <A11y.Index index={1}>
                      <Touchable
                        style={styles.editButton}
                        onPress={() => handleArrowPress("email")}
                        accessibilityRole="button"
                        accessibilityLabel=
                        {emailAddress ? "Edit email address" : "Add email address"}
                        accessibilityHint={emailAddress ? "Double tap to edit your email address" : "Double tap to add your email address"}
                      >
                       { emailAddress ? <EditIcon /> : <AddIcon /> }
                      </Touchable>
                      </A11y.Index>
                    </A11y.Order>
                  
                )}

                {showPhoneLoading ? (
                  <SkeletonPlaceholder>
                    <View style={styles.profileFieldSkeleton} />
                  </SkeletonPlaceholder>
                ) : (
                  
                    <A11y.Order style={[styles.editableRow, { marginBottom: Padding.p_9xs }]}> 
                      <A11y.Index index={0}>
                      <View
                        style={[
                          styles.editableContent,
                          { marginBottom: Padding.p_9xs },
                        ]}
                      >
                        <FieldTitle
                          style={styles.firstName}
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel="Mobile Number"
                        >
                          Mobile Number
                        </FieldTitle>

                        <FieldContent
                          style={[styles.melissa, styles.melissaTypo]}
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel={`Mobile Number: ${
                            phoneNumber
                              ? numberToWordsForAccessibility(
                                  phoneNumber.toString(),
                                )
                              : "No phone number on file."
                          }`}
                          accessibilityHint={phoneNumber ? "Double tap to edit your mobile number" : "Double tap to add your mobile number"}
                        >
                          {phoneNumber || "No phone number on file."}
                        </FieldContent>
                      </View>
                      </A11y.Index>
                      <A11y.Index index={1}>
                      <Touchable
                        style={styles.editButton}
                        onPress={() => handleArrowPress("mobile")}
                        accessibilityRole="button"
                        accessibilityLabel="Edit mobile number"
                        accessibilityHint="Double tap to edit your mobile number"
                      >
                        { phoneNumber ? <EditIcon /> : <AddIcon /> }
                      </Touchable>

                    </A11y.Index>
                    </A11y.Order>
                  
                )}
              </View>
            </View>
          </View>

          <View style={styles.frameParent}>
            <View style={[AppStyles.card]}>
              <View style={[styles.generalInformationParent]}>
                <SectionTitle
                  style={[{ marginTop: Padding.p_base }]}
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLevel={2}
                >
                  Addresses
                </SectionTitle>
              </View>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent}>
                  <FieldTitle
                    style={styles.firstName}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel="Service Address"
                  >
                    Service Address
                  </FieldTitle>
                  <FieldContent
                    style={[
                      styles.melissa,
                      styles.melissaTypo,
                      { lineHeight: 20, marginTop: 4 },
                    ]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={` ${formatAddressForAccessibility(
                      serviceAddress(),
                    )}`}
                  >
                    {serviceAddress() || "N/A"}
                  </FieldContent>
                </View>
                <View style={styles.firstNameParent}>
                  <FieldTitle
                    style={styles.firstName}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel="Billing Address"
                  >
                    Billing Address
                  </FieldTitle>
                  <FieldContent
                    style={[
                      styles.melissa,
                      styles.melissaTypo,
                      { lineHeight: 20, marginTop: 4 },
                    ]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={` ${formatAddressForAccessibility(
                      billingAddress(),
                    )}`}
                  >
                    {billingAddress() || "N/A"}
                  </FieldContent>
                </View>
              </View>
              <View
                style={[
                  { paddingHorizontal: Padding.p_5xl },
                  styles.frameParentSpaceBlock,
                ]}
              >
                {/* <View style={styles.frameChild} /> */}
              </View>
            </View>
          </View>
          <View style={AppStyles.card}>
            <View style={{ padding: Padding.p_xl, flexDirection: "column" }}>
              <SectionTitle
                accessible={true}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Manage My Service
              </SectionTitle>
              {showReconnectMessage ? (
                // Show reconnect message, no link
                Platform.OS === "android" ? (
                  <View style={{ marginTop: 20 }}>
                    <FieldContent style={styles.manageSerTxt1}>
                      To reconnect your service, please call us at{" "}
                      <FieldContent
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessibilityHint="Double tap to call customer service 833 807 1020"
                      >
                        <Hyperlink style={styles.phoneLinkText}>833-807-1020</Hyperlink>
                        <FieldContent
                          style={styles.manageSerTxt3}
                          accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                          accessible={true}
                          importantForAccessibility="yes"
                        >
                          {" Monday-Friday 9:00 AM-6:00 PM CST."}
                        </FieldContent>
                      </FieldContent>
                    </FieldContent>
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
                    <FieldContent style={styles.manageSerTxt1}>
                      To reconnect your service, please call us at{" "}
                    </FieldContent>
                    <FieldContent
                      style={styles.manageSerTxt2}
                      onPress={() => makeCall("833-807-1020")}
                      accessibilityRole="link"
                      accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                      accessibilityHint="Double tap to call customer service 833 807 1020"
                    >
                      <Hyperlink style={styles.phoneLinkText}>833-807-1020</Hyperlink>
                      <FieldContent
                        style={styles.manageSerTxt3}
                        accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                      >
                        {" Monday-Friday 9:00 AM-6:00 PM CST."}
                      </FieldContent>
                    </FieldContent>
                  </View>
                )
              ) : (
                <>
                  {Platform.OS === "android" ? (
                    <View style={{ marginTop: 20 }}>
                      <FieldContent style={styles.manageSerTxt1}>
                        To cancel or change service, please call us at{" "}
                        <FieldContent
                          style={styles.manageSerTxt2}
                          onPress={() => makeCall("833-807-1020")}
                          accessibilityRole="link"
                          accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                          accessibilityHint="Double tap to call customer service 833 807 1020"
                        >
                          <Hyperlink style={styles.phoneLinkText}>833-807-1020</Hyperlink>
                          <FieldContent
                            style={styles.manageSerTxt3}
                            accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                            accessible={true}
                            importantForAccessibility="yes"
                          >
                            {" Monday-Friday 9:00 AM-6:00 PM CST."}
                          </FieldContent>
                        </FieldContent>
                      </FieldContent>
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
                      <FieldContent style={styles.manageSerTxt1}>
                        To cancel or change service, please call us at{" "}
                      </FieldContent>
                      <FieldContent
                        style={styles.manageSerTxt2}
                        onPress={() => makeCall("833-807-1020")}
                        accessibilityRole="link"
                        accessibilityLabel="Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time"
                        accessibilityHint="Double tap to call customer service 833 807 1020"
                      >
                        <Hyperlink style={styles.phoneLinkText}>833-807-1020</Hyperlink>
                        <FieldContent
                          style={styles.manageSerTxt3}
                          accessibilityLabel="Monday to Friday 9:00 AM to 6:00 PM Central Standard Time"
                        >
                          {" Monday-Friday 9:00 AM-6:00 PM CST."}
                        </FieldContent>
                      </FieldContent>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  melissaTypo: {
    color: Color.sparklightGray1,
    lineHeight: 28,
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  buttonsLayout: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  text1Clr: {
    color: Color.Gray300,
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
    fontFamily: FontFamily.RadioCanadaRegular,
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
    textAlign: "left",
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
  editableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editableContent: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_xl,
  },
  editButton: {
    width: A11Y.minTouch,
    height: A11Y.minTouch,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Padding.p_base,
  },
  profileFieldSkeleton: {
    height: 40,
    width: "90%",
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    borderRadius: 5,
  },
  text: {
    color: Color.sparklightGreen,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    textAlign: "center",
  },
  badge: {
    borderColor: Color.success50,
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
    width: "100%",
  },
  manageSerTxt1: {
    textAlign: "left",
    lineHeight: 20,
    marginTop: 5,
  },
  manageSerTxt2: {
    lineHeight: 20,
  },
  phoneLinkText: {
    textDecorationLine: "underline",
  },
  manageSerTxt3: {
    lineHeight: 20,
  },
});

export default ProfileSettings;
