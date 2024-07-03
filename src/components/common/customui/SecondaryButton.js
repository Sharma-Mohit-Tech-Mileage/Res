import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../../res/Colors';
 
const SecondaryButton=(props)=>{
  
    return (
      <TouchableOpacity 
      style={styles.TouchableOpacityButton} 
      onPress={props.onPress}
      accessible={true}
      accessibilityLabel={props.text}
      accessibilityRole="button"
      >
        <Text style={styles.txtStyle}>{props.text}</Text>
      </TouchableOpacity>
    );
  
}

const styles = StyleSheet.create({
  TouchableOpacityButton: {
    backgroundColor: colors.backgound_blue,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 2,
  },txtStyle:{
    color:colors.sparklight_purple_blue,
    textAlign:'center',
    fontStyle:'normal',
    fontSize:14,
    
  }
});

export default SecondaryButton