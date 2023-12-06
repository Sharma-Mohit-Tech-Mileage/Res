import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import WifiIcon from "../../res/svgIcons/WifiIcon";
import Modemicon from "../../res/svgIcons/Modemicon";
import Billpaidicon from "../../res/svgIcons/Billpaidicon";
import Outageicon from "../../res/svgIcons/Outageicon";
import colors from "../../res/Colors";
import strings from "../../res/Strings";

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const NetworkDetails = ({billPaid}) => {

 
  useEffect(() => {
    //console.log("data");
  }, []);
 
  const GreenCircle=()=>{
    return(
      <View style={styles.greenTick}>
      </View>
    )
  }

  const RedCircle=()=>{
    return(
      <View style={styles.redTick}>
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
          <Text style={styles.text}> {strings.noOutageTxt}</Text>
        </View>
        {/* <View style={styles.item}>
        <View style ={styles.iconBg}>
          <WifiIcon />
          <GreenCircle/>
          </View>
          <Text style={styles.text}>{strings.connect_wifi_txt}</Text>
        </View> */}
      </View>

      <View style={[styles.rowContainer]}>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
          <Modemicon />
          <GreenCircle/>
          </View>
          <Text style={styles.text}> {strings.no_modem_issue}</Text>
        </View>
        <View style={styles.rowContainer}>
        <View style={styles.item}>
        <View style ={styles.iconBg}>
         <Billpaidicon/>
         { (billPaid)?<GreenCircle/> :<RedCircle/>}
         </View>
         <Text style={styles.text}> {strings.bill_paid}</Text>
          
        </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
   mainContainer:{
    alignContent:'flex-start',
    alignItems:'flex-start',
    marginBottom:10,
   }, 
  rowContainer: {
    flexDirection: 'column',
  },item:{
    flexDirection:'row',
    backgroundColor:'white',
    width:wp("85%"),
    margin:1,
    alignContent:'center',
    alignItems:'center',
    paddingVertical:wp('3%'),
    paddingHorizontal:25,
    borderColor:colors.grey,
    borderTopWidth:0.5,

  },iconBg:{
    backgroundColor:'#F4F4F5',
    padding:5,
    width:wp('10%'),
    height:wp('10%'),
    borderRadius:25,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center'

  },text:{
    marginTop:5,
    textAlign:'center',
    marginLeft:10,
    color:colors.darkest_grey,
    fontWeight:'600'
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

  },redTick:{
    width:14,
    height:14,
    borderRadius: 7,
    position:'absolute',
    bottom:0,
    right:-3,
    backgroundColor:colors.sparklight_red,
    borderWidth:2,
    borderColor:'white'

  }
});

export default NetworkDetails;
