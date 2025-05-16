
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
          ZDKLogger.enabled = YES;
          ZDKLogger.level = ZDKLogLevelDefault;
                if (error != nil) {
                    NSLog(@"Zendesk did not initialize.\nError: %@", error.localizedDescription);
                }else{
                  // Get your Zendesk instance:
                  Zendesk *instance = [Zendesk instance];

                  // To add an event observer to your Zendesk instance:
                  [instance addEventObserver:self :^(enum ZDKZendeskEvent event, id _Nullable value) {
                      switch (event) {
                      case ZDKZendeskEventUnreadMessageCountChanged:
                          // Your custom action...
                      case ZDKZendeskEventAuthenticationFailed:
                          // Your custom action...
                          NSLog(@"Zendesk ZDKZendeskEventAuthenticationFailed");
                        
                      default:
                          break;
                      }
                  }];

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
          //NSLog(@"Zendesk jWt.\nError: %@", error);
          reject(@"ZendeskLoginError", @"Login failed", error);
          NSLog(@"Zendesk jWt.\nError: %@", error);
        } else {
          resolve(@"User logged in successfully");
        }
      }];
    }
    @catch (NSException *exception) {
      NSLog(@"Zendesk jWt.\nError: %@", exception.reason);
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

  
RCT_EXPORT_METHOD(setConversationTags:(NSDictionary *)tags
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    // Example: Using hypothetical Messaging SDK
    // [MessagingSDK setConversationTags:tags];

   //[[Zendesk instance] setCon]
    NSLog(@"Zendesk login: %@", tags[@"userAgent"]);
    [Zendesk.instance.messaging setConversationFields:@{@"29542407930903": tags[@"userAgent"]}];
    
    [Zendesk.instance.messaging setConversationFields:@{@"29542536141335": tags[@"appVersion"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542663925271": tags[@"timezoneOffsetId"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542734993559": tags[@"platform"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29230394216983": tags[@"locationHrefId"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542809023767": tags[@"ipAddress"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360003617614": tags[@"email"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360004035014": tags[@"firstName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360003976113": tags[@"lastName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360036705974": tags[@"name"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360046174754": tags[@"phone"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360004035174": tags[@"accountNumber"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"360004035174": tags[@"accountNumber"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542395738007": tags[@"userName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542894274711": tags[@"customerType"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542032223895": tags[@"authLevel"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"29542045878167": tags[@"jwtId"]}];

    // Simulate success
    resolve(@(YES));
  }
  @catch (NSException *exception) {
    //NSLog(@"Exception: %@, Reason: %@, User Info: %@", exception.name, exception.reason, exception.userInfo);
    NSLog(@"Zendesk login.\nError: %@", exception.reason);
    reject(@"set_tags_error", @"Failed to set conversation tags", nil);
  }
}




@end
