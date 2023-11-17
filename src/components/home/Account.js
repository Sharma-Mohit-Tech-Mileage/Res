import React,{useState,useEffect} from 'react';
import { View, Text, Button } from 'react-native';

const AccountScreen = ({route, navigation }) => {

useEffect(()=>{
  //console.log('data')

},[])
  return (
    <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
      <View >
      <Text style={{textAlign:'center'}}> Account coming soon....</Text>
      
      </View>
      
    </View>
  );
};

export default AccountScreen;