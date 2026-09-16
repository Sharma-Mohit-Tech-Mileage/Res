import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { Body, FieldTitle } from "../../common/customui/Typography";
import styles from "./speedTestStyles";

const ModemSpeedTestComplete = () => (
  <>
    <NotificationAlert
      type="success"
      layout="centered"
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
      layout="centered"
      showCloseIcon={false}
      containerStyle={styles.flatNotice}
      message="Pull down screen to refresh content."
     
      
    />
  </>
);
export default ModemSpeedTestComplete;
