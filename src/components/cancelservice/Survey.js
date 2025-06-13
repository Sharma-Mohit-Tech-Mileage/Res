import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Radio } from "native-base";
import { Color } from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";

const surveyOptions = [
  "I relocated recently and no longer need the internet service.",
  "I switched to another internet provider.",
  "The cost of the internet service was too expensive.",
  "I was dissatisfied with the quality or reliability of the internet service.",
  "Other (please explain below)",
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
        showIcon={true}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={[AppStyles.card, { margin: 16 }]}>
        <View style={{ padding: 24 }}>
        <Text>
          Why are you cancelling your service?
        </Text>
        <Radio.Group
          name="surveyOptions"
          value={selectedOption}
          onChange={setSelectedOption}
        >
          {surveyOptions.map((option, idx) => (
            <Radio value={option} key={idx} my={1} _checked={{ color: Color.sparklightBrightPurple }}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
        </View>
      </View>
      <View space={3} mb={2}>
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
      </View>
    </View>
  );
};
const styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },buttonsLayout: {
      paddingHorizontal: 0,
      marginHorizontal:16,
      marginTop:16,
      paddingVertical: Padding.p_base,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: Border.br_11xs,
      height: 56,
    },
    makeTypo: {
      width: 282,
      fontFamily: FontFamily.openSansRegular,
      fontSize: FontSize.size_base,
      textAlign: "center",
    },makePayment: {
      color: Color.sparklightWhite,
      width: 282,
    },
    buttons1: {
      marginTop: Padding.p_base,
      backgroundColor: Color.colorWhitesmoke_200,
      paddingHorizontal: 0,
      width: 382,
    },
    buttonsParent: {
      marginTop: Padding.p_base,
      alignSelf: "stretch",
    },
};

export default Survey;
