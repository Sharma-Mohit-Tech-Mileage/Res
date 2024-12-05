import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Color, Padding, FontSize } from "../../../GlobalStyles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import debounce from 'lodash/debounce';
import { useNavigation, useRoute } from "@react-navigation/native";
import Toggle from '../common/Toggle';
import SparkLightInput from '../common/customui/SparkLightInput';
import { useDispatch, useSelector } from 'react-redux';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import { manageEmailRequest } from '../../redux/actions/ProfileActionSuite';
import SecondaryButton from '../common/customui/PrimaryButton';
import LoadingOverlay from '../common/LoadingOverlay';
const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
});

const AddEmailNotification = () => {
    const scrollViewRef = useRef(null);
    const isSubmittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formState, setFormState] = useState({ paperlessBilling: false, marketing: false });
    const route = useRoute();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const newEmail = route.params?.newEmail || false;
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const { allSvEmailAssociated = [] } = profile;
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: route.params?.additionalData?.email || '',
        },
    });

    useEffect(() => {
        if (route.params?.updateFailed) {
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            setErrorMsg('Something went wrong. Please try again.');
            setShowErrorAlert(true);
            isSubmittingRef.current = false; // Resetting the flag on failure
            setIsSubmitting(false);
        }
    }, [route.params?.updateFailed]);

    const handleToggleChange = useCallback(debounce((e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    }, 200), []);

    const checkEmailAssociation = (email, associations) => {
        const emailToCheck = email.toLowerCase();
        const associatedWithPaperless = associations.some(setting =>
            setting.emailAddress?.toLowerCase() === emailToCheck && setting.invoice
        );
        const associatedWithMarketing = associations.some(setting =>
            setting.emailAddress?.toLowerCase() === emailToCheck && setting.marketing
        );
        const associatedWithNoFlags = associations.some(setting =>
            setting.emailAddress?.toLowerCase() === emailToCheck && !setting.invoice && !setting.marketing
        );
    
        return {
            associatedWithPaperless,
            associatedWithMarketing,
            associatedWithNoFlags
        };
    };
    
    const handleSave = useCallback(async (data) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
    
        const { email } = data;
        const { paperlessBilling, marketing } = formState;
    
        // Get the email association status
        const { associatedWithPaperless, associatedWithMarketing, associatedWithNoFlags } = checkEmailAssociation(email, allSvEmailAssociated);
    
        // Centralized condition checks
        if (marketing && associatedWithMarketing) {
            setErrorMsg('This email is already subscribed to marketing communications. Please choose another email or update the current subscription.');
        } else if (paperlessBilling && associatedWithPaperless) {
            setErrorMsg('This email is already subscribed to paperless billing. You can update the subscription if needed.');
        } else if (associatedWithPaperless && associatedWithMarketing) {
            setErrorMsg('This email is already subscribed to both paperless billing and marketing communications. Please edit the existing settings to make changes');
        } else if (associatedWithNoFlags && !paperlessBilling && !marketing) {
            setErrorMsg('This email is already present with no subscriptions. Please select at least one subscription option.');
        } else if ((associatedWithPaperless || associatedWithMarketing) && !paperlessBilling && !marketing) {
            setErrorMsg('This email address is already being used for other notifications. Please select what notifications you would like to receive to this email address.');
        } else {
            try {
                await dispatch(manageEmailRequest(email, paperlessBilling, marketing, newEmail, navigation));
                return;
            } catch (error) {
                setErrorMsg('We encountered an issue while saving your settings. Please try again.');
            }
        }
    
        setShowErrorAlert(true);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }, [dispatch, navigation, formState, allSvEmailAssociated]);

    const handleValidationError = useCallback(() => {
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        setErrorMsg('Please enter valid information to continue.');
        setShowErrorAlert(true);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }, []);

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader
                title="Add Email Notifications"
                onPressBack={() => navigation.goBack()}
            />

            <LoadingOverlay isLoading={isSubmitting} message="Saving..." />

            <ScrollView ref={scrollViewRef}>
                <View style={styles.frameContainer}>
                    <View style={styles.section}>
                        {showErrorAlert && (
                            <View style={styles.spaceBottom}>
                                <NotificationAlert
                                    type="error"
                                    title="Failed"
                                    message={errorMsg}
                                    showCloseIcon={true}
                                    onClose={() => setShowErrorAlert(false)}
                                />
                            </View>
                        )}
                        <Text style={styles.label}>
                            Please enter your email address below and stay connected with us.
                        </Text>
                        <View style={styles.spaceBottom}>
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
                                        label="Email Address"
                                    />
                                )}
                            />
                        </View>
                        <NotificationAlert
                            type="warning"
                            title="Critical Notifications"
                            message="We'll keep you informed without overwhelming your inbox. By providing your email address, you're signing up for critical notifications."
                            showCloseIcon={false}
                            isVisible={true}
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.section}>
                        <View style={styles.toggleContainer}>
                            <Text style={styles.sectionLabel}>Paperless Billing</Text>
                            <Toggle
                                key={formState.paperlessBilling ? 'on' : 'off'}
                                onToggle={handleToggleChange}
                                name={'paperlessBilling'}
                                initialValue={formState.paperlessBilling}
                            />
                        </View>
                        <Text style={styles.description}>
                        Opt for email statements and say goodbye to paper clutter. It’s convenient, eco-friendly, and keeps your information at your fingertips. By signing up for Paperless Billing, you’ll also receive occasional updates and offers via email
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    {/* <View style={styles.section}>
                        <View style={styles.toggleContainer}>
                            <Text style={styles.sectionLabel}>Marketing Communications</Text>
                            <Toggle
                                key={formState.marketing ? 'on' : 'off'}
                                onToggle={handleToggleChange}
                                name={'marketing'}
                                initialValue={formState.marketing}
                            />
                        </View>
                        <Text style={styles.description}>
                            Be the first to know about exciting updates like plan upgrades and new features!
                        </Text>
                    </View> */}
                </View>
                <View style={styles.buttonContainer}>
                    <SecondaryButton title={"Save"} buttonType="submit" onPress={handleSubmit(handleSave, handleValidationError)} />
                    <SecondaryButton title={"Cancel"} onPress={() => navigation.navigate("Notifications")} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.colorWhitesmoke_200,
        marginBottom: 100,
    },
    frameContainer: {
        paddingVertical: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        marginHorizontal: Padding.p_base,
        marginTop: Padding.p_5xl,
    },
    section: {
        marginHorizontal: Padding.p_base,
    },
    label: {
        fontSize: FontSize.size_base,
        color: Color.colorGray_200,
        marginBottom: Padding.p_base,
    },
    sectionLabel: {
        fontSize: FontSize.size_base,
        color: Color.colorGray_200,
    },
    description: {
        fontSize: FontSize.size_sm,
        color: Color.sparklightDarkGray,
        marginTop: Padding.p_5xs,
    },
    divider: {
        height: 1,
        backgroundColor: '#CCC',
        marginVertical: 20,
    },
    spaceBottom: {
        marginBottom: Padding.p_base,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        paddingHorizontal: Padding.p_base,
    },
});

export default AddEmailNotification;