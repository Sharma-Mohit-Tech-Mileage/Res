import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DiscountbgBadge from '../../../res/svgIcons/DiscountbgBadge';
import { Color } from "../../../../GlobalStyles";
import LinearGradient from 'react-native-linear-gradient';
const { width } = Dimensions.get('window');

const PromotionCard = () => {
  return (
    <View style={styles.container}>
         <LinearGradient
                style={styles.cardStyle}
                locations={[0, 1]}
                colors={[ "rgba(141, 59, 144, 1)","rgba(53, 48, 145, 1)"]}
                useAngle={true}
                angle={90}
            >
        <View style={styles.vectorContainer}>
          <View style={styles.badgeWrapper}>
          <DiscountbgBadge  />
          </View>
          <View style={[styles.badgeWrapper, styles.topBadge]}>
          <DiscountbgBadge width={111} height={190} color="white" fillOpacity={1} />
          </View>
        </View>
        <View style={styles.textOverlay}>
          <View style={{ flexDirection: "row", alignItems: 'baseline' }}>
            <Text style={styles.dollarStyle}>$</Text>
            <Text style={styles.numberStyle}>5</Text>
          </View>
          <Text style={styles.offStyle}>OFF</Text>
        </View>
        <View style={styles.textContainerStyle}>
          <Text style={styles.headingStyle}>$5 off every month!</Text>
          <Text style={styles.subTextStyle}>
            Turn on <Text style={styles.boldText}>Auto Pay*</Text> and <Text style={styles.boldText}>Paperless Billing</Text> to enjoy additional savings.
          </Text>
          <Text style={styles.disclaimerStyle}>
            *Only valid with a checking/savings account or a debit card. Plans for the Affordable Connectivity Program, School Programs, and Sparklight TV are not eligible for this discount.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flex: 1,
  },
  cardStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.sparklightBrightPurple,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: width - 32,
    height: 190,
    overflow: 'hidden',
    position: 'relative',
  },
  vectorContainer: {
    position: 'absolute',
    left: -20,
    top: 0,
    zIndex: 2,
    width: 130, // Adjust the width as necessary
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', 
  },
  topBadge: {
    zIndex: 3, 
    left: -2, 
  },
  textOverlay: {
    position: 'absolute',
    top: 50,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4, // Ensure it's above the badges
  },
  dollarStyle: {
    fontSize: 30,
    color: Color.sparklightBrightPurple,
    fontWeight: 'bold',
    top: -20,
  },
  numberStyle: {
    fontSize: 60,
    color: Color.sparklightBrightPurple,
    fontWeight: 'bold',
    marginLeft: -2,
  },
  offStyle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    top: -15,
    right: -5,
  },
  textContainerStyle: {
    marginLeft: 100, // Adjust based on the correct positioning
    maxWidth: '70%',
    textAlign: 'left',
    zIndex: 1,
  },
  headingStyle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subTextStyle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 10,
    color: '#F8F8F8',
  },
  disclaimerStyle: {
    fontSize: 12,
    marginTop: 10,
    color: '#F8F8F8',
    fontStyle: 'italic', // Apply italic style
  },
  boldText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PromotionCard;
