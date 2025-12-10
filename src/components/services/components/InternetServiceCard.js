import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';

// Enhanced Download Arrow Icon
const DownloadArrow = ({ color = Color.sparklightBrightPurple, size = 20 }) => (
  <View style={[styles.arrowIconContainer, { backgroundColor: `${color}15` }]}>
    <Text style={[styles.arrowIcon, { color, fontSize: size }]}>↓</Text>
  </View>
);

// Enhanced Upload Arrow Icon
const UploadArrow = ({ color = Color.sparklightBrightPurple, size = 20 }) => (
  <View style={[styles.arrowIconContainer, { backgroundColor: `${color}15` }]}>
    <Text style={[styles.arrowIcon, { color, fontSize: size }]}>↑</Text>
  </View>
);

/**
 * SpeedDisplay Component
 * Features colored icon backgrounds and clean layout - SIDE BY SIDE
 */
const SpeedDisplay = ({ downloadSpeed, uploadSpeed, unit = "Mbps" }) => {
  return (
    <View style={styles.speedContainer}>
      {/* Download Speed */}
      <View style={styles.speedItem}>
        <DownloadArrow size={18} />
        <View style={styles.speedInfo}>
          <Text 
            style={styles.speedLabel}
            accessible={true}
            accessibilityLabel="Download Speed"
          >
            Download
          </Text>
          <View style={styles.speedValueRow}>
            <Text 
              style={styles.speedValue}
              accessible={true}
              accessibilityLabel={`${downloadSpeed} ${unit}`}
            >
              {downloadSpeed}
            </Text>
            <Text style={styles.speedUnit}>{unit}</Text>
          </View>
        </View>
      </View>

      {/* Upload Speed */}
      <View style={styles.speedItem}>
        <UploadArrow size={18} />
        <View style={styles.speedInfo}>
          <Text 
            style={styles.speedLabel}
            accessible={true}
            accessibilityLabel="Upload Speed"
          >
            Upload
          </Text>
          <View style={styles.speedValueRow}>
            <Text 
              style={styles.speedValue}
              accessible={true}
              accessibilityLabel={`${uploadSpeed} ${unit}`}
            >
              {uploadSpeed}
            </Text>
            <Text style={styles.speedUnit}>{unit}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * InternetServiceCard Component
 * Displays internet plan name and speeds
 */
const InternetServiceCard = ({ planName, downloadSpeed, uploadSpeed, loading = false }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Skeleton for plan name */}
          <View style={[styles.skeleton, styles.skeletonTitle]} />
          
          {/* Skeleton for speeds side by side */}
          <View style={styles.skeletonSpeedContainer}>
            <View style={[styles.skeleton, styles.skeletonSpeedBox]} />
            <View style={[styles.skeleton, styles.skeletonSpeedBox]} />
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
      accessibilityLabel={`Internet Service: ${planName}`}
    >
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
  planName: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.sparklightBrightPurple,
    marginBottom: Padding.p_xs,
  },
  
  // SpeedDisplay styles - SIDE BY SIDE
  speedContainer: {
    marginTop: Padding.p_5xs,
    flexDirection: 'row', // SIDE BY SIDE
    justifyContent: 'space-between',
  },
  speedItem: {
    flex: 1, // Equal width
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray50,
    borderRadius: Border.br_7xs,
    padding: Padding.p_5xs,
    marginHorizontal: 4, // Space between items
  },
  arrowIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Padding.p_7xs,
  },
  arrowIcon: {
    fontWeight: 'bold',
  },
  speedInfo: {
    flex: 1,
  },
  speedLabel: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  speedValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  speedValue: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorGray_200,
    fontWeight: '700',
  },
  speedUnit: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginLeft: 4,
    fontWeight: '600',
  },
  
  // Skeleton Loader Styles
  skeleton: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderRadius: Border.br_7xs,
  },
  skeletonTitle: {
    height: 20,
    width: '60%',
    marginBottom: Padding.p_xs,
  },
  skeletonSpeedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Padding.p_5xs,
  },
  skeletonSpeedBox: {
    flex: 1,
    height: 60,
    marginHorizontal: 4,
  },
});

export default InternetServiceCard;