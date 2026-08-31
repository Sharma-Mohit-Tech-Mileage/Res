import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { FontFamily,Color } from '../../../../GlobalStyles';
import { interaction } from "../../../styles/utilities";
import Touchable from "./Touchable";

const SecondaryButton=(props)=>{

    return (
      <Touchable
        minSize={0}
        style={({ pressed }) => [
          styles.TouchableOpacityButton,
          pressed && interaction.pressed,
        ]}
        onPress={props.onPress}
      >
        <Text style={styles.txtStyle}>{props.text}</Text>
      </Touchable>
    );

}

const styles = StyleSheet.create({
  TouchableOpacityButton: {
    backgroundColor: Color.Gray300,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 2,
  },txtStyle:{
    color:Color.colorMidnightblue,
    textAlign:'center',
    fontFamily:FontFamily.RadioCanadaRegular,
    fontStyle:'normal',
    fontSize:16,
    
  },
});

export default SecondaryButton