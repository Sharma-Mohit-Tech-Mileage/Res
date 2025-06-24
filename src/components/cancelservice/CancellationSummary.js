import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import CheckBox from "@react-native-community/checkbox";
import IconFaq from '../../res/svgIcons/troubleshooting/iconfaq';
import Tooltip from "rn-tooltip";
import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";
import ConfimationPopup from "./ConfirmationPopup";
import colors from "../../res/Colors";
import UpArrow from "../../res/svgIcons/UpArrow";
import TickIcon from "../../res/svgIcons/TickIcon1";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import EntryInput from "..//entry/EntryInput";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import moment from "moment";

const CancellationSummary = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] =
    useState(false);

  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
  }, [toggleCheckBoxTerm]);

   

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
const markedDates = {};
//for (let i = 0; i < 3; i++) {
    const date = moment(currentDate).add(0, "days").format("YYYY-MM-DD");
     const date1 = moment(currentDate).add(1, "days").format("YYYY-MM-DD");
      const date2 = moment(currentDate).add(2, "days").format("YYYY-MM-DD");
    markedDates[date] = {
        customStyles: {
        container: {
          backgroundColor: Color.sparklightGray,
          borderColor: Color.gray50,
          borderWidth: 1,
          elevation: 2
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    };

    markedDates[date1] = {
        customStyles: {
        container: {
          backgroundColor: 'green'
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    };

    markedDates[date2] = {
        customStyles: {
        container: {
          backgroundColor: 'green'
        },
        text: {
          color: 'black',
          fontWeight: 'bold'
        }
      }
    };
//}

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
            <InfoIcon />
          </View>
        </Tooltip>
      </View>
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
        <Image
          source={require("../../../assets/success.png")}
          size={48}
          style={{ marginBottom: 16 }}
        />
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
    const devices = [
      { name: "Modem", qty: 1, price: 5.0 },
      { name: "Router", qty: 2, price: 7.5 },
    ];

    const total = devices.reduce((sum, d) => sum + d.qty * d.price, 0);

    return (
      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
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
              paddingHorizontal: 4,
            }}
          >
            Qty
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "600",
              color: Color.sparklightWhite,
              textAlign: "right",
              paddingHorizontal: 4,
            }}
          >
            {"Price per unit "}
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
              borderBottomWidth: idx != devices.length - 1 ? 1 : 0,
              borderBottomColor: Color.sparklightGray,
            }}
          >
            <Text style={{ flex: 1, color: Color.colorGray_200 }}>
              {device.name}
            </Text>
            <Text
              style={{
                flex: 1,
                color: Color.colorGray_200,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {device.qty}
            </Text>
            <Text
              style={{
                flex: 1,
                color: Color.colorGray_200,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              ${(device.price * device.qty).toFixed(2)}
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
            width: "60%",
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{ flex: 1, fontWeight: "700", color: Color.colorGray_200,fontSize: 14,textAlign: "center", }}
          >
            Total
          </Text>
          <Text
            style={{
              flex: 1,
              fontWeight: "500",
              color: Color.colorGray_200,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
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
      <ScrollView style={{ flex: 1, marginBottom: 100 }}>
        <View style={[AppStyles.card, { margin: 16 }]}>
          {renderSuccessMessage()}
          <Text style={styles.header}>We’re Sad To See You Go</Text>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Disconnection date</Text>
            <Text style={styles.valueTxt}>10/10/2023</Text>
          </View>
          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Services</Text>
            <Text style={styles.valueTxt}>Internet - 300 Mbps Internet </Text>
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
            <Text style={styles.valueTxt}>$XX.XX</Text>
          </View>

          <View style={styles.seperator} />
          <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
            <Text style={styles.lableTxt}>Equipment</Text>
            <Text style={styles.valueTxt}>Leased Equipment Returns</Text>
          </View>
          <View style={styles.seperator} />
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
                Equipment return policy
              </Text>
              <UpArrow color={colors.sparklight_bright_purple} />
            </View>
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: 24,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <TickIcon color={colors.sparklight_bright_purple} size={16} />
                <Text
                  style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                >
                  To avoid incurring unreturned equipment fee charges, all
                  leased equipment must be returned by your next bill cycle.
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <TickIcon color={colors.sparklight_bright_purple} size={16} />
                <Text
                  style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                >
                  All leased equipment should be returned to your nearest {""}
                  <Text
                    style={[
                      styles.terms,
                      { color: Color.sparklightBrightPurple,textDecorationLine: "underline"},
                    ]}
                    onPress={() => {
                      console.log("Sparklight Local Office Pressed");
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
                <TickIcon color={colors.sparklight_bright_purple} size={16} />
                <Text
                  style={[styles.terms, { marginLeft: 8, marginRight: 16 }]}
                >
                  For your convenience, you may request an equipment pickup for
                  a fee. For more details on arranging this service, please{" "}
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
                    }}
                  >
                    contact us
                  </Text> directly.
                </Text>
              </View>
            </View>
            <View style={styles.seperator} />

            <Calendar
              // Customize the appearance of the calendar
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
                console.log("selected day", day);
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
                  marginRight: 12,
                }}
              >
                <IconFaq width={32} height={32} />
              </View>
              <Text style={[styles.terms, { marginRight: 24, textAlign: "left", flex: 1 }]}>
                {`Note: You do not need to be home for disconnection. Please secure your pet(s) so that the installer has safe access to your yard and inside your home.`}
              </Text>
            </View>
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
                tintColors={{
                  true: "#8D3B90",
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
            <EmailInfo />
          </View>
          <View style={{ marginHorizontal: 24, marginBottom: 24 }}>
            <EntryInput
              input={input}
              onChangeText={onChangeText}
              onSubmitText={keyboardDismiss}
              keyboardType="email-address"
              accessibilityRole="search"
              accessibilityLabel="Email address input field"
              accessibilityHint="Double tap to enter your email address for cancellation confirmation"
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
              // TODo
              //onContinue(selectedOption);
              setIsConfirmationPopupVisible(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Continue to Cancel   the service"
          >
            <Text style={[styles.makePayment, styles.makeTypo]}>
              {"Continue to cancel"}
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
            }}
            onClose={() => {
              setIsConfirmationPopupVisible(false);
            }}
          />
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
    marginTop: 5,
  },
    valueTxt1: {
    fontSize: FontSize.size_base,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorblack_100,
    lineHeight: 16,
    marginTop: 5,
  },
  seperator: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    marginVertical: Padding.p_base,
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
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "400",
  },
  terms: {
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 22,
    fontWeight: "400",
  },
};

export default CancellationSummary;
