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
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";
import TickIcon from "../../res/svgIcons/TickIcon";
import AutoPayIcon from "../../res/svgIcons/AutoPayIcon";

const MyInternetDetialsBiller = ({ plans, billAmt, dueDate, navigation }) => {
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

        <View style={[styles.subSec,{ marginTop:-10}]}>
          <View style={{ flexDirection: "row" }}>
            
            <Text style={[styles.subTitle,{fontSize:FontSize.size_base}]}>Auto Pay</Text>
          </View>

          <Text style={[styles.subTitle, { paddingRight: 10,fontSize:FontSize.size_base }]}>
            <TickIcon color={'#2BA948'}/> On
          </Text>
        </View>
       
        
        
        <View style={{flexDirection:'column'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ArticalWindowUtility", {
              url: `${Env.URL}/billing`,
              name: "Billing Details",
            });
          }}
          style={{
            borderTopColor:'#F4F4F5',
            borderTopWidth:1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 5,
            paddingHorizontal:20,
            height:40,
            
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.sparklight_purple_blue,
              fontFamily:FontFamily.openSansRegular,
              alignSelf:'center',
            }}
          >
            {"Make a Payment"}
          </Text>
          <View style={{ alignSelf:'center'}}>
            <RightArrow />
          </View>
        </TouchableOpacity>
        </View>
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
            <AutoPayIcon />
          </LinearGradient>
          <Text style={styles.title}>Auto Pay</Text>
        </View>
        <View style={styles.subSec}>
          <View style={{ flexDirection: "row",marginTop:10}}>
            
            <Text style={[styles.subTitle,{fontSize:FontSize.size_lg,color:'#2BA948',fontWeight:'500'}]}>On</Text>
          </View>

          <Text style={[styles.date, { paddingRight: 10} ]}>
             Account ending in 9100
          </Text>
        </View>
        {/* <View
          style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10,marginBottom:10 }}
        /> */}
        <View style={{flexDirection:'column',position:'absolute',
            bottom:0}}>
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
            borderTopColor:'#F4F4F5',
            borderTopWidth:1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 5,
            paddingHorizontal:20,
            height:40,
            width:'88%'
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.sparklight_purple_blue,
              fontFamily:FontFamily.openSansRegular,
              alignSelf:'center'
            }}
          >
            {"Manage Auto Pay"}
          </Text>
          <View style={{alignSelf:'center',marginRight:10}} >
            <RightArrow />
          </View>
        </TouchableOpacity>
        </View>
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
    paddingTop: 10,
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
    marginTop: 5,
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
    paddingHorizontal: 20,
  },
});
export default MyInternetDetialsBiller;
