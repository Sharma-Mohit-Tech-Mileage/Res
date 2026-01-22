//
//  RNZendeskChatModule.h
//  My Sparklight
//
//  Created by Mohit Sharma on 8/1/24.
//

#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#define UIColorFromRGB(rgbValue) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:1.0]

@interface RNZendeskChatModule : NSObject <RCTBridgeModule>
@end