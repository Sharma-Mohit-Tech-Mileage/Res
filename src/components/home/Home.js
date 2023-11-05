import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
import colors from "../../res/Colors";
import BellIcon from "../../res/svgIcons/bellIcon";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import InternetHealthChart from "../common/InternetHealthChart";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DownArrow from "../../res/svgIcons/DownArrow";
import UpArrow from "../../res/svgIcons/UpArrow";
import NetworkDetails from "../common/NetworkDetails";
import strings from "../../res/Strings";
import Myplanicon from "../../res/svgIcons/Myplanicon";
import MyInternetDetials from "../common/MyInternetDetails";
import Wallet2icon from "../../res/svgIcons/Wallet2icon";
import MyServicePlan from "../common/MyServicePlan";

const HomeScreen = ({ route, navigation }) => {
  const { email, name } = {
    email: route.params.data.params.email,
    name: route.params.data.params.name,
  };
  const [isInternetDetails, setIsInternetDetails] = useState(false);

  const myData = [
    {
      icon: <Wallet2icon />,
      title: "Bill Summary",
      subText: "$64.00",
      date: "Due date Nov 16, 2023",
      key:'2'
    },
    {
      icon: <Myplanicon />,
      title: "My Plan",
      subText: "300 mb/s",
      date: undefined,
      key:'3'
    },
  ];
  useEffect(() => {
    //console.log("data", JSON.stringify(route.params.data.params.email));
  }, []);
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: (Platform.OS=='ios')?60:50,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop:(Platform.OS=='ios')?0:20,
          }}
        >
          <Image
            resizeMode="contain"
            source={require("../../res/images/header_logo.png")}
          />
          <View>
            <BellIcon />
          </View>
        </View>
        <ScrollView style={{ height: "100%", paddingBottom: 100 }}>
          <View
            style={{
              backgroundColor: colors.backgound_blue,
              flex: 2,
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <View style={[styles.card, styles.shadowProp, { marginTop: -40 }]}>
              <Text style={styles.internetHealth}>Internet Health</Text>
              <InternetHealthChart />
              <View style={styles.internetStatusSection}>
                <View style={{ marginTop: 5 }}>
                  <InfoIcon />
                </View>
                <Text style={styles.internetStatusTxt}>
                  {" "}
                  {strings.internetStatus}
                </Text>
              </View>

              <View
                style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 40 }}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsInternetDetails(!isInternetDetails);
                }}
                style={{
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                  marginTop: 10,
                }}
              >
                <Text style={styles.hideShowDetails}>
                  {isInternetDetails ? strings.collapseTxt : strings.expandTxt}
                </Text>
                <View style={{ marginTop: 15 }}>
                  {isInternetDetails ? (
                    <View style={{ marginTop: -10 }}>
                      <UpArrow />
                    </View>
                  ) : (
                    <DownArrow />
                  )}
                </View>
              </TouchableOpacity>
              {isInternetDetails ? <NetworkDetails /> : <></>}
            </View>
             <ScrollView horizontal={true}style={{marginStart:20}} >
            {myData.map((item, index) => (
              <View key={item.key} style={{marginHorizontal:10}}>
                <MyInternetDetials key={item.key} date={item.date} icon={item.icon} title={item.title} subTitle={item.subText}/>
             </View>
             ))}
            </ScrollView> 
             
             <MyServicePlan/>

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingTop: 45,
    paddingHorizontal: 25,
    width: wp("87%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  internetHealth: {
    color: colors.darkest_grey,
    fontSize: 22,
    marginTop: -20,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22 /* 100% */,
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 25,
    flexDirection: "row",
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 28,
    paddingHorizontal:5
  },
  hideShowDetails: {
    fontSize: 16,
    marginVertical: 5,
    lineHeight: 20,
    fontWeight: "600",
  },
});

export default HomeScreen;
