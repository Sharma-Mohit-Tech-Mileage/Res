import React, { createContext, useContext } from 'react';
import analytics from '@react-native-firebase/analytics';

// Export the context
export const AnalyticsContext = createContext({
    logEvent: (eventName, eventData) => analytics().logEvent(eventName, eventData),
});

// Export the custom hook
export const useAnalytics = () => useContext(AnalyticsContext);
