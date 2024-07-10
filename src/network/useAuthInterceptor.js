import { useNavigation } from "@react-navigation/native";
import { cleanUserData } from "../redux/utils/LocalStorage"; // Adjust the import path as necessary

export const useAuthInterceptor = () => {
    const navigation = useNavigation();

    const redirectToLogin = async () => {
        await cleanUserData();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Splash' }], // Adjust this to match your navigation setup
        });
    };

    return { redirectToLogin };
};
