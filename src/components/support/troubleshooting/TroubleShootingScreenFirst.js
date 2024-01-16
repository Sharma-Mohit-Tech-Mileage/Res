import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import {
  FontFamily,
  Padding,
  Color,
} from "../../../../GlobalStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../res/Colors";


const TroubleshootingFirst = () => {
  //const navigation = useNavigation();
  const [msg1, setMsg1] = useState(
    "Let’s help you with troubleshooting and get your issue resolved."
  );
  const [msg2, setMsg2] = useState("Do you already know what the issue is?");

  useEffect(() => {}, []);

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        //onPressBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={[styles.card, { flexDirection: "column" }]}>
          <Text style={styles.questions}>{msg1}</Text>

          <Text style={[styles.questions, { fontWeight: "400" }]}>{msg2}</Text>

          <View style={styles.ActionContainer}>
            <TouchableOpacity style={styles.BtnContainer} onPress={() => {}}>
              <Text style={styles.Btn}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.BtnContainer} onPress={() => {}}>
              <Text style={styles.Btn}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modemRebootContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
    width: wp("100%"),
    padding: 20,
  },

  frameChild: {
    alignSelf: "center",
    width: 70,
    height: 70,
  },
  questions: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 22,
    marginBottom:20 
  },
  ActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  BtnContainer: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
    width:wp('42%')
  },
  Btn: {
    color: colors.snow_white,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 16,
  },
  borderSec: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
});

export default TroubleshootingFirst;
