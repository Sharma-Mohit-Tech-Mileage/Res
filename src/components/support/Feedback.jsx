import React,{useState} from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Image, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Color, FontFamily, FontSize, Border,Padding } from '../../../GlobalStyles';
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

    const handleIconPress = (optionName) => {
        setSelectedFeedback(optionName);
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.feedback}>
                    <ProfileSettingsHeader
                        title="FeedBack"
                        onPressBack={() => navigation.navigate('Account')}
                    />
                    <View style={[styles.feedbackInner]}>
                <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                    <View style={styles.howWouldYourRateYourExperWrapper}>
                        <Text style={[styles.howWouldYour, styles.firstNameFlexBox]}>
                            How would your rate your experience using the Sparklight app?
                        </Text>
                    </View>

                            <View style={[styles.frameContainer, styles.frameContainerSpaceBlock]}>
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
                        <View style={styles.frameView}>
                            <View
                                style={[styles.textinputWrapper, styles.textinputFlexBox]}
                            >
                                <View style={styles.textinputFlexBox}>
                                    <View
                                        style={[styles.firstNameWrapper, styles.frameFlexBox]}
                                    >
                                        <Text style={[styles.firstName, styles.firstNameFlexBox]}>
                                            Additional Feedback
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.myExperienceHasBeenGreatParent,
                                            styles.text1SpaceBlock,
                                        ]}
                                    >
                                        <TextInput style={[styles.myExperienceHas, styles.textTypo]} />
                                        <Text style={[styles.text, styles.textTypo]}>{` `}</Text>
                                    </View>
                                    <Text style={[styles.text1, styles.text1SpaceBlock]}>
                                        40/500
                                    </Text>
                                </View>
                            </View>
                        </View>
                    <View style={[styles.buttonsParent, styles.textinputFlexBox]}>
                        <Pressable
                            style={[styles.buttons, styles.buttonsLayout]}
                            onPress={() => { navigation.navigate('ThumbsUp') }}
                        >
                            <Text style={[styles.makePayment, styles.makeTypo]}>
                                Submit Feedback
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.buttons1, styles.buttonsLayout]}
                                    onPress={() => { navigation.navigate('Account') }}
                        >
                            <Text style={[styles.makePayment1, styles.makeTypo]}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            
        </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.colorWhitesmoke_200,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    iconLayout: {
        height: 32,
        width: 32,
        overflow: "hidden",
    },
    parentSpaceBlock: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        flex: 1,
    },
    firstNameFlexBox: {
        textAlign: "left",
        color: Color.gray600,
        flex: 1,
    },
    frameContainerSpaceBlock: {
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_5xl,
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
    textTypo: {
        fontSize: FontSize.size_base,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    buttonsLayout: {
        width: 382,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        borderRadius: Border.br_11xs,
        height: 56,
    },
    makeTypo: {
        width: 282,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
    },
    howWouldYour: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: FontFamily.openSansRegular,
    },
    howWouldYourRateYourExperWrapper: {
        paddingTop: Padding.p_base,
        paddingHorizontal: Padding.p_5xl,
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
    },
    firstName: {
        fontSize: 14,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    firstNameWrapper: {
        alignItems: "center",
        alignSelf: "stretch",
    },
    myExperienceHas: {
        color: Color.colorGray_100,
    },
    text: {
        marginTop: 10,
        color: Color.colorGray_100,
    },
    myExperienceHasBeenGreatParent: {
        borderColor: Color.gray600,
        height: 130,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: Border.br_11xs,
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
        paddingHorizontal: Padding.p_5xl,
    },
    frameView: {
        alignSelf: "stretch",
        flex: 1,
    },
    makePayment: {
        color: Color.sparklightWhite,
    },
    buttons: {
        backgroundColor: Color.colorMidnightblue,
    },
    makePayment1: {
        color: Color.colorMidnightblue,
    },
    buttons1: {
        marginTop: 16,
    },
    buttonsParent: {
        alignItems: "center",
    },
    frameParent: {
        backgroundColor: Color.sparklightWhite,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
        overflow: "hidden",
    },
    feedbackInner: {
        top: '10%',
        flex: 1,
        marginBottom:'20%'
    },
    feedback: {
        backgroundColor: Color.colorWhitesmoke_200,
        overflow: "hidden",
        width: "100%",
        flex: 1,
    },
});

export default Feedback;
