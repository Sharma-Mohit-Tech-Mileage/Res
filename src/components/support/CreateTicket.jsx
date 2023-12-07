import * as React from "react";
import {
    Image, StyleSheet, TextInput, Text, View, TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Padding, FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import SparkLightDropdown from '../../components/common/customui/SparkLightDropdown'
import PrimaryButtom from '../common/customui/PrimaryButton'
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const CreateTicket = () => {
    const navigation = useNavigation();
    const items = ["Item 1", "Item 2", "Item 3"];
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={styles.ticketSupportNone}>
                <ProfileSettingsHeader
                    title="Create Ticket"
                    onPressBack={() => navigation.navigate('support')}
                />
                <ScrollView>
                    <View style={styles.frameParent}>
                        <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
                            <View style={styles.ticketsParent}>
                                <Text style={styles.tickets}>Tickets Details</Text>
                            </View>
                            <View style={styles.frameWrapper}>
                                <View style={styles.textView}>
                                    <Text style={styles.text} >Describe Issue</Text>
                                    <SparkLightDropdown items={items} />
                                </View>
                            </View>
                            <View style={styles.frameWrapper}>
                                <View style={styles.textView}>
                                    <Text style={[styles.text, { marginBottom: Padding.p_5xs }]} >Describe Issue</Text>
                                </View>
                                <View style={styles.frameBorder}>
                                    <TextInput
                                        style={{ textAlignVertical: 'top' }}
                                        multiline={true} // Enable multiline input
                                        numberOfLines={6} // Set the number of lines
                                        minHeight={FontSize.size_base * 6 + 16}
                                    />

                                </View>
                            </View>
                        </View>
                        <View >
                            <PrimaryButtom
                                title="Submit"
                                onPress={() => navigation.navigate("TicketView")}
                                buttonType="submit"
                            />
                        </View>
                        <View >
                            <PrimaryButtom
                                title="Cancel"
                                onPress={() => navigation.navigate("TicketSupport")}
                                buttonType="cancel"
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
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
        paddingTop: Padding.p_13xl,
    },
    frameParent: {
        paddingHorizontal: Padding.p_base,
        paddingVertical: Padding.p_5xl
    },
    frameGroup: {
        //flex: 1,
        borderColor: Color.sparklightGray1,
        borderRadius: Border.br_11xs,
        backgroundColor: Color.sparklightWhite,
        overflow: "hidden",
    },
    textView: {
        display: 'flex', // By default, display is flex in React Native
        flexDirection: 'column', // Children are arranged in a column
        justifyContent: 'center', // Children are centered vertically
        alignSelf: 'stretch', // The element itself stretches to fill its container   
        // width: 98.05
    },
    text: {
        color: Color.sparklightGray1,
        fontFamily: FontFamily.openSansRegular, // Ensure this font is loaded in your project
        fontSize: FontSize.textXsSemibold_size, // The font size from Figma
        fontWeight: '600', // The font weight from Figma
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
        //flex: 1, // This makes the view flexible in a flex container
        height: 180, // Set the height to 180 pixels
        paddingVertical: Padding.p_5xs, // Top and bottom padding of 8 pixels
        paddingHorizontal: Padding.p_xs, // Left and right padding of 12 pixels
        flexDirection: 'column', // Layout the children in a column
        alignItems: 'flex-start', // Align children to the start of the cross axis
        alignSelf: 'stretch', // Stretch to the parent's cross size
    },
    frameBorder: {
        borderWidth: 1,
        borderColor: Color.colorGray_100,
        borderRadius: Border.br_11xs,
    },
    frameWrapper: {
        paddingHorizontal: Padding.p_5xl,
        paddingBottom: Padding.p_13xl
    },
    frameChild: {
        marginTop: 10,
        borderRadius: Border.br_11xs,
        height: 24,
    },
});

export default CreateTicket;
