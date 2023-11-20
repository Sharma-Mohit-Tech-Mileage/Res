import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../../res/Colors";
import Myservicedownarrow from "../../res/svgIcons/Myservicedownarrow";
import Myserviceuparrow from "../../res/svgIcons/Myserviceuparrow";
import SecondaryButton from "./customui/SecondaryButton";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import RightArrow from "../../res/svgIcons/RightArrow";
import TimerInfo from "../../res/svgIcons/TimerInfo";
import strings from "../../res/Strings";

const DataSpeedComponent = () => {
  const roundImage = require("../../res/images/roundbg.png");
  useEffect(() => {
    console.log("data");
  }, []);

  const TestSpeedResultSection = () => {
    return (
      <View
        style={{
          borderColor: colors.grey,
          borderWidth: 1,
          borderRadius: 8,
          marginTop: 15,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View style={styles.downloadbg}>
              <Myservicedownarrow />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.speedtextLarge}>100</Text>
              <Text style={[styles.speedtextLarge, { fontSize: 16 }]}>.78</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.downloadText}>Download</Text>
              <Text
                style={[
                  styles.downloadText,
                  { color: colors.dark_grey, fontWeight: "400", marginLeft: 5 },
                ]}
              >
                Mbps
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View style={styles.downloadbg}>
              <Myserviceuparrow />
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={styles.speedtextLarge}>100</Text>
              <Text style={[styles.speedtextLarge, { fontSize: 16 }]}>.78</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.downloadText}>Upload</Text>
              <Text
                style={[
                  styles.downloadText,
                  { color: colors.dark_grey, fontWeight: "400", marginLeft: 5 },
                ]}
              >
                Mbps
              </Text>
            </View>
          </View>
        </View>
        <View style={{ margin: 10 }}>
          <SecondaryButton text={"Test Speed"} />
        </View>
        <View
          style={{ backgroundColor: "#F4F4F5", height: 2, marginTop: 20 }}
        />

        <View style={{flexDirection:'row',paddingVertical:10, paddingLeft:10}}>
         <TimerInfo/>
         <Text style={styles.timerInfo1}>Last run</Text>
         <Text style={styles.timerInfo2}>10/05/23  11:32am</Text>
         
        </View>
        
      </View>
    );
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={styles.internetStatusSection}>
        <View style={{ marginTop: 5 }}>
          <InfoIcon />
        </View>
        <View>
        <Text style={styles.internetStatusTxt}>
          {strings.test_speed_info}
        </Text>
        <View style={{flexDirection:'row',marginLeft:10,marginTop:10}}> 
          <TouchableOpacity>
          <Text style={styles.learnMore}>{strings.learn_more}</Text>
          </TouchableOpacity>
          <View style={styles.verticle_saperator}/> 
          <TouchableOpacity>
          <Text style={styles.learnMore}>{strings.test_with_eero}</Text>
            </TouchableOpacity>
        </View>
        </View>
      </View>
      <TestSpeedResultSection />
      <View style={{ backgroundColor: "#F4F4F5", height: 2, marginTop: 10 }} />
      <TouchableOpacity
        onPress={() => {}}
        style={{
          height: 40,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            marginVertical: 5,
            lineHeight: 20,
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
  mainContainer: {
    backgroundColor: "#EAECF0",
    alignContent: "center",
    alignItems: "center",
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    fontSize: 14,
    marginLeft:5,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 28,
  },
  speedtextLarge: {
    color: colors.sparklight_bright_purple,
    textAlign: "center",
    marginTop: 10,
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 28 /* 83.333% */,
  },
  downloadText: {
    color: colors.darkest_grey,
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 20 /* 142.857% */,
  },
  downloadbg: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },timerInfo1:
  {color:colors.dark_grey,
    marginLeft:5,
    fontSize:14,
    fontWeight:'400'
},timerInfo2:{marginLeft:5,color:colors.darkest_grey,fontSize:14,fontWeight:'400'},
 learnMore:{
  color:colors.sparklight_purple_blue,
  fontSize: 14,
    fontStyle: "normal",
    fontWeight: "600",

},verticle_saperator:{marginHorizontal:15,height:15,backgroundColor:colors.dark_grey,width:1}
});

export default DataSpeedComponent;
