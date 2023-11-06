import React from 'react';
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    StyleSheet,
    AccessibilityInfo,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";

const ProfileSettingsHeader = ({ title, onPressBack }) => {
    return (
        <>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                style={[styles.profileSettingsChild, styles.iosstatusBarwhiteIconLayout]}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                useAngle={true}
                angle={90}
            />
            <View style={[styles.iosstatusBarwhiteParent, styles.iosstatusBarwhiteParentPosition]}>
                <View style={styles.navBar}>
                    <Text style={styles.title}>{title}</Text>
                    <Pressable
                        style={[styles.chevronLeft, styles.chevronLeftLayout]}
                        onPress={onPressBack}
                        accessibilityLabel="Back"
                        accessibilityHint="Go back to the previous screen"
                        accessibilityRole="button"
                        accessible={true}
                    >
                        <Image
                            style={styles.icon}
                            resizeMode="cover"
                            source={require("../../../assets/chevronleft.png")}
                            accessible={false} // Image is decorative
                        />
                    </Pressable>
                </View>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    profileSettingsChild: {
        height: "10.73%",
        top: "0%",
        right: "0%",
        bottom: "89.27%",
        left: "0%",
        maxWidth: "100%",
        maxHeight: "100%",
        position: "absolute",
        overflow: "hidden",
        width: "100%",
        zIndex:1
    },
    iosstatusBarwhiteIconLayout: {
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%",
    },
    iosstatusBarwhiteParentPosition: {
        width: '100%',
        left: 0,
        position: "absolute",
    },
    iosstatusBarwhiteParent: {
        top: 40,
        width: '100%',
        left: 0,
    },
    navBar: {
        height: 56,
        flexDirection: 'row', // Added for proper layout of children
        alignItems: 'center', // Added to center the title vertically
        paddingHorizontal: 32, // Added padding to ensure text has space to center
    },
    title: {
        flex: 1, // Added to ensure text takes up available space
        fontSize: FontSize.size_lg,
        textAlign: 'center', // Ensure text is centered horizontally
        fontWeight: '600',
        color: Color.sparklightWhite,
        fontFamily: FontFamily.openSansSemiBold,
        zIndex: 1
    },
    chevronLeft: {
        position: 'absolute', // Ensure position is absolute
        left: 18,
        top: 30, // Adjusted to center the icon vertically
        height: 48, // Ensure touch target is 48x48
        width: 48,
        justifyContent: 'center', // Center the icon
        alignItems: 'center',
        zIndex:1
    },
    chevronLeftLayout: {
        height: 24,
        width: 24,
    },
    
    icon: {
        height: 24, // Adjusted size
        width: 24,
    },
});

export default ProfileSettingsHeader;
