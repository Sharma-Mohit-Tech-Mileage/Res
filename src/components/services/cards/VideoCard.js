import React from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import { getChannelLineupURL } from "../utils/constants";
import SecondaryButton from "../../common/customui/PrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle } from "../../common/customui/Typography";
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
       <View style={[AppStyles.card,{ padding: 16 }]}>
          <SkeletonPlaceholder
            backgroundColor={theme.colors.skeleton.base}
            highlightColor={theme.colors.skeleton.highlight}
            speed={1000}
          >
            <View style={styles.skeletonHeader} />
            <View style={styles.skeletonTitle} />
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  if (!planName) return null;

  return (
    <View style={[styles.container]}>
      <View style={AppStyles.card}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          {/* <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="television"
              size={16}
              color={theme.colors.primary}
              accessible={false}
              importantForAccessibility="no"
            />
          </View> */}
          <SectionTitle
            accessible={true}
            style={{marginLeft: 8}}
            accessibilityLabel="TV & Video"
            accessibilityLevel={2}
            accessibilityRole="header"
          >
            TV & Video
          </SectionTitle>
        </View>

        {/* Plan Name & Action */}
        <View style={[styles.content,{padding: 16}]}>
          <Text
            style={styles.planName}
            accessible={true}
            accessibilityLabel={`Plan Name - ${planName}`}
          >
            { planName && planName.charAt(0).toUpperCase() + planName.slice(1)}
          </Text>
        </View>
        <View  style={styles.bottomButton}>
        <SecondaryButton
          title="View Channel Lineup"
          buttonType="submit"
          onPress={handleChannelLineup}
         
          accessibilityLabel="View Channel Lineup, Opens in your browser"
          accessibilityRole="button"
        />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: serviceCard.container,
  card: {
    ...AppStyles.card,
  },
  bottomButton: {
    marginBottom: 16,
  },
  // Service Header
  serviceHeader: AppStyles.cardHreader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,

  // Content
  content: serviceCard.content,
  planName: serviceCard.planName,

  // Skeleton Loader
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
});

export default VideoCard;
