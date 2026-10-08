import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import dataUsageApi from "../../../network/apis/services/dataUsageService";
import { isEeroEquipment } from "../dataUsage/transformEquipment";

// Revalidate on Services entry and refresh; stale accounts must not enable eero tests.
export const useServiceSpeedEquipment = (accountNumber, refreshKey) => {
  const [validatedAccount, setValidatedAccount] = useState(null);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setValidatedAccount(null);
      if (accountNumber) {
        dataUsageApi
          .getEquipment()
          .then((data) => {
            if (!active) return;
            const devices = Array.isArray(data?.equipments)
              ? data.equipments
              : [];
            setValidatedAccount({
              accountNumber,
              hasEeroDevice: devices.some(isEeroEquipment),
            });
          })
          .catch(() => {
            if (active) setValidatedAccount(null);
          });
      }
      return () => {
        active = false;
      };
    }, [accountNumber, refreshKey]),
  );
  return (
    validatedAccount?.accountNumber === accountNumber &&
    validatedAccount?.hasEeroDevice === true
  );
};
