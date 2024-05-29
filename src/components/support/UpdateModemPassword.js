import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Image,
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
import { GetApiRequest } from "../../network/APIClient";
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import SparkLightInput from "../common/customui/SparkLightInput";
import { FlatList } from "native-base";
import { color } from "native-base/lib/typescript/theme/styled-system";

const UpdateModemPassword = () => {

    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordList, setPasswordList] = useState([]);
    const [slectedPasword, setSelectedPassword] = useState("")
    const [isFocused, setTextFocused] = useState(false)


    React.useEffect(()=>{
        getModemPassword();
      },[])
    
      const getModemPassword = () => {
        let re = getUser().then((res) => {
          const request = `internet/api/internet/${res.userInfo.accountNumber}/modem/security/Get`;
          GetApiRequest(request, onSuccess, onError);
        });
      };
    
      const onSuccess = (res) => {
        console.log("getModemDetails", res);
        if (res) {
            console.log("sccess ")
            console.log({res})
           // setPasswordList(res)
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
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    // Handle the password update logic here
    Alert.alert("Success", "Password updated successfully");
  };

  return (
    <View style={styles.viewBackground}>
      <ProfileSettingsHeader
        title="Update Modem Password"
        onPressBack={() => navigation.navigate("ManageEquipmentScreen")}
      />
      <View style={styles.viewBackgroundContainer}>
      <Text style={styles.titleText}>SSID</Text>
        <View style={[styles.inputContainer, isFocused && styles.focusedContainer]}>
        <Image
          source=
            { require( "../../../assets/chevronright.png") }
          style={styles.image}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Type here..."
          onFocus={() => setTextFocused(true) }
          onBlur={() =>  setTextFocused(false) }

        />
      </View>
      
      <SparkLightDropdown
                      items={passwordList}
                      selectedValue={slectedPasword}
                      onValueChange={handlePasswordSelection}
                    />

        <View style={[styles.myModem, styles.myModemSpaceBlock]}></View>
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
    marginBottom: 10
  },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    padding: 20
  },
  focusedContainer :{
    color: Color.sparklightBrightPurple
  },
  image: {
    width: 24,
    height: 24,
  },
  textInput: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base
  }

});



export default UpdateModemPassword;
