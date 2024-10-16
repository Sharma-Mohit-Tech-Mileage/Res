import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
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
import { fetchBillingPaper, fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";

const BillingScreen = ({ billAmt, dueDate,paymentDetails, navigation }) => {
    const dispatch = useDispatch();
  const [initials, setInitials] = useState("");
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const paperLessInfo = profile.paperLessInfo || {};

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
      getStatus();
      dispatch(fetchBillingPaper());
      dispatch(fetchProfileDetails());
    }, [])
  );

  return (
    <View style={styles.account} accessibilityLabel="Account screen">
      <ProfileSettingsHeader
        title="Account"
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
            <Text style={styles.text}>
              <BillingIconWhite isSelected={false} />
            </Text>
          </View>
          {/* Full name for profile */}
          <Text style={styles.melissaSmith}>{"Billing Services"}</Text>
        </View>
        <ScrollView style={{ marginHorizontal: 20 }}>
          <View>
            <Card
              billAmt={billAmt}
              dueDate={dueDate}
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
              paymentDetails={paymentDetails}
              navigation={navigation}
              style={styles.card}
              accessible={true}
              accessibilityLabel="Auto Pay Card"
             
            />

            <PeperLessCard
              billAmt={billAmt}
              paperLessInfo={paperLessInfo}
              isAutoPayStatus={isAutoPayStatus}
              paperlessStatus={paperlessStatus}
              navigation={navigation}
              style={styles.card}
              accessible={true}
              accessibilityLabel="Paperless Billing Card"
              
            />
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
  },card: {
    height: 230,  // Set the height for the cards
  },
});

export default BillingScreen;
