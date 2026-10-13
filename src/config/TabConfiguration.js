import { Color } from "../styles/GlobalStyles";

export const TABS = [
  {
    id: "home",
    name: "Home",
    screenName: "Home",
    component: "HomeStackScreen",
    icons: {
      default: "HomeIcon",
    },

    alwaysVisible: true,

    walkthrough: {
      title: "Discover your dashboard",
      description:
        "Get a quick overview of your account, billing status, and important updates all in one place.",
      iconName: "home",
      color: Color.sparklightWhite,
    },
  },

  {
    id: "billing",
    name: "Billing",
    screenName: "BillingTab",
    component: "BillingStackScreen",
    icons: {
      default: "BillingIcon",
      selected: "BillingIcon",
    },

    isVisible: (userInfo, featureFlags) => {
      if (userInfo?.acctStatus === "PENDING_ACTIVATION") {
        return false;
      }

      if (featureFlags?.disableBilling === true) {
        return false;
      }

      if (userInfo?.pending_activation === true) {
        return false;
      }

      return true;
    },

    walkthrough: {
      title: "Manage your billing",
      description:
        "Make payments, set up Auto Pay, view statements, and keep track of your billing history effortlessly.",
      iconName: "credit-card",
    },
  },

  {
    id: "services",
    name: "Service",
    screenName: "MyServices",
    component: "MyServicesStack",
    icons: {
      default: "SupportIcon",
    },

    isVisible: (userInfo, featureFlags) => {
      if (userInfo?.pending_activation === true) {
        return false;
      }

      return true;
    },

    walkthrough: {
      title: "Your services hub",
      description:
        "Manage your internet plan and view all available services tailored to your needs.",
      iconName: "wifi",
    },
  },

  {
    id: "support",
    name: "Support",
    screenName: "Support",
    component: "SupportStack",
    icons: {
      default: "NewSupportIcon",
      selected: "NewSupportIcon",
    },

    alwaysVisible: true,

    walkthrough: {
      title: "Get help anytime",
      description:
        "View FAQs, contact our Support Team for assistance, and find answers to your questions quickly.",
      iconName: "help-circle",
    },
  },

  {
    id: "account",
    name: "Account",
    screenName: "account",
    component: "AccountStackScreen",
    icons: {
      default: "HomeAccountIcon",
      selected: "HomeAccountIcon",
    },

    alwaysVisible: true,

    walkthrough: {
      title: "Your personal space",
      description:
        "Manage your profile settings, notifications, preferences, and account security all in one place.",
      iconName: "user",
    },
  },
];

export function getVisibleTabs(userInfo = {}, featureFlags = {}) {
  return TABS.filter((tab) => {
    if (tab.alwaysVisible) {
      return true;
    }

    if (typeof tab.isVisible === "function") {
      return tab.isVisible(userInfo, featureFlags);
    }

    return true;
  });
}

export function getTabById(tabId) {
  return TABS.find((tab) => tab.id === tabId) || null;
}
