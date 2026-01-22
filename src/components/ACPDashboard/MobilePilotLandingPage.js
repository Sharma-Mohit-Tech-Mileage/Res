import React, { useEffect } from "react";
import { View, Text, Linking, ScrollView, StyleSheet } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import PilotServiceStatus from "./PilotServiceStatus";
import Infocircle from "../../../assets/svgs/Infocircle";
import MobilePromo from "./MobilePromo";
import PilotFaqs from "./PilotFaqs";
import { useSelector } from "react-redux";
import moment from "moment";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";

const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";

const MobilePilotLandingPage = ({ status = "Pending Status" }) => {
  const userData = useSelector((state) => state.user.userData?.userInfo);
  const [isMobileServiceActive, setIsMobileServiceActive] = React.useState(false);
  const [action, setAction] = React.useState("");
  const showSparklightMobile = useFeatureFlag(
    FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION
  );

  useEffect(() => {
    if (userData?.mobile_eligible === true && userData?.has_mobile === false) {
      setIsMobileServiceActive(true);
    } else {
      setIsMobileServiceActive(false);
    }

    const fulfillmentType = userData?.fulfillment_type?.toLowerCase();
    if (fulfillmentType === "professional install") {
      setAction("Awaiting Professional Install");
    } else if (fulfillmentType === "self-install (shipped)") {
      setAction("Awaiting Customer Equipment to be Shipped.");
    } else if (fulfillmentType === "self-install (pickup)") {
      setAction("Awaiting Customer Equipment Pickup");
    }
  }, [userData]);

  const getTimeSlotText = (timeSlot) => {
    const timeSlots = {
      "1-5": "1 PM - 5 PM",
      "8-12": "8 AM - 12 PM",
      "8-5": "8 AM - 5 PM",
    };
    return timeSlots[timeSlot] || "";
  };

  const getPendingStatusMessage = (userData) => {
    const fulfillmentType = userData?.fulfillment_type?.toLowerCase();

    if (fulfillmentType === "professional install") {
      const appointmentDate = moment(userData?.scheduled_date).format(DEFAULT_DATE_FORMAT);
      const timeSlot = getTimeSlotText(userData?.time_slot);
      return renderProfessionalInstall(appointmentDate, timeSlot);
    } else if (fulfillmentType === "self-install (shipped)") {
      return renderSelfInstallShipped();
    } else if (fulfillmentType === "self-install (pickup)") {
      return renderSelfInstallPickup();
    }
    return null;
  };

  const renderProfessionalInstall = (scheduledDate, timeSlot) => (
    <View style={styles.messageContainer}>
      <View
        style={styles.textRow}
        accessible={true}
        accessibilityLabel={`Your appointment is scheduled for ${scheduledDate} from ${timeSlot}. `}
        accessibilityRole="text"
      >
        <Text style={styles.subText} accessible={false}>
          {`Your appointment is scheduled for ${scheduledDate} from ${timeSlot}. `}
        </Text>
      </View>
      <View
        style={styles.textRowWithMargin}
        accessibilityLabel="If you have any questions or need to reschedule, please call 877-692-2253 "
        accessibilityRole="text"
        accessibilityHint="Double tap to open link"
        accessible={true}
      >
        <Text style={styles.subText}>
          If you have any questions or need to reschedule, please call{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("tel:8776922253")}
          >
            877-692-2253
          </Text>
          <Text style={styles.subText} accessible={false}>
            .
          </Text>
        </Text>
      </View>
    </View>
  );

  const renderSelfInstallPickup = () => (
    <View style={styles.messageContainer}>
      <View style={styles.textRow}>
        <Text
          style={styles.subText}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Drop by any of our Sparklight stores to pick up your equipment. Just a quick reminder to bring your photo ID and account number along with you. See you soon! "
        >
          Drop by any of our Sparklight stores to pick up your equipment. Just a
          quick reminder to bring your photo ID and account number along with you.
          See you soon!{" "}
        </Text>
        <Text
          style={styles.linkText}
          accessibilityLabel="Sparklight Store Locations and Hours"
          accessibilityRole="link"
          accessibilityHint="Opens Sparklight Store Locator webpage"
          accessible={true}
          onPress={() => {
            Linking.openURL("https://www.google.com/maps/search/Sparklight+Stores+Near+Me");
          }}
        >
          Sparklight Store Locations and Hours.
        </Text>
      </View>
      <View style={styles.textRowWithMargin}>
        <Text style={styles.subText}>
          If you have any questions, please call{" "}
        </Text>
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL("tel:8776922253")}
          accessibilityLabel="877-692-2253"
          accessibilityRole="link"
          accessibilityHint="Double tap to open link"
          accessible={true}
        >
          877-692-2253
        </Text>
        <Text style={styles.subText} accessible={false}>
          .
        </Text>
      </View>
    </View>
  );

  const renderSelfInstallShipped = () => (
    <View style={styles.messageContainer}>
      <View style={styles.textRow}>
        <Text style={styles.subText}>
          Your equipment will arrive within{" "}
          <Text style={styles.highlightText}>2-4 business days</Text> from your
          purchase. Just plug it in and follow the instructions included in your
          kit.
        </Text>
      </View>
      <View style={styles.textRowWithMargin}>
        <Text style={styles.subText}>
          If you have any questions, please call{" "}
        </Text>
        <Text
          style={styles.linkText}
          onPress={() => Linking.openURL("tel:8776922253")}
          accessibilityLabel="877-692-2253"
          accessibilityRole="link"
          accessibilityHint="Double tap to open link"
          accessible={true}
        >
          877-692-2253
        </Text>
        <Text style={styles.subText} accessible={false}>
          .
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.infoBox}>
          <View style={styles.infoBoxContent}>
            <View
              accessibilityLabel="Information icon "
              accessible={true}
              accessibilityRole="text"
            >
              <Infocircle color="#0060AE" style={styles.infoCircleIcon} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text
                style={styles.statusText}
                accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
              >
                {status}:
                <Text style={styles.statusSubText}> {action}</Text>
              </Text>
              {getPendingStatusMessage(userData)}
            </View>
          </View>
        </View>

        <View style={styles.serviceStatusContainer}>
          <PilotServiceStatus currentStage={2} />
        </View>

        {isMobileServiceActive && showSparklightMobile && <MobilePromo />}
        <PilotFaqs />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    backgroundColor: Color.sparklightWhite,
  },
  infoBox: {
    flexDirection: "column",
    marginVertical: 20,
    borderColor: "#0060AE",
    backgroundColor: "#F0F8FF",
    borderRadius: Border.br_11xs,
    marginTop: 20,
    borderWidth: 1,
    marginBottom: 25,
  },
  infoBoxContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  infoTextContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: "column",
  },
  statusText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#353091",
    fontWeight: "700",
  },
  statusSubText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorblack_100,
    fontWeight: "400",
  },
  subText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorblack_100,
    fontWeight: "400",
  },
  linkText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
    color: "#353091",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  highlightText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
    color: "#353091",
    fontWeight: "600",
  },
  messageContainer: {
    marginTop: 0,
  },
  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textRowWithMargin: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  serviceStatusContainer: {
    marginBottom: 20,
  },
});

export default MobilePilotLandingPage;
