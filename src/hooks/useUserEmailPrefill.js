import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getPrimaryEmail } from "../components/utility/constant";

/**
 * useUserEmailPrefill
 * Clean reusable hook that prefills an email field in react-hook-form only if empty.
 */
export const useUserEmailPrefill = (
  getValues,
  setValue,
  fieldName = "feedbackEmail"
) => {
  const accountDetails = useSelector(
    (state) => state?.profile?.accountDetails
  );

  useEffect(() => {
    try {
      if (getValues(fieldName)) return;

      const email = getPrimaryEmail(accountDetails)?.trim();
      if (email) {
        setValue(fieldName, email.toLowerCase(), {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    } catch (e) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("useUserEmailPrefill warning:", e?.message);
      }
    }
  }, [accountDetails, getValues, setValue, fieldName]);
};

export default useUserEmailPrefill;
