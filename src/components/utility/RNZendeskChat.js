// RNZendeskChat.js
import { NativeModules } from 'react-native';
const { RNZendeskChatModule } = NativeModules;

export const startChatWithConfig = (config) => {
    RNZendeskChatModule.startChatWithConfig(config);
};

export const clearChatData = () => {
    RNZendeskChatModule.clearChatSession();
};

export const ZendDeskInitialize = (accountKey) => {
    RNZendeskChatModule.initialize(accountKey);
};