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
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../res/Colors";

const TroubleshootingSelectType = () => {
  //const navigation = useNavigation();
  const [msg1, setMsg1] = useState(
    "Select the issue type so we find your the right solution."
  );

  const [issueTypes, setIssueType] = useState([
    "No Internet connection",
    "Modem Issue",
    "Cables and connection",
    "Wifi issues",
    "Slow Internet",
    "High Ping in Online Games",
    "Network Security",
  ]);

  const ItemRender = ({ item }) => {
    return (
      <TouchableOpacity style={styles.listRow}>
        <Text style={styles.listItem}>{item}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        //onPressBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View
          style={[
            styles.card,
            { flexDirection: "column", marginHorizontal: 10 },
          ]}
        >
          <Text style={styles.questions}>{msg1}</Text>

          <View>
            {issueTypes?.map((item, index) => {
              return <ItemRender item={item} key={index} />;
            })}
          </View>
          <Text
            style={[
              styles.listItem,
              { fontSize: 14, alignSelf: "center", marginTop: 20 },
            ]}
          >
            Show More Issue Types
          </Text>
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

  questions: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 22,
    marginVertical: 20,
  },
  listItem: {
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
  },
  listRow: {
    padding: 10,
    backgroundColor: Color.colorWhitesmoke_200,
    marginVertical: 5,
  },

  borderSec: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
});

export default TroubleshootingSelectType;
