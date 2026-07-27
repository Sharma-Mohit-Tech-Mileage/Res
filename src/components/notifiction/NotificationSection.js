import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import Touchable from "../common/customui/Touchable";
import {
  Color,
  Padding,
  FontSize,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import InfoICon from "../../../assets/svgs/InfoIcon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SuccessIcon from "../../../assets/svgs/SuccessIcon";
import AppStyles from "../../styles/AppStyles";
import {SectionTitle,FieldContent, IndicatorText,BannerAlertText} from "../common/customui/Typography";
import EditActionButton from "../common/customui/EditActionButton";
import { A11y } from "react-native-a11y-order";
const digitToWord = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

function phoneNumberToWords(phoneNum) {
  return phoneNum
    ? phoneNum
        .replace(/\D/g, "")
        .split("")
        .map((d) => digitToWord[d] || d)
        .join(" ")
    : "";
}

const StatusIcon = ({ status }) => (
  <View style={styles.icon}>
    {status === "On" ? <SuccessIcon /> : <SuccessIcon color={"#4C5458"} />}
  </View>
);
const getEditAccessibilityLabel = (id) => {
    if (id === "text") {
      return "Edit text notifications";
    } else if (id === "email") {
      return "Edit Email notifications";
    } else if (id === "app") {
      return "Edit In-app notifications";
    }
    return "Edit notifications";
  };

const EditButton = ({ onPress, isLoading, accessibilityLabel }) => (
  // <Touchable
  //   style={[
  //     styles.editButton,
  //     isLoading && { backgroundColor: Color.sparklightGray },
  //   ]}
  //   accessible={true}
  //   disabled={isLoading}
  //   accessibilityRole="button"
  //   accessibilityLabel={accessibilityLabel || "Edit Notifications"}
  //   minSize={0}
  //   onPress={onPress}
  // >
  //   <Text style={styles.editButtonText}>Edit</Text>
  // </Touchable>
         <EditActionButton
              onPress={onPress}
              accessibilityLabel={accessibilityLabel}
            />
);

const ComingSoonBadge = () => (
  <View style={styles.comingSoonBadge}>
    <Text style={styles.comingSoonText}>Coming Soon</Text>
  </View>
);

const NotificationToggle = ({ type, status, isLast, warn, loading, title }) => (
  <View
   accessible={true} accessibilityLabel={`${title} for ${type}  is ${loading ? 'loading' : status}`}
    style={[
      styles.toggleContainer,
      !isLast && styles.bottomBorder,
      warn && styles.warnBackground,
    ]}
  >
    <FieldContent importantForAccessibility="no">
        {type}
      </FieldContent>
    <View style={styles.statusContainer}>
      {loading ? (
        <SkeletonPlaceholder>
          <View
            style={{
              height: 20,
              width: 40,
              marginLeft: Padding.p_5xs,
              borderRadius: 5,
            }}
          />
        </SkeletonPlaceholder>
      ) : (
        <View style={{flexDirection: "row", alignItems: "center", alignSelf: "flex-start"}}>
          <StatusIcon status={status} />
          <IndicatorText style={styles.statusText}>{status}</IndicatorText>
        </View>
      )}
    </View>
  </View>
);

const BoldEmailText = ({ message }) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const parts = message.split(emailRegex);
  const emails = message.match(emailRegex);

  return (
    <Text style={styles.infoText}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <Text style={styles.infoText}>{part}</Text>
          {emails && emails[index] && (
            <Text
              style={[styles.infoText, styles.boldText]}
              accessibilityRole="text"
              accessibilityLabel={`Email ${emails[index]}`}
            >
              {emails[index]}
            </Text>
          )}
        </React.Fragment>
      ))}
    </Text>
  );
};

const BoldPhoneText = ({ phoneNum }) => {
  const phoneNumWords = phoneNumberToWords(phoneNum);

  return (
    <Text
      style={styles.infoText}
      accessibilityLabel={
        phoneNum
          ? `Text alert are sent to ${phoneNumWords}`
          : "You have not enabled text notifications"
      }
    >
      <Text style={styles.infoText}>
        {phoneNum
          ? "Text alert are sent to "
          : "You have not enabled text notifications"}
      </Text>
      {phoneNum && (
        <Text
          style={[styles.infoText, styles.boldText]}
          accessibilityRole="text"
          accessibilityLabel={`Phone number ${phoneNumWords}`}
        >
          {phoneNum}
        </Text>
      )}
    </Text>
  );
};

const InfoMessage = ({ message, phoneNumber, id }) => (
  <View style={styles.infoMessage}>
    <View style={styles.iconContainer}>
      <InfoICon color="#353091" />
    </View>
    <View style={styles.textContainer}>
      {id == "text" ? (
        <BoldPhoneText phoneNum={phoneNumber} />
      ) : (
        <BoldEmailText message={message} />
      )}
    </View>
  </View>
);

const AdminMessage = () => (
  <View style={styles.adminMessage}>
    <Text style={styles.adminText}>Only Primary Admin can make changes</Text>
  </View>
);

const NotificationSection = ({
  id,
  title,
  infoMessage,
  settings = [],
  isComingSoon = false,
  isAdmin = false,
  isLoading = false,
  onEdit,
  phoneNumber,
}) => {
  // Compute accessibility label for the Edit button based on section
  const editAccessibilityLabel = (() => {
    const t = title || "";
    const idLower = (id || "").toString().toLowerCase();
    const titleLower = t.toLowerCase();

    if (idLower === "text" || titleLower.includes("text")) return "Edit Text Notifications";
    if (idLower === "email" || titleLower.includes("email")) return "Edit Email Notifications";
    if (
      idLower.includes("app") ||
      titleLower.includes("in-app") ||
      titleLower.includes("in app") ||
      idLower.includes("inapp")
    )
      return "Edit In-app Notifications";

    return t ? `Edit ${t} Notifications` : "Edit Notifications";
  })();

  return (
    <View style={[AppStyles.card,{marginBottom: Padding.p_base}]}>
      <A11y.Order style={styles.header}>
        <A11y.Index index={0} >
        <View
          accessible={true}
          accessibilityRole="header"
          accessibilityLevel={2}
          accessibilityLabel={editAccessibilityLabel}
        >     
        <SectionTitle
          accessibilityRole="header"
          accessibilityLevel={2}
        >
          {title}
        </SectionTitle>
        </View>
        </A11y.Index>
        <A11y.Index index={1} >
      <View style={{flexDirection: "row", alignItems: "center"}}>
        {isComingSoon ? (
          <ComingSoonBadge />
        ) : (
          !isAdmin && <EditButton onPress={onEdit} isLoading={isLoading} accessibilityLabel={editAccessibilityLabel} />
        )}
      </View>
     </A11y.Index>
    </A11y.Order>
      {isAdmin && <AdminMessage />}

      {isLoading ? (
        <SkeletonPlaceholder>
          <View
            style={{
              height: 40,
              width: "90%",
              marginHorizontal: Padding.p_base,
              marginBottom: Padding.p_base,
              borderRadius: 5,
            }}
          />
        </SkeletonPlaceholder>
      ) : (
        infoMessage && (
          <InfoMessage
            message={infoMessage}
            phoneNumber={phoneNumber}
            id={id}
          />
        )
      )}

      <View style={styles.bottomBorder} />

      {settings.map((setting, index) => (
        <NotificationToggle
          key={setting.id}
          {...setting}
          isLast={index === settings.length - 1}
          loading={isLoading}
          title={title}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    marginBottom: Padding.p_base,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Padding.p_base,
  },
  title: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
  },
  editButton: {
    backgroundColor: Color.colorMidnightblue,
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_11xs,
    minWidth: 70,
    alignItems: "center",
  },
  editButtonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightWhite,
  },
  comingSoonBadge: {
    backgroundColor: Color.sparklightGray,
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_base,
    borderColor: Color.sparklightGray1,
    borderWidth: 1,
  },
  comingSoonText: {
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
  },
  infoMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Padding.p_base,
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    borderRadius: Border.br_5xs,
    borderWidth: 1,
    borderColor: "#353091",
    backgroundColor: "#F0F8FF",
  },
  infoText: {
    marginLeft: Padding.p_5xs,
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    flex: 1,
  },
  boldText: {
    color: Color.colorGray_200,
    ...(Platform.OS === "android"
      ? {
          fontFamily: "OpenSans-Bold",
          letterSpacing: 0.15,
        }
      : {
          fontFamily: FontFamily.openSansSemiBold,
          fontWeight: "600",
        }),
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Padding.p_base,
    minHeight: 50,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Color.sparklightGray,
  },
  toggleText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 'auto',
  },
  statusText: {
    marginLeft: Padding.p_5xs,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  icon: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  adminMessage: {
    backgroundColor: Color.colorWhitesmoke_100,
    padding: Padding.p_base,
    marginBottom: Padding.p_base,
  },
  adminText: {
    textAlign: "center",
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  warnBackground: {
    backgroundColor: Color.colorlightRed,
  },
});

export default NotificationSection;
