import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { Body, FieldTitle } from "../../common/customui/Typography";
import styles from "./speedTestStyles";

const ModemSpeedTestComplete = () => (
  <>
    <NotificationAlert
      type="success"
      showCloseIcon={false}
      iconSize={44}
      containerStyle={styles.flatNotice}
    >
      <Body>
        <FieldTitle style={styles.success}>Speed test complete.</FieldTitle>{" "}
        Thank you for your patience.
      </Body>
    </NotificationAlert>
    <NotificationAlert
      type="info"
      showCloseIcon={false}
      message="Pull down screen to refresh content."
      containerStyle={styles.flatNotice}
    />
  </>
);
export default ModemSpeedTestComplete;
