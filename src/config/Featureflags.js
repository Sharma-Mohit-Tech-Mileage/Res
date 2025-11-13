
import { ISUAT } from '../network/apis/account/Constants';
export const FeatureFlags = {
  DASHBOARD_SPARKLIGHT_MOBILE_SECTION: 'dashboard.pending_activation.show_sparklight_mobile_section',
  DASHBOARD_NEW_LAYOUT: 'dashboard.all_users.show_new_dashboard',
  TABS_SERVICES_VISIBLE: 'tabs.services.visible',
  TABS_BILLING_HIDDEN: 'tabs.billing.hidden',
  BILLING_AUTOPAY: 'tabs.billing.enable_autopay',
  BILLING_PAYMENT_PLANS: 'tabs.billing.show_payment_plans',
  SUPPORT_CHAT: 'support.show_chat_widget',
  SUPPORT_FAQ: 'support.show_faq',
};

export const FeatureFlagMetadata = {
  [FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION]: {
    description: 'Show Sparklight Mobile section in Dashboard for pending activation users',
    defaultValue: false,
    affectedUsers: ['PENDING_ACTIVATION'],
  },
  [FeatureFlags.DASHBOARD_NEW_LAYOUT]: {
    description: 'Enable new dashboard layout for all users',
    defaultValue: false,
    affectedUsers: ['ALL'],
  },
  [FeatureFlags.TABS_SERVICES_VISIBLE]: {
    description: 'Show Services tab regardless of account status',
    defaultValue: false,
    affectedUsers: ['ALL'],
  },
  [FeatureFlags.TABS_BILLING_HIDDEN]: {
    description: 'Hide Billing tab',
    defaultValue: false,
    affectedUsers: ['ALL'],
  },
};

/**
 * Helper to validate flag keys at runtime (dev mode)
 */
export const validateFeatureFlag = (key) => {
  if (ISUAT) {
    const validKeys = Object.values(FeatureFlags);
    if (!validKeys.includes(key)) {
      console.warn(`[FeatureFlags] Invalid flag key: "${key}". Valid keys:`, validKeys);
    }
  }
};

export default FeatureFlags;