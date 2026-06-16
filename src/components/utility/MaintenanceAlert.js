import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaintenaceIcon from "../../res/svgIcons/MaintenanceIcon";
import { card } from "../../styles/utilities";
import { CONTENT_MAX_WIDTH } from "../../utils/responsive";

import {
  Color,
  Padding,
  FontFamily,
  FontSize,
  Border,
} from "../../../GlobalStyles";

const MaintenanceAlert = ({
  navigation,
  message = "Our app is currently undergoing scheduled maintenance and will be temporarily unavailable. Thanks for your patience as we work to improve your experience.",
  onClose,
  buttonText = "OK",
}) => {
  return (
    <View style={{ flexDirection: "column" }}>
      <View style={[card.elevated, { margin: 16, maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center", width: "100%" }]}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginVertical: 36,
            marginHorizontal: 24,
            borderColor: "#E1E1E1",
            borderWidth: 1,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              padding: 16,
            }}
          >
            <MaintenaceIcon color="red" size={24} style={{ marginBottom: 8 }} />
            <Text style={styles.errorTxt}>{message}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorTxt: {
    color: "#001321",
    fontSize: FontSize.size_base,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    marginTop: 8,
  },
});

export default MaintenanceAlert;
