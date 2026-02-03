import React, { useState, useRef, useEffect } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet, Easing, AccessibilityInfo } from 'react-native';
import { Color } from "../../../GlobalStyles";

const Toggle = ({
    name,
    onToggle,
    initialValue = false,
    disabled = false,
    label = '',
    description = '',
    section = ''
}) => {
    const [isActive, setIsActive] = useState(initialValue);
    const translateX = useRef(new Animated.Value(isActive ? 8 : -8)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: initialValue ? 8 : -8,
            duration: 0,
            useNativeDriver: true
        }).start();
        setIsActive(initialValue);
    }, [initialValue, translateX]);

    const handleToggle = () => {
        if (disabled) return;
        const nextState = !isActive;
        setIsActive(nextState);

        if (onToggle) {
            onToggle({
                target: {
                    name,
                    value: nextState,
                    type: 'toggle'
                }
            });
        }

        // Announce immediate state change for screen readers
        const stateWord = nextState ? 'Enabled' : 'Disabled';
        const opposite = nextState ? 'Disabled' : 'Enabled';
        const sectionLabelText = {
            textNotif: `${label || 'Appointment'} for text notifications`,
            inAppNotif: `${label || 'Appointment'} for In-app notifications`,
            paperless: `${label || 'Paperless Billing'} for email notifications`,
        }[section] || (label || name || 'Notification');

        AccessibilityInfo.announceForAccessibility(`${sectionLabelText}. Toggle button, ${stateWord}. Double tap to turn ${opposite}.`);

        Animated.timing(translateX, {
            toValue: nextState ? 8 : -8,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const getAccessibilityLabel = () => {
        // If control is disabled, report 'disabled' state; otherwise use On/Off
        const stateWord = disabled ? 'disabled' : (isActive ? 'Enabled' : 'Disabled');
        const opposite = disabled ? 'enabled' : (isActive ? 'Disabled' : 'Enabled');

        const sectionLabelText = {
            paperless: `${label || 'Paperless Billing'} for email notifications`,
            marketing: `Marketing communications for ${label || name}`,
            iptv: `Sparklight TV notifications for ${label || name}`,
            textNotif: `${label || 'Appointment'} for text notifications`,
            inAppNotif: `${label || 'Appointment'} for In-app notifications`,
        }[section] || (label || name || 'Notification');

        // For the toggle control, we prefer to read the description (if present)
        // followed by the toggle state so users can swipe: title -> description -> toggle.
        const labelPart = description ? `${description}` : `${sectionLabelText}`;

        // Final format: "[Description or Label]. Toggle button, [Current State]. Double tap to turn [Opposite State]."
        return `${labelPart}. Toggle button, ${stateWord}. Double tap to turn ${opposite}`;
    };

    return (
        <TouchableWithoutFeedback
            onPress={handleToggle}
            accessible={true}
            accessibilityRole="Button"
            accessibilityState={{ checked: !!isActive, disabled: !!disabled }}
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityHint={`Double tap to turn ${disabled ? 'enabled' : (isActive ? 'Off' : 'On')}`}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
            <View style={styles.toggleWrapper}>
                <View style={styles.toggle}>
                    <View style={[styles.toggleBase, {
                        backgroundColor: isActive ?
                            (disabled ? '#7AC5A5' : Color.sparklightGreen) :
                            (disabled ? Color.Gray300 : Color.sparklightDarkGray)
                    }]}>
                        <Animated.View
                            style={[styles.circle, {
                                transform: [{ translateX }],
                                backgroundColor: 'white',
                            }]}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    toggleWrapper: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleBase: {
        borderRadius: 20,
        width: 36,
        justifyContent: "center",
        padding: 2,
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    toggle: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
});

export default Toggle;