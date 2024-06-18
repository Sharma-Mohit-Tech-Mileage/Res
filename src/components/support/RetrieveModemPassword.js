import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Image,
  Pressable,
  TouchableOpacity,
  Linking
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
import { useForm, Controller } from 'react-hook-form';
import { GetApiRequest } from "../../network/APIClient";
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import SparkLightInput from "../common/customui/SparkLightInput";
import PlugIcon from "../../res/svgIcons/plug";
import Loader from "../utility/Loader";
import WebView from 'react-native-webview';

const RetrieveModemPassword = () => {

  const navigation = useNavigation();

  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [slectedPasword, setSelectedPassword] = useState("")
  const [modemPasswordData, setModemPasswordData] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getModemPassword();
  }, [])

  useEffect(() => {
    modemPasswordData?.map((item) => {
      if (item.ssid == slectedPasword) {
        setPassword(item.securityKey)
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

  const onSuccess = (res) => {
    setLoading(false)
    if (res) {
      setModemPasswordData(res)
      const list = res.map((value) => value.ssid)
      setPasswordList(list);
      setSelectedPassword(list[0])
    }
  };
  const onError = (error) => {
    setLoading(false)
    console.log("error", error);
  };
  const handlePasswordSelection = (value) => {
    setSelectedPassword(value)
  }

  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    // resolver: yupResolver(passwordSchema(isCustomQuestionSelected)),
    defaultValues: {
      password: password
    }
  });

  return (
    <View style={styles.viewBackground}>
      <ProfileSettingsHeader
        title="Retrieve Modem Password"
        onPressBack={() => navigation.navigate("ManageEquipmentScreen")}
      />
      <View style={styles.viewBackgroundContainer}>
        <View style={{ paddingHorizontal: Padding.p_5xl, }}>
          <Text style={[styles.firstName1, styles.firstTypo]}>SSID</Text>
          <View style={{}}>
            <SparkLightDropdown
              items={passwordList}
              selectedValue={slectedPasword}
              onValueChange={handlePasswordSelection}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value, disabled }, fieldState: { error } }) => (
                <>
                  <SparkLightInput
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      if (!disabled) {
                        onChange(text);
                      }
                    }}
                    label={'Password'}
                    placeholder="Password"
                    value={password}
                    editable={false}
                    inputStyle={{ backgroundColor: 'transparent' }}
                  // error={error?.message}
                  />
                </>
              )}
            />
          </View>
        </View>
        <Text style={styles.howText}>How To</Text>
        <View style={styles.borderStyle} />
        <TouchableOpacity
          onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://support.cableone.net/hc/en-us/articles/115010513108-Wireless-Setup-Android', name: 'Connect Android Device' })}
          style={styles.connectAndroidView}>
          <View style={styles.connectAndroidTextView}>
            <PlugIcon />
            <Text style={[styles.connectTitleText]}>Connect Android Device</Text>
          </View>
          <Image style={styles.lockIcon} source={require('../../../assets/chevronright.png')} />
        </TouchableOpacity>
        <View style={styles.borderStyle} />
        <TouchableOpacity
          onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/115010391047-How-Do-I-Connect-Apple-Products-to-a-Wireless-Network', name: 'Connect iPhone Device' })}
          style={styles.connectAndroidView}>
          <View style={styles.connectAndroidTextView}>
            <PlugIcon />
            <Text style={[styles.connectTitleText]}>Connect iPhone Device</Text>
          </View>
          <Image style={styles.lockIcon} source={require('../../../assets/chevronright.png')} />
        </TouchableOpacity>
        <View style={styles.borderStyle} />
        <TouchableOpacity
          onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://support.cableone.net/hc/en-us/articles/115009649447-Wireless-Connection-Settings', name: 'Connect PC/MAC' })}
          style={styles.connectAndroidView}>
          <View style={styles.connectAndroidTextView}>
            <PlugIcon />
            <Text style={[styles.connectTitleText]}>Connect PC/MAC</Text>
          </View>
          <Image style={styles.lockIcon} source={require('../../../assets/chevronright.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          accessible={true}
          accessibilityRole="button"
          style={[styles.button, styles.buttonsLayout]}
          onPress={() => { navigation.navigate("ManageEquipmentScreen") }}
        >
          <Text style={[styles.accept]}>
            Close
          </Text>
        </Pressable>
      </View>
      {loading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  viewBackgroundContainer: {
    paddingTop: Padding.p_5xl,
    backgroundColor: Color.sparklightWhite,
    margin: Padding.p_5xl,
    paddingBottom: 5
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
  connectTitleText: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    flex: 1
  },
  howText: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontSize: FontSize.size_3xl,
    marginTop: 30,
    paddingHorizontal: Padding.p_5xl,
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
  borderStyle: {
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 5,
    borderColor: Color.sparklightGray
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 10
  },
  connectAndroidView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: Padding.p_5xl,
    paddingRight: Padding.p_base,
    paddingVertical: Padding.p_base,
  },
  connectAndroidTextView: {
    flexDirection: "row",
    flex: 1
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
});

export default RetrieveModemPassword;
