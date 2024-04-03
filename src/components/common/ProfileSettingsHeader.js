import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";

const ProfileSettingsHeader = ({
    title,
    onPressBack,
    iconAlignment = 'right',
    iconSource = require("../../../assets/chevronleft.png"), // Default icon source
    showIcon = true // New prop to control icon visibility
}) => {
    const [iconPressed, setIconPressed] = useState(false);
    const iconStyle = iconAlignment === 'left' ? styles.chevronRight : styles.chevronLeft;

    return (
        <>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                style={[styles.profileSettingsChild, { paddingTop: 40 }]}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                useAngle={true}
                angle={90}
            >
                <View style={[styles.navBar]}>
                    {showIcon && (
                        <Pressable
                            style={[iconStyle, styles.chevronLayout]}
                            onPress={onPressBack}
                            accessibilityLabel="Back Button"
                            accessibilityHint="Returns to the previous screen"
                            accessibilityRole="button"
                            accessible={true}
                            hitSlop={20}
                            onPressIn={() => setIconPressed(true)}
                            onPressOut={() => setIconPressed(false)}
                        >
                            <Image
                                style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                                resizeMode="cover"
                                source={iconSource}
                                accessible={false}
                            />
                        </Pressable>
                    )}
                    <Text style={styles.title} 
                    accessible={true}
                    accessibilityRole="header" // Indicates this is a header/title
                    accessibilityLabel={title} >{title}</Text>
                </View>
            </LinearGradient>
        </>
    );
};
const styles = StyleSheet.create({
    profileSettingsChild: {
        overflow: "hidden",
        width: "100%",
        zIndex: 1
    },
    navBar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center items in navBar
        paddingHorizontal: 8, // Added for spacing
    },
    title: {
        flex: 1,
        fontSize: FontSize.size_lg,
        textAlign: 'center',
        fontWeight: '600',
        color: Color.sparklightWhite,
        fontFamily: FontFamily.openSansSemiBold,
        padding: 8,
    },
    chevronLeft: {
        position: 'absolute',
        left: 18,
    },
    chevronRight: {
        position: 'absolute',
        right: 18,
    },
    chevronLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        width: 24,
        zIndex: 1
    },
    chevronLeftLayout: {
        height: 24,
        width: 24,
    },
    icon: {
        height: 24,
        width: 24,
    },
    iconPressed: { // Style for icon when pressed
        opacity: 0.5, // Change opacity on press
    },
});

export default ProfileSettingsHeader;
