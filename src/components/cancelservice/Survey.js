import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { VStack, Radio } from "native-base";
import { Color } from "../../../GlobalStyles";

const surveyOptions = [
  "Too expensive",
  "Moving to a new location",
  "Not satisfied with service",
  "Found a better alternative",
  "Other",
];

const Survey = (navigation) => {
  const [selectedOption, setSelectedOption] = useState("");

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };
  onContinue = (option) => {
    // Handle the continue action with the selected option
    console.log("Selected option:", option);
    // Navigate to the next screen or perform any other action
    navigation.navigate("account", { screen: "Account" });
  };

  return (
    <View style={styles.rootContainer}>
      <ProfileSettingsHeader
        title="Cancel Service Survey"
        iconAlignment="right"
        showIcon={false}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <VStack space={4} mt={8}>
        <Text fontSize="xl" fontWeight="bold">
          Why are you cancelling your service?
        </Text>
        <Radio.Group
          name="surveyOptions"
          value={selectedOption}
          onChange={setSelectedOption}
        >
          {surveyOptions.map((option, idx) => (
            <Radio value={option} key={idx} my={1}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
      </VStack>
      <VStack space={3} mb={2}>
        <Pressable
          isDisabled={!selectedOption}
          colorScheme="danger"
          onPress={() => onContinue(selectedOption)}
        >
          <Text>Continue to Cancel</Text>
        </Pressable>
        <Pressable variant="outline" onPress={onCancel}>
          <Text> Don't Cancel</Text>
        </Pressable>
      </VStack>
    </View>
  );
};
const styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
};

export default Survey;
