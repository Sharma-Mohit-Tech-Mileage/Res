import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../../res/Colors';
 
const SecondaryButton=(props)=>{
  
    return (
      <TouchableOpacity style={styles.TouchableOpacityButton}>
        <Text>{props.text}</Text>
      </TouchableOpacity>
    );
  
}

const styles = StyleSheet.create({
  TouchableOpacityButton: {
    backgroundColor: colors.sparklight_yellow,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});

export default SecondaryButton