
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

  
RCT_EXPORT_METHOD(setConversationTags:(NSDictionary *)tags
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    // Example: Using hypothetical Messaging SDK
    // [MessagingSDK setConversationTags:tags];

   //[[Zendesk instance] setCon]
    [Zendesk.instance.messaging setConversationFields:@{@"userAgentId": tags[@"userAgent"]}];
    
    [Zendesk.instance.messaging setConversationFields:@{@"appVersionId": tags[@"appVersion"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"timezoneOffsetId": tags[@"timezoneOffsetId"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"platformId": tags[@"platform"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"locationHrefId": tags[@"locationHrefId"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"ipAddressId": tags[@"ipAddress"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"emailId": tags[@"email"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"firstNameId": tags[@"firstName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"lastNameId": tags[@"lastName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"nameId": tags[@"name"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"phoneId": tags[@"phone"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"externalId": tags[@"accountNumber"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"pId": tags[@"accountNumber"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"userNameId": tags[@"userName"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"customerTypeId": tags[@"customerType"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"authLevelId": tags[@"authLevel"]}];
    [Zendesk.instance.messaging setConversationFields:@{@"jwtId": tags[@"jwtId"]}];

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
