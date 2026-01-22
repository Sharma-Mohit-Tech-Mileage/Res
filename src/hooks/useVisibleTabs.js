import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getVisibleTabs } from "../config/TabConfiguration";

export function useVisibleTabs() {
  const userInfo = useSelector((state) => state.user?.userData?.userInfo);

  const featureFlags = useMemo(() => {
    return {
      enableServices: false, 
      disableBilling: false,
    };
  }, []);

  const visibleTabs = useMemo(() => {
    const tabs = getVisibleTabs(userInfo, featureFlags);

    return tabs.map((tab, index) => ({
      ...tab,
      index, 
    }));
  }, [userInfo, featureFlags]);

  return visibleTabs;
}


export function useFeatureFlags() {

  return useMemo(() => {
    return {
      enableServices: false,
      disableBilling: false,
    };
  }, []);
}
