import { Env } from '../../network/apis/account/Constants';


/**
 * Utility function to get the payment referral URL (landing pages)
 * 
 * @param {string} version - The API version ('V2' or 'V3')
 * @param {string} type - The URL type ('SETUP' or 'MANAGE')
 * @param {string|null} customReferUrl - Optional custom referral URL to override default behavior
 * @returns {string} The resolved referral URL
 */
export const getReferralUrl = (version, type, customReferUrl = null) => {
  // If a custom URL is provided, use it directly - highest priority
  if (customReferUrl) {
    return customReferUrl;
  }
  
  // Default to existing full URLs for backward compatibility
  const versionKey = version === 'V3' ? 'V3' : 'V2';
  const urlMap = {
    'V2': {
      'SETUP': Env.URL_EASYPAY_SETUP_V2,
      'MANAGE': Env.URL_EASYPAY_MANAGE_V2
    },
    'V3': {
      'SETUP': Env.URL_EASYPAY_SETUP_V3,
      'MANAGE': Env.URL_EASYPAY_MANAGE_V3
    }
  };
  
  return urlMap[versionKey][type] || null;
};

/**
 * Utility function to get the payment controller URL
 * 
 * @param {string} version - The API version ('V2' or 'V3')
 * @returns {string} The resolved payment URL
 */
export const getPaymentUrl = (version) => {
  // Always use the predefined controller URLs based on version
  return version === 'V3' ? Env.PAYMENTURL_V3 : Env.PAYMENTURL_V2;
};