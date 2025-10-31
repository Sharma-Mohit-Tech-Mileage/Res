import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const PromoBanner = ({ title, showBonus = false }) => {
  // Split title intelligently for two-line layout with bonus
  const getTextLayout = () => {
    if (!showBonus) {
      return { fullText: title, showSplit: false };
    }
    
    // Find a good breaking point (after "is a")
    const breakPoint = title.lastIndexOf(' is a');
    if (breakPoint !== -1) {
      return {
        firstLine: title.substring(0, breakPoint + 5), // Include " is a"
        secondLine: title.substring(breakPoint + 5).trim(),
        showSplit: true
      };
    }
    
    // Fallback: break at approximately 60% of the text
    const words = title.split(' ');
    const splitIndex = Math.ceil(words.length * 0.6);
    return {
      firstLine: words.slice(0, splitIndex).join(' '),
      secondLine: words.slice(splitIndex).join(' '),
      showSplit: true
    };
  };

  const layout = getTextLayout();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="refresh-cw" size={20} color={Color.sparklightWhite} />
      </View>
      
      <View style={styles.contentContainer}>
        {layout.showSplit ? (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {layout.firstLine}
            </Text>
            <View style={styles.secondLineWrapper}>
              <Text style={styles.title} numberOfLines={1}>
                {layout.secondLine}
              </Text>
              
            </View>
          </>
        ) : (
          <Text style={styles.title} numberOfLines={2}>
            {layout.fullText}
          </Text>
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
    paddingVertical: Padding.p_xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightBrightPurple,
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
  secondLineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  title: {
    fontFamily: 'Effra',
    fontSize: 20,
    lineHeight: 26,
    color: Color.sparklightGray1,
    fontWeight: '700',
    flexShrink: 1,
  },
  bonusContainer: {
    backgroundColor: Color.sparklightGreen,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginLeft: 6,
    flexShrink: 0,
  },
  bonusText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_xs,
    color: Color.sparklightWhite,
    fontWeight: '700',
  },
});

export default PromoBanner;
