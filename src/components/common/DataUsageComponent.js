import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { ProgressCircle } from "react-native-svg-charts";
import colors from "../../res/Colors";
import RightArrow from "../../res/svgIcons/RightArrow";
import { FontFamily } from "../../../GlobalStyles";
import { getUser } from "../../redux/utils/LocalStorage";
import { Env } from "../../network/apis/account/Constants";
import { GetApiRequest } from "../../network/APIClient";
const DataUsageComponent = ({ navigation, useData }) => {
  const [account, setAccount] = useState("");
  const [data, setData] = useState(useData);
  const [progress, setProgress] = useState(0.0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [isUnlimtedPlan, setIsUnlimtedPlan] = useState(false);

  const getDataUsage = () => {
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/usage/current`;
      GetApiRequest(request, (res)=>{
            if(res){
              setData(res)
            }
      }, (error)=>{
  
      });
    });
  };

  useEffect(() => {
    console.log('usage')
    if(Object.entries(data).length>0){
    let totalUsedGB = Math.round(data.totalUsedGB);
    setTotalUsed(totalUsedGB);
    let planData = Math.round(data.dataPlanGB);
    if(planData===15000){
      setIsUnlimtedPlan(true)
    }else{
      setIsUnlimtedPlan(false)
    }
    var progress = Math.round((totalUsedGB / planData) * 100 * 10) / 10;
    let pBar = progress / 100;
    console.log("Progress", planData);
    setProgress(pBar);
  }else{
    getDataUsage();
  }
  }, [data]);
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
        progress={progress}
        progressColor={"#8D3B90"}
        backgroundColor={"#e1e1e1"}
        cornerRadius={5}
        strokeWidth={12}
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
            <Text style={styles.dataText}>{totalUsed}</Text>
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
            <Text style={styles.dataPlanTxt}>
              {" "}
              {(isUnlimtedPlan)?'UNLIMITED DATA PLAN':Math.floor(data.dataPlanGB)}
              {(isUnlimtedPlan)? "" :" GB"}
            </Text>
          </View>
        </View>
      </ProgressCircle>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          marginHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.dataUsageIndicator} />
          <Text style={styles.useLbl}>Used</Text>
          <Text style={styles.useDataLbl}> {totalUsed}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={[
              styles.dataUsageIndicator,
              { backgroundColor: colors.backgound_blue, marginLeft: 5 },
            ]}
          />
          <Text style={styles.useLbl}>Remaining</Text>
          <Text style={styles.useDataLbl}> {(isUnlimtedPlan)?'Unlimited':Math.floor(data.remainingGB)}</Text>
        </View>
      </View>
      <View
        style={{ backgroundColor: colors.grey, height: 1, marginVertical: 10 }}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ArticalWindowUtility", {
            url: Env.URL + "/residential/services/upgrade",
            name: "Upgrade Plan",
          });
          //Linking.openURL('https://customer.uat.sparklight.com/residential/services/upgrade')
        }}
        style={{
          minHeight: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 4,
          marginHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.sparklight_purple_blue,
            fontFamily: FontFamily.openSansRegular,
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
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "600",
  },
  dataPlanTxt: {
    color: colors.sparklight_bright_purple,
    fontFamily: FontFamily.openSansRegular,
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
    marginLeft: 5,
  },
  useLbl: {
    color: colors.dark_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 20,
    marginLeft: 5,
  },
  useDataLbl: {
    color: colors.sparklight_black,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 20,
  },
});

export default DataUsageComponent;
