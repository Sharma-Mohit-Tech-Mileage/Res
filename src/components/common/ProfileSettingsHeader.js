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
import { Padding, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ProfileSettingsHeader = ({ title, onPressBack }) => {
    const [iconPressed, setIconPressed] = useState(false); // State to manage icon press effect

    return (
        <>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                style={[styles.profileSettingsChild, { paddingTop: 40 }]}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                useAngle={true}
                angle={90}
            >
                <View style={[styles.navBar]}>
                    <Pressable
                        style={[styles.chevronLeft, styles.chevronLeftLayout]}
                        onPress={onPressBack}
                        accessibilityLabel="Back"
                        accessibilityHint="Go back to the previous screen"
                        accessibilityRole="button"
                        accessible={true}
                        hitSlop={20} // Increase touchable area
                        onPressIn={() => setIconPressed(true)} // Change state on press in
                        onPressOut={() => setIconPressed(false)} // Change state on press out
                    >
                        <Image
                            style={[styles.icon, iconPressed ? styles.iconPressed : null]} // Change style on press
                            resizeMode="cover"
                            source={require("../../../assets/chevronleft.png")}
                            accessible={false}
                        />
                    </Pressable>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </LinearGradient>
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
        zIndex: 1
    },
    navBar: {
        height: wp("15.73%"),
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
        justifyContent: 'center',
        alignItems: 'center',
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
