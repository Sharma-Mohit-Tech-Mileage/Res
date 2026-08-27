import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { usernameTerms, validateUsername } from "../utility/constant";
import { ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import PrimaryButton from "../common/customui/PrimaryButton";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import {
  Padding,
  FontSize,
  Color,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { PostApiRequest } from "../../network/RestApiClient";
import { getUser, getSsoToken } from "../../redux/utils/LocalStorage";
import NotificationAlert from "../common/customui/NotificationAlert";
import { usernameSchema } from "../utility/validationSchema";
import AppStyles from "../../styles/AppStyles";
import AlertIconV2 from "../../../src/res/svgIcons/AlertIconV2";
import {
  SectionTitle,
  SectionContent,
  HintText,
} from "../common/customui/Typography";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import UsernameSuccessModal from "./UsernameSuccessModal";
import { RefreshToken } from '../../components/user/Session';


const ProfileSettingsEdit = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const isLoginError = route?.params?.isLoginError || false;
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(isLoginError);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Profile update failed. Please try again.");
  const scrollViewRef = useRef(null);

  const handleSave = async (data) => {
    const newData = { ...data };
    console.log("New Data to be saved:", newData);
    // call updateUsername with validated value
    if (newData?.newUsername) {
      await updateUsername(newData.newUsername);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(usernameSchema()),
    defaultValues: {},
  });
function decodeIdToken(idToken) {
  try {
    // 1. Get the payload payload section (index 1)
    const base64Url = idToken.split('.')[1]; 
    
    // 2. Replace URL-safe characters back to standard Base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
    
    // 3. Decode the Base64 string to a JSON string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    // 4. Return parsed user information (e.g., email, name, sub)
    return JSON.parse(jsonPayload); 
  } catch (error) {
    console.error("Failed to parse ID Token claims", error);
    return null;
  }
}

  const updateUsername = async (newUsername) => {
    setLoading(true);
    try {
      const user = await getUser();
      const sso = await getSsoToken();
      const accountNumber =
        isLoginError? decodeIdToken(sso.idToken || sso.token).account_number : user?.accountNumber || user?.userInfo?.accountNumber || "";
      const userName =  isLoginError? decodeIdToken(sso.idToken || sso.token).preferred_username : user?.userInfo?.userName || user?.userName || "";
      const idToken = (sso && (sso.idToken || sso.token)) || "";

      const payload = {
        accountNumber: accountNumber,
        userName: userName,
        newUsername: newUsername,
        modifiedBy: "MobileApp",
        source: "MobileApp",
        idToken: idToken,
      };
      
      console.log("Decoded ID Token:", decodeIdToken(idToken));
      console.log("Updating username with payload:", payload);

      if (!accountNumber || !userName || !newUsername || !idToken) {
        // throw new Error("Missing required fields for username update");
       
        console.log("Missing required fields for username update. AccountNumber:",decodeIdToken(idToken)?.preferred_username, "UserName:", decodeIdToken(idToken)?.preferred_username, "NewUsername:", newUsername, "IdToken:", idToken);
        return;
      }

      PostApiRequest(
        ENDPOINTS.UPDATE_USERNAME,
        payload,
        (Response) => {
          setLoading(false);
          console.log(
            "Username updated successfully:",
            JSON.stringify(Response),
          );
          if (Response?.status === "success") {
            setDisplaySuccessAlert(true);
          } else if (Response?.status === "error") {
            setErrorMessage(Response?.errors[0] || "Profile update failed. Please try again.");
            setShowErrorAlert(true);
          }
        },
        (error) => {
          setLoading(false);
          console.warn("Update username error:", error);
          setErrorMessage("Profile update failed. Please try again.");
          setShowErrorAlert(true);
        },
      );
    } catch (err) {
      console.warn("Error preparing username payload:", err);
      setLoading(false);
      setShowErrorAlert(true);
    }
  };

  const handleValidationError = (errors) => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation]);

  useEffect(() => {
    return () => {
      setShowErrorAlert(false);
      setShowValidationAlert(false);
    };
  }, []);

  useEffect(() => {
    if (!isFocused ) {
      return undefined;
    }

    const refreshToken = () => {
     
      if(!isLoginError) {
      console.log("Refreshing token...");
      Promise.resolve(RefreshToken()).catch((error) => {
        console.warn("Refresh token error:", error);
        });
      }
    };
   
    refreshToken();

    const refreshInterval = setInterval(refreshToken, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [isFocused]);


  

  const renderErrorMessage = () => {
    return (
      <View style={[styles.errorMain]}>
        <View style={styles.errorInner}>
          <AlertIconV2 />

          <Text style={styles.errorText}>Your Account Needs Attention</Text>
          <Text style={styles.errorSubText}>
            Your current username is no longer supported. Please create a new username using only letters and numbers.
          </Text>
        </View>
      </View>
    );
  };

  const handleBackPress = () => {
    if (!isLoginError) {
      navigation.goBack();
    }else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Splash", params: { isLogout: true } }],
      });
    }
  }

  return (
    <View style={styles.profileSettingsEdit}>
      <ProfileSettingsHeader
        title="Edit Username"
        onPressBack={handleBackPress}
        showIcon={!isLoginError}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={[styles.profileSettingsEditInner]}>
          <View style={[AppStyles.card, styles.frameGroupSpaceBlock]}>
            <View style={styles.infoWrapper}>
              <NotificationAlert
                type="error"
                title="Error"
                message={errorMessage}
                showCloseIcon={true}
                isVisible={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
              />
              {isLoginError && renderErrorMessage()}
            </View>
            <View
              style={[
                styles.generalInformationWrapper,
                styles.informationWrapperFlexBox,
              ]}
            >
              <SectionTitle>Update Username</SectionTitle>

              
            </View>
            <View style={styles.frameParent}>
              <HintText
                style={styles.requiredFieldsText}
                accessibilityRole="text"
                accessible={true}
                accessibilityLabel="Fields marked with asterisk are required."
              >
                {" "}
                Fields marked with * are required.
              </HintText>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock,{marginTop: 24}]}
              >
                <Controller
                  control={control}
                  name="newUsername"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <SparkLightInput
                      placeholder=""
                      label={"New Username *"}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={error?.message}
                    />
                  )}
                />
              </View>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}
              >
                <Controller
                  control={control}
                  name="ConfirmNewUsername"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <SparkLightInput
                        label={"Confirm New Username *"}
                        placeholder=""
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
                      />

                      <View
                        accessible={true}
                        accessibilityRole="text"
                        accessibilityLabel={`Username requirements: ${usernameTerms.join(
                          ". ",
                        )}`}
                        style={[
                          styles.passwordFlexBox,
                          { marginTop: Padding.p_base },
                        ]}
                      >
                        {validateUsername(value).map((isValid, index) => (
                          <View
                            key={`point-${index}`}
                            style={styles.bulletPointContainer}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingTop: 6,
                              }}
                            >
                              <View
                                style={[
                                  styles.bullet,
                                  {
                                    backgroundColor: isValid
                                      ? Color.sparklightGreen
                                      : Color.colorGray_200,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.bulletPoiint}>
                              {usernameTerms[index]}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                />
              </View>
            </View>
          </View>
          <View style={{ marginTop: Padding.p_5xl }}>
            <PrimaryButton
              title="Save"
              buttonType="submit"
              onPress={handleSubmit(handleSave, handleValidationError)}
            />

            <View style={{ padding: 4 }}></View>
            <PrimaryButton
              title="Cancel"
              buttonType="outline"
              accessibilityLabel="Cancel"
              onPress={handleBackPress}
            />
          </View>
          {loading && <LoadingOverlay isVisible={loading} />}
          <UsernameSuccessModal
            visible={displaySuccessAlert}
            onClose={() => {
              setDisplaySuccessAlert(false);
              navigation.reset({
                index: 0,
                routes: [{ name: "Splash", params: { isLogout: true } }],
              });
            }}
          />
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
  bulletPoiint: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_xs,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 19,
    ellipsis: 'clip',
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    marginRight: 24,
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10,
  },
  buttonsLayout: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    lineHeight: 28,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
    flex: 1,
  },
  generalInformationWrapper: {
    paddingTop: Padding.p_base,
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
    marginBottom: 300,
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  profileSettingsEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  errorMain: {
    
    marginBottom: 16,
   
  },
  errorInner: {
    backgroundColor: "#FEF3F2",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderColor: "#DF2600",
    borderWidth: 1,
     borderRadius: 8,
  },
  errorText: {
    color: "##000000",
    fontFamily: FontFamily.RadioCanadaMedium,
    fontSize: FontSize.size_lg,
    padding: Padding.p_5xs,
    fontWeight: "500",
    lineHeight: 16,
    marginTop: 8,
  },
  errorSubText: {
    color: "##000000",
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_sm,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 4,
  },
  requiredFieldsText: {
    textAlign: "left",
    marginTop: 10,
    marginBottom: Padding.p_base,
    marginHorizontal: Padding.p_5xl,
    textAlign: "left",
  },
});

export default ProfileSettingsEdit;


