import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import RightArrow from "../../res/svgIcons/RightArrow";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const MyInternetDetials = ({ icon, title, subTitle, date,actionTxt }) => {
  return (
    <View style={[styles.card, styles.shadowProp, { flexDirection: "column",marginVertical:20}]}>
      <View style={{ flexDirection: "row" }}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
          style={{
            width:wp('10%'),
            height:wp('10%'),
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </LinearGradient>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.subSec}>
        <Text style={styles.subTitle}>{subTitle}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }} />
      <TouchableOpacity
        onPress={() => {}}
        style={{
          
          flexDirection: "row",
          justifyContent: "space-between",
         
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color:colors.sparklight_purple_blue
          }}
        >
          {actionTxt}
        </Text>
        <View >
          <RightArrow />
        </View>
      </TouchableOpacity>
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
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: wp('82%'),
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
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
    marginTop: 10,
  },
  subTitle: {
    color: colors.darkest_grey,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color: colors.dark_grey
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 5,
    marginTop: 10,
  },
});
export default MyInternetDetials;
