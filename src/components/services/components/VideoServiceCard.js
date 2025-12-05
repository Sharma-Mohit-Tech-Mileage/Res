import React from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';
import PrimaryButton from '../../common/customui/PrimaryButton';
import SmallLoader from '../../common/customui/SmallLoader';
import { getChannelLineupURL } from '../utils/constants';

/**
 * VideoServiceCard Component
 * Displays video plan name and channel lineup button
 */
const VideoServiceCard = ({ planName, zipCode, loading = false }) => {
  const handleChannelLineup = async () => {
    const url = getChannelLineupURL(zipCode);
    
    try {
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open channel lineup. Please try again later.');
      }
    } catch (error) {
      console.error('Error opening channel lineup:', error);
      Alert.alert('Error', 'Unable to open channel lineup. Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>TV/Video Service</Text>
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
      accessibilityLabel={`TV Video Service: ${planName}`}
    >
      <Text 
        style={styles.sectionLabel}
        accessible={true}
        accessibilityRole="header"
      >
        TV/Video Service
      </Text>
      
      <View style={styles.card}>
        <Text 
          style={styles.planName}
          accessible={true}
          accessibilityLabel={`Plan name: ${planName}`}
        >
          {planName}
        </Text>
        
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="View Channel Lineup"
            onPress={handleChannelLineup}
            buttonType="submit"
          />
        </View>
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
    color: Color.sparklightBrightPurple,
    marginBottom: Padding.p_xs,
  },
  buttonContainer: {
    marginTop: Padding.p_xs,
  },
});

export default VideoServiceCard;
