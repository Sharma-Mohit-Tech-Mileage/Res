/**
 * ============================================================================
 * TAB CONFIGURATION - SINGLE SOURCE OF TRUTH
 * ============================================================================
 * 
 * This file defines ALL bottom navigation tabs for the application.
 * 
 * HOW TO USE:
 * 1. To add a new tab: Add a new object to the TABS array
 * 2. To hide a tab: Set visibility rule in `isVisible` function
 * 3. To change walkthrough text: Edit `walkthrough` object
 * 
 * VISIBILITY RULES:
 * - alwaysVisible: true = Tab shows for everyone
 * - isVisible: (userInfo, flags) => boolean = Custom logic
 * 
 * ============================================================================
 */

import { Color } from '../../../GlobalStyles';

export const TABS = [
  {
    id: 'home',
    name: 'Home',
    screenName: 'Home',
    component: 'HomeStackScreen',
    icons: {
      default: 'HomeIcon',
      selected: 'HomeIconSelected',
    },
    
    alwaysVisible: true,
    
    walkthrough: {
      title: 'Discover your dashboard',
      description: 'Get a quick overview of your account, billing status, and important updates all in one place.',
      iconName: 'home',
      color: Color.sparklightWhite,
    },
  },
  
  {
    id: 'billing',
    name: 'Billing',
    screenName: 'BillingTab',
    component: 'BillingStackScreen',
    icons: {
      default: 'BillingIcon',
      selected: 'BillingIcon',
    },
    
    // Visibility: Conditional
    isVisible: (userInfo, featureFlags) => {
      // Hide for pending activation users
      if (userInfo?.acctStatus === 'PENDING_ACTIVATION') {
        return false;
      }

      // Hide if feature flag disables it
      if (featureFlags?.disableBilling === true) {
        return false;
      }
      
      return true;
    },
    
    walkthrough: {
      title: 'Manage your billing',
      description: 'Make payments, set up Auto Pay, view statements, and keep track of your billing history effortlessly.',
      iconName: 'credit-card',
    },
  },
  
  {
    id: 'services',
    name: 'Service',
    screenName: 'MyServices',
    component: 'MyServicesStack',
    icons: {
      default: 'SupportIcon',
      selected: 'SupportIconSelected',
    },
    
    isVisible: (userInfo, featureFlags) => {
      if (!featureFlags?.enableServices) {
        return false;
      }
      
      // Only show for active accounts
      if (userInfo?.acctStatus !== 'ACTIVE') {
        return false;
      }
      
      return true;
    },
    
    walkthrough: {
      title: 'Your services hub',
      description: 'Manage your internet plans, explore upgrades, and view all available services tailored to your needs.',
      iconName: 'wifi',
    },
  },
  
  {
    id: 'support',
    name: 'Support',
    screenName: 'Support',
    component: 'SupportStack',
    icons: {
      default: 'NewSupportIcon',
      selected: 'NewSupportIcon',
    },
    
    // Visibility: Always show Support
    alwaysVisible: true,
    
    walkthrough: {
      title: 'Get help anytime',
      description: 'View FAQs, contact our Support Team for assistance, and find answers to your questions quickly.',
      iconName: 'help-circle',
    },
  },
  
  {
    id: 'account',
    name: 'Account',
    screenName: 'account',
    component: 'AccountStackScreen',
    icons: {
      default: 'HomeAccountIcon',
      selected: 'HomeAccountIcon',
    },
    
    // Visibility: Always show Account
    alwaysVisible: true,
    
    walkthrough: {
      title: 'Your personal space',
      description: 'Manage your profile settings, notifications, preferences, and account security all in one place.',
      iconName: 'user',
    },
  },
];

/**
 * Get visible tabs based on user context
 * 
 * @param {Object} userInfo - User information from Redux
 * @param {Object} featureFlags - Feature flags (Remote Config, API, etc.)
 * @returns {Array} - Filtered array of visible tabs
 */
export function getVisibleTabs(userInfo = {}, featureFlags = {}) {
  return TABS.filter(tab => {
    // Always show tabs marked as alwaysVisible
    if (tab.alwaysVisible) {
      return true;
    }
    
    // Check custom visibility function
    if (typeof tab.isVisible === 'function') {
      return tab.isVisible(userInfo, featureFlags);
    }
    
    // Default: show tab
    return true;
  });
}

/**
 * Get tab configuration by ID
 * 
 * @param {String} tabId - Tab identifier
 * @returns {Object|null} - Tab configuration or null
 */
export function getTabById(tabId) {
  return TABS.find(tab => tab.id === tabId) || null;
}