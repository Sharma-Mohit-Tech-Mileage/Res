// RNZendeskChat.js
import { NativeModules } from 'react-native';
const { RNZendeskChatModule } = NativeModules;

export const startChat = () => {
    RNZendeskChatModule.startChat();
};
