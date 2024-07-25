import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import RightArrow from "../../res/svgIcons/RightArrow";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Wallet2icon from "../../res/svgIcons/Wallet2icon";
import AutoPayIcon from "../../res/svgIcons/AutoPayIcon";
import Myplanicon from "../../res/svgIcons/Myplanicon";
import { FontFamily } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillingPaper,fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import {isFreshEntry } from '../../components/utility/constant';
const MyInternetDetails = ({ plans, billAmt, dueDate, navigation }) => {
  const dispatch = useDispatch();
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const paperLessInfo = profile.paperLessInfo || {};
  const profileDetails = profile.profileDetails || {};
  const uncheck = require("../../../assets/checkcircle1.png");
  const check = require("../../../assets/checkcircle.png");

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
    dispatch(fetchProfileDetails());
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
                <Text style={styles.dollarSign}>Auto Pay</Text>
                <View style={[styles.statusContainer,{paddingRight: 10}]}>
                  <Image resizeMode="cover" source={isAutoPayStatus ? check : uncheck} style={styles.icon} />
                  <Text style={[styles.statusText]}>
                    {isAutoPayStatus ? " On" : " Off"}
                  </Text>
                </View>
              </View>
              <View style={styles.subSec}>
                <Text style={styles.dollarSign}>Paperless</Text>
                <View style={[styles.statusContainer,{paddingRight: 10}]}>
                  <Image resizeMode="cover" source={paperlessStatus ? check : uncheck} style={styles.icon} />
                  <Text style={[styles.statusText]}>
                    {paperlessStatus ? " On" : " Off"}
                  </Text>
                </View>
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
              accessibilityLabel="Make a Payment"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>Make a Payment</Text>
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
                  <AutoPayIcon />
                </LinearGradient>
                <Text style={styles.title}>Auto Pay</Text>
              </View>
              <View style={styles.subSec}>
                <Text style={[styles.cardTitle, { color: !isAutoPayStatus ? colors.darkest_grey : colors.sparklight_green }]}>
                  {isAutoPayStatus ? " On" : " Off"}
                </Text>
                {isAutoPayStatus ? (
                  <Text style={[styles.date, styles.paddingRight, styles.textContainer, styles.rightAlign]}>
                    Account ending in {cardDigit}
                  </Text>
                ) : null}
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
              accessibilityLabel="Manage Auto Pay"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>Manage Auto Pay</Text>
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
                <Text style={[styles.cardTitle, { color: !paperlessStatus ? colors.darkest_grey : colors.sparklight_green }]}>
                  {paperlessStatus ? " On" : " Off"}
                </Text>
                <Text style={[styles.date, styles.paddingRight, styles.textContainer, styles.rightAlign]}>
                  {paperlessStatus?paperLessInfo?.emailAddress:""}
                </Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={styles.separator} />
            </View>
            <TouchableOpacity
              
              onPress={() => {
                navigation.navigate('account', {
                  screen: 'EmailNotifications',
                  params: {
                  additionalData: {
                    status: paperLessInfo?.paperlessStatus === 'Active',
                    email: paperLessInfo.emailAddress || profileDetails.svEmailAddress,
                    isNew: isFreshEntry(paperLessInfo),
                    critNotif: !!profileDetails.svEmailAddress
                  }
                }
                })
              }}
              style={styles.touchable}
              accessible={true}
              accessibilityLabel="Manage Paperless"
              accessibilityRole="button"
            >
              <Text style={styles.viewDetails}>Manage Paperless</Text>
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
    alignItems: "center",
  },
  dollarSign: {
    fontSize: 14,
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
  cardTitle: {
    color: colors.sparklight_green,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color: colors.dark_grey,
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
    flexWrap: "wrap",
  },
  paddingRight: {
    paddingRight: 10,
  },
  textContainer: {
    maxWidth: wp("45%"), // Adjust the max width as needed
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  rightAlign: {
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 'auto',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color:colors.darkest_grey
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
