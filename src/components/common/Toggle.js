import React, { useState, useRef, useEffect } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet, Easing } from 'react-native';
import { Color } from "../../../GlobalStyles";

const Toggle = ({ name, onToggle, initialValue = false, disabled = false, label = '' }) => {
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

    const accessibilityProps = {
        accessible: true,
        accessibilityRole: "switch",
        accessibilityState: { 
            checked: isActive || false,
            disabled: disabled || false
        },
        accessibilityLabel: label,
        accessibilityHint: disabled ? "" : "Double tap to toggle"
     };
    

    return (
        <TouchableWithoutFeedback
            onPress={handleToggle}
            {...accessibilityProps}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <View style={styles.toggleWrapper}>
                <View style={styles.toggle}>
                    <View style={[styles.toggleBase, { 
                        backgroundColor: isActive ? 
                            (disabled ? Color.Gray300 : Color.sparklightGreen) : 
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