// All business logic centralized in utility file
export class DisconnectUtils {
  
  // Business rule: Should we call GetDisconnectOrderSnapshot API?
  static shouldCallSnapshotAPI(acctStatus, daysSinceDisconnectDate) {
    // Normal accounts - always call
    if (acctStatus === "Normal") {
      return true;
    }
    
    // Disconnected accounts - only call if ≤ 90 days or null
    const disconnectedStatuses = ["Voluntary Disc", "Non-Pay Disc", "Charged Off", "Disc"];
    if (disconnectedStatuses.includes(acctStatus)) {
      return daysSinceDisconnectDate <= 90 || daysSinceDisconnectDate === null;
    }
    
    return false;
  }

  // Business rule: Should we block login access?
  static shouldBlockLogin(acctStatus, daysSinceDisconnectDate) {
    const disconnectedStatuses = ["Voluntary Disc", "Non-Pay Disc", "Charged Off", "Disc"];
    console.log("[DISCONNECT_UTILS] Checking if login should be blocked", acctStatus, daysSinceDisconnectDate);
    // Block if disconnected for more than 90 days
    if (disconnectedStatuses.includes(acctStatus) && daysSinceDisconnectDate > 90) {
      return true;
    }
    
    return false;
  }

  // Business rule: Should show DisconnectedBanner on dashboard?
  static shouldShowDisconnectedBanner(acctStatus, daysSinceDisconnectDate, disconnectSnapshot) {
    // Normal account + In Snapshot Table -> Show banner
    if (acctStatus === "Normal" && disconnectSnapshot) {
      return true;
    }
    
    // Disconnected account (≤90 days or null) + Any snapshot status -> Show banner
    const disconnectedStatuses = ["Voluntary Disc", "Non-Pay Disc", "Charged Off", "Disc"];
    if (disconnectedStatuses.includes(acctStatus)) {
      const withinTimeLimit = daysSinceDisconnectDate <= 90 || daysSinceDisconnectDate === null;
      return withinTimeLimit;
    }
    
    return false;
  }

  // Business rule: Get "Manage My Service" configuration
  static getManageServiceConfig(acctStatus, daysSinceDisconnectDate, disconnectSnapshot, hasHsdService = false) {
    const isInSnapshot = !!disconnectSnapshot;
    
    // Case 1: Normal + In Snapshot → Reconnect Message + Confirm Cancel link
    if (acctStatus === "Normal" && isInSnapshot) {
      return {
        messageType: 'RECONNECT',
        linkType: 'CONFIRM_CANCEL',
        showLink: true
      };
    }
    
    // Case 2: Normal + Not In Snapshot → Change Service Message + Cancel Link
    if (acctStatus === "Normal" && !isInSnapshot) {
      return {
        messageType: 'CHANGE_SERVICE',
        linkType: 'CANCEL',
        showLink: hasHsdService
      };
    }
    
    // Cases 3 & 4: Disconnected accounts
    const disconnectedStatuses = ["Voluntary Disc", "Non-Pay Disc", "Charged Off", "Disc"];
    if (disconnectedStatuses.includes(acctStatus)) {
      const withinTimeLimit = daysSinceDisconnectDate <= 90 || daysSinceDisconnectDate === null;
      
      if (withinTimeLimit && isInSnapshot) {
        // Case 3: Disconnected + In Snapshot → Reconnect Message + Confirm Cancel link
        return {
          messageType: 'RECONNECT',
          linkType: 'CONFIRM_CANCEL',
          showLink: true
        };
      }
      
      if (withinTimeLimit && !isInSnapshot) {
        // Case 4: Disconnected + Not In Snapshot → Reconnect Message Only
        return {
          messageType: 'RECONNECT',
          linkType: 'NONE',
          showLink: false
        };
      }
    }
    
    // Fallback
    return {
      messageType: 'CHANGE_SERVICE',
      linkType: 'CANCEL',
      showLink: hasHsdService
    };
  }
}