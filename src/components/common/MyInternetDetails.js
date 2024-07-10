import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import RightArrow from "../../res/svgIcons/RightArrow";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Wallet2icon from "../../res/svgIcons/Wallet2icon";
import Myplanicon from "../../res/svgIcons/Myplanicon";
import { FontFamily } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";

const MyInternetDetials = ({ plans, billAmt, dueDate, navigation }) => {
  //const [billAmt,setBillAmt]=useState(0)
  const [planSpeed, setPlanSpeed] = useState("");
  //const [dueDate,setDueDate]=useState('')

  useEffect(() => {
    if (plans.length > 0) {
      setPlanSpeed(plans[0].downloadSpeed);
    }
  });
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={[
          styles.card,
          styles.shadowProp,
          { flexDirection: "column", marginVertical: 20 },
        ]}
      >
        <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
            style={{
              width: wp("10%"),
              height: wp("10%"),
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Wallet2icon />
          </LinearGradient>
          <Text style={styles.title}>{"Bill Summary"}</Text>
        </View>
        <View style={styles.subSec}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 14,
                alignSelf: "center",
                color: colors.darkest_grey,
                fontWeight: "400",
                fontFamily:FontFamily.openSansRegular,
              }}
            >
              $
            </Text>
            <Text style={styles.subTitle}>{billAmt}</Text>
          </View>

          <Text style={[styles.date, { paddingRight: 10 }]}>
            Due on {dueDate}
          </Text>
        </View>
        <View
          style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ArticalWindowUtility", {
              url: `${Env.URL}/billing`,
              name: "Billing Details",
            });
          }}
          style={{
            paddingBottom: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 15,
          }}
          accessible={true}
          accessibilityLabel={`View Details`}
          accessibilityRole="button"
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.sparklight_purple_blue,
              fontFamily:FontFamily.openSansRegular,
            }}
          >
            {"View Details"}
          </Text>
          <View>
            <RightArrow />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.card,
          styles.shadowProp,
          { flexDirection: "column", marginVertical: 20, marginHorizontal: 20 },
        ]}
      >
        <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
            style={{
              width: wp("10%"),
              height: wp("10%"),
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Myplanicon />
          </LinearGradient>
          <Text style={styles.title}>My Plan</Text>
        </View>
        <View style={styles.subSec}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.subTitle}>{planSpeed}</Text>
            <Text
              style={{
                fontSize: 14,
                alignSelf: "center",
                color: colors.darkest_grey,
                fontWeight: "400",
                fontFamily:FontFamily.openSansRegular,
                marginTop: 4,
                marginLeft:4
              }}
            >
              mb/s
            </Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
        />
        <TouchableOpacity
         accessible={true}
         accessibilityLabel={`Upgrade Plan`}
         accessibilityRole="button"
          onPress={() => {
            navigation.navigate("ArticalWindowUtility", {
              url: `${Env.URL}/services/upgrade`,
              name: "Upgrade Plan",
            });
          }}
          style={{
            paddingBottom: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 15,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.sparklight_purple_blue,
              fontFamily:FontFamily.openSansRegular,
            }}
          >
            {"Upgrade Plan"}
          </Text>
          <View>
            <RightArrow />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#EAECF0",
    alignContent: "center",
    alignItems: "center",
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
  title: {
    color: colors.darkest_grey,
    fontSize: 20,
    fontFamily:FontFamily.openSansRegular,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
    marginTop: 10,
  },
  subTitle: {
    color: colors.darkest_grey,
    fontFamily:FontFamily.openSansRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color: colors.dark_grey,
    alignSelf: "center",
    fontFamily:FontFamily.openSansRegular,
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 5,
    marginTop: 10,
    paddingHorizontal: 20,
  },
});
export default MyInternetDetials;
