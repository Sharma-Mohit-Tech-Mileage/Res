import { DisconnectUtils } from '../../components/utility/disconnectUtils';

export const getUserDisconnectInfo = (state) => {
    const userInfo = state.combinedReducers.user.userData.userInfo;
    console.log("[GET_USER_DISCONNECT_INFO] Found userInfo:", userInfo);
    
    if (!userInfo) return null;
    
    return {
        accountNumber: userInfo.accountNumber,
        acctStatus: userInfo.acctStatus,
        daysSinceDisconnectDate: userInfo.daysSinceDisconnectDate
    };
};
export const shouldShowDisconnectedBanner = (state) => {
    const userInfo = getUserDisconnectInfo(state);
    const snapshot = getDisconnectSnapshot(state);
    
    if (!userInfo) {
        return false;
    }
    
    return DisconnectUtils.shouldShowDisconnectedBanner(
        userInfo.acctStatus, 
        userInfo.daysSinceDisconnectDate, 
        snapshot
    );
};


// Selector to get disconnect snapshot data
export const getDisconnectSnapshot = (state) => {
    const snapshot = state.combinedReducers.profile;
    console.log("[GET_DISCONNECT_SNAPSHOT] Found snapshot:", snapshot);
    return snapshot;
};

export const getDashboardConfig = (state) => {
    const userInfo = getUserDisconnectInfo(state);
    const snapshot = getDisconnectSnapshot(state);
    
    console.log("[GET_DASHBOARD_CONFIG] User Info:", userInfo);
    console.log("[GET_DASHBOARD_CONFIG] Disconnect Snapshot:", snapshot);
    
    if (!userInfo) {
        return { showDisconnectedBanner: false, showWelcomeCard: true };
    }
    
    const shouldShow = DisconnectUtils.shouldShowDisconnectedBanner(
        userInfo.acctStatus, 
        userInfo.daysSinceDisconnectDate, 
        snapshot
    );
    
    return {
        showDisconnectedBanner: shouldShow,
        showWelcomeCard: !shouldShow
    };
};

export const getManageServiceConfig = (state) => {
    const userInfo = getUserDisconnectInfo(state);
    const snapshot = getDisconnectSnapshot(state);
    const accountDetails = state.combinedReducers.profile?.accountDetails;
    
    if (!userInfo) {
        return {
            messageType: 'CHANGE_SERVICE',
            linkType: 'CANCEL', 
            showLink: false
        };
    }
    
    const hasHsdService = accountDetails?.services?.hsd || false;
    
    return DisconnectUtils.getManageServiceConfig(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate,
        snapshot,
        hasHsdService
    );
};

export const shouldTriggerDisconnectCheck = (state) => {
    const userInfo = getUserDisconnectInfo(state);
    if (!userInfo) return false;
    
    return DisconnectUtils.shouldCallSnapshotAPI(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate
    );
};

export const createDisconnectCheckPayload = (userInfo) => {
    if (!userInfo) return null;
    
    return {
        accountNumber: userInfo.accountNumber,
        acctStatus: userInfo.acctStatus,
        daysSinceDisconnectDate: userInfo.daysSinceDisconnectDate
    };
};

// Helper to check if login should be blocked (for SplashScreen)
export const shouldBlockUserLogin = (userInfo) => {
    if (!userInfo) return false;
    
    return DisconnectUtils.shouldBlockLogin(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate
    );
};

// Helper to get block message for UI
export const getLoginBlockMessage = () => {
    return "Access Denied - Account has been disconnected for more than 90 days.";
};