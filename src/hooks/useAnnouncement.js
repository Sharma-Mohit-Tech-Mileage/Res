import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAnnouncementContext } from '../contexts/AnnouncementContext';
import AnnouncementManager from '../manager/AnnouncementManager';

export const useAnnouncement = () => {
  const { showAnnouncement } = useAnnouncementContext();
  
  const userInfo = useSelector((state) => state.user?.userData?.userInfo);

  const triggerOnScreenEntry = useCallback(async (screenName) => {
    try {
      console.log(`[useAnnouncement] Checking for screen_entry announcements on ${screenName}`);

      const campaign = await AnnouncementManager.getEligibleCampaign(
        'screen_entry',
        screenName,
        userInfo
      );

      if (campaign) {
        console.log(`[useAnnouncement] Found eligible campaign: ${campaign.id}`);
        await showAnnouncement(campaign, 'screen_entry');
      } else {
        console.log(`[useAnnouncement] No eligible campaigns for ${screenName}`);
      }
    } catch (error) {
      console.error('[useAnnouncement] Error triggering screen entry:', error);
    }
  }, [showAnnouncement, userInfo]);

  const triggerOnAppLaunch = useCallback(async () => {
    try {
      console.log('[useAnnouncement] Checking for app_launch announcements');

      const campaign = await AnnouncementManager.getEligibleCampaign(
        'app_launch',
        null,
        userInfo
      );

      if (campaign) {
        console.log(`[useAnnouncement] Found eligible campaign: ${campaign.id}`);
        await showAnnouncement(campaign, 'app_launch');
      } else {
        console.log('[useAnnouncement] No eligible campaigns for app_launch');
      }
    } catch (error) {
      console.error('[useAnnouncement] Error triggering app launch:', error);
    }
  }, [showAnnouncement, userInfo]);

  const triggerCampaign = useCallback(async (campaignId) => {
    try {
      console.log(`[useAnnouncement] Manually triggering campaign: ${campaignId}`);

      const campaign = AnnouncementManager.getCampaignById(campaignId);

      if (campaign) {
        await showAnnouncement(campaign, 'manual');
      } else {
        console.warn(`[useAnnouncement] Campaign not found: ${campaignId}`);
      }
    } catch (error) {
      console.error('[useAnnouncement] Error triggering campaign:', error);
    }
  }, [showAnnouncement]);

  const resetCampaign = useCallback(async (campaignId) => {
    await AnnouncementManager.resetCampaign(campaignId);
  }, []);

  const resetAllCampaigns = useCallback(async () => {
    await AnnouncementManager.resetAllCampaigns();
  }, []);

  return {
    triggerOnScreenEntry,
    triggerOnAppLaunch,
    triggerCampaign,
    resetCampaign,
    resetAllCampaigns,
  };
};

export default useAnnouncement;