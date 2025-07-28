import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import NotificationAlert from "../common/customui/NotificationAlert";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontSize, FontFamily, Border } from "../../../GlobalStyles";
import Checkcircle from '../../../assets/svgs/Checkcircle';
import Checkcircle1 from '../../../assets/svgs/Checkcircle1';
import InfoIcon from '../../../assets/svgs/Infocircle';

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
  isLastSection
}) => {
  const navigation = useNavigation();

  // Check if any additional setting has its status set to "On"
  const isAnySettingActive = additionalSettings.some(setting => setting.warn === true);

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
            style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.7 : 1.0 }]}
            onPress={() => navigation.navigate(navigationTarget, { additionalData: transformedData, acknowledgement: acknowledgement })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        )}
      </View>
      <View>
        {isAdmin && <View style={styles.infoContainerAdmin}>
          <Text style={[styles.infoText, {textAlign: 'center'}]}>{'Only Primary Admin can make changes'}</Text>
        </View>}
        <View style={{ paddingHorizontal: Padding.p_base }}>
          {(isDisabled || isAnySettingActive) && (
            <NotificationAlert
              type={!isAnySettingActive ? "warning" : "error"}
              title={notificationsTitle}
              showCloseIcon={false}
              message={infoText}
            />
          )}
          {!isDisabled && infoText && !isAnySettingActive && (
            <View style={styles.infoContainer}>
              <View style={styles.iconWrapper}>
                <Image
                  style={styles.icon}
                  resizeMode="contain"
                  source={InfoIcon}
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
            isLastItem={index === additionalSettings.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

const NotificationType = ({ type, status, warn, isLastItem }) => {
  let displayStatus;
  let imageSource;
  switch (status) {
    case 'On':
    case 'Subscribed':
      displayStatus = status;
      imageSource = Checkcircle
      break;
    case 'Off':
    case 'Unsubscribed':
      displayStatus = status;
      imageSource = Checkcircle1
      break;
    default:
      displayStatus = 'Unknown';
      imageSource = Checkcircle1
      break;
  }

  return (
    <View style={[styles.settingRow, !isLastItem && styles.settingRowBorder, warn && { backgroundColor: Color.colorlightRed }]}>
      <Text style={styles.settingText}>{type}</Text>
      <View style={styles.statusWrapper}>
        {/* <Image style={styles.icon} resizeMode="cover" source={imageSource} /> */}
        <View style={styles.icon}>
          {imageSource}
        </View>
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
    borderBottomWidth: 0,
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
  buttonText: {
    fontSize: FontSize.size_sm,
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center"
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
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_7xs,
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: Padding.p_7xs,
     borderWidth: 1,
    borderColor: '#0060AE',
    backgroundColor: '#F0F8FF',
  },
  infoContainerAdmin: {
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_7xs,
    flexDirection: "row",
    alignSelf: "stretch",
    marginVertical: Padding.p_base
  },
  infoText: {
    color: Color.colorGray_200,
    fontSize: FontSize.textXsSemibold_size,
    marginLeft: 8,
    lineHeight: 28,
    flex: 1,
    fontFamily: FontFamily.openSansRegular
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Padding.p_base,
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
});

export default NotificationSection;