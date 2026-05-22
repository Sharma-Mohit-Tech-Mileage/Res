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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import zendesk.android.FailureCallback;
import zendesk.android.SuccessCallback;
import zendesk.android.Zendesk;
import zendesk.android.ZendeskUser;
import zendesk.android.events.ZendeskEvent;
import zendesk.android.events.ZendeskEventListener;
import zendesk.messaging.android.DefaultMessagingFactory;
//import zendesk.logger.Logger;


public class RNZendeskChatModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNZendeskChatModule";
    private static ReactApplicationContext reactContext;

    RNZendeskChatModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        init();
    }

    private void init(){
        Zendesk.initialize(
                getReactApplicationContext(),
                BuildConfig.ZENDESK_CHANNEL_KEY_ANDROID,
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
        //Logger.setLoggable(true);

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

//
//    @ReactMethod
//    public void setConversationTags(ReadableMap metadata ) {
//        Map<String,Object> fields = new HashMap<String, Object>();
//        fields.put("29542407930903", metadata.getString("userAgent"));
//        fields.put("29542536141335", metadata.getString("appVersion"));
//        fields.put("29542663925271", metadata.getString("timezoneOffsetId"));
//        fields.put("29542734993559", metadata.getString("platform"));
//        fields.put("29230394216983", metadata.getString("locationHrefId"));
//        fields.put("29542809023767", metadata.getString("ipAddress"));
//       // fields.put("360003617614", metadata.getString("email"));
//        fields.put("360004035014", metadata.getString("firstName"));
//        fields.put("360003976113", metadata.getString("lastName"));
//        fields.put("360036705974", metadata.getString("name"));
//        fields.put("360046174754", metadata.getString("phone"));
//        fields.put("360004035174", metadata.getString("accountNumber"));
//        fields.put("360004035174", metadata.getString("accountNumber"));
//        fields.put("29542395738007", metadata.getString("userName"));
//        fields.put("29542894274711", metadata.getString("customerType"));
//        fields.put("29542032223895", metadata.getString("authLevel"));
//        fields.put("29542045878167", metadata.getString("jwtId"));
//        Zendesk.getInstance().getMessaging().setConversationFields(fields);
//
//    }


    @ReactMethod
    public void setConversationTags(ReadableMap metadata) {
        try {
            boolean isUAT = false;
            if (metadata.hasKey("isUAT")) {
                if (metadata.getType("isUAT") == com.facebook.react.bridge.ReadableType.Boolean) {
                    isUAT = metadata.getBoolean("isUAT");
                } else if (metadata.getType("isUAT") == com.facebook.react.bridge.ReadableType.String) {
                    String val = metadata.getString("isUAT").toLowerCase();
                    isUAT = val.equals("true") || val.equals("1");
                }
            }

            Log.d(TAG, "Zendesk setConversationTags invoked. isUAT=" + isUAT);

            Map<String, Object> fields = new HashMap<>();

            if (isUAT) {
                if (metadata.hasKey("userAgent"))       fields.put("29230353527575", metadata.getString("userAgent"));
                if (metadata.hasKey("appVersion"))      fields.put("29230349707159", metadata.getString("appVersion"));
                if (metadata.hasKey("timezoneOffsetId")) fields.put("29230359134487", metadata.getString("timezoneOffsetId"));
                if (metadata.hasKey("platform"))        fields.put("29230381416087", metadata.getString("platform"));
                if (metadata.hasKey("locationHrefId"))  fields.put("29230394216983", metadata.getString("locationHrefId"));
                if (metadata.hasKey("ipAddress"))       fields.put("29230409854743", metadata.getString("ipAddress"));
                if (metadata.hasKey("firstName"))       fields.put("28685404062615", metadata.getString("firstName"));
                if (metadata.hasKey("lastName"))        fields.put("28685434553111", metadata.getString("lastName"));
                if (metadata.hasKey("name"))            fields.put("28685420915607", metadata.getString("name"));
                if (metadata.hasKey("phone"))           fields.put("28685420643991", metadata.getString("phone"));
                if (metadata.hasKey("accountNumber"))   fields.put("28685413035543", metadata.getString("accountNumber"));
                if (metadata.hasKey("userName"))        fields.put("29450503100695", metadata.getString("userName"));
                if (metadata.hasKey("customerType"))    fields.put("28685435072023", metadata.getString("customerType"));
                if (metadata.hasKey("authLevel"))       fields.put("29230167813271", metadata.getString("authLevel"));
                if (metadata.hasKey("mobileApp"))       fields.put("29542765557655", metadata.getString("mobileApp"));
                if (metadata.hasKey("jwtId"))           fields.put("29230180962071", metadata.getString("jwtId"));
                if (metadata.hasKey("source"))           fields.put("40313200914455", metadata.getString("source"));
            } else {
                // Prod mapping
                if (metadata.hasKey("userAgent"))       fields.put("29542407930903", metadata.getString("userAgent"));
                if (metadata.hasKey("appVersion"))      fields.put("35417538078103", metadata.getString("appVersion"));
                if (metadata.hasKey("timezoneOffsetId")) fields.put("29542663925271", metadata.getString("timezoneOffsetId"));
                if (metadata.hasKey("platform"))        fields.put("29542734993559", metadata.getString("platform"));
                if (metadata.hasKey("locationHrefId"))  fields.put("29542765557655", metadata.getString("locationHrefId"));
                if (metadata.hasKey("ipAddress"))       fields.put("29542809023767", metadata.getString("ipAddress"));
                if (metadata.hasKey("firstName"))       fields.put("360004035014", metadata.getString("firstName"));
                if (metadata.hasKey("lastName"))        fields.put("360003976113", metadata.getString("lastName"));
                if (metadata.hasKey("name"))            fields.put("360036705974", metadata.getString("name"));
                if (metadata.hasKey("phone"))           fields.put("360046174754", metadata.getString("phone"));
                if (metadata.hasKey("accountNumber"))   fields.put("360004035174", metadata.getString("accountNumber"));
                if (metadata.hasKey("userName"))        fields.put("29542395738007", metadata.getString("userName"));
                if (metadata.hasKey("customerType"))    fields.put("29542894274711", metadata.getString("customerType"));
                if (metadata.hasKey("authLevel"))       fields.put("29542032223895", metadata.getString("authLevel"));
                //if (metadata.hasKey("mobileApp"))       fields.put("29542765557655", metadata.getString("mobileApp"));
                if (metadata.hasKey("jwtId"))           fields.put("29542045878167", metadata.getString("jwtId"));
                if (metadata.hasKey("source"))          fields.put("40559477171223", metadata.getString("source"));
            }

            Zendesk.getInstance().getMessaging().setConversationFields(fields);

        } catch (Exception e) {
            Log.e(TAG, "Zendesk setConversationFields error: " + e.getMessage());

        }
    }
}


