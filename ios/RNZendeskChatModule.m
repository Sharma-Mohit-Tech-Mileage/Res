#import "RNZendeskChatModule.h"
#import <ZendeskCoreSDK/ZendeskCoreSDK.h>
#import <SupportProvidersSDK/SupportProvidersSDK.h>
#import <AnswerBotProvidersSDK/AnswerBotProvidersSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>


@implementation RNZendeskChatModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSString *)accountKey)
{
  
  [ZDKChat initializeWithAccountKey: accountKey queue: dispatch_get_main_queue()];

}


RCT_EXPORT_METHOD(startChat:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    ZDKVisitorInfo *visitorInfo = [[ZDKVisitorInfo alloc] initWithName:config[@"name"]
                                                                 email:config[@"email"]
                                                          phoneNumber:config[@"phone"]];
    [[ZDKChat instance].providers.profileProvider setVisitorInfo:visitorInfo completion:nil];

  ZDKChatAPIConfiguration *chatConfiguration = [[ZDKChatAPIConfiguration alloc] init];
  
  ZDKClassicMessagingConfiguration *messagingConfiguration = [ZDKClassicMessagingConfiguration new];
      NSError *error = nil;
      NSArray *engines = @[
          (id <ZDKEngine>) [ZDKAnswerBotEngine engineAndReturnError:&error],
          (id <ZDKEngine>) [ZDKSupportEngine engineAndReturnError:&error],
          (id <ZDKEngine>) [ZDKChatEngine engineAndReturnError:&error]
      ];

      return [[ZDKClassicMessaging instance] buildUIWithEngines:engines
                                                 configs:@[messagingConfiguration]
                                                   error:&error];
    

    UIViewController *chatViewController = [ZDKMessaging.instance buildUIWithEngines:@[ZDKChatEngine.engine] configs:@[chatConfiguration]];
  
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
        if (rootViewController) {
            [rootViewController presentViewController:chatViewController animated:YES completion:^{
                resolve(nil);
            }];
        } else {
            NSError *error = [NSError errorWithDomain:@"RNZendeskChatModule" code:500 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is not available"}];
            reject(@"no_root_view_controller", @"Root view controller is not available", error);
        }
    });
}

@end

