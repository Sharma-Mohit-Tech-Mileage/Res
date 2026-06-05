import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import Facesad from "../../../assets/svgs/SmileyUnsatisfiedsel";
import Terrible from "../../../assets/svgs/SmileyVeryUnsatisfiedsel";
import Faceneutral from "../../../assets/svgs/Smileyneutralsel";
import Facesmile from "../../../assets/svgs/SmileySatisfiedsel";
import Facehappy from "../../../assets/svgs/SmileyverySatisfiedsel";

const feedbackOptions = [
  { value: 1, category: "complaint", name: "facesad", text: "Terrible", Icon: Terrible },
  { value: 2, category: "complaint", name: "facefrown", text: "Poor", Icon: Facesad },
  { value: 3, category: "neutral", name: "faceneutral", text: "Neutral", Icon: Faceneutral },
  { value: 4, category: "compliment", name: "facesmile", text: "Satisfied", Icon: Facesmile },
  { value: 5, category: "compliment", name: "facehappy", text: "Great", Icon: Facehappy },
];

const FeedbackRatingSelector = ({ selectedFeedback, onSelect, disabled }) => {
  return (
    <View style={styles.container}>
      {feedbackOptions.map((option, index) => (
        <RatingOption
          key={option.name}
          option={option}
          isSelected={selectedFeedback === option.name}
          onPress={() => onSelect(option)}
          disabled={disabled}
          index={index}
        />
      ))}
    </View>
  );
};

const RatingOption = ({ option, isSelected, onPress, disabled, index }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
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
    <Animated.View style={[styles.optionWrapper, animatedStyle]}>
      <Pressable
        accessibilityLabel={option.text}
        accessibilityRole="button"
        accessible={true}
        style={[
          styles.option,
          isSelected && styles.selectedOption,
          index === 0 && styles.firstOption,
          index === feedbackOptions.length - 1 && styles.lastOption,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <View style={styles.iconContainer}>
          <option.Icon color={isSelected ? "#fff" : undefined} />
        </View>
        <Text
          allowFontScaling={false}
          style={[styles.text, isSelected && styles.selectedText]}
        >
          {option.text}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: Border.br_5xs,
    borderWidth: 1,
    borderColor: Color.colorGainsboro_200,
    overflow: "hidden",
  },
  optionWrapper: {
    flex: 1,
  },
  option: {
    flex: 1,
    paddingVertical: Padding.p_base,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    transition: "all 0.3s ease",
  },
  firstOption: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastOption: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  selectedOption: {
    backgroundColor: Color.colorMidnightblue,
  },
  iconContainer: {
    height: 32,
    width: 32,
    overflow: "hidden",
  },
  text: {
    marginTop: 16,
    color: Color.colorGray_100,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: FontSize.size_xs,
    lineHeight: 18,
    width: "90%",
  },
  selectedText: {
    color: Color.sparklightWhite,
  },
});

export default FeedbackRatingSelector;