import React from "react";
import AlertModal from "./AlertModal";

export const ErrorType = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTH_TIMEOUT: "AUTH_TIMEOUT",
  BROWSER_UNAVAILABLE: "BROWSER_UNAVAILABLE",
  USER_CANCELLED: "USER_CANCELLED",
  API_ERROR: "API_ERROR",
  API_ERROR_204: "API_ERROR_204",
  ADMIN_PERMISSION: "ADMIN_PERMISSION",
  BUSINESS_ACCOUNT: "BUSINESS_ACCOUNT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: {
    title: "Connection Error",
    message: "Please check your internet connection and try again.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.AUTH_TIMEOUT]: {
    title: "Unable to sign in",
    message:
      "The sign-in process timed out. Check your connection and try again.",
    actions: [
      { label: "Try Again", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.BROWSER_UNAVAILABLE]: {
    title: "Browser Not Available",
    message:
      "Unable to open your browser for secure login. Please check your device settings.",
    actions: [
      { label: "Open Settings", action: "OPEN_SETTINGS", primary: true },
      { label: "Try Again", action: "RETRY", primary: false },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.USER_CANCELLED]: {
    title: "Login Cancelled",
    message: "You cancelled the login process.",
    actions: [
      { label: "Try Again", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.API_ERROR]: {
    title: "Service Error",
    message:
      "We encountered an issue connecting to our services. Please try again.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.API_ERROR_204]: {
    title: "Login Unavailable",
    message:
      "We're unable to complete your login right now due to a technical issue. Please try again or contact us at 877-692-2253 if the issue continues.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.ADMIN_PERMISSION]: {
    title: "Access Denied",
    message: "Please sign in using your Primary Admin account to continue.",
    actions: [{ label: "Close", action: "CANCEL", primary: true }],
  },
  [ErrorType.BUSINESS_ACCOUNT]: {
  title: "App Mismatch Detected",
  message:
    "Only customers with Sparklight home internet services can use the MySparklight mobile app for account management. Please download the MySparklight Business mobile app to manage your Sparklight Business account.",
  actions: [
    {
      label: "Download Business App",
      action: "DOWNLOAD_BUSINESS_APP",
      primary: true,
    },
    { label: "Cancel", action: "CANCEL", primary: false },
  ],
},
  [ErrorType.UNKNOWN_ERROR]: {
    title: "Something Went Wrong",
    message:
      "An unexpected error occurred. Please try again or contact support if the issue persists.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
};

const ErrorModal = ({ visible, errorType, onAction, customMessage }) => {
  const errorConfig =
    ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR];

  return (
    <AlertModal
      visible={visible}
      title={errorConfig.title}
      message={customMessage || errorConfig.message}
      iconColor={errorType === ErrorType.BUSINESS_ACCOUNT ? "#DD6D02" : undefined}
      onRequestClose={() => onAction("CANCEL")}
      actions={errorConfig.actions.map((action) => ({
        ...action,
        onPress: () => onAction(action.action),
      }))}
    />
  );
};

export default ErrorModal;
