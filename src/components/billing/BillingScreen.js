import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import BillingIconWhite from "../../res/svgIcons/BillingIconWhite";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import Card from "../common/billerCards/BillerSummary";
import { useDispatch, useSelector } from "react-redux";
import AutoPayCard from "../common/billerCards/AutoPayCard";
import PeperLessCard from "../common/billerCards/PeperLessCard";
import { fetchBillingPaper, fetchProfileDetails, fetchSvEmailAssociation } from "../../redux/actions/ProfileActionSuite";

import moment from "moment";
import { Env } from "../../network/apis/account/Constants";
import colors from "../../res/Colors";
import AppStyles from "../common/styles/AppStyles";

const BillingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState();
  const [accountNo, setAccountNo] = useState("");
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({ dueDate: null, billAmount: 0, pastPaymentDue: 0, email: null, });
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const paperLessInfo = profile.paperLessInfo || {};
  const { allSvEmailAssociated = [] } = profile;
  const paperlessEmails = allSvEmailAssociated.filter(email => email.invoice);
  const getUserAccountDetails = () => {
    setBillAmt(undefined);
    getUser().then((res) => {
      setAccountNo(res.userInfo.accountNumber);
      const request = `account/api/account/${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          console.log(
            "getUserAccountDetails for normal user :::::::::::::::::::::::::::::::::::::::",
            res
          );
          if (res) {
            //dispatch(saveAccountServices(res.services))
            function getFirstEmail(emailArray) {
              return emailArray && emailArray.length > 0 && emailArray[0]
                ? emailArray[0]
                : null;
            }
            // let dueDate = moment(res.paymentDueDate).format("ll");
            // setDueDate(dueDate);
            let dueDate = (res.pastDueAmount != 0) ? 'Immediately' : moment(res.paymentDueDate).format("ll");
            setDueDate(dueDate);
            setBillAmt((Math.round(res.currentBalance * 100) / 100).toFixed(2));
            let paymentDetails = { ...defaultPaymentDetails };
            paymentDetails.dueDate = res.paymentDueDate;
            paymentDetails.billAmount = (
              Math.round(res.currentBalance * 100) / 100
            ).toFixed(2);
            paymentDetails.pastPaymentDue = res.pastDueAmount;
            paymentDetails.email = getFirstEmail(res.email);
            setDefaultPaymentDetails(paymentDetails);
          }
        },
        onErrorBill
      );
    });
  };

  const onErrorBill = (error) => {
    console.log("error", error);
  };

  const getStatus = () => {
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      GetApiRequest(
        `account/api/account/${accountNumber}/easypay`,
        (res) => {
          setIsAutoPayStatus(res?.isEasyPay);
          setCardDigit(res?.epLastfour);
        },
        onError
      );
      GetApiRequest(
        `account/api/account/${accountNumber}/paperless/status`,
        setPaperlessStatus,
        onError
      );
    });
  };

  const onError = (error) => {
    console.log("error", error);
  };

  useFocusEffect(
    useCallback(() => {
      // getStatus();
      // getUserAccountDetails();
      // dispatch(fetchBillingPaper());
      // dispatch(fetchProfileDetails());
      if (user?.isNormalUser) {
        getStatus();
        getUserAccountDetails();
        dispatch(fetchBillingPaper());
        dispatch(fetchProfileDetails());
        dispatch(fetchSvEmailAssociation());
      } else {
        navigation.navigate("ArticalWindowUtility", {
          url: `${Env.PAYMENTURLNEW}`,
          name: "Billing Details",
          isBilling: true
        });

      }

    }, [])
  );
  useEffect(() => {
    console.log("Bill Amount", billAmt);
  }, [billAmt]);

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
      <View style={[styles.frameParent]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <Text
              accessibilityLabel="Billing services icon"
              style={[styles.text, { alignSelf: 'center', marginLeft: 5, marginTop: 5 }]}>
              <BillingIconWhite isSelected={false} />
            </Text>
            {/* <Text style={[styles.text,{alignSelf:'center',marginLeft:5,marginTop:5}]}>
              <BillingIconWhite isSelected={false} /> 
            </Text> */}
          </View>
          {/* Full name for profile */}
          <Text style={styles.melissaSmith}>{"Billing Services"}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 20 }}
        >
          <View style={{ paddingBottom: 100, marginTop: Padding.p_5xl }}>
            <Card
              billAmt={billAmt}
              dueDate={dueDate}
              acno={accountNo}
              isAutoPayStatus={isAutoPayStatus}
              paperlessStatus={paperlessStatus}
              navigation={navigation}
              style={styles.card}
              accessible={true}
              accessibilityLabel="Billing Summary Card"
            />
            <AutoPayCard
              billAmt={billAmt}
              cardDigit={cardDigit}
              isAutoPayStatus={isAutoPayStatus}
              paperlessStatus={paperlessStatus}
              paymentDetails={defaultPaymentDetails}
              navigation={navigation}
              style={styles.card}
              accessible={true}
              accessibilityLabel="Auto Pay Card"
            />

            <PeperLessCard
              billAmt={billAmt}
              paperLessInfo={paperlessEmails}
              isAutoPayStatus={isAutoPayStatus}
              paperlessStatus={paperlessStatus}
              navigation={navigation}
              style={styles.card}
              accessible={true}
              accessibilityLabel="Paperless Billing Card"
            />

            <View
              style={[
                AppStyles.card,
                styles.myModemSpaceBlock,

              ]}
            >
              <View
                style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}
              >
                <Text style={[styles.leftTitle]}>
                  Billing Options
                </Text>
              </View>
              <View
                style={[
                  styles.supportAccordionParent,
                  styles.supportParentFlexBox,
                ]}
              >
                <View style={[styles.frameLayout]} />

                <TouchableOpacity
                  style={[styles.frame9defaultSpaceBlock]}
                  onPress={() => {
                    navigation.navigate("ArticalWindowUtility", {
                      url: Env.VIEW_BILLINGS,
                      name: "View Billing Details",
                    });
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="View Billing Details"
                >

                  <Text style={styles.modemHealthSupport}>
                    View Billing Details
                  </Text>
                  <Image
                    style={styles.rightIconStyle}
                    source={require("../../../assets/chevronright.png")}
                  />
                </TouchableOpacity>

                <View style={[styles.frameLayout]} />
                <TouchableOpacity
                  style={[styles.frame9defaultSpaceBlock]}
                  onPress={() => {
                    navigation.navigate("ArticalWindowUtility", {
                      url: Env.VIEW_PAYMENT,
                      name: "View Payment History",
                    });
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="View Payment History"
                >

                  <Text style={styles.modemHealthSupport}>
                    View Payment History
                  </Text>
                  <Image
                    style={styles.rightIconStyle}
                    source={require("../../../assets/chevronright.png")}
                  />
                </TouchableOpacity>

                <View style={[styles.frameLayout]} />
                <TouchableOpacity
                  style={[styles.frame9defaultSpaceBlock]}
                  onPress={() => {
                    navigation.navigate("ArticalWindowUtility", {
                      url: Env.BILLING_HISTORY,
                      name: "View Billing History",
                    });
                  }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="View Billing History"
                >

                  <Text style={styles.modemHealthSupport}>
                    View Billing History
                  </Text>
                  <Image
                    style={styles.rightIconStyle}
                    source={require("../../../assets/chevronright.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
    fontWeight: "400",
    textAlign: "center",
    alignContent: "flex-start",
    alignSelf: "center",
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
    height: 230, // Set the height for the cards
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
  frame9defaultSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
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
