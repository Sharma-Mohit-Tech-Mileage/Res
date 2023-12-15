import * as React from "react";
import { useState } from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import Toggle from '../common/Toggle';

const TextNotifications = ({ navigation }) => {
    const [isToggleActive, setIsToggleActive] = useState(false);

    const handleToggle = (isActive) => {
        setIsToggleActive(isActive);
    };
    return (

        <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }} accessibilityLabel="Text Notifications Section">
            <ProfileSettingsHeader
                title="Edit Text Notifications"
                onPressBack={() => navigation.navigate('Notifications')}
                accessibilityLabel="Text Notifications Header"
                accessibilityHint="Navigates back to the Notifications screen"
            />
            <ScrollView accessibilityLabel="Scroll View">
                <View style={styles.textNotificationsInner} >
                    <View style={[styles.navigationBorder]}>
                        <View style={styles.frameGroup}>
                            <View style={styles.frameView}>
                                <View style={styles.infoCircleWrapper}>
                                    <Image
                                        style={styles.infoCircleIcon}
                                        resizeMode="cover"
                                        source={require("../../../assets/infocircle.png")}
                                    />
                                </View>
                                <Text style={[styles.youAreSubscribedContainer, styles.containerTypo,]} >
                                    <Text
                                        style={styles.youAreSubscribed}
                                    >{`You are subscribed to text message alerts. `}</Text>
                                    <Text style={styles.replyStopTo}>
                                        Reply STOP to cancel at any time. Call 1-800-123-0456 for
                                        support. Message and data rates may apply.
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.frameChild} />
                        <View style={styles.frameGroup}>
                            <View style={styles.frameParent3}>
                                <Text style={styles.mobilePhoneTypo}>
                                    Mobile Phone
                                </Text>
                                <Text style={styles.text}>340-203-2039</Text>
                                <Text style={[styles.receiveTextNotifications1, styles.containerTypo,]}>
                                    Message and data rates may apply. Message frequency may vary. Text STOP to opt out or HELP
                                    for help.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.frameChild} />
                        <View style={styles.frameGroup}>
                            <View style={styles.frameWrapper2}>
                            <View style={styles.frameParent3}>
                                <View style={styles.frameParent4}>
                                    <Text style={[styles.appointments, styles.mobilePhoneTypo,]}>
                                        Appointments
                                    </Text>
                                    <View >
                                        <Toggle onToggle={handleToggle} />
                                    </View>
                                </View>
                                <Text style={[styles.receiveTextNotifications1, styles.containerTypo,]} >
                                    Receive text notifications when your appointments have updates.
                                </Text>
                            </View>
                            </View>
                        </View>
                        <View style={styles.frameChild} />
                        <View style={styles.frameGroup}>
                            <View style={styles.frameWrapper2}>
                                <View style={styles.frameParent3}>
                                    <View style={styles.frameParent4}>
                                        <Text style={[styles.appointments, styles.mobilePhoneTypo,]}>
                                            Outage Alerts
                                        </Text>
                                        <View >
                                            <Toggle onToggle={handleToggle} />
                                        </View>
                                    </View>
                                    <Text style={[styles.receiveTextNotifications1, styles.containerTypo,]}>
                                        Receive text notifications when outages occur.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.frameChild} />
                        <View style={styles.frameGroup}>
                            <View style={styles.frameWrapper2}>
                                <View style={styles.frameParent3}>
                                    <View style={styles.frameParent4}>
                                        <Text style={[styles.appointments, styles.mobilePhoneTypo,]} >
                                            Billing
                                        </Text>
                                        <View >
                                            <Toggle
                                                onToggle={handleToggle}
                                            />
                                        </View>
                                    </View>
                                    <Text style={[styles.receiveTextNotifications1, styles.containerTypo,]}>
                                        Receive text notifications for billing.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.frameChild} />
                        <View style={styles.frameGroup}>
                            <View style={styles.frameWrapper10}>
                                <View style={styles.frameWrapper2}>
                                    <View style={styles.frameParent3}>
                                        <Text style={[styles.byOptingInContainer, styles.containerTypo,]}>
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
                    <View style={styles.buttonsParent} accessibilityLabel="Buttons Section">
                        <Pressable
                            style={[styles.buttons, styles.buttonsLayout]}
                            onPress={() => navigation.navigate("Notifications")}
                        >
                            <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.buttonsLayout]}
                            onPress={() => navigation.navigate("Notifications")}
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

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
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
    mobilePhoneTypo: {
        color: Color.sparklightGray1,
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
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
    },
    accountClr: {
        color: Color.colorMidnightblue,
        textAlign: "center",
    },
    infoCircleIcon: {
        width: 16,
        height: 16,
        overflow: "hidden",
    },
    infoCircleWrapper: {
        paddingVertical: Padding.p_5xs,
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
        color: Color.colorGray_200,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_sm,
        flex: 1,
    },
    frameView: {
        borderRadius: 8,
        backgroundColor: Color.colorWhitesmoke_100,
        paddingHorizontal: Padding.p_base,
        paddingVertical: 6,
        flexDirection: "row",
    },
    frameChild: {
        height: 1,
        backgroundColor: Color.sparklightGray,
        alignSelf: "stretch",
    },
    text: {
        fontSize: FontSize.size_base,
        lineHeight: 28,
        textAlign: "left",
        color: Color.colorGray_200,
        fontFamily: FontFamily.openSansRegular,
    },
    frameParent3: {
        justifyContent: "center",
        flex: 1,
    },
    frameParent4: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
    },
    frequencyMayVary: {
        lineHeight: 22,
    },
    frameWrapper2: {
        //paddingVertical: Padding.p_5xs,
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    appointments: {
        flex: 1,
    },
    receiveTextNotifications1: {
        color: Color.sparklightaddGray,
        lineHeight: 22,
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
        paddingVertical: Padding.p_base,
        paddingHorizontal: Padding.p_base,
    },
    makePayment: {
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    buttons: {
        marginTop: 16,
        backgroundColor: Color.colorMidnightblue,
    },
    buttonsParent: {
        marginTop: 16,
        alignSelf: "stretch",
    },
    textNotificationsInner: {
        paddingTop: Padding.p_5xl,
        flex: 1,
        paddingHorizontal: Padding.p_base,
        marginBottom: 200,
    }
});


export default TextNotifications;
