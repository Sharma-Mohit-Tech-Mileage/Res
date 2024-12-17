package com.sparklight;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.io.IOException;
import java.util.List;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class MainApplication extends Application implements ReactApplication {
    private static final String ZENDESK_API_URL = "https://cableone.zendesk.com/api/v2/chat/agents";
    private static final String AUTH_TOKEN = "DDiQVbQmQuz5pH8bwfgg3EfYY40shPtIu7lcKeJS";
  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new RNZendeskChatPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    //ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());


//      OkHttpClient client = new OkHttpClient();
//
//      new Thread(new Runnable() {
//          @Override
//          public void run() {
//              Request request = new Request.Builder()
//                      .url(ZENDESK_API_URL)
//                      .header("Authorization", "Bearer " + AUTH_TOKEN)
//                      .build();
//
//              try (Response response = client.newCall(request).execute()) {
//                  if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
//
//                  System.out.println(response.body().string());
//              } catch (IOException e) {
//                  throw new RuntimeException(e);
//              }
//          }
//      }).start();


  }


}
