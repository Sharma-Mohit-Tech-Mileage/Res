import React from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import { getChannelLineupURL } from "../utils/constants";
import SecondaryButton from "../../common/customui/PrimaryButton";
const VideoCard = ({ planName, zipCode, loading = false }) => {
  const handleChannelLineup = async () => {
    const url = getChannelLineupURL(zipCode);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("Error", "Unable to open channel lineup.");
    } catch (error) {
      Alert.alert("Error", "Unable to open channel lineup.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={[styles.skeleton, styles.skeletonHeader]} />
          <View style={[styles.skeleton, styles.skeletonTitle]} />
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
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="television"
              size={16}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.serviceType}>TV & VIDEO</Text>
        </View>

        {/* Plan Name & Action */}
        <View style={styles.content}>
          <Text style={styles.planName}>{planName}</Text>
        </View>
        <SecondaryButton
          title="View Channel Lineup"
          buttonType="submit"
          onPress={handleChannelLineup}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: serviceCard.container,
  card: serviceCard.card,
  bottomButton: serviceCard.bottomButton,
  // Service Header
  serviceHeader: serviceCard.serviceHeader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,

  // Content
  content: serviceCard.content,
  planName: serviceCard.planName,
  actionButton: serviceCard.actionButton,

  // Skeleton Loader
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
});

export default VideoCard;
