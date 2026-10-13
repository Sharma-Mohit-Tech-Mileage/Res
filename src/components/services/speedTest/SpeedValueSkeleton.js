import React from "react";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { theme } from "../../../styles/theme";

export default function SpeedValueSkeleton() {
  return (
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <SkeletonPlaceholder
        backgroundColor={theme.colors.skeleton.base}
        highlightColor={theme.colors.skeleton.highlight}
        borderRadius={4}
      >
        <View style={{ width: 72, height: 28 }} />
      </SkeletonPlaceholder>
    </View>
  );
}
