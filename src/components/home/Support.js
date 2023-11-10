import React,{useState,useEffect} from 'react';
import { View, Text, Button } from 'react-native';

const SupportScreen = ({route, navigation }) => {

useEffect(()=>{
  //console.log('data')

},[])
  return (
    <View style={{flex:1,flexDirection:'column',justifyContent:'center'}}>
      <View >
      <Text style={{textAlign:'center'}}> Support coming soon....</Text>
      
      </View>
      
    </View>
  );
};

export default SupportScreen;