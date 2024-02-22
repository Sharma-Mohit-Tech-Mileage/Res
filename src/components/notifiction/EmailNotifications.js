import React, { useState, useEffect, useRef } from "react";
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
import { useAnalytics } from '../utility/AnalyticsContext';
import { updateEmailNotification, updateFreshEmail, unsubscribePaperless } from '../../redux/actions/ProfileActionSuite';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  paperlessBilling: yup.boolean(),
});

const EmailNotifications = () => {
  const scrollViewRef = useRef(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const route = useRoute();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {};
  const paperlessdata = route.params?.additionalData;
  const [initialEmail, setInitialEmail] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { logEvent } = useAnalytics();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: paperlessdata?.email || '',
      paperlessBilling: paperlessdata?.status || false,
    },
  });

  // Set the initial email when the component mounts or the paperlessdata updates....
  useEffect(() => {
    setInitialEmail(paperlessdata?.email || '');
  }, [paperlessdata?.email]);


  const handleSave = data => {
    console.log('handleSave called with data:', data); // Log the initial data received by the function

    const { email, paperlessBilling } = data;
    const updatedProfileDetails = { ...profileDetailsfromStore };
    const emailChanged = email !== updatedProfileDetails.svEmailAddress;
    console.log('Email changed:', emailChanged); // Log if the email has changed
    console.log('Initial profile details:==============================', updatedProfileDetails); // Log the initial profile details

    if (emailChanged) {
      updatedProfileDetails.email = updatedProfileDetails.svEmailAddress;
      updatedProfileDetails.svEmailAddress = email;
      console.log('Updated profile details after email change:', updatedProfileDetails); // Log the updated profile details after email change
    }

    if (paperlessBilling) {
      console.log('Paperless billing is enabled'); // Log if paperless billing is enabled
      if (paperlessdata?.isNew) {
        console.log('Dispatching updateFreshEmail'); // Log the dispatch of updateFreshEmail
        dispatch(updateFreshEmail(email, emailChanged, updatedProfileDetails, navigation));
      } else {
        console.log('Dispatching updateEmailNotification'); // Log the dispatch of updateEmailNotification
        dispatch(updateEmailNotification(email, emailChanged, updatedProfileDetails, navigation));
      }
    } else {
      console.log('Unsubscribing from paperless billing'); // Log the unsubscribe action
      dispatch(unsubscribePaperless(navigation));
    }

    logEvent('email_notification_update', { email, paperlessBilling, emailChanged });
    console.log('Event logged: email_notification_update', { email, paperlessBilling, emailChanged }); // Log the event being logged
  };




  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setErrorMsg('Please enter valid information to continue.')
    setShowErrorAlert(true);
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      setShowErrorAlert(true);
      setErrorMsg('Notifications updated failed')
    }
  }, [route.params?.updateFailed]);

  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title="Edit Email Notifications"
        onPressBack={() => navigation.navigate('Notifications')}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <ScrollView>
        <View style={styles.emailNotificationsInner}>
          <View style={[styles.frameContainer, styles.navigationBorder]} accessible >
            <View style={styles.frameGroup}>
              <View style={[styles.frameView, styles.frameFlexBox]}>
                <View style={styles.frameParent1} >
                  <NotificationAlert
                    type="error"
                    title="Failed"
                    message={errorMsg}
                    showCloseIcon={true}
                    isVisible={showErrorAlert}
                    onClose={() => setShowErrorAlert(false)}
                  />
                  <View style={[styles.paperlessBillingParent, styles.frameFlexBox]}>
                    <View style={styles.frameViewArea}>
                      <View style={styles.infoCircleWrapper}>
                        <Image
                          style={styles.infoCircleIcon}
                          resizeMode="cover"
                          source={require("../../../assets/infocircle.png")}
                        />
                      </View>
                      <Text style={[styles.youAreSubscribedContainer, styles.containerTypo,]} >
                        <Text
                          style={styles.youAreSubscribed}
                        >{`You are subscribed to text message alerts. `}</Text>
                        <Text style={styles.replyStopTo}>
                          Reply STOP to cancel at any time. Call 1-800-123-0456 for
                          support. Message and data rates may apply.
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{ paddingVertical: Padding.p_base }}>
                    <View style={styles.frameChild} />
                  </View>
                  <View style={[styles.paperlessBillingParent, styles.frameFlexBox]}>
                    <Text style={styles.paperlessBilling}>
                      Email
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: Padding.p_5xl }} >
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <SparkLightInput
                          placeholder="Email Address"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={errors.email?.message}
                        />
                      )}
                    />
                  </View>
                  <View style={{ paddingVertical: Padding.p_base }}>
                    <View style={styles.frameChild} />
                  </View>
                  <View style={[styles.paperlessBillingParent, styles.frameFlexBox,]}>
                    <Text style={styles.paperlessBilling}>
                      Paperless Billing
                    </Text>
                    <Controller
                      control={control}
                      name="paperlessBilling"
                      render={({ field: { onChange, value } }) => (
                        <Toggle
                          onToggle={newValue => onChange(newValue)}
                          initialValue={value}
                        />
                      )}
                    />
                  </View>
                  <Text style={[styles.receiveBillingStatements, styles.receiveTypo]}>
                    Receive billing statements via email and no longer receive
                    paper statements in the mail.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonsParent} accessible >
            <Pressable
              style={[{ backgroundColor: Color.colorMidnightblue }, styles.buttonsLayout]}
              onPress={handleSubmit(handleSave, handleValidationError)}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("Notifications")}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Cancels the action and returns to Notifications screen"
            >
              <Text style={[{ color: Color.colorMidnightblue }, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
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
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  youAreSubscribed: {
    lineHeight: 28,
  },
  replyStopTo: {
    lineHeight: 24,
  },
  youAreSubscribedContainer: {
    marginLeft: 8,
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
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
  buttonsLayout: {
    paddingHorizontal: 0,
    width: '100%',
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  paperlessBilling: {
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    lineHeight: 28,
    flex: 1,
  },
  paperlessBillingParent: {
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  receiveBillingStatements: {
    color: Color.colorGray_100,
    lineHeight: 28,
    paddingHorizontal: Padding.p_5xl
  },
  frameParent1: {
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    flex: 1,
  },
  frameView: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
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
  makePayment: {
    color: Color.sparklightWhite,
    width: 282,
  },
  buttons1: {
    marginTop: Padding.p_base,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
    width: 382,
  },
  buttonsParent: {
    marginTop: Padding.p_base,
    alignSelf: "stretch",
  },
  emailNotificationsInner: {
    marginTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: '100%',
    overflow: "hidden",
  },
});

export default EmailNotifications;
