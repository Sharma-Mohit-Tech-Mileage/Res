import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet,TouchableOpacity, Linking } from "react-native";
import { ProgressCircle } from "react-native-svg-charts";
import colors from "../../res/Colors";
import RightArrow from "../../res/svgIcons/RightArrow";

const DataUsageComponent = () => {
  useEffect(() => {
    console.log("data");
  }, []);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 20,
      
      }}
    >
      <ProgressCircle
        style={{ height: 200 }}
        progress={0.8}
        progressColor={"#8D3B90"}
        cornerRadius={5}
        strokeWidth={15}
        startAngle={-Math.PI * 0.85}
        endAngle={Math.PI * 0.85}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.dataText}>540</Text>
            <Text style={[styles.dataText, { fontSize: 16, marginTop: 5 }]}>
              GB
            </Text>
            <Text
              style={[
                styles.dataText,
                { fontSize: 16, fontWeight: "400", marginTop: 5 },
              ]}
            >
              {" "}
              used
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.sparklight_bright_purple,
              marginTop: 5,
            }}
          >
            <Text style={styles.dataPlanTxt}> 700 GB DATA PLAN</Text>
          </View>
        </View>
      </ProgressCircle>

      <View style={{ flexDirection: "row", justifyContent: "space-between" ,marginTop:20}}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.dataUsageIndicator} />
          <Text style={styles.useLbl}>Used</Text>
          <Text style={styles.useDataLbl}>{" "}540GB</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={[styles.dataUsageIndicator,{backgroundColor:colors.backgound_blue,marginLeft:5}]} />
          <Text style={styles.useLbl}>Remaining</Text>
          <Text style={styles.useDataLbl}>{" "}160GB</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.grey, height: 1, marginVertical: 10 }} />
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('https://customer.uat.sparklight.com/residential/services/upgrade')
        }}
        style={{
          height: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color:colors.sparklight_purple_blue
          }}
        >
          Upgrade Plan
        </Text>
        <View style={{ marginTop: 5 }}>
          <RightArrow />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dataText: {
    color: colors.darkest_grey,
    textAlign: "center",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "600",
  },
  dataPlanTxt: {
    color: colors.sparklight_bright_purple,
    textAlign: "center",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "600",
    padding: 5,
  },
  dataUsageIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.sparklight_bright_purple,
    borderWidth: 2,
    borderColor: "white",
    marginLeft:5
  },
  useLbl: {
    color: colors.dark_grey,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    marginLeft:5
  },
  useDataLbl: {
    color: colors.sparklight_black,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 20,
  },
});

export default DataUsageComponent;
