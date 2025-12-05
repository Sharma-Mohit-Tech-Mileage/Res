import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';
import SpeedDisplay from './SpeedDisplay';
import SmallLoader from '../../common/customui/SmallLoader';

/**
 * InternetServiceCard Component
 * Displays internet plan name and speeds
 */
const InternetServiceCard = ({ planName, downloadSpeed, uploadSpeed, loading = false }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Internet Service</Text>
        <View style={styles.card}>
          <SmallLoader />
        </View>
      </View>
    );
  }

  if (!planName) {
    return null;
  }

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Internet Service: ${planName}`}
    >
      <Text 
        style={styles.sectionLabel}
        accessible={true}
        accessibilityRole="header"
      >
        Internet Service
      </Text>
      
      <View style={styles.card}>
        <Text 
          style={styles.planName}
          accessible={true}
          accessibilityLabel={`Plan name: ${planName}`}
        >
          {planName}
        </Text>
        
        <SpeedDisplay 
          downloadSpeed={downloadSpeed}
          uploadSpeed={uploadSpeed}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Padding.p_base,
  },
  sectionLabel: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.colorGray_200,
    marginBottom: Padding.p_5xs,
    paddingHorizontal: Padding.p_base,
  },
  card: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    padding: Padding.p_base,
    marginHorizontal: Padding.p_base,
    borderWidth: 1,
    borderColor: Color.colorWhitesmoke_200,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planName: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.colorMidnightblue,
  },
});

export default InternetServiceCard;
