//#import "RNZendeskChatModule.h"
//#import <ZendeskSDK/ZendeskSDK.h>
//#import <ZendeskChatSDK/ZendeskChatSDK.h>
//
//@implementation RNZendeskChatModule
//
//RCT_EXPORT_MODULE();
//
//RCT_EXPORT_METHOD(initialize:(NSString *)appId clientId:(NSString *)clientId zendeskUrl:(NSString *)zendeskUrl accountKey:(NSString *)accountKey)
//{
//    [ZDKZendesk initializeWithAppId:appId clientId:clientId zendeskUrl:zendeskUrl];
//    [ZDKChat initializeWithAccountKey:accountKey];
//}
//
//RCT_EXPORT_METHOD(startChat:(NSDictionary *)config)
//{
//    ZDKVisitorInfo *visitorInfo = [[ZDKVisitorInfo alloc] initWithName:config[@"name"]
//                                                                 email:config[@"email"]
//                                                          phoneNumber:config[@"phone"]];
//    [[ZDKChat instance].providers.profileProvider setVisitorInfo:visitorInfo completion:nil];
//
//    ZDKChatConfiguration *chatConfiguration = [[ZDKChatConfiguration alloc] init];
//    chatConfiguration.isAgentAvailabilityEnabled = NO;
//
//    UIViewController *chatViewController = [ZDKMessaging.instance buildUIWithEngines:@[ZDKChatEngine.engine]
//                                                                             configs:@[chatConfiguration]];
//    dispatch_async(dispatch_get_main_queue(), ^{
//        UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
//        [rootViewController presentViewController:chatViewController animated:YES completion:nil];
//    });
//}

@end
