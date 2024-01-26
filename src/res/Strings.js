// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

let strings = new LocalizedStrings({
 en:{
   internetStatus:"Your Internet Health has no recent issues.",
   internetStatusIssue:"An issue has been detected.",
   expandTxt:'Expand Details',
   collapseTxt:'Collapse Details',
   noOutageTxt:'No Outages',
   noOutageDetected:'Outages Detected',
   connect_wifi_txt:'Connected to Wifi',
   no_modem_issue:'No Modem Issues',
   bill_paid:'Bill Paid',
   my_service_txt:'My Service',
   my_plan_details_txt:'Plan Details',
   test_speed_info:'Wi-Fi speeds on mobile devices are \n typically lower than wired speeds.',
   learn_more:'Learn More',
   test_with_eero:'Test with Eero',
   nonAdminUserMsg:'Currently, only the Primary Admin or an Admin of a Sparklight account can use the MySparklight mobile app for account management. Please',
   nonInternetUserMessage:'Currently, only a Sparklight account with Internet service can use the MySparklight mobile app for service management. Please'
 },
 
});
  
  export default strings