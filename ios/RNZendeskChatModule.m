#import "RNZendeskChatModule.h"
#import <ZendeskSDKMessaging/ZendeskSDKMessaging.h>
#import <ZendeskSDKLogger/ZendeskSDKLogger.h>
#import <ZendeskSDK/ZendeskSDK.h>


@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);



+ (void) init {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *channelKey = [NSBundle mainBundle].infoDictionary[@"ZENDESK_CHANNEL_KEY_IOS"];

    [Zendesk initializeWithChannelKey:channelKey
                     messagingFactory:[[ZDKDefaultMessagingFactory alloc] init]
                    completionHandler:^(Zendesk * _Nullable initializedZendesk, NSError * _Nullable initError) {
                      ZDKLogger.enabled = YES;
                      ZDKLogger.level = ZDKLogLevelDefault;
                      if (initError != nil) {
                        NSLog(@"Zendesk did not initialize.\nError: %@", initError.localizedDescription);
                      } else {
                        Zendesk *sdkInstance = [Zendesk instance];
                        [sdkInstance addEventObserver:self :^(enum ZDKZendeskEvent zendeskEvent, id _Nullable value) {
                          switch (zendeskEvent) {
                            case ZDKZendeskEventUnreadMessageCountChanged:
                              break;
                            case ZDKZendeskEventAuthenticationFailed:
                              NSLog(@"Zendesk ZDKZendeskEventAuthenticationFailed");
                              break;
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
        chatController.modalPresentationStyle = UIModalPresentationFullScreen;
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
      if (jwtToken == nil || jwtToken.length == 0) {
        reject(@"ZendeskLoginError", @"JWT token is empty", nil);
        return;
      }

      Zendesk *sdk = [Zendesk instance];
      if (sdk == nil) {
        reject(@"ZendeskLoginError", @"Zendesk is not initialized", nil);
        return;
      }

      NSLog(@"Attempting Zendesk JWT login");

      [sdk loginUserWith:jwtToken completionHandler:^(ZDKZendeskUser * _Nullable user, NSError * _Nullable error) {
        if (error) {
          NSLog(@"Zendesk login error: %@, userInfo: %@", error.localizedDescription, error.userInfo);
          reject(@"ZendeskLoginError", error.localizedDescription ?: @"Login failed", error);
        } else if (user == nil) {
          NSLog(@"Zendesk login returned no user and no error");
          reject(@"ZendeskLoginError", @"Login returned no user", nil);
        } else {
          //NSLog(@"Zendesk login succeeded for user: %@", user.externalId ?: user.name ?: @"<unknown>");
          resolve(@"User logged in successfully");
        }
      }];
    }
    @catch (NSException *exception) {
      NSLog(@"Zendesk login exception: %@", exception.reason);
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

  
RCT_EXPORT_METHOD(setConversationTags:(NSDictionary *)metadata
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    // Read isUAT flag from metadata (default to NO if not present)
    BOOL isUAT = NO;
    id isUATValue = metadata[@"isUAT"];
    if ([isUATValue isKindOfClass:[NSNumber class]]) {
      isUAT = [((NSNumber *)isUATValue) boolValue];
    } else if ([isUATValue isKindOfClass:[NSString class]]) {
      // Accept common string forms like "true"/"1"
      NSString *lower = [((NSString *)isUATValue) lowercaseString];
      isUAT = [lower isEqualToString:@"true"] || [lower isEqualToString:@"1"];
    }

    NSLog(@"Zendesk setConversationTags invoked. isUAT=%@", isUAT ? @"YES" : @"NO");

    NSMutableDictionary *fields = [NSMutableDictionary dictionary];

    if (isUAT) {
      if (metadata[@"userAgent"])       { fields[@"29230353527575"] = metadata[@"userAgent"]; }
      if (metadata[@"appVersion"])      { fields[@"29230349707159"] = metadata[@"appVersion"]; }
      if (metadata[@"timezoneOffsetId"]){ fields[@"29230359134487"] = metadata[@"timezoneOffsetId"]; }
      if (metadata[@"platform"])        { fields[@"29230381416087"] = metadata[@"platform"]; }
      if (metadata[@"locationHrefId"])  { fields[@"29230394216983"] = metadata[@"locationHrefId"]; }
      if (metadata[@"ipAddress"])       { fields[@"29230409854743"] = metadata[@"ipAddress"]; }
      if (metadata[@"firstName"])       { fields[@"28685404062615"] = metadata[@"firstName"]; }
      if (metadata[@"lastName"])        { fields[@"28685434553111"] = metadata[@"lastName"]; }
      if (metadata[@"name"])            { fields[@"28685420915607"] = metadata[@"name"]; }
      if (metadata[@"phone"])           { fields[@"28685420643991"] = metadata[@"phone"]; }
      if (metadata[@"accountNumber"])   { fields[@"28685413035543"] = metadata[@"accountNumber"]; }
      if (metadata[@"userName"])        { fields[@"29450503100695"] = metadata[@"userName"]; }
      if (metadata[@"customerType"])    { fields[@"28685435072023"] = metadata[@"customerType"]; }
      if (metadata[@"authLevel"])       { fields[@"29230167813271"] = metadata[@"authLevel"]; }
      if (metadata[@"mobileApp"])       { fields[@"29542765557655"] = metadata[@"mobileApp"]; }
      if (metadata[@"jwtId"])           { fields[@"29230180962071"] = metadata[@"jwtId"]; }
      if (metadata[@"source"])          { fields[@"40313200914455"] = metadata[@"source"]; }
    } else {
      // Prod mapping (existing behavior)
      if (metadata[@"userAgent"])        {fields[@"29542407930903"] = metadata[@"userAgent"];}
      if (metadata[@"appVersion"])       {fields[@"29542536141335"] = metadata[@"appVersion"];}
      if (metadata[@"timezoneOffsetId"]) {fields[@"29542663925271"] = metadata[@"timezoneOffsetId"];}
      if (metadata[@"platform"])         {fields[@"29542734993559"] = metadata[@"platform"];}
      if (metadata[@"locationHrefId"])   {fields[@"29230394216983"] = metadata[@"locationHrefId"];}
      if (metadata[@"ipAddress"])        {fields[@"29542809023767"] = metadata[@"ipAddress"];}
      if (metadata[@"firstName"])        {fields[@"360004035014"] = metadata[@"firstName"];}
      if (metadata[@"lastName"])         {fields[@"360003976113"] = metadata[@"lastName"];}
      if (metadata[@"name"])             {fields[@"360036705974"] = metadata[@"name"];}
      if (metadata[@"phone"])            {fields[@"360046174754"] = metadata[@"phone"];}
      if (metadata[@"accountNumber"])    {fields[@"360004035174"] = metadata[@"accountNumber"];}
      if (metadata[@"userName"])         {fields[@"29542395738007"] = metadata[@"userName"];}
      if (metadata[@"customerType"])     {fields[@"29542894274711"] = metadata[@"customerType"];}
      if (metadata[@"authLevel"])        {fields[@"29542032223895"] = metadata[@"authLevel"];}
      if (metadata[@"mobileApp"])        {fields[@"29542765557655"] = metadata[@"mobileApp"];}
      if (metadata[@"jwtId"])            {fields[@"29542045878167"] = metadata[@"jwtId"];}
    }
    [[Zendesk instance].messaging setConversationFields:fields];
    NSError *jsonError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:fields options:0 error:&jsonError];
    NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : [NSString stringWithFormat:@"<serialization error: %@>", jsonError.localizedDescription];
    NSLog(@"Zendesk metadata: %@", jsonString);
    resolve(@(YES));
  }
  @catch (NSException *exception) {
    NSLog(@"Zendesk metadata.\nError: %@", exception.reason);
    reject(@"set_tags_error", @"Failed to set conversation tags", nil);
  }
}



@end





