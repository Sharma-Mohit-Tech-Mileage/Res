import * as React from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { FontFamily, Color } from "../../../../GlobalStyles";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ModemConnectivityGuide = ({route}) => {
    console.log('No Connection',JSON.stringify(route))
    const navigation = useNavigation();

    const instructions1 = [
        "Connect the power cable to the modem and plug it into a power outlet.",
        "Please allow up to 10 minutes for the issue to be resolved.",
    ];

    const instructions2 = [
        "Ensure one end of the coax cable is connected to the outlet for your Sparklight service.You might need to try different outlets to find the one enabled with Sparklight service.",
        "Next, locate the input port for the coax cable on the back of your modem and connect the other end of the coax cable.Ensure it's hand-tight and snug – no tools required."
    ]
    
    const renderInstruction = (instruction, index) => (
        <View key={index} style={styles.instructionContainer}>
            <View style={styles.bulletPoint} />
            <Text style={styles.instructionText}>{instruction}</Text>
        </View>
    );

    return (
        <View style={styles.modemRebootContainer}>
            <ProfileSettingsHeader
                title="Troubleshooting"
                onPressBack={() => {
                    if(route.params?.isSuccess){
                        navigation.goBack()
                    }else{
                    navigation.navigate('SupportStack')
                    }
                }
                }
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "column", paddingBottom: hp('15%') }}>
                    <View style={[styles.card, styles.shadowProp]}>
                        <Image style={styles.frameChild} resizeMode="cover" source={require("../../../../assets/modem-reboot-inst.png")} />
                        <Text style={styles.heading}>Is there power to the modem?</Text>
                        <View style={{ backgroundColor: "#F4F4F5", height: 1, marginVertical: 20 }} />
                        {instructions1.map(renderInstruction)}
                    </View>
                    <View style={[styles.card, styles.shadowProp]}>
                        <Image style={styles.frameChild} resizeMode="cover" source={require("../../../../assets/modem-reboot-inst1.png")} />
                        <Text style={styles.heading}>Is your modem connected to an outlet?</Text>
                        <View style={{ backgroundColor: "#F4F4F5", height: 1, marginVertical: 20 }} />
                        {instructions2.map(renderInstruction)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    modemRebootContainer: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        backgroundColor: Color.colorWhitesmoke_200,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 2,
        width: wp("92%"),
        marginTop: wp("8%"),
        padding: 20,
    },
    shadowProp: {
        shadowColor: "#171717",
        shadowOffset: { width: -1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    frameChild: {
        alignSelf: "center",
        width: 71,
        height: 70,
    },
    heading: {
        color: Color.sparklightGray1,
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "700",
        alignSelf: "center",
        marginTop: 10,
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Color.sparklightGray1,
        marginTop: 8, 
        marginRight: 8,
    },
    instructionText: {
        color: Color.sparklightGray1,
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        flexShrink: 1,
    },
});

export default ModemConnectivityGuide;
