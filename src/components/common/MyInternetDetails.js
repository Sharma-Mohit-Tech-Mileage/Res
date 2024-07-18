import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import RightArrow from "../../res/svgIcons/RightArrow";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Wallet2icon from "../../res/svgIcons/Wallet2icon";
import Myplanicon from "../../res/svgIcons/Myplanicon";
import { FontFamily } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillingPaper } from "../../redux/actions/ProfileActionSuite";

const MyInternetDetails = ({ plans, billAmt, dueDate, navigation }) => {
  const dispatch = useDispatch();
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const paperLessInfo = profile.paperLessInfo || {};
  const uncheck = require("../../../assets/checkcircle1.png");
  const check = require("../../../assets/checkcircle.png");

  console.log("Paperless Info:", paperLessInfo);

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

  useEffect(() => {
    getStatus();
    dispatch(fetchBillingPaper());
  }, []);

  return (
    <View style={[styles.container, { marginVertical: 20 }]}>
      <View style={styles.row}>
        <View style={[styles.cardContainer]}>
          <View style={[styles.card, styles.shadowProp]}>
            <View style={styles.cardContent}>
              <View style={[styles.row, { paddingHorizontal: 20 }]}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                  style={styles.gradient}
                >
                  <Wallet2icon />
                </LinearGradient>
                <Text style={styles.title}>Bill Summary</Text>
              </View>
              <View style={[styles.subSec, { marginTop: 10 }]}>
                <View style={[styles.row, { flexWrap: "wrap" }]}>
                  <Text style={styles.dollarSign}>$</Text>
                  <Text style={styles.subTitle}>{billAmt}</Text>
                </View>
                <Text style={[styles.date, styles.paddingRight]}>Due on {dueDate}</Text>
              </View>
              <View style={styles.subSec}>
                <View style={[styles.row, { flexWrap: "wrap" }]}>
                  <Text style={styles.dollarSign}>Auto Pay</Text>
                </View>
                <Text style={[styles.dollarSign, styles.paddingRight]}>
                  <Image resizeMode="cover" source={isAutoPayStatus ? check : uncheck} />
                  {isAutoPayStatus ? " On" : " Off"}
                </Text>
              </View>
              <View style={styles.subSec}>
                <View style={[styles.row, { flexWrap: "wrap" }]}>
                  <Text style={styles.dollarSign}>Paperless</Text>
                </View>
                <Text style={[styles.dollarSign, styles.paddingRight]}>
                  <Image resizeMode="cover" source={paperlessStatus ? check : uncheck} />
                  {isAutoPayStatus ? " On" : " Off"}
                </Text>
              </View>
              <View style={styles.separator} />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ArticalWindowUtility", {
                  url: `${Env.URL}/billing`,
                  name: "Billing Details",
                });
              }}
              style={styles.touchable}
              accessible={true}
              accessibilityLabel="View Details"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>View Details</Text>
              <RightArrow />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.cardContainer]}>
          <View style={[styles.card, styles.shadowProp]}>
            <View style={styles.cardContent}>
              <View style={[styles.row, styles.paddingHorizontal]}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                  style={styles.gradient}
                >
                  <Myplanicon />
                </LinearGradient>
                <Text style={styles.title}>Auto Pay</Text>
              </View>
              <View style={styles.subSec}>
                <View style={[styles.row, { flexWrap: "wrap" }]}>
                <Text style={styles.subTitle}>{isAutoPayStatus ? " On" : " Off"}</Text>
                </View>
                <Text style={[styles.date, styles.paddingRight, styles.flexWrap]}>Account ending in {cardDigit}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.separator} />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ArticalWindowUtility", {
                  url: `${Env.URL}/billing`,
                  name: "Billing Details",
                });
              }}
              style={styles.touchable}
              accessible={true}
              accessibilityLabel="View Details"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>View Details</Text>
              <RightArrow />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.cardContainer]}>
          <View style={[styles.card, styles.shadowProp]}>
            <View style={styles.cardContent}>
              <View style={[styles.row, styles.paddingHorizontal]}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                  style={styles.gradient}
                >
                  <Myplanicon />
                </LinearGradient>
                <Text style={styles.title}>Paperless</Text>
              </View>
              <View style={styles.subSec}>
                <View style={[styles.row, { flexWrap: "wrap" }]}>
                  <Text style={styles.subTitle}>{paperlessStatus ? " On" : " Off"}</Text>
                </View>
                <Text style={[styles.date, styles.paddingRight, styles.flexWrap]}>{paperLessInfo?.emailAddress}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.separator} />
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ArticalWindowUtility", {
                  url: `${Env.URL}/billing`,
                  name: "Billing Details",
                });
              }}
              style={styles.touchable}
              accessible={true}
              accessibilityLabel="View Details"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>View Details</Text>
              <RightArrow />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingVertical: 10,
    flex: 1,
    width: wp("84%"),
    justifyContent: "space-between",
  },
  cardContent: {
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
  gradient: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.darkest_grey,
    fontSize: 20,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontWeight: "400",
    marginLeft: 10,
    marginTop: 10,
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingRight: 5,
    paddingHorizontal: 20,
  },
  dollarSign: {
    fontSize: 14,
    alignSelf: "center",
    color: colors.darkest_grey,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
  },
  subTitle: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color: colors.dark_grey,
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
  },
  paddingRight: {
    paddingRight: 10,
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  separator: {
    backgroundColor: "#F4F4F5",
    height: 1,
    marginTop: 10,
  },
  touchable: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewDetails: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default MyInternetDetails;
