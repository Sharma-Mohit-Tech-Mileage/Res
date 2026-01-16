import React, { createContext, useState, useCallback, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AnnouncementModal from '../components/feature/AnnouncementModal';
import AnnouncementPersistence from '../manager/AnnouncementPersistence';
import {
  trackAnnouncementImpression,
  trackAnnouncementCompletion,
  trackAnnouncementDismissal,
  navigateToDestination,
} from '../utils/announcementHelpers';

const AnnouncementContext = createContext(null);

export const AnnouncementProvider = ({ children }) => {
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const navigationRef = useRef(navigation);

  React.useEffect(() => {
    navigationRef.current = navigation;
  }, [navigation]);

  const showAnnouncement = useCallback(async (campaign, triggerType) => {
    if (!campaign) return;

    console.log(`[AnnouncementContext] Showing announcement: ${campaign.id}`);

    await AnnouncementPersistence.markAsShown(campaign.id);
    trackAnnouncementImpression(campaign.id, triggerType);

    setActiveCampaign(campaign);
    setShowModal(true);
  }, []);

  const handleComplete = useCallback(async (timeSpentSeconds) => {
    if (!activeCampaign) return;

    console.log(`[AnnouncementContext] Completing announcement: ${activeCampaign.id}`);

    await AnnouncementPersistence.markAsCompleted(activeCampaign.id);

    const totalSteps = activeCampaign.content?.steps?.length || 0;
    trackAnnouncementCompletion(
      activeCampaign.id,
      totalSteps,
      timeSpentSeconds
    );

    if (activeCampaign.navigation?.onComplete) {
      navigateToDestination(
        activeCampaign.navigation.onComplete,
        navigationRef
      );
    }

    setShowModal(false);
    
    setTimeout(() => {
      setActiveCampaign(null);
    }, 300);
  }, [activeCampaign]);

  const handleDismiss = useCallback(async (dismissedAtStep) => {
    if (!activeCampaign) return;

    console.log(`[AnnouncementContext] Dismissing announcement: ${activeCampaign.id} at step ${dismissedAtStep}`);

    await AnnouncementPersistence.markAsDismissed(activeCampaign.id, dismissedAtStep);
    trackAnnouncementDismissal(activeCampaign.id, dismissedAtStep);

    setShowModal(false);
    
    setTimeout(() => {
      setActiveCampaign(null);
    }, 300);
  }, [activeCampaign]);

  const value = {
    activeCampaign,
    showModal,
    showAnnouncement,
    setActiveCampaign,
    setShowModal,
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}

      <AnnouncementModal
        visible={showModal}
        campaign={activeCampaign}
        onComplete={handleComplete}
        onDismiss={handleDismiss}
      />
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncementContext = () => {
  const context = useContext(AnnouncementContext);
  
  if (!context) {
    throw new Error('useAnnouncementContext must be used within AnnouncementProvider');
  }
  
  return context;
};

export default AnnouncementContext;