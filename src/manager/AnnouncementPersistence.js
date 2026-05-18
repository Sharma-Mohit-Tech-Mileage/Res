import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { logError } from '../utils/logger';

const STORAGE_KEY = 'FEATURE_ANNOUNCEMENTS_STATE';
const VERSION_KEY = 'LAST_APP_VERSION';

class AnnouncementPersistence {
  static async getAllStates() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      logError('[AnnouncementPersistence] Error getting states:', error);
      return {};
    }
  }

  static async getCampaignState(campaignId) {
    try {
      const allStates = await this.getAllStates();
      return allStates[campaignId] || null;
    } catch (error) {
      logError(`[AnnouncementPersistence] Error getting state for ${campaignId}:`, error);
      return null;
    }
  }

  static async saveCampaignState(campaignId, state) {
    try {
      const allStates = await this.getAllStates();
      allStates[campaignId] = {
        ...allStates[campaignId],
        ...state,
        version: DeviceInfo.getVersion(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
    } catch (error) {
      logError(`[AnnouncementPersistence] Error saving state for ${campaignId}:`, error);
    }
  }

  static async hasBeenShown(campaignId) {
    const state = await this.getCampaignState(campaignId);
    return state?.shown === true;
  }

  static async hasBeenCompleted(campaignId) {
    const state = await this.getCampaignState(campaignId);
    return state?.completed === true;
  }

  static async hasBeenDismissed(campaignId) {
    const state = await this.getCampaignState(campaignId);
    return state?.dismissed === true;
  }

  static async markAsShown(campaignId) {
    await this.saveCampaignState(campaignId, {
      shown: true,
      shownAt: new Date().toISOString(),
    });
  }

  static async markAsCompleted(campaignId) {
    await this.saveCampaignState(campaignId, {
      shown: true,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }

  static async markAsDismissed(campaignId, dismissedAtStep = 0) {
    await this.saveCampaignState(campaignId, {
      shown: true,
      dismissed: true,
      dismissedAt: new Date().toISOString(),
      dismissedAtStep,
    });
  }

  static async clearCampaignState(campaignId) {
    try {
      const allStates = await this.getAllStates();
      delete allStates[campaignId];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
    } catch (error) {
      logError(`[AnnouncementPersistence] Error clearing state for ${campaignId}:`, error);
    }
  }

  static async clearAllStates() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logError('[AnnouncementPersistence] Error clearing all states:', error);
    }
  }

  static async hasAppVersionChanged(mobileTCAcceptanceFlag = false) {
    try {
      const lastVersion = await AsyncStorage.getItem(VERSION_KEY);
      const currentVersion = DeviceInfo.getVersion();

      if (!lastVersion) {
        await AsyncStorage.setItem(VERSION_KEY, currentVersion);
        return mobileTCAcceptanceFlag === true;
      }

      const versionChanged = lastVersion !== currentVersion;

      if (versionChanged) {
        await AsyncStorage.setItem(VERSION_KEY, currentVersion);
      }

      return versionChanged;
    } catch (error) {
      logError('[AnnouncementPersistence] Error checking version:', error);
      return false;
    }
  }

  static async getLastAppVersion() {
    try {
      return await AsyncStorage.getItem(VERSION_KEY);
    } catch (error) {
      logError('[AnnouncementPersistence] Error getting last version:', error);
      return null;
    }
  }

  static getCurrentAppVersion() {
    return DeviceInfo.getVersion();
  }
}

export default AnnouncementPersistence;