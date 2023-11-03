import React,{useState,useEffect} from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts'
import colors from '../../res/Colors';

const DataUsageComponent = () => {

useEffect(()=>{
  console.log('data')

},[])
  return (
    <View style={{flex:1,flexDirection:'column',justifyContent:'center',margin:20}}>
      <ProgressCircle
            style={{ height: 200 }}
            progress={0.8}
            progressColor={'#8D3B90'}
            cornerRadius={5}
            strokeWidth={15}
            startAngle={-Math.PI * 0.9}
            endAngle={Math.PI * 0.9}
            >
         <View style={{flexDirection:'row',justifyContent:'center'}} >
          <Text style={styles.dataText}>540</Text>
          <Text style={[styles.dataText,{fontSize:16}]}>GB</Text>
          <Text style={[styles.dataText,{fontSize:16,fontWeight:'400'}]}>{' '}used</Text>
         </View>
          
          </ProgressCircle>
      
    </View>
  );
};

const styles = StyleSheet.create({
    dataText: {
        color: colors.darkest_grey,
        textAlign: 'center',
        fontSize: 24,
        fontStyle: 'normal',
        fontWeight: '600',
        
    },
  });

export default DataUsageComponent;