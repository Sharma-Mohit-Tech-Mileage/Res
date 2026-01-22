import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const InfoBanner = ({ message, icon = 'info' }) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color={Color.sparklightWhite} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <View style={styles.containerStatic}>
        <View style={styles.textContainer}>
          <Text style={styles.staticMessage}>
            {'As you use your online account, please note that some features may not be immediately available due to system upgrades. We encourage you to check back periodically, as we are continually innovating and adding new options to enhance your experience. Thank you for choosing Sparklight to be your trusted service provider.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_xl,
    marginBottom: Padding.p_xl,
  },
  containerStatic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
   paddingBottom: Padding.p_xl,
    paddingHorizontal: 12,
    marginBottom: Padding.p_xl,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightBrightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
  },
  textContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'Effra',
    fontSize: 20,
    color: Color.sparklightGray1,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  staticMessage: {
    fontFamily: 'Effra',
    fontSize: 20,
    color: '#001321',
    fontWeight: '400',
    flexShrink: 1,
    flexWrap: 'wrap',
    textAlign: 'left', 
  },
});

export default InfoBanner;