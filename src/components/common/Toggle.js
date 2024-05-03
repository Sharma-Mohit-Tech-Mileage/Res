import React, { useState, useRef, useEffect } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet, Easing } from 'react-native';
import { Color } from "../../../GlobalStyles";

const Toggle = ({ name, onToggle, initialValue = false, disabled = false }) => {
    const [isActive, setIsActive] = useState(initialValue);
    const translateX = useRef(new Animated.Value(isActive ? 8 : -8)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: initialValue ? 8 : -8,
            duration: 0, // Instant change
            useNativeDriver: true
        }).start();
        setIsActive(initialValue);
    }, [initialValue, translateX]);

    const handleToggle = () => {
        if (disabled) return;
        const nextState = !isActive;
        setIsActive(nextState);

        const event = {
            target: {
                name,
                value: nextState,
                type: 'toggle',
            },
        };

        onToggle && onToggle(event);

        Animated.timing(translateX, {
            toValue: nextState ? 8 : -8,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const activeColor = Color.sparklightGreen;
    const inactiveColor = Color.sparklightDarkGray;

    return (
        <TouchableWithoutFeedback
            onPress={handleToggle}
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
        </TouchableWithoutFeedback>
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
