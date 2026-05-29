import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import axios from "axios";
import moment from "moment";
import { getEndpoint,ENDPOINTS } from "../endpoints/Endpoints";
import Config from "react-native-config";
import { getDeviceUniqueId } from "../../../firebase/FirebaseUtils";
import { getDeviceMetadata } from "../../../components/utility/DeviceInfo";
import * as appLogger from "../../../utils/logger";
import base64 from "react-native-base64";
const getProfileDetails = async () => {
  let data = await getUser();
  const userName = data.userInfo?.userName || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.ACCT_MGR_GET_BY_USER, { accountNumber: data?.userInfo?.accountNumber }), { ...config })
    .then((res) => res.data)
    .catch((error) => {
      appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.ACCT_MGR_GET_BY_USER, { accountNumber: data?.userInfo?.accountNumber })}`, error);
      throw error;
    });
};

const fetchUserList = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.PROFILE_USERS, { accountNumber }), { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.PROFILE_USERS, { accountNumber })}`, error);
      throw error;
    });
};

const fetchSmsSubscription = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.SMS_SUBSCRIPTION, { accountNumber }), { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.SMS_SUBSCRIPTION, { accountNumber })}`, error);
      throw error;
    });
};

const fetchBillingStatus = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.BILLING_STATUS, { accountNumber }), {
      ...config,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.BILLING_STATUS, { accountNumber })}`, error);
      throw error;
    });
};

const fetchEasyPayStatus = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber }), { ...config })
    .then((res) => res.data)
    .catch((error) => {
      appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber })}`, error);
      throw error;
    });
};

const fetchPaperLessDetails = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(getEndpoint(ENDPOINTS.PAPERLESS_DETAILS, { accountNumber }), { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      appLogger.logError("Error fetching fetchPaperLessDetails:", error);
      throw error;
    });
};

const fetchPushNotifications = async () => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
  try {
    const response = await _axios.get(
      getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS_ACCOUNT, { userName: user.userInfo?.userName, accountNumber }),
      { ...config }
    );
    return response.data;
  } catch (error) {
    appLogger.logError(`Error fetching ${getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS_ACCOUNT, { userName: user.userInfo?.userName, accountNumber })}:`, error);
    throw error;
  }
};


const updateProfileSecurity = async (data) => {
  const user = await getUser();
  const userName = user.userInfo?.userName || user.userName || null;
  const endpoint = getEndpoint(ENDPOINTS.SECURITY_QUESTION_UPDATE, { userName ,accountNumber: user.userInfo?.accountNumber});
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.patch(endpoint, data, config);
    return response.data;
  } catch (error) {
    appLogger.logError(`Error updating ${endpoint}:`, error);
    throw error;
  }
};


const postProfileInfo = async (data) => {
  try {
    const user = await getUser();

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await _axios.put(getEndpoint(ENDPOINTS.PROFILE_INFO_UPDATE), data, config);

    return response.data;
  } catch (error) {
    appLogger.logError("API Call Failed:", error.message);
    throw error;
  }
};

const postTextNotifictionInfo = async (data) => {
  let user = await getUser();

  const accountNumber = user.userInfo?.accountNumber || null;
  data["accountNumber"] = accountNumber;
  const postData = {
    accountNumber: accountNumber,
    phoneNumber: data.phoneNumber,
    optOut: !data.optOut,
    outageOptOut: !data.outageOptOut,
    billingOptOutStatus: !data.billingOptOutStatus,
  };
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
  try {
    const response = await _axios.post(getEndpoint(ENDPOINTS.UPDATE_TEXT_NOTIFICATION), postData, config);
    return response.data;
  } catch (error) {
    appLogger.logError(`Error in API Call to ${getEndpoint(ENDPOINTS.UPDATE_TEXT_NOTIFICATION)}:`, error); // Log the error
    throw error;
  }
};

const putEmailNotification = async (email) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.PAPERLESS_EMAIL_NOTIFICATION, { accountNumber, email }),
      {},
      config
    );

    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.PAPERLESS_EMAIL_NOTIFICATION, { accountNumber, email })}:`,
      error
    );
    throw error;
  }
};

const resendEmailVerification = async () => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.PAPERLESS_RESEND_VERIFICATION, { accountNumber }),
      {},
      config
    );

    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.PAPERLESS_RESEND_VERIFICATION, { accountNumber })}:`,
      error
    );
    throw error;
  }
};

const postEmailNotification = async (email) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.PAPERLESS_ENROLL, { accountNumber, emailAddress: email }),
      {},
      config
    );

    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.PAPERLESS_ENROLL, { accountNumber, emailAddress: email })}:`,
      error
    );
    throw error;
  }
};

const postTermsAndConditions = async (flag) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const userName = user.userInfo?.userName || null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.MOBILE_TC_FLAG, { accountNumber, userName, flag }),
      {},
      config
    );

    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.MOBILE_TC_FLAG, { accountNumber, userName, flag })}:`,
      error
    );
    throw error;
  }
};

const postTermsAndConditionsv2 = async (flag) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber;
  const userName = user.userInfo?.userName;
  const mobileTCAcceptanceFlag = flag;
  const tcAccpetanceDate = moment().format();
  const customerType = "Residential";

  const payload = {
    accountNumber,
    userName,
    mobileTCAcceptanceFlag,
    tcAccpetanceDate,
    customerType,
  };

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.MOBILE_TC_UPDATE_USERDATA),
      payload,
      config
    );
    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.MOBILE_TC_UPDATE_USERDATA)}:`,
      error
    );
    throw error;
  }
};

const postPushNotifications = async (data) => {
  let user = await getUser();
  let deviceToken = await getDeviceUniqueId();
  const accountNumber = user.userInfo?.accountNumber || null;
  const userName = user.userInfo?.userName || null;
  data.accountNumber = accountNumber;
  data.userName = userName;

  data["id"] = 0;
  data["DeviceId"] = deviceToken;
  data["customerType"] = "Residential";
  data["optOut"] = !data.optOut;
  data["outageOptOut"] = !data.outageOptOut;
  data["billingOptOutStatus"] = !data.billingOptOutStatus;

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS, { userName, accountNumber }),
      data,
      config
    );

    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS, { userName, accountNumber })}`,
      error
    );
    throw error;
  }
};

const unsubscribPaperLess = async () => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.PAPERLESS_UNENROLL, { accountNumber, email: user.userInfo?.email }),
      {},
      config
    );
    return response;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to ${getEndpoint(ENDPOINTS.PAPERLESS_UNENROLL, { accountNumber, email: user.userInfo?.email })}:`,
      error
    );
    throw error;
  }
};

const handleSubmitFeedback = async (obj) => {
  const zendeskRequestApiUrl = Config.ZENDESK_FEEDBACK_URL;
  const user = await getUser();
  const deviceMetadata = await getDeviceMetadata();
  const fullName = user.userInfo?.fullName;
  const authToken = `${Config.ZENDESK_AUTH_EMAIL}/token:${Config.ZENDESK_AUTH_API_TOKEN}`;

  const base64Auth = base64.encode(authToken);

  const concernLabels = (obj.areaOfConcern || []).map((id) => {
    const labels = {
      service_issue: "Service Issue",
      speed_concern: "Speed Concern",
      bug: "Bug",
      pricing_plans: "Pricing & Plans",
      billing_payments: "Billing & Payments",
      customer_support: "Customer Support",
      feature_request: "Feature Request",
      equipment_issue: "Equipment Issue",
      other_issues: "Other Issues",
    };
    return labels[id] || id;
  });

  const payload = {
    request: {
      ticket_form_id: Config.ZENDESK_FEEDBACK_TICKET_FORM_ID,
      requester: {
        name: fullName,
        email: obj.feedbackEmail,
      },
      recipient: Config.ZENDESK_FEEDBACK_RECIPIENT,
      assignee_id: Config.ZENDESK_FEEDBACK_ASSIGNEE_ID,
      group_id: Config.ZENDESK_FEEDBACK_GROUP_ID,
      type: null,
      custom_fields: [
        { id: Config.ZENDESK_FEEDBACK_CATEGORY_ID, value: obj.category },
        { id: Config.ZENDESK_FEEDBACK_VALUE_ID, value: obj.feedbackValue },
        { id: Config.ZENDESK_FEEDBACK_EMAIL_ID, value: obj.feedbackEmail },
        {
          id: Config.ZENDESK_FEEDBACK_APP_VERSION_ID,
          value: deviceMetadata.appVersion,
        },
        {
          id: Config.ZENDESK_FEEDBACK_PLATFORM_ID,
          value: deviceMetadata.platform,
        },
        {
          id: Config.ZENDESK_FEEDBACK_OS_VERSION_ID,
          value: deviceMetadata.osVersion,
        },
        {
          id: Config.ZENDESK_FEEDBACK_DEVICE_MODEL_ID,
          value: deviceMetadata.deviceModel,
        },
        {
          id: Config.ZENDESK_FEEDBACK_ACCOUNT_NO,
          value: user?.userInfo?.accountNumber,
        },
        {
          id: Config.ZENDESK_FEEDBACK_AREA_OF_CONCERN_ID,
          value: concernLabels.map((label) =>
            label
              .toLowerCase()
              .replace(/\s*&\s*/g, "_and_")
              .replace(/\s+/g, "_")
          ),
        },
      ],
      subject: "Residential MobileApp Feedback",
      comment: {
        body: obj.feedbackText || "No additional feedback provided.",
        uploads: null,
      },
      tags: [
        "Feedback",
        "Residential",
        "resimobileapp",
        `pid_${user.userInfo.accountNumber}`,
        deviceMetadata.platform.toLowerCase(),
        ...concernLabels.map((label) =>
          label
            .toLowerCase()
            .replace(/\s*&\s*/g, "_and_")
            .replace(/\s+/g, "_")
        ),
      ],
      via: { channel: "MobileApp" },
    },
  };

  try {
    const response = await axios.post(zendeskRequestApiUrl, payload, {
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    appLogger.logError("Zendesk API Error:", error.response?.data || error.message);
    throw error;
  }
};

const logError = async (errorData) => {
  try {
    await _axios.post(getEndpoint(ENDPOINTS.LOG_ERROR), errorData);
  } catch (logErr) {
    appLogger.logError("Failed to log error:", logErr);
  }
};

const logInfo = async (infoData) => {
  try {
    await _axios.post(getEndpoint(ENDPOINTS.LOG_INFO), infoData);
  } catch (logErr) {
    appLogger.logError("Failed to log info:", logErr);
  }
};

const addUserAction = async (data) => {
  let user = await getUser();

  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.post(getEndpoint(ENDPOINTS.USERS_BASE), data, config);
    return response.data;
  } catch (error) {
    appLogger.logError("API Call Failed, Error:", error);
    throw error;
  }
};

const editUserAction = async (data) => {
  let user = await getUser();

  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.USERS_BY_USERNAME, { userName: data.userName }),
      data,
      config
    );
    return response.data;
  } catch (error) {
    appLogger.logError("API Call Failed, Error:", error);
    throw error;
  }
};

const removeUser = async (data) => {
  let user = await getUser();

  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.put(
      getEndpoint(ENDPOINTS.USERS_REMOVE, { accountNumber: data.accountNumber, userName: data.userName }),
      data,
      config
    );
    return response.data;
  } catch (error) {
    appLogger.logError("API Call Failed, Error:", error);
    throw error;
  }
};
const fetchAllSvEmails = async (data) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
  const requestUrl = getEndpoint(ENDPOINTS.SV_EMAILS_GET_ALL, { accountNumber });
   try {
     const response = await _axios.get(requestUrl, config);
     return response.data;
   } catch (error) {
     appLogger.logError("API Call Failed, Error:", error);
     throw error;
     }
};

const addSVEmailNoFlags = async (email) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.SV_EMAIL_ADD_NO_FLAGS, { accountNumber, email }),
      {},
      config
    );
    return response.data;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to add SV email without flags: ${email}`,
      error
    );
    throw error;
  }
};

const deleteSVEmail = async (email) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.SV_EMAIL_DELETE, { accountNumber, email }),
      {},
      config
    );
    return response.data;
  } catch (error) {
    appLogger.logError(`Error in API Call to delete SV email: ${email}`, error);
    throw error;
  }
};

const updateSVEmails = async (emailList) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const body = emailList.map((email) => ({ EmailAddress: email }));

  try {
    const response = await _axios.post(
      getEndpoint(ENDPOINTS.SV_EMAIL_UPDATE, { accountNumber }),
      body,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const manageSVEmails = async (emailList) => {
  try {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const requestUrl = getEndpoint(ENDPOINTS.SV_EMAIL_UPDATE, { accountNumber });
    const response = await _axios.post(requestUrl, emailList, config);
    return response.data;
  } catch (error) {
    appLogger.logError("Error managing SV emails:", error);
    throw error;
  }
};
const addSVEmailMktFlag = async (email) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
  try {
    const requestUrl = getEndpoint(ENDPOINTS.SV_EMAIL_ADD_MKT_FLAG, { accountNumber, email });
    const response = await _axios.post(requestUrl, {}, config);
    return response.data;
  } catch (error) {
    appLogger.logError(
      `Error in API Call to add SV email marketing flag: ${email}`,
      error
    );
    throw error;
  }
};

const isPaperlessEnabled = async (email, signal) => {
  const user = await getUser();
  const emailParam = encodeURIComponent(email);
  const requestUrl = getEndpoint(ENDPOINTS.PAPERLESS_IS_ENABLED, { accountNumber: user.userInfo?.accountNumber, email: emailParam });
  const response = await _axios.get(
    requestUrl,
    {
      headers: { Authorization: `Bearer ${user.token}` },
      signal, 
    }
  );
  return response.data;
};

const fetchACPUserAccountDetails = async (signal, force = false) => {
  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;

  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
    signal: signal,
  };

  const requestUrl = getEndpoint(ENDPOINTS.ACCOUNTS_DETAILS);
  const data = {
    accountNumber: accountNumber,
    UpdateCache: !!force,
    fieldList: [
      "first_name",
      "last_name",
      "current_balance",
      "past_due_amount",
      "payment_due_amount",
      "payment_due_date",
      "services",
      "email",
      "customer_type",
      "account_status",
      "days_since_disconnect_date",
      "legacy_brand_by_spa",
      "bill_to_address",
      "service_address",
      "homes_passed_id",
      "hierarchy"
    ],
  };

  try {
    const response = await _axios.post(requestUrl, data, config);
    return response.data;
  } catch (error) {
    if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
      throw error;
    }
    appLogger.logError("Error in fetchACPUserAccountDetails:", error);
    throw error;
  }
};

export {
  fetchACPUserAccountDetails,
  logError,
  logInfo,
  fetchUserList,
  getProfileDetails,
  fetchSmsSubscription,
  postProfileInfo,
  postTextNotifictionInfo,
  fetchBillingStatus,
  fetchEasyPayStatus,
  fetchPaperLessDetails,
  putEmailNotification,
  postEmailNotification,
  postTermsAndConditions,
  postTermsAndConditionsv2,
  postPushNotifications,
  unsubscribPaperLess,
  fetchPushNotifications,
  handleSubmitFeedback,
  manageSVEmails,
  isPaperlessEnabled,
  resendEmailVerification,
  addUserAction,
  removeUser,
  editUserAction,
  fetchAllSvEmails,
  addSVEmailNoFlags,
  deleteSVEmail,
  updateSVEmails,
  addSVEmailMktFlag,
  updateProfileSecurity
};
