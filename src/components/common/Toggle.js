import React, { useState, useRef } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet, Easing } from 'react-native';

const Toggle = ({ onToggle }) => {
    const [isActive, setIsActive] = useState(false);
    const translateX = useRef(new Animated.Value(-8)).current;

    const handleToggle = () => {
        const nextState = !isActive;
        setIsActive(nextState);
        onToggle && onToggle(nextState);

        Animated.timing(translateX, {
            toValue: nextState ? 8 : -8,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const activeColor = '#4CAF50';
    const inactiveColor = '#ccc';

    return (
        <TouchableWithoutFeedback
            onPress={handleToggle}
            accessible={true}
            accessibilityRole="switch"
            accessibilityState={{ checked: isActive }}
            accessibilityHint="Toggles between on and off state."
            accessibilityLabel={isActive ? "Switch is on" : "Switch is off"}
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
