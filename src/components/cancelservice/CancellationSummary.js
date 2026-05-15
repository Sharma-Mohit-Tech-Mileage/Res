import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import SparkLightInput from "../common/customui/SparkLightInput";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import CheckBox from "@react-native-community/checkbox";
import Tooltip from "rn-tooltip";
import WarningIcon from "../../../assets/svgs/Alerttriangle";
import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";
import ConfimationPopup from "./ConfirmationPopup";
import colors from "../../res/Colors";
import UpArrow from "../../res/svgIcons/UpArrow";
import TickIcon from "../../res/svgIcons/TickIcon1";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import NotificationAlert from "../common/customui/NotificationAlert";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import LoadingOverlay from "../common/customui/CustomLoading";
import { getPrimaryEmail } from "../utility/constant";
import DownArrow from "../../res/svgIcons/DownArrow";
import SuccessIcon from "../../../assets/svgs/SuccessIcon";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const errorRes = {
  error: "DISCONNECT_ERROR",
  message:
    "Sample error message..Sample error message..Sample error message..Sample error message..",
};

const CancellationSummary = ({ navigation, route }) => {
  const { item, comment, planName, planPrice, data } = route.params || {};
  const MyRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] =
    useState(false);
  const [totalEquipmentFee, setTotalEquipmentFee] = useState(0);
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
  }, [toggleCheckBoxTerm]);
  const [email, setEmail] = useState("");
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const profileData = useSelector((state) => state.profile || {});
  const profileDetails = profileData.profileDetails || {};
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const [showTerms, setShowTerms] = useState(true);

  const accountDetails = profileData?.accountDetails;

  const userData = profileData?.user?.userData;

  const [previousResponse, setPreviousResponse] = useState(
    navigation.getState().routes[1].params?.item || {}
  );

  const [error, setError] = useState(errorRes);
  //console.log("Account", JSON.stringify(accountDetails));
  const [devices, setDevices] = useState([]);
  const myTheme = {
    arrowColor: Color.sparklightBrightPurple,
    textSectionTitleColor: Color.sparklightDarkGray,
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: getPrimaryEmail(accountDetails) || "", // Default email from profile details
    },
  });

  const handleSave = useCallback((data) => {
    const { email } = data;
    console.log("Email:", email);
    setEmail(email);
    if (toggleCheckBoxTerm) {
      setIsConfirmationPopupVisible(true);
    }
  });

  const handleValidationError = useCallback(() => {
    if (!toggleCheckBoxTerm) {
      //setIsSubmitted(true);
    }
  }, []);

  const date = moment(currentDate).add(0, "days").format("YYYY-MM-DD");
  const date1 = moment(currentDate).add(1, "days").format("YYYY-MM-DD");
  const date2 = moment(currentDate).add(2, "days").format("YYYY-MM-DD");

  useEffect(() => {
    markedDates[date] = {
      customStyles: {
        container: {
          backgroundColor: Color.sparklightGray,
          borderColor: Color.sparklightDarkGray,
          borderWidth: 1,
          elevation: 2,
        },
        text: {
          color: Color.colorGray_200,
          fontWeight: "400",
        },
      },
    };

    markedDates[date1] = {
      customStyles: {
        container: {
          backgroundColor: Color.sparklightGray,
          borderColor: Color.sparklightDarkGray,
          borderWidth: 1,
          elevation: 2,
        },
        text: {
          color: Color.colorGray_200,
          fontWeight: "400",
        },
      },
    };

    markedDates[date2] = {
      customStyles: {
        container: {
          backgroundColor: Color.sparklightGray,
          borderColor: Color.sparklightDarkGray,
          borderWidth: 1,
          elevation: 2,
        },
        text: {
          color: Color.colorGray_200,
          fontWeight: "400",
        },
      },
    };

    setMarkedDates(markedDates);
    //getEquipmentDetails();
  }, []);

  useEffect(() => {
    console.log("Marked Dates Updated:", JSON.stringify(markedDates));
    setSelectedOption(date);
  }, [markedDates]);

  useEffect(() => {
    if (accountDetails) {
      setDevices(userData?.userInfo?.unreturnedEquipmentFees || []);
      if (userData?.userInfo.unreturnedEquipmentFees) {
        const totalFee = userData?.userInfo.unreturnedEquipmentFees.reduce(
          (sum, d) => sum + 1 * d.fee,
          0
        );
        userData?.userInfo.unreturnedEquipmentFees.forEach((device) => {
          let equipment = {
            equipmentName: device.description,
            quantity: 1,
            pricePerUnit: device.fee,
          };
          setEquipmentDetails((prev) => [...prev, equipment]);
        });

        setTotalEquipmentFee(totalFee);
      }
      //const updatedPrimaryEmail = getPrimaryEmail(accountDetails);
      //setEmail(updatedPrimaryEmail)
      //setValue({email: updatedPrimaryEmail})
    }
  }, [accountDetails]);

  // const getEquipmentDetails = () => {
  //   const requestURL = `api/Equipment/GetEquipmentDetails?accountNumber=${profileDetails.accountNumber}&includeServiceCode=true`;
  //   GetApiRequest(
  //     requestURL,
  //     (res) => {
  //       console.log("Equipment Details:", res);
  //       // Process the equipment details as needed
  //       //setDevices(res.equipments || []);
  //     },
  //     (error) => {
  //       console.error("Error fetching equipment details:", error);
  //     }
  //   );
  // };

  // Function to handle the confirmation popup

  const requestPostCancellationservice = () => {
    setLoading(true);
    const nextendays = moment(currentDate).add(10, "days").format("YYYY-MM-DD");
    const requestBody = {
      commitDisconnectOrder: {
        temporaryOrderID: data.temporaryOrderID, // temporaryOrderID
        temporaryJobID: data.temporaryJobID, // temporaryJobID
        conversationID: data.conversationID, // conversationID
        orderReason: previousResponse.reasonCode, // reasonCode
        accountId: profileDetails.accountNumber,
        comments: comment || "Mobile", // comment
        customerRequestedCompletionDate: nextendays, // -begin date
        selectedDate: null,
        selectedTimeSlotCode: null,
        isForTransfer: false,
        newTransferLocationId: null,
        transferCustomerId: null,
      },
      surveyRequest: {
        QuestionId: previousResponse.questionId, // questionId
        AccountId: profileDetails.accountNumber,
        Response: true,
        AdditionalResponseText: "",
        ReasonCode: previousResponse.reasonCode,
        EquipmentReturnPolicyAgreementFlag: true,
      },
      statisticsInfoRequest: {
        AccountId: profileDetails.accountNumber,
        FunctionName: "Cancel",
        Platform: "Mobile",
      },
      disconnectSnapshotRequest: {
        accountId: profileDetails.accountNumber,
        productName: planName,
        monthlyRate: planPrice,
        disconnectedDate: nextendays,
        equipmentSnapshotRequest: equipmentDetails,
        isTruckRoll: data?.availableTimeslots.length > 0 ? true : false,
        confirmationEmail: email,
        totalEquipmentFee: totalEquipmentFee,
      },
    };

    PostApiRequest(
      getEndpoint(ENDPOINTS.ORDER_COMMIT_DISCONNECT),
      requestBody,
      (res) => {
        setLoading(false);
        if (res.error != null && res?.error?.message) {
          setError(res.error);
        } else {
          setIsSuccessMessageVisible(true);
          MyRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }

        //getEquipmentDetails();
      },
      (error) => {
        setLoading(false);
        console.error("Error in cancellation service request:", error);
      }
    );
  };

  const onChangeText = (text) => {
    setInput(text);
    setEnableButton(text.length > 0);
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };
  const [input, setInput] = useState("");

  const EmailInfo = () => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Tooltip
          backgroundColor="#4C5458"
          overlayColor="#00000000"
          width={180}
          height={100}
          popover={
            <Text style={{ color: "#FFF" }}>
              We’ll send the confirmation to this email address.
            </Text>
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <InfoIcon />
          </View>
        </Tooltip>
      </View>
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

  const renderSuccessMessage = () => {
    return (
      <View
        style={{
          padding: 24,
          backgroundColor: "#F0F9F2",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ marginBottom: 16 }}>
          <SuccessIcon />
        </View>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "500",
            fontFamily: FontFamily.openSansRegular,
            color: Color.colorGray_200,
            textAlign: "center",
            marginHorizontal: 24,
          }}
        >
          Your Sparklight Services Have Been Cancelled
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 24,
            textDecorationLine: "underline",
            fontSize: 16,
            fontWeight: "400",
            color: "#353091",
          }}
        >
          {" "}
          Print Confimation
        </Text>
      </View>
    );
  };

  const renderDeviceList = () => {
    // This function can be used to render a list of devices

    const total = devices.reduce((sum, d) => sum + 1 * d.fee, 0);

    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 16, marginTop: 10 }}>
        {/* Header Row */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 8,
            backgroundColor: "#8D3B90",
            paddingVertical: 10,
          }}
        >
          <Text
            style={{ flex: 1, fontWeight: "500", color: Color.sparklightWhite }}
          >
            {" "}
            {"  Device"}
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "600",
              color: Color.sparklightWhite,
              textAlign: "center",
              alignSelf: "center",
              paddingLeft: 16,
            }}
          >
            Qty
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "600",
              color: Color.sparklightWhite,
              textAlign: "center",
              paddingRight: 16,
            }}
          >
            {"Price"}
          </Text>
        </View>
        {/* Device Rows */}
        {devices.map((device, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              marginBottom: 4,
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderBottomWidth: idx != devices.length - 1 ? 1 : 0,
              borderBottomColor: Color.sparklightGray,
            }}
          >
            <Text style={{ flex: 1, color: Color.colorGray_200 }}>
              {device.description}
            </Text>
            <Text
              style={{
                flex: 1,
                color: Color.colorGray_200,
                fontSize: 14,
                textAlign: "center",
                alignSelf: "center",
              }}
            >
              {"1"}
            </Text>
            <Text
              style={{
                flex: 1,
                color: Color.colorGray_200,
                fontSize: 14,
                textAlign: "center",
                alignSelf: "center",
              }}
            >
              {/* ${(device.price * device.qty).toFixed(2)} */}$
              {device?.fee?.toFixed(2)}
            </Text>
          </View>
        ))}
        {/* Total Row */}
        <View style={{ height: 1, backgroundColor: Color.sparklightGray }} />
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: Color.sparklightBrightPurple,
            paddingVertical: 8,
            backgroundColor: "#F8F8F8",
            width: "65%",
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{
              flex: 1,
              fontWeight: "700",
              color: Color.colorGray_200,
              fontSize: 14,
              textAlign: "center",
              alignSelf: "center",
            }}
          >
            Total Price
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "500",
              color: Color.colorGray_200,
              fontSize: 14,
              textAlign: "center",
              marginRight: 10,
            }}
          >
            ${total?.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };

  const onDaySelected = (selectedDate) => {
    //setCurrentDate(selectedDate);

    //for (const date in markedDates) {

    // Deselect all dates first
    const updatedMarkedDates = {};
    Object.keys(markedDates).forEach((d) => {
      updatedMarkedDates[d] = {
        customStyles: {
          container: {
            backgroundColor: Color.sparklightGray,
            borderColor: Color.sparklightDarkGray,
            borderWidth: 1,
            elevation: 2,
          },
          text: {
            color: Color.colorGray_200,
            fontWeight: "400",
          },
        },
      };
    });

    // Select the clicked date
    if (updatedMarkedDates[selectedDate]) {
      updatedMarkedDates[selectedDate] = {
        customStyles: {
          container: {
            backgroundColor: Color.sparklightBrightPurple,
            borderColor: Color.sparklightDarkGray,
            borderWidth: 1,
            elevation: 0,
          },
          text: {
            color: Color.sparklightWhite,
            fontWeight: "400",
          },
        },
      };
    }

    setMarkedDates(updatedMarkedDates);
    setSelectedOption(selectedDate);
    //}

    // if (markedDates[selectedDate]) {
    //   const updatedMarkedDates = { ...markedDates };
    //   //if (updatedMarkedDates[selectedDate].isSelected) {
    //     updatedMarkedDates[selectedDate] = {
    //       customStyles: {
    //         container: {
    //           backgroundColor: Color.sparklightBrightPurple,
    //           borderColor: Color.sparklightDarkGray,
    //           borderWidth: 1,
    //           elevation: 0,
    //         },
    //         text: {
    //           color: Color.colorWhitesmoke_200,
    //           fontWeight: "400",
    //         },
    //       },
    //     };
    //    // updatedMarkedDates[selectedDate].isSelected = false;
    //   setMarkedDates(updatedMarkedDates);
    //     return;

    // } else {
    //   // If the date is not selected, select it
    //   const updatedMarkedDates = { ...markedDates };
    //   updatedMarkedDates[selectedDate] = {
    //     customStyles: {
    //       container: {
    //         backgroundColor: Color.sparklightGray,
    //         borderColor: Color.sparklightDarkGray,
    //         borderWidth: 1,
    //         elevation: 0,
    //       },
    //       text: {
    //         color: Color.colorGray_200,
    //         fontWeight: "400",
    //       },
    //     },
    //   };
    //   //updatedMarkedDates[selectedDate].isSelected = true;
    //   setMarkedDates(updatedMarkedDates);
    // }
  };

  return (
    <View style={styles.rootContainer}>
      <ProfileSettingsHeader
        title="Cancellation Summary"
        iconAlignment="right"
        onPressBack={() => navigation.goBack()}
        showIcon={true}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <ScrollView style={{ flex: 1, marginBottom: 100 }} ref={MyRef}>
        <View style={[AppStyles.card, { margin: 16 }]}>
          {isSuccessMessageVisible && renderSuccessMessage()}
          {renderErrorMessage()}
          <Text style={styles.header}>We’re Sad To See You Go</Text>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Account Number</Text>
            <Text style={styles.valueTxt}>{profileDetails.accountNumber}</Text>
          </View>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Disconnection Date</Text>
            <Text style={styles.valueTxt}>{currentDate}</Text>
          </View>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Services</Text>
            <Text style={styles.valueTxt}>{planName} </Text>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text style={{ fontSize: 14, fontWeight: "400" }}>
                Change Plan instead? Call{" "}
              </Text>
              <Text
                style={{
                  color: Color.colorMidnightblue,
                  textDecorationLine: "underline",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                866-888-8888{" "}
              </Text>
            </View>
          </View>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Monthly Price Plan</Text>
            <Text style={styles.valueTxt}>${planPrice}</Text>
          </View>

          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Equipment</Text>
            <Text style={styles.valueTxt}>Leased Equipment Returns</Text>
          </View>

          {renderDeviceList()}

          <View style={styles.seperator} />
          <View>
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.valueTxt1,
                  { color: colors.sparklight_bright_purple },
                ]}
              >
                EQUIPMENT RETURN POLICY
              </Text>
              <Pressable
                onPress={() => {
                  setShowTerms((prev) => !prev);
                }}
              >
                {showTerms ? (
                  <UpArrow color={colors.sparklight_bright_purple} />
                ) : (
                  <DownArrow />
                )}
              </Pressable>
            </View>
            {showTerms && (
              <View
                style={{
                  flexDirection: "column",
                  paddingHorizontal: 24,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", marginTop: 16 }}>
                  <View style={{ marginTop: 5 }}>
                    <TickIcon />
                  </View>
                  <Text
                    style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                  >
                    To avoid incurring unreturned equipment fee charges, all
                    leased equipment must be returned by your next bill cycle.
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 16 }}>
                  <View style={{ marginTop: 5 }}>
                    <TickIcon />
                  </View>
                  <Text
                    style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                  >
                    All leased equipment should be returned to your nearest {""}
                    <Text
                      style={[
                        styles.terms,
                        {
                          color: Color.sparklightBrightPurple,
                          textDecorationLine: "underline",
                        },
                      ]}
                      onPress={() => {
                        console.log("Sparklight Local Office Pressed");
                        navigation.navigate("ArticalWindowUtility", {
                          url: "https://www.sparklight.com/locations",
                          name: "Service Locations",
                        });
                      }}
                    >
                      {" "}
                      Sparklight Local Office.
                    </Text>{" "}
                    Prior to your visit, we recommend confirming the hours of
                    operation and ensuring the location can accept returned
                    equipment.{" "}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", marginTop: 16 }}>
                  <View style={{ marginTop: 5 }}>
                    <TickIcon />
                  </View>
                  <Text
                    style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                  >
                    For your convenience, you may request an equipment pickup
                    for a fee. For more details on arranging this service,
                    please{" "}
                    <Text
                      style={{
                        color: Color.sparklightBrightPurple,
                        textDecorationLine: "underline",
                        fontFamily: FontFamily.openSansRegular,
                        fontSize: 14,
                        fontWeight: "400",
                      }}
                      onPress={() => {
                        // Add your contact action here
                        navigation.navigate("ArticalWindowUtility", {
                          url: "https://www.sparklight.com/contactus?isMobile=true",
                          name: "Contact Us",
                        });
                      }}
                    >
                      contact us
                    </Text>{" "}
                    directly.
                  </Text>
                </View>
              </View>
            )}
            {data.availableTimeslots && data.availableTimeslots.length > 0 && (
              <>
                <View style={styles.seperator} />

                <Calendar
                  theme={myTheme}
                  // Customize the appearance of the calendar
                  selectedOption={selectedOption}
                  style={{
                    marginHorizontal: 24,
                    borderColor: Color.sparklightGray,
                    borderWidth: 1,
                    borderRadius: Border.br_11xs,
                  }}
                  // Specify the current date
                  current={currentDate}
                  // Callback that gets called when the user selects a day
                  onDayPress={(day) => {
                    onDaySelected(day.dateString);
                  }}
                  // Mark specific dates as marked
                  markingType="custom"
                  minDate={new Date().toISOString().split("T")[0]} // Disable past dates
                  markedDates={markedDates}
                />

                <View
                  style={{
                    backgroundColor: Color.Gray300,
                    marginHorizontal: 24,
                    marginVertical: 16,
                    padding: 8,
                    borderRadius: 5,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 8,
                    }}
                  >
                    <IconFaq width={32} height={32} />
                  </View>
                  <Text
                    style={[
                      styles.terms,
                      { marginRight: 8, textAlign: "left", flex: 1 },
                    ]}
                  >
                    <Text style={[styles.terms, { fontWeight: "700" }]}>
                      Note:
                    </Text>{" "}
                    {` You do not need to be home for disconnection. Please secure your pet(s) so that the installer has safe access to your yard and inside your home.`}
                  </Text>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.checkboxTouchable}
            onPress={handleCheckboxToggle}
            accessibilityRole="checkbox"
            accessibilityLabel="I agree to Paperless Billing Terms and Conditions"
            accessibilityState={{ checked: toggleCheckBoxTerm }}
          >
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={true}
                value={toggleCheckBoxTerm}
                style={styles.checkBox}
                boxType="square"
                onCheckColor={Color.sparklightBrightPurple}
                tintColor={Color.sparklightBrightPurple}
                onTintColor={Color.sparklightBrightPurple}
                tintColors={{
                  true: Color.sparklightBrightPurple,
                  false:
                    Platform.OS === "ios"
                      ? Color.colorWhitesmoke_300
                      : "#D0D5DD",
                }}
                accessible={false}
              />
              <Text
                style={[styles.checkBoxAreaViewText, { marginLeft: 4 }]}
                allowFontScaling={true}
                maxFontSizeMultiplier={1}
              >
                I understand and agree to the Equipment Return Policy above.
              </Text>
            </View>
          </TouchableOpacity>
          {!toggleCheckBoxTerm && isSubmitted && (
            <View style={{ flexDirection: "row", marginHorizontal: 24 }}>
              <View style={styles.errorIcon}>
                <WarningIcon />
              </View>
              <Text
                style={[
                  styles.checkBoxAreaViewText,
                  { color: Color.sparkLightRed },
                ]}
              >
                You must agree to the Equipment Return Policy.
              </Text>
            </View>
          )}
          <View style={styles.seperator} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 24,
              marginBottom: 16,
            }}
          >
            {/* <Text style={{fontFamily:FontFamily.openSansRegular,fontSize:14,color:Color.colorGray_200,marginRight:8}}>Email address</Text> */}
            <Text
              style={[
                {
                  fontFamily: FontFamily.openSansRegular,
                  fontSize: 14,
                  color: Color.colorGray_200,
                  marginRight: 8,
                },
              ]}
            >
              {"Email Address"}
            </Text>
            <EmailInfo />
          </View>
          <View
            style={{
              marginHorizontal: 8,
              marginBottom: 24,
              alignItems: "center", // Center the EntryInput horizontally
              justifyContent: "center", // Optional: center vertically if needed
            }}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <SparkLightInput
                  placeholder="Email Address"
                  onBlur={onBlur}
                  style={{ width: "92%", marginHorizontal: 24 }}
                  onChangeText={onChange}
                  value={value ? value.toLowerCase() : ""}
                  error={errors.email?.message}
                  label=""
                  accessibilityLabel={
                    errors.email
                      ? `Email address input. Error: ${errors.email.message}`
                      : "Email address input"
                  }
                />
              )}
            />
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
              setIsSubmitted(true);
              handleSubmit(handleSave)();
            }}
            accessibilityRole="button"
            accessibilityLabel="Confirm to cancel the service"
          >
            <Text style={[styles.makePayment, styles.makeTypo]}>
              {"Confirm cancel"}
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
          <ConfimationPopup
            visible={isConfirmationPopupVisible}
            message={
              "Please review before continuing. Changes can’t be made after submission."
            }
            title={"Is your information correct? "}
            onActionTxt={"Confirm Cancellation"}
            onAction={() => {
              setIsConfirmationPopupVisible(false);
              requestPostCancellationservice();
            }}
            onClose={() => {
              setIsConfirmationPopupVisible(false);
            }}
          />
          {loading && (
            <LoadingOverlay
              loadingTxt={"Cancelling your service..."}
              visible={loading}
            />
          )}
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
  lableTxt: {
    fontSize: FontSize.size_sm,
    fontWeight: "500",
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorGray_200,
    lineHeight: 14,
  },
  valueTxt: {
    fontSize: FontSize.size_base,
    fontWeight: "700",
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorblack_100,
    lineHeight: 16,
    marginTop: 10,
  },
  valueTxt1: {
    fontSize: FontSize.size_base,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorblack_100,
    lineHeight: 16,
    marginTop: 5,
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
  seperator: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    marginVertical: Padding.p_base,
  },
  errorIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    selfAlign: "center",
    fontWeight: "700",
    marginVertical: 24,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 5 : 16,
    backgroundColor: Color.colorWhitesmoke_100,
    marginTop: Platform.OS === "ios" ? 5 : 0,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: Padding.p_5xl,
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
    paddingHorizontal: Padding.p_5xl,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "400",
  },
  terms: {
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 18,
    fontWeight: "400",
  },
};

export default CancellationSummary;
