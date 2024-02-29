import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Color, FontSize, FontFamily, Padding } from '../../../../GlobalStyles';
import PubSub from 'pubsub-js';
import { useNavigation, CommonActions } from "@react-navigation/native";
const NotificationAlert = ({ type, title, message, onClose, showCloseIcon = true, isVisible = true }) => {
    if (!isVisible) return null;
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
                    <View style={!title ? styles.messageOnEmpty : styles.message}>
                        {message.split("Please contact us").map((part, index, arr) =>
                            index < arr.length - 1 ? (
                                <React.Fragment key={index}>
                                    <Text>{part}</Text>
                                    <Text>
                                        {'\nPlease '}
                                        <Text
                                            style={styles.contactUsText}
                                            onPress={() => {
                                                navigation.navigate("Support", {
                                                    isContactUs: true,
                                                });
                                            }}
                                            accessible={true}
                                            accessibilityLabel="Contact us"
                                            accessibilityRole="button"
                                            accessibilityHint="Navigates to the support screen"
                                        >
                                            contact us
                                        </Text>
                                    </Text>
                                </React.Fragment>
                            ) : (
                                <Text key={index}>{part}</Text>
                            )
                        )}
                    </View>
                ) : null}



            </View>
            {showCloseIcon && (
                <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                    accessibilityHint="Closes the Notifiction window"
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
    },
    messageOnEmpty: {
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
        fontWeight: '400',
        color: Color.colorGray_200,
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
});

export default NotificationAlert;
