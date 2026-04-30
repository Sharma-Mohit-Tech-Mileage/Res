import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Radio } from "native-base";
import { useSelector } from "react-redux";
import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import NotificationAlert from "../common/customui/NotificationAlert";
import SecondaryButton from "../common/customui/SecondaryButton";
import { GetApiRequest, PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import LoadingOverlay from "../common/customui/CustomLoading";
import SmallLoader from "../common/customui/SmallLoader";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const errorRes = {
  error: "DISCONNECT_ERROR",
  message:
    "Sample error message..Sample error message..Sample error message..Sample error message..",
};

const Survey = ({ route }) => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [myComment, setMyCommnet] = useState("");
  const [isNoComment, setIsNoComment] = useState(true);
  const [isError, setIsError] = useState(false);
  const [planName, setPlanName] = useState(route.params?.planName || "");
  const [planPrice, setPlanPrice] = useState(route.params?.planPrice || "");
  // const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(errorRes);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const profile = useSelector((state) => state.profile || {});
  const profileDetails = profile.profileDetails || {};
  const [currentDate, setCurrentDate] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ssZ")
  );
  const [endDate, setEndDate] = useState(
    moment().add(10, "days").format("YYYY-MM-DDTHH:mm:ssZ")
  );
  const [loadingData, setLoadingData] = useState(false);
  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };
  const onContinue = (option) => {
    // Handle the continue action with the selected option
    console.log("Selected option:", option);
    // Navigate to the next screen or perform any other action
    // navigation.navigate("account", { screen: "cancelServiceSummary",item:selectedOption, comment: myComment });
    if (option) {
      requestPostDisconnect();
    } else {
      console.warn("Please select a reason before continuing.");
      //setIsError(true);
    }
  };

  const makeCall = (number) => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };

  const onChangeValue = (value) => {
    console.log("Selected value:", value);
    setSelectedOption(value);
    setIsError(false);
  };

  useEffect(() => {
    getSurveyData();
  }, []);

  const getSurveyData = () => {
    setLoadingData(true);
    GetApiRequest(getEndpoint(ENDPOINTS.SURVEY), (res) => {
      if (res && res.length > 0) {
        setSurveyOptions(res);
      }
      setLoadingData(false);
    }),
      (error) => {
        setLoadingData(false);
        console.error("Error fetching survey data:", error);
      };
  };

  const requestPostDisconnect = () => {
    setLoading(true);
    const requestBody = {
      disconnectOrder: {
        accountID: profileDetails.accountNumber,
        beginDate: currentDate, //+10 days for end date
        endDate: endDate,
        customerRequestedCompletionDate: currentDate, //-begin date
        orderReason: selectedOption.reasonCode, //------- reasonCode
        comments: myComment, //-comment
        isForTransfer: false,
        newTransferLocationId: "",
      },
    };
    PostApiRequest(
      getEndpoint(ENDPOINTS.SERVICE_DISCONNECT_SURVEY),
      requestBody,
      (res) => {
        setLoading(false);
        if (res.error != null && res?.error?.message) {
          setError(res.error);
        } else {
          navigation.navigate("cancelServiceSummary", {
            item: selectedOption,
            comment: myComment,
            planName: planName,
            planPrice: planPrice,
            data: res,
          });
        }
      },
      (error) => {
        setLoading(false);
        console.error("Error in disconnect request:", error);
        // Handle error, e.g., show an error message
      }
    );
  };

  const renderErrorMessage = () => {
    console.log("Error message", error);
    return (
      <>
        {error && error?.message && (
          <View
            style={{ paddingHorizontal: Padding.p_5xl, marginVertical: 16 }}
          >
            <NotificationAlert
              type="warning"
              title={"Disconnect Error"}
              message={error.message}
              showCloseIcon={true}
              onClose={() => {
                setError(null);
              }}
              isVisible={true}
              accessibilityLabel={error.message}
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
              customStyle={styles.warningAlert}
            />
          </View>
        )}
      </>
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
            {renderErrorMessage()}
            <View style={{ padding: 24 }}>
              <Text style={styles.header}>We’re Sad To See You Go</Text>

              <Text
                style={[
                  styles.optionTxt,
                  { marginVertical: 24, marginBottom: 24 },
                ]}
              >
                Before you cancel, please let us know the reason you are
                leaving. Your feedback is important and helps improve our
                service.
              </Text>
              <Radio.Group
                name="surveyOptions"
                value={selectedOption}
                onChange={onChangeValue}
                alignContent={"flex-start"}
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                {isError && (
                  <Text
                    style={[styles.labelStyle, { color: Color.sparkLightRed }]}
                  >
                    Please select a reason before continuing.
                  </Text>
                )}
                {loadingData && (
                  <View style={{ alignSelf: "center" }}>
                    <SmallLoader />
                  </View>
                )}
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
                      style={{
                        marginTop: 0,
                        marginRight: 5,
                        transform: [{ scale: 0.9 }],
                      }} // Make radio smaller
                    />
                    <Text
                      style={[
                        styles.optionTxt,
                        { flex: 1, marginBottom: 0, marginTop: 0 },
                      ]}
                    >
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
              {selectedOption != "" && (
                <View
                  style={{
                    flexDirection: "column",
                    borderWidth: 1,
                    borderColor: Color.sparklightGray,
                    marginTop: 10,
                    borderRadius: 5,
                  }}
                >
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
            <View style={[styles.buttonsParent, { marginTop: 10 }]}>
              <SecondaryButton
                text="Don't Cancel"
                onPress={() => navigation.goBack()}
                accessibilityLabel="Don't Cancel"
                accessibilityHint="Double tap to return to Profile Settings"
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  marginTop: 10,
                }}
              >
                <Text style={styles.manageSerTxt1}>
                  To cancel service, please call{" "}
                </Text>
                <Text
                  style={styles.manageSerTxt2}
                  onPress={() => makeCall("833-807-1020")}
                  accessibilityRole="link"
                  accessibilityLabel="Call 833 807 1020"
                  accessibilityHint="Double tap to call customer service"
                >
                  833-807-1020
                </Text>
              </View>
            </View>
          </View>

          {loading && <LoadingOverlay loadingTxt={"Loading"} />}
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
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
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
    width: "100%",
  },
  textArea: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlignVertical: "top",
    padding: Padding.p_xs,
    height: 110,
  },
  radioContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  labelStyle: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: 8,
  },
  manageSerTxt1: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "400",
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.sparklightGray1,
  },
  manageSerTxt2: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorMidnightblue,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    textDecorationLine: "underline",
  },
  manageSerTxt3: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    fontWeight: "700",
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
};

export default Survey;
