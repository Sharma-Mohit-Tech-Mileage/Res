import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import WaveAnimation from '../../../common/WaveIcon';
import OutageAreaIcon from '../../../../res/svgIcons/troubleshooting/OutageAreaIcon';
import ServiceIcon from '../../../../res/svgIcons/troubleshooting/ServiceIcon';
import WalletIcon from '../../../../res/svgIcons/troubleshooting/WalletIcon';
import TroubleshootIcon from '../../../../res/svgIcons/troubleshooting/TroubleshootIcon';

const ICON_MAP = {
  OutageAreaIcon: OutageAreaIcon,
  ServiceIcon: ServiceIcon,
  WalletIcon: WalletIcon,
  TroubleshootIcon: TroubleshootIcon,
};

const CheckStatusWrapper = ({ loading, result, icon, isIssueDetected, description ,step}) => {
  const IconComponent = ICON_MAP[icon];
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Text style={styles.topLeftText}>{step} of 3</Text>
      {/* Icon + Wave Animation */}
      <View style={[styles.iconContainer, { marginTop: screenHeight * 0.01 }]}>
        <WaveAnimation loading={loading} isIssueDetected={isIssueDetected}>
          <IconComponent width={80} height={80} />
        </WaveAnimation>
      </View>

      {/* Text */}
      <View style={[styles.textContainer, { marginTop: screenHeight * 0.05 }]}>
        <Text style={styles.resultText}>{result}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align everything from the top
  },
  iconContainer: {
    justifyContent: 'center', // Center the icon in its section horizontally
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'flex-start', // Adjust text positioning naturally
    alignItems: 'center',
    marginHorizontal: 16,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#292929',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
  },
  description: {
    lineHeight: 28,
    fontWeight: '400',
    fontSize: 16,
    color: '#4C5458',
    textAlign: 'center',
    paddingVertical: 8,
  },
  topLeftText: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#292929',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
},
});

export default CheckStatusWrapper;