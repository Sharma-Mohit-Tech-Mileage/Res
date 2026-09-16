import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { Body, FieldTitle } from "../../common/customui/Typography";
import styles from "./speedTestStyles";
import { View } from "react-native";
import { theme } from "../../../styles/theme";  

const ModemSpeedTestComplete = () => (
  <View style={{margin: 16,}}>
    <NotificationAlert
      type="success"
      showCloseIcon={false}
      iconSize={22}
      containerStyle={styles.flatNotice}
    >
      <Body>
        <FieldTitle style={styles.success}>Speed test complete.</FieldTitle>{" "}
        Thank you for your patience.
      </Body>
    </NotificationAlert>
    <NotificationAlert
      type="info"
      iconSize={22}
      showCloseIcon={false}
      containerStyle={styles.flatNotice}
    >
       <Body>
        Pull down screen to refresh content.
      </Body>
      </NotificationAlert>
  </View>
);
export default ModemSpeedTestComplete;
