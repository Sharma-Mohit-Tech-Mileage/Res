import React from 'react';
import { View } from 'react-native';
import { useMaintenance } from './MaintenanceContext';
import MaintenancePage from './MaintenancePage';

const MaintenanceWrapper = ({ children }) => {
  const { 
    showMaintenancePage, 
    pageConfig, 
    blockingState,  // 🔧 NEW: Get enhanced blocking state
    clearBlockingState  // 🔧 NEW: Get function to clear blocking state
  } = useMaintenance();
  
  console.log('🔧 🎁 MaintenanceWrapper render:', {
    showMaintenancePage,
    hasPageConfig: !!pageConfig,
    blockingState: blockingState,
    pageType: pageConfig?.type
  });
  
  // If maintenance page should be shown, return only the maintenance page
  if (showMaintenancePage && (pageConfig || blockingState.wasBlocked)) {
    console.log('🔧 🎁 Showing maintenance page with enhanced blocking features');
    
    // 🔧 NEW: Use blocking config if available, otherwise use page config
    const activeConfig =  pageConfig;
    const isCurrentlyBlocking = blockingState.wasBlocked;
    
    return (
      <MaintenancePage
        title={activeConfig?.title || "System Maintenance in Progress"}
        message={activeConfig?.message || "We're updating our systems to serve you better."}
        estimatedTime={activeConfig?.estimatedTime}
        contactInfo={activeConfig?.contactInfo}
         contactLink={activeConfig?.contactLink} 
        showLoginButton={activeConfig?.showLoginButton}  // Always show for blocked users
        isBlockingUser={isCurrentlyBlocking}                                    // Pass current blocking status
        pageType={activeConfig?.type || "NORMAL"}                              // Pass page type
        onClearBlocking={clearBlockingState}                                   // 🔧 NEW: Allow manual clear
        blockingInfo={{                                                        // 🔧 NEW: Pass blocking info
          blockedAudience: blockingState.blockedAudience,
          blockingTimestamp: blockingState.blockingTimestamp,
          wasBlocked: blockingState.wasBlocked
        }}
      />
    );
  }
  
  // Otherwise, show regular app content
  console.log('🔧 🎁 Showing regular app content');
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default MaintenanceWrapper;