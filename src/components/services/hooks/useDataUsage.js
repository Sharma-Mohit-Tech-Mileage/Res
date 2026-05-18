import { useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUsageRequest,
  fetchMonthlyUsageRequest,
  fetchDailyUsageRequest,
  fetchUsagePeriodsRequest,
  clearDataUsage,
} from "../../../redux/actions/servicesActions";
import {
  selectCurrentUsage,
  selectCurrentUsageLoading,
  selectCurrentUsageError,
  selectMonthlyUsage,
  selectMonthlyUsageLoading,
  selectDailyUsage,
  selectDailyUsageLoading,
  selectUsagePeriods,
  selectUsagePeriodsLoading,
} from "../../../redux/selectors/servicesSelectors";
import moment from "moment";

/**
 * Ensures a date string is in the exact ISO format the API expects:
 * "2025-06-15T00:00:00"
 */
const toApiDate = (dateStr) => {
  if (!dateStr) return dateStr;
  return moment(dateStr).format("YYYY-MM-DDTHH:mm:ss");
};

/**
 * Formats a period for the dropdown.
 * Always shows 2-digit year on both dates for clarity.
 * e.g. "Jun 15, '25 - Jul 14, '25"  or  "Dec 15, '25 - Jan 14, '26"
 */
const formatPeriodLabel = (period) => {
  const start = moment(period.usageStartDate);
  const end = moment(period.usageEndDate);
  return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
};

/**
 * Hook that orchestrates all data usage fetching.
 *
 * On mount:
 *   1. Fetches current usage, monthly usage, and available periods
 *   2. Once periods arrive, auto-selects the latest period and fetches daily data
 *
 * Returns everything the DataUsageScreen needs.
 */
export const useDataUsage = () => {
  const dispatch = useDispatch();

  // Selectors
  const currentUsage = useSelector(selectCurrentUsage);
  const currentUsageLoading = useSelector(selectCurrentUsageLoading);
  const currentUsageError = useSelector(selectCurrentUsageError);

  const monthlyUsage = useSelector(selectMonthlyUsage);
  const monthlyUsageLoading = useSelector(selectMonthlyUsageLoading);

  const dailyUsage = useSelector(selectDailyUsage);
  const dailyUsageLoading = useSelector(selectDailyUsageLoading);

  const usagePeriods = useSelector(selectUsagePeriods);
  const usagePeriodsLoading = useSelector(selectUsagePeriodsLoading);

  // Fetch everything on mount
  useEffect(() => {
    dispatch(fetchCurrentUsageRequest());
    dispatch(fetchMonthlyUsageRequest());
    dispatch(fetchUsagePeriodsRequest());
  }, [dispatch]);

  // Build dropdown items from periods
  const periodItems = useMemo(() => {
    if (!usagePeriods || !Array.isArray(usagePeriods)) return [];
    return usagePeriods.map((p) => ({
      label: formatPeriodLabel(p),
      startDate: toApiDate(p.usageStartDate),
      endDate: toApiDate(p.usageEndDate),
    }));
  }, [usagePeriods]);

  // Auto-fetch daily for the latest period ONCE when periods first arrive
  const initialDailyFetched = useRef(false);
  useEffect(() => {
    if (periodItems.length > 0 && !initialDailyFetched.current) {
      initialDailyFetched.current = true;
      const latest = periodItems[periodItems.length - 1];
      dispatch(fetchDailyUsageRequest(latest.startDate, latest.endDate));
    }
  }, [periodItems, dispatch]);

  // Called when user picks a different period from the dropdown
  const fetchDailyForPeriod = useCallback(
    (periodItem) => {
      if (periodItem?.startDate && periodItem?.endDate) {
        dispatch(
          fetchDailyUsageRequest(periodItem.startDate, periodItem.endDate)
        );
      }
    },
    [dispatch]
  );

  // Refresh all data
  const refetchAll = useCallback(() => {
    dispatch(fetchCurrentUsageRequest());
    dispatch(fetchMonthlyUsageRequest());
    dispatch(fetchUsagePeriodsRequest());
  }, [dispatch]);

  // Build dataPlan object for InternetCard from currentUsage API response
  const dataPlan = useMemo(() => {
    if (!currentUsage) return null;
    return {
      usedGB: currentUsage.usedDataGB,
      totalGB: currentUsage.dataPlanGB,
      percentageUsed: currentUsage.dataUsedPercent,
    };
  }, [currentUsage]);

  return {
    // Current usage
    currentUsage,
    currentUsageLoading,
    currentUsageError,
    dataPlan,

    // Monthly
    monthlyUsage,
    monthlyUsageLoading,

    // Daily
    dailyUsage,
    dailyUsageLoading,

    // Periods
    periodItems,
    usagePeriodsLoading,

    // Actions
    fetchDailyForPeriod,
    refetchAll,
  };
};
