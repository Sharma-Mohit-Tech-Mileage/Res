/**
 * Mock Data for Data Usage Feature
 * Path: src/components/services/dataUsage/mockDataUsage.js
 * 
 * WITH UPLOAD/DOWNLOAD SPLIT for historical usage
 */

export const MOCK_DATA_USAGE = {
  accountNumber: "123456789",
  
  // Billing cycle information
  billingCycle: {
    startDate: "2025-02-01",
    endDate: "2025-02-28",
    daysElapsed: 15,
    daysRemaining: 13,
    totalDays: 28
  },
  
  // Current data plan details
  dataPlan: {
    name: "Internet 300 Mbps",
    totalGB: 700,
    usedGB: 113,
    remainingGB: 587,
    percentageUsed: 16,
    downloadSpeed: 300,
    uploadSpeed: 30
  },
  
  // Historical usage - WITH UPLOAD/DOWNLOAD SPLIT
  historicalUsage: {
    // Monthly usage data
    monthly: [
      { 
        month: "Feb", 
        year: "2025", 
        download: 95, 
        upload: 18,
        total: 113,
        date: "2025-02", 
        isCurrentMonth: true 
      },
      { 
        month: "Jan", 
        year: "2025", 
        download: 380, 
        upload: 70,
        total: 450,
        date: "2025-01", 
        isCurrentMonth: false 
      },
      { 
        month: "Dec", 
        year: "2024", 
        download: 440, 
        upload: 80,
        total: 520,
        date: "2024-12", 
        isCurrentMonth: false 
      },
      { 
        month: "Nov", 
        year: "2024", 
        download: 320, 
        upload: 60,
        total: 380,
        date: "2024-11", 
        isCurrentMonth: false 
      },
      { 
        month: "Oct", 
        year: "2024", 
        download: 410, 
        upload: 80,
        total: 490,
        date: "2024-10", 
        isCurrentMonth: false 
      },
      { 
        month: "Sep", 
        year: "2024", 
        download: 340, 
        upload: 70,
        total: 410,
        date: "2024-09", 
        isCurrentMonth: false 
      }
    ],
    
    // Daily usage data
    daily: [
      { date: "2025-02-15", download: 4.4, upload: 0.8, total: 5.2, dayOfWeek: "Sat", dayLabel: "15" },
      { date: "2025-02-14", download: 10.8, upload: 2.0, total: 12.8, dayOfWeek: "Fri", dayLabel: "14" },
      { date: "2025-02-13", download: 7.2, upload: 1.3, total: 8.5, dayOfWeek: "Thu", dayLabel: "13" },
      { date: "2025-02-12", download: 5.2, upload: 0.9, total: 6.1, dayOfWeek: "Wed", dayLabel: "12" },
      { date: "2025-02-11", download: 7.8, upload: 1.5, total: 9.3, dayOfWeek: "Tue", dayLabel: "11" },
      { date: "2025-02-10", download: 9.4, upload: 1.8, total: 11.2, dayOfWeek: "Mon", dayLabel: "10" },
      { date: "2025-02-09", download: 6.6, upload: 1.2, total: 7.8, dayOfWeek: "Sun", dayLabel: "9" },
      { date: "2025-02-08", download: 8.8, upload: 1.7, total: 10.5, dayOfWeek: "Sat", dayLabel: "8" },
      { date: "2025-02-07", download: 5.8, upload: 1.1, total: 6.9, dayOfWeek: "Fri", dayLabel: "7" },
      { date: "2025-02-06", download: 6.9, upload: 1.3, total: 8.2, dayOfWeek: "Thu", dayLabel: "6" },
      { date: "2025-02-05", download: 4.7, upload: 0.9, total: 5.6, dayOfWeek: "Wed", dayLabel: "5" },
      { date: "2025-02-04", download: 6.0, upload: 1.1, total: 7.1, dayOfWeek: "Tue", dayLabel: "4" },
      { date: "2025-02-03", download: 8.2, upload: 1.6, total: 9.8, dayOfWeek: "Mon", dayLabel: "3" },
      { date: "2025-02-02", download: 3.5, upload: 0.7, total: 4.2, dayOfWeek: "Sun", dayLabel: "2" },
      { date: "2025-02-01", download: 5.5, upload: 1.0, total: 6.5, dayOfWeek: "Sat", dayLabel: "1" }
    ]
  },
  
  // Equipment list - WITH USEFUL INFO (not just status)
  equipment: [
    {
      id: "1",
      name: "Sparklight Modem",
      type: "modem",
      model: "C3000Z",
      macId: "00:1A:2B:3C:4D:5E",
      connectionType: "Wired",
      location: "Living Room",
      connectedDevices: 8,
      icon: "router-wireless"
    },
    {
      id: "2",
      name: "eero Pro 6e",
      type: "router",
      model: "J010001",
      macId: "00:1A:2B:3C:4D:5F",
      connectionType: "Wireless",
      location: "Main Floor",
      connectedDevices: 12,
      icon: "wifi"
    }
  ],
  
  // eero app promotion
  eeroPromo: {
    show: true,
    appName: "eero",
    tagline: "eero app simplifies connectivity",
    iosUrl: "https://apps.apple.com/app/eero/id1068944930",
    androidUrl: "https://play.google.com/store/apps/details?id=com.eero.android"
  }
};

/**
 * Get usage data by period
 * @param {string} period - 'daily' or 'monthly'
 * @returns {Array} Usage data array
 */
export const getUsageByPeriod = (period = 'monthly') => {
  if (period === 'daily') return MOCK_DATA_USAGE.historicalUsage.daily;
  return MOCK_DATA_USAGE.historicalUsage.monthly;
};

/**
 * Calculate usage statistics
 * These are computed metrics (not from API)
 * @returns {Object} Calculated stats
 */
export const getUsageStats = () => {
  const { dataPlan, billingCycle } = MOCK_DATA_USAGE;
  
  return {
    percentageUsed: Math.round((dataPlan.usedGB / dataPlan.totalGB) * 100),
    averageDaily: (dataPlan.usedGB / billingCycle.daysElapsed).toFixed(1),
    daysRemaining: billingCycle.daysRemaining,
  };
};

export default MOCK_DATA_USAGE;