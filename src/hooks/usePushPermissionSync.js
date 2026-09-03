import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { checkNotificationPermission } from "../firebase/FirebaseUtils";
import { syncDeviceToken } from "../network/apis/account/profile.service";

// No OS callback exists for a permission granted in system Settings; this re-checks on mount and
// every return to foreground (read-only, never prompts) and re-syncs the FCM token when granted.
export default function usePushPermissionSync(onPermissionChange) {
  const callbackRef = useRef(onPermissionChange);
  callbackRef.current = onPermissionChange;

  useEffect(() => {
    const evaluate = async () => {
      const granted = await checkNotificationPermission();
      callbackRef.current?.(granted);
      if (granted) {
        syncDeviceToken();
      }
    };

    evaluate();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        evaluate();
      }
    });
    return () => subscription.remove();
  }, []);
}
