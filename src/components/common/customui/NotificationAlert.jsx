import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Color, FontSize, FontFamily, Padding } from '../../../../GlobalStyles';

const NotificationAlert = ({ type, title, message, onClose, showCloseIcon = true, isVisible = true }) => {
    if (!isVisible) return null;
    const typeStyles = {
        info: { color: Color.sparklightBrightPurple, image: require('../../../../assets/info.png') },
        error: { color: Color.sparkLightRed, image: require('../../../../assets/error.png') },
        success: { color: Color.sparklightGreen, image: require('../../../../assets/success.png') },
        warning: { color: Color.sparkLightInfo, image: require('../../../../assets/warning.png') },
    };

    const currentTypeStyle = typeStyles[type] || typeStyles.info;
    const handleClose = () => {
        onClose && onClose(); // Call the onClose prop function if it exists
    };
    return (
        <View style={[styles.notificationContainer, { borderLeftColor: currentTypeStyle.color }]}>
            <Image source={currentTypeStyle.image} style={styles.iconStyle} />
            <View style={[
                styles.textContentContainer,
                showCloseIcon ? { marginRight: 30 } : { marginRight: 10 } // Apply marginRight only if showCloseIcon is true
            ]}>
                <Text style={[styles.title, { color: currentTypeStyle.color }]}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
            </View>
            {showCloseIcon && (
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Image source={require('../../../../assets/right-actionable7.png')} />
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
        borderTopWidth:1,
        borderBottomWidth:1,
        borderRightWidth:1,
        paddingLeft: 10,
        paddingVertical:10,
        borderBottomColor: '#E1E1E1',
        borderEndColor: '#E1E1E1',
        borderTopColor: '#E1E1E1'
    },
    textContentContainer: {
        flex: 1,
        marginLeft: 8,
    },
    iconStyle: {
        marginTop: 4, // Adjust top margin to align with the title
    },
    closeButton: {
        position: 'absolute', // Position the button absolutely
        top: '50%',           // Position halfway down the container
        justifyContent: 'center',
        alignItems: 'center',
        right:10,
    },
    title: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.interBold,
        fontWeight: '700',
    },
    message: {
        paddingTop:8,
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansRegular,
        fontWeight: '400',
        color: Color.colorGray_200,
    },
});

export default NotificationAlert;
