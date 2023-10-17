import React,{useState,useEffect} from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({route, navigation }) => {
const { email, name } = {email:'test',name:'name'};
useEffect(()=>{
  console.log('data')

},[])
  return (
    <View>
      <View style={{padding:20,marginHorizontal:20}}>
      <Text>Name:{name} </Text>
      <Text style={{marginTop:10}}>Email:{email} </Text>
      </View>
      
    </View>
  );
};

export default HomeScreen;