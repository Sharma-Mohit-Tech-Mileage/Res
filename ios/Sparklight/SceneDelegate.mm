#import "SceneDelegate.h"
#import "AppDelegate.h"
#import <React/RCTLinkingManager.h>
#import <RCTRootViewFactory.h>
#import <React/RCTConstants.h>

@implementation SceneDelegate

- (AppDelegate *)appDelegate
{
  return (AppDelegate *)UIApplication.sharedApplication.delegate;
}

- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }
  AppDelegate *appDelegate = [self appDelegate];
  // A cold start from a URL arrives here, not in launchOptions, so hand it to React Native the way Linking.getInitialURL() expects.
  NSMutableDictionary *launchOptions = [appDelegate.launchOptions mutableCopy] ?: [NSMutableDictionary new];
  NSURL *launchURL = connectionOptions.URLContexts.anyObject.URL;
  if (launchURL != nil) {
    launchOptions[UIApplicationLaunchOptionsURLKey] = launchURL;
  }
  // Mirrors RCTAppDelegate's loadReactNativeWindow:, except the window is created from the scene.
  UIView *rootView = [appDelegate.rootViewFactory viewWithModuleName:appDelegate.moduleName
                                                   initialProperties:appDelegate.initialProps
                                                       launchOptions:launchOptions];
  UIViewController *rootViewController = [appDelegate createRootViewController];
  [appDelegate setRootView:rootView toRootViewController:rootViewController];
  UIWindow *window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
  window.rootViewController = rootViewController;
  self.window = window;
  // React Native still reaches the window through the app delegate (RCTLogBoxView, RCTKeyWindow).
  appDelegate.window = window;
  [window makeKeyAndVisible];
  for (NSUserActivity *activity in connectionOptions.userActivities) {
    [self continueUserActivity:activity];
  }
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
{
  // Same path as application:openURL:options: — app-auth redirect first, then Linking.
  for (UIOpenURLContext *context in URLContexts) {
    [[self appDelegate] application:UIApplication.sharedApplication openURL:context.URL options:@{}];
  }
}

- (void)scene:(UIScene *)scene continueUserActivity:(NSUserActivity *)userActivity
{
  [self continueUserActivity:userActivity];
}

- (void)continueUserActivity:(NSUserActivity *)userActivity
{
  [RCTLinkingManager application:UIApplication.sharedApplication
            continueUserActivity:userActivity
              restorationHandler:^(NSArray<id<UIUserActivityRestoring>> *_Nullable restorableObjects) {}];
}

- (void)windowScene:(UIWindowScene *)windowScene
    didUpdateCoordinateSpace:(id<UICoordinateSpace>)previousCoordinateSpace
        interfaceOrientation:(UIInterfaceOrientation)previousInterfaceOrientation
             traitCollection:(UITraitCollection *)previousTraitCollection
{
  // Same notification RCTAppDelegate posts as scene delegate, so Dimensions refresh on rotation and split view.
  [[NSNotificationCenter defaultCenter] postNotificationName:RCTWindowFrameDidChangeNotification object:self];
}

@end
