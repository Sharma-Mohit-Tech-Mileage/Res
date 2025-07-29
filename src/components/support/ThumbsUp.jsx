import React from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontSize, Color, FontFamily } from "../../../GlobalStyles";
import ThumbsupIcon from "../../../assets/svgs/Thumbsup";

const ThumbsUp = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.feedback}>
            <ProfileSettingsHeader
                title="Feedback"
                onPressBack={() => navigation.navigate('Account')}
                accessibilityRole="header"
                accessibilityLabel="Feedback header"
            />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.content}>
                    <View style={styles.frameParent}>
                        <View style={styles.containerImage}
                            accessible={true}
                            accessibilityLabel="Thumbs up icon indicating successful feedback submission"
                            accessibilityRole="image"
                        >
                         <ThumbsupIcon/>
                        </View>
                        <View style={styles.textContainer}>
                            <Text
                                style={styles.thankYouFor}
                                accessibilityRole="header"
                                accessibilityLabel="Thank you for your feedback!"
                            >
                                Thank you for your feedback!
                            </Text>
                            <Text
                                style={styles.yourFeedbackMeans}
                                accessibilityLabel="Your feedback means a lot to us. We will use it to improve our services for you and the communities we serve."
                            >
                                Your feedback means a lot to us! We will use it
                                to continue improving our services for both you and
                                the communities we serve.
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        style={styles.button}
                        onPress={() => navigation.navigate('Account')}
                        accessibilityRole="button"
                        accessibilityLabel="Done button. Return to Account screen"
                    >
                        <Text style={styles.buttonText}>Done</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    feedback: {
        flex: 1,
        backgroundColor: Color.sparklightWhite,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: Color.sparklightWhite,
        marginBottom:'20%'
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    frameParent: {
        backgroundColor: Color.sparklightWhite,
        borderStyle: "solid",
        borderColor: "#e1e1e1",
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
        overflow: "hidden",
        alignItems: 'center',
        padding: Padding.p_5xl,
        paddingTop: Padding.p_5xl + Padding.p_base,
    },
    containerImage: {
        width: 128, // from the layout width
        height: 128, // from the layout height
        borderRadius: 100, // from the radius property
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff', // assuming a white background
        shadowColor: "#101828",
        shadowOffset: {
            width: 0,
            height: 6.1, // rounded from 6.09523868560791
        },
        shadowOpacity: 0.06, // 6% opacity from the first shadow
        shadowRadius: 12.2, // rounded from 12.19047737121582
        elevation: 10, // this is for Android, you may need to adjust this
    },
    image: {
        width: 73.14, // from the icon width
        height: 73.14, // from the icon height
    },

    textContainer: {
        marginTop: Padding.p_base,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thankYouFor: {
        fontSize: 22,
        color: Color.colorGray_100,
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
        textAlign: "center",
    },
    yourFeedbackMeans: {
        marginTop: 24,
        color: Color.sparklightDarkGray,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
        textAlign: "center",
        paddingHorizontal: Padding.p_sm,
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        height: 56,
        width: '90%', // Use percentage for responsive width
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Border.br_11xs,
        alignSelf: 'center',
        marginBottom: Padding.p_base, // Adjust bottom margin as needed
    },
    buttonText: {
        color: 'white',
        fontSize: FontSize.size_base,
    },
});

export default ThumbsUp;
