/**
 * mockDataUsage.js - API-COMPATIBLE STRUCTURE
 * Path: src/components/services/dataUsage/mockDataUsage.js
 */

export const MOCK_CURRENT_USAGE = {
  beginDate: "2026-01-15T00:00:00",
  endDate: "2026-07-14T00:00:00",
  accountType: "usagebased",
  dataPlanGB: 1500,
  usedDataGB: 237.75,
  dataRemaining: 1262.25,
  uploadTotalGB: 15.89,
  downloadTotalGB: 222.69,
  dataUsedPercent: 15.85,
  remainingDays: 16,
  
};

export const MOCK_MONTHLY_USAGE = [
  {
    monthLabel: "Jan 2026",
    usageStartDate: "2026-01-01",
    usageEndDate: "2026-01-31",
    uploadGB: 32.17,
    downloadGB: 406.2,
    totalGB: 438.37
  },
  {
    monthLabel: "Dec 2025",
    usageStartDate: "2025-12-01",
    usageEndDate: "2025-12-31",
    uploadGB: 84.85,
    downloadGB: 461.66,
    totalGB: 546.51
  },
  {
    monthLabel: "Nov 2025",
    usageStartDate: "2025-11-01",
    usageEndDate: "2025-11-30",
    uploadGB: 103.41,
    downloadGB: 658.06,
    totalGB: 761.47
  },
  {
    monthLabel: "Oct 2025",
    usageStartDate: "2025-10-01",
    usageEndDate: "2025-10-31",
    uploadGB: 95.23,
    downloadGB: 512.34,
    totalGB: 607.57
  },
  {
    monthLabel: "Sep 2025",
    usageStartDate: "2025-09-01",
    usageEndDate: "2025-09-30",
    uploadGB: 78.91,
    downloadGB: 445.32,
    totalGB: 524.23
  },
  {
    monthLabel: "Aug 2025",
    usageStartDate: "2025-08-01",
    usageEndDate: "2025-08-31",
    uploadGB: 88.45,
    downloadGB: 523.18,
    totalGB: 611.63
  }
  
];

export const MOCK_DAILY_USAGE = [
  { usageDay: "2026-01-15", uploadGB: 0.8, downloadGB: 12.4, totalGB: 13.2 },
  { usageDay: "2026-01-14", uploadGB: 2.1, downloadGB: 24.8, totalGB: 26.9 },
  { usageDay: "2026-01-13", uploadGB: 1.5, downloadGB: 18.3, totalGB: 19.8 },
  { usageDay: "2026-01-12", uploadGB: 0.9, downloadGB: 14.2, totalGB: 15.1 },
  { usageDay: "2026-01-11", uploadGB: 1.7, downloadGB: 21.5, totalGB: 23.2 },
  { usageDay: "2026-01-10", uploadGB: 2.3, downloadGB: 28.7, totalGB: 31.0 },
  { usageDay: "2026-01-09", uploadGB: 1.2, downloadGB: 16.9, totalGB: 18.1 },
  { usageDay: "2026-01-08", uploadGB: 1.9, downloadGB: 23.4, totalGB: 25.3 },
  { usageDay: "2026-01-07", uploadGB: 1.1, downloadGB: 15.8, totalGB: 16.9 },
  { usageDay: "2026-01-06", uploadGB: 1.4, downloadGB: 19.2, totalGB: 20.6 },
  { usageDay: "2026-01-05", uploadGB: 0.7, downloadGB: 13.1, totalGB: 13.8 },
  { usageDay: "2026-01-04", uploadGB: 1.3, downloadGB: 17.5, totalGB: 18.8 },
  { usageDay: "2026-01-03", uploadGB: 2.0, downloadGB: 25.2, totalGB: 27.2 },
  { usageDay: "2026-01-02", uploadGB: 0.6, downloadGB: 11.3, totalGB: 11.9 },
  { usageDay: "2026-01-01", uploadGB: 1.0, downloadGB: 15.6, totalGB: 16.6 }
];

export const MOCK_USAGE_PERIODS = [
  { usageStartDate: "2025-06-15", usageEndDate: "2025-07-14" },
  { usageStartDate: "2025-07-15", usageEndDate: "2025-08-14" },
  { usageStartDate: "2025-08-15", usageEndDate: "2025-09-14" },
  { usageStartDate: "2025-09-15", usageEndDate: "2025-10-14" },
  { usageStartDate: "2025-10-15", usageEndDate: "2025-11-14" },
  { usageStartDate: "2025-11-15", usageEndDate: "2025-12-14" },
  { usageStartDate: "2025-12-15", usageEndDate: "2026-01-14" }
];

/**
 * Calculate comparison stats between current and previous period
 */
export const calculateComparison = (current, previous) => {
  const totalChange = ((current.totalGB - previous.totalGB) / previous.totalGB) * 100;
  const uploadChange = ((current.uploadGB - previous.uploadGB) / previous.uploadGB) * 100;
  const downloadChange = ((current.downloadGB - previous.downloadGB) / previous.downloadGB) * 100;
  
  return {
    totalChange: totalChange.toFixed(1),
    uploadChange: uploadChange.toFixed(1),
    downloadChange: downloadChange.toFixed(1),
    isIncrease: totalChange > 0
  };
};

/**
 * Get peak usage day
 */
export const getPeakDay = (dailyData) => {
  if (!dailyData || dailyData.length === 0) return null;
  
  return dailyData.reduce((peak, current) => 
    current.totalGB > peak.totalGB ? current : peak
  );
};

export const calculatePace = (currentUsage) => {
  if (!currentUsage) {
    return {
      pace: 0,
      isOnTrack: true,
      expected: 0,
    };
  }

  const { usedDataGB, dataPlanGB, remainingDays, endDate, beginDate } = currentUsage;
  
  const totalDays = Math.ceil(
    (new Date(endDate) - new Date(beginDate)) / (1000 * 60 * 60 * 24)
  );
  
  const daysElapsed = totalDays - remainingDays;
  const expectedUsage = (dataPlanGB / totalDays) * daysElapsed;
  const pace = Math.round((usedDataGB / expectedUsage) * 100);
  
  return {
    pace,
    isOnTrack: pace <= 100,
    expected: expectedUsage.toFixed(2),
  };
};

/**
 * Forecast end-of-period usage
 */
export const forecastUsage = (currentUsage) => {
  const { usedDataGB, dataPlanGB, remainingDays, beginDate, endDate } = currentUsage;
  
  const totalDays = Math.ceil(
    (new Date(endDate) - new Date(beginDate)) / (1000 * 60 * 60 * 24)
  );
  const daysElapsed = totalDays - remainingDays;
  const dailyAverage = usedDataGB / daysElapsed;
  const projected = usedDataGB + (dailyAverage * remainingDays);
  const projectedPercent = (projected / dataPlanGB) * 100;
  
  return {
    projected: projected.toFixed(1),
    projectedPercent: projectedPercent.toFixed(0),
    willExceed: projected > dataPlanGB
  };
};

export default {
  MOCK_CURRENT_USAGE,
  MOCK_MONTHLY_USAGE,
  MOCK_DAILY_USAGE,
  MOCK_USAGE_PERIODS
};