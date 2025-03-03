import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const PromoBanner = ({ title, showBonus = false }) => {
  // Calculate how much of the title to display on the first line
  const calculateFirstLineText = () => {
    if (!showBonus) return title;
    
    // For simplicity, just show most of the title on first line
    // This is an approximation - you may need to adjust based on font metrics
    const titleLength = title.length;
    const cutoffPoint = Math.floor(titleLength * 0.55); // Show 70% on first line
    
    return title.substring(0, cutoffPoint);
  };
  
  // Calculate second line text + bonus
  const calculateSecondLineText = () => {
    if (!showBonus) return '';
    
    const titleLength = title.length;
    const cutoffPoint = Math.floor(titleLength * 0.55);
    
    return title.substring(cutoffPoint);
  };

  const firstLineText = calculateFirstLineText();
  const secondLineText = calculateSecondLineText();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="refresh-cw" size={20} color={Color.sparklightWhite} />
      </View>
      
      <View style={styles.contentContainer}>
        {/* First line of text */}
        <Text style={styles.title} numberOfLines={1}>
          {firstLineText}
        </Text>
        
        {/* Second line with text and bonus */}
        {showBonus && (
          <View style={styles.secondLineContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {secondLineText}
            </Text>
            <View style={styles.bonusContainer}>
              <Text style={styles.bonusText}>BONUS!</Text>
            </View>
          </View>
        )}
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
    marginBottom: Padding.p_5xl,
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  secondLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Effra',
    fontSize: 20,
    color: Color.sparklightGray1,
    fontWeight: '700',
  },
  bonusContainer: {
    backgroundColor: Color.sparklightGreen,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Color.sparklightGreen,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 4,
  },
  bonusText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_xs,
    color: Color.sparklightWhite,
    fontWeight: '700',
  },
});

export default PromoBanner;