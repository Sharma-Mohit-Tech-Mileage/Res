import React from 'react';
import { View } from 'react-native';
import { useMaintenance } from './MaintenanceContext';
import MaintenancePage from './MaintenancePage';
import MaintenanceBanner from './MaintenanceBanner';

/**
 * MaintenanceWrapper Component
 * 
 * This component handles conditional rendering based on maintenance state
 */
const MaintenanceWrapper = ({ children }) => {
  const { 
    showBanner, 
    showMaintenancePage, 
    bannerConfig, 
    pageConfig, 
    dismissBanner
  } = useMaintenance();
  
  // If maintenance page should be shown, return only the maintenance page
  if (showMaintenancePage && pageConfig) {
    return (
      <MaintenancePage
        title={pageConfig.title}
        message={pageConfig.message}
        estimatedTime={pageConfig.estimatedTime}
        contactInfo={pageConfig.contactInfo}
      />
    );
  }
  
  // Otherwise, show regular content with optional banner
  return (
    <View style={{ flex: 1 }}>
      {showBanner && bannerConfig && (
        <MaintenanceBanner
          title={bannerConfig.title}
          message={bannerConfig.message}
          link={bannerConfig.link}
          linkText={bannerConfig.linkText}
          phoneNumber={bannerConfig.phoneNumber}
          onDismiss={bannerConfig.dismissible ? dismissBanner : undefined}
          severity={bannerConfig.severity || 'info'}
        />
      )}
      {children}
    </View>
  );
};

export default MaintenanceWrapper;