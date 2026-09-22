import { getRemoteConfig, setDefaults, setConfigSettings, fetch as fetchRemoteConfig, activate, getValue } from '@react-native-firebase/remote-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import Config from 'react-native-config';

const CACHE_KEY_MAINTENANCE = 'maintenance_config_cache';
const CACHE_KEY_FEATURES = 'feature_flags_cache';
const CACHE_KEY_LAST_FETCH = 'remote_config_last_fetch';

const CONFIG_KEY_MAINTENANCE = Config.REMOTE_CONFIG_MAINTENANCE_KEY;
const CONFIG_KEY_FEATURES = Config.REMOTE_CONFIG_FEATURES_KEY;
const FETCH_INTERVAL_MS = parseInt(Config.REMOTE_CONFIG_FETCH_INTERVAL_MS, 10);

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
  },
  // 52452: lets internal users keep using the app while maintenance blocks everyone else.
  // Entirely Remote Config driven - set enabled:false to switch every bypass off at once.
  internalAccess: {
    enabled: false,
    bypassCode: "",
  }
};

const DEFAULT_FEATURES = {
  dashboard: {
    all_users: {
      chat_icon: true,
    },
    pending_activation: {
      show_sparklight_mobile_section: true
    }
  },
  tabs: {
    services: { visible: false },
    billing: { hidden: false }
  },
  payments: {
    surcharge_rate: 3,
  },
};

class RemoteConfigManager {
  static _instance = null;
  static _initialized = false;
  static _isFetching = false;
  static _lastFetchTime = 0;
  static _appStateSubscription = null;

  static _maintenanceCache = null;
  static _featuresCache = null;

  static _maintenanceSubscribers = new Set();
  static _featureSubscribers = new Set();

  static getInstance() {
    if (!this._instance) {
      this._instance = new RemoteConfigManager();
    }
    return this._instance;
  }

  static async initialize() {
    if (this._initialized) {
      return;
    }

    try {
      await this._loadFromCache();

      const rc = getRemoteConfig();
      await setDefaults(rc, {
        [CONFIG_KEY_MAINTENANCE]: JSON.stringify(DEFAULT_MAINTENANCE),
        [CONFIG_KEY_FEATURES]: JSON.stringify(DEFAULT_FEATURES)
      });

      await setConfigSettings(rc, {
        minimumFetchIntervalMillis: FETCH_INTERVAL_MS
      });

      const lastFetchStr = await AsyncStorage.getItem(CACHE_KEY_LAST_FETCH);
      this._lastFetchTime = lastFetchStr ? parseInt(lastFetchStr, 10) : 0;

      this._setupAppStateListener();

      this._initialized = true;

      this._notifyMaintenanceSubscribers();
      this._notifyFeatureSubscribers();

      this._fetchInBackground();
    } catch (error) {
      console.warn('[RemoteConfig] Initialization error:', error);
      this._maintenanceCache = DEFAULT_MAINTENANCE;
      this._featuresCache = DEFAULT_FEATURES;
      this._initialized = true;
    }
  }

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
    } catch (error) {
      console.warn('[RemoteConfig] Cache load error:', error);
      this._maintenanceCache = DEFAULT_MAINTENANCE;
      this._featuresCache = DEFAULT_FEATURES;
    }
  }

  static _setupAppStateListener() {
    if (this._appStateSubscription) {
      return;
    }

    this._appStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const now = Date.now();
        const elapsed = now - this._lastFetchTime;

        if (elapsed > FETCH_INTERVAL_MS) {
          await this.fetchAndActivate();
        }
      }
    });
  }

  static _fetchInBackground() {
    setTimeout(async () => {
      try {
        await this.fetchAndActivate();
      } catch (error) {
        console.warn('[RemoteConfig] Background fetch failed:', error.message);
      }
    }, 1000);
  }

  static async fetchAndActivate(force = false) {
    if (this._isFetching) {
      return;
    }

    this._isFetching = true;

    try {
      const rc = getRemoteConfig();
      await fetchRemoteConfig(rc, 0);
      await activate(rc);

      const maintenanceJson = getValue(rc, CONFIG_KEY_MAINTENANCE).asString();
      let parsedMaintenance = {};

      try {
        parsedMaintenance = JSON.parse(maintenanceJson);
        // dev_config wraps maintenance_configuration; unwrap it
        if (parsedMaintenance.maintenance_configuration) {
          parsedMaintenance = parsedMaintenance.maintenance_configuration;
        }      } catch (e) {
        console.warn('[RemoteConfig] Failed to parse maintenance config:', e.message);
        parsedMaintenance = this._maintenanceCache || DEFAULT_MAINTENANCE;
      }

      const featuresJson = getValue(rc, CONFIG_KEY_FEATURES).asString();
      let parsedFeatures = {};

      try {
        parsedFeatures = JSON.parse(featuresJson);
      } catch (e) {
        console.warn('[RemoteConfig] Failed to parse feature flags:', e.message);
        parsedFeatures = this._featuresCache || DEFAULT_FEATURES;
      }

      const maintenanceChanged = JSON.stringify(this._maintenanceCache) !== JSON.stringify(parsedMaintenance);
      const featuresChanged = JSON.stringify(this._featuresCache) !== JSON.stringify(parsedFeatures);

      this._maintenanceCache = parsedMaintenance;
      this._featuresCache = parsedFeatures;
      this._lastFetchTime = Date.now();

      await Promise.all([
        AsyncStorage.setItem(CACHE_KEY_MAINTENANCE, JSON.stringify(parsedMaintenance)),
        AsyncStorage.setItem(CACHE_KEY_FEATURES, JSON.stringify(parsedFeatures)),
        AsyncStorage.setItem(CACHE_KEY_LAST_FETCH, this._lastFetchTime.toString())
      ]);

      // Notify only on actual change so a refresh that returns identical config doesn't churn version/re-renders.
      if (maintenanceChanged) {
        this._notifyMaintenanceSubscribers();
      }
      if (featuresChanged) {
        this._notifyFeatureSubscribers();
      }

      return { maintenanceChanged, featuresChanged };

    } catch (error) {
      console.warn('[RemoteConfig] Fetch failed:', error.message);

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

  static getMaintenanceConfig() {
    return this._maintenanceCache || DEFAULT_MAINTENANCE;
  }

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
      console.warn('[RemoteConfig] Error reading feature flag:', path, error);
      return defaultValue;
    }
  }

  static subscribeToMaintenance(callback) {
    this._maintenanceSubscribers.add(callback);
    return () => this._maintenanceSubscribers.delete(callback);
  }

  static subscribeToFeatures(callback) {
    this._featureSubscribers.add(callback);
    return () => this._featureSubscribers.delete(callback);
  }

  static _notifyMaintenanceSubscribers() {
    this._maintenanceSubscribers.forEach(callback => {
      try {
        callback(this._maintenanceCache);
      } catch (error) {
        console.warn('[RemoteConfig] Maintenance subscriber error:', error);
      }
    });
  }

  static _notifyFeatureSubscribers() {
    this._featureSubscribers.forEach(callback => {
      try {
        callback(this._featuresCache);
      } catch (error) {
        console.warn('[RemoteConfig] Feature subscriber error:', error);
      }
    });
  }

  static async refresh() {
    return await this.fetchAndActivate(true);
  }

  static cleanup() {
    if (this._appStateSubscription) {
      this._appStateSubscription.remove();
      this._appStateSubscription = null;
    }
    this._maintenanceSubscribers.clear();
    this._featureSubscribers.clear();
  }

  static getFeatureAnnouncements() {
    const announcements = this.getFeatureFlag('feature_announcements', {
      campaigns: []
    });
    return announcements;
  }

  static getAnnouncementCampaign(campaignId) {
    const announcements = this.getFeatureAnnouncements();
    const campaigns = announcements?.campaigns || [];
    return campaigns.find(c => c.id === campaignId) || null;
  }
}

export default RemoteConfigManager;
