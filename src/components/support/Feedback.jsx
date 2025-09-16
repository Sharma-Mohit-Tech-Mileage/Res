import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { feedbackSchema } from '../utility/validationSchema';
import { ScrollView, Image, StyleSheet, Pressable, View, Text } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../../../GlobalStyles';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useNavigation, useRoute } from "@react-navigation/native";
import SparkLightInput from '../common/customui/SparkLightInput';
import NotificationAlert from '../common/customui/NotificationAlert';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserFeedback } from '../../redux/actions/ProfileActionSuite';
import Facesad from '../../../assets/svgs/SmileyUnsatisfiedsel';
import Terrible from '../../../assets/svgs/SmileyVeryUnsatisfiedsel';
import Faceneutral from '../../../assets/svgs/Smileyneutralsel';
import Facesmile from '../../../assets/svgs/SmileySatisfiedsel';
import Facehappy from '../../../assets/svgs/SmileyverySatisfiedsel';


const feedbackOptions = [
    { value: 1, category: 'complaint', name: 'facesad', text: 'Terrible', image: Terrible, selectedImage: Terrible },
    { value: 2, category: 'complaint', name: 'facefrown', text: 'Poor', image: Facesad, selectedImage: Facesad },
    { value: 3, category: 'neutral', name: 'faceneutral', text: 'Neutral', image: Faceneutral, selectedImage: Faceneutral },
    { value: 4, category: 'compliment', name: 'facesmile', text: 'Satisfied', image: Facesmile, selectedImage: Facesmile },
    { value: 5, category: 'compliment', name: 'facehappy', text: 'Great', image: Facehappy, selectedImage: Facehappy },
];
const Feedback = () => {

    const navigation = useNavigation();
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const route = useRoute();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const profileDetails = profile.profileDetails || {};
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedFeedback, setSelectedFeedback] = useState('facehappy'); // State to track selected feedback

    const [errormsg, setErrormsg] = useState("Please enter valid information to continue.");
    const scrollViewRef = useRef(null);

    const handleValidationError = () => {
        isSubmittingRef.current = false;
        setIsSubmitting(false); // Also update the state for UI feedback
    };

    const handleIconPress = (option) => {
        if (isSubmittingRef.current) return;
        setSelectedFeedback(option.name); // Update the selected feedback
        setValue('category', option.category);
        setValue('feedbackValue', option.value);
    };

    const onSubmit = data => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);

        dispatch(saveUserFeedback(data, navigation));
    };

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(feedbackSchema),
        defaultValues: {
            category: 'compliment',
            feedbackValue: 5,
            feedbackText: '',
            feedbackEmail: ''
        }
    });

    useEffect(() => {
        if (route.params?.updateFailed) {
            setErrormsg('Feedback submission failed. Please try again later or contact support')
            setShowErrorAlert(true);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            isSubmittingRef.current = false;
            setIsSubmitting(false); // Also update the state for UI feedback
            navigation.setParams({ updateFailed: undefined });
        }
    }, [route.params?.updateFailed, navigation, dispatch]);

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader title="Feedback" onPressBack={() => navigation.goBack()} />
            <ScrollView ref={scrollViewRef}>
                <View style={{ marginBottom: 300 }}>
                    {showErrorAlert && <View style={styles.howWouldYourRateYourExperWrapper}>
                        <NotificationAlert
                            type="error"
                            title="Error"
                            message={errormsg}
                            showCloseIcon={true}
                            isVisible={showErrorAlert}
                            onClose={() => setShowErrorAlert(false)}
                        />

                    </View>}
                    <View style={styles.howWouldYourRateYourExperWrapper}>
                        <Text style={[styles.howWouldYour]}>
                            How would you rate your experience using the MySparklight app?
                        </Text>
                    </View>
                    <View style={[styles.frameContainer]}>
                        <View style={[styles.frameGroup, styles.frameFlexBox]}>
                            {feedbackOptions.map((option) => (
                                <Pressable
                                    accessibilityLabel={option.text}
                                    accessibilityRole="button"
                                    accessible={true}
                                    key={option.name}
                                    style={[
                                        styles.faceSadParent,
                                        { flex: 1 },
                                        selectedFeedback === option.name && { backgroundColor: Color.colorMidnightblue }
                                    ]}
                                    onPress={() => handleIconPress(option)}
                                >
                                    <View style={styles.iconLayout}>
                                        {selectedFeedback === option.name ? (
                                            <option.selectedImage color='#fff' />
                                        ) : (
                                            <option.image />
                                        )  }
                                        </View>
                                    {/* <Image
                                        style={styles.iconLayout}
                                        resizeMode="contain"
                                        source={selectedFeedback === option.name ? option.selectedImage : option.image}
                                    /> */}
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.terrible,
                                            styles.greatTypo,
                                            selectedFeedback === option.name && { color: Color.sparklightWhite }
                                        ]}
                                    >
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
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <SparkLightInput
                                        label="Additional Feedback"
                                        textAlignVertical="top"
                                        onChangeText={onChange} // Directly updates value
                                        onBlur={onBlur}
                                        value={value}
                                        multiline={true}
                                        maxLength={500}
                                        height={130}
                                        error={errors.feedbackText?.message}
                                    />
                                    <Text
                                        style={styles.footerWrapper}
                                        accessibilityRole="text"
                                        accessibilityLabel={`Character count: ${value?.length || 0} out of 500`}
                                    >
                                        {`${value?.length || 0}/500`}
                                    </Text>
                                </>
                            )}
                        />
                    </View>

                    <View style={styles.textinputWrapper}>
                        <Controller
                            control={control}
                            name="feedbackEmail"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <SparkLightInput
                                    label="Email"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value ? value.toLowerCase() : ''}
                                    error={errors.feedbackEmail?.message}
                                />
                            )}
                        />
                    </View>
                    <View >

                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            accessibilityLabel={isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            accessibilityRole="button"
                            accessible={true}
                            style={[styles.button]}
                            onPress={handleSubmit(onSubmit, handleValidationError)}
                            disabled={isSubmitting} // Use state for UI updates
                        >
                            <Text style={[styles.textStyle, { color: Color.sparklightWhite }]}>
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </Text>
                        </Pressable>

                    </View>
                    <View style={{ paddingHorizontal: Padding.p_base }}>
                        <Pressable
                            accessibilityLabel="Cancel"
                            accessibilityRole="button"
                            accessible={true}
                            style={styles.buttonContainer}
                            onPress={() => navigation.navigate('Account')}
                        >
                            <Text
                                style={[styles.textStyle, { color: Color.colorMidnightblue }]}
                                accessible={false} // Ensure the text itself is not an accessible element
                            >
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
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
        justifyContent: "space-evenly",
        padding: Padding.p_base,
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        padding: Padding.p_base,
        borderRadius: Border.br_11xs,
        marginTop: Padding.p_base,
        flex: 1, // makes each button expand
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
        textAlign: 'center',
        width: '90%', // Adjust this width as needed for your layout
    },
    faceSadParent: {
        borderRightWidth: 1,
        alignItems: "center",
        borderColor: Color.sparklightGray,
        borderStyle: "solid",
        paddingVertical: Padding.p_base,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameGroup: {
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.colorGainsboro_200,
    },
    frameContainer: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_base,
    },
    textinputWrapper: {
        paddingTop: Padding.p_5xs,
        paddingHorizontal: Padding.p_base,
        alignSelf: "stretch",
    },
    footerWrapper: {
        textAlign: 'right',
        alignSelf: "stretch",
        fontFamily: FontFamily.openSansRegular,
        fontWeight: '400',
        color: Color.sparklightDarkGray,
        fontSize: FontSize.size_xs,
    },
});
export default Feedback;
