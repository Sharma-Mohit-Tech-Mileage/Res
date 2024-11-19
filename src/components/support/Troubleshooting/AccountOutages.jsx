import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, AccessibilityInfo, findNodeHandle } from 'react-native';
import { Color, Padding, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import WalletIcon from '../../../res/svgIcons/troubleshooting/WalletIcon';
import { Env } from '../../../network/apis/account/Constants';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import WaveAnimation from '../../common/WaveIcon';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TroubleshootComponent = ({ pageCount = 2 }) => {
    const navigation = useNavigation();
    const stepRef = useRef(null);
    const iconRef = useRef(null);
    const alertRef = useRef(null);
    const buttonRef = useRef(null);
    const [isAnnouncing, setIsAnnouncing] = useState(true);

    const calculateDelay = (text) => {
        const wordCount = text.trim().split(/\s+/).length;
        const wordsPerMinute = 150;
        const millisecondsPerWord = (60 / wordsPerMinute) * 1000;
        return Math.max(1500, wordCount * millisecondsPerWord);
    };

    const focusAndAnnounce = async (ref, text) => {
        const node = findNodeHandle(ref.current);
        if (node) {
            AccessibilityInfo.setAccessibilityFocus(node);
            await new Promise(resolve => setTimeout(resolve, calculateDelay(text)));
        }
    };

    useEffect(() => {
        let isActive = true;

        const manageFocus = async () => {
            const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
            if (!isEnabled) {
                setIsAnnouncing(false);
                return;
            }

            try {
                setIsAnnouncing(true);

                await focusAndAnnounce(stepRef, `Step ${pageCount} of 3`);
                if (!isActive) return;

                await focusAndAnnounce(iconRef, 'Issue detected');
                if (!isActive) return;

                await focusAndAnnounce(alertRef, 
                    "Uh oh! It looks like there's a Past Due balance on your account."
                );
                if (!isActive) return;

                await focusAndAnnounce(buttonRef, 'Pay Bill button');
                
                setIsAnnouncing(false);

            } catch (error) {
                console.error('Focus management error:', error);
                setIsAnnouncing(false);
            }
        };

        manageFocus();
        return () => {
            isActive = false;
        };
    }, [pageCount]);

    const handlePress = () => {
        if (!isAnnouncing) {
            navigation.navigate("ArticalWindowUtility", {
                url: `${Env.URL}/billing`,
                name: "Billing Details",
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text 
                ref={stepRef}
                style={styles.topLeftText}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Step ${pageCount} of 3`}
            >
                {pageCount} of 3
            </Text>
            
            <View style={styles.content}>
                <View 
                    ref={iconRef}
                    accessible={true}
                    accessibilityRole="image"
                    accessibilityLabel="Issue detected"
                >
                    <WaveAnimation loading={false} isIssueDetected={true}>
                        <WalletIcon width={80} height={80} />
                    </WaveAnimation>
                </View>

                <View
                    ref={alertRef}
                    style={styles.spinnerContainer}
                    accessible={true}
                    accessibilityRole="alert"
                >
                    <NotificationAlert
                        type="warning"
                        title="Uh oh. Looks like there is a past due balance on your account."
                        showCloseIcon={false}
                    />
                </View>

                <Pressable 
                    ref={buttonRef}
                    onPress={handlePress}
                    style={[
                        styles.button
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Pay Bill"
                    accessibilityHint="Navigates to billing details"
                >
                    <Text style={styles.accept}>Pay Bill</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: windowHeight * 0.05,
        backgroundColor: Color.sparklightWhite,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        justifyContent: 'center',
        width: '90%',
        marginVertical: Padding.p_base,
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        marginBottom: hp('15%'),
        width: '90%',
        paddingVertical: Padding.p_3xs,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    accept: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    textStyle: {
        color: '#292929',
        fontFamily: FontFamily.interBold,
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 18,
    },
    topLeftText: {
        position: 'absolute',
        top: 16,
        left: 16,
        color: '#292929',
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 28,
        padding: 10,
        zIndex: 1,
    },
});

export default TroubleshootComponent;