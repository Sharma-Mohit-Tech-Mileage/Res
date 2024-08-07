#import "RNZendeskChatModule.h"
#import <MessagingSDK/MessagingSDK.h>
#import <MessagingAPI/MessagingAPI.h>
#import <CommonUISDK/CommonUISDK.h>
#import <ChatSDK/ChatSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>





@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);

RCT_EXPORT_METHOD(initialize:(NSString *)accountKey)
{
    
  [ZDKChat initializeWithAccountKey: accountKey queue: dispatch_get_main_queue()];
}

- (ZDKClassicMessagingConfiguration *) messagingConfiguration {
    ZDKClassicMessagingConfiguration *config = [ZDKClassicMessagingConfiguration new];
    config.name = @"Sparklight Bot";
    config.isMultilineResponseOptionsEnabled = YES;
    return config;
}

- (ZDKChatConfiguration *) chatConfiguration {
    ZDKChatConfiguration *config = [ZDKChatConfiguration new];
    config.isAgentAvailabilityEnabled = NO;
    config.isPreChatFormEnabled = YES;
    return config;
}

- (ZDKChatAPIConfiguration *) chatAPIConfiguration {
    ZDKChatAPIConfiguration *config = [ZDKChatAPIConfiguration new];
    config.tags = @[@"iOS", @"chat_v2"];
    return config;
}

RCT_EXPORT_METHOD(startChat:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[ZDKChat instance] setConfiguration: [self chatAPIConfiguration]];
  NSError *error = nil;
  NSArray *engines = @[
       (id <ZDKEngine>) [ZDKChatEngine engineAndReturnError: &error]
   ];

  NSArray<id<ZDKConfiguration>> *configs = @[[self messagingConfiguration], [self chatConfiguration]];
  

   //[[ZDKClassicMessaging instance] buildUIWithEngines: engines configs:configs error: &error];
  UIViewController *viewController = [ZDKClassicMessaging.instance buildUIWithEngines:engines
                                   configs:configs
                                     error:&error];
      if (!!error) {
        NSLog(@"[RNZendeskChatModule] Internal Error building ZDKMessagingUI %@",error);
        return;
      }

    
}

@end
