import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Image,
  Pressable
} from "react-native";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUser } from "../../redux/utils/LocalStorage";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { GetApiRequest, PutApiRequest } from "../../network/APIClient";
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import SparkLightInput from "../common/customui/SparkLightInput";
import { updateProfileSecurity } from '../../redux/actions/ProfileActionSuite';
import { FlatList } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { updatePasswordSchema, passwordSchema } from '../utility/validationSchema'; // Update the path as necessary
import NotificationAlert from "../common/customui/NotificationAlert";
import Loader from "../utility/Loader";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



const UpdateModemPassword = (props) => {

  const isEEroDevice = props?.route?.params?.isEEroDevice || false;
  const eeroDeviceData = props?.route?.params?.eeroDeviceData || null;
  const networkPath = eeroDeviceData?.networks[0];
  const parts = networkPath?.split('/');
  const networkId = parts?.length > 0 ? parts[parts.length - 1] : null;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [slectedPasword, setSelectedPassword] = useState("")
  const [isFocused, setTextFocused] = useState(false)
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [showValidationSuccessAlert, setShowValidationSuccessAlert] = useState(false);
  const [modemPasswordData, setModemPasswordData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showError, setShowError] = useState(false)
  const [newPasswordLength, setNewPasswordLength] = useState(0)
  const [confirmPasswordLength, setConfirmPasswordLength] = useState(0)
  const [loading, setLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);


  useEffect(() => {
    if(!isEEroDevice){
    getModemPassword();
    }
  }, [])

  useEffect(() => {
    modemPasswordData?.map((item) => {
      if (item.ssid == slectedPasword) {
        setSelectedItem(item)
      }
    })
  }, [slectedPasword])

  const getModemPassword = () => {
    setLoading(true)
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modem/security/Get`;
      GetApiRequest(request, onSuccess, onError);
    });
  };

  const { control, handleSubmit, setValue, reset, formState: { errors }, getValues } = useForm({
    // resolver: yupResolver(passwordSchema()),
    defaultValues: {
      newPassword: newPassword?.target?.value,
      confirmPassword: confirmPassword?.target?.value
    }
  });

  const _onSuccess = (res) => {
    reset()
    setLoading(false)
    if (res) {
      setShowValidationSuccessAlert(true)
    }
  }
  const onSuccess = (res) => {
    setLoading(false)
    console.log("updateModemPassword", res);
    if (res) {
      console.log("sccess ")
      console.log({ res })
      setModemPasswordData(res)
      const list = res.map((value) => value.ssid)
      setPasswordList(list);
      console.log(list)
      setSelectedPassword(list[0])
    }
  };
  const onError = (error) => {
    setLoading(false)
  };

  const _onError = () => {
    reset();
    setLoading(false)
    setShowValidationAlert(true)
  };

  const handlePasswordSelection = (value) => {
    setIsDropDownOpen(false)
    setSelectedPassword(value)
  }

  useEffect(() => {
    if (getValues('newPassword')?.length > 0 && getValues('confirmPassword') !== getValues('newPassword')) setShowError(true)
    else setShowError(false)
  }, [newPasswordLength, confirmPasswordLength])

  const onSubmit = data => {
    if(getValues('newPassword')?.length == 0 || getValues('newPassword')?.length == undefined) {
      setShowError(true)
      return
    }
    console.log(`getValues('newPassword')?.length > 0`,getValues('newPassword')?.length);
    if (showError) {
      return
    }
    else {
      if (isEEroDevice) updateEEroModemPassword()
      else updateModemPassword()
    }
  };
  const updateModemPassword = () => {
    setLoading(true)
    let body = {
      id: selectedItem?.id,
      ssid: slectedPasword,
      securityKey: getValues('newPassword')
    }

    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modem/security/Put`;
      console.log(`request`, request);
      PutApiRequest(request, body, _onSuccess, _onError);
    });
  };
  const updateEEroModemPassword = () => {
    setLoading(true)
    let body = {
      accountNumber: eeroDeviceData?.partner_account_id,
      password: getValues('newPassword'),
      networkId: networkId
    }
    let re = getUser().then((res) => {
      const request = `/mobile/api/eero/UpdatePassword`;
      console.log(`request`, request);
      PutApiRequest(request, body, _onSuccess, _onError);
    });
  };

  return (
    <View style={styles.viewBackground}>
      <ProfileSettingsHeader
        accessibilityElementsHidden={isDropDownOpen}
        importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
        title={isEEroDevice ? 'Update Wifi Password' : "Update Modem Password"}
        onPressBack={() => navigation.navigate("ManageEquipmentScreen")}
      />
      <View
        accessibilityElementsHidden={isDropDownOpen}
        importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
        style={{ marginHorizontal: 20, marginTop: 20 }}>
        <NotificationAlert
          type="error"
          title="Error"
          message="An error occurred. Please try again later with a different password."
          showCloseIcon={true}
          isVisible={showValidationAlert}
          onClose={() => setShowValidationAlert(false)}
        />
        <NotificationAlert
          type="success"
          title="Success"
          message="Your password has been saved successfully."
          showCloseIcon={true}
          isVisible={showValidationSuccessAlert}
          onClose={() => setShowValidationSuccessAlert(false)}
        />
      </View>
      <KeyboardAwareScrollView>


        <View style={styles.viewBackgroundContainer}>
          {isEEroDevice &&
            <View style={styles.frameWrapper}>
              <View style={styles.infoCircleWrapper}>
                <Image
                  style={styles.infoCircleIcon}
                  resizeMode="contain"
                  source={require("../../../assets/infocircle.png")}
                />
              </View>
              <Text style={[styles.notificationsSentFrom, styles.notificationsSentFromTypo]}>
                {`To access more features of your Eero device,please download the `}
                <Text onPress={() => {
                  navigation.navigate("EEroFeatures");
                }} style={[styles.text]}>
                  {`eero Wifi App`}
                </Text>
              </Text>
            </View>
          }
          {!isEEroDevice && <>
            <Text
              accessibilityElementsHidden={isDropDownOpen}
              importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
              style={[styles.firstName1, styles.firstTypo]}>SSID</Text>
            <View style={{}}>
              <SparkLightDropdown
                items={passwordList}
                selectedValue={slectedPasword}
                onValueChange={handlePasswordSelection}
                isDropDownOpen={(value) => {
                  setIsDropDownOpen(true)
                }}
              />
            </View>
          </>}
          <View
            accessibilityElementsHidden={isDropDownOpen}
            importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
            style={{ marginTop: 15 }}>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <SparkLightInput
                  onBlur={onBlur}
                  label={'New Password'}
                  onChangeText={(text) => {
                    if (text.length > 0) setNewPasswordLength(text.length);
                    else setNewPasswordLength(0);
                    // setNewPassword(text)
                    onChange(text)
                  }}
                  placeholder="New Password"
                  // value={newPassword}
                  value={value}
                  showTextIcon
                // error={error?.message}
                />
              )}

            />
          </View>
          <View
            accessibilityElementsHidden={isDropDownOpen}
            importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
            style={{ marginTop: 15 }}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <SparkLightInput
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    if (text.length > 0) setConfirmPasswordLength(text.length);
                    else setConfirmPasswordLength(0);
                    onChange(text)
                  }}
                  label={'Confirm New Password'}
                  placeholder="Confirm New Password"
                  value={value}
                  showTextIcon
                // error={error?.message}
                />
              )}
            />
            {showError ? <Text style={styles.errorText}>{`Password do not match`}</Text> : null}
          </View>
        </View>
        <View
          accessibilityElementsHidden={isDropDownOpen}
          importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : 'no'}
          style={styles.buttonContainer}>
          <Pressable
            accessible={true}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={isEEroDevice ? `Update Wifi Password` : `Update Modem Password`}
            style={[styles.button, styles.buttonsLayout]}
            onPress={handleSubmit(onSubmit, onInvalid = (error) => {
              setShowError(true)
            })}
          >
            <Text style={[styles.accept]}>
              {isEEroDevice ? `Update Wifi Password` : `Update Modem Password`}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      {loading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBackgroundContainer: {
    padding: Padding.p_base,
    backgroundColor: Color.sparklightWhite,
    margin: Padding.p_5xl
  },
  viewBackground: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  titleText: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontSize: FontSize.size_3xl,
  },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    padding: 20
  },
  focusedContainer: {
    color: Color.sparklightBrightPurple
  },
  image: {
    width: 24,
    height: 24,
  },
  textInput: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: Padding.p_5xl
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    width: '100%',
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  errorText: {
    color: 'red',
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  firstName1: {
    color: Color.sparklightGray1,
    fontSize: FontSize.textXsSemibold_size,
    alignSelf: "stretch",
  },
  firstTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: 10,
    paddingVertical: Padding.p_5xs
  },
  notificationsSentFrom: {
    marginLeft: 8,
    color: Color.colorGray_100,
    fontWeight: '400',
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_200,
    marginLeft: 8,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  text: {
    color: Color.colorMidnightblue,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  infoCircleIcon: {
    width: 18,
    height: 18,
    marginTop: -3
  },
  infoCircleWrapper: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
});



export default UpdateModemPassword;

