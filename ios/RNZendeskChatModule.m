#import "RNZendeskChatModule.h"
#import <MessagingSDK/MessagingSDK.h>
#import <MessagingAPI/MessagingAPI.h>
#import <CommonUISDK/CommonUISDK.h>
#import <ChatSDK/ChatSDK.h>
#import <ChatProvidersSDK/ChatProvidersSDK.h>
#import <CommonUISDK/CommonUISDK.h>
#import <AnswerBotProvidersSDK/AnswerBotProvidersSDK.h>

@implementation RNZendeskChatModule

RCT_EXPORT_MODULE(RNZendeskChatModule);
ZDKChatAPIConfiguration *_visitorAPIConfig;

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
    config.isMultilineResponseOptionsEnabled = YES;
    return config;
}

- (ZDKChatConfiguration *) chatConfiguration {
    ZDKChatConfiguration *config = [ZDKChatConfiguration new];
    
     config.isAgentAvailabilityEnabled = NO;
     config.isPreChatFormEnabled = YES;
     config.preChatFormConfiguration = [[ZDKChatFormConfiguration alloc] initWithName:ZDKFormFieldStatusRequired
                                                                                           email:ZDKFormFieldStatusOptional
                                                                                    phoneNumber:ZDKFormFieldStatusOptional
                                                                                      department:ZDKFormFieldStatusHidden];
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

RCT_EXPORT_METHOD(clearChatSession)
{
  [[ZDKChat instance] resetIdentity:^{
             // Completion block code here
         }];
}

- (void)resetSession {
  // Clear the visitor identity
  ZDKChatAPIConfiguration *config = [[ZDKChatAPIConfiguration alloc] init];
  config.visitorInfo = [[ZDKVisitorInfo alloc] initWithName:@"" email:@"" phoneNumber:@""];

  [[ZDKChat instance] resetIdentity:^{
             // Completion block code here
         }];
     
  NSLog(@"Helper method called");
}

UIViewController *viewController;
RCT_EXPORT_METHOD(startChat:(NSDictionary *)config )
{
  
  [[ZDKChat instance] setConfiguration: [self chatAPIConfiguration: config]];
  

  NSArray<id<ZDKConfiguration>> *configs = @[[self messagingConfiguration], [self chatConfiguration]];
  
  
  [[ZDKChat instance] setConfiguration: [self chatAPIConfiguration: config]];
  [ZDKCommonTheme currentTheme].primaryColor = [UIColor purpleColor];
  NSArray<id<ZDKConfiguration>> *configs1 = @[[self messagingConfiguration], [self chatConfiguration]];
  dispatch_async(dispatch_get_main_queue(), ^{

    NSError *error = nil;
    NSArray *engines = @[
      (id <ZDKEngine>) [ZDKChatEngine engineAndReturnError:&error]
    ];
   
    UIViewController *viewController = [ZDKClassicMessaging.instance buildUIWithEngines:engines
                                     configs:configs1
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
      UINavigationController *chatController = [[UINavigationController alloc] initWithRootViewController: viewController];
      [rootViewController presentViewController:chatController animated:YES completion:nil];
     
    } else {
        NSError *error = [NSError errorWithDomain:@"RNZendeskChatModule" code:500 userInfo:@{NSLocalizedDescriptionKey: @"Root view controller is not available"}];
    }
  });
}

- (UIViewController *)topViewController {
    UIViewController *rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    return [self getTopViewController:rootViewController];
}

- (UIViewController *)getTopViewController:(UIViewController *)viewController {
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        return [self getTopViewController:[(UINavigationController *)viewController topViewController]];
    } else if ([viewController isKindOfClass:[UITabBarController class]]) {
        return [self getTopViewController:[(UITabBarController *)viewController selectedViewController]];
    } else if (viewController.presentedViewController) {
        return [self getTopViewController:viewController.presentedViewController];
    }
    return viewController;
}

- (void)dismiss {
  NSLog(@"Chat Close called");
  UIViewController *currentVC = [self topViewController];

  // Dismiss the chat controller and reset the session after chat ends
  [currentVC dismissViewControllerAnimated:YES completion:^{

  }];
}

@end
