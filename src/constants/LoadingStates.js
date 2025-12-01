/**
 * Loading states for consistent loading feedback across the app
 */
export const LoadingState = {
  NONE: 'NONE',
  CHECKING_SESSION: 'CHECKING_SESSION',
  OPENING_BROWSER: 'OPENING_BROWSER',
  AUTHENTICATING: 'AUTHENTICATING',
  LOADING_DATA: 'LOADING_DATA',
  REFRESHING_TOKEN: 'REFRESHING_TOKEN',
  PROCESSING: 'PROCESSING',
};

/**
 * Loading messages for each state
 */
export const LOADING_MESSAGES = {
  [LoadingState.NONE]: '',
  [LoadingState.CHECKING_SESSION]: 'Checking your session...',
  [LoadingState.OPENING_BROWSER]: 'Opening secure login...',
  [LoadingState.AUTHENTICATING]: 'Signing you in...',
  [LoadingState.LOADING_DATA]: 'Loading your account...',
  [LoadingState.REFRESHING_TOKEN]: 'Refreshing session...',
  [LoadingState.PROCESSING]: 'Processing...',
};

/**
 * Get loading message for state
 */
export const getLoadingMessage = (state) => {
  return LOADING_MESSAGES[state] || LOADING_MESSAGES[LoadingState.NONE];
};

/**
 * Check if state is loading
 */
export const isLoadingState = (state) => {
  return state !== LoadingState.NONE;
};
