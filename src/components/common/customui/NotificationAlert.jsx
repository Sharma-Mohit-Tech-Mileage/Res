import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, AccessibilityInfo } from 'react-native';
import { Color, FontSize, FontFamily } from '../../../../GlobalStyles';
import { useNavigation } from "@react-navigation/native";
import { resentEmailVerifiction } from '../../../redux/actions/ProfileActionSuite';
import { useDispatch } from 'react-redux';
import RenderText from '../RenderText';

const NotificationAlert = ({ 
   type, 
   title, 
   message, 
   onClose, 
   showCloseIcon = true, 
   isVisible = true, 
   resentemail = false,
   splitKey = 'contact us'
}) => {
   if (!isVisible) return null;
   
   const dispatch = useDispatch();
   const navigation = useNavigation();
   const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

   const typeStyles = {
       info: { color: Color.sparklightBrightPurple, image: require('../../../../assets/info.png') },
       error: { color: Color.sparkLightRed, image: require('../../../../assets/error.png') },
       success: { color: Color.sparklightGreen, image: require('../../../../assets/checkcircle.png') },
       warning: { color: Color.sparkLightInfo, image: require('../../../../assets/warning.png') },
   };

   const currentTypeStyle = typeStyles[type] || typeStyles.info;

   useEffect(() => {
       const checkAccessibility = async () => {
           try {
               const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
               setIsScreenReaderEnabled(isEnabled);
           } catch (error) {
               console.log("AccessibilityInfo error:", error.message);
               setIsScreenReaderEnabled(false);
           }
       };

       checkAccessibility();
       const subscription = AccessibilityInfo.addEventListener(
           "screenReaderChanged",
           setIsScreenReaderEnabled
       );

       return () => subscription.remove();
   }, []);

   const handleClose = () => onClose?.();
   const handleResendEmail = () => dispatch(resentEmailVerifiction(navigation));

   const renderMessageWithBoldAccount = (message) => {
       if (splitKey === 'Account') {
           const parts = message.split('Account');
           return (
               <Text style={!title ? styles.messageOnEmpty : styles.message}>
                   {parts.map((part, i) => (
                       <React.Fragment key={i}>
                           {part}
                           {i < parts.length - 1 && <Text style={styles.boldText}>Account</Text>}
                       </React.Fragment>
                   ))}
               </Text>
           );
       }

       return (
           <RenderText
               navigation={navigation}
               splitKey={splitKey}
               instruction={message}
               isFromNotification={true}
               style={!title ? styles.messageOnEmpty : styles.message}
               onTextPress={() => {
                   navigation.reset({
                       index: 0,
                       routes: [{ name: 'Support', params: { isContactUs: true } }],
                   });
               }}
           />
       );
   };

   return (
       <View style={styles.outerContainer}>
           <View 
               style={[styles.notificationContainer, { borderLeftColor: currentTypeStyle.color }]}
               accessible={true}
               accessibilityLabel={`${type} notification: ${title || ''} ${message || ''}`}
               accessibilityLiveRegion="polite"
           >
               <Image
                   source={currentTypeStyle.image}
                   resizeMode="contain"
                   style={[styles.iconStyle, { marginTop: !title ? 1 : 1 }]}
                   accessible={false}
                   importantForAccessibility="no"
               />
               
               <View style={styles.textContentContainer}>
                   {title && (
                       <Text 
                           style={[styles.title, { color: currentTypeStyle.color }]}
                           accessible={true}
                           accessibilityRole="text"
                       >
                           {title}
                       </Text>
                   )}
                   
                   {message && renderMessageWithBoldAccount(message)}
                   
                   {resentemail && (
                       <TouchableOpacity
                           onPress={handleResendEmail}
                           accessible={true}
                           accessibilityRole='link'
                           accessibilityLabel="Resend Email Confirmation"
                           accessibilityHint="Double tap to resend the confirmation email"
                           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                       >
                           <Text style={styles.resendText}>
                               Resend Email Confirmation
                           </Text>
                       </TouchableOpacity>
                   )}
               </View>

               {showCloseIcon && (
                   <TouchableOpacity
                       onPress={handleClose}
                       style={styles.closeButton}
                       accessible={true}
                       accessibilityLabel="Close notification"
                       accessibilityHint="Double tap to close"
                       hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                   >
                       <Image
                           source={require('../../../../assets/right-actionable7.png')}
                           accessible={false}
                           importantForAccessibility="no"
                       />
                   </TouchableOpacity>
               )}
           </View>
       </View>
   );
};

const styles = StyleSheet.create({
   outerContainer: {
       position: 'relative',
   },
   notificationContainer: {
       backgroundColor: '#fff',
       flexDirection: 'row',
       alignItems: 'flex-start',
       borderLeftWidth: 4,
       borderRadius: 2,
       borderTopWidth: 1,
       borderBottomWidth: 1,
       borderRightWidth: 1,
       paddingLeft: 10,
       paddingVertical: 10,
       borderBottomColor: '#E1E1E1',
       borderEndColor: '#E1E1E1',
       borderTopColor: '#E1E1E1'
   },
   textContentContainer: {
       flex: 1,
       marginLeft: 8,
       paddingRight: 35, // Just enough space for the close button
   },
   iconStyle: {
       height: 18,
       width: 18,
   },
   closeButton: {
       position: 'absolute',
       top: 0,
       right: 0,
       width: 44,
       height: 44,
       justifyContent: 'center',
       alignItems: 'center',
   },
   title: {
       fontSize: FontSize.size_base,
       fontFamily: FontFamily.interBold,
       fontWeight: '700',
   },
   message: {
       paddingTop: 8,
       fontSize: FontSize.size_sm,
       fontFamily: FontFamily.openSansRegular,
       fontWeight: '400',
       color: Color.colorGray_200,
       paddingLeft: 0,
       paddingRight: 0,
   },
   messageOnEmpty: {
       fontSize: FontSize.size_sm,
       fontFamily: FontFamily.openSansRegular,
       fontWeight: '400',
       color: Color.colorGray_200,
       paddingLeft: 0,
       paddingRight: 0,
   },
   boldText: {
       fontWeight: '700',
       fontFamily: FontFamily.openSansSemiBold,
       color: Color.colorGray_200,
       fontSize: FontSize.size_sm,
   },
   contactUsText: {
       color: Color.colorMidnightblue,
       fontFamily: FontFamily.openSansSemiBold,
       fontSize: 16,
       fontStyle: "normal",
       fontWeight: "700",
       paddingLeft: 5,
       flexWrap: 'wrap'
   },
   resendText: {
       color: Color.colorMidnightblue,
       fontFamily: FontFamily.openSansSemiBold,
       fontSize: 16,
       fontStyle: "normal",
       fontWeight: "700",
       paddingTop: 8,
       textDecorationLine: 'underline',
   },
});

export default NotificationAlert;