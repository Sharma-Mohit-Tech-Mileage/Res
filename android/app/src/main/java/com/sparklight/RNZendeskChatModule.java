package com.sparklight; // Replace with your actual package name

import android.app.Activity;
import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.HashMap;
import java.util.Map;

import kotlin.Unit;
import zendesk.android.Zendesk;
import zendesk.android.ZendeskResult;
import zendesk.android.events.ZendeskEvent;
import zendesk.android.events.ZendeskEventListener;
import zendesk.messaging.android.DefaultMessagingFactory;

public class RNZendeskChatModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String TAG = "RNZendeskChatModule";

    public RNZendeskChatModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNZendeskChatModule";
    }

    /**
     * Initialization method to be called from MainApplication or via a React Method.
     * In Android, initialization requires a Context.
     */
    public static void init(android.content.Context context) {
        String channelKey;
        // In Android, BuildConfig.DEBUG is used to check for debug vs release
        if (BuildConfig.DEBUG) {
            channelKey = ZendeskConfig.ZENDESK_CHANNEL_KEY_SANDBOX;
        } else {
            channelKey = ZendeskConfig.ZENDESK_CHANNEL_KEY_PRODUCTION;;
        }

        Zendesk.initialize(
                context,
                channelKey,
                zendesk -> {
                    Log.d(TAG, "Zendesk initialized successfully");

                    // Add Event Observer
                    Zendesk.getInstance().addEventListener(new ZendeskEventListener() {
                        @Override
                        public void onEvent(@NonNull ZendeskEvent event) {
                            if (event instanceof ZendeskEvent.UnreadMessageCountChanged) {
                                // Handle unread count
                            } else if (event instanceof ZendeskEvent.AuthenticationFailed) {
                                Log.e(TAG, "Zendesk Authentication Failed");
                            }
                        }
                    });
                },
                error -> Log.e(TAG, "Zendesk did not initialize. Error: " + error.getMessage()),
                new DefaultMessagingFactory()
        );
    }

    @ReactMethod
    public void startChatWithConfig(Promise promise) {
        try {

            Activity activity = getCurrentActivity();


            if (activity != null) {
                activity.runOnUiThread(() -> { Zendesk.getInstance().getMessaging().showMessaging(activity); });
                promise.resolve(true);
            } else {
                promise.reject("start_error", "Activity does not exist");
            }
        } catch (Exception e) {
            promise.reject("start_error", "Failed to start Zendesk messaging", e);
        }
    }

    @ReactMethod
    public void loginWithJWT(String jwtToken, Promise promise) {
        if (jwtToken == null || jwtToken.isEmpty()) {
            promise.reject("ZendeskLoginError", "JWT token is empty");
            return;
        }

        Zendesk zendesk = Zendesk.getInstance();


        Log.d(TAG, "Attempting Zendesk JWT login");

        zendesk.loginUser(
                jwtToken,
                it -> {
                   Log.d(TAG, "Zendesk JWT login successful");
                    //return promise.resolve("User logged in successfully"); // required because the lambda returns Unit in Kotlin
                },
                error -> {
                    Log.e(TAG, "Zendesk login failed")
;                    //return null;
                }
        );



    }

    @ReactMethod
    public void logoutZendesk(Promise promise) {
        Zendesk.getInstance().logoutUser(new zendesk.android.SuccessCallback<Unit>() {
            @Override
            public void onSuccess(Unit unit) {
                promise.resolve("User logged out successfully");
            }
        }, new zendesk.android.FailureCallback<Throwable>() {
            @Override
            public void onFailure(@NonNull Throwable error) {
                promise.reject("ZendeskLogoutError", "Logout failed", error);
            }
        });
    }

    @ReactMethod
    public void setConversationTags(ReadableMap metadata, Promise promise) {
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
            } else {
                // Prod mapping
                if (metadata.hasKey("userAgent"))       fields.put("29542407930903", metadata.getString("userAgent"));
                if (metadata.hasKey("appVersion"))      fields.put("29542536141335", metadata.getString("appVersion"));
                if (metadata.hasKey("timezoneOffsetId")) fields.put("29542663925271", metadata.getString("timezoneOffsetId"));
                if (metadata.hasKey("platform"))        fields.put("29542734993559", metadata.getString("platform"));
                if (metadata.hasKey("locationHrefId"))  fields.put("29230394216983", metadata.getString("locationHrefId"));
                if (metadata.hasKey("ipAddress"))       fields.put("29542809023767", metadata.getString("ipAddress"));
                if (metadata.hasKey("firstName"))       fields.put("360004035014", metadata.getString("firstName"));
                if (metadata.hasKey("lastName"))        fields.put("360003976113", metadata.getString("lastName"));
                if (metadata.hasKey("name"))            fields.put("360036705974", metadata.getString("name"));
                if (metadata.hasKey("phone"))           fields.put("360046174754", metadata.getString("phone"));
                if (metadata.hasKey("accountNumber"))   fields.put("360004035174", metadata.getString("accountNumber"));
                if (metadata.hasKey("userName"))        fields.put("29542395738007", metadata.getString("userName"));
                if (metadata.hasKey("customerType"))    fields.put("29542894274711", metadata.getString("customerType"));
                if (metadata.hasKey("authLevel"))       fields.put("29542032223895", metadata.getString("authLevel"));
                if (metadata.hasKey("mobileApp"))       fields.put("29542765557655", metadata.getString("mobileApp"));
                if (metadata.hasKey("jwtId"))           fields.put("29542045878167", metadata.getString("jwtId"));
            }

            Zendesk.getInstance().getMessaging().setConversationFields(fields);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Zendesk setConversationFields error: " + e.getMessage());
            promise.reject("set_tags_error", "Failed to set conversation tags", e);
        }
    }
}