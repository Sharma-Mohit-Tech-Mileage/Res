// RNZendeskChatModule.java
package com.sparklight;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import zendesk.chat.Chat;
import zendesk.chat.ChatConfiguration;
import zendesk.chat.ChatEngine;
import zendesk.chat.VisitorInfo;
import zendesk.messaging.MessagingActivity;

public class RNZendeskChatModule extends ReactContextBaseJavaModule {
private ChatConfiguration chatConfiguration;
    private static ReactApplicationContext reactContext;

    RNZendeskChatModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        init();
    }

    private void init(){
        Chat.INSTANCE.init(reactContext, ZendeskConfig.CHAT_ACCOUNT_KEY);
         chatConfiguration = ChatConfiguration.builder()
                .withAgentAvailabilityEnabled(false)
                .build();
    }

    @Override
    public String getName() {
        return "RNZendeskChatModule";
    }

    @ReactMethod
    public void startChat() {
        MessagingActivity.builder()
                .withEngines(ChatEngine.engine())
                .show(reactContext.getCurrentActivity(), chatConfiguration);
    }

    @ReactMethod
    public void startChatWithConfig(ReadableMap config) {
        Chat.INSTANCE.init(reactContext, "YOUR_ACCOUNT_KEY");

        VisitorInfo.Builder visitorInfoBuilder = VisitorInfo.builder();
        if (config.hasKey("name")) {
            visitorInfoBuilder = visitorInfoBuilder.withName(config.getString("name"));
        }
        if (config.hasKey("email")) {
            visitorInfoBuilder = visitorInfoBuilder.withEmail(config.getString("email"));
        }
        if (config.hasKey("phone")) {
            visitorInfoBuilder = visitorInfoBuilder.withPhoneNumber(config.getString("phone"));
        }

//        ChatConfiguration chatConfiguration = ChatConfiguration.builder()
//                .withVisitorInfo(visitorInfoBuilder.build())
//                .withAgentAvailabilityEnabled(false)
//                .build();

        MessagingActivity.builder()
                .withEngines(ChatEngine.engine())
                .show(reactContext.getCurrentActivity(), chatConfiguration);
    }
}
