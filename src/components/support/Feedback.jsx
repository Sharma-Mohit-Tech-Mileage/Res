import * as React from "react";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
const Feedback = () => {
    return (
        <View style={styles.feedback}>
            <ProfileSettingsHeader
                title="FeedBack"
                onPressBack={() => navigation.navigate('Home')}
            />
            <View style={[styles.feedbackInner, styles.frameWrapperLayout]}>
                <View style={styles.frameWrapperLayout}>
                    <View style={[styles.frameParent, styles.parentSpaceBlock]}>
                        <View style={styles.howWouldYourRateYourExperWrapper}>
                            <Text style={[styles.howWouldYour, styles.firstNameFlexBox]}>
                                How would your rate your experience using the Sparklight app?
                            </Text>
                        </View>
                        <View
                            style={[styles.frameContainer, styles.frameContainerSpaceBlock]}
                        >
                            <View style={[styles.frameGroup, styles.frameFlexBox]}>
                                <View style={[styles.faceSadParent, styles.parentSpaceBlock]}>
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={require("../../../assets/facesad.png")}
                                    />
                                    <Text style={[styles.terrible, styles.greatTypo]}>
                                        Terrible
                                    </Text>
                                </View>
                                <View style={[styles.faceSadParent, styles.parentSpaceBlock]}>
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={require("../../../assets/facefrown.png")}
                                    />
                                    <Text style={[styles.terrible, styles.greatTypo]}>
                                        Unsatisfied
                                    </Text>
                                </View>
                                <View style={[styles.faceSadParent, styles.parentSpaceBlock]}>
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={require("../../../assets/faceneutral.png")}
                                    />
                                    <Text style={[styles.terrible, styles.greatTypo]}>
                                        Neutral
                                    </Text>
                                </View>
                                <View style={[styles.faceSadParent, styles.parentSpaceBlock]}>
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={require("../../../assets/facesmile.png")}
                                    />
                                    <Text style={[styles.terrible, styles.greatTypo]}>
                                        Satisfied
                                    </Text>
                                </View>
                                <View style={[styles.faceHappyParent, styles.parentSpaceBlock]}>
                                    <Image
                                        style={styles.iconLayout}
                                        resizeMode="cover"
                                        source={require("../../../assets/facehappy.png")}
                                    />
                                    <Text style={[styles.great, styles.greatTypo]}>Great</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.frameView}>
                            <View style={styles.frameView}>
                                <View
                                    style={[styles.textinputWrapper, styles.textinputFlexBox]}
                                >
                                    <View style={styles.textinputFlexBox}>
                                        <View
                                            style={[styles.firstNameWrapper, styles.frameFlexBox]}
                                        >
                                            <Text style={[styles.firstName, styles.firstNameFlexBox]}>
                                                Additional Feedback
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.myExperienceHasBeenGreatParent,
                                                styles.text1SpaceBlock,
                                            ]}
                                        >
                                            <Text style={[styles.myExperienceHas, styles.textTypo]}>
                                                My experience has been great, thank you!
                                            </Text>
                                            <Text style={[styles.text, styles.textTypo]}>{` `}</Text>
                                        </View>
                                        <Text style={[styles.text1, styles.text1SpaceBlock]}>
                                            40/500
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.buttonsParent, styles.textinputFlexBox]}>
                            <Pressable
                                style={[styles.buttons, styles.buttonsLayout]}
                                onPress={() => { }}
                            >
                                <Text style={[styles.makePayment, styles.makeTypo]}>
                                    Submit Feedback
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.buttons1, styles.buttonsLayout]}
                                onPress={() => { }}
                            >
                                <Text style={[styles.makePayment1, styles.makeTypo]}>
                                    Cancel
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    feedbackChildLayout: {
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%",
    },
    titleTypo: {
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    xCloseLayout: {
        height: 24,
        width: 24,
    },
    iconPosition: {
        display: "none",
        marginTop: -12,
        top: "50%",
        position: "absolute",
    },
    iconLayout: {
        height: 32,
        width: 32,
        overflow: "hidden",
    },
    frameWrapperLayout: {
        height: 832,
        width: 430,
        overflow: "hidden",
    },
    parentSpaceBlock: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        flex: 1,
    },
    firstNameFlexBox: {
        textAlign: "left",
        color: Color.sparklightGray,
        flex: 1,
    },
    frameContainerSpaceBlock: {
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_5xl,
    },
    frameFlexBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    greatTypo: {
        fontSize: FontSize.size_xs,
        lineHeight: 18,
    },
    textinputFlexBox: {
        justifyContent: "center",
        alignSelf: "stretch",
    },
    text1SpaceBlock: {
        marginTop: 8,
        alignSelf: "stretch",
    },
    textTypo: {
        fontSize: FontSize.size_base,
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    buttonsLayout: {
        width: 382,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        borderRadius: Border.br_11xs,
        height: 56,
    },
    makeTypo: {
        width: 282,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
    },
    feedbackChild: {
        height: "10.73%",
        top: "0%",
        right: "0%",
        bottom: "89.27%",
        left: "0%",
        maxHeight: "100%",
        position: "absolute",
        maxWidth: "100%",
    },
    iosstatusBarwhiteIcon: {
        height: 44,
        alignSelf: "stretch",
    },
    title: {
        marginTop: -9,
        marginLeft: -41,
        left: "50%",
        fontSize: FontSize.size_lg,
        textAlign: "center",
        color: Color.sparklightWhite,
        lineHeight: 18,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        top: "50%",
        position: "absolute",
    },
    icon: {
        height: "100%",
        marginTop: -12,
        overflow: "hidden",
        width: "100%",
    },
    xClose: {
        left: 18,
        top: "50%",
        height: 24,
        width: 24,
        position: "absolute",
    },
    settingsIcon: {
        right: 24,
        height: 24,
        width: 24,
        overflow: "hidden",
    },
    heartIcon: {
        right: 52,
        display: "none",
        marginTop: -12,
        top: "50%",
        position: "absolute",
    },
    navBar: {
        height: 56,
        width: 430,
    },
    iosstatusBarwhiteParent: {
        top: 0,
        width: 430,
        left: 0,
        position: "absolute",
    },
    howWouldYour: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: FontFamily.openSansRegular,
    },
    howWouldYourRateYourExperWrapper: {
        paddingTop: Padding.p_base,
        paddingHorizontal: Padding.p_5xl,
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
    },
    terrible: {
        marginTop: 16,
        color: Color.sparklightDarkestGray,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
    },
    faceSadParent: {
        borderRightWidth: 1,
        alignItems: "center",
        borderColor: Color.sparklightGray,
        borderStyle: "solid",
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
    },
    great: {
        fontWeight: "700",
        fontFamily: FontFamily.openSansBold,
        color: Color.sparklightGreen,
        marginTop: 16,
        textAlign: "center",
    },
    faceHappyParent: {
        backgroundColor: "rgba(43, 169, 72, 0.1)",
        alignItems: "center",
    },
    frameGroup: {
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.colorGainsboro,
        flex: 1,
    },
    frameContainer: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "stretch",
    },
    firstName: {
        fontSize: 14,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    firstNameWrapper: {
        alignItems: "center",
        alignSelf: "stretch",
    },
    myExperienceHas: {
        color: "#000",
    },
    text: {
        marginTop: 10,
        color: Color.sparklightDarkestGray,
    },
    myExperienceHasBeenGreatParent: {
        borderColor: Color.sparklightDarkGray,
        height: 130,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: Border.br_11xs,
    },
    text1: {
        color: Color.sparklightDarkGray,
        textAlign: "right",
        fontSize: FontSize.size_xs,
        lineHeight: 18,
        fontFamily: FontFamily.openSansRegular,
    },
    textinputWrapper: {
        paddingBottom: Padding.p_base,
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_5xl,
    },
    frameView: {
        alignSelf: "stretch",
        flex: 1,
    },
    makePayment: {
        color: Color.sparklightWhite,
    },
    buttons: {
        backgroundColor: Color.colorMidnightblue,
    },
    makePayment1: {
        color: Color.colorMidnightblue,
    },
    buttons1: {
        marginTop: 16,
    },
    buttonsParent: {
        alignItems: "center",
    },
    frameParent: {
        backgroundColor: Color.sparklightWhite,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
        overflow: "hidden",
    },
    feedbackInner: {
        top: 100,
        marginBottom:200
    },
    feedback: {
        backgroundColor: Color.colorWhitesmoke_200,
        overflow: "hidden",
        width: "100%",
        flex: 1,
    },
});

export default Feedback;
