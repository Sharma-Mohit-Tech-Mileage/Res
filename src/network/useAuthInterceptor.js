import { useNavigation } from "@react-navigation/native";
import { cleanUserData } from "../redux/utils/LocalStorage"; // Adjust the import path as necessary

export const useAuthInterceptor = () => {
    const navigation = useNavigation();

    const redirectToLogin = async () => {
        try {
            console.log("Cleaning user data before redirecting to login...");
            await cleanUserData();
            console.log("User data cleaned. Redirecting to login...");

            navigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }], 
            });

            console.log("Navigation reset to Splash screen.");
        } catch (error) {
            console.error("Error during redirectToLogin:", error);
        }
    };

    return { redirectToLogin };
};