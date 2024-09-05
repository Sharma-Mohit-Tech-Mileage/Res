import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, Pressable, View, ScrollView, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import SparkLightInput from "../common/customui/SparkLightInput";
import { useDispatch, useSelector } from 'react-redux';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import { updateEmailNotification, updateFreshEmail, unsubscribePaperless } from '../../redux/actions/ProfileActionSuite';

const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    paperlessBilling: yup.boolean(),
});

const EmailNotifications = () => {
    const scrollViewRef = useRef(null);
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const route = useRoute();
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const profileDetailsfromStore = profile.profileDetails || {};
    const paperlessdata = route.params?.additionalData;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: paperlessdata?.email || '',
            paperlessBilling: paperlessdata?.status || false,
            critNotif: paperlessdata?.critNotif || false
        },
    });

    const handleSave = useCallback((data) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        const { email, paperlessBilling } = data;
        const updatedProfileDetails = { ...profileDetailsfromStore };
        const emailChanged = email?.toLowerCase() !== updatedProfileDetails.svEmailAddress?.toLowerCase();
        if (emailChanged) {
            updatedProfileDetails.email = updatedProfileDetails.svEmailAddress;
            updatedProfileDetails.svEmailAddress = email;
        }
        if (paperlessBilling) {
            if (paperlessdata?.isNew) {
                dispatch(updateFreshEmail(email, emailChanged, updatedProfileDetails, navigation));
            } else {
                dispatch(updateEmailNotification(email, emailChanged, updatedProfileDetails, navigation));
            }
        } else {
            dispatch(unsubscribePaperless(navigation));
        }
    }, [dispatch, navigation, paperlessdata, profileDetailsfromStore]);

    const handleValidationError = useCallback(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        setErrorMsg('Please enter valid information to continue.');
        setShowErrorAlert(true);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }, []);

    useEffect(() => {
        if (route.params?.updateFailed) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            setShowErrorAlert(true);
            setErrorMsg('Something went wrong. Please try again.');
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }, [route.params?.updateFailed]);

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                title="Add Email Notifications"
                onPressBack={() => navigation.goBack()}
                accessibilityLabel="Back to Account"
                accessibilityHint="Navigates back to the Notifications screen"
            />
            <ScrollView ref={scrollViewRef}>
                <View style={styles.emailNotificationsInner}>
                    <View style={[styles.frameContainer, styles.navigationBorder]} >
                        <View style={styles.frameGroup}>
                            <View style={[styles.frameView, styles.frameFlexBox]}>
                                <View style={styles.frameParent1}>
                                    <NotificationAlert
                                        type="error"
                                        title="Failed"
                                        message={errorMsg}
                                        showCloseIcon={true}
                                        isVisible={showErrorAlert}
                                        onClose={() => setShowErrorAlert(false)}
                                    />
                                    <View style={[styles.paperlessBillingParent, styles.frameFlexBox]}>
                                        <Text style={[styles.youAreSubscribedContainer, styles.containerTypo]}>
                                            Please enter your email address below and stay connected with us.
                                        </Text>
                                    </View>
                                    <View style={[styles.paddingContainer]}>
                                        <View style={[styles.frameFlexBox]}>
                                            <Text style={styles.paperlessBilling}>Email</Text>
                                        </View>
                                        <Controller
                                            control={control}
                                            name="email"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <SparkLightInput
                                                    placeholder="Email Address"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value ? value.toLowerCase() : ''}
                                                    error={errors.email?.message}
                                                />
                                            )}
                                        />
                                    </View>
                                    <View style={{paddingHorizontal:Padding.p_5xl,paddingBottom:Padding.p_13xl}}>
                                    <NotificationAlert
                                        type="warning"
                                        title="Critical Notifications"
                                        message={"We'll keep you informed without overwhelming your inbox. By providing your email addressed, you're signing up for critical notifications."}
                                        showCloseIcon={false}
                                        isVisible={true}
                                        onClose={() => setShowErrorAlert(false)}
                                    />
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={[styles.paperlessBillingParent, styles.frameFlexBox,{paddingVertical:Padding.p_base}]}>
                                        <Text style={styles.paperlessBilling}>Paperless Billing</Text>
                                        <Controller
                                            control={control}
                                            name="critNotif"
                                            render={({ field: { onChange, value } }) => (
                                                <Toggle
                                                    onToggle={onChange}
                                                    initialValue={value}
                                                    disabled={true}
                                                    label="Critical notification"
                                                />
                                            )}
                                        />
                                    </View>
                                    <Text style={[styles.receiveBillingStatements, styles.receiveTypo,{paddingBottom:Padding.p_base}]}>
                                    Opt for email statements and say goodbye to paper clutter. It's convenient, eco-friendly, and keeps your information at your fingertips.
                                    </Text>
                                    <View style={styles.divider} />
                                    <View style={[styles.paperlessBillingParent, styles.frameFlexBox,{paddingVertical:Padding.p_base}]}>
                                        <Text style={styles.paperlessBilling}>Marketing Communications</Text>
                                        <Controller
                                            control={control}
                                            name="paperlessBilling"
                                            render={({ field: { onChange, value } }) => (
                                                <Toggle
                                                    onToggle={onChange}
                                                    initialValue={value}
                                                    label="Paperless Billing"
                                                />
                                            )}
                                        />
                                    </View>
                                    <Text style={[styles.receiveBillingStatements, styles.receiveTypo]}>
                                    Be the first to know about exciting updates like plan upgrades and new features!
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonsParent}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.submitButton,
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                            onPress={handleSubmit(handleSave, handleValidationError)}
                            accessibilityRole="button"
                            accessibilityLabel="Save"
                        >
                            <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Save'}</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.cancelButton,
                                { opacity: pressed ? 0.7 : 1 }
                            ]}
                            onPress={() => navigation.navigate("Notifications")}
                            accessibilityRole="button"
                            accessibilityLabel="Cancel"
                            accessibilityHint="Cancels the action and returns to Notifications screen"
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
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
        backgroundColor: Color.colorWhitesmoke_200,
    },
    containerTypo: {
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    frameViewArea: {
        borderRadius: 8,
        backgroundColor: Color.colorWhitesmoke_100,
        paddingHorizontal: Padding.p_base,
        paddingVertical: 6,
        flexDirection: "row",
    },
    infoCircleIcon: {
        width: 16,
        height: 16,
        overflow: "hidden",
    },
    infoCircleWrapper: {
        paddingVertical: Padding.p_5xs,
        flexDirection: "row",
    },
    youAreSubscribedContainer: {
        color: Color.colorGray_200,
        fontSize: FontSize.size_sm,
        flex: 1,
    },
    navigationBorder: {
        borderColor: Color.sparklightGray,
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        backgroundColor: Color.sparklightWhite,
    },
    frameFlexBox: {
        flexDirection: "row",
        alignSelf: "stretch",
    },
    receiveTypo: {
        fontSize: FontSize.textXsSemibold_size,
        color: Color.sparklightaddGray,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    divider: {
        height: 1,
        backgroundColor: Color.sparklightGray,
        alignSelf: "stretch",
    },
    paperlessBilling: {
        color: Color.colorGray_200,
        fontSize: FontSize.size_base,
        lineHeight: 22,
        flex: 1,
    },
    paperlessBillingParent: {
        alignItems: "center",
        paddingHorizontal: Padding.p_5xl,
    },
    paddingContainer: {
        paddingHorizontal: Padding.p_5xl,
        paddingTop: Padding.p_13xl,
        paddingBottom: Padding.p_base
    },
    receiveBillingStatements: {
        color: Color.colorGray_100,
        lineHeight: 22,
        paddingHorizontal: Padding.p_5xl
    },
    frameParent1: {
        paddingVertical: Padding.p_base,
        justifyContent: "center",
        flex: 1,
    },
    frameView: {
        borderBottomWidth: 1,
        borderColor: Color.sparklightGray,
        borderStyle: "solid",
        borderTopWidth: 1,
    },
    frameGroup: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frameContainer: {
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        borderColor: Color.sparklightGray,
        alignSelf: "stretch",
        overflow: "hidden",
    },
    submitButton: {
        backgroundColor: Color.colorMidnightblue,
        paddingVertical: Padding.p_base,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        height: 56,
    },
    submitButtonText: {
        color: Color.sparklightWhite,
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        textAlign: "center",
    },
    cancelButton: {
        marginTop: Padding.p_base,
        backgroundColor: Color.colorWhitesmoke_200,
        paddingVertical: Padding.p_base,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        height: 56,
    },
    cancelButtonText: {
        color: Color.colorMidnightblue,
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        textAlign: "center",
    },
    buttonsParent: {
        marginTop: Padding.p_base,
        alignSelf: "stretch",
    },
    emailNotificationsInner: {
        marginTop: Padding.p_5xl,
        paddingBottom: '20%',
        paddingHorizontal: Padding.p_base,
        width: '100%',
        overflow: "hidden",
    },
});

export default EmailNotifications;
