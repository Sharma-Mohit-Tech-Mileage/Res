import React,{useState,useEffect} from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({route, navigation }) => {
const { email, name } = {email:route.params.data.params.email,name:route.params.data.params.name};
useEffect(()=>{
  console.log('data',JSON.stringify(route.params.data.params.email))

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