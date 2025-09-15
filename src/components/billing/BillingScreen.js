import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border, } from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import BillingIconWhite from "../../res/svgIcons/BillingIconWhite";
import Card from "../common/billerCards/BillerSummary";
import { useDispatch, useSelector } from "react-redux";
import AutoPayCard from "../common/billerCards/AutoPayCard";
import PeperLessCard from "../common/billerCards/PeperLessCard";
import {
  fetchACPUserAccountDetails,
  getPaperlessStatus,
} from "../../redux/actions/ProfileActionSuite";
import moment from "moment";
import Icon from "../common/Icon";
import { Env } from "../../network/apis/account/Constants";
import colors from "../../res/Colors";
import AppStyles from "../common/styles/AppStyles";
import { getPrimaryEmail } from "../utility/constant";
import LoadingOverlay from "../common/LoadingOverlay";
import RightIcon from "../../../assets/svgs/Chevonright";

const BillingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers.profile?.paperlessStatusAcp
  );
  const paperlessLoading = useSelector(
    (state) => state.combinedReducers.profile?.isPaperLessStatusLoading
  );
  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState();
  const [paperlessEmail, setPaperlessEmail] = useState(null);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({
    dueDate: null,
    billAmount: 0,
    pastPaymentDue: 0,
    email: null,
  });

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isAutoPayStatusLoad, setIsAutoPayStatusLoad] = useState(false);
  let paperlessCardEmail = paperlessEmail;


  useFocusEffect(
    useCallback(() => {
      setIsContentLoading(false);
      setBillAmt(undefined);
      dispatch(fetchACPUserAccountDetails());
    }, [])
  );

  // When Redux accountDetails is updated for ACP users, update local state.
  useEffect(() => {
    if (accountDetails) {
      const p_email = getPrimaryEmail(accountDetails);
      const userBillAmt =
        accountDetails.past_due_amount === 0
          ? accountDetails.current_balance
          : accountDetails.past_due_amount;
      setBillAmt(userBillAmt?.toFixed(2));
      const formattedDueDate =
        accountDetails.past_due_amount !== 0
          ? "Immediately"
          : moment(accountDetails.payment_due_date).format("ll");
      setDueDate(formattedDueDate);

      setDefaultPaymentDetails({
        dueDate: accountDetails.payment_due_date,
        billAmount: accountDetails.past_due_amount,
        pastPaymentDue: accountDetails.past_due_amount,
        email: p_email,
      });
      setPaperlessEmail(p_email);
      dispatch(getPaperlessStatus(p_email));

      setIsContentLoading(false);
    }
  }, [accountDetails, user]);

  return (
    <View style={styles.account} accessibilityLabel="Billing Services screen">
      <ProfileSettingsHeader
        title="Billing Services"
        iconAlignment="right"
        showIcon={false}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={styles.frameParent}>
        <View style={styles.rightActionableParent}>
          <View
            style={[
              styles.rightActionable,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <BillingIconWhite isSelected={false} />
          </View>
          <Text style={styles.melissaSmith}>Billing Services</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 20 }}
        >
          <View style={{ paddingBottom: 80, marginTop: Padding.p_5xl }}>
            {isContentLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingOverlay
                  loading={isContentLoading}
                  onRequestClose={() => {
                    setIsContentLoading(false);
                  }}
                />
              </View>
            ) : (
              <>
                <Card
                  billAmt={billAmt}
                  dueDate={dueDate}
                  navigation={navigation}
                  style={styles.card}
                />
                <AutoPayCard
                  cardDigit={cardDigit}
                  isAutoPayStatus={isAutoPayStatus}
                  paymentDetails={defaultPaymentDetails}
                  isStatusLoading={isAutoPayStatusLoad}
                  navigation={navigation}
                  
                />
                <PeperLessCard
                  paperlessCardEmail={paperlessCardEmail}
                  paperlessStatus={paperlessStatusAcp}
                  navigation={navigation}
                  isStatusLoading={paperlessLoading}
                />
                <View style={[AppStyles.card, styles.myModemSpaceBlock]}>
                  <View
                    style={[
                      styles.myModemWrapper,
                      styles.frameParentSpaceBlock1,
                    ]}
                  >
                    <Text style={styles.leftTitle}>Billing Options</Text>
                  </View>
                  <View
                    style={[
                      styles.supportAccordionParent,
                      styles.supportParentFlexBox,
                    ]}
                  >
                    <View style={styles.frameLayout} />
                    <TouchableOpacity
                      style={styles.frame9defaultSpaceBlock}
                      onPress={() => {
                        navigation.navigate("AutoPayPCIConnector", {
                          url: Env.PAY_METHOD,
                          name: "Manage Payment Method",
                          useNewPayment: true,
                          status: isAutoPayStatus,
                          paymentDetails: defaultPaymentDetails,
                          customPaymentUrl: Env.PAY_METHOD,
                        });
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Manage Payment Method"
                    >
                      {
                        <Icon
                          name="building-doc"
                          color={Color.colorMidnightblue}
                          size={20}
                          style={{ marginRight: 16 }}
                        />
                      }
                      <Text style={styles.modemHealthSupport}>
                        Manage Payment Method
                      </Text>
                      <RightIcon />
                    </TouchableOpacity>

                    <View style={styles.frameLayout} />
                    {
                      <TouchableOpacity
                        style={styles.frame9defaultSpaceBlock}
                        onPress={() => {
                          navigation.navigate("BillingBreakDown");
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="View Bill Breakdown"
                      >
                        {
                          <Icon
                            name="search-book"
                            color={Color.colorMidnightblue}
                            size={20}
                            style={{ marginRight: 16 }}
                          />
                        }
                        <Text style={styles.modemHealthSupport}>
                          {"View Bill Breakdown"}
                        </Text>
                        <RightIcon />
                      </TouchableOpacity>
                    }
                    <View style={styles.frameLayout} />
                    <TouchableOpacity
                      style={styles.frame9defaultSpaceBlock}
                      onPress={() => {
                        navigation.navigate("PaymentHistory");
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="View Payment History"
                    >
                      {
                        <Icon
                          name="document"
                          color={Color.colorMidnightblue}
                          size={20}
                          style={{ marginRight: 16 }}
                        />
                      }

                      <Text style={styles.modemHealthSupport}>
                        View Payment History
                      </Text>
                      <RightIcon />
                    </TouchableOpacity>
                    <View style={styles.frameLayout} />

                    <TouchableOpacity
                      style={styles.frame9defaultSpaceBlock}
                      onPress={() => {
                        navigation.navigate("BillingStatements"); // Direct navigation
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="View Billing Statements"
                    >
                      {
                        <Icon
                          name="bill-paid"
                          color={Color.colorMidnightblue}
                          size={20}
                          style={{ marginRight: 16 }}
                        />
                      }
                      <Text style={styles.modemHealthSupport}>
                        View Billing Statements
                      </Text>
                      <RightIcon />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  leftTitle: {
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  loadingContainer: {
    height: 500, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.sparklight_bright_purple,
    fontFamily: FontFamily.openSansRegular,
  },
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
  },
  navigationBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderStyle: "solid",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingTop: Padding.p_5xl,
  },
  rightIconLayout: {
    height: 24,
    width: 24,
    marginRight: 5,
  },
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    width: "100%",
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50,
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
  },
  melissaSmith: {
    fontSize: FontSize.size_3xl,
    width: 210,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 28,
    textAlign: "center",
  },
  rightActionableParent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 10,
    color: Color.colorGray_100,
    lineHeight: 28,
    fontSize: FontSize.size_base,
    flex: 1,
  },
  rightActionableGroup: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameChild: {
    paddingHorizontal: Padding.p_5xl,
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  makePayment: {
    width: 282,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  buttons: {
    width: "100%",
    paddingHorizontal: 0,
    justifyContent: "center",
    paddingVertical: Padding.p_base,
  },
  frameGroup: {
    marginTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
  },
  frameParent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  card: {
    height: 230,
  },
  myModem: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Color.sparklightWhite,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    overflow: "hidden",
  },
  myModemSpaceBlock: {
    paddingTop: Padding.p_base,
    alignSelf: "stretch",
  },
  myModem1: {
    textAlign: "left",
    fontSize: FontSize.size_3xl,
    flex: 1,
  },
  myModemWrapper: {
    paddingTop: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParentSpaceBlock1: {
    paddingBottom: Padding.p_5xl,
    alignSelf: "stretch",
  },
  myModem1Typo: {
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  frame9defaultSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  supportParentFlexBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  frameLayout: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  supportAccordionParent: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  modemHealthSupport: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  rightIconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default BillingScreen;
