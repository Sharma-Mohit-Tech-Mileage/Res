import React from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import { getPhonePortalURL } from "../utils/constants";
import SecondaryButton from "../../common/customui/PrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../../../styles/AppStyles";
import {SectionTitle} from "../../common/customui/Typography";
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
    return (
      <View style={styles.container}>
        <View style={[AppStyles.card,{ padding: 16, marginHorizontal: 16 }]}>
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
      <View style={[styles.card, styles.cardSpacing]}>
        {/* Service Header */}
        <View style={styles.cardHreader}>
          {/* <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="phone"
              size={16}
              color={theme.colors.primary}
              accessible={false}
              importantForAccessibility="no"
            />
          </View> */}
          <SectionTitle
            style={{marginLeft: 8}}
            accessible={true}
            accessibilityLabel="Phone Service"
            accessibilityLevel={2}
            accessibilityRole="header"
          >
            Phone Service
          </SectionTitle>
        </View>

        {/* Plan Name & Action */}
        <View style={{ padding: 16 }}>
          <Text
            style={styles.planName}
            accessible={true}
            accessibilityLabel={`Plan Name - ${planName}`}
          >
            {planName}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: serviceCard.container,
  card: {
    ...AppStyles.card,
  },
  cardSpacing: {
    marginHorizontal: 16,
  }, 
  cardHreader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  bottomButton: serviceCard.bottomButton,
  // Service Header
  serviceHeader: serviceCard.serviceHeader,
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

export default PhoneCard;
