import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import colors from '../../../res/Colors';
import { FontFamily } from '../../../../GlobalStyles';

const SecondaryButton=(props)=>{

    return (
      <Pressable
        style={({ pressed }) => [
          styles.TouchableOpacityButton,
          pressed && styles.pressed,
        ]}
        onPress={props.onPress}
      >
        <Text style={styles.txtStyle}>{props.text}</Text>
      </Pressable>
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
    fontFamily:FontFamily.openSansRegular,
    fontStyle:'normal',
    fontSize:16,
    
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});

export default SecondaryButton