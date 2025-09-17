import { PostApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
export const NavigationUtils = {
 
  checkPushNotificationNeeded: (profile) => {
    if (!profile?.pushNotifications?.length) return true;
    
    const messageTypes = profile.pushNotifications[0].pushMessageType || [];
    const optOutCount = messageTypes.filter(mt => mt.optOutFlag).length;
    
    return optOutCount == 3;
  },

  
  checkTextNotificationNeeded: (profile) => {
    if (!profile?.smsSubscription?.length) return true;
    const phoneNum = profile.smsSubscription[0].phoneNum;
    
    return !(phoneNum && (phoneNum.length === 10 || phoneNum.length === 11));
  },


 checkEmailNotificationNeeded: async (accountNumber) => {
  try {
    const user = await getUser();

    const email = user?.userInfo?.email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const emailExists = !!email && emailRegex.test(email);
    return !emailExists; 
  } catch (error) {
    console.error("Error checking email:", error);
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
      console.error("Navigation error:", error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MyTab' }],
      });
    }
  }
};

export default NavigationUtils;