import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import NotificationAlert from "../common/customui/NotificationAlert";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontSize, FontFamily, Border } from "../../../GlobalStyles";
import { resentEmailVerifiction } from '../../redux/actions/ProfileActionSuite';

const NotificationSection = ({
  title,
  successMessage,
  showNotification,
  showSuccessAlert,
  setShowSuccessAlert,
  isDisabled,
  notificationsTitle,
  infoText,
  transformedData,
  email,
  navigationTarget,
  additionalSettings = [],
  isAdmin,
  screenReaderEnabled,
  isEmailVerified,
  dispatch,
  acknowledgement,
  isPrimary,
  isLastSection // Prop to indicate if this is the last section
}) => {
  const navigation = useNavigation();

  const handleClose = () => {
    setShowSuccessAlert(false);
  };

  return (
    <View style={[styles.frameBorder, isLastSection && styles.noBottomBorder]}>
      {showNotification && (
        <View style={styles.infoWrapper}>
          <NotificationAlert
            type="success"
            title="Successful"
            message={successMessage}
            showCloseIcon={true}
            isVisible={showSuccessAlert}
            onClose={handleClose}
          />
        </View>
      )}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {!isAdmin && (
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit"
            style={({ pressed }) => [
              styles.editButton,
              { opacity: pressed ? 0.7 : 1.0 }
            ]}
            onPress={() =>  navigation.navigate(navigationTarget, { additionalData: transformedData ,acknowledgement:acknowledgement})}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        )}
      </View>
      <View >
        <View style={styles.contentWrapper}>
        {isDisabled && (
          <NotificationAlert
            type="warning"
            title={notificationsTitle}
            showCloseIcon={false}
            message={infoText}
          />
        )}
        {isAdmin && (
          <NotificationAlert
            type="warning"
            title=""
            showCloseIcon={false}
            message="Only Primary Admin can make changes"
          />
        )}
        {!isDisabled && infoText && (
          <View style={styles.infoContainer}>
            <View style={styles.iconWrapper}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require("../../../assets/infocircle.png")}
              />
            </View>
            <Text style={styles.infoText}>{infoText}</Text>
          </View>
        )}
        </View>
        {additionalSettings.map((setting, index) => (
          <NotificationType 
            key={index} 
            type={setting.type} 
            status={setting.status} 
            warn={setting.warn}
            isLastItem={index === additionalSettings.length - 1} // Handle last item in the section
          />
        ))}
      </View>
    </View>
  );
};

const renderInfoText = ({ title, infoText, screenReaderEnabled, isEmailVerified, acknowledgement, isPrimary, dispatch, navigation }) => {
  if (!isEmailVerified && title === 'Email Notifications') {
    if (screenReaderEnabled) {
      return (
        <Text
          accessible={true}
          accessibilityLabel={`${acknowledgement} is awaiting confirmation. Check your inbox for our verification link. Resend Confirmation Email link`}
          onPress={() => dispatch(resentEmailVerifiction(navigation))}
          style={styles.infoText}
        >
          <Text style={styles.linkText}>{acknowledgement}</Text> is awaiting confirmation.
          {isPrimary && (
            <>
              {' Check your inbox for our verification link.'}
              <Text> {"\n"}</Text>
              <Text
                style={styles.linkText}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                onPress={() => dispatch(resentEmailVerifiction(navigation))}
              >
                Resend Confirmation Email
              </Text>
            </>
          )}
        </Text>
      );
    }
    return (
      <Text style={styles.infoText}>
        <Text style={styles.linkText}>{acknowledgement}</Text> is awaiting confirmation.
        {isPrimary && (
          <>
            {' Check your inbox for our verification link.'}
            <Text> {"\n"}</Text>
            <Text
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Resend Confirmation Email"
              accessibilityHint="Activates the email verification process again"
              style={styles.linkText}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              onPress={() => dispatch(resentEmailVerifiction(navigation))}
            >
              Resend Confirmation Email
            </Text>
          </>
        )}
      </Text>
    );
  }
  return <Text style={styles.infoText}>{infoText}</Text>;
};

const NotificationType = ({ type, status,warn, isLastItem }) => {
  let displayStatus;
  let imageSource;
  switch (status) {
    case 'On':
    case 'Subscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle.png");
      break;
    case 'Off':
    case 'Unsubscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle1.png");
      break;
    default:
      displayStatus = 'Unknown';
      imageSource = require("../../../assets/checkcircle1.png");
      break;
  }

  return (
    <View style={[styles.settingRow, !isLastItem && styles.settingRowBorder,warn&& {backgroundColor:Color.colorlightRed}]}>
      <Text style={styles.settingText}>{type}</Text>
      <View style={styles.statusWrapper}>
        <Image style={styles.icon} resizeMode="cover" source={imageSource} />
        <Text style={styles.statusText}>{displayStatus}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameBorder: {
    borderWidth: 1,
    justifyContent: "center",
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    paddingTop: Padding.p_base,
    overflow: "hidden",
    marginBottom: Padding.p_base,
  },
  noBottomBorder: {
    borderBottomWidth: 0, // Remove the bottom border for the last section
  },
  headerRow: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: FontSize.size_3xl,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    flex: 1
  },
  editButton: {
    marginLeft: 10,
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    backgroundColor: Color.colorMidnightblue
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200
  },
  buttonText: {
    fontSize: FontSize.size_xs,
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center"
  },
  disabledButtonText: {
    fontSize: FontSize.size_xs,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center"
  },
  contentWrapper: {
    paddingHorizontal: Padding.p_base,
    //paddingBottom: Padding.p_base
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch"
  },
  iconWrapper: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs
  },
  icon: {
    width: 18,
    height: 18,
    marginTop: -3
  },
  infoContainer: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_7xs,
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: Padding.p_7xs
  },
  infoText: {
    color: Color.colorGray_200,
    fontSize: FontSize.textXsSemibold_size,
    marginLeft: 8,
    lineHeight: 28,
    flex: 1,
    fontFamily: FontFamily.openSansRegular
  },
  linkText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    fontWeight: "700"
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    // Removed paddingHorizontal here to allow the border to stretch edge-to-edge
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
    width: '100%' // Ensure border stretches across the full width
  },
  settingText: {
    flex: 1,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    paddingLeft: Padding.p_base, // Add padding to the text to maintain spacing
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: Padding.p_base, // Add padding to the right side of the status
  },
  statusText: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    marginLeft: 10
  },
  icon: {
    width: 18,
    height: 18,
  }
});

export default NotificationSection;