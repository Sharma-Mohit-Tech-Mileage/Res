import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import {  Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';
const PamoImage = require('../../../assets/papaerless-signup-bg.jpg');

const PromoBanner = ({ title }) => {
  return (
    <View style={styles.container}>

      <Image
        source={PamoImage}
        style={{  marginRight: Padding.p_xs,borderRadius:Border.br_7xs }}
      />
      {/* <View style={styles.iconContainer}>
        <Icon name="refresh-cw" size={20} color="#8D3B90" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically centers icon with text block
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    marginBottom: Padding.p_5xl,
    paddingVertical: Padding.p_xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Padding.p_xs,
  },
  title: {
    fontFamily: 'Effra',
    fontSize: 20,
    lineHeight: 26,
    color: '#8D3B90',
    fontWeight: '700',
  },
});

export default PromoBanner;
