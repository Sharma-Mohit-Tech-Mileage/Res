import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, findNodeHandle, AccessibilityInfo } from 'react-native';
import { Color, Padding, FontSize, FontFamily } from "../../../../GlobalStyles";
import NotificationAlert from "../../common/customui/NotificationAlert";
import OutageAreaIcon from '../../../res/svgIcons/troubleshooting/OutageAreaIcon';
import WaveAnimation from '../../common/WaveIcon';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TroubleshootComponent = ({
    step = 1,
    title,
    description,
    success,
    pageCount
}) => {
    const stepRef = useRef(null);
    const iconRef = useRef(null);
    const alertRef = useRef(null);

    const focusAndAnnounce = async (ref, text) => {
        const node = findNodeHandle(ref.current);
        if (node) {
            AccessibilityInfo.setAccessibilityFocus(node);
            AccessibilityInfo.announceForAccessibility(text);
        }
    };

    useEffect(() => {
        const manageFocus = async () => {
            const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
            if (!isEnabled) return;

            try {
                // Step announcement
                await focusAndAnnounce(stepRef, `Step ${step} of 3`);
                
                // Icon status
                await focusAndAnnounce(iconRef, 'Outage detected in your area');

                // Alert message
                await focusAndAnnounce(alertRef, 
                    `Uh oh. You may be experiencing an outage in your area. Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. Estimated Time to Restore: ${description}`
                );
            } catch (error) {
                console.error('Focus management error:', error);
            }
        };

        manageFocus();
    }, [step, description]);

    return (
        <View style={styles.container}>
            <Text 
                ref={stepRef}
                style={styles.topLeftText}
                accessible={true}
                accessibilityRole="header"
                importantForAccessibility="yes"
                accessibilityLabel={`Step ${step} of 3`}
            >
                {step}/3
            </Text>

            <View style={styles.content}>
                <View
                    ref={iconRef}
                    accessible={true}
                    accessibilityRole="image"
                    importantForAccessibility="yes"
                    accessibilityLabel="Outage detected in your area"
                >
                    <WaveAnimation loading={false} isIssueDetected={true}>
                        <OutageAreaIcon width={80} height={80} />
                    </WaveAnimation>
                </View>

                <View
                    ref={alertRef}
                    style={styles.spinnerContainer}
                    accessible={true}
                    accessibilityRole="alert"
                    importantForAccessibility="yes"
                >
                   
                    <NotificationAlert
                        type="warning"
                        title={(<Text style={{ flexDirection: 'column' }}><Text style={styles.textStyle}>Uh oh. You may be experiencing an outage in your area.</Text>
                            <Text style={styles.textStyle1} >{'Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. '}<Text style={styles.textStyle}> Estimated Time to Restore: {description}</Text></Text>
                        </Text>)}
                        showCloseIcon={false}
                    />
                </View>
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
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: Padding.p_base
    },
    textStyle: {
        color: '#292929',
        fontFamily: FontFamily.interBold,
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    textStyle1: {
        color: '#292929',
        fontFamily: FontFamily.openSansRegular,
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'normal',
        marginTop: 8,
    },
    topLeftText: {
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#292929',
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 28,
        padding: 10,
    },
});

export default TroubleshootComponent;