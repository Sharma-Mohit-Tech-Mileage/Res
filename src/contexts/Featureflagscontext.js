import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import RemoteConfigManager from '../config/Remoteconfigmanager';
import { validateFeatureFlag } from '../config/Featureflags';

const FeatureFlagsContext = createContext({
  getFlag: () => false,
  refresh: async () => {},
  version: 0
});

export const FeatureFlagsProvider = ({ children }) => {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Subscribe to feature flag changes from RemoteConfigManager
    const unsubscribe = RemoteConfigManager.subscribeToFeatures(() => {
      setVersion(v => v + 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const contextValue = useMemo(() => ({
    getFlag: (path, defaultValue = false) => {
      validateFeatureFlag(path);
      return RemoteConfigManager.getFeatureFlag(path, defaultValue);
    },
    refresh: async () => {
      await RemoteConfigManager.refresh();
    },
    version
  }), [version]);

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

/**
 * Hook to get a feature flag using constant keys
 * @param {string} flagKey - Feature flag constant from FeatureFlags
 * @param {*} defaultValue - Default value if flag not found
 * @returns {*} Flag value
 * 
 * @example
 * import FeatureFlags from '../config/FeatureFlags';
 * const show = useFeatureFlag(FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION);
 */
export const useFeatureFlag = (flagKey, defaultValue = false) => {
  const { getFlag, version } = useContext(FeatureFlagsContext);
  
  return useMemo(() => {
    return getFlag(flagKey, defaultValue);
  }, [getFlag, flagKey, defaultValue, version]);
};

/**
 * Hook to manually refresh feature flags (for pull-to-refresh)
 * @returns {Function} refresh function
 * 
 * @example
 * const refreshFlags = useFeatureRefresh();
 * await refreshFlags();
 */
export const useFeatureRefresh = () => {
  const { refresh } = useContext(FeatureFlagsContext);
  return refresh;
};

export default FeatureFlagsContext;