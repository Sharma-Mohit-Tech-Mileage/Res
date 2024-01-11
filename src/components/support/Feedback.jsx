import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { feedbackSchema } from '../utility/validationSchema'; // Update the path as necessary
import { ScrollView, Image, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../../../GlobalStyles';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useNavigation, useRoute } from "@react-navigation/native";
import SparkLightInput from '../common/customui/SparkLightInput';
import NotificationAlert from '../common/customui/NotificationAlert';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserFeedback, fetchProfileDetails } from '../../redux/actions/ProfileActionSuite';
const feedbackOptions = [
    { value: 1, category: 'complaint', name: 'facesad', text: 'Terrible', image: require("../../../assets/facesad.png"), selectedImage: require("../../../assets/Smiley-VeryUnsatisfied-sel.png") },
    { value: 2, category: 'complaint', name: 'facefrown', text: 'Unsatisfied', image: require("../../../assets/facefrown.png"), selectedImage: require("../../../assets/Smiley-Unsatisfied-sel.png") },
    { value: 3, category: 'neutral', name: 'faceneutral', text: 'Neutral', image: require("../../../assets/faceneutral.png"), selectedImage: require("../../../assets/Smiley-Neutral-sel.png") },
    { value: 4, category: 'compliment', name: 'facesmile', text: 'Satisfied', image: require("../../../assets/facesmile.png"), selectedImage: require("../../../assets/Smiley-Satisfied-sel.png") },
    { value: 5, category: 'compliment', name: 'facehappy', text: 'Great', image: require("../../../assets/facehappy.png"), selectedImage: require("../../../assets/Smiley-VerySatisfied-sel.png") },
];
const Feedback = () => {
    const navigation = useNavigation();
    const [feedbackInfo, setFeedbackInfo] = useState({
        category: 'compliment',
        feedbackValue: 5,
        feedbackText: "",
        email: ''
    });
    // Function to dismiss keyboard
    const dismissKeyboard = () => Keyboard.dismiss();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const route = useRoute(); // Use the useRoute hook
    const dispatch = useDispatch();
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const profileDetails = profile.profileDetails || {};
    const [errormsg, setErrormsg] = useState("Please enter valid information to continue.");
    const scrollViewRef = useRef(null);
    const updateFeedbackInfo = (name, value) => {
        setFeedbackInfo(feedbackInfo => ({
            ...feedbackInfo,
            [name]: value
        }));
    };

    // Handler for changes from input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFeedbackInfo(name, value);
    };

    const handleValidationError = () => {
        setErrormsg('Please enter valid information to continue.')
        setShowErrorAlert(true);
    };

    // Handler for icon press, updating category and feedbackValue
    const handleIconPress = (category, value) => {
        updateFeedbackInfo('category', category);
        updateFeedbackInfo('feedbackValue', value);
    };
    // Your submit handler
    const handleSave = data => {
        dispatch(saveUserFeedback(data, navigation)); // Dispatch with formData
    };

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(feedbackSchema),
        defaultValues: feedbackInfo || {}
    });

    useEffect(() => {
        if (profileDetails)
            dispatch(fetchProfileDetails());
        const newInitialState = {
            ...feedbackInfo,
            email: profileDetails.multipleEmails
                ? ''
                : profileDetails.svEmailAddress
        };
        setFeedbackInfo(newInitialState); // Update the initialState with the new value
    }, []);

    useEffect(() => {
        reset(feedbackInfo);
    }, [feedbackInfo, reset]);

    useEffect(() => {
        if (route.params?.updateFailed) {
            setErrormsg('Feedback submission failed. Please try again later or contact support')
            setShowErrorAlert(true);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            navigation.setParams({ updateFailed: undefined });
        }
    }, [route.params?.updateFailed, navigation, dispatch]);

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader title="Feedback" onPressBack={() => navigation.navigate('Account')} />
            <ScrollView ref={scrollViewRef} >
                <KeyboardAvoidingView behavior="padding">
                    <View style={styles.howWouldYourRateYourExperWrapper}>
                        <NotificationAlert
                            type="error"
                            title="Error"
                            message={errormsg}
                            showCloseIcon={true}
                            isVisible={showErrorAlert}
                            onClose={() => setShowErrorAlert(false)}
                        />

                    </View>
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
                                    onPress={() => handleIconPress(option.category, option.value)}
                                >
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={feedbackInfo.feedbackValue === option.value ? option.selectedImage : option.image}
                                    />
                                    <Text style={[styles.terrible, styles.greatTypo]}>
                                        {option.text}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.textinputWrapper}>
                        <Controller
                            control={control}
                            name="feedbackText"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <>
                                    <SparkLightInput
                                        name="feedbackText"
                                        label={'Additional Feedback'}
                                        onChangeText={handleInputChange}
                                        value={value} // bind value
                                        multiline={true}
                                        maxLength={500}
                                        height={130}
                                        textAlignVertical='top'
                                        error={error?.message} // display error message
                                    />
                                </>
                            )}
                        />
                    </View>
                    <View><Text style={[styles.footerWrapper]}>
                        {feedbackInfo.feedbackText.length}/500
                    </Text></View>

                    <View style={styles.textinputWrapper}>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <>
                                    <SparkLightInput
                                        name="email"
                                        label={'Email'}
                                        onChangeText={handleInputChange}
                                        onBlur={onBlur} // bind onBlur
                                        value={value} // bind value
                                        error={error?.message} // display error message
                                    />
                                </>
                            )}
                        />
                    </View>
                    <View >

                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={handleSubmit(handleSave, handleValidationError)}>
                            <Text style={[styles.textStyle, { color: Color.sparklightWhite }]}>Submit Feedback</Text>
                        </Pressable>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={() => navigation.navigate('Account')} >
                            <Text style={[styles.textStyle, { color: Color.colorMidnightblue }]}>Cancel</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
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
    textStyle: {
        textAlign: 'center',
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
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
        color: Color.gray600,
        paddingTop: Padding.p_base,
        paddingBottom: 8,
        paddingHorizontal: Padding.p_base

    },
    textinputWrapper: {
        paddingTop: Padding.p_5xs,
        paddingHorizontal: Padding.p_base,
        alignSelf: "stretch",
    },
    footerWrapper: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: Padding.p_base,
        textAlign: 'right',
        alignSelf: "stretch",
    },
    infoWrapper: {
        padding: Padding.p_base,
        alignSelf: "stretch",
    },
});
export default Feedback;
