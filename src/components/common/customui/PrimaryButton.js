import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../../res/Colors';
 
const PrimaryButtom=(props)=>{
 
    return (
      <TouchableOpacity style={styles.TouchableOpacityButton}>
        <Text>{props.text}</Text>
      </TouchableOpacity>
    );
  
}

const styles = StyleSheet.create({
  TouchableOpacityButton: {
    backgroundColor: colors.snow_white,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor:colors.backgound_blue
  },
});

export default PrimaryButtom