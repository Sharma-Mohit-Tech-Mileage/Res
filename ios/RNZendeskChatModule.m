
#import "RNZendeskChatModule.h"
#import <ZendeskSDKMessaging/ZendeskSDKMessaging.h>
#import <ZendeskSDKLogger/ZendeskSDKLogger.h>
#import <ZendeskSDK/ZendeskSDK.h>

#import <ZendeskSDK/ZendeskSDK.h>


@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);



+ (void) init {
  
  
      dispatch_async(dispatch_get_main_queue(), ^{
        [Zendesk initializeWithChannelKey:@"eyJzZXR0aW5nc191cmwiOiJodHRwczovL2NhYmxlb25lLnplbmRlc2suY29tL21vYmlsZV9zZGtfYXBpL3NldHRpbmdzLzAxSlEwOTk0WUpERVpLMVdCWjlFVDdCRURYLmpzb24ifQ=="
                         messagingFactory:[[ZDKDefaultMessagingFactory alloc] init]
                        completionHandler:^(Zendesk * _Nullable zendesk, NSError * _Nullable error) {
                if (error != nil) {
                    NSLog(@"Zendesk did not initialize.\nError: %@", error.localizedDescription);
                }
            }];
      });
          
    
  
}




- (UIViewController *)getRootViewController {
    return [UIApplication sharedApplication].delegate.window.rootViewController;
}

RCT_EXPORT_METHOD(startChat:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject )
{
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
      UIViewController *viewController = [Zendesk.instance.messaging messagingViewController];
      if (viewController != NULL) {
        //UIViewController *rootViewController = [self getRootViewController];
        UINavigationController *chatController = [[UINavigationController alloc] initWithRootViewController: viewController];
        [rootViewController presentViewController:chatController animated:YES completion:nil];
        resolve(@(YES)); // Resolve the promise with a success value
      }
    }@catch (NSException *exception) {
           reject(@"start_error", @"Failed to start Zendesk messaging", nil); // Reject the promise with an error
         }
    
  });
}


RCT_EXPORT_METHOD(loginWithJWT:(NSString *)jwtToken resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [[Zendesk instance] loginUserWith:jwtToken completionHandler:^(ZDKZendeskUser * _Nullable user, NSError * _Nullable error) {
        if (error) {
          reject(@"ZendeskLoginError", @"Login failed", error);
        } else {
          resolve(@"User logged in successfully");
        }
      }];
    }
    @catch (NSException *exception) {
      reject(@"Exception", @"Exception occurred", nil);
    }
  });
}

RCT_EXPORT_METHOD(logoutZendesk:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [[Zendesk instance] logoutUserWithCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
          reject(@"ZendeskLogoutError", @"Logout failed", error);
        } else {
          resolve(@"User logged out successfully");
        }
      }];
    }
    @catch (NSException *exception) {
      reject(@"Exception", @"Exception occurred", nil);
    }
  });
}
  





@end
