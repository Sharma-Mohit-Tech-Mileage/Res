// RNZendeskChat.js
import { NativeModules } from 'react-native';
const { RNZendeskChatModule } = NativeModules;

export const startChatWithConfig = (config) => {
    RNZendeskChatModule.startChatWithConfig(config);
};

export const clearChatData = () => {
    RNZendeskChatModule.clearChatSession();
};

export const startChat = (config) => {
    //return new Promise((resolve, reject) => {
        RNZendeskChatModule.startChat();
    //});
};

// Login using JWT
export const loginWithJWT = async (jwtToken) => {
    try {
      console.error('Zendesk Login with:', jwtToken)
      const result = await RNZendeskChatModule.loginWithJWT(jwtToken);
      console.log(result);
    } catch (error) {
      console.error('Zendesk Login Error:', error);
    }
  };
  
  // Logout
  export const logoutZendesk = async () => {
    try {
      const result = await RNZendeskChatModule.logoutZendesk();
      console.log(result);
    } catch (error) {
      console.error('Zendesk Logout Error:', error);
    }
  };

// Set conversational fields
  export const setConversationalFields = async(data) => {
    console.log('Setting conversational fields:', data);
    try {
      const result = await RNZendeskChatModule.setConversationTags(data);
      console.log("Result:",result);
    } catch (error) {
      console.log("Result1:",false);
      console.error('setConversationalFields  Error:', error);
    }
    
};

