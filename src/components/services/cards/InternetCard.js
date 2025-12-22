import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";
import { serviceCard, internetSpeed, skeletonLoader } from "../../../styles/compositions";

const InternetCard = ({
  planName,
  downloadSpeed,
  uploadSpeed,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.skeleton, styles.skeletonHeader]} />
          <View style={[styles.skeleton, styles.skeletonTitle]} />
          <View style={styles.skeletonSpeedContainer}>
            <View style={[styles.skeleton, styles.skeletonSpeed]} />
            <View style={[styles.skeleton, styles.skeletonSpeed]} />
          </View>
        </View>
      </View>
    );
  }

  if (!planName) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <View 
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
          >
            <MaterialCommunityIcons
              name="wifi"
              size={16}
              color={theme.colors.primary}
            />
          </View>
          <Text 
            style={styles.serviceType}
            accessible={true}
            accessibilityLabel="Internet, Heading level 2"
          >
            INTERNET
          </Text>
        </View>

        {/* Plan Name */}
        <View style={styles.content}>
          <Text 
            style={styles.planName}
            accessible={true}
            accessibilityLabel={`Plan Name - ${planName}`}
          >
            {planName}
          </Text>
        </View>

        {/* Speed Display */}
        <View style={styles.speedContainer}>
          {/* Download Speed */}
          <View 
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Download Speed: ${downloadSpeed} Mbps`}
          >
            <View 
              style={styles.speedIcon}
              accessible={false}
              importantForAccessibility="no"
            >
              <Text style={styles.speedArrow}>↓</Text>
            </View>
            <View style={styles.speedInfo}>
              <Text style={styles.speedLabel}>Download</Text>
              <View style={styles.speedValueRow}>
                <Text style={styles.speedValue}>{downloadSpeed}</Text>
                <Text style={styles.speedUnit}>Mbps</Text>
              </View>
            </View>
          </View>

          {/* Upload Speed */}
          <View 
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Upload Speed: ${uploadSpeed} Mbps`}
          >
            <View 
              style={styles.speedIcon}
              accessible={false}
              importantForAccessibility="no"
            >
              <Text style={styles.speedArrow}>↑</Text>
            </View>
            <View style={styles.speedInfo}>
              <Text style={styles.speedLabel}>Upload</Text>
              <View style={styles.speedValueRow}>
                <Text style={styles.speedValue}>{uploadSpeed}</Text>
                <Text style={styles.speedUnit}>Mbps</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: serviceCard.container,
  card: serviceCard.card,
  
  // Service Header
  serviceHeader: serviceCard.serviceHeader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,
  
  // Content
  content: serviceCard.content,
  planName: serviceCard.planName,
  
  // Speed Display
  speedContainer: internetSpeed.container,
  speedItem: internetSpeed.speedItem,
  speedIcon: internetSpeed.speedIcon,
  speedArrow: internetSpeed.speedArrow,
  speedInfo: internetSpeed.speedInfo,
  speedLabel: internetSpeed.speedLabel,
  speedValueRow: internetSpeed.speedValueRow,
  speedValue: internetSpeed.speedValue,
  speedUnit: internetSpeed.speedUnit,
  
  // Skeleton Loader
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
  skeletonSpeedContainer: skeletonLoader.skeletonSpeedContainer,
  skeletonSpeed: skeletonLoader.skeletonSpeed,
});

export default InternetCard;