import remoteConfig from '@react-native-firebase/remote-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { ISUAT } from '../network/apis/account/Constants';

const CACHE_KEY_MAINTENANCE = 'maintenance_config_cache';
const CACHE_KEY_FEATURES = 'feature_flags_cache';
const CACHE_KEY_LAST_FETCH = 'remote_config_last_fetch';

// Fetch intervals
const FETCH_INTERVAL_PROD = 300000; // 5 minutes
const FETCH_INTERVAL_DEV = 0; // Always fetch in dev/UAT

// Config keys based on environment
const CONFIG_KEY_MAINTENANCE = ISUAT ? 'dev_config' : 'maintenance_configuration';
const CONFIG_KEY_FEATURES = ISUAT ? 'feature_flags_dev' : 'feature_flags';

// Default configurations
const DEFAULT_MAINTENANCE = {
  maintenanceWindow: {
    mode: "IMMEDIATE",
    enabled: false,
  },
  maintenanceBanner: { enabled: false },
  maintenancePage: { enabled: false },
  sessionManagement: {
    invalidateSessionsForAudience: "NONE",
    redirectToSplash: false,
  }
};

const DEFAULT_FEATURES = {
  dashboard: {
    pending_activation: {
      show_sparklight_mobile_section: false
    }
  },
  tabs: {
    services: { visible: false },
    billing: { hidden: false }
  }
};

/**
 * Unified Remote Config Manager
 * Handles all Remote Config operations for the entire app
 * Supports multiple subscribers (Maintenance, Features, etc.)
 */
class RemoteConfigManager {
  static _instance = null;
  static _initialized = false;
  static _isFetching = false;
  static _lastFetchTime = 0;
  static _appStateSubscription = null;

  // Separate caches for different config domains
  static _maintenanceCache = null;
  static _featuresCache = null;

  // Subscriber management
  static _maintenanceSubscribers = new Set();
  static _featureSubscribers = new Set();

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!this._instance) {
      this._instance = new RemoteConfigManager();
    }
    return this._instance;
  }

  /**
   * Initialize Remote Config - called once at app startup
   */
  static async initialize() {
    if (this._initialized) {
      console.log('[RemoteConfig] Already initialized');
      return;
    }

    console.log('[RemoteConfig] Initializing...');

    try {
      // Load cached values first (fast, synchronous UI)
      await this._loadFromCache();

      // Set defaults
      await remoteConfig().setDefaults({
        [CONFIG_KEY_MAINTENANCE]: JSON.stringify(DEFAULT_MAINTENANCE),
        [CONFIG_KEY_FEATURES]: JSON.stringify(DEFAULT_FEATURES)
      });

      // Configure fetch settings
      const minimumFetchInterval = ISUAT ? FETCH_INTERVAL_DEV : FETCH_INTERVAL_PROD;
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: minimumFetchInterval
      });

      // Load last fetch time
      const lastFetchStr = await AsyncStorage.getItem(CACHE_KEY_LAST_FETCH);
      this._lastFetchTime = lastFetchStr ? parseInt(lastFetchStr, 10) : 0;

      // Setup AppState listener for background/foreground
      this._setupAppStateListener();

      this._initialized = true;
      console.log('[RemoteConfig] Initialized successfully');

      // CRITICAL: Notify subscribers with cached values immediately
      // This ensures MaintenanceContext gets cached config on cold start
      this._notifyMaintenanceSubscribers();
      this._notifyFeatureSubscribers();

      // Fetch in background (non-blocking) - will notify again if changed
      this._fetchInBackground();
    } catch (error) {
      console.error('[RemoteConfig] Initialization error:', error);
      // Use defaults on error
      this._maintenanceCache = DEFAULT_MAINTENANCE;
      this._featuresCache = DEFAULT_FEATURES;
      this._initialized = true;
    }
  }

  /**
   * Load cached configs from AsyncStorage
   */
  static async _loadFromCache() {
    try {
      const [maintenanceStr, featuresStr] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY_MAINTENANCE),
        AsyncStorage.getItem(CACHE_KEY_FEATURES)
      ]);

      this._maintenanceCache = maintenanceStr 
        ? JSON.parse(maintenanceStr) 
        : DEFAULT_MAINTENANCE;

      this._featuresCache = featuresStr 
        ? JSON.parse(featuresStr) 
        : DEFAULT_FEATURES;

      console.log('[RemoteConfig] Loaded from cache');
    } catch (error) {
      console.error('[RemoteConfig] Cache load error:', error);
      this._maintenanceCache = DEFAULT_MAINTENANCE;
      this._featuresCache = DEFAULT_FEATURES;
    }
  }

  /**
   * Setup AppState listener for background/foreground transitions
   */
  static _setupAppStateListener() {
    if (this._appStateSubscription) {
      return;
    }

    this._appStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('[RemoteConfig] App became active');
        
        const now = Date.now();
        const elapsed = now - this._lastFetchTime;
        const interval = ISUAT ? FETCH_INTERVAL_DEV : FETCH_INTERVAL_PROD;

        // Fetch if interval elapsed
        if (elapsed > interval || ISUAT) {
          console.log('[RemoteConfig] Fetching on foreground (elapsed:', Math.round(elapsed / 1000), 's)');
          await this.fetchAndActivate();
        } else {
          console.log('[RemoteConfig] Skipping fetch (next in:', Math.round((interval - elapsed) / 1000), 's)');
        }
      }
    });

    console.log('[RemoteConfig] AppState listener setup');
  }

  /**
   * Fetch config in background (non-blocking)
   */
  static _fetchInBackground() {
    setTimeout(async () => {
      try {
        await this.fetchAndActivate();
      } catch (error) {
        console.log('[RemoteConfig] Background fetch failed:', error.message);
      }
    }, 1000); // Small delay to avoid blocking initialization
  }

  /**
   * Fetch and activate Remote Config
   * @param {boolean} force - Force fetch regardless of interval
   */
  static async fetchAndActivate(force = false) {
    if (this._isFetching) {
      console.log('[RemoteConfig] Fetch already in progress');
      return;
    }

    this._isFetching = true;

    try {
      console.log('[RemoteConfig] Fetching...', force ? '(forced)' : '');

      // Fetch with timeout
      await remoteConfig().fetch(0);
      
      // Activate
      await remoteConfig().activate();

      console.log('[RemoteConfig] Config activated, processing values...');

      // Parse maintenance config
      const maintenanceJson = remoteConfig().getValue(CONFIG_KEY_MAINTENANCE).asString();
      let parsedMaintenance = {};
      
      try {
        parsedMaintenance = JSON.parse(maintenanceJson);
        // Handle nested structure (dev_config contains maintenance_configuration)
        if (parsedMaintenance.maintenance_configuration) {
          parsedMaintenance = parsedMaintenance.maintenance_configuration;
        }
      } catch (e) {
        console.warn('[RemoteConfig] Failed to parse maintenance config:', e.message);
        parsedMaintenance = this._maintenanceCache || DEFAULT_MAINTENANCE;
      }

      // Parse feature flags
      const featuresJson = remoteConfig().getValue(CONFIG_KEY_FEATURES).asString();
      let parsedFeatures = {};
      
      try {
        parsedFeatures = JSON.parse(featuresJson);
      } catch (e) {
        console.warn('[RemoteConfig] Failed to parse feature flags:', e.message);
        parsedFeatures = this._featuresCache || DEFAULT_FEATURES;
      }

      // Check for changes
      const maintenanceChanged = JSON.stringify(this._maintenanceCache) !== JSON.stringify(parsedMaintenance);
      const featuresChanged = JSON.stringify(this._featuresCache) !== JSON.stringify(parsedFeatures);

      // Update caches
      this._maintenanceCache = parsedMaintenance;
      this._featuresCache = parsedFeatures;
      this._lastFetchTime = Date.now();

      // Save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(CACHE_KEY_MAINTENANCE, JSON.stringify(parsedMaintenance)),
        AsyncStorage.setItem(CACHE_KEY_FEATURES, JSON.stringify(parsedFeatures)),
        AsyncStorage.setItem(CACHE_KEY_LAST_FETCH, this._lastFetchTime.toString())
      ]);

      console.log('[RemoteConfig] Maintenance changed:', maintenanceChanged, '| Features changed:', featuresChanged);

      // ALWAYS notify subscribers so they have latest values
      console.log('[RemoteConfig] Notifying all subscribers');
      this._notifyMaintenanceSubscribers();
      this._notifyFeatureSubscribers();

      return { maintenanceChanged, featuresChanged };

    } catch (error) {
      console.warn('[RemoteConfig] Fetch failed:', error.message);
      
      // Even on error, notify with cached values
      if (this._maintenanceCache) {
        this._notifyMaintenanceSubscribers();
      }
      if (this._featuresCache) {
        this._notifyFeatureSubscribers();
      }
      
      return { maintenanceChanged: false, featuresChanged: false };
    } finally {
      this._isFetching = false;
    }
  }

  /**
   * Get maintenance configuration
   */
  static getMaintenanceConfig() {
    return this._maintenanceCache || DEFAULT_MAINTENANCE;
  }

  /**
   * Get feature flag value by path (e.g., 'dashboard.pending_activation.show_sparklight_mobile_section')
   */
  static getFeatureFlag(path, defaultValue = false) {
    if (!this._featuresCache) {
      return defaultValue;
    }

    try {
      const keys = path.split('.');
      let value = this._featuresCache;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) {
          return defaultValue;
        }
      }

      return value ?? defaultValue;
    } catch (error) {
      console.error('[RemoteConfig] Error reading feature flag:', path, error);
      return defaultValue;
    }
  }

  /**
   * Subscribe to maintenance config changes
   */
  static subscribeToMaintenance(callback) {
    this._maintenanceSubscribers.add(callback);
    return () => this._maintenanceSubscribers.delete(callback);
  }

  /**
   * Subscribe to feature flag changes
   */
  static subscribeToFeatures(callback) {
    this._featureSubscribers.add(callback);
    return () => this._featureSubscribers.delete(callback);
  }

  /**
   * Notify maintenance subscribers
   */
  static _notifyMaintenanceSubscribers() {
    this._maintenanceSubscribers.forEach(callback => {
      try {
        callback(this._maintenanceCache);
      } catch (error) {
        console.error('[RemoteConfig] Maintenance subscriber error:', error);
      }
    });
  }

  /**
   * Notify feature subscribers
   */
  static _notifyFeatureSubscribers() {
    this._featureSubscribers.forEach(callback => {
      try {
        callback(this._featuresCache);
      } catch (error) {
        console.error('[RemoteConfig] Feature subscriber error:', error);
      }
    });
  }

  /**
   * Force refresh (for pull-to-refresh)
   */
  static async refresh() {
    console.log('[RemoteConfig] Manual refresh triggered');
    return await this.fetchAndActivate(true);
  }

  /**
   * Cleanup (called on app unmount)
   */
  static cleanup() {
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
      this._appStateSubscription = null;
    }
    this._maintenanceSubscribers.clear();
    this._featureSubscribers.clear();
    console.log('[RemoteConfig] Cleaned up');
  }

  /**
   * Get feature announcements configuration
   * @returns {Object} Feature announcements config
   */
  static getFeatureAnnouncements() {
    const announcements = this.getFeatureFlag('feature_announcements', {
      campaigns: []
    });
    return announcements;
  }

  /**
   * Get specific announcement campaign by ID
   * @param {string} campaignId - Campaign identifier
   * @returns {Object|null} Campaign config or null
   */
  static getAnnouncementCampaign(campaignId) {
    const announcements = this.getFeatureAnnouncements();
    const campaigns = announcements?.campaigns || [];
    return campaigns.find(c => c.id === campaignId) || null;
  }
}

export default RemoteConfigManager;