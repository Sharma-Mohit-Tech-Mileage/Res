// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

let strings = new LocalizedStrings({
 en:{
   internetStatus:"No issue has been detected.",
   internetStatusIssue:"An issue has been detected.",
   expandTxt:'Expand Details',
   collapseTxt:'Collapse Details',
   noOutageTxt:'No Outage',
   noOutageDetected:'Outage Detected',
   connect_wifi_txt:'Connected to Wifi',
   no_modem_issue:'No Modem Issues',
   modem_issue_detected:'Modem Issues Detected',
   bill_paid:'Bill Paid',
   my_service_txt:'My Service',
   my_plan_details_txt:'Plan Details',
   test_speed_info:'Wi-Fi speeds on mobile devices are \n typically lower than wired speeds.',
   learn_more:'Learn More',
   test_with_eero:'Test with Eero',
   nonAdminUserMsg:'To access the MySparklight app, your user profile must have the Primary Admin or Admin role.',
   BusinessUserMsg:'Only customers with Sparklight home internet services can use the MySparklight mobile app for account management.',
   //nonAdminUserMsg:'Only customers with Sparklight home internet services can use the MySparklight mobile app for account management. Please',
   nonInternetUserMessage:'Currently, only a Sparklight account with Internet service can use the MySparklight mobile app for service management. '
 },
 
});
  
  export default strings