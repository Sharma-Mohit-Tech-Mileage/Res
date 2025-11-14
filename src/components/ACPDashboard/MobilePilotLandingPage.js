import React, { useEffect } from "react";
import { View, Text, Linking, ScrollView, Platform } from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import PilotServiceStatus from "./PilotServiceStatus";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import Infocircle from "../../../assets/svgs/Infocircle";
import MobilePromo from "./MobilePromo";
import PilotFaqs from "./PilotFaqs";
import { useSelector } from "react-redux";
import moment from "moment";

const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";

const MobilePilotLandingPage = ({ status = "Pending Status" }) => {
  const userData = useSelector((state) => state.user.userData?.userInfo);
  const [isMobileServiceActive, setIsMobileServiceActive] =
    React.useState(false);
  const [action, setAction] = React.useState("");

  useEffect(() => {
    /* Determine if the mobile service should be active based on user data */
    if (userData?.mobile_eligible === true && userData?.has_mobile === false) {
      setIsMobileServiceActive(true);
    } else if (
      userData?.mobile_eligible === true &&
      userData?.has_mobile === true
    ) {
      setIsMobileServiceActive(false);
    } else if (userData?.mobile_eligible === false) {
      setIsMobileServiceActive(false);
    }

    /* Set action based on fullfillment type */
    if (
      userData?.fulfillment_type.toLowerCase() ==
      "Professional Install".toLowerCase()
    ) {
      setAction("Awaiting Professional Install.");
    } else if (
      userData?.fulfillment_type.toLowerCase() ==
      "Self-Install (shipped)".toLowerCase()
    ) {
      setAction("Awaiting Customer Equipment to be Shipped.");
    }
    if (
      userData?.fulfillment_type.toLowerCase() ==
      "Self-Install (pickup)".toLowerCase()
    ) {
      setAction("Awaiting Customer Equipment Pickup.");
    }
  }, [userData]);

  const getTimeSlotText = (timeSlot) => {
    switch (timeSlot) {
      case "1-5":
        return "1 PM - 5 PM";
      case "8-12":
        return "8 AM - 12 PM";
      case "8-5":
        return "8 AM - 5 PM";
      default:
        return "";
    }
  };

  const getPendingStatusMessage = (userData) => {
    if (
      userData?.fulfillment_type.toLowerCase() ==
      "Professional Install".toLowerCase()
    ) {
      let appointmentDate = moment(userData?.scheduled_date).format(
        DEFAULT_DATE_FORMAT
      );
      let timeSlot = getTimeSlotText(userData?.time_slot);
      return professionalInstallView(appointmentDate, timeSlot);
    } else if (
      userData?.fulfillment_type.toLowerCase() ==
      "Self-Install (shipped)".toLowerCase()
    ) {
      return selfInstallShipped();
    }
    if (
      userData?.fulfillment_type.toLowerCase() ==
      "Self-Install (pickup)".toLowerCase()
    ) {
      return selfInstallPickup();
    } else {
      return <></>;
    }
  };

  const professionalInstallView = (scheduled_date, time_slot) => {
    return (
      <View style={{ marginTop: 0 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}
        accessible={true}
        accessibilityLabel={`Your appointment is scheduled for ${scheduled_date} from ${time_slot}. `}
        accessibilityRole="text"
        >
          <Text style={styles.subText} accessible={false}>
            {`Your appointment is scheduled for ${scheduled_date} from ${time_slot}. If you have any questions or need to reschedule, please `}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 4,
          }}
        >
          <Text style={styles.subText}
          accessible={false}>
            If you have any questions or need to reschedule, please call{" "}
          </Text>
          <Text
            style={[
              styles.subText,
              {
                color: "#353091",
                textDecorationLine: "underline",
                fontWeight: "bold",
              },
            ]}
            onPress={() => Linking.openURL("tel:8776922253")}
            accessibilityLabel="Call 877-692-2253"
            accessibilityRole="link"
            accessible={true}
          >
            877-692-2253
          </Text>
        </View>
      </View>
    );
  };

  const selfInstallPickup = () => {
    return (
      <View style={{ marginTop: 0 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={styles.subText} accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Drop by any of our Sparklight stores to pick up your equipment. Just a quick reminder to bring your photo ID and account number along with you. See you soon!. ">
            {
              "Drop by any of our Sparklight stores to pick up your equipment. Just a quick reminder to bring your photo ID and account number along with you. See you soon!. "
            }
          </Text>
          <Text
            style={[
              styles.subText,
              {
                color: "#353091",
                textDecorationLine: "underline",
                fontWeight: "bold",
              },
            ]}
            accessibilityLabel="Sparklight Store Locations and Hours"
            accessibilityRole="link"
            accessibilityHint="Opens Sparklight Store Locator webpage"
            accessible={true}
            onPress={() => {
              Linking.openURL("https://www.sparklight.com/store-locator");
            }}
          >
            Sparklight Store Locations and Hours.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 4,
          }}
        >
          <Text style={styles.subText}>
            If you have any questions, please call{" "}
          </Text>
          <Text
            style={[
              styles.subText,
              {
                color: "#353091",
                textDecorationLine: "underline",
                fontWeight: "bold",
              },
            ]}
            onPress={() => Linking.openURL("tel:8776922253")}
            accessibilityLabel="Call 877-692-2253"
            accessibilityRole="link"
            accessible={true}
          >
            877-692-2253
          </Text>
        </View>
      </View>
    );
  };

  const selfInstallShipped = () => {
    return (
      <View style={{ marginTop: 0 }} >
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={styles.subText} >
            Your equipment will arrive within{" "}
            <Text style={[styles.subText, { color: "#353091", fontFamily: FontFamily.openSansSemiBold, fontWeight: "600" }]}>
              2-4 bussiness days{" "}
            </Text>{" "}
            from your purchase. Just plug it in and follow the instructions
            included in your kit
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 4,
          }}
        >
          <Text style={styles.subText}>
            If you have any questions, please call{" "}
          </Text>
          <Text
            style={[
              styles.subText,
              {
                color: "#353091",
                textDecorationLine: "underline",
                fontFamily: FontFamily.openSansSemiBold, 
                fontWeight: "600", // <-- changed to semi-bold
              },
            ]}
            onPress={() => Linking.openURL("tel:8776922253")}
            accessibilityLabel="Call 877-692-2253"
            accessibilityRole="link"
            accessible={true}
          >
            877-692-2253
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        onPressBack={() => {
          //navigation.goBack();
        }}
        showIcon={false}
        accessibleLable={"Service Activation, heading level 1."}
        title={"Service Activation"}
      />

      <ScrollView style={{ flexDirection: "column" }}>
        <View style={styles.infoBox}>
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View
              accessibilityLabel="Information icon "
              accessible={true}
              accessibilityRole="text"
            >
              <Infocircle
                color={"#0060AE"}
                style={[styles.infoCircleIcon, { alignSelf: "flex-start" }]}
              />
            </View>
            <View style={{ marginLeft: 10, flex: 1, flexDirection: "column" }}>
              <Text
                style={styles.statusText}
                accessibilityLabel={`${status} ' ', ${action} heading level 2.`}
                accessibilityRole="text"
              >
                {status}:
                <Text
                  style={[
                    styles.statusText,
                    { color: Color.colorblack_100, fontWeight: "400" },
                  ]}
                >
                  {" "}
                  {action}
                </Text>
              </Text>
              {getPendingStatusMessage(userData)}
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 24, marginBottom: 20 }}>
          <PilotServiceStatus currentStage={2} />
        </View>

        {isMobileServiceActive && <MobilePromo />}
        <PilotFaqs />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginBottom: Platform.OS === "ios" ? 90 : 60,
    backgroundColor: Color.sparklightWhite,
  },
  infoBox: {
    flexDirection: "column",
    marginHorizontal: 24,
    marginVertical: 20,
    borderColor: "#0060AE",
    backgroundColor: "#F0F8FF",
    borderRadius: Border.br_11xs,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 25,
  },
  statusText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#353091",
    fontWeight: "700",
  },
  subText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorblack_100,
    fontWeight: "400",
  },
  infoCircleIcon: {
    width: 16, // typical icon width
    height: 16, // match the font size of statusText
    marginTop: 4, // fine-tune vertical alignment if needed
    overflow: "hidden",
  },
};

export default MobilePilotLandingPage;
