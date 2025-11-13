/**
 * ============================================================================
 * USE VISIBLE TABS HOOK
 * ============================================================================
 *
 * Custom hook to get visible tabs based on current user and feature flags.
 *
 * USAGE:
 *   const visibleTabs = useVisibleTabs();
 *
 * RETURNS:
 *   Array of visible tab objects with index property added
 *
 * ============================================================================
 */

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getVisibleTabs } from "../config/TabConfiguration";

export function useVisibleTabs() {
  // Get user info from Redux
  const userInfo = useSelector((state) => state.user?.userData?.userInfo);

  // Feature flags - Replace with Firebase Remote Config or API
  const featureFlags = useMemo(() => {
    return {
      // Example flags - modify based on your needs
      enableServices: false, // Set to true to enable Services tab
      disableBilling: false, // Set to true to hide Billing tab
    };
  }, []);

  // Calculate visible tabs
  const visibleTabs = useMemo(() => {
    const tabs = getVisibleTabs(userInfo, featureFlags);

    // Add index property for positioning calculations
    return tabs.map((tab, index) => ({
      ...tab,
      index, // 0-based index in visible tabs array
    }));
  }, [userInfo, featureFlags]);

  return visibleTabs;
}

/**
 * Optional: Hook to load feature flags from Remote Config
 *
 * USAGE:
 *   const featureFlags = useFeatureFlags();
 */
export function useFeatureFlags() {
  // TODO: Implement Firebase Remote Config
  // import remoteConfig from '@react-native-firebase/remote-config';

  return useMemo(() => {
    return {
      enableServices: false,
      disableBilling: false,
    };
  }, []);
}
