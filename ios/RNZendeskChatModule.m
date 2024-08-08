#import "RNZendeskChatModule.h"
#import <MessagingSDK/MessagingSDK.h>
#import <MessagingAPI/MessagingAPI.h>
#import <CommonUISDK/CommonUISDK.h>
#import <ChatSDK/ChatSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>





@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);


+ (void) init {

  
    [ZDKChat initializeWithAccountKey:@"4DZVK5GTMjPKd6rXN0jDsc2iPDdwVLgC" queue: dispatch_get_main_queue()];
    
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
  dispatch_async(dispatch_get_main_queue(), ^{
          UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
          if (rootViewController) {
              [rootViewController presentViewController:viewController animated:YES completion:^{
                  resolve(nil);
              }];
          } else {
              NSError *error = [NSError errorWithDomain:@"RNZendeskChatModule" code:500 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is not available"}];
              reject(@"no_root_view_controller", @"Root view controller is not available", error);
          }
      });

    
}

@end
