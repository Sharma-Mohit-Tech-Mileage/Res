// Mock data for Services screen development
// This will be replaced with real API calls in Phase 2

export const MOCK_SERVICE_DATA = {
  accountNumber: "123456789",
  
  // Internet Service Data
  internet: {
    hasService: true,
    planName: "Internet 300 Mbps",
    downloadSpeed: 300,
    uploadSpeed: 30,
    unit: "Mbps",
    lastUpdated: new Date().toISOString(),
  },
  
  // Video Service Data
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
  
  // Phone Service Data
  phone: {
    hasService: true,
    planName: "Sparklight Economy Phone",
    phoneNumber: "(555) 123-4567",
    features: ["Unlimited Local", "Voicemail", "Call Waiting"],
    legacyBrand: "sparklight" // Options: sparklight | hargray | valunet | cableamerica | null
  }
};

// Outage Status Mock Data
export const MOCK_OUTAGE_DATA = {
  noOutage: {
    hasOutage: false,
    status: "operational",
    message: "Currently, we do not detect an outage in your area. If you are still experiencing issues, please contact us at 877-692-2253. If you prefer, you may sign up or manage your notification settings.",
    lastChecked: new Date().toISOString(),
    affectedServices: []
  },
  
  withOutage: {
    hasOutage: true,
    status: "outage",
    message: "Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible.",
    estimatedRestoreTime: "3:30 AM",
    lastChecked: new Date().toISOString(),
    affectedServices: ["internet"]
  }
};

// Phone Portal URLs by Legacy Brand
export const PHONE_PORTAL_URLS = {
  sparklight: 'https://phone.sparklight.com/',
  hargray: 'https://vmail.hargray.com/',
  valunet: 'https://cp.valu-net.net/commportal/login.html'
};

// Channel Lineup Base URL
export const CHANNEL_LINEUP_BASE_URL = 'https://www.sparklight.com/channel-lineup';

// Toggle this to test different scenarios
export const USE_OUTAGE_SCENARIO = false; // Set to true to test outage state
