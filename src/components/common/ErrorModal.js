import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontFamily } from '../../../GlobalStyles';
import colors from '../../res/Colors';
import AlertIcon from '../../res/svgIcons/AlertIcon';

export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_TIMEOUT: 'AUTH_TIMEOUT',
  BROWSER_UNAVAILABLE: 'BROWSER_UNAVAILABLE',
  USER_CANCELLED: 'USER_CANCELLED',
  API_ERROR: 'API_ERROR',
  BUSINESS_ACCOUNT: 'BUSINESS_ACCOUNT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: {
    title: 'Connection Issue',
    message: 'Please check your internet connection and try again.',
    actions: [
      { label: 'Retry', action: 'RETRY', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.AUTH_TIMEOUT]: {
    title: 'Login Timeout',
    message: 'The login process took too long. This may happen if the browser did not open properly.',
    actions: [
      { label: 'Try Again', action: 'RETRY', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.BROWSER_UNAVAILABLE]: {
    title: 'Browser Not Available',
    message: 'Unable to open your browser for secure login. Please check your device settings.',
    actions: [
      { label: 'Open Settings', action: 'OPEN_SETTINGS', primary: true },
      { label: 'Try Again', action: 'RETRY', primary: false },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.USER_CANCELLED]: {
    title: 'Login Cancelled',
    message: 'You cancelled the login process.',
    actions: [
      { label: 'Try Again', action: 'RETRY', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.API_ERROR]: {
    title: 'Service Error',
    message: 'We encountered an issue connecting to our services. Please try again.',
    actions: [
      { label: 'Retry', action: 'RETRY', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.BUSINESS_ACCOUNT]: {
    title: 'Business Account Detected',
    message: 'This app is for residential customers. Please download the MySparklight Business app to manage your business services.',
    actions: [
      { label: 'Download Business App', action: 'DOWNLOAD_BUSINESS_APP', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    actions: [
      { label: 'Retry', action: 'RETRY', primary: true },
      { label: 'Cancel', action: 'CANCEL', primary: false },
    ],
  },
};

const ErrorModal = ({ visible, errorType, onAction, customMessage }) => {
  const errorConfig = ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR];
  const displayMessage = customMessage || errorConfig.message;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onAction('CANCEL')}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AlertIcon />
            <Text style={styles.title}>{errorConfig.title}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.message}>{displayMessage}</Text>
          
          <View style={styles.buttonContainer}>
            {errorConfig.actions.map((action, index) => (
              <TouchableOpacity
                key={action.action}
                style={[
                  styles.button,
                  action.primary ? styles.primaryButton : styles.secondaryButton,
                  index > 0 && styles.buttonSpacing,
                ]}
                onPress={() => onAction(action.action)}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <Text
                  style={[
                    styles.buttonText,
                    action.primary ? styles.primaryButtonText : styles.secondaryButtonText,
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FontFamily.openSansRegular,
    color: colors.black,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F4F5',
    marginBottom: 15,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FontFamily.openSansRegular,
    color: colors.darkest_grey,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.sparklight_purple_blue,
  },
  secondaryButton: {
    backgroundColor: colors.backgound_blue,
  },
  buttonSpacing: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.openSansRegular,
  },
  primaryButtonText: {
    color: colors.snow_white,
  },
  secondaryButtonText: {
    color: colors.sparklight_purple_blue,
  },
});

export default ErrorModal;