import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity,FlatList } from "react-native";
import colors from "../../res/Colors";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DataSpeedComponent from "./DataSpeedComponent";
import DataUsageComponent from "./DataUsageComponent";
import strings from "../../res/Strings";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";

const MyServicePlan = ({plans}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [ShowComment, setModelComment] = useState(false);
  const [animateModal, setanimateModal] = useState(false);

  const MyPlanDetails = () => {
    
    useEffect(()=>{
      
    },[])

    const PlanDetailsItem=({item,index})=>{
      console.log('PlanDetailsItem',item)
      return(
        <View key={index} style={{backgroundColor:'red'}}>
        <Text style={styles.planDetailsRow} >{item.planName}</Text>
        <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} />
        <Text style={styles.planDetailsRow}>Download Speen Up To {item.downloadSpeed} Mbps</Text>
        <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} />
        <Text style={styles.planDetailsRow} >Upload Speed Up To {item.uploadSpeed} Mbps</Text>
        <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} />
          <View style={styles.planDetailsRow}>
          <Text>Data Plan {item.dataQuotaGB}GB*</Text>
          </View>
          <View style={{ backgroundColor: colors.grey, height: 1,width:'100%', marginTop: 5 }} />
        </View>
      )
    }
    
    return (
      <SwipeUpDownModal
        modalVisible={ShowComment}
        PressToanimate={animateModal}
        
        ContentModal={
          <View style={{marginVertical:20}}>
            {plans.map((item,index)=>{
              return(
                <PlanDetailsItem item={item} index={index} key={index}/>
              )
            })}
          </View>
        }
        ContentModalStyle={styles.Modal}
        onClose={() => {
          setModelComment(false);
          setanimateModal(false);
        }}
      />
    );
  };

  useEffect(() => {
    //console.log("data");
  }, []);
  return (
    <View
      style={[
        styles.card,
        styles.shadowProp,
        { flexDirection: "column", marginBottom: hp("10%") },
      ]}
    >
      <View style={styles.subSec}>
        <Text style={styles.subTitle}>{strings.my_service_txt}</Text>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
        onPress={()=>setModelComment(true)}>
          <InfoIcon />
          <Text style={styles.date}>{strings.my_plan_details_txt}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: wp("5%"),
        }}
      >
        <TouchableOpacity
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            { borderBottomWidth: 2, borderTopWidth: 2, borderLeftWidth: 2 },
          ]}
          onPress={() => setTabIndex(0)}
        >
          <Text
            style={{
              color: tabIndex == 0 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: "400",
            }}
          >
            {" "}
            Data Speed
          </Text>
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
              textAlign: "center",
              textAlignVertical: "center",
              fontWeight: "400",
            }}
          >
            {" "}
            Usage
          </Text>
        </TouchableOpacity>
      </View>

      {tabIndex == 0 ? <DataSpeedComponent /> : <DataUsageComponent />}
      <MyPlanDetails/>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: wp("87%"),
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
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  selectedTab: {
    backgroundColor: colors.sparklight_purple_blue,
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 5,
    paddingHorizontal: 32,
    width: wp("40%"),
  },
  defaultTab: {
    backgroundColor: "white",
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 5,
    paddingHorizontal: 32,
    width: wp("40%"),
  },
  containerContent: { flex: 1, marginTop: 40 },
  containerHeader: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "red",
  },
  headerContent: {
    marginTop: 0,
  },
  Modal: {
    backgroundColor: "#fff",
    marginTop: hp('20%'),
    
  },planDetailsRow:{
    padding:wp('3%')
  }
});

export default MyServicePlan;
