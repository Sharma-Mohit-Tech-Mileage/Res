#import "RNZendeskChatModule.h"
#import <MessagingSDK/MessagingSDK.h>
#import <MessagingAPI/MessagingAPI.h>
#import <CommonUISDK/CommonUISDK.h>
#import <ChatSDK/ChatSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>
#import <CommonUISDK/CommonUISDK.h>





@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);
ZDKChatAPIConfiguration *_visitorAPIConfig;
UINavigationController *_chatController;

- (UIColor *)colorFromHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}

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
  
  config.department = options[@"department"]; // Set the department
  [ZDKChat instance].configuration = config;
    return config;
}

//[[ZDKChat instance] endChat];

RCT_EXPORT_METHOD(clearChatSession)
{
  [[ZDKChat instance] resetIdentity];
}

RCT_EXPORT_METHOD(startChat:(NSDictionary *)config )
{
  [[ZDKChat instance] setConfiguration: [self chatAPIConfiguration : config]];
  [ZDKCommonTheme currentTheme].primaryColor = [UIColor purpleColor];
  
  dispatch_async(dispatch_get_main_queue(), ^{
   
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
      // Define your custom color using the hex code EAEAEA
      UIColor *customColor = [UIColor colorWithRed:234/255.0 green:234/255.0 blue:234/255.0 alpha:1.0];

      // Set the custom color as the bar tint color
      [[UINavigationBar appearance] setBarTintColor:customColor];
      viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithTitle: @"Close"
                                                                                                   style: UIBarButtonItemStylePlain
                                                                                                  target: self
                                                                                                  action: @selector(dismiss)];
//      [viewController.navigationItem.leftBarButtonItem setTitleTextAttributes:
//                [NSDictionary dictionaryWithObjectsAndKeys:
//                     [UIColor whiteColor], NSForegroundColorAttributeName,nil]
//                                                  forState:UIControlStateNormal];
      _chatController = [[UINavigationController alloc] initWithRootViewController: viewController];
          //[self.navigationController presentViewController:chatController animated:YES completion:nil];
        [rootViewController presentViewController:_chatController animated:YES completion:^{
            //resolve(nil);
        }];
    } else {
        NSError *error = [NSError errorWithDomain:@"RNZendeskChatModule" code:500 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is not available"}];
        //reject(@"no_root_view_controller", @"Root view controller is not available", error);
    }
});

  
}

- (void) dismiss {
  NSLog(@"Chat Close called");
  
  //[_chatController popViewControllerAnimated:YES];
  [_chatController dismissViewControllerAnimated:YES completion:nil];

 // [[ZDKChat instance] resetIdentity ];
  
}

@end
