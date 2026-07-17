import { getUser } from "../../redux/utils/LocalStorage";
export const NavigationUtils = {
 
  checkPushNotificationNeeded: (profile) => {
    if (!profile?.pushNotifications?.length) 
      return true;
    
    const messageTypes = profile.pushNotifications[0].pushMessageType || [];
    const optOutCount = messageTypes.filter(mt => mt.optOutFlag).length;
    
    return optOutCount == 3;
  },

  
  checkTextNotificationNeeded: (profile) => {
    if (!profile?.smsSubscription?.length) 
      return true;
    // normalize to digits so numeric or formatted values ("(555) 123-4567") still count as valid
    const digits = String(profile.smsSubscription[0].phoneNum ?? "").replace(/\D/g, "");
    return !(digits.length === 10 || digits.length === 11);
  },


 checkEmailNotificationNeeded: async (accountNumber) => {
  try {
    const user = await getUser();

    const email = user?.userInfo?.email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailExists = !!email && emailRegex.test(email);
    return !emailExists; 
  } catch (error) {
    console.warn("Error checking email:", error);
    return true; 
  }
},


  getNextScreen: async (currentScreen, profile, accountNumber) => {
    const isAdmin = profile?.profileDetails?.memberType === "Admin";
    
    const screens = {
      'Terms': ['push', 'text', 'email'],
      'EntryPushNotifications': ['text', 'email'],
      'EntryTextNotifications': ['email'],
      'EntryEmailNotifications': []
    };
    
    const checksToPerform = screens[currentScreen] || [];
    
    for (const check of checksToPerform) {
      switch (check) {
        case 'push':
          if (isAdmin) {
            const needsPush = NavigationUtils.checkPushNotificationNeeded(profile);
            if (needsPush) return 'EntryPushNotifications';
          } else {
            const needsPush = NavigationUtils.checkPushNotificationNeeded(profile);
            if (needsPush) return 'EntryPushNotifications';
          }
          break;
          
        case 'text':
          if (isAdmin) continue;
          
          const needsText = NavigationUtils.checkTextNotificationNeeded(profile);
          if (needsText) return 'EntryTextNotifications';
          break;
          
        case 'email':
          return 'EntryEmailNotifications';
          if (isAdmin) continue;
          
          const needsEmail = await NavigationUtils.checkEmailNotificationNeeded(accountNumber);
          if (needsEmail) return 'EntryEmailNotifications';
          break;
      }
    }
    
    return 'MyTab';
  },

  navigateToNext: async (navigation, currentScreen, profile, accountNumber) => {
    try {
      const nextScreen = await NavigationUtils.getNextScreen(
        currentScreen, 
        profile, 
        accountNumber
      );
      
      navigation.reset({
        index: 0,
        routes: [{ name: nextScreen }],
      });
    } catch (error) {
      console.warn("Navigation error:", error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MyTab' }],
      });
    }
  }
};

export default NavigationUtils;