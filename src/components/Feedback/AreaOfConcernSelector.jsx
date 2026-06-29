import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import Touchable from "../common/customui/Touchable";

const concernOptions = [
  { id: "service_issue", label: "Service Issue" },
  { id: "speed_concern", label: "Speed Concern" },
  { id: "bug", label: "Bug" },
  { id: "pricing_plans", label: "Pricing & Plans" },
  { id: "billing_payments", label: "Billing & Payments" },
  { id: "customer_support", label: "Customer Support" },
  { id: "feature_request", label: "Feature Request" },
  { id: "equipment_issue", label: "Equipment Issue" },
  { id: "other_issues", label: "Other" },
];

const AreaOfConcernSelector = ({
  selectedConcerns = [],
  onSelect,
  disabled,
  hasError = false,
}) => {
  return (
    <View style={styles.container}>
      <Text
        style={[styles.label, hasError && styles.labelError]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="Area of Concern required"
      >
        Area of Concern *
      </Text>
      <View style={styles.chipsContainer}>
        {concernOptions.map((option) => (
          <ConcernChip
            key={option.id}
            option={option}
            isSelected={selectedConcerns.includes(option.id)}
            onPress={() => onSelect(option.id)}
            disabled={disabled}
          />
        ))}
      </View>
    </View>
  );
};

const ConcernChip = ({ option, isSelected, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSpring(1.05, { damping: 15, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
    onPress();
  };

  return (
    <Animated.View style={[styles.chipWrapper, animatedStyle]}>
      {/* minSize 0: small inline chips in a wrapped row; forcing 48x48 would distort chip sizing. */}
      <Touchable
        minSize={0}
        accessibilityLabel={option.label}
        style={[styles.chip, isSelected && styles.selectedChip]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
          {option.label}
        </Text>
      </Touchable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Padding.p_5xs,
  },
  label: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    marginBottom: Padding.p_5xs,
    alignSelf: "stretch",
  },
  labelError: {
    color: "red",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chipWrapper: {
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_81xl,
    borderWidth: 1.5,
    borderColor: Color.colorGainsboro_200,
    backgroundColor: Color.sparklightWhite,
  },
  selectedChip: {
    backgroundColor: Color.colorMidnightblue,
    borderColor: Color.colorMidnightblue,
  },
  chipText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
  },
  selectedChipText: {
    color: Color.sparklightWhite,
  },
});

export default AreaOfConcernSelector;
