// RNZendeskChatModule.java
package com.sparklight;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.zendesk.logger.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import zendesk.chat.Chat;
import zendesk.chat.ChatConfiguration;
import zendesk.chat.ChatEngine;
import zendesk.chat.ChatMenuAction;
import zendesk.chat.ChatProvider;
import zendesk.chat.ChatProvidersConfiguration;
import zendesk.chat.ProfileProvider;
import zendesk.chat.VisitorInfo;
import zendesk.classic.messaging.MessagingActivity;


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
    public void clearChatSession() {
        Chat.INSTANCE.resetIdentity();
        Chat.INSTANCE.clearCache();
    }

    @ReactMethod
    public void startChatWithConfig(ReadableMap config) {
        Chat.INSTANCE.resetIdentity();
        VisitorInfo.Builder visitorInfoBuilder = VisitorInfo.builder();
        ProfileProvider profileProvider = Chat.INSTANCE.providers().profileProvider();
        ChatProvider chatProvider = Chat.INSTANCE.providers().chatProvider();
        if (config.hasKey("name")) {
            visitorInfoBuilder = visitorInfoBuilder.withName(config.getString("name"));
        }
        if (config.hasKey("email")) {
            visitorInfoBuilder = visitorInfoBuilder.withEmail(config.getString("email"));
        }
        if (config.hasKey("phone")) {
            visitorInfoBuilder = visitorInfoBuilder.withPhoneNumber(config.getString("phone"));
        }

        List<String> tags = new ArrayList<>();
        if (config.hasKey("tags") && config.getType("tags") == ReadableType.Array) {
            ReadableArray tagArray = config.getArray("tags");
            for (int i = 0; i < tagArray.size(); i++) {
                if (tagArray.getType(i) == ReadableType.String) {
                    tags.add(tagArray.getString(i));
                    Log.d("Tag",tagArray.getString(i));
                }
            }
        }
        Logger.d("Tag","pro",tags);
        if (config.hasKey("tags")) {
            profileProvider.addVisitorTags(tags,null);
        }

        ChatProvidersConfiguration chatProvidersConfiguration = ChatProvidersConfiguration.builder()
                .withVisitorInfo(visitorInfoBuilder.build())
                .withDepartment(Objects.requireNonNull(config.getString("department")))
                .build();

        Chat.INSTANCE.setChatProvidersConfiguration(chatProvidersConfiguration);

        ChatConfiguration chatConfiguration = ChatConfiguration.builder().
                withAgentAvailabilityEnabled(false)
                .build();
        
       // profileProvider.setVisitorInfo(visitorInfoBuilder.build(), null);
        //chatProvider.setDepartment(Objects.requireNonNull(config.getString("department")), null);



        MessagingActivity.builder()
                .withEngines(ChatEngine.engine())
                .show(Objects.requireNonNull(reactContext.getCurrentActivity()), chatConfiguration);
    }
}
