import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Padding, FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import SparkLightButton from '../common/customui/SparkLightButton';
import { useNavigation } from "@react-navigation/native";
const TicketSupportNone = () => {
    const navigation = useNavigation();
    return (

        <View style={styles.ticketSupportNone}>
            <ProfileSettingsHeader
                title="Ticket Support"
                onPressBack={() => navigation.navigate('Home')}
            />
            <View style={styles.frameParent}>
                <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
                    <View style={styles.ticketsParent}>
                        <Text style={styles.tickets}>Tickets</Text>
                        <SparkLightButton
                            onPress={() => navigation.navigate('CreateTicket')}
                            buttonText="Create Ticket"
                        />
                    </View>
                    <View style={styles.frameWrapper}>
                        <View style={styles.frameBorder}>
                            <View style={styles.frameView}>
                                <View style={styles.featuredIconParent}>
                                    <View style={styles.featuredIconLayout}>
                                        <Image
                                            resizeMode="cover"
                                            source={require("../../../assets/ticket-02.png")}
                                        />
                                    </View>
                                    <Text style={[styles.noTicketsCreated, styles.createATicketTypo]}>
                                        No Tickets Created
                                    </Text>
                                    <Text style={[styles.createATicket, styles.createATicketTypo]}>
                                        Create a ticket to receive support
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    ticketSupportNone: {
        backgroundColor: Color.colorWhitesmoke_200,
        width: '100%',
        flex: 1,
        overflow: "hidden",
    },
    frameGroupSpaceBlock: {
        paddingBottom: Padding.p_5xl,
        paddingTop: Padding.p_base,
    },
    frameParent: {
        // flex: 1,
        top: 100,
        padding: Padding.p_base,
    },
    frameGroup: {
        //flex: 1,
        borderColor: Color.sparklightGray1,
        borderRadius: Border.br_11xs,
        backgroundColor: Color.sparklightWhite,
        overflow: "hidden",
    },
    ticketsParent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Padding.p_5xl,
        paddingBottom: Padding.p_5xl
    },
    tickets: {
        flex: 1,
        fontSize: FontSize.size_3xl,
        color: Color.sparklightGray1,
        fontFamily: FontFamily.openSansRegular,

    },
    featuredIcon: {
        borderRadius: 24,
    },
    featuredIconLayout: {
        width: 48, // Width as per Figma design
        height: 48, // Height as per Figma design
        borderRadius: 24, // This will make it a circle
        padding: 12, // Padding as per Figma design
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        borderColor: '#F4F4F5', // Border color from Figma design
        borderWidth: 8, // Border width from Figma design (calculated based on Figma properties)
        backgroundColor: '#F4F4F5', // Background color from Figma design
    },
    createATicketTypo: {
        textAlign: "center",
        fontFamily: FontFamily.openSansRegular,
        lineHeight: 28,
        marginTop: 8,
    },
    noTicketsCreated: {
        fontSize: FontSize.size_base,
        color: Color.sparklightGray1,
    },
    createATicket: {
        color: Color.sparklightDarkGray,
        fontSize: FontSize.size_sm,
    },
    featuredIconParent: {
        justifyContent: "center",
        alignItems: "center",
    },
    frameView: {
        paddingVertical: 48,
        justifyContent: "center",
        paddingHorizontal: Padding.p_5xl,
    },
    frameBorder: {
        borderWidth: 1,
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
    },
    frameWrapper: {
        paddingHorizontal: Padding.p_base,
    },
    frameChild: {
        marginTop: 10,
        borderRadius: Border.br_11xs,
        height: 24,
    },
});

export default TicketSupportNone;
