import React from 'react';
import { View } from 'react-native';
import { useMaintenance } from './MaintenanceContext';
import MaintenancePage from './MaintenancePage';

const MaintenanceWrapper = ({ children }) => {
  const { showMaintenancePage, pageConfig, isBlockingUser } = useMaintenance();
  
  console.log('🔧 🎁 MaintenanceWrapper render:', {
    showMaintenancePage,
    hasPageConfig: !!pageConfig,
    isBlockingUser,
    pageType: pageConfig?.type
  });
  
  // If maintenance page should be shown, return only the maintenance page
  if (showMaintenancePage && pageConfig) {
    console.log('🔧 🎁 Showing maintenance page with type:', pageConfig.type);
    return (
      <MaintenancePage
        title={pageConfig.title || "System Maintenance in Progress"}
        message={pageConfig.message || "We're updating our systems to serve you better."}
        estimatedTime={pageConfig.estimatedTime}
        contactInfo={pageConfig.contactInfo}
        showLoginButton={pageConfig.showLoginButton || isBlockingUser}
        isBlockingUser={isBlockingUser}
      />
    );
  }
  
  // Otherwise, show regular app content
  console.log('🔧 🎁 Showing regular app content');
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default MaintenanceWrapper;