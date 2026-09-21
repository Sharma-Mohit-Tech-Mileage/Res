// Zendesk feedback ticket submission. Lives under support/ rather than account/profile.service.js — it is a support-desk concern, not a profile one, and it talks to Zendesk directly instead of the ACP API.
import axios from "axios";
import Config from "react-native-config";
import base64 from "react-native-base64";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getDeviceMetadata } from "../../../components/utility/DeviceInfo";
import * as appLogger from "../../../utils/logger";

const CONCERN_LABELS = {
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

// Zendesk tags and multi-select values are slugs: "Pricing & Plans" -> "pricing_and_plans".
const slugify = (label) =>
  label
    .toLowerCase()
    .replace(/\s*&\s*/g, "_and_")
    .replace(/\s+/g, "_");

const buildTicket = ({ obj, user, deviceMetadata, concernSlugs }) => ({
  request: {
    ticket_form_id: Config.ZENDESK_FEEDBACK_TICKET_FORM_ID,
    requester: {
      name: user.userInfo?.fullName,
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
      { id: Config.ZENDESK_COSENT_CONTACT_US_ID, value: obj.cosentContactUs ? "Yes" : "No" },
      { id: Config.ZENDESK_FEEDBACK_APP_VERSION_ID, value: deviceMetadata.appVersion },
      { id: Config.ZENDESK_FEEDBACK_PLATFORM_ID, value: deviceMetadata.platform },
      { id: Config.ZENDESK_FEEDBACK_OS_VERSION_ID, value: deviceMetadata.osVersion },
      { id: Config.ZENDESK_FEEDBACK_DEVICE_MODEL_ID, value: deviceMetadata.deviceModel },
      { id: Config.ZENDESK_FEEDBACK_ACCOUNT_NO, value: user?.userInfo?.accountNumber },
      { id: Config.ZENDESK_FEEDBACK_AREA_OF_CONCERN_ID, value: concernSlugs },
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
      ...concernSlugs,
    ],
    via: { channel: "MobileApp" },
  },
});

export const submitFeedback = async (obj) => {
  const user = await getUser();
  const deviceMetadata = await getDeviceMetadata();
  const concernSlugs = (obj.areaOfConcern || []).map((id) => slugify(CONCERN_LABELS[id] || id));
  const authToken = `${Config.ZENDESK_AUTH_EMAIL}/token:${Config.ZENDESK_AUTH_API_TOKEN}`;

  try {
    return await axios.post(Config.ZENDESK_FEEDBACK_URL, buildTicket({ obj, user, deviceMetadata, concernSlugs }), {
      headers: {
        Authorization: `Basic ${base64.encode(authToken)}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    appLogger.logError("feedback.service", error.response?.data || error.message);
    throw error;
  }
};

export default submitFeedback;
