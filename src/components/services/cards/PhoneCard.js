import React from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import { getPhonePortalURL } from "../utils/constants";
import SecondaryButton from "../../common/customui/PrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const PhoneCard = ({ planName, legacyBrand, loading = false }) => {
  const phonePortalURL = getPhonePortalURL(legacyBrand);
  const showManageButton = phonePortalURL !== null;

  const handleManagePhone = async () => {
    if (!phonePortalURL) return;
    try {
      const supported = await Linking.canOpenURL(phonePortalURL);
      if (supported) await Linking.openURL(phonePortalURL);
      else Alert.alert("Error", "Unable to open phone portal.");
    } catch (error) {
      Alert.alert("Error", "Unable to open phone portal.");
    }
  };

  if (loading) {
    // Change back to loading instead of true
    return (
      <View style={styles.container}>
        <View style={styles.card}>
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
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <View
            style={styles.iconWrapper}
            accessible={true}
            accessibilityLabel="Phone icon"
            accessibilityRole="image"
          >
            <MaterialCommunityIcons
              name="phone"
              size={16}
              color={theme.colors.primary}
            />
          </View>
          <Text
            style={styles.serviceType}
            accessible={true}
            accessibilityLabel="Phone Service"
            accessibilityLevel={2}
            accessibilityRole="header"
          >
            VOICE SERVICE
          </Text>
        </View>

        {/* Plan Name & Action */}
        <View style={styles.content}>
          <Text
            style={styles.planName}
            accessible={true}
            accessibilityLabel={`Plan Name - ${planName}`}
          >
            {planName}
          </Text>
        </View>
        {showManageButton && (
          <SecondaryButton
            title="Manage Phone Service"
            buttonType="submit"
            onPress={handleManagePhone}
            style={styles.bottomButton}
            accessibilityLabel="Manage Phone Service, Opens in your browser"
            accessibilityRole="button"
          />
        )}
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

export default PhoneCard;
