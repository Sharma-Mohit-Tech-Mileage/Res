import React, { useState } from 'react';
import { ScrollView, Image, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../../../GlobalStyles';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useNavigation } from '@react-navigation/native';
const feedbackOptions = [
    { name: 'facesad', text: 'Terrible', image: require("../../../assets/facesad.png"), selectedImage: require("../../../assets/Smiley-VeryUnsatisfied-sel.png") },
    { name: 'facefrown', text: 'Unsatisfied', image: require("../../../assets/facefrown.png"), selectedImage: require("../../../assets/Smiley-Unsatisfied-sel.png") },
    { name: 'faceneutral', text: 'Neutral', image: require("../../../assets/faceneutral.png"), selectedImage: require("../../../assets/Smiley-Neutral-sel.png") },
    { name: 'facesmile', text: 'Satisfied', image: require("../../../assets/facesmile.png"), selectedImage: require("../../../assets/Smiley-Satisfied-sel.png") },
    { name: 'facehappy', text: 'Great', image: require("../../../assets/facehappy.png"), selectedImage: require("../../../assets/Smiley-VerySatisfied-sel.png") },
];
const Feedback = () => {
    const navigation = useNavigation();
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [inputText, setInputText] = useState('');
    const [charCount, setCharCount] = useState(0);
    const handleTextInputChange = (text) => {
        if (text.length <= 500) {
            setInputText(text);
            setCharCount(text.length);
        }
    };
    const handleIconPress = (optionName) => {
        setSelectedFeedback(optionName);
    };
    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                title="Feedback"
                onPressBack={() => navigation.navigate('Account')}
            />
            <ScrollView >
                <View style={styles.howWouldYourRateYourExperWrapper}>
                    <Text style={[styles.howWouldYour]}>
                        How would your rate your experience using the Sparklight app?
                    </Text>
                </View>
                <View style={[styles.frameContainer]}>
                    <View style={[styles.frameGroup, styles.frameFlexBox]}>
                        {feedbackOptions.map((option) => (
                            <Pressable
                                key={option.name}
                                style={[styles.faceSadParent, styles.parentSpaceBlock]}
                                onPress={() => handleIconPress(option.name)}
                            >
                                <Image
                                    style={styles.iconLayout}
                                    resizeMode="cover"
                                    source={selectedFeedback === option.name ? option.selectedImage : option.image}
                                />
                                <Text style={[styles.terrible, styles.greatTypo]}>
                                    {option.text}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
                <View style={[styles.textinputWrapper, styles.textinputFlexBox]}>
                    <View style={[styles.firstNameWrapper, styles.frameFlexBox]}>
                        <Text style={[styles.firstName]}>
                            Additional Feedback
                        </Text>
                    </View>
                    <View style={[styles.text1SpaceBlock]}>
                        <TextInput
                            style={[styles.myExperienceHasBeenGreatParent, {textAlignVertical: 'top' }]}
                            onChangeText={handleTextInputChange}
                            value={inputText}
                            multiline={true}
                            maxLength={500}
                            numberOfLines={6} // Set the number of lines
                        />
                    </View>
                    <Text style={[styles.text1, styles.text1SpaceBlock]}>
                        {charCount}/500
                    </Text>

                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('ThumbsUp')}>
                    <Text style={styles.buttonText}>Submit Feedback</Text>
                </Pressable>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => navigation.navigate('Account')} >
                    <Text style={{ color: Color.colorMidnightblue }}>Cancel</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.sparklightWhite,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: Padding.p_base,
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        padding: Padding.p_base,
        borderRadius: Border.br_11xs,
        marginTop: Padding.p_base,
        flex: 1, // makes each button expand
    },
    buttonText: {
        color: Color.sparklightWhite,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
    },
    iconLayout: {
        height: 32,
        width: 32,
        overflow: "hidden",
    },
    parentSpaceBlock: {
        paddingVertical: Padding.p_base,
        flex: 1,
    },
    frameFlexBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    greatTypo: {
        fontSize: FontSize.size_xs,
        lineHeight: 18,
    },
    textinputFlexBox: {
        justifyContent: "center",
        alignSelf: "stretch",
    },
    text1SpaceBlock: {
        marginTop: 8,
        alignSelf: "stretch",
    },
    howWouldYour: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: FontFamily.openSansRegular,
        color: Color.gray600
    },
    howWouldYourRateYourExperWrapper: {
        paddingTop: Padding.p_base,
        paddingHorizontal: Padding.p_base,
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
    },
    terrible: {
        marginTop: 16,
        color: Color.colorGray_100,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
    },
    faceSadParent: {
        borderRightWidth: 1,
        alignItems: "center",
        borderColor: Color.sparklightGray,
        borderStyle: "solid",
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
    },
    frameGroup: {
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.colorGainsboro_200,
        flex: 1,
    },
    frameContainer: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_base,
    },
    firstName: {
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        color: Color.gray600
    },
    firstNameWrapper: {
        alignItems: "center",
        alignSelf: "stretch",
    },
    myExperienceHasBeenGreatParent: {
        borderColor: Color.gray600,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderStyle: "solid",
    },
    text1: {
        color: Color.gray600,
        textAlign: "right",
        fontSize: FontSize.size_xs,
        lineHeight: 18,
        fontFamily: FontFamily.openSansRegular,
    },
    textinputWrapper: {
        paddingBottom: Padding.p_base,
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_base,
    }
});
export default Feedback;
