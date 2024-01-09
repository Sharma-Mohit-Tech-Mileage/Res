import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Padding, FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileRequest } from '../../redux/actions/ProfileActionSuite';
import NotificationAlert from '../common/customui/NotificationAlert';
import { profileSchema } from '../utility/validationSchema';
import { isPrimaryAdmin } from '../utility/constant';

const ProfileSettingsEdit = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [initialEmailAddress, setInitialEmailAddress] = useState('');
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {};
  const isPrimaryUser = isPrimaryAdmin(profileDetailsfromStore.memberType);
  const scrollViewRef = useRef(null);
  const [smsPayload, setSmsPayload] = useState(route.params?.smsPayload || {});

  const handleSave = async (data) => {
    const newData = { ...data };
    delete newData.phoneNumber; // Safe operation even if phoneNumber does not exist
    const emailChanged = newData.svEmailAddress !== initialEmailAddress;
    if (emailChanged) {
      newData.email = initialEmailAddress;
    }
    dispatch(updateProfileRequest(newData, smsPayload, navigation));
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema(isPrimaryUser, profileDetailsfromStore.multipleEmails)),
    defaultValues: {
      ...profileDetailsfromStore,
      phoneNumber: smsPayload.phoneNumber
    }
  });

  const updateSmsPayloadPhoneNumber = (e) => {
    const { value } = e.target;
    setSmsPayload(smsPayload => ({
      ...smsPayload,
      'phoneNumber': value
    }));
  };

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
  };

  useEffect(() => {
    reset({ ...profileDetailsfromStore });
  }, [profileDetailsfromStore, reset]);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation]);

  useEffect(() => {
    setInitialEmailAddress(profileDetailsfromStore.svEmailAddress || '');
  }, [profileDetailsfromStore]);

  useEffect(() => {
    return () => {
      setShowErrorAlert(false);
      setShowValidationAlert(false);
    };
  }, []);

  return (
    <View style={styles.profileSettingsEdit}>
      <ProfileSettingsHeader
        title="Edit Profile"
        onPressBack={() => navigation.navigate('ProfileSettings')}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={[styles.profileSettingsEditInner]}>
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <View style={styles.infoWrapper}>
              <NotificationAlert
                type="error"
                title="Failed"
                message="Your profile update failed."
                showCloseIcon={true}
                isVisible={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
              />
              <NotificationAlert
                type="error"
                title="Error"
                message="Please enter valid information to continue."
                showCloseIcon={true}
                isVisible={showValidationAlert}
                onClose={() => setShowValidationAlert(false)}
              />
            </View>
            <View style={[styles.generalInformationWrapper, styles.informationWrapperFlexBox]}>
              <Text style={styles.generalInformation} >
                General Information
              </Text>
            </View>
            <View style={styles.frameParent}>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <SparkLightInput
                      placeholder="First Name"
                      label={"First Name"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </View>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <SparkLightInput
                      label={"Last Name"}
                      placeholder="First Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <Controller
                  control={control}
                  name="userName"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <SparkLightInput
                      label={'Username'}
                      placeholder="First Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={false}
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>
            <View style={styles.rectangleWrapper}>
              <View style={styles.frameItem} />
            </View>
            <View style={{ marginTop: Padding.p_base }}>
              <View style={[styles.contactInformationWrapper, styles.informationWrapperFlexBox]}>
                <Text style={styles.generalInformation}>
                  Contact Information
                </Text>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <Controller
                  control={control}
                  name="svEmailAddress"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <SparkLightInput
                      label={'Email'}
                      placeholder="Email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={(!isPrimaryUser || profileDetailsfromStore.multipleEmails)?'':value}
                      editable={!profileDetailsfromStore.multipleEmails && isPrimaryUser}
                      error={error?.message}
                    />
                  )}
                />
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <Controller
                  control={control}
                  name="phoneNumber" // This should be the name used in your validation schema
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SparkLightInput
                      placeholder="Mobile number"
                      onBlur={onBlur}
                      label={'Mobile Phone'}
                      onChangeText={(text) => {
                        onChange(text);
                        updateSmsPayloadPhoneNumber(text);
                      }}
                      value={isPrimaryUser?value:""}
                      editable={isPrimaryUser}
                      error={errors.phoneNumber?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
          <View style={{ marginTop: Padding.p_base }}>
            <Pressable style={[{ backgroundColor: Color.colorMidnightblue }, styles.buttonsLayout]} onPress={handleSubmit(handleSave, handleValidationError)}>
              <Text style={[{ color: Color.sparklightWhite }, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable style={[styles.buttonsLayout]} onPress={() => navigation.navigate("ProfileSettings")}>
              <Text style={[styles.makeTypo, { color: Color.colorMidnightblue }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  frameGroupSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  informationWrapperFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  buttonsLayout: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    lineHeight: 28,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  generalInformationWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  textinputWrapper: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParent: {
    alignSelf: "stretch",
  },
  frameItem: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    paddingVertical: 0,
    marginTop: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  contactInformationWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameGroup: {
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    paddingVertical: Padding.p_base,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  profileSettingsEditInner: {
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 200,
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  profileSettingsEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default ProfileSettingsEdit;
