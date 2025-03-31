// RNZendeskChatModule.java
package com.sparklight;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import zendesk.android.Zendesk;
import zendesk.messaging.android.DefaultMessagingFactory;


public class RNZendeskChatModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    RNZendeskChatModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        init();
    }

    private void init(){
        Zendesk.initialize(
                getReactApplicationContext(),
                ZendeskConfig.CHANNEL_KEY,
                zendesk -> Log.i("IntegrationApplication", "Initialization successful"),
                error -> Log.e("IntegrationApplication", "Messaging failed to initialize", error),
                new DefaultMessagingFactory());

}

    @Override
    public String getName() {
        return "RNZendeskChatModule";
    }

//    @ReactMethod
//    public void clearChatSession() {
//        VisitorInfo visitorInfo = VisitorInfo.builder()
//                .withName("")
//                .withEmail("")
//                .withPhoneNumber("")
//                .build();
//        Chat.INSTANCE.providers().profileProvider().setVisitorInfo(visitorInfo, null);
//        Chat.INSTANCE.resetIdentity();
//
//    }

    @ReactMethod
    public void startChatWithConfig(ReadableMap config) {
        Zendesk.getInstance().getMessaging().showMessaging(getReactApplicationContext(), Intent.FLAG_ACTIVITY_NEW_TASK);
//        VisitorInfo.Builder visitorInfoBuilder = VisitorInfo.builder();
//        ProfileProvider profileProvider = Chat.INSTANCE.providers().profileProvider();
//
//        if (config.hasKey("name")) {
//            visitorInfoBuilder = visitorInfoBuilder.withName(config.getString("name"));
//        }
//        if (config.hasKey("email")) {
//            visitorInfoBuilder = visitorInfoBuilder.withEmail(config.getString("email"));
//        }
//        if (config.hasKey("phone")) {
//            visitorInfoBuilder = visitorInfoBuilder.withPhoneNumber(config.getString("phone"));
//        }
//
//
//
//        List<String> tags = new ArrayList<>();
//        if (config.hasKey("tags") && config.getType("tags") == ReadableType.Array) {
//            ReadableArray tagArray = config.getArray("tags");
//            for (int i = 0; i < tagArray.size(); i++) {
//                if (tagArray.getType(i) == ReadableType.String) {
//                    tags.add(tagArray.getString(i));
//                    Log.d("Tag",tagArray.getString(i));
//                }
//            }
//        }
//
//        //Logger.d("Tag","pro",tags);
//        if (config.hasKey("tags")) {
//            profileProvider.addVisitorTags(tags,null);
//        }
//
//        ChatProvidersConfiguration chatProvidersConfiguration = ChatProvidersConfiguration.builder()
//                .withVisitorInfo(visitorInfoBuilder.build())
//                .withDepartment(Objects.requireNonNull(config.getString("department")))
//                .build();
//
//
//
//
//        Chat.INSTANCE.setChatProvidersConfiguration(chatProvidersConfiguration);
//
//        ChatConfiguration chatConfiguration = ChatConfiguration.builder().
//                withOfflineFormEnabled(true)
//                .withNameFieldStatus(PreChatFormFieldStatus.REQUIRED)
//                .withEmailFieldStatus(PreChatFormFieldStatus.REQUIRED)
//                .withPhoneFieldStatus(PreChatFormFieldStatus.REQUIRED)
//                .withDepartmentFieldStatus(PreChatFormFieldStatus.OPTIONAL)
//                .withAgentAvailabilityEnabled(true)
//                .build();
//
//
//       // profileProvider.setVisitorInfo(visitorInfoBuilder.build(), null);
//        //chatProvider.setDepartment(Objects.requireNonNull(config.getString("department")), null);
//
//
//
//
//        MessagingActivity.builder()
//                .withEngines(ChatEngine.engine())
//                .withBotLabelString("Sparklight Support")
//                //.withBotAvatarDrawable(R.drawable.)
//                .show(Objects.requireNonNull(reactContext.getCurrentActivity()), chatConfiguration);
    }
}
