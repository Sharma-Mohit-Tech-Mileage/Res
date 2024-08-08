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
        RNZendeskChatModule.startChat(config);
    //});
};