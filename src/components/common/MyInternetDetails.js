import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity,Linking } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import RightArrow from "../../res/svgIcons/RightArrow";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { GetApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
import moment from "moment";
import Wallet2icon from "../../res/svgIcons/Wallet2icon";
import Myplanicon from "../../res/svgIcons/Myplanicon";




const MyInternetDetials = ({ icon, title, subTitle, date,actionTxt }) => {
  const [billAmt,setBillAmt]=useState(0)
  const [planName,setPlanName]=useState('')
  const [planSpeed,setPlanSpeed]=useState('')
  const [dueDate,setDueDate]=useState('')

  const getUserAccountDetails=()=>{
    let re = getUser().then((res) => {
      const request=`account/api/account/${res.userInfo.accountNumber}`
      GetApiRequest(request,onSuccess,onError)
    });
  }


  const getInternetPlanDetails=()=>{
    let re = getUser().then((res) => {
      const request=`internet/api/internet/${res.userInfo.accountNumber}/plan`
      GetApiRequest(request,onSuccessPlan,onError)
    });
  }

  const onSuccessPlan=(res)=>{
    if(res){
        setPlanName(res[0].planName)
        setPlanSpeed(res[0].downloadSpeed)
    }
  }

  const onSuccess=(res)=>{
    console.log('getUserAccountDetails',res)
    if(res){
      let dueDate = moment(res.paymentDueDate).format('ll')
      setDueDate(dueDate)
      setBillAmt(res.currentBalance)
    }
  }

  const onError=(error)=>{
    console.log('error',error)
  }

  useEffect(()=>{
    getUserAccountDetails();
    getInternetPlanDetails();
  },[])
  return (
    <View style={{flexDirection:'row'}}>
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
          <Wallet2icon/>
        </LinearGradient>
        <Text style={styles.title}>{'Bill Summary'}</Text>
      </View>
      <View style={styles.subSec}>
        <Text style={styles.subTitle}>${billAmt}</Text>
        <Text style={styles.date}>{dueDate}</Text>
      </View>
      <View style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }} />
      <TouchableOpacity
        onPress={() => {
          Linking.openURL('https://customer.uat.sparklight.com/residential/billing')
        }}
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
          {'View Details'}
        </Text>
        <View >
          <RightArrow />
        </View>
      </TouchableOpacity>
    </View>

<View style={[styles.card, styles.shadowProp, { flexDirection: "column",marginVertical:20,marginHorizontal:10}]}>
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
    <Myplanicon/>
  </LinearGradient>
  <Text style={styles.title}>{planName}</Text>
</View>
<View style={styles.subSec}>
  <Text style={styles.subTitle}>{planSpeed}mb/ps</Text>
 
</View>
<View style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }} />
<TouchableOpacity
  onPress={() => {
    Linking.openURL('https://customer.uat.sparklight.com/residential/services/upgrade')
  }}
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
     
    {'Upgrade Plan'}
  </Text>
  <View >
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
