// RNZendeskChat.js
import { NativeModules } from 'react-native';
const { RNZendeskChatModule } = NativeModules;
import { getZendeskData } from "../../redux/utils/LocalStorage";
import analytics from '@react-native-firebase/analytics';

export const startChatWithConfig = async(config) => {
  console.log("startChat called with config:", config);
  await analytics().logEvent("Zendesk_Chat_Start", { Chat_Initiation_Page: config.Initiation_Page });
  const fields = getZendeskData()
    .then((fields) => {
      const mergedObject = Object.assign({}, fields, config);
      RNZendeskChatModule.setConversationTags(mergedObject || {});
      console.log(
        "fields in startChatWithConfig",
        JSON.stringify(mergedObject),
      );
      RNZendeskChatModule.startChatWithConfig(config);
    })
    .catch((error) => {
      RNZendeskChatModule.startChatWithConfig(config);
      console.warn("Error retrieving Zendesk data:", error);
    });
};

export const clearChatData = () => {
    RNZendeskChatModule.clearChatSession();
};

export const startChat = async (config) => {
  console.log("startChat called with config:", config);
  await analytics().logEvent("Zendesk_Chat_Start", { Chat_Initiation_Page: config.Initiation_Page });
  const fields = getZendeskData()
    .then((fields) => {
      const mergedObject = Object.assign({}, fields, config);
      RNZendeskChatModule.setConversationTags(mergedObject || {});
      console.log(
        "fields in startChatWithConfig",
        JSON.stringify(mergedObject),
      );
      RNZendeskChatModule.startChat();
    })
    .catch((error) => {
      RNZendeskChatModule.startChat();
      console.warn("Error retrieving Zendesk data:", error);
    });
  //console.log("fields in startChatWithConfig", fields);
  //return new Promise((resolve, reject) => {

  //});
};

// Login using JWT
export const loginWithJWT = async (jwtToken) => {
    try {
      const result = await RNZendeskChatModule.loginWithJWT(jwtToken);
    } catch (error) {
      console.warn('Zendesk Login Error:', error);
    }
  };
  
  // Logout
  export const logoutZendesk = async () => {
    try {
      const result = await RNZendeskChatModule.logoutZendesk();
    } catch (error) {
      console.warn('Zendesk Logout Error:', error);
    }
  };

// Set conversational fields
  export const setConversationalFields = async(data) => {
    try {
      await RNZendeskChatModule.setConversationTags(data);
    } catch (error) {
      console.warn('setConversationalFields  Error:', error);
    }
    
};

