import React, { useEffect, useState } from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";

// Dismissal is local to Manage Equipment and its reboot/speed-test flows.
const EquipmentAlert = ({ isVisible = true, onClose, ...props }) => {
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    setDismissed(false);
  }, [isVisible, props.type, props.title, props.message]);

  return (
    <NotificationAlert
      {...props}
      showCloseIcon
      isVisible={isVisible && !dismissed}
      onClose={() => {
        setDismissed(true);
        onClose?.();
      }}
    />
  );
};

export default EquipmentAlert;
