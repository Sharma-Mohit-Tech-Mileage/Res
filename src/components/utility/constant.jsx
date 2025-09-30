import DeviceInfo from "react-native-device-info";
import VersionCheck from "react-native-version-check";
import { Color } from "../../../GlobalStyles";
export const ROLE_COLORS = {
  primaryadmin: Color.colorMidnightblue,
  admin: Color.sparklightBrightPurple,
  viewonly: Color.sparklightGreen,
};
export const BOX_COLORS = {
  primaryadmin: Color.success50,
  admin: Color.colorWhitesmoke_200,
  viewonly: Color.colorWhitesmoke_200,
};
export const extractAcknowledgementEmail = (logObj) => {
  try {
    const acknowledgementText = logObj.acknowledgement || "";
    const emailMatch = acknowledgementText.match(/[\w.-]+@[\w.-]+\.\w+/);
    return emailMatch ? emailMatch[0] : null;
  } catch (e) {
    return null;
  }
};
export const convertToSpecialCase = (str) => {
  if (!str || typeof str !== "string" || str.length < 2) {
    return null;
  }

  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const BORDER_COLORS = {
  primaryadmin: Color.colorAquamarine,
  admin: Color.colorWhitesmoke_200,
  viewonly: Color.colorWhitesmoke_200,
};
export const validatePassword = (newPassword, userName) => {
  if (!newPassword) {
    return Array(5).fill(false);
  }
  const conditions = [
    newPassword !== userName,
    newPassword.length >= 8 && newPassword.length <= 20,
    /[A-Z]/.test(newPassword) &&
      /[a-z]/.test(newPassword) &&
      /[0-9]/.test(newPassword),
    /[^a-zA-Z0-9]/.test(newPassword),
    !/\s/.test(newPassword),
  ];
  return conditions;
};

export const securityQuestions = [
  "Favorite author",
  "Favorite historical person",
  "Name of first grade teacher",
  "Name of first pet",
  "Street you grew up on",
  "Add your own question",
];

export const passwordTerms = [
  "It must be different than your username.",
  "It must contain 8 to 20 characters.",
  "It must include an upper and lower case letter and a number.",
  "It must include at least one special character such as %, &, _, ?, #, =, -",
  "Your new password cannot have any spaces.",
];

export const getUserType = (input) => {
  if (input === null || input.trim() === "") {
    return "";
  }

  const inputLower = input.toLowerCase();

  const mapping = {
    admin: "ADMIN",
    limited: "VIEW ONLY",
    restricted: "VIEW ONLY",
    headofhousehold: "PRIMARY ADMIN",
  };
  return mapping[inputLower] || "";
};

export const isPrimaryAdmin = (input) => {
  if (!input || typeof input !== "string" || input.trim() === "") {
    return false;
  }

  const inputLower = input.toLowerCase();
  return inputLower === "headofhousehold";
};

export const getRoleBasedMessage = (input) => {
  // Check for null or empty input
  if (!input || input.trim() === "") {
    return "";
  }

  // Convert input to lower case for case-insensitive comparison
  const inputLower = input.toLowerCase();

  // Define the mapping
  const mapping = {
    admin:
      "As an admin, you can manage this account, but you are not the primary contact for this account.",
    limited: "VIEW ONLY",
    restricted: "VIEW ONLY",
    headofhousehold:
      "As the primary admin, you are the main contact and have full control over this account.",
  };

  // Return the corresponding value from the mapping or an empty string if not found
  return mapping[inputLower] || "";
};

export const checkForMinorUpdate = async () => {
  const currentVersion = DeviceInfo.getVersion();
  const latestVersion = await VersionCheck.getLatestVersion();

  const currentParts = currentVersion.split(".");
  const latestParts = latestVersion.split(".");

  const currentMajor = parseInt(currentParts[0], 10);
  const latestMajor = parseInt(latestParts[0], 10);
  const currentMinor = parseInt(currentParts[1], 10);
  const latestMinor = parseInt(latestParts[1], 10);

  if (latestMajor === currentMajor && latestMinor > currentMinor) {
    return {
      isMinorUpdateAvailable: true,
      currentVersion: currentVersion,
      latestVersion: latestVersion,
    };
  }

  return {
    isMinorUpdateAvailable: false,
    currentVersion: currentVersion,
    latestVersion: null,
  };
};

export const updateEmailList = (emailList, type) => {
  return emailList.map((email) => {
    const marketingFlag = type === "add" ? true : false;
    return {
      emailAddress: email,
      marketing: marketingFlag,
      invoice: false,
      collection: false,
      iptv: false,
      tiVo: false,
      function: type || "add",
    };
  });
};

export const getPrimaryEmail = (data) => {
  try {
    if (!data || typeof data !== "object") {
      return null;
    }

    if (!Array.isArray(data.email) || data.email.length === 0) {
      return null;
    }

    const primaryEmail = data.email.find(
      (email) => email && typeof email === "object" && email.is_primary === true
    );

    if (primaryEmail && typeof primaryEmail.email_address === "string") {
      return primaryEmail.email_address;
    }

    return null;
  } catch (error) {
    return null;
  }
};
