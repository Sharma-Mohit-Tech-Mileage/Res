import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, Easing, AccessibilityInfo, Platform, findNodeHandle } from 'react-native';
import { Color } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import Touchable from "./customui/Touchable";

const Toggle = ({ name, onToggle, initialValue = false, disabled = false , label, description = '', section = '', includeDescriptionInAccessibility = true, a11yCategory = null, a11yName = null }) => {
    const [isActive, setIsActive] = useState(initialValue);
    const translateX = useRef(new Animated.Value(isActive ? 8 : -8)).current;

    // Adjust the position of the toggle when initialValue changes
    useEffect(() => {
        Animated.timing(translateX, {
            toValue: initialValue ? 8 : -8,
            duration: 0, // Instant change
            useNativeDriver: true
        }).start();
        setIsActive(initialValue);
    }, [initialValue, translateX]);

    // Ref for programmatic accessibility focus
    const containerRef = useRef(null);

    const handleToggle = () => {
        if (disabled) return; // Prevent toggle if disabled
        const nextState = !isActive;
        setIsActive(nextState);

        // Create a synthetic event object
        const event = {
            target: {
                name,
                value: nextState,
                type: 'toggle',
            },
        };

        onToggle && onToggle(event);

        // Announce/focus handling for screen readers
        const stateWord = nextState ? 'On' : 'Off';
        const sectionLabelText = {
            textNotif: `${label || 'Appointment'} for text notifications`,
            inAppNotif: `${label || 'Appointment'} for In-app notifications`,
            paperless: `${label || 'Paperless Billing'} for email notifications`,
        }[section] || (label || name || 'Notification');

        const focusToggle = () => {
            try {
                const tag = findNodeHandle(containerRef.current);
                if (tag) {
                    if (Platform.OS === 'android') {
                        AccessibilityInfo.sendAccessibilityEvent(tag, 'focus');
                    } else {
                        AccessibilityInfo.setAccessibilityFocus(tag);
                    }
                }
            } catch (e) {
                console.warn('focus error', e);
            }
        };

        // For in-app/text notifications: only move focus (the accessibilityLabel already includes state + instructions).
        if (section === 'inAppNotif' || section === 'textNotif') {
            const focusDelay = Platform.OS === 'android' ? 400 : 200;
            setTimeout(focusToggle, focusDelay);
        } else {
            // Other sections: announce, then move focus to the toggle.
            const announce = `${sectionLabelText}. Toggle button, ${stateWord}.`;
            const announceDelay = Platform.OS === 'android' ? 300 : 80;
            const focusDelay = Platform.OS === 'android' ? 220 : 60;
            setTimeout(() => {
                try {
                    AccessibilityInfo.announceForAccessibility(announce);
                } catch (e) {
                    console.warn('announce error', e);
                }

                setTimeout(focusToggle, focusDelay);
            }, announceDelay);
        }

        Animated.timing(translateX, {
            toValue: nextState ? 8 : -8,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const activeColor = Color.sparklightGreen;
    const inactiveColor = Color.sparklightGray1;

    const getAccessibilityLabel = () => {
        // If control is disabled, report 'Disabled' state; otherwise use On/Off
        const stateWord = disabled ? 'Disabled' : (isActive ? 'On' : 'Off');
        const opposite = disabled ? 'On' : (isActive ? 'Off' : 'On');

        const sectionLabelText = {
            paperless: `${label || 'Paperless Billing'} for email notifications`,
            marketing: `Marketing communications for ${label || name}`,
            iptv: `Sparklight TV notifications for ${label || name}`,
            textNotif: `${label || 'Appointment'} for text notifications`,
            inAppNotif: `${label || 'Appointment'} for In-app notifications`,
        }[section] || (label || name || 'Notification');

        // In-app/text notifications: bake instruction into label to avoid duplicate spoken output with the hint.
        if (section === 'inAppNotif' || section === 'textNotif') {
            const defaultPrefix = section === 'inAppNotif' ? 'In App Notification' : 'Text Notification';
            const prefix = a11yCategory || defaultPrefix;
            const itemName = a11yName || (label ? label.replace(/s$/i, '') : 'Appointment');
            const actionWord = isActive ? 'turn off' : 'turn on';
            const statusWord = isActive ? 'enabled' : 'disabled';
            return `${prefix} ${statusWord} for ${itemName}. Toggle setting, Double tap to ${actionWord}.`;
        }

        // Callers can suppress the description here and let the separate title element carry it (read order: title+desc, then toggle).
        const labelPart = includeDescriptionInAccessibility && description ? `${description}` : `${sectionLabelText}`;

        // Final format: "[Description or Label]. Toggle button, [Current State]."
        return `${labelPart}. Toggle button, ${stateWord}.`;
    };

    return (
        <Touchable
            ref={containerRef}
            onPress={handleToggle}
            accessible={true}
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityHint={disabled ? '' : (section === 'inAppNotif' || section === 'textNotif' ? '' : (isActive ? 'Double tap to turn off' : 'Double tap to turn on'))}
            hitSlop={A11Y.hitSlop}
            style={styles.touchTarget}
        >
            <View style={styles.toggle}>
                <View style={[styles.toggleBase, { backgroundColor: isActive ? activeColor : inactiveColor }]}>
                    <Animated.View
                        style={[
                            styles.circle,
                            {
                                transform: [{ translateX }],
                                backgroundColor: 'white',
                            },
                        ]}
                    />
                </View>
            </View>
        </Touchable>
    );
};

const styles = StyleSheet.create({
    // Scanner reads bounds, not hitSlop — visible toggle stays 36×20 inside.
    touchTarget: {
        minWidth: A11Y.minTouch,
        minHeight: A11Y.minTouch,
        alignItems: "center",
        justifyContent: "center",
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
