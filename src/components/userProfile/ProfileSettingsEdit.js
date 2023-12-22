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
import { profileSchema } from '../utility/validationSchema'; // Update the path as necessary

const ProfileSettingsEdit = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [initialEmailAddress, setInitialEmailAddress] = useState('');
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {};
  const scrollViewRef = useRef(null);
  const handleSave = (data) => {
    const emailChanged = data.svEmailAddress !== initialEmailAddress;
    if (emailChanged) {
      data.email = data.svEmailAddress;
    }
    console.log('Here you get the validated data', data); // Here you get the validated data
    dispatch(updateProfileRequest(data, navigation));
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { // You can spread the profileDetailsfromStore object
      ...profileDetailsfromStore
    }
  });

  // useEffect to update the form's default values when profileDetailsfromStore changes
  useEffect(() => {
    reset({ ...profileDetailsfromStore }); // This will reset the form with new default values
  }, [profileDetailsfromStore, reset]);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation]);

  // When the component mounts or the profileDetailsfromStore changes, update the initial email address
  useEffect(() => {
    setInitialEmailAddress(profileDetailsfromStore.svEmailAddress || '');
  }, [profileDetailsfromStore]);

  return (
    <View style={styles.profileSettingsEdit}>
      <ProfileSettingsHeader
        title="Edit Profile"
        onPressBack={() => navigation.navigate('ProfileSettings')}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={[styles.profileSettingsEditInner]}>
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <NotificationAlert
              type="error"
              title="Failed"
              message="Your profile update failed."
              showCloseIcon={true}
              isVisible={showErrorAlert}
              onClose={() => setShowErrorAlert(false)}
            />
            <View style={[styles.generalInformationWrapper, styles.informationWrapperFlexBox]}>
              <Text style={styles.generalInformation} >
                General Information
              </Text>
            </View>
            <View style={styles.frameParent}>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    First Name
                  </Text>
                  <View >
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <SparkLightInput
                          placeholder="First Name"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Last Name
                  </Text>
                  <View >
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <SparkLightInput
                          placeholder="First Name"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View />
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Username
                  </Text>
                  <View >
                    <Controller
                      control={control}
                      name="userName"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <SparkLightInput
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
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Email
                  </Text>
                  <View >
                    <Controller
                      control={control}
                      name="svEmailAddress"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <SparkLightInput
                          placeholder="First Name"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          editable={!profileDetailsfromStore.multipleEmails}
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>Mobile Phone</Text>
                  <View >
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <SparkLightInput
                          placeholder="Mobile number"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: Padding.p_base }}>
            <Pressable style={[{ backgroundColor: Color.colorMidnightblue }, styles.buttonsLayout]} onPress={handleSubmit(handleSave)}>
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
  firstTypo: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
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
  textinput: {
    justifyContent: "center",
    alignSelf: "stretch",
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
    marginTop: 16,
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
  profileSettingsEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default ProfileSettingsEdit;
