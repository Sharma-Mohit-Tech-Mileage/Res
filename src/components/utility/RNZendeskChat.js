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

