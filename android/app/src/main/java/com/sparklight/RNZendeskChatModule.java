// RNZendeskChatModule.java
package com.sparklight;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import zendesk.android.FailureCallback;
import zendesk.android.SuccessCallback;
import zendesk.android.Zendesk;
import zendesk.android.ZendeskUser;
import zendesk.android.events.ZendeskEvent;
import zendesk.android.events.ZendeskEventListener;
import zendesk.messaging.android.DefaultMessagingFactory;
import zendesk.logger.Logger;


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
        // To create and use the event listener:
        ZendeskEventListener zendeskEventListener =
                new ZendeskEventListener() {
                    @Override
                    public void onEvent(@NonNull ZendeskEvent zendeskEvent) {
                        Log.d("Zendesk", "Event received: " + zendeskEvent.getClass().getSimpleName());
                        if (zendeskEvent instanceof ZendeskEvent.UnreadMessageCountChanged) {
                            // Your custom action...
                        } else if (zendeskEvent instanceof ZendeskEvent.AuthenticationFailed){
                            // Your custom action...
                            Log.e("Zendesk", "AuthenticationFailed : " + ((ZendeskEvent.AuthenticationFailed) zendeskEvent).getError().getMessage());
                        }
                    }
                };
          Zendesk.getInstance().addEventListener(zendeskEventListener);
        Logger.setLoggable(true);

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

    }

    @ReactMethod
    public void loginWithJWT( String jwt) {
        Zendesk.getInstance().loginUser(jwt, new SuccessCallback<ZendeskUser>() {
            @Override
            public void onSuccess(ZendeskUser zendeskUser) {
                Log.d("Zendesk", "Login successful");
            }
        }, new FailureCallback<Throwable>() {
            @Override
            public void onFailure(@NonNull Throwable throwable) {
                Log.e("Zendesk", "Login failed: " + throwable.getMessage());
            }
        });
    }


}
