import React, { useState, useEffect } from "react";
import colors from "../../res/Colors";
import DataUsageComponent from "./DataUsageComponent";
import { FontFamily, FontSize } from "../../../GlobalStyles";
import { getUser } from "../../redux/utils/LocalStorage";
import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { GetApiRequest } from "../../network/APIClient";

const MyDataUsage = ({ plans, tvPlan, phonePlan, navigation }) => {
  const [data, setData] = useState({});
  const [isUnlimitedPlan, setIsUnlimitedPlan] = useState(false);
  const getDataUsage = () => {
    getUser().then((res) => {
      const reqauest = `internet/api/internet/${res.userInfo.accountNumber}/usage/current`;
      GetApiRequest(reqauest, (res) => {
        console.log("Data plan used_______________________________________________________",JSON.stringify(res))
        if (res) { setData(res); }
      }, (error) => { console.log(error) });
    });
  };
  useEffect(() => {
    getDataUsage();
  }, []);

  useEffect(() => {
    if (data) {
      const planData = typeof data.dataPlanGB === "number" ? Math.round(data.dataPlanGB) : 0;
      setIsUnlimitedPlan(planData === 15000);
    } 
  }, [data]);

  return (
    <View style={{ ...styles.card, ...styles.shadowProp, flexDirection: "column", marginBottom: hp("10%") }}>
      <View style={{ ...styles.subSec, flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.subTitle}>{'My Data'}</Text>
        <Text style={styles.date}>{isUnlimitedPlan?'UNLIMITED':data.dataPlanGB||0+' Mbps'} </Text>
      </View>
      <View style={styles.subSec} />
      <DataUsageComponent navigation={navigation} data={data} plans={plans} tvPlan={tvPlan} phonePlan={phonePlan}/>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingVertical: 16,
    width: wp("92%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  subTitle: {
    color: colors.darkest_grey,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
  },
  date: {
    fontSize: 16,
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
    fontWeight: "600",
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
    marginHorizontal: wp('5%')
  },
});

export default MyDataUsage;
