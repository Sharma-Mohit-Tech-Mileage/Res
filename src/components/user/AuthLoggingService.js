// AuthLoggingService.js
import DeviceInfo from "react-native-device-info";
import { logError, logInfo } from "../../redux/actions/UserAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import moment from "moment";

// Error codes mapping
const ERROR_CODES = {
  SSO_AUTH_FAILURE: 30700,
  TOKEN_REQUEST_FAILURE: 30800, 
  REFRESH_TOKEN_FAILURE: 30850,
  SESSION_EXPIRED: 30900,
  GENERAL_AUTH_ERROR: 31000,
  SUCCESS: 0
};

// Queue for logging operations if they fail
let pendingLogs = [];
const MAX_PENDING_LOGS = 100; // Limit storage size
const PENDING_LOGS_KEY = 'AUTH_PENDING_LOGS';
let isProcessing = false;

// Initialize by loading any pending logs
const initLoggingService = async () => {
  console.log("[AuthLoggingService] Initializing service");
  try {
    const storedLogs = await AsyncStorage.getItem(PENDING_LOGS_KEY);
    console.log("[AuthLoggingService] Loaded stored logs: ", storedLogs ? `${JSON.parse(storedLogs).length} items` : "none");
    if (storedLogs) {
      pendingLogs = JSON.parse(storedLogs);
      // Process in background
      console.log("[AuthLoggingService] Scheduling pending logs processing");
      setTimeout(() => processPendingLogs(), 1000);
    }
  } catch (e) {
    console.error("[AuthLoggingService] Failed to initialize logging service:", e);
  }
};

// Process any pending logs in background
const processPendingLogs = async () => {
  console.log("[AuthLoggingService] Processing pending logs, count:", pendingLogs.length);
  if (isProcessing || pendingLogs.length === 0) {
    console.log("[AuthLoggingService] Skipping process - already processing or no logs");
    return;
  }
  
  isProcessing = true;
  console.log("[AuthLoggingService] Processing started");
  
  // Clone and clear the queue
  const logsToProcess = [...pendingLogs];
  pendingLogs = [];
  
  try {
    // Remove processed logs from storage
    await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pendingLogs));
    console.log("[AuthLoggingService] Cleared pending logs in storage");
    
    // Process each log
    let successCount = 0;
    let failCount = 0;
    
    for (const log of logsToProcess) {
      try {
        console.log(`[AuthLoggingService] Processing log: ${log.type} - ${log.data.methodName}`);
        if (log.type === 'error') {
          await logError(log.data);
        } else {
          await logInfo(log.data);
        }
        successCount++;
      } catch (e) {
        console.log(`[AuthLoggingService] Failed to process log: ${e.message}`);
        // If processing fails, add back to queue
        if (pendingLogs.length < MAX_PENDING_LOGS) {
          pendingLogs.push(log);
          failCount++;
        }
      }
    }
    
    console.log(`[AuthLoggingService] Processed logs - Success: ${successCount}, Failed: ${failCount}`);
    
    // Update storage with any failed logs
    if (pendingLogs.length > 0) {
      console.log(`[AuthLoggingService] Storing ${pendingLogs.length} failed logs`);
      await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pendingLogs));
    }
  } catch (e) {
    console.error("[AuthLoggingService] Error processing pending logs:", e);
    // Restore any unprocessed logs
    pendingLogs = [...pendingLogs, ...logsToProcess].slice(0, MAX_PENDING_LOGS);
    console.log(`[AuthLoggingService] Restored ${pendingLogs.length} logs to pending queue`);
    await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pendingLogs));
  } finally {
    isProcessing = false;
    console.log("[AuthLoggingService] Processing completed");
  }
};

// Dispatch error log with queuing
const dispatchErrorLog = async (errorData) => {
  console.log(`[AuthLoggingService] Dispatching error log for: ${errorData.methodName}, code: ${errorData.errorCode}`);
  try {
    // Attempt immediate dispatch
    console.log("[AuthLoggingService] Attempting immediate error dispatch");
    await logError(errorData);
    console.log("[AuthLoggingService] Error log dispatched successfully");
  } catch (e) {
    console.log(`[AuthLoggingService] Error dispatch failed: ${e.message}, queuing for later`);
    // Queue for later if dispatch fails
    if (pendingLogs.length < MAX_PENDING_LOGS) {
      pendingLogs.push({ type: 'error', data: errorData, timestamp: Date.now() });
      console.log(`[AuthLoggingService] Added to pending queue, new count: ${pendingLogs.length}`);
      
      // Use try-catch to prevent UI impact
      try {
        await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pendingLogs));
        console.log("[AuthLoggingService] Updated pending logs in storage");
      } catch (storageError) {
        console.debug("[AuthLoggingService] Failed to store pending logs (non-blocking)");
      }
    }
  }
};

// Dispatch info log with queuing
const dispatchInfoLog = async (infoData) => {
  console.log(`[AuthLoggingService] Dispatching info log for: ${infoData.methodName}`);
  try {
    // Attempt immediate dispatch
    console.log("[AuthLoggingService] Attempting immediate info dispatch");
    await logInfo(infoData);
    console.log("[AuthLoggingService] Info log dispatched successfully");
  } catch (e) {
    console.log(`[AuthLoggingService] Info dispatch failed: ${e.message}, queuing for later`);
    // Queue for later if dispatch fails
    if (pendingLogs.length < MAX_PENDING_LOGS) {
      pendingLogs.push({ type: 'info', data: infoData, timestamp: Date.now() });
      console.log(`[AuthLoggingService] Added to pending queue, new count: ${pendingLogs.length}`);
      
      // Use try-catch to prevent UI impact
      try {
        await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(pendingLogs));
        console.log("[AuthLoggingService] Updated pending logs in storage");
      } catch (storageError) {
        console.debug("[AuthLoggingService] Failed to store pending logs (non-blocking)");
      }
    }
  }
};

// Get account type string based on user info
const getAccountTypeString = (userInfo) => {
  if (!userInfo) return 'Unknown';
  
  // Determine if normal user (SV) based on account number length (9 digits)
  const isNormalUser = userInfo.accountNumber && 
                       userInfo.accountNumber.toString().length === 9;
  
  if (isNormalUser) {
    return 'SV';
  } else {
    return 'ACP';
  }
};

// Enhanced contextual logging for authentication success
export const logAuthSuccess = async (methodName, userData = {}) => {
  console.log(`[AuthLoggingService] Creating success log for: ${methodName}`);
  
  const userInfo = userData?.userInfo || {};
  const accountNumber = userInfo.accountNumber || 'N/A';
  const accountType = getAccountTypeString(userInfo);
  const customerType = userInfo.customerType || 'N/A';
  const authLevel = userInfo.authLevel || 'N/A';
  const acctStatus = userInfo.acctStatus || 'N/A';
  
  // Get device details in compact format
  const deviceDetails = `${DeviceInfo.getModel()}|${Platform.OS}${Platform.Version}|${DeviceInfo.getVersion()}`;
  
  // Build structured message with user context
  const enhancedMessage = `Auth:${methodName}|AcctNum:${accountNumber}|Type:${accountType}|CustType:${customerType}|AuthLvl:${authLevel}|Status:${acctStatus}|Device:${deviceDetails}`;
  console.log(`[AuthLoggingService] Enhanced message: ${enhancedMessage}`);
  
  // Create log payload within existing parameter constraints
  const logPayload = {
    host: DeviceInfo.getSystemName(),
    application: "Sparklight Residential Mobile App",
    className: "AuthenticationService",
    methodName: methodName,
    messageDate: moment().format("YYYY-MM-DD"),
    errorCode: ERROR_CODES.SUCCESS,
    message: enhancedMessage
  };
  
  console.log("[AuthLoggingService] Log payload created:", JSON.stringify(logPayload));
  
  // Run in background with setTimeout to avoid UI impact
  console.log("[AuthLoggingService] Scheduling background dispatch of success log");
  setTimeout(() => {
    console.log("[AuthLoggingService] Executing background dispatch of success log");
    dispatchInfoLog(logPayload).catch((e) => {
      console.log("[AuthLoggingService] Silent catch of background dispatch error:", e.message);
    });
  }, 0);
};

// Log SSO information during login process
export const logSSOAttempt = async (methodName, ssoData = {}) => {
  console.log(`[AuthLoggingService] Logging SSO attempt: ${methodName}`);
  
  // Extract relevant SSO data without capturing sensitive info
  const hasSSOData = !!ssoData;
  const hasIdToken = !!ssoData.idToken;
  const hasAccessToken = !!ssoData.accessToken;
  const hasRefreshToken = !!ssoData.refreshToken;
  
  // Device details
  const deviceDetails = `${DeviceInfo.getModel()}|${Platform.OS}${Platform.Version}|${DeviceInfo.getVersion()}`;
  
  // Build message with SSO context
  const enhancedMessage = `SSO:${methodName}|HasTokens:${hasIdToken?'Y':'N'}${hasAccessToken?'Y':'N'}${hasRefreshToken?'Y':'N'}|Device:${deviceDetails}|Time:${moment().format('HH:mm:ss')}`;
  
  // Create log payload
  const logPayload = {
    host: DeviceInfo.getSystemName(),
    application: "Sparklight Residential Mobile App",
    className: "AuthenticationService",
    methodName: methodName,
    messageDate: moment().format("YYYY-MM-DD"),
    errorCode: ERROR_CODES.SUCCESS,
    message: enhancedMessage
  };
  
  // Fire and forget in background
  setTimeout(() => {
    dispatchInfoLog(logPayload).catch(() => {/* Silent catch */});
  }, 0);
};

// Enhanced contextual logging for authentication errors
export const logAuthError = async (methodName, error, errorCode) => {
  console.log(`[AuthLoggingService] Creating error log for: ${methodName}, code: ${errorCode}`);
  
  // Extract error details safely
  const errorMsg = error?.message || "Unknown error";
  const errorStatus = error?.status || error?.response?.status || 'N/A';
  const errorType = error?.code || error?.name || 'UNKNOWN_ERROR';
  
  // Extract any available user info from error object
  const userInfo = error?.userData?.userInfo || {};
  const accountType = getAccountTypeString(userInfo);
  const accountInfo = userInfo.accountNumber ? 
    `|AcctNum:${userInfo.accountNumber}|Type:${accountType}` : '';
  
  // Get device details in compact format
  const deviceDetails = `${DeviceInfo.getModel()}|${Platform.OS}${Platform.Version}|${DeviceInfo.getVersion()}`;
  
  // Build structured error message with diagnostic context
  const enhancedMessage = `Err:${errorMsg}|Status:${errorStatus}|Type:${errorType}${accountInfo}|Device:${deviceDetails}|Time:${moment().format('HH:mm:ss')}`;
  console.log(`[AuthLoggingService] Enhanced error message: ${enhancedMessage}`);
  
  // Create log payload within existing parameter constraints
  const logPayload = {
    host: DeviceInfo.getSystemName(),
    application: "Sparklight Residential Mobile App",
    className: "AuthenticationService",
    methodName: methodName,
    errorDate: moment().format("YYYY-MM-DD"),
    message: enhancedMessage,
    errorCode: errorCode || ERROR_CODES.TOKEN_REQUEST_FAILURE
  };
  
  console.log("[AuthLoggingService] Error payload created:", JSON.stringify(logPayload));
  
  // Run in background with setTimeout to avoid UI impact
  console.log("[AuthLoggingService] Scheduling background dispatch of error log");
  setTimeout(() => {
    console.log("[AuthLoggingService] Executing background dispatch of error log");
    dispatchErrorLog(logPayload).catch((e) => {
      console.log("[AuthLoggingService] Silent catch of background dispatch error:", e.message);
    });
  }, 0);
};

// Schedule periodic processing of any pending logs
console.log("[AuthLoggingService] Setting up periodic processing interval");
setInterval(() => {
  console.log("[AuthLoggingService] Periodic check - Pending logs:", pendingLogs.length);
  if (pendingLogs.length > 0 && !isProcessing) {
    console.log("[AuthLoggingService] Triggering periodic processing");
    processPendingLogs();
  }
}, 60000); // Check every minute

// Initialize the service
console.log("[AuthLoggingService] Starting service initialization");
initLoggingService();
console.log("[AuthLoggingService] Service initialization triggered");

export default {
  logAuthSuccess,
  logAuthError,
  logSSOAttempt,
  ERROR_CODES
};