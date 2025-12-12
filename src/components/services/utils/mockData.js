
export const MOCK_SERVICE_DATA = {
  accountNumber: "123456789",
  
  internet: {
    hasService: true,
    planName: "Internet 300 Mbps",
    downloadSpeed: 300,
    uploadSpeed: 30,
    unit: "Mbps",
    lastUpdated: new Date().toISOString(),
  },
  
  video: {
    hasService: true,
    planName: "Economy Sparklight TV Plus",
    channelCount: 125,
    zipCode: "75601",
    serviceAddress: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "75601"
    }
  },
  
  phone: {
    hasService: true,
    planName: "Sparklight Economy Phone",
    phoneNumber: "(555) 123-4567",
    features: ["Unlimited Local", "Voicemail", "Call Waiting"],
    legacyBrand: "sparklight" 
  }
};
export const OUTAGE_SCENARIOS = {
  noOutage: {
    hasOutage: false,
    status: "operational",
    title: "No Outages Detected",
    message: "Currently, we do not detect an outage in your area. If you are still experiencing issues, please contact us at 877-692-2253. If you prefer, you may sign up or manage your notification settings.",
    lastChecked: new Date().toISOString(),
    affectedServices: []
  },
  
  withOutage: {
    hasOutage: true,
    status: "outage",
    title: "Outage Notification",
    message: "Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. Estimated Time to Restore: 3:30 AM.",
    estimatedRestoreTime: "3:30 AM",
    lastChecked: new Date().toISOString(),
    affectedServices: ["internet"]
  },
  
  error: {
    hasOutage: false,
    status: "error",
    title: "Error",
    message: "Unable to check service status. Please try again later.",
    lastChecked: new Date().toISOString(),
    affectedServices: []
  }
};

export const CURRENT_OUTAGE_SCENARIO = 'noOutage';