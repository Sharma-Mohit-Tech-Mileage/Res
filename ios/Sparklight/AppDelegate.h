#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <React/RCTLinkingManager.h>
#import "RNAppAuthAuthorizationFlowManager.h"


//@interface AppDelegate : RCTAppDelegate
@interface AppDelegate : RCTAppDelegate <RNAppAuthAuthorizationFlowManager>

 @property(nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate;
// Kept for SceneDelegate, which builds the React Native window once the scene connects.
@property(nonatomic, copy, nullable) NSDictionary *launchOptions;

@end
