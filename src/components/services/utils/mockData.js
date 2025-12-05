// Mock data for Services screen
// This will be replaced with real API calls later

export const MOCK_SERVICE_DATA = {
  accountNumber: "123456789",
  
  internet: {
    hasService: true,
    planName: "Internet 300 Mbps",
    downloadSpeed: 300,
    uploadSpeed: 30,
    unit: "Mbps",
  },
  
  video: {
    hasService: true,
    planName: "Economy Sparklight TV Plus",
    channelCount: 125,
    zipCode: "75601",
  },
  
  phone: {
    hasService: true,
    planName: "Sparklight Economy Phone",
    legacyBrand: "sparklight", // sparklight | hargray | valunet | cableamerica | fidelity | null
  },
};

// Outage scenarios for testing
export const OUTAGE_SCENARIOS = {
  noOutage: {
    hasOutage: false,
    status: "operational",
    message: "Currently, we do not detect an outage in your area. If you are still experiencing issues, please contact us at 877-692-2253. If you prefer, you may sign up or manage your notification settings.",
    title: "No Outages Detected",
  },
  
  withOutage: {
    hasOutage: true,
    status: "outage",
    message: "Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. Estimated Time to Restore: 3:30 AM.",
    title: "Outage Notification",
    estimatedRestoreTime: "3:30 AM",
  },
};

// Toggle this to test different scenarios
export const CURRENT_OUTAGE_SCENARIO = "noOutage"; // "noOutage" | "withOutage"
