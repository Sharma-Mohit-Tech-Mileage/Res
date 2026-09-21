import React from 'react';
import { View } from 'react-native';
import { useMaintenance } from './MaintenanceContext';
import MaintenancePage from './MaintenancePage';

const MaintenanceWrapper = ({ children }) => {
  const { 
    showMaintenancePage,
    internalAccessConfig,
    submitBypassCode,
    pageConfig, 
    blockingState, 
    clearBlockingState
  } = useMaintenance();
  
  
  if (showMaintenancePage && (pageConfig || blockingState.wasBlocked)) {
    
    const activeConfig =  pageConfig;
    const isCurrentlyBlocking = blockingState.wasBlocked;
    
    return (
      <MaintenancePage
        internalAccessConfig={internalAccessConfig}
        submitBypassCode={submitBypassCode}
        title={activeConfig?.title || "System Maintenance in Progress"}
        message={activeConfig?.message || "We're updating our systems to serve you better."}
        estimatedTime={activeConfig?.estimatedTime}
        contactInfo={activeConfig?.contactInfo}
         contactLink={activeConfig?.contactLink} 
        showLoginButton={activeConfig?.showLoginButton} 
        isBlockingUser={isCurrentlyBlocking} 
        pageType={activeConfig?.type || "NORMAL"}  
        onClearBlocking={clearBlockingState} 
        blockingInfo={{
          blockingTimestamp: blockingState.blockingTimestamp,
          wasBlocked: blockingState.wasBlocked
        }}
      />
    );
  }
  
  return <View style={{ flex: 1 }}>{children}</View>;
};

export default MaintenanceWrapper;