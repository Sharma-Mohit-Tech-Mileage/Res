import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    Pressable,
    Image,
    StyleSheet,
    AccessibilityInfo,
    TouchableOpacity,
    Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import ChatIcon from '../../res/svgIcons/ChatIcon';
import {
    startChatWithConfig,
    initChat,
    startChat,
    clearChatData,
  } from "../utility/RNZendeskChat";

const ProfileSettingsHeader = ({
    title,
    onPressBack,
    iconAlignment = 'right',
    iconSource = require("../../../assets/chevronleft.png"),
    showIcon = true,
    onPressChat
}) => {
    const [iconPressed, setIconPressed] = useState(false);
    const handlePressIn = () => {
        setIconPressed(true);
        AccessibilityInfo.announceForAccessibility('Back button pressed');
    };

    const handlePressOut = () => {
        setIconPressed(false);
    };

    return (
        <View style={styles.perusable}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                style={styles.profileSettingsChild}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                useAngle={true}
                angle={90}
            >
                <View style={styles.navBar}>
                    {showIcon && (
                        <>
                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={styles.pressable}
                                onPress={onPressBack}
                                accessible={true}
                                accessibilityLabel="Back"
                                accessibilityHint="Press to return to the previous screen"
                                accessibilityRole="button"
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                            >
                                <Image
                                    style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                                    resizeMode="cover"
                                    source={iconSource}
                                />
                            </Pressable>
                        </View>
                   
                    <View style={styles.titleContainer}>
                        <Text 
                            style={styles.title}
                            accessible={true}
                            accessibilityRole="header"
                            accessibilityLabel={`Header: ${title}`}
                        >
                            {title}
                        </Text>
                    </View>
                    </>
                     )}
                    <TouchableOpacity style={[styles.iconChat,{flex:showIcon?0.1:1}]} onPress={()=>{
                         if (Platform.OS === "ios") {
                            startChat();
                          } else {
                            startChatWithConfig({});
                          }
                  }}>
                    <ChatIcon />
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    perusable: {
        //flex: 1,
        width:'100%'
    },
    profileSettingsChild: {
        overflow: "hidden",
        width: "100%",
        paddingTop: 40,
    },
    navBar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    buttonContainer: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressable: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        width: 24,
    },
    title: {
        fontSize: FontSize.size_lg,
        fontWeight: '600',
        color: Color.sparklightWhite,
        fontFamily: FontFamily.openSansSemiBold,
    },
    icon: {
        height: 24,
        width: 24,
    },
    iconPressed: {
        opacity: 0.5,
    },iconChat:{
        alignItems:'flex-end',
        flex:1
    }
});

export default ProfileSettingsHeader;
