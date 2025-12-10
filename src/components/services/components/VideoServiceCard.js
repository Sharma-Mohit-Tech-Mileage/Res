import React from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';
import { getChannelLineupURL } from '../utils/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * VideoServiceCard Component
 * Horizontal layout with circular icon
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

  // Loading Skeleton
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.skeletonRow}>
            <View style={[styles.skeleton, styles.skeletonIcon]} />
            <View style={styles.skeletonContent}>
              <View style={[styles.skeleton, styles.skeletonTitle]} />
            </View>
            <View style={[styles.skeleton, styles.skeletonButton]} />
          </View>
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
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* CIRCULAR Purple Icon Background */}
          <View style={styles.iconBg}>
            <MaterialCommunityIcons 
              name="television" 
              size={24} 
              color={Color.sparklightBrightPurple} 
            />
          </View>
          
          {/* Service Info - NO "Active subscription" text */}
          <View style={styles.serviceInfo}>
            <Text 
              style={styles.serviceName}
              accessible={true}
              accessibilityLabel={`Service: ${planName}`}
            >
              {planName}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleChannelLineup}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View Channel Lineup"
          >
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Padding.p_xs,
    marginHorizontal: Padding.p_base,
  },
  
  card: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    padding: Padding.p_base,
    borderWidth: 1,
    borderColor: Color.colorWhitesmoke_200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // CIRCULAR Icon Background - Purple theme
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24, // CIRCULAR
    backgroundColor: '#E6D5F5', // Light purple background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Padding.p_xs,
  },
  
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.colorGray_200,
  },
  
  // Action Button - Purple TEXT only
  actionButton: {
    backgroundColor: 'transparent',
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_xs,
    borderRadius: Border.br_11xs,
    minWidth: 70,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '700',
    color: Color.sparklightBrightPurple,
  },
  
  // Loading Skeleton
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeleton: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderRadius: Border.br_7xs,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24, // CIRCULAR
    marginRight: Padding.p_xs,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    height: 16,
    width: '70%',
  },
  skeletonButton: {
    width: 70,
    height: 32,
  },
});

export default VideoServiceCard;