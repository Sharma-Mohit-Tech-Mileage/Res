import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WifiIcon from "../../res/svgIcons/WifiIcon";
import Modemicon from "../../res/svgIcons/Modemicon";
import Billpaidicon from "../../res/svgIcons/Billpaidicon";
import Outageicon from "../../res/svgIcons/Outageicon";
import colors from "../../res/Colors";

const NetworkDetails = () => {
  useEffect(() => {
    console.log("data");
  }, []);
 
  const GreenCircle=()=>{
    return(
      <View style={styles.greenTick}>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.item}>
          <View style ={styles.iconBg}>
              <Outageicon />
              <GreenCircle/>
            </View>
          <Text style={styles.text}> No Outages</Text>
        </View>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
          <WifiIcon />
          <GreenCircle/>
          </View>
          <Text style={styles.text}>Connected to Wifi</Text>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
          <Modemicon />
          <GreenCircle/>
          </View>
          <Text style={styles.text}> No Modem Issues</Text>
        </View>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
         <Billpaidicon/>
         <GreenCircle/>
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
  },greenTick:{
    width:14,
    height:14,
    borderRadius: 7,
    position:'absolute',
    bottom:0,
    right:-3,
    backgroundColor:colors.sparklight_green,
    borderWidth:2,
    borderColor:'white'

  }
});

export default NetworkDetails;
