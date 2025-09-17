import { useEffect } from "react";
import { getUser } from "../redux/utils/LocalStorage";

/**
 * useUserEmailPrefill
 * Clean reusable hook that prefills an email field in react-hook-form only if empty.
 * @param {Function} getValues - react-hook-form getValues
 * @param {Function} setValue - react-hook-form setValue
 * @param {string} fieldName - form field name to prefill (default: 'feedbackEmail')
 */
export const useUserEmailPrefill = (
  getValues,
  setValue,
  fieldName = "feedbackEmail"
) => {
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (getValues(fieldName)) return; // do not override user input
        const user = await getUser();
        const email = user?.userInfo?.email?.trim();
        if (active && email) {
          setValue(fieldName, email.toLowerCase(), {
            shouldValidate: true,
            shouldDirty: false,
          });
        }
      } catch (e) {
        // Intentionally silent; failure to prefill shouldn't surface
        if (__DEV__) console.log("useUserEmailPrefill warning:", e?.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [getValues, setValue, fieldName]);
};

export default useUserEmailPrefill;
