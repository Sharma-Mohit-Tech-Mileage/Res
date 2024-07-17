import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity ,Image} from "react-native";
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
const MyInternetDetials = ({ plans, billAmt, dueDate, navigation }) => {
  const [planSpeed, setPlanSpeed] = useState("");
  const [paperlessStatus,setPaperlessStatus] = useState(false);
  const [isAutoPayStatus,setIsAutoPayStatus] = useState(false);
  const uncheck = require("../../../assets/checkcircle1.png");
  const check = require("../../../assets/checkcircle.png");

  const getAutoPayStatus = () => {
    getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}/easypay`;
      GetApiRequest(request, onSuccessPay, onError);
    });
  };

  const getPaperlessStatus = () => {
    getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}/paperless/status`;
      GetApiRequest(request, onSuccessPaperless, onError);
    });
  };

  const onSuccessPay = (res) => {
    setIsAutoPayStatus(res?.isEasyPay)
    console.log("***********************************onSuccessPay*********************************", res);
  };
  const onSuccessPaperless = (res) => {
    setPaperlessStatus(res)
    console.log("***********************************onSuccessPay*********************************", res);
  };
  const onError = (error) => {
    console.log("error", error);
    console.log("***********************************onSuccessPay*********************************", res);
  };

  useEffect(() => {
    if (plans.length > 0) {
      setPlanSpeed(plans[0].downloadSpeed);
    }
    getAutoPayStatus();
    getPaperlessStatus();
  },[]);
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.shadowProp, styles.column, styles.marginVertical]}>
        <View style={[styles.row, styles.paddingHorizontal]}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
            style={styles.gradient}
          >
            <Wallet2icon />
          </LinearGradient>
          <Text style={styles.title}>{"Bill Summary"}</Text>
        </View>
        <View style={[styles.subSec,{marginTop:10}]}>
          <View style={styles.row}>
            <Text style={styles.dollarSign}>$</Text>
            <Text style={styles.subTitle}>{billAmt}</Text>
          </View>
          <Text style={[styles.date, styles.paddingRight]}>Due on {dueDate}</Text>
        </View>
        <View style={styles.subSec}>
          <View style={styles.row}>
            <Text style={styles.dollarSign}>Auto Pay</Text>
          </View>
          <Text style={[styles.date, styles.paddingRight]}><Image resizeMode="cover" source={isAutoPayStatus?check:uncheck}/></Text>
        </View>
        <View style={styles.subSec}>
          <View style={styles.row}>
            <Text style={styles.dollarSign}>Paperless</Text>
          </View>
          <Text style={[styles.date, styles.paddingRight]}><Image resizeMode="cover" source={paperlessStatus?check:uncheck}/></Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ArticalWindowUtility", {
              url: `${Env.URL}/billing`,
              name: "Billing Details",
            });
          }}
          style={styles.touchable}
          accessible={true}
          accessibilityLabel={`View Details`}
          accessibilityRole="button"
        >
          <Text style={styles.viewDetails}>{"View Details"}</Text>
          <RightArrow />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.shadowProp, styles.column, styles.marginVertical, styles.marginHorizontal]}>
        <View style={[styles.row, styles.paddingHorizontal]}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
            style={styles.gradient}
          >
            <Myplanicon />
          </LinearGradient>
          <Text style={styles.title}>My Plan</Text>
        </View>
        <View style={styles.subSec}>
          <View style={styles.row}>
            <Text style={styles.subTitle}>{planSpeed}</Text>
            <Text style={styles.mbSpeed}>mb/s</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ArticalWindowUtility", {
              url: `${Env.URL}/services/upgrade`,
              name: "Upgrade Plan",
            });
          }}
          style={styles.touchable}
          accessible={true}
          accessibilityLabel={`Upgrade Plan`}
          accessibilityRole="button"
        >
          <Text style={styles.viewDetails}>{"Upgrade Plan"}</Text>
          <RightArrow />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingVertical: 10,
    width: wp("84%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  marginVertical: {
    marginVertical: 20,
  },
  marginHorizontal: {
    marginHorizontal: 20,
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
    fontStyle: "normal",
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
    fontStyle: "normal",
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
  separator: {
    backgroundColor: "#F4F4F5",
    height: 1,
    marginTop: 10,
  },
  touchable: {
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  viewDetails: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
  },
  mbSpeed: {
    fontSize: 14,
    alignSelf: "center",
    color: colors.darkest_grey,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default MyInternetDetials;
