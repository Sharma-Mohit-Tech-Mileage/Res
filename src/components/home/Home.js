import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../res/Colors";
import BellIcon from "../../res/svgIcons/bellIcon";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import InternetHealthChart from "../common/InternetHealthChart";


const HomeScreen = ({ route, navigation }) => {
  const { email, name } = {
    email: route.params.data.params.email,
    name: route.params.data.params.name,
  };
  useEffect(() => {
    console.log("data", JSON.stringify(route.params.data.params.email));
  }, []);
  return (
    // <View>
    //   <View style={{padding:20,marginHorizontal:20}}>
    //   <Text>Name:{name} </Text>
    //   <Text style={{marginTop:10}}>Email:{email} </Text>
    //   </View>

    // </View>

    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
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
        
          <View style={{backgroundColor:'#EBEEF1', flex:2, alignItems:'center',marginTop:50}}>
            <View style={[styles.card, styles.shadowProp,{marginTop: -40}]} >
            <InternetHealthChart/>
            </View>
          
         

          </View>
      
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
  }, card: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '87%',
    
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default HomeScreen;
