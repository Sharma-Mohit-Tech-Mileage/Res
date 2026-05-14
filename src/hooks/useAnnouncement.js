import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAnnouncementContext } from '../contexts/AnnouncementContext';
import AnnouncementManager from '../manager/AnnouncementManager';

export const useAnnouncement = () => {
  const { showAnnouncement } = useAnnouncementContext();
  
  const userInfo = useSelector((state) => state.user?.userData?.userInfo);

  const triggerOnScreenEntry = useCallback(async (screenName) => {
    try {

      const campaign = await AnnouncementManager.getEligibleCampaign(
        'screen_entry',
        screenName,
        userInfo
      );

      if (campaign) {
        await showAnnouncement(campaign, 'screen_entry');
      } else {
      }
    } catch (error) {
      console.warn('[useAnnouncement] Error triggering screen entry:', error);
    }
  }, [showAnnouncement, userInfo]);

  const triggerOnAppLaunch = useCallback(async () => {
    try {

      const campaign = await AnnouncementManager.getEligibleCampaign(
        'app_launch',
        null,
        userInfo
      );

      if (campaign) {
        await showAnnouncement(campaign, 'app_launch');
      } else {
      }
    } catch (error) {
      console.warn('[useAnnouncement] Error triggering app launch:', error);
    }
  }, [showAnnouncement, userInfo]);

  const triggerCampaign = useCallback(async (campaignId) => {
    try {

      const campaign = AnnouncementManager.getCampaignById(campaignId);

      if (campaign) {
        await showAnnouncement(campaign, 'manual');
      } else {
        console.warn(`[useAnnouncement] Campaign not found: ${campaignId}`);
      }
    } catch (error) {
      console.warn('[useAnnouncement] Error triggering campaign:', error);
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