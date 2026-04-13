import React, { createContext, useContext } from 'react';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';

// Export the context
export const AnalyticsContext = createContext({
    logEvent: (eventName, eventData) => logEvent(getAnalytics(), eventName, eventData),
});

// Export the custom hook
export const useAnalytics = () => useContext(AnalyticsContext);
