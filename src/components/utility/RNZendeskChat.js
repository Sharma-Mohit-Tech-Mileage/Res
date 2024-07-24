// RNZendeskChat.js
import { NativeModules } from 'react-native';
const { RNZendeskChatModule } = NativeModules;

export const startChatWithConfig = (config) => {
    RNZendeskChatModule.startChatWithConfig(config);
};
