#import <UIKit/UIKit.h>

// The iOS 27 SDK refuses to launch apps without the UIScene life cycle; this owns the window RCTAppDelegate used to create.
@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>

@property (nonatomic, strong, nullable) UIWindow *window;

@end
