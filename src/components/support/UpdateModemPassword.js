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


const UpdateModemPassword = () => {

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

  useEffect(() => {
    getModemPassword();
  }, [])

  useEffect(() => {
    modemPasswordData?.map((item) => {
      if (item.ssid == slectedPasword) {
        setSelectedItem(item)
      }
    })
  }, [slectedPasword])

  const getModemPassword = () => {
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modem/security/Get`;
      GetApiRequest(request, onSuccess, onError);
    });
  };

  const _onSuccess = (res) => {
    console.log();
    if (res) {
      setShowValidationSuccessAlert(true)
    }
  }
  const onSuccess = (res) => {
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
    console.log("error", error);
  };
  const handlePasswordSelection = (value) => {
    setSelectedPassword(value)
  }


  const handleUpdatePassword = () => {
    if (newPassword?.target?.value !== confirmPassword?.target?.value) {
      setShowValidationAlert(true)
      // Alert.alert("Error", "Passwords do not match");
      return;
    }
    // Handle the password update logic here
    updateModemPassword()
  };

  const handleSave = (formData) => {
    dispatch(updateProfileSecurity(formData, navigation)); // Dispatch with formData
  };

  const handleValidationError = () => {
    setShowValidationAlert(true);
  };

  const { control, handleSubmit, setValue, reset, formState: { errors }, getValues } = useForm({
    // resolver: yupResolver(passwordSchema()),
    defaultValues: {
      newPassword: newPassword?.target?.value,
      confirmPassword: confirmPassword?.target?.value
    }
  });

  useEffect(() => {
    if (getValues('newPassword')?.length > 0 && getValues('confirmPassword') !== getValues('newPassword')) setShowError(true)
    else setShowError(false)
  }, [newPasswordLength, confirmPasswordLength])

  const onSubmit = data => {
    if (showError) {
      return
    }
    else updateModemPassword()
  };
  const updateModemPassword = () => {
    let body = {
      id: selectedItem?.id,
      ssid: slectedPasword,
      securityKey: getValues('newPassword')
    }

    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modem/security/Put`;
      console.log(`request`, request);
      PutApiRequest(request, body, _onSuccess, onError);
    });
  };

  return (
    <View style={styles.viewBackground}>
      <ProfileSettingsHeader
        title="Update Modem Password"
        onPressBack={() => navigation.navigate("ManageEquipmentScreen")}
      />
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <NotificationAlert
          type="error"
          title="Error"
          message="Your confirm password is not same."
          showCloseIcon={true}
          isVisible={showValidationAlert}
          onClose={() => setShowValidationAlert(false)}
        />
        <NotificationAlert
          type="success"
          title="Success"
          message="Your new password updated"
          showCloseIcon={true}
          isVisible={showValidationSuccessAlert}
          onClose={() => setShowValidationSuccessAlert(false)}
        />
      </View>
      <View style={styles.viewBackgroundContainer}>
        <Text style={styles.titleText}>SSID</Text>
        <View style={{}}>
          <SparkLightDropdown
            items={passwordList}
            selectedValue={slectedPasword}
            onValueChange={handlePasswordSelection}
            dropDownStyle={{ color: Color.sparklightDarkGray }}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={[styles.titleText, { marginBottom: 5 }]}>New Password</Text>
          <Controller
            control={control}
            name="newPassword"
            rules={{
              required: {
                value: true,
                message: 'Field is required!'
              }
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <SparkLightInput
                onBlur={onBlur}
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
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.titleText, { marginBottom: 5 }]}>Confirm New Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            rules={{ // Move your rules outside of the render prop
              // required: {
              //   value: true,
              //   message: 'Field is required!'
              // },
              validate: value => value === getValues('newPassword') || 'Password do not match'
            }}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <SparkLightInput
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text.length > 0) setConfirmPasswordLength(text.length);
                  else setConfirmPasswordLength(0);
                  onChange(text)
                }}
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
      <View style={styles.buttonContainer}>
        <Pressable
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Update Modem Password"
          style={[styles.button, styles.buttonsLayout]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.accept]}>
            Update Modem Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBackgroundContainer: {
    padding: Padding.p_5xl,
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
});



export default UpdateModemPassword;

