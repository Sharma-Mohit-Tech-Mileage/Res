import React,{useEffect , useRef} from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView , AccessibilityInfo , findNodeHandle } from 'react-native';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import WalletIcon from '../../../res/svgIcons/troubleshooting/WalletIcon';
import { Env } from '../../../network/apis/account/Constants';
import { useIsFocused } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TroubleshootComponent = ({
     pageCount
}) => {
    const navigation = useNavigation();
    let alertRef = useRef(null);

    useEffect(() => {
        const announceText = () => {
          const reactTag = findNodeHandle(alertRef.current);
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        };
        setTimeout(announceText, 100); 
      }, []);

    return (
        <View style={styles.container}>
            {pageCount ? <Text style={styles.topLeftText}>2 of 3</Text> : null}
            <View style={styles.content}>
                <View style={styles.circle}>
                    <WalletIcon />
                </View>
                <View
                 ref={alertRef}
                 accessibilityLiveRegion="assertive"
                 accessibility={true}
                style={styles.spinnerContainer}>
                    <NotificationAlert
                        type="warning"
                        title={(<Text style={styles.textStyle}>Uh oh. Looks like there is a past-due balance on your account.</Text>)}
                        showCloseIcon={false}
                    />
                </View>
                <View style={[styles.button]}>
                    <Pressable onPress={()=>{
              navigation.navigate("ArticalWindowUtility", {
                url: `${Env.URL}/billing`,
                name: "Billing Details",
                          });
                    }}
                   >
                        <Text style={[styles.accept]}>Pay Bill</Text>
                    </Pressable>  
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: windowHeight * 0.05,
        backgroundColor: Color.sparklightWhite,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: Padding.p_base
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '90%',
    },
    circle: {
        width: windowWidth * 0.5,
        height: windowWidth * 0.5,
        borderRadius: (windowWidth * 0.5) / 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#292929',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '400',
    },
    description: {
        lineHeight: 28,
        fontWeight: '400',
        fontSize: 16,
        color: '#4C5458',
        textAlign: 'center',
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        marginBottom: hp('15%'),
        width:'90%',
        paddingVertical: Padding.p_3xs,
    },
    
    accept: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    textStyle: {
        color: '#292929',
        fontFamily: FontFamily.interBold, // Make sure 'Inter' font is linked in your project
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'bold', // '700' is equivalent to 'bold' in React Native
        lineHeight: 18, // React Native requires a numeric value for lineHeight
    },
    topLeftText: {
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#292929',
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 28,
        padding: 10, // Add some padding around the text
    },
});

export default TroubleshootComponent;
