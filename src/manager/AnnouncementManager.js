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
      
      console.log(`[AnnouncementManager] Loaded ${campaigns.length} campaigns from Remote Config`);
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
      console.log(`[AnnouncementManager] Campaign ${campaignId} already completed`);
      return false;
    }

    const dismissed = await AnnouncementPersistence.hasBeenDismissed(campaignId);
    if (dismissed) {
      console.log(`[AnnouncementManager] Campaign ${campaignId} already dismissed`);
      return false;
    }

    if (campaign.trigger?.type === 'screen_entry' && 
        campaign.trigger?.showOnFirstVisitOnly) {
      const shown = await AnnouncementPersistence.hasBeenShown(campaignId);
      if (shown) {
        console.log(`[AnnouncementManager] Campaign ${campaignId} already shown (first visit only)`);
        return false;
      }
    }

    if (campaign.trigger?.type === 'app_launch' && 
        campaign.trigger?.showAfterUpgrade) {
      const mobileTCAcceptanceFlag = userInfo?.mobileTCAcceptanceFlag || false;
      const versionChanged = await AnnouncementPersistence.hasAppVersionChanged(mobileTCAcceptanceFlag);
      if (!versionChanged) {
        console.log(`[AnnouncementManager] Campaign ${campaignId} requires version change`);
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
      console.log(`[AnnouncementManager] Checking for ${triggerType} campaigns${screenName ? ` on ${screenName}` : ''}`);

      const allCampaigns = this.getAllCampaigns();
      if (allCampaigns.length === 0) {
        console.log('[AnnouncementManager] No campaigns found in Remote Config');
        return null;
      }

      const triggeredCampaigns = this.filterByTrigger(allCampaigns, triggerType, screenName);
      console.log(`[AnnouncementManager] Found ${triggeredCampaigns.length} campaigns matching trigger`);

      if (triggeredCampaigns.length === 0) {
        return null;
      }

      const currentVersion = AnnouncementPersistence.getCurrentAppVersion();
      const eligibleCampaigns = [];

      for (const campaign of triggeredCampaigns) {
        if (!isCampaignEligible(campaign, userInfo, currentVersion)) {
          console.log(`[AnnouncementManager] Campaign ${campaign.id} not eligible (targeting)`);
          continue;
        }

        if (!(await this.shouldShowCampaign(campaign, userInfo))) {
          console.log(`[AnnouncementManager] Campaign ${campaign.id} not eligible (persistence)`);
          continue;
        }

        eligibleCampaigns.push(campaign);
      }

      console.log(`[AnnouncementManager] Found ${eligibleCampaigns.length} eligible campaigns`);

      if (eligibleCampaigns.length === 0) {
        return null;
      }

      const sortedCampaigns = this.sortByPriority(eligibleCampaigns);
      const selectedCampaign = sortedCampaigns[0];

      console.log(`[AnnouncementManager] Selected campaign: ${selectedCampaign.id} (priority: ${selectedCampaign.priority || 'none'})`);
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
    console.log(`[AnnouncementManager] Reset campaign: ${campaignId}`);
  }

  static async resetAllCampaigns() {
    await AnnouncementPersistence.clearAllStates();
    console.log('[AnnouncementManager] Reset all campaigns');
  }
}

export default AnnouncementManager;