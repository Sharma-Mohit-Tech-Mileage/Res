import RemoteConfigManager from '../config/Remoteconfigmanager';
import AnnouncementPersistence from './AnnouncementPersistence';
import {
  isCampaignEligible,
  compareVersions,
} from '../utils/announcementHelpers';

class AnnouncementManager {
  static getAllCampaigns() {
    try {
      const announcements = RemoteConfigManager.getFeatureAnnouncements();
      const campaigns = announcements?.campaigns || [];
      return campaigns;
    } catch (error) {
      console.error('[AnnouncementManager] Error loading campaigns:', error);
      return [];
    }
  }

  static filterByTrigger(campaigns, triggerType, screenName = null) {
    return campaigns.filter(campaign => {
      const trigger = campaign.trigger;

      if (!trigger || trigger.type !== triggerType) {
        return false;
      }

      if (triggerType === 'screen_entry') {
        return trigger.screenName === screenName;
      }

      if (triggerType === 'app_launch') {
        return true;
      }

      return false;
    });
  }

  static async shouldShowCampaign(campaign, userInfo = {}) {
    const campaignId = campaign.id;
    const completed = await AnnouncementPersistence.hasBeenCompleted(campaignId);
    if (completed) {
      return false;
    }

    const dismissed = await AnnouncementPersistence.hasBeenDismissed(campaignId);
    if (dismissed) {
      const showOnFirstVisitOnly = campaign.trigger?.showOnFirstVisitOnly;
      if (showOnFirstVisitOnly !== false) {
        return false;
      }
    }

    if (campaign.trigger?.type === 'screen_entry' &&
        campaign.trigger?.showOnFirstVisitOnly) {
      const shown = await AnnouncementPersistence.hasBeenShown(campaignId);
      if (shown) {
        return false;
      }
    }

    if (campaign.trigger?.type === 'app_launch' &&
        campaign.trigger?.showAfterUpgrade) {
      const mobileTCAcceptanceFlag = userInfo?.mobileTCAcceptanceFlag || false;
      const versionChanged = await AnnouncementPersistence.hasAppVersionChanged(mobileTCAcceptanceFlag);
      if (!versionChanged) {
        return false;
      }
    }

    return true;
  }

  static sortByPriority(campaigns) {
    return campaigns.sort((a, b) => {
      const priorityA = a.priority || 999;
      const priorityB = b.priority || 999;
      return priorityA - priorityB;
    });
  }

  static async getEligibleCampaign(triggerType, screenName = null, userInfo = {}) {
    try {
      const allCampaigns = this.getAllCampaigns();
      if (allCampaigns.length === 0) {
        return null;
      }

      const triggeredCampaigns = this.filterByTrigger(allCampaigns, triggerType, screenName);

      if (triggeredCampaigns.length === 0) {
        return null;
      }

      const currentVersion = AnnouncementPersistence.getCurrentAppVersion();
      const eligibleCampaigns = [];

      for (const campaign of triggeredCampaigns) {
        if (!isCampaignEligible(campaign, userInfo, currentVersion)) {
          continue;
        }

        if (!(await this.shouldShowCampaign(campaign, userInfo))) {
          continue;
        }

        eligibleCampaigns.push(campaign);
      }

      if (eligibleCampaigns.length === 0) {
        return null;
      }

      const sortedCampaigns = this.sortByPriority(eligibleCampaigns);
      const selectedCampaign = sortedCampaigns[0];

      return selectedCampaign;

    } catch (error) {
      console.error('[AnnouncementManager] Error getting eligible campaign:', error);
      return null;
    }
  }

  static getCampaignById(campaignId) {
    const allCampaigns = this.getAllCampaigns();
    return allCampaigns.find(c => c.id === campaignId) || null;
  }

  static isCampaignEnabled(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    return campaign?.enabled === true;
  }

  static async resetCampaign(campaignId) {
    await AnnouncementPersistence.clearCampaignState(campaignId);
  }

  static async resetAllCampaigns() {
    await AnnouncementPersistence.clearAllStates();
  }
}

export default AnnouncementManager;
