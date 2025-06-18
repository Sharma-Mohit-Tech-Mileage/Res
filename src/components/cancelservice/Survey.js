import React, { useState } from "react";
import { View, Text, Pressable,TextInput, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Radio } from "native-base";
import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";

const surveyOptions = [ { id:1, 
  value :"I relocated recently and no longer need the internet service."},
  {id :2 ,value :"I switched to another internet provider."},
  {id :3, value :"The cost of the internet service was too expensive."},
  {id: 4,value :"I was dissatisfied with the quality or reliability of the internet service."},
  {id:5 ,value :"Other (please explain below)"},
];

const Survey = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [myComment, setMyCommnet] = useState("");
  const [isNoComment, setIsNoComment] = useState(true);

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };
  onContinue = (option) => {
    // Handle the continue action with the selected option
    console.log("Selected option:", option);
    // Navigate to the next screen or perform any other action
    navigation.navigate("account", { screen: "cancelServiceSummary" });
  };

  const onChangeValue = (value) => {
    console.log("Selected value:", value);
    setSelectedOption(value);
  }

  return (
    <View style={styles.rootContainer}>
      <ProfileSettingsHeader
        title="Cancellation Reason"
        iconAlignment="right"
        onPressBack={onCancel}
        showIcon={true}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <ScrollView style={{ flex: 1, marginBottom: 100 }}>
      <View>
      <View style={[AppStyles.card, { margin: 16 }]}>
        <View style={{ padding: 24 }}>
          <Text style={styles.header}>We’re Sad To See You Go</Text>

          <Text style={[styles.optionTxt,{marginVertical:24,marginBottom:24}]}>Before you cancel, please let us know the  reason you are leaving. Your feedback is important and helps improve our service.</Text>
          <Radio.Group
            name="surveyOptions"
            value={selectedOption}
            onChange={onChangeValue}
          >
            {surveyOptions.map((option, idx) => (
              <Radio
                value={option.id}
                key={idx}
                style={{marginVertical:5}}
                //colorScheme={"primary.200"}
                
                accessibilityLabel={`Option ${idx + 1}`}
                accessibilityHint={`Select this option if you ${option.value.toLowerCase()}`}
                accessibilityRole="radio"
              >
                <Text style={styles.optionTxt}>{option.value}</Text>
              </Radio>
            ))}
          </Radio.Group>
         {selectedOption !='' && (
          <View style={{ borderWidth: 1, borderColor:Color.sparklightGray, marginTop:10, borderRadius:5 }}>
            <TextInput
              placeholder="Anything you want to share?.
              (Optional)"
              onChangeText={(text) => {
                setMyCommnet(text);
                if (text.length > 0) {
                  setIsNoComment(false);
                }
                //console.log("test", text);
              }}
              multiline
              numberOfLines={5}
              value={myComment}
              style={styles.textArea}
            />
          </View>
         )}
        </View>
      </View>
      <View>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: Color.colorMidnightblue },
            styles.buttonsLayout,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => {
            // TODo
            onContinue(selectedOption);
          }}
          accessibilityRole="button"
          accessibilityLabel="Continue to cancel   the service"
        >
          <Text style={[styles.makePayment, styles.makeTypo]}>
            {"Continue to Cancel"}
          </Text>
        </Pressable>
        <View style={styles.buttonsParent}>
          <SecondaryButton
            text="Don't Cancel"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Don't Cancel"
            accessibilityHint="Double tap to return to Profile Settings"
          />
        </View>
      </View>
      </View>
      </ScrollView>
    </View>
  );
};
const styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    marginHorizontal: 16,
    marginTop: 16,
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
  },
  makePayment: {
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
  header: {
    fontSize: 22,
    textAlign: "center",
    selfAlign: "center",
    fontWeight: "700",
    marginBottom: 16,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  optionTxt: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    marginBottom: 4,
    marginTop: 4,
    width: "92%",
  },textArea: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlignVertical: "top",
    padding: Padding.p_xs,
    height: 110,
  },
};

export default Survey;
