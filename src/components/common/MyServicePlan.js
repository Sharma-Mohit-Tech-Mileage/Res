import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../res/Colors";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DataSpeedComponent from "./DataSpeedComponent";
import DataUsageComponent from "./DataUsageComponent";

const MyServicePlan = () => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    console.log("data");
  }, []);
  return (
    <View
      style={[
        styles.card,
        styles.shadowProp,
        { flexDirection: "column",marginBottom:200 },
      ]}
    >
      <View style={styles.subSec}>
        <Text style={styles.subTitle}>My Service</Text>
        <View style={{flexDirection:'row'}}>
          <InfoIcon/>
          <Text style={styles.date}>Plan Details</Text>
        </View>
       
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center" ,marginTop:10}}>
        <TouchableOpacity
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            { borderBottomWidth: 2, borderTopWidth: 2, borderLeftWidth: 2 },
          ]}
          onPress={() => setTabIndex(0)}
        >
          <Text style={{
              color: tabIndex == 0 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: "400",
            }}> Data Speed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tabIndex == 1 ? styles.selectedTab : styles.defaultTab,
            { borderBottomWidth: 2, borderTopWidth: 2, borderRightWidth: 2 },
          ]}
          onPress={() => setTabIndex(1)}
        >
          <Text
            style={{
              color: tabIndex == 1 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              textAlign:'center',
              textAlignVertical:'center',
              fontWeight: "400",
            }}
          >
            {" "}
            Usage
          </Text>
        </TouchableOpacity>
      </View>
      
      {tabIndex==0?<DataSpeedComponent/>:<DataUsageComponent/>}

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "87%",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  title: {
    color: "#101828",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
    
  },
  subTitle: {
    color: colors.darkest_grey,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
  date: {
    fontSize: 14,
    color:colors.sparklight_purple_blue,
    marginLeft:5,
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 5,
    
  },
  selectedTab: {
    backgroundColor: colors.sparklight_purple_blue,
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 8,
    paddingHorizontal: 32,
    width:'50%'
  },
  defaultTab: {
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 8,
    paddingHorizontal: 32,
    width:'50%'
  },
});

export default MyServicePlan;
