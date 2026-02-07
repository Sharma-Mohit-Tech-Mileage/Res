import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, StyleSheet, Easing, AccessibilityInfo, Platform, findNodeHandle } from 'react-native';
import { Color } from "../../../GlobalStyles";

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
            // Announce immediate state change for screen readers
        const stateWord = nextState ? 'On' : 'Off';
        const opposite = nextState ? 'Off' : 'On';
        const statusWord = nextState ? 'enabled' : 'disabled';
        const sectionLabelText = {
            textNotif: `${label || 'Appointment'} for text notifications`,
            inAppNotif: `${label || 'Appointment'} for In-app notifications`,
            paperless: `${label || 'Paperless Billing'} for email notifications`,
        }[section] || (label || name || 'Notification');

        // For In-app notifications use the specific phrasing requested by accessibility team
        if (section === 'inAppNotif' || section === 'textNotif') {
            const defaultPrefix = section === 'inAppNotif' ? 'In App Notification' : 'Text Notification';
            const prefix = a11yCategory || defaultPrefix;
            const itemName = a11yName || (label ? label.replace(/s$/i, '') : 'Appointment');
            const announce = `${prefix} ${statusWord} for ${itemName}. Toggle setting, Double tap to turn ${opposite}.`;
            // Step 1: announce the sentence after a short delay
            // Increase delays for Android to improve TalkBack reliability
            // Increase delays for both Android and iOS to improve reliability
            const announceDelay = Platform.OS === 'android' ? 500 : 300;
            const focusDelay = Platform.OS === 'android' ? 400 : 200;
            setTimeout(() => {
                try {
                    AccessibilityInfo.announceForAccessibility(announce);
                } catch (e) {
                    console.log('announce error', e);
                }

                // Step 2: after a short delay, move accessibility focus to the toggle
                setTimeout(() => {
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
                        console.log('focus error', e);
                    }
                }, focusDelay);
            }, announceDelay);
        } else {
            // Delay slightly and announce state only (omit actionable phrase to avoid duplication with accessibilityHint)
            const announce = `${sectionLabelText}. Toggle button, ${stateWord}.`;
            const announceDelay = Platform.OS === 'android' ? 300 : 80;
            const focusDelay = Platform.OS === 'android' ? 220 : 60;
            setTimeout(() => {
                try {
                    AccessibilityInfo.announceForAccessibility(announce);
                } catch (e) {
                    console.log('announce error', e);
                }

                setTimeout(() => {
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
                        console.log('focus error', e);
                    }
                }, focusDelay);
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
    const inactiveColor = Color.sparklightDarkGray;

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

        // Special-case In-app notifications to match requested phrasing and avoid
        // screen reader duplicates — include instruction in the label and clear hint.
        if (section === 'inAppNotif' || section === 'textNotif') {
            const defaultPrefix = section === 'inAppNotif' ? 'In App Notification' : 'Text Notification';
            const prefix = a11yCategory || defaultPrefix;
            const itemName = a11yName || (label ? label.replace(/s$/i, '') : 'Appointment');
            const actionWord = isActive ? 'turn off' : 'turn on';
            const statusWord = isActive ? 'enabled' : 'disabled';
            return `${prefix} ${statusWord} for ${itemName}. Toggle setting, Double tap to ${actionWord}.`;
        }

        // For other sections, allow callers to suppress the description from
        // the accessible label and rely on the separate title element to contain
        // the description (so screen readers read: title+description, then toggle).
        const labelPart = includeDescriptionInAccessibility && description ? `${description}` : `${sectionLabelText}`;

        // Final format: "[Description or Label]. Toggle button, [Current State]."
        return `${labelPart}. Toggle button, ${stateWord}.`;
    };

    return (
        <Pressable
            ref={containerRef}
            onPress={handleToggle}
            accessible={true}
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityRole="button"
            accessibilityHint={disabled ? '' : (section === 'inAppNotif' || section === 'textNotif' ? '' : (isActive ? 'Double tap to turn off' : 'Double tap to turn on'))}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
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
        </Pressable>
    );
};

const styles = StyleSheet.create({
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
