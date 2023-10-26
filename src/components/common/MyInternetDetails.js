import React,{useState,useEffect} from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import colors from '../../res/Colors';
import LinearGradient from "react-native-linear-gradient";
const MyInternetDetials = ({icon,title,subTitle}) => {

  return (
    <View style={[styles.card, styles.shadowProp,{flexDirection:'column'}]}>
      <View style={{flexDirection:'row'}}>
       <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={{width:50,height:50,borderRadius:10,justifyContent:'center',alignItems:'center'}}
    >
      {icon}
    </LinearGradient>
       <Text style={styles.title}>{title}</Text>
      </View>
      <View>
        <Text style={styles.subTitle}>{subTitle}</Text>
        </View>

    </View>
  );
};


const styles = StyleSheet.create({
  mainContainer:{
   backgroundColor: "#EAECF0" ,
   alignContent:'center',
   alignItems:'center'
  },card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 400,
   
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },title:{
    color:'#101828',
    fontSize: 20,
    textAlign:'center',
    fontStyle: 'normal',
    fontWeight: '400',
    marginLeft:10,
    marginTop:10
  },subTitle:{
    color: colors.darkest_grey,
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    marginTop:15
  }, 
})
export default MyInternetDetials;