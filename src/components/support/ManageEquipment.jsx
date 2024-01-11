import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import MyServicePlan from "../common/MyServicePlan";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import ModemIcon1 from "../../res/svgIcons/ModemIcon1";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
const ManageEquipment = () => {
    const navigation = useNavigation();

    const [manufacturer,setManufacturer]=React.useState('')
    const [model,setModel]=React.useState('')
    const [transmissionType,setTransmissionType]=React.useState('')
    const [leased,setLeased]=React.useState('')
    const [plans,setPlans]=React.useState([])

    const getLeasedDetails=()=>{
        let re = getUser().then((res) => {
            const request = `mobile/api/Device/GetOwnershipInfo?accountnumber=${res.userInfo.accountNumber}`;
            GetApiRequest(request, (res)=>{
                console.log("getLeasedDetails", res);
               setLeased(res.modemOwnership)
            }, (error)=>{
                console.log("getLeasedDetails Error", error);
            });
          });

    }

    const getInternetPlanDetails = () => {
        let re = getUser().then((res) => {
          const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
          GetApiRequest(request, (res)=>{
          setPlans(res)
          }, (error)=>{
                          
          });
        });
      };

    const getModemDetails = () => {
        let re = getUser().then((res) => {
          const request = `internet/api/internet/${res.userInfo.accountNumber}/modem`;
          GetApiRequest(request, onSuccess, onError);
        });
      };

      const onSuccess = (res) => {
        console.log("getModemDetails", res);
        if (res) {
            setManufacturer(res.manufacturer);
            setModel(res.model)
            setTransmissionType(res.transmissionType)
        }
        
      };
      const onError = (error) => {
        console.log("error", error);
      };

    React.useEffect(()=>{
       getModemDetails();
       getLeasedDetails();
       getInternetPlanDetails();
       

    },[])


    return (
        <View style={styles.manageEquipment}>
            <ProfileSettingsHeader
                title="Manage Equipment "
                onPressBack={() => navigation.navigate('support')}
            />
            <ScrollView>
                <View style={styles.myModemParent}>
                    <View style={[styles.myModem, styles.myModemSpaceBlock]}>
                        <View style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}>
                            <Text style={[styles.myModem1, styles.myModem1Typo]}>My Modem</Text>
                        </View>
                        <View style={styles.frameParentSpaceBlock1}>
                            <View style={[styles.frameWrapper, styles.contentSpaceBlock]}>
                                <View style={styles.frameContainer}>
                                    <View style={styles.docsis31Parent}>
                                    <View style={styles.iconBg}>
                                       <ModemIcon1 />
                                          </View>
                                        <View style={styles.motorolaParent}>
                                            <Text style={[styles.motorola, styles.myModem1Typo]}>
                                                {manufacturer}
                                            </Text>
                                            <Text style={styles.mb8600Docsis}>
                                                {model}:{transmissionType}
                                            </Text>
                                            {/* <View style={styles.poorHealthParent}>
                                                <Text style={[styles.poorHealth, styles.textTypo2]}>
                                                    Poor Health
                                                </Text>
                                                <Image
                                                    style={styles.frameChild}
                                                    resizeMode="cover"
                                                    source={require("../../../assets/Ellipse.png")}
                                                />
                                            </View> */}
                                            <View style={[styles.badge, styles.parentBorder]}>
                                                <Text style={[styles.text, styles.textTypo1]}>
                                                    {leased.toLocaleUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[styles.notificationsWrapper, styles.myModemSpaceBlock]}>
                                <View style={[styles.notifications, styles.parentBorder]}>
                                    <Image
                                        resizeMode="cover"
                                        source={require("../../../assets/rectangle-529.png")}
                                    />
                                    <View style={styles.bannerWarning}>
                                        <View style={styles.rightActionableParent}>
                                            <Image
                                                style={{ height: '100%' }} // Set both width and height to '100%'
                                                resizeMode="stretch" // Change resizeMode to stretch
                                                source={require("../../../assets/alertred.png")}
                                            />
                                            <View style={styles.creditCardWillExpireSoonParent}>
                                                <Text style={styles.creditCardWill}>
                                                    Modem has poor health
                                                </Text>
                                                <Text style={[styles.yourSavedCard, styles.yourSavedCardSpaceBlock,]} >
                                                    Try one of the options below to resolve.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View> */}
                        </View>
                        <View style={[styles.supportAccordionParent, styles.supportParentFlexBox]} >
                            <View style={[styles.frameLayout]} />
                            <TouchableOpacity style={[styles.frame9defaultSpaceBlock]} 
                            onPress={()=>{
                                navigation.navigate('ModemExchange')
                            }}>
                                <Image
                                    style={{width: 20,height: 20}}
                                    resizeMode="stretch"
                                    source={require("../../../assets/repeat-01.png")}
                                />
                                <Text style={styles.modemHealthSupport}>Exchange Modem</Text>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../../assets/chevronright.png")}
                                />
                            </TouchableOpacity>
                            {/* <View style={[styles.frameLayout]} />
                            <View style={[styles.frame9defaultSpaceBlock]} >
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../../assets/key-02.png")}
                                />
                                <Text style={styles.modemHealthSupport}>Update Password</Text>
                                <Image
                                    resizeMode="stretchstretch"
                                    source={require("../../../assets/chevronright.png")}
                                />
                            </View> */}
                            <View style={[styles.frameLayout]} />
                            <TouchableOpacity style={[styles.frame9defaultSpaceBlock]}
                            onPress={()=>{
                                navigation.navigate('ModemRebootScreen')
                            }} >
                                <Image
                                    style={{ width: 20, height: 20 }}
                                    resizeMode="stretch"
                                    source={require("../../../assets/refresh.png")}
                                />
                                <Text style={styles.modemHealthSupport}>Reboot Modem</Text>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../../assets/chevronright.png")}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.frameFlexBox]}>
                        <MyServicePlan plans={plans} navigation={navigation}/>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    textTypo2: {
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    myModemSpaceBlock: {
        paddingTop: Padding.p_base,
        alignSelf: "stretch",
    },
    frameParentSpaceBlock1: {
        paddingBottom: Padding.p_5xl,
        alignSelf: "stretch",
    },
    myModem1Typo: {
        color: Color.colorGray_100,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
    },
    contentSpaceBlock: {
        paddingVertical: 0,
        alignSelf: "stretch",
    },
    parentBorder: {
        borderWidth: 1,
        borderStyle: "solid",
    },
    textTypo1: {
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "center",
        lineHeight: 18,
    },
    yourSavedCardSpaceBlock: {
        marginTop: 8,
        alignSelf: "stretch",
    },
    supportParentFlexBox: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    frame9defaultSpaceBlock: {
        paddingVertical: Padding.p_base,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: Padding.p_5xl,
    },
    frameLayout: {
        width: '100%',
        height: 1,
        backgroundColor: Color.sparklightGray,
    },
    frameFlexBox: {
        padding: Padding.p_5xl,
        justifyContent: "center",
        alignItems: "center",
    },
    textTypo: {
        fontFamily: FontFamily.textXsSemibold,
        fontWeight: "600",
    },
    myModem1: {
        textAlign: "left",
        fontSize: FontSize.size_3xl,
        flex: 1,
    },
    myModemWrapper: {
        paddingTop: Padding.p_5xs,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: Padding.p_5xl,
    },
    motorola: {
        fontSize: FontSize.size_base,
        textAlign: "left",
    },
    mb8600Docsis: {
        color: Color.sparklightDarkGray,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
    },
    poorHealth: {
        color: Color.colorGray_100,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
        lineHeight: 28,
    },
    frameChild: {
        width: 8,
        height: 8,
        marginLeft: 8,
    },
    poorHealthParent: {
        alignItems: "center",
        flexDirection: "row",
    },
    text: {
        color: Color.colorGray_200,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    badge: {
        backgroundColor: Color.gray50,
        borderColor: Color.colorWhitesmoke_200,
        paddingHorizontal: Padding.p_5xs,
        paddingVertical: Padding.p_11xs,
        alignSelf: 'flex-start',
        alignItems: "center",
        flexDirection: "column",
        borderRadius: Border.br_11xs,
    },
    motorolaParent: {
        marginLeft: 24,
        justifyContent: "center",
        flex: 1,
    },
    docsis31Parent: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
    },
    frameContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frameWrapper: {
        paddingHorizontal: Padding.p_base,
        paddingVertical: 0,
    },
    creditCardWill: {
        fontWeight: "700",
        fontFamily: FontFamily.interBold,
        color: Color.sparkLightRed,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
    },
    yourSavedCard: {
        color: Color.colorGray_100,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    creditCardWillExpireSoonParent: {
        marginLeft: 10,
        flex: 1,
    },
    rightActionableParent: {
        flexDirection: "row",
        flex: 1,
    },
    bannerWarning: {
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: Color.sparklightWhite,
        alignSelf: "stretch",
        flex: 1,
    },
    notifications: {
        flexDirection: "row",
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
    },
    notificationsWrapper: {
        marginTop: 24,
        justifyContent: "center",
        paddingHorizontal: Padding.p_5xl,
    },
    modemHealthSupport: {
        marginLeft: 10,
        color: Color.colorGray_100,
        fontSize: FontSize.size_base,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
        flex: 1,
    },
    supportAccordionParent: {
        backgroundColor: Color.sparklightWhite,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
        overflow: "hidden",
    },
    myModem: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.sparklightWhite,
        backgroundColor: Color.sparklightWhite,
        borderRadius: Border.br_11xs,
        overflow: "hidden",
    },
    myModemParent: {
        paddingTop: Padding.p_5xl,
        paddingBottom: Padding.p_base,
        paddingHorizontal: Padding.p_5xl,
        marginBottom: '15%'
    },
    manageEquipment: {
        width: "100%",
        flex: 1,
        backgroundColor: Color.colorWhitesmoke_200,
    },iconBg: {
        backgroundColor: "#F4F4F5",
        padding: 5,
        width: wp("20%"),
        height: wp("20%"),
        borderRadius: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      },
});

export default ManageEquipment;
