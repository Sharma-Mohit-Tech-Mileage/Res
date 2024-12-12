import React, { useState, useRef, useEffect } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet, Easing } from 'react-native';
import { Color } from "../../../GlobalStyles";

const Toggle = ({
    name,
    onToggle,
    initialValue = false,
    disabled = false,
    label = '',
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

        Animated.timing(translateX, {
            toValue: nextState ? 8 : -8,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const getAccessibilityLabel = () => {
        const status = isActive ? 'enabled' : 'disabled';
        const sectionLabel = {
            paperless: `Paperless billing notifications ${status} for ${name}`,
            marketing: `Marketing communications ${status} for ${name}`,
            iptv: `Sparklight TV notifications ${status} for ${name}`
        }[section] || label;

        return `${sectionLabel}${disabled ? '. This setting cannot be changed' : ''}`;
    };

    return (
        <TouchableWithoutFeedback
            onPress={handleToggle}
            accessible={true}
            accessibilityLabel={getAccessibilityLabel()}
            accessibilityHint={disabled ? undefined : 'Toggle setting'}
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