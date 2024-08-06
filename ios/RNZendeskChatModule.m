#import "RNZendeskChatModule.h"
#import <ZendeskSDKMessaging/ZendeskSDKMessaging.h>
#import <ZendeskSDK/ZendeskSDK.h>
#import <ZendeskCoreSDK/ZendeskCoreSDK.h>




@implementation RNZendeskChatModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSString *)appId clientId:(NSString *)clientId zendeskUrl:(NSString *)zendeskUrl accountKey:(NSString *)accountKey)
{
    [ZDKZendesk initializeWithAppId:appId clientId:clientId zendeskUrl:zendeskUrl];
    [ZDKChat initializeWithAccountKey:accountKey];
  [ZDKChat initializeWithAccountKey: <#accountKey#>, queue: dispatch_get_main_queue()];
}

RCT_EXPORT_METHOD(startChat:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
//    ZDKVisitorInfo *visitorInfo = [[ZDKVisitorInfo alloc] initWithName:config[@"name"]
//                                                                 email:config[@"email"]
//                                                          phoneNumber:config[@"phone"]];
//    [[ZDKChat instance].providers.profileProvider setVisitorInfo:visitorInfo completion:nil];
//
//    ZDKChatConfiguration *chatConfiguration = [[ZDKChatConfiguration alloc] init];
//    chatConfiguration.isAgentAvailabilityEnabled = NO;

    // Create an instance of ZDKClassicMessagingConfiguration
    ZDKClassicMessagingConfiguration *classicConfig = [[ZDKClassicMessagingConfiguration alloc] init];
    classicConfig.isAgentAvailabilityEnabled = YES;  // Customize your classic messaging configuration here

    UIViewController *chatViewController = [ZDKMessaging.instance buildUIWithEngines:@[ZDKChatEngine.engine]
                                                                             configs:@[chatConfiguration, classicConfig]];  // Add classicConfig

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
