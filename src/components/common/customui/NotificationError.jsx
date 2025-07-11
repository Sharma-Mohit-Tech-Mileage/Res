import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Color, FontSize, FontFamily } from '../../../../GlobalStyles';
import { useNavigation } from "@react-navigation/native";

const NotificationError = ({ type, title, message, onClose, showCloseIcon = true, isVisible = true }) => {
    if (!isVisible) return null;
    
   const typeStyles = {
         info: { 
             backgroundColor: '#F0F8FF',
             borderColor: '#0060AE',
             iconColor: Color.sparklightBrightPurple,
             textColor: '#000000',
             titleColor: '#0060AE',
             closeButtonColor: '#0060AE',
             image: require('../../../../assets/Icon/Info.png') 
         },
         error: { 
             backgroundColor: '#FEF3F2',
             borderColor: '#B92A1C',
             iconColor: Color.sparkLightRed,
             textColor: '#000000',
             titleColor: '#B92A1C',
             closeButtonColor: '#B92A1C',
             image: require('../../../../assets/Icon/CircleAlert.png') 
         },
         success: { 
             backgroundColor: '#F1FCF2',
             borderColor: '#1D7832',
             iconColor: Color.sparklightGreen,
             textColor: '#000000',
             titleColor: '#1D7832',
             closeButtonColor: '#1D7832',
             image: require('../../../../assets/Icon/CircleCheck.png') 
         },
         warning: { 
             backgroundColor: '#FFFAEB',
             borderColor: '#DD6D02',
             iconColor: Color.sparkLightInfo,
             textColor: '#000000',
             titleColor: '#DD6D02',
             closeButtonColor: '#DD6D02',
             image: require('../../../../assets/Icon/TriangleAlert.png') 
         },
     };

    const currentTypeStyle = typeStyles[type] || typeStyles.info;
    const navigation = useNavigation();
    
    const handleClose = () => {
        onClose && onClose(); // Call the onClose prop function if it exists
    };
    
    return (
        <View style={[
            styles.notificationContainer, 
            { 
                backgroundColor: currentTypeStyle.backgroundColor,
                borderColor: currentTypeStyle.borderColor,
            }
        ]}>
            <Image
                source={currentTypeStyle.image}
                resizeMode="contain"
                style={[
                    styles.iconStyle,
                    { marginTop: !title ? 1 : 1 }
                ]}
            />
            <View style={[
                styles.textContentContainer,
                showCloseIcon ? { marginRight: 30 } : { marginRight: 0 }
            ]}>
                {title && (
                    <Text style={[
                        styles.title, 
                        { color: currentTypeStyle.titleColor }
                    ]}>
                        {title}
                    </Text>
                )}
                <Text style={[
                    !title ? styles.messageOnEmpty : styles.message,
                    { color: currentTypeStyle.textColor }
                ]}>
                    {message}
                </Text>
            </View>
            {showCloseIcon && (
                <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    accessibilityHint="Closes the Notification window"
                >
                    <Text style={[styles.closeButtonText, { color: currentTypeStyle.closeButtonColor }]}>
                        ✕
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        flexDirection: 'row',
       alignItems: 'flex-start',
       borderRadius: 8,
       borderWidth: 1,
       paddingLeft: 16,
       paddingRight: 12,
       paddingVertical: 16,
        marginHorizontal: 16,
       marginVertical: 8,
    },
    textContentContainer: {
        flex: 1,
        marginLeft: 12,
    },
    iconStyle: {
        height: 20,
        width: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 8,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
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
    },
    messageOnEmpty: {
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
        fontWeight: '400',
    },
    contactUsText: {
        color: '#000000',
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "700",
        paddingLeft: 5,
        flexWrap: 'wrap'
    },
});

export default NotificationError;