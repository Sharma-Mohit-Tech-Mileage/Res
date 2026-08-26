
import Config from 'react-native-config';
export const FeatureFlags = {
  DASHBOARD_SPARKLIGHT_MOBILE_SECTION: 'dashboard.pending_activation.show_sparklight_mobile_section',
  DASHBOARD_NEW_LAYOUT: 'dashboard.all_users.show_new_dashboard',
  DASHBOARD_CHAT_ICON: 'dashboard.all_users.chat_icon',
  TABS_SERVICES_VISIBLE: 'tabs.services.visible',
  TABS_BILLING_HIDDEN: 'tabs.billing.hidden',
  BILLING_AUTOPAY: 'tabs.billing.enable_autopay',
  BILLING_PAYMENT_PLANS: 'tabs.billing.show_payment_plans',
  BILLING_ORBIPAY_HOST: 'tabs.billing.orbipay.host',
  BILLING_ORBIPAY_PORTAL_PATH: 'tabs.billing.orbipay.portal_widget_path',
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
  [FeatureFlags.DASHBOARD_CHAT_ICON]: {
    description: 'Show chat icon in dashboard',
    defaultValue: true,
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
  [FeatureFlags.BILLING_ORBIPAY_HOST]: {
    description: 'Orbipay widget host: "app" (bundled HTML) or "portal" (portal-hosted page); any other value falls back to "app"',
    defaultValue: 'app',
    affectedUsers: ['ALL'],
  },
  [FeatureFlags.BILLING_ORBIPAY_PORTAL_PATH]: {
    description: 'Path of the portal-hosted Orbipay widget page, appended to PORTAL_BASE_URL',
    defaultValue: Config.ORBIPAY_PORTAL_WIDGET_PATH || '/orbipayhost.html',
    affectedUsers: ['ALL'],
  },
};

/**
 * Helper to validate flag keys at runtime (dev mode)
 */
export const validateFeatureFlag = (key) => {
  if (Config.ENV !== 'production') {
    const validKeys = Object.values(FeatureFlags);
    if (!validKeys.includes(key)) {
      console.warn(`[FeatureFlags] Invalid flag key: "${key}". Valid keys:`, validKeys);
    }
  }
};

export default FeatureFlags;