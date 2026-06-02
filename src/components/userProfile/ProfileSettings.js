import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, Linking, Platform, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontFamily, FontSize, } from "../../../GlobalStyles";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchSMSSelection } from "../../redux/actions/ProfileActionSuite";
import { getPrimaryEmail } from "../utility/constant";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import { digitsToWords } from "../../utils/a11y";
import Touchable from "../common/customui/Touchable";
import RightArrow from "../../res/svgIcons/RightArrow";

const SUPPORT_PHONE = "833-807-1020";
const SUPPORT_HOURS_TRAILER = " Monday-Friday 9:00 AM-6:00 PM CST.";
const SUPPORT_CALL_A11Y_LABEL =
  "Call 833 807 1020 Monday through Friday 9:00 AM to 6:00 PM Central Standard Time";
const SUPPORT_CALL_A11Y_HINT = "Double tap to call customer service 833 807 1020";
const SUPPORT_HOURS_A11Y_LABEL =
  "Monday to Friday 9:00 AM to 6:00 PM Central Standard Time";

const dialSupport = () => {
  const dialUrl =
    Platform.OS === "android"
      ? `tel:${SUPPORT_PHONE}`
      : `telprompt:${SUPPORT_PHONE}`;
  Linking.openURL(dialUrl);
};

const CallSupportBlock = ({ showReconnectMessage }) => {
  const leadIn = showReconnectMessage
    ? "To reconnect your service, please call us at "
    : "To cancel or change service, please call us at ";

  const hoursText = (extraA11y) => (
    <Text
      style={styles.manageHoursText}
      accessibilityLabel={SUPPORT_HOURS_A11Y_LABEL}
      {...extraA11y}
    >
      {SUPPORT_HOURS_TRAILER}
    </Text>
  );

  const phoneLink = (extraHoursA11y) => (
    <Text
      style={styles.manageLinkText}
      onPress={dialSupport}
      accessibilityRole="link"
      accessibilityLabel={SUPPORT_CALL_A11Y_LABEL}
      accessibilityHint={SUPPORT_CALL_A11Y_HINT}
    >
      {SUPPORT_PHONE}
      {hoursText(extraHoursA11y)}
    </Text>
  );

  if (Platform.OS === "android") {
    return (
      <View style={styles.manageBlockAndroid}>
        <Text style={styles.manageBodyText}>
          {leadIn}
          {phoneLink({ accessible: true, importantForAccessibility: "yes" })}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.manageBlockIOS}>
      <Text style={styles.manageBodyText}>{leadIn}</Text>
      {phoneLink()}
    </View>
  );
};

const ProfileSettings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [smsRequested, setSmsRequested] = useState(false);
  const [smsFetchTimedOut, setSmsFetchTimedOut] = useState(false);
  const profileDetails = useSelector((s) => s.profile?.profileDetails || {});
  const accountDetails = useSelector((s) => s.profile?.accountDetails || {});
  const smsSubscription = useSelector((s) => s.profile?.smsSubscription || []);
  const userInfo = useSelector((s) => s.user?.userData?.userInfo);

  const emailAddress = getPrimaryEmail(accountDetails);

  useEffect(() => {
    if (!smsRequested) {
      return undefined;
    }
    const t = setTimeout(() => setSmsFetchTimedOut(true), 5000);
    return () => clearTimeout(t);
  }, [smsRequested]);

  const smsRow = smsSubscription[0];
  const phoneNumber = smsRow?.phoneNum || "";
  const showPhoneLoading = smsRequested && !smsRow && !smsFetchTimedOut;

  const TextNotifSettings = useMemo(() => {
    const statusFor = (i) => (smsRow?.smsMessageType?.[i]?.optOutFlag ? "Off" : "On");
    return [
      { id: "Appointment", type: "Appointments", status: smsRow ? statusFor(0) : "Off" },
      { id: "outage", type: "Outage", status: smsRow ? statusFor(1) : "Off" },
      { id: "billing", type: "Billing", status: smsRow ? statusFor(2) : "Off" },
    ];
  }, [smsRow]);

  const handleArrowPress = (fieldType) => {
    if (fieldType === "email") {
      navigation.navigate("EmailNotifications");
    } else if (fieldType === "mobile") {
      navigation.navigate("TextNotifications", {
        additionalData: {
          optOut: TextNotifSettings[0].status === "On",
          outageOptOut: TextNotifSettings[1].status === "On",
          billingOptOutStatus: TextNotifSettings[2].status === "On",
          phoneNumber,
        },
      });
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

  const formatAddress = (addr) => {
    const { line1, line2, city, state, zip, postal_code } = addr || {};
    const formattedLine1 = formatAddressPart(line1);
    const formattedLine2 = formatAddressPart(line2);
    const formattedCity = formatAddressPart(city);
    const formattedState = formatStatePart(state);
    const rawZip = (zip || postal_code || "").toString().trim();
    const formattedZip = rawZip ? rawZip.slice(0, 5) : "";
    const firstLine = `${formattedLine1}${formattedLine2 ? " " + formattedLine2 : ""}`.trim();
    const secondLine = `${formattedCity}${formattedState ? ", " + formattedState : ""}${
      formattedZip ? " " + formattedZip : ""
    }`.trim();

    return `${firstLine}${secondLine ? "\n" + secondLine : ""}`;
  };

  const serviceAddress = () => formatAddress(accountDetails.service_address);
  const billingAddress = () => formatAddress(accountDetails.bill_to_address);

  const formatAddressForAccessibility = (address) => {
    const addressText = (address || "").toString();
    if (!addressText) return "N/A";

    return addressText.replace(/\d+/g, (match) => digitsToWords(match));
  };

  const showReconnectMessage = userInfo
    ? isAccountDisconnected(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate,
      )
    : false;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(fetchSMSSelection());
      setSmsRequested(true);
      setSmsFetchTimedOut(false);
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  return (
    <View>
      <ProfileSettingsHeader
        title="Profile"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView accessibilityLabel="Profile settings page.">
        <View style={styles.scrollColumn}>
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={[styles.sectionHeader, styles.sectionHeaderTopGap]}>
                <Text
                  style={[styles.sectionTitle, styles.bodyText]}
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLevel={2}
                >
                  General Information
                </Text>
              </View>
              <View style={styles.rowGroup}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{"Customer Name"}</Text>
                  <Text style={[styles.rowValue, styles.bodyText]}>
                    {customerName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Username</Text>
                  <Text style={[styles.rowValue, styles.bodyText]}>
                    {profileDetails.userName}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Account Number</Text>
                  <Text
                    style={[styles.rowValue, styles.bodyText]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`Account Number ${
                      profileDetails.accountNumber
                        ? digitsToWords(profileDetails.accountNumber.toString())
                        : "N/A"
                    }`}
                  >
                    {profileDetails.accountNumber}
                  </Text>
                </View>

                <View
                  style={styles.editableRow}
                  accessible={false}
                  importantForAccessibility="no"
                >
                  <View
                    style={styles.editableContent}
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    <Text
                      style={styles.rowLabel}
                      accessible={true}
                      accessibilityRole="text"
                      accessibilityLabel="Email Address"
                    >
                      Email Address
                    </Text>
                    <Text
                      style={[styles.rowValue, styles.bodyText]}
                      accessible={true}
                      accessibilityRole="text"
                      accessibilityLabel={`Email Address: ${emailAddress || "N/A"}`}
                    >
                      {emailAddress || "N/A"}
                    </Text>
                  </View>
                  <Touchable
                    style={styles.editButton}
                    onPress={() => handleArrowPress("email")}
                    accessibilityLabel="Edit email address"
                    accessibilityHint="Double tap to edit your email address"
                  >
                    <RightArrow />
                  </Touchable>
                </View>

                {phoneNumber ? (
                  <View
                    style={styles.editableRow}
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    <View
                      style={styles.editableContent}
                      accessible={false}
                      importantForAccessibility="no"
                    >
                      <Text
                        style={styles.rowLabel}
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel="Mobile Number"
                      >
                        Mobile Number
                      </Text>
                      <Text
                        style={[styles.rowValue, styles.bodyText]}
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel={`Mobile Number: ${
                          phoneNumber
                            ? digitsToWords(phoneNumber.toString())
                            : "N/A"
                        }`}
                      >
                        {phoneNumber || "N/A"}
                      </Text>
                    </View>
                    <Touchable
                      style={styles.editButton}
                      onPress={() => handleArrowPress("mobile")}
                      accessibilityLabel="Edit mobile number"
                      accessibilityHint="Double tap to edit your mobile number"
                    >
                      <RightArrow />
                    </Touchable>
                  </View>
                ) : (
                  showPhoneLoading && (
                    <SkeletonPlaceholder>
                      <View style={styles.profileFieldSkeleton} />
                    </SkeletonPlaceholder>
                  )
                )}
              </View>
            </View>
          </View>

          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    styles.bodyText,
                    styles.sectionHeaderTopGap,
                  ]}
                  accessible={true}
                  accessibilityRole="header"
                  accessibilityLevel={2}
                >
                  Addresses
                </Text>
              </View>
              <View style={styles.rowGroup}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{"Service Address"}</Text>
                  <Text
                    style={[styles.rowValue, styles.bodyText, styles.addressValue]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={formatAddressForAccessibility(
                      serviceAddress(),
                    )}
                  >
                    {serviceAddress() || "N/A"}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>Billing Address</Text>
                  <Text
                    style={[styles.rowValue, styles.bodyText, styles.addressValue]}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={formatAddressForAccessibility(
                      billingAddress(),
                    )}
                  >
                    {billingAddress() || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.dividerWrapper}>
                <View style={styles.divider} />
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.manageCardSpacing]}>
            <View style={styles.manageInner}>
              <Text
                style={[styles.sectionTitle, styles.bodyText]}
                accessible={true}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Manage My Service
              </Text>
              <CallSupportBlock showReconnectMessage={showReconnectMessage} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollColumn: {
    flexDirection: "column",
    marginBottom: 300,
  },
  cardWrapper: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: "100%",
  },
  card: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  manageCardSpacing: {
    marginHorizontal: Padding.p_base,
  },
  manageInner: {
    padding: Padding.p_xl,
    flexDirection: "column",
  },
  sectionHeader: {
    paddingHorizontal: Padding.p_xl,
    alignItems: "center",
    flexDirection: "row",
  },
  sectionHeaderTopGap: {
    marginTop: Padding.p_base,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    fontWeight: "400",
  },
  bodyText: {
    color: Color.sparklightGray1,
    lineHeight: 28,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  rowGroup: {
    alignSelf: "stretch",
    marginTop: Padding.p_base,
  },
  row: {
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_xl,
    alignSelf: "stretch",
  },
  rowLabel: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
  },
  rowValue: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: "400",
  },
  addressValue: {
    lineHeight: 20,
    marginTop: Padding.p_9xs,
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
    paddingHorizontal: Padding.p_xl,
    marginBottom: Padding.p_9xs,
  },
  editButton: {
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
  dividerWrapper: {
    paddingHorizontal: Padding.p_5xl,
    marginTop: Padding.p_base,
    alignSelf: "stretch",
  },
  divider: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  manageBlockAndroid: {
    marginTop: Padding.p_xl,
  },
  manageBlockIOS: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Padding.p_xl,
  },
  manageBodyText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "400",
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.colorblack_100,
    marginTop: Padding.p_8xs,
  },
  manageLinkText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorMidnightblue,
    fontWeight: "700",
    fontSize: FontSize.size_base,
  },
  manageHoursText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    fontWeight: "700",
  },
});

export default ProfileSettings;
