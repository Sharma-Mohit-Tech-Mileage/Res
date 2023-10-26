import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WifiIcon from "../../res/svgIcons/WifiIcon";
import Modemicon from "../../res/svgIcons/Modemicon";
import Billpaidicon from "../../res/svgIcons/Billpaidicon";
import Outageicon from "../../res/svgIcons/Outageicon";

const NetworkDetails = () => {
  useEffect(() => {
    console.log("data");
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.item}>
          <View style ={styles.iconBg}>
              <Outageicon />
            </View>
          <Text style={styles.text}> No Outages</Text>
        </View>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
          <WifiIcon />
          </View>
          <Text style={styles.text}>Connected to Wifi</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
          <Modemicon />
          </View>
          <Text style={styles.text}> No Modem Issues</Text>
        </View>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
         <Billpaidicon/>
         </View>
         <Text style={styles.text}> Bill Paid</Text>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   mainContainer:{
    backgroundColor: "#EAECF0" ,
    alignContent:'center',
    alignItems:'center'
   }, 
  rowContainer: {
    flexDirection: "row",
  },item:{
    backgroundColor:'white',
    margin:1,
    alignContent:'center',
    alignSelf:'center',
    alignItems:'center',
    paddingTop:20,
    width:180,
    height:120
    
  },iconBg:{
    backgroundColor:'#F4F4F5',
    padding:5,
    width:50,
    height:50,
    borderRadius:25,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center'

  },text:{
    marginTop:5,
    textAlign:'center'
  }
});

export default NetworkDetails;
