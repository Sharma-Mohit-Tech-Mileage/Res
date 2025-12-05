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
 * Enhanced SpeedDisplay Component
 * Features:
 * - Colored icon backgrounds
 * - Better visual hierarchy
 * - Improved spacing
 * - Prominent speed values
 * - Clean, modern layout
 */
const SpeedDisplay = ({ downloadSpeed, uploadSpeed, unit = "Mbps" }) => {
  return (
    <View style={styles.container}>
      {/* Download Speed */}
      <View style={styles.speedItem}>
        <DownloadArrow size={22} />
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
      <View style={[styles.speedItem, styles.speedItemLast]}>
        <UploadArrow size={22} />
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

const styles = StyleSheet.create({
  container: {
    marginTop: Padding.p_5xs,
  },
  speedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.gray50,
    borderRadius: Border.br_7xs,
    padding: Padding.p_xs,
    marginBottom: Padding.p_5xs,
  },
  speedItemLast: {
    marginBottom: 0,
  },
  arrowIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Padding.p_xs,
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
    letterSpacing: 0.5,
  },
  speedValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  speedValue: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorGray_200,
    fontWeight: '700',
    lineHeight: 28,
  },
  speedUnit: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default SpeedDisplay;