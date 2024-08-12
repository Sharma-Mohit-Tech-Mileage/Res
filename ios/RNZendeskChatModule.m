#import "RNZendeskChatModule.h"
#import <MessagingSDK/MessagingSDK.h>
#import <MessagingAPI/MessagingAPI.h>
#import <CommonUISDK/CommonUISDK.h>
#import <ChatSDK/ChatSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>





@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);
ZDKChatAPIConfiguration *_visitorAPIConfig;

+ (void) init {

  
    [ZDKChat initializeWithAccountKey:@"4DZVK5GTMjPKd6rXN0jDsc2iPDdwVLgC" queue: dispatch_get_main_queue()];
    
}

RCT_EXPORT_METHOD(setVisitorInfo:(NSDictionary *)options) {
  if (!NSThread.isMainThread) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self setVisitorInfo:options];
    });
    return;
  }

  ZDKChat.instance.configuration = _visitorAPIConfig = [self applyVisitorInfo:options intoConfig: _visitorAPIConfig ?: [[ZDKChatAPIConfiguration alloc] init]];
}

- (ZDKChatAPIConfiguration*)applyVisitorInfo:(NSDictionary*)options intoConfig:(ZDKChatAPIConfiguration*)config {
  if (options[@"department"]) {
    config.departmentName = options[@"department"];
  }
  if (options[@"tags"]) {
    config.tags = options[@"tags"];
  }
  config.visitorInfo = [[ZDKVisitorInfo alloc] initWithName:options[@"name"]
                            email:options[@"email"]
                          phoneNumber:options[@"phone"]];

  NSLog(@"[RNZendeskChatModule] Applied visitor info: department: %@ tags: %@, email: %@, name: %@, phone: %@", config.departmentName, config.tags, config.visitorInfo.email, config.visitorInfo.name, config.visitorInfo.phoneNumber);
  return config;
}

- (ZDKClassicMessagingConfiguration *) messagingConfiguration {
    ZDKClassicMessagingConfiguration *config = [ZDKClassicMessagingConfiguration new];
    config.name = @"Sparklight Support";
    return config;
}

- (ZDKChatConfiguration *) chatConfiguration {
    ZDKChatConfiguration *config = [ZDKChatConfiguration new];
    config.isAgentAvailabilityEnabled = YES;
    return config;
}

- (ZDKChatAPIConfiguration *) chatAPIConfiguration:(NSDictionary *)options {
    ZDKChatAPIConfiguration *config = [ZDKChatAPIConfiguration new];
  if (options[@"tags"]) {
      config.tags = options[@"tags"];
    
    }
  
  config.departmentName = options[@"department"]; // Set the department
    return config;
}

RCT_EXPORT_METHOD(startChat:(NSDictionary *)config )
{
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ZDKChat instance] setConfiguration: [self chatAPIConfiguration : config]];
    NSError *error = nil;
    NSArray *engines = @[
         (id <ZDKEngine>) [ZDKChatEngine engineAndReturnError: &error]
     ];
    

    NSArray<id<ZDKConfiguration>> *configs = @[[self messagingConfiguration], [self chatConfiguration]];
    
   
        
        
    
    UIViewController *viewController = [ZDKClassicMessaging.instance buildUIWithEngines:engines
                                     configs:configs
                                       error:&error];
    
    UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
    if (rootViewController) {
        [rootViewController presentViewController:viewController animated:YES completion:^{
            //resolve(nil);
        }];
    } else {
        NSError *error = [NSError errorWithDomain:@"RNZendeskChatModule" code:500 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is not available"}];
        //reject(@"no_root_view_controller", @"Root view controller is not available", error);
    }
});

  
}



@end
