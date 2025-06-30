import React, { useState,useEffect } from "react";
import { View, Text, Pressable,TextInput, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Radio } from "native-base";
import {  useSelector } from "react-redux";
import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";
import { GetApiRequest, PostApiRequest } from "../../network/APIClient";
import LoadingOverlay from "../common/customui/CustomLoading";
import moment from "moment";
import { set } from "react-hook-form";



const Survey = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState({});
 const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [myComment, setMyCommnet] = useState("");
  const [isNoComment, setIsNoComment] = useState(true);

  const [surveyOptions, setSurveyOptions] = useState([])
 const profile = useSelector((state) => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DDTHH:mm:ssZ"));
  const [endDate, setEndDate] = useState(moment().add(10,'days').format("YYYY-MM-DDTHH:mm:ssZ"));

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };
  const onContinue = (option) => {
    setLoading(true);
    // Handle the continue action with the selected option
    console.log("Selected option:", option);
    // Navigate to the next screen or perform any other action
   // navigation.navigate("account", { screen: "cancelServiceSummary",item:selectedOption, comment: myComment });
    if (option && option.reasonCode) {
      requestPostDisconnect();
    } else {
      console.warn("Please select a reason before continuing.");
    }
  };

  const onChangeValue = (value) => {
    console.log("Selected value:", value);
    setSelectedOption(value);
  }

  useEffect(() => {
    getSurveyData();
  }, []);

const getSurveyData = () => {
  GetApiRequest("api/Survey",onSuccess=(res)=>{
    console.log("Survey data fetched successfully:", res);
    if(res && res.length > 0) {
      setSurveyOptions(res)
    }

  }),onError=(error)=>{
    console.error("Error fetching survey data:", error);
  }
    
}

const requestPostDisconnect = () => {
  const requestBody ={
  "disconnectOrder": {
    "accountID": profileDetails.accountNumber,
    "beginDate": currentDate,    //+10 days for end date
    "endDate": endDate,
    "customerRequestedCompletionDate": currentDate, //-begin date
    "orderReason": selectedOption.reasonCode,    //------- reasonCode
    "comments": myComment, //-comment
    "isForTransfer": false,
    "newTransferLocationId": ""
  }
}
console.log("Request body for disconnect:", requestBody);
  PostApiRequest(
    "api/Order/Disconnect",
    requestBody,
    (res) => {
      setLoading(false);
      console.log("Disconnect request successful:", res);
      // Handle success, e.g., navigate to a confirmation screen or show a success message
      navigation.navigate("account", { screen: "cancelServiceSummary",item:selectedOption, comment: myComment });
    },
    (error) => {
      setLoading(false);
      console.error("Error in disconnect request:", error);
      // Handle error, e.g., show an error message
    }
  );
};


  return (
    <View style={styles.rootContainer}>
      <ProfileSettingsHeader
        title="Cancellation Reason"
        iconAlignment="right"
        onPressBack={() => {
          navigation.goBack();
              }}
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
            alignContent={"flex-start"}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }} 
          >
            {surveyOptions.map((option, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginVertical: 5,
                  width: "100%",
                }}
              >
                <Radio
                  value={option}
                  accessibilityLabel={`Option ${idx + 1}`}
                  accessibilityHint={`Select this option if you ${option.questionText.toLowerCase()}`}
                  accessibilityRole="radio"
                  style={{ marginTop: 0, marginRight: 5, transform: [{ scale: 0.9 }] }} // Make radio smaller
                />
                <Text style={[styles.optionTxt, { flex: 1, marginBottom: 0, marginTop: 0 }]}>
                  {option.questionText}
                </Text>
              </View>
            ))}
          </Radio.Group> 
          {/* <RadioGroup 
         // labelStyle={styles.optionTxt}
            radioButtons={surveyOptions} 
            onPress={setSelectedId}
            selectedId={selectedId}
            containerStyle={styles.radioContainer}
           labelStyle={styles.labelStyle}
        /> */}
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

      {loading && <LoadingOverlay />}
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
  },radioContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  labelStyle: {
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 8,
  },
};

export default Survey;
