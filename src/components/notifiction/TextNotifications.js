import * as React from "react";
import { useState } from "react";
import { Image, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import Toggle from '../common/Toggle';

const TextNotifications = ({ navigation }) => {
    const [isToggleActive, setIsToggleActive] = useState(false);

    const handleToggle = (isActive) => {
        setIsToggleActive(isActive);
    };
    return (

        <View style={styles.textNotifications} accessibilityLabel="Text Notifications Section">
            <ProfileSettingsHeader
                title="Text Notifications"
                onPressBack={() => navigation.navigate('Notifications')}
                accessibilityLabel="Text Notifications Header"
                accessibilityHint="Navigates back to the Notifications screen"
            />
            <SafeAreaView style={{ flex: 1 }} accessibilityLabel="Main Container">
                <ScrollView accessibilityLabel="Scroll View">
                    <View style={styles.textNotificationsInner} accessibilityLabel="Text Notifications Inner Container">
                        <View style={styles.frameParent}>
                            <View style={[styles.frameContainer, styles.navigationBorder]}>
                                <View style={styles.frameGroup}>
                                    <View style={styles.frameView}>
                                        <View style={styles.infoCircleWrapper}>
                                            <Image
                                                style={styles.infoCircleIcon}
                                                resizeMode="cover"
                                                source={require("../../../assets/infocircle.png")}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.youAreSubscribedContainer,
                                                styles.containerTypo,
                                            ]}
                                        >
                                            <Text
                                                style={styles.youAreSubscribed}
                                            >{`You are subscribed to text message alerts. `}</Text>
                                            <Text style={styles.replyStopTo}>
                                                Reply STOP to cancel at any time. Call 1-800-123-0456 for
                                                support, Message and data rates may apply.
                                            </Text>
                                        </Text>
                                    </View>
                                    <View style={styles.frameParent1}>
                                        <View style={styles.rectangleWrapper}>
                                            <View style={styles.frameChild} />
                                        </View>
                                        <View style={styles.frameGroup}>
                                            <View style={styles.frameWrapperBorder}>
                                                <View style={styles.frameWrapper2}>
                                                    <View style={styles.frameParent3}>
                                                        <View style={styles.frameParent4}>
                                                            <View style={styles.frameParent3}>
                                                                <View style={styles.mobilePhoneParent}>
                                                                    <Text style={styles.mobilePhoneTypo}>
                                                                        Mobile Phone
                                                                    </Text>
                                                                    <Text style={styles.text}>340-203-2039</Text>
                                                                </View>
                                                            </View>
                                                            <View >
                                                                <Toggle
                                                                    onToggle={handleToggle}
                                                                    accessibilityLabel="Billing Notifications Toggle"
                                                                    accessibilityHint="Toggles billing notifications on or off"
                                                                    accessibilityRole="switch"
                                                                    accessible={true}
                                                                />
                                                            </View>
                                                        </View>
                                                        <Text
                                                            style={[
                                                                styles.messageAndDataContainer,
                                                                styles.containerTypo,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={styles.youAreSubscribed}
                                                            >{`Message and data rates may apply. Message `}</Text>
                                                            <Text style={styles.frequencyMayVary}>
                                                                frequency may vary. Text STOP to opt out or HELP
                                                                for help.
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={[styles.frameWrapper4, styles.frameWrapperBorder]}
                                            >
                                                <View style={styles.frameWrapper2}>
                                                    <View style={styles.frameParent3}>
                                                        <View style={styles.frameParent4}>
                                                            <Text
                                                                style={[
                                                                    styles.appointments,
                                                                    styles.mobilePhoneTypo,
                                                                ]}
                                                            >
                                                                Appointments
                                                            </Text>
                                                            <View >
                                                                <Toggle
                                                                    onToggle={handleToggle}
                                                                    accessibilityLabel="Billing Notifications Toggle"
                                                                    accessibilityHint="Toggles billing notifications on or off"
                                                                    accessibilityRole="switch"
                                                                    accessible={true}
                                                                />
                                                            </View>
                                                        </View>
                                                        <Text
                                                            style={[
                                                                styles.messageAndDataContainer,
                                                                styles.containerTypo,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={styles.youAreSubscribed}
                                                            >{`Receive text notifications when your appointments `}</Text>
                                                            <Text style={styles.replyStopTo}>
                                                                have updates.
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={[styles.frameWrapper4, styles.frameWrapperBorder]}
                                            >
                                                <View style={styles.frameWrapper2}>
                                                    <View style={styles.frameParent3}>
                                                        <View style={styles.frameParent4}>
                                                            <Text
                                                                style={[
                                                                    styles.appointments,
                                                                    styles.mobilePhoneTypo,
                                                                ]}
                                                            >
                                                                Outage Alerts
                                                            </Text>
                                                            <View >
                                                                <Toggle
                                                                    onToggle={handleToggle}
                                                                    accessibilityLabel="Billing Notifications Toggle"
                                                                    accessibilityHint="Toggles billing notifications on or off"
                                                                    accessibilityRole="switch"
                                                                    accessible={true}
                                                                />
                                                            </View>
                                                        </View>
                                                        <Text
                                                            style={[
                                                                styles.receiveTextNotifications1,
                                                                styles.containerTypo,
                                                            ]}
                                                        >
                                                            Receive text notifications when outages occur.
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View
                                                style={[styles.frameWrapper4, styles.frameWrapperBorder]}
                                            >
                                                <View style={styles.frameWrapper2}>
                                                    <View style={styles.frameParent3}>
                                                        <View style={styles.frameParent4}>
                                                            <Text
                                                                style={[
                                                                    styles.appointments,
                                                                    styles.mobilePhoneTypo,
                                                                ]}
                                                            >
                                                                Billing
                                                            </Text>
                                                            <View >
                                                                <Toggle
                                                                    onToggle={handleToggle}
                                                                    accessibilityLabel="Billing Notifications Toggle"
                                                                    accessibilityHint="Toggles billing notifications on or off"
                                                                    accessibilityRole="switch"
                                                                    accessible={true}
                                                                />
                                                            </View>
                                                        </View>
                                                        <Text
                                                            style={[
                                                                styles.receiveTextNotifications1,
                                                                styles.containerTypo,
                                                            ]}
                                                        >
                                                            Receive text notifications for billing.
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.frameWrapper10}>
                                                <View style={styles.frameWrapper2}>
                                                    <View style={styles.frameParent3}>
                                                        <Text
                                                            style={[
                                                                styles.byOptingInContainer,
                                                                styles.containerTypo,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={styles.youAreSubscribed}
                                                            >{`By opting in for outage alerts, you agree to receive text `}</Text>
                                                            <Text style={styles.frequencyMayVary}>
                                                                messages regarding new service outages affecting
                                                                your home internet service and updates regarding
                                                                existing outages (updates go out about every two
                                                                hours for existing outages). We will not send
                                                                messages between 9 PM and 6 AM.
                                                            </Text>
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.buttonsParent} accessibilityLabel="Buttons Section">
                                <Pressable
                                    style={[styles.buttons, styles.buttonsLayout]}
                                    onPress={() => navigation.navigate("Account")}
                                    accessibilityLabel="Save Button"
                                    accessibilityRole="button"
                                    accessibilityHint="Saves changes and navigates back to the Account screen"
                                >
                                    <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.buttonsLayout]}
                                    onPress={() => navigation.navigate("Account")}
                                    accessibilityLabel="Cancel Button"
                                    accessibilityRole="button"
                                    accessibilityHint="Cancels changes and navigates back to the Account screen"
                                >
                                    <Text style={[styles.accountClr]}>
                                        Cancel
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    iosstatusBarwhiteIconLayout: {
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%",
    },
    navigationPosition: {
        width: '100%',
        left: 0,
        position: "absolute",
    },
    titleClr: {
        color: Color.sparklightWhite,
        textAlign: "center",
    },
    chevronLeftLayout: {
        height: 24,
        width: 24,
    },
    iconPosition: {
        display: "none",
        marginTop: -12,
        top: "50%",
        position: "absolute",
        overflow: "hidden",
    },
    iconLayout: {
        height: 32,
        width: 32,
    },
    navigationBorder: {
        borderColor: Color.sparklightWhite,
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid",
        backgroundColor: Color.sparklightWhite,
    },
    containerTypo: {
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    frameWrapperBorder: {
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        borderColor: Color.sparklightGray,
        borderStyle: "solid",
        alignSelf: "stretch",
    },
    mobilePhoneTypo: {
        color: Color.sparklightDarkestGray,
        fontSize: FontSize.size_base,
        lineHeight: 28,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    buttonsLayout: {
        width: '100%',
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        height: 56,
    },
    makeTypo: {
        width: 282,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
    },
    accountClr: {
        color: Color.sparklightBrightPurple,
        textAlign: "center",
    },
    title: {
        marginLeft: -96,
        fontSize: FontSize.size_lg,
        textAlign: "center",
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        lineHeight: 18,
        left: "50%",
        top: "50%",
        position: "absolute",
        marginTop: -9,
        color: Color.sparklightWhite,
    },
    icon: {
        height: "100%",
        marginTop: -12,
        overflow: "hidden",
        width: "100%",
    },
    chevronLeft: {
        left: 18,
        top: "50%",
        position: "absolute",
    },
    navBar: {
        height: 56,
        width: '100%',
    },
    infoCircleIcon: {
        width: 16,
        height: 16,
        overflow: "hidden",
    },
    infoCircleWrapper: {
        paddingVertical: Padding.p_5xs,
        paddingHorizontal: 0,
        flexDirection: "row",
    },
    youAreSubscribed: {
        lineHeight: 28,
    },
    replyStopTo: {
        lineHeight: 24,
    },
    youAreSubscribedContainer: {
        marginLeft: 8,
        color: Color.sparklightDarkestGray,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_sm,
        flex: 1,
    },
    frameView: {
        borderRadius: 8,
        backgroundColor: "#f8f8f8",
        width: 334,
        paddingHorizontal: Padding.p_base,
        paddingVertical: 6,
        flexDirection: "row",
    },
    frameChild: {
        height: 1,
        backgroundColor: Color.sparklightGray,
        alignSelf: "stretch",
    },
    rectangleWrapper: {
        width: 380,
    },
    text: {
        fontSize: FontSize.size_base,
        lineHeight: 28,
        textAlign: "left",
        color: Color.sparklightDarkestGray,
        fontFamily: FontFamily.openSansRegular,
    },
    mobilePhoneParent: {
        justifyContent: "center",
    },
    frameParent3: {
        justifyContent: "center",
        flex: 1,
    },
    buttonIcon: {
        width: 21,
        height: 20,
    },
    toggleBase: {
        borderRadius: Border.br_xs,
        backgroundColor: Color.sparklightGreen,
        width: 36,
        justifyContent: "flex-end",
        padding: Padding.p_11xs,
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    toggle: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    frameParent4: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frequencyMayVary: {
        lineHeight: 22,
    },
    messageAndDataContainer: {
        color: Color.sparklightDarkGray,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "left",
        alignSelf: "stretch",
        fontSize: FontSize.size_sm,
    },
    frameWrapper2: {
        paddingVertical: Padding.p_base,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Padding.p_5xl,
        flex: 1,
    },
    appointments: {
        flex: 1,
    },
    frameWrapper4: {
        backgroundColor: Color.sparklightWhite,
    },
    receiveTextNotifications1: {
        color: Color.sparklightDarkGray,
        lineHeight: 28,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "left",
        alignSelf: "stretch",
        fontSize: FontSize.size_sm,
    },
    byOptingInContainer: {
        fontSize: FontSize.textXsSemibold_size,
        color: Color.sparklightDarkGray,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "left",
        alignSelf: "stretch",
    },
    frameWrapper10: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Color.sparklightWhite,
        alignSelf: "stretch",
    },
    frameGroup: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frameParent1: {
        marginTop: 16,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frameContainer: {
        borderWidth: 1,
        paddingTop: Padding.p_base,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        borderColor: Color.sparklightGray1,
        alignSelf: "stretch",
        overflow: "auto",
    },
    frameParent: {
        alignSelf: "stretch",
    },
    makePayment: {
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    buttons: {
        marginTop: 16,
        backgroundColor: Color.colorMidnightblue,
        width: 382,
    },
    buttonsParent: {
        marginTop: 16,
        alignSelf: "stretch",
    },
    textNotificationsInner: {
        top: 100,
        paddingTop: Padding.p_5xl,
        flex: 1,
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_base,
        width: '100%',
        marginBottom:200
    },

    textNotifications: {
        flex: 1
    },
});

export default TextNotifications;
