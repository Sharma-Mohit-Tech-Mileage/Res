import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import axios from "axios";
import moment from "moment";
import { Env } from "./Constants";
import { getDeviceUniqueId } from "../../../firebase/FirebaseUtils";
import { getDeviceMetadata } from "../../../components/utility/DeviceInfo";
import base64 from "react-native-base64";
const getProfileDetails = async () => {
  let data = await getUser();
  const accountNumber = data.userInfo?.accountNumber || null;
  const config = {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  };

  return _axios
    .get(`api/profile/${accountNumber}`, { ...config })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error fetching api/profile/${accountNumber}`, error);
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
    .get(`api/account/${accountNumber}/users`, { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching user list:", error);
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
    .get(`api/SMS/sms?AccountNumber=${accountNumber}`, { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching SMS subscription:", error);
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
    .get(`account/api/account/${accountNumber}/paperless/status`, {
      ...config,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching billing status:", error);
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
    .get(`account/api/account/${accountNumber}/paperless`, { ...config })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching fetchPaperLessDetails:", error);
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
      `api/mobilenotificationpreferences/${user.userInfo?.userName}/mobilepreferences/${accountNumber}`,
      { ...config }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching push notifications:", error);
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

    const response = await _axios.put(`api/profile`, data, config);

    return response.data;
  } catch (error) {
    console.error("API Call Failed:", error.message);
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
  console.log("Making API Call to api/SMS with data:", postData); // Log the request data
  try {
    const response = await _axios.post(`api/SMS`, postData, config);
    return response.data;
  } catch (error) {
    console.error("API Call Failed, Error:", error); // Log the error
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
      `api/account/${accountNumber}/paperless/${email}`,
      {},
      config
    );

    console.log(
      `API Call Successful to api/account/${accountNumber}/paperless/${email}, Response:`,
      response
    );
    return response;
  } catch (error) {
    console.error(
      `Error in API Call to api/account/${accountNumber}/paperless/${email}:`,
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
      `api/account/${accountNumber}/paperless/resend`,
      {},
      config
    );

    console.log(
      `API Call Successful to api/account/${accountNumber}/paperless/resend, Response:`,
      response
    );
    return response;
  } catch (error) {
    console.error(
      `Error in API Call to api/account/${accountNumber}/paperless/resend:`,
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
      `api/account/${accountNumber}/paperless/${email}`,
      {},
      config
    );

    console.log(
      `API Call Successful to api/account/${accountNumber}/paperless, Response:`,
      response
    );
    return response;
  } catch (error) {
    // Log the error with a descriptive message
    console.error(
      `Error in API Call to api/account/${accountNumber}/paperless:`,
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
      `api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}`,
      {},
      config
    );

    return response;
  } catch (error) {
    console.error(
      `Error in API Call to api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}:`,
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
      "api/Mobile/UpdateMobileAspnetUserData",
      payload,
      config
    );
    console.log(
      `API Call Successful to api/Mobile/UpdateMobileAspnetUserData, Response:`,
      response
    );
    return response;
  } catch (error) {
    console.error(
      `Error in API Call to api/Mobile/UpdateMobileAspnetUserData:`,
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
      `api/mobilenotificationpreferences/${userName}/mobilepreferences`,
      data,
      config
    );

    return response;
  } catch (error) {
    console.error(
      `Error in API Call to api/mobilenotificationpreferences/${userName}/mobilepreferences`,
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
      `account/api/account/${accountNumber}/paperless/unsubscribe`,
      {},
      config
    );
    return response;
  } catch (error) {
    console.error(
      `Error in API Call to account/api/account/${accountNumber}/paperless/unsubscribe:`,
      error
    );
    throw error;
  }
};

const handleSubmitFeedback = async (obj) => {
  const zendeskRequestApiUrl = Env.ZENDESK_FEEDBACK.Url;
  const user = await getUser();
  const deviceMetadata = await getDeviceMetadata();
  const fullName = user.userInfo?.fullName;
  const authToken = `${Env.ZENDESK_AUTH.email}/token:${Env.ZENDESK_AUTH.api_token}`;

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
      ticket_form_id: Env.ZENDESK_FEEDBACK.ticket_form_id,
      requester: {
        name: fullName,
        email: obj.feedbackEmail,
      },
      recipient: Env.ZENDESK_FEEDBACK.recipient,
      assignee_id: Env.ZENDESK_FEEDBACK.assignee_id,
      group_id: Env.ZENDESK_FEEDBACK.group_id,
      type: null,
      custom_fields: [
        { id: Env.ZENDESK_FEEDBACK.category_id, value: obj.category },
        { id: Env.ZENDESK_FEEDBACK.feedbackValue_id, value: obj.feedbackValue },
        { id: Env.ZENDESK_FEEDBACK.email_id, value: obj.feedbackEmail },
        {
          id: Env.ZENDESK_FEEDBACK.app_version_id,
          value: deviceMetadata.appVersion,
        },
        {
          id: Env.ZENDESK_FEEDBACK.platform_id,
          value: deviceMetadata.platform,
        },
        {
          id: Env.ZENDESK_FEEDBACK.os_version_id,
          value: deviceMetadata.osVersion,
        },
        {
          id: Env.ZENDESK_FEEDBACK.device_model_id,
          value: deviceMetadata.deviceModel,
        },
        {
          id: Env.ZENDESK_FEEDBACK.account_no,
          value: user?.userInfo?.accountNumber,
        },
        {
          id: Env.ZENDESK_FEEDBACK.area_of_concern_id,
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

  console.log("ZENDESK PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(zendeskRequestApiUrl, payload, {
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Zendesk API Error:", error.response?.data || error.message);
    throw error;
  }
};

const logError = async (errorData) => {
  try {
    await _axios.post("api/log/error", errorData);
    console.log("Error logged successfully");
  } catch (logErr) {
    console.error("Failed to log error:", logErr);
  }
};

const logInfo = async (infoData) => {
  try {
    const response = await _axios.post("api/log/info", infoData);
    console.log("Info logged successfully");
  } catch (logErr) {
    console.error("Failed to log info:", logErr);
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
    const response = await _axios.post("api/users", data, config);
    console.log("API Call Successful, Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Call Failed, Error:", error);
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

  console.log("Making API Call to api/users with data:", data); // Log the request data

  try {
    const response = await _axios.put(
      `api/users/${data.userName}`,
      data,
      config
    );
    console.log("API Call Successful, Response:", response.data); // Log the successful response
    return response.data;
  } catch (error) {
    console.error("API Call Failed, Error:", error); // Log the error
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

  console.log(`api/users/remove/${data.accountNumber}/${data.userName}`); // Log the request data

  try {
    const response = await _axios.put(
      `api/users/remove/${data.accountNumber}/${data.userName}`,
      data,
      config
    );
    console.log("API Call Successful, Response:", response.data); // Log the successful response
    return response.data;
  } catch (error) {
    console.error("API Call Failed, Error:", error); // Log the error
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
  console.log(`api/email/${accountNumber}/GetAllSVEmails`);
  try {
    const response = await _axios.get(
      `api/email/${accountNumber}/GetAllSVEmails`,
      config
    );
    console.log("API Call Successful, Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Call Failed, Error:", error); // Log the error
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
      `mobile/api/email/${accountNumber}/${email}/AddSVEmailNoFlags`,
      {},
      config
    );
    console.log(
      `API Call Successful to add SV email without flags: ${email}`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
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
      `mobile/api/email/${accountNumber}/${email}/DeleteSVEmail`,
      {},
      config
    );
    console.log(
      `API Call Successful to delete SV email: ${email}`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error in API Call to delete SV email: ${email}`, error);
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
      `mobile/api/email/${accountNumber}/UpdateSVEmails`,
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
    console.log("User Details:", user);
    const accountNumber = user.userInfo?.accountNumber || null;
    console.log("Account Number:", accountNumber);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    console.log("Request Config:", config);
    console.log("Email List:", emailList);
    const response = await _axios.post(
      `mobile/api/email/${accountNumber}/UpdateSVEmails`,
      emailList,
      config
    );
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error managing SV emails:", error);
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
    const response = await _axios.post(
      `api/email/${accountNumber}/${email}/AddSVEmailMktFlag`,
      {},
      config
    );
    console.log(
      `API Call Successful to add SV email marketing flag: ${email}`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error in API Call to add SV email marketing flag: ${email}`,
      error
    );
    throw error;
  }
};

const isPaperlessEnabled = async (email, signal) => {
  const user = await getUser();
  const response = await _axios.get(
    `api/Paperless/IsPaperless?account=${
      user.userInfo.accountNumber
    }&email=${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
      signal, 
    }
  );
  return response.data;
};

const fetchACPUserAccountDetails = async (signal, force = false) => {
  console.log("[DEBUG] fetchACPUserAccountDetails called, signal:", !!signal, "force:", force);

  let user = await getUser();
  const accountNumber = user.userInfo?.accountNumber || null;

  console.log("[DEBUG] accountNumber:", accountNumber);

  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
    signal: signal,
  };

  const requestUrl = `api/Accounts/GetAccountDetails`;
  const data = {
    accountNumber: accountNumber,
    UpdateCache: !!force,
    fieldList: [
      "first_name",
      "last_name",
      "current_balance",
      "past_due_amount",
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
    console.log("[DEBUG] calling _axios.post", requestUrl, data);
    const response = await _axios.post(requestUrl, data, config);
    console.log("API Call Successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in API Call:", error);
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
};
