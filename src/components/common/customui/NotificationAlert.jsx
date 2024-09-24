import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, AccessibilityInfo } from 'react-native';
import { Color, FontSize, FontFamily } from '../../../../GlobalStyles';
import { useNavigation } from "@react-navigation/native";
import {  resentEmailVerifiction } from '../../../redux/actions/ProfileActionSuite';
import { useDispatch } from 'react-redux';
import RenderText from '../RenderText';

const NotificationAlert = ({ type, title, message, onClose, showCloseIcon = true, isVisible = true, resentemail = false }) => {
    if (!isVisible) return null;
    const dispatch = useDispatch();
    const typeStyles = {
        info: { color: Color.sparklightBrightPurple, image: require('../../../../assets/info.png') },
        error: { color: Color.sparkLightRed, image: require('../../../../assets/error.png') },
        success: { color: Color.sparklightGreen, image: require('../../../../assets/checkcircle.png') },
        warning: { color: Color.sparkLightInfo, image: require('../../../../assets/warning.png') },
    };

    const currentTypeStyle = typeStyles[type] || typeStyles.info;
    const navigation = useNavigation();

    const handleClose = () => {
        onClose && onClose(); // Call the onClose prop function if it exists
    };

    const handleResendEmail = () => {
         dispatch(resentEmailVerifiction(navigation));
    };

    const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

    useEffect(() => {
        async function getAccessibility() {
            try {
                const accessibility = await AccessibilityInfo.isScreenReaderEnabled();
                setIsScreenReaderEnabled(accessibility);
            } catch (error) {
                console.log(
                    "There has been a problem with AccessibilityInfo.isScreenReaderEnabled(): " +
                    error.message
                );
                setIsScreenReaderEnabled(false); // Setting a default value in case of error
            }
        }
        getAccessibility();
        const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
            "screenReaderChanged",
            (isScreenReaderEnabled) => {
                setIsScreenReaderEnabled(isScreenReaderEnabled);
            }
        );
        return () => {
            reduceMotionChangedSubscription.remove();
        };
    }, [screenReaderEnabled]);

    return (
        <View style={[styles.notificationContainer, { borderLeftColor: currentTypeStyle.color }]}>
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
                showCloseIcon ? { marginRight: 30 } : { marginRight: 10 }
            ]}>
                {title && <Text style={[styles.title, { color: currentTypeStyle.color }]}>{title}</Text>}
                {message ? (
                    <RenderText
                        navigation={navigation}
                        splitKey={`contact us`}
                        instruction={message}
                        isFromNotification={true}
                        style={!title ? styles.messageOnEmpty : styles.message}
                        onTextPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Support',
                                        params: { isContactUs: true }
                                    },
                                ],
                            });
                        }}
                    />
                ) : null}
                {resentemail && (
                    <Text
                        style={[styles.resendText]}
                        onPress={handleResendEmail}
                    >
                        Resend Email Confirmation
                    </Text>
                )}
            </View>
            {showCloseIcon && (
                <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    accessibilityHint="Closes the Notification window"
                >
                    <Image
                        source={require('../../../../assets/right-actionable7.png')}
                        accessibilityLabel="Close icon"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-start', // Align items to the start of the container
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
    },
    iconStyle: {
        height: 18,
        width: 18,
    },
    closeButton: {
        position: 'absolute', // Position the button absolutely
        top: '50%',           // Position halfway down the container
        justifyContent: 'center',
        alignItems: 'center',
        right: 10,
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