import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    Pressable,
    ScrollView,
} from "react-native";
import { Border, Padding, Color, FontSize, FontFamily } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";

const Support = () => {
    const navigation = useNavigation();
    const items = [
        {
            key: 'searchIssues',
            text: 'Search issues',
            icon: require("../../../assets/search-md.png"),
            iconAlignment: 'left', // Icon to the left of the text
            navigateTo: 'searchArticals',
        },
        {
            key: 'moreOptions',
            text: 'Billing & Payments',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the right of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us/categories/15840476056727-Billing-Payments'
        },
        {
            key: 'moreOptions',
            text: 'Internet Service',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the right of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us/categories/115000833068-Internet'
        },
        {
            key: 'moreOptions',
            text: 'WiFi',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the right of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us/categories/115001419607-WiFi'
        },
        {
            key: 'moreOptions',
            text: 'More',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the right of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us'
        }
        // Add more items as needed
    ];

    return (
        <View style={styles.support}>
            <ProfileSettingsHeader
                title="Support"
                onPressBack={() => navigation.navigate('Feedback')}
                iconAlignment="left"
                showIcon={false} // New prop to control icon visibility
            />
            <ScrollView>
                <View style={[styles.mainContainer]}>
                    <LinearGradient
                        style={[styles.mainContainerChild, styles.barContainerLayout]}
                        locations={[0, 1]}
                        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                        useAngle={true}
                        angle={90}
                    />
                    <View style={[styles.container, styles.containerFlexBox]}>
                        <View style={styles.header}>
                            <View style={styles.featuredIcon}>
                                <Image
                                    style={[styles.lifeBuoy02Icon, styles.lifeBuoy02IconLayout]}
                                    resizeMode="cover"
                                    source={require("../../../assets/right-actionable19.png")}
                                />
                            </View>
                            <View
                                style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}
                            >
                                <Text style={styles.wereHereTo}>We’re Here to Help</Text>
                            </View>
                        </View>
                        <View style={styles.issuesFlexBox}>
                            {items.map((item, index) => (
                                <React.Fragment key={item.name}>
                                    <Pressable key={item.key} style={[styles.search, styles.navigationBorder]}
                                        onPress={() => {
                                            if (item.iconAlignment === 'left') {
                                                navigation.navigate(item.navigateTo)
                                            } else {
                                                navigation.navigate(item.navigateTo, { url: 'https://support.sparklight.com/hc/en-us/articles/115009159707-Data-Plans', name: item.text })
                                            }
                                        }}>
                                        <View style={[styles.pressableContent, item.iconAlignment === 'right' && { flexDirection: 'row-reverse' }]}>
                                            <Image
                                                source={item.icon}
                                                style={[styles.iconStyle, item.iconAlignment === 'right' ? styles.iconRight : styles.iconLeft]}
                                            />
                                            {item.iconAlignment === 'right' ? <Text style={[styles.searchChild, styles.textTypoRight]}>
                                                {item.text}
                                            </Text>
                                                : <Text style={[styles.searchChild]}>
                                                    {item.text}
                                                </Text>}
                                        </View>
                                    </Pressable>
                                    {index < items.length - 1 && <View style={styles.frameChild} />}
                                </React.Fragment>
                            ))}
                        </View>
                        <View style={[styles.additionalSupport, styles.integrationCardBorder]}>
                            <View style={[styles.headingContainer, styles.headingContainerSpaceBlock]}>
                                <Text style={[styles.heading, styles.headingTypo]}>
                                    Additional Support
                                </Text>
                            </View>

                            <Pressable
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                                onPress={() => { }}
                            >
                                <View
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        // style={styles.featuredIcon1}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/tool-02.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            Troubleshooting
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/chevronright.png")}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        Explore instant solutions to issues.
                                                    </Text>
                                                </View>
                                                {/* <View style={styles.badgeWrapper}>
                                                    <View
                                                        style={[styles.badge, styles.integrationCardBorder]}
                                                    >
                                                        <Text style={[styles.text, styles.textTypo]}>
                                                            CURRENT
                                                        </Text>
                                                    </View>
                                                </View> */}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                            <View
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                            >
                                <Pressable
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                    onPress={() => { navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/18929657224855', name: 'FAQs' }) }}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        style={styles.icon}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/icon-faq.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            FAQs
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/chevronright.png")}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        Review common questions.
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            <View
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                            >
                                <Pressable
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                    onPress={() => { navigation.navigate('ManageEquipment') }}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        // style={styles.featuredIcon1}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/modem-02.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            Equipment Management
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/chevronright.png")}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        View and manage equipment.
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>

                        </View>
                        <View
                            style={[styles.additionalSupport, styles.integrationCardBorder]}
                        >
                            <View
                                style={[
                                    styles.headingContainer,
                                    styles.headingContainerSpaceBlock,
                                ]}
                            >
                                <Text style={[styles.heading, styles.headingTypo]}>
                                    Contact Us
                                </Text>
                            </View>
                            <View style={styles.integrationCardMobileWrapper}>
                                <View
                                    style={[styles.integrationCardMobile, styles.integrationCardBorder]}>
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon}>
                                                <View style={[styles.icon]}>
                                                    <Image
                                                        resizeMode="cover"
                                                        source={require("../../../assets/featured-icon.png")}
                                                    />
                                                </View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.headingTypo]}>
                                                            Live Support
                                                        </Text>
                                                        <Image
                                                            style={[
                                                                styles.chevronRightIcon,
                                                                styles.chevronIconLayout,
                                                            ]}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/chevronright.png")}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        No agents available right now. Agents are typically
                                                        available from 5:00am- 9:00pm PST
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                            >
                                <Pressable
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                    onPress={() => { navigation.navigate('TicketSupport') }}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        resizeMode="cover"
                                                        source={require("../../../assets/ticket-03.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            Ticket Support
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/chevronright.png")}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        Open a support ticket for us to help.
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            <View
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle4}>
                                            <View style={styles.headingAndIcon4}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        resizeMode="cover"
                                                        source={require("../../../assets/wallet-03.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            Billing Support
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/phone-outgoing-01.png")}
                                                        />
                                                    </View>
                                                    <View style={styles.supportingTextWrapper}>
                                                        <Text
                                                            style={[
                                                                styles.supportingText4,
                                                                styles.support1Typo,
                                                            ]}
                                                        >
                                                            877-692-2253
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText5,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        Want to upgrade your service, make a change, or have a
                                                        billing question? Give us a call for assistance.
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.supportingText6,
                                                            styles.supportingTypo,
                                                        ]}
                                                    >{`Call Center Hours: `}</Text>
                                                    <Text
                                                        style={[
                                                            styles.supportingText7,
                                                            styles.supportingTypo,
                                                        ]}
                                                    >
                                                        M-F 8:00 AM-5:00 PM MST
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.integrationCardMobileContainer,
                                    styles.contentSpaceBlock,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.integrationCardMobile1,
                                        styles.integrationCardBorder,
                                    ]}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle4}>
                                            <View style={styles.headingAndIcon4}>
                                                <View style={[
                                                    styles.icon
                                                ]}>
                                                    <Image
                                                        resizeMode="cover"
                                                        source={require("../../../assets/tool-01.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.heading3, styles.headingTypo]}>
                                                            Tech Support
                                                        </Text>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="cover"
                                                            source={require("../../../assets/phone-outgoing-01.png")}
                                                        />
                                                    </View>
                                                    <View style={styles.supportingTextWrapper}>
                                                        <Text
                                                            style={[
                                                                styles.supportingText4,
                                                                styles.support1Typo,
                                                            ]}
                                                        >
                                                            877-692-2253
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.supportingText5,
                                                            styles.supportingTypo1,
                                                        ]}
                                                    >
                                                        Need a little help with your Sparklight® service?
                                                        We're here 24 hours a day, seven days a week to
                                                        support you.
                                                    </Text>
                                                    <Text
                                                        style={[
                                                            styles.supportingText6,
                                                            styles.supportingTypo,
                                                        ]}
                                                    >{`Call Center Hours: `}</Text>
                                                    <Text
                                                        style={[
                                                            styles.supportingText7,
                                                            styles.supportingTypo,
                                                        ]}
                                                    >
                                                        24h/7 days a week
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.issuesFlexBox]} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    pressableContent: {
        flexDirection: 'row', // Default direction
        alignItems: 'center',
        height: '100%',
    },
    textTypoRight: {
        FontFamily: FontFamily.openSansRegular,
        fontWeight: 600,/* Corresponds to semi-bold in Open Sans */
        fontSize: FontSize.size_base,
        lineHeight: 20,
        color: Color.colorMidnightblue,/* Spark Light Purple */
    },
    frameChild: {
        paddingHorizontal: Padding.p_5xl,
        height: 1,
        backgroundColor: Color.sparklightGray,
    },
    navigationBorder: {
        borderColor: Color.sparklightGray,
        backgroundColor: Color.sparklightWhite,
        borderStyle: "solid",
        justifyContent: "center",
    },
    iconLeft: {
        marginLeft: Padding.p_xs,
    },
    iconRight: {
        marginRight: Padding.p_xs,
    },
    barContainerLayout: {
        position: "absolute",
    },
    containerFlexBox: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    lifeBuoy02IconLayout: {
        height: 32,
        width: 32,
    },
    integrationCardBorder: {
        borderWidth: 1,
        borderStyle: "solid",
    },
    icon: {
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
    iconStyle: {
        width: 20, // Set according to your icon size
        height: 20, // Set according to your icon size
        resizeMode: 'contain',
        marginRight: 8, // Add some margin if needed
    },
    helpTopicsPosition: {
        borderBottomLeftRadius: Border.br_11xs,
        borderBottomRightRadius: Border.br_11xs,
    },
    headingContainerSpaceBlock: {
        paddingBottom: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        alignItems: "center",
    },
    headingTypo: {
        textAlign: "left",
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        flex: 1,
    },
    accordionLayout: {
        width: 382,
        paddingBottom: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        justifyContent: "center",
    },
    contentSpaceBlock: {
        paddingHorizontal: Padding.p_base,
        alignSelf: "stretch",
    },
    chevronIconLayout: {
        marginLeft: 8,
        height: 20,
        width: 20,
        overflow: "hidden",
    },
    supportingTypo1: {
        lineHeight: 20,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
    },
    textTypo: {
        fontSize: FontSize.textXsSemibold_size,
        lineHeight: 18,
        textAlign: "center",
    },
    support1Typo: {
        color: Color.colorMidnightblue,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    supportingTypo: {
        lineHeight: 14,
        marginTop: 10,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
        color: Color.colorGray_100,
        alignSelf: "stretch",
    },
    issuesFlexBox: {
        marginTop: 24,
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportChildLayout: {
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%",
    },
    chevronLeftIconLayout: {
        height: 24,
        width: 24,
        top: "50%",
        position: "absolute",
    },
    iconSpaceBlock: {
        marginTop: -12,
        overflow: "hidden",
    },
    framePressableFlexBox: {
        paddingTop: Padding.p_5xs,
        alignSelf: "stretch",
        alignItems: "center",
        flex: 1,
    },
    homeIndicator1Position: {
        bottom: 0,
        position: "absolute",
    },
    homeLayout: {
        height: 4,
        width: 134,
    },
    mainContainerChild: {
        marginTop: -10,
        height: '4%',
        backgroundColor: "transparent",
        left: 0, // Ensure it takes the full width
        right: 0,
        alignSelf: 'stretch', // Stretches to the parent's width if not already doing so
        flex: 2
    },
    lifeBuoy02Icon: {
        overflow: "hidden",
    },
    featuredIcon: {
        backgroundColor: Color.colorMidnightblue,
        borderColor: Color.colorWhitesmoke_200,
        borderWidth: 4,
        width: 72,
        height: 72,
        padding: Padding.p_xs,
        justifyContent: "center",
        flexDirection: "row",
        borderStyle: "solid",
        borderRadius: Border.br_81xl,
        alignItems: "center",
    },
    wereHereTo: {
        fontSize: 22,
        lineHeight: 28,
        width: 210,
        textAlign: "center",
        color: Color.colorGray_100,
        fontFamily: FontFamily.openSansRegular,
    },
    wereHereToHelpWrapper: {
        justifyContent: "center",
    },
    header: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    searchChild: {
        flex: 1,
        paddingHorizontal: Padding.p_base,
        paddingVertical: Padding.p_base,
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
    },
    search: {
        justifyContent: "center",
        alignSelf: "stretch",
        height: 58, // Set a fixed height for the search container
    },
    heading: {
        color: Color.colorGray_100,
        textAlign: "left",
        lineHeight: 18,
        fontSize: FontSize.size_lg,
    },
    headingContainer: {
        paddingTop: Padding.p_5xl,
        paddingHorizontal: Padding.p_5xl,
        paddingBottom: Padding.p_base,
        flexDirection: "row",
        alignSelf: "stretch",
        borderTopRightRadius: Border.br_11xs,
        borderTopLeftRadius: Border.br_11xs,
    },
    heading2: {
        color: Color.colorGray_100,
    },
    chevronRightIcon: {
        opacity: 0,
    },
    headingAndToggle: {
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportingText: {
        marginTop: 8,
        color: Color.sparklightDarkGray,
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    frameParent: {
        marginLeft: 12,
        justifyContent: "center",
        flex: 1,
    },
    text: {
        color: Color.success700,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    badge: {
        backgroundColor: Color.success50,
        borderColor: Color.colorAquamarine,
        paddingHorizontal: Padding.p_5xs,
        paddingVertical: Padding.p_11xs,
        borderRadius: Border.br_11xs,
        flexDirection: "row",
        alignItems: "center",
    },
    badgeWrapper: {
        marginLeft: 12,
        display: "none",
        flexDirection: "row",
        alignItems: "center",
    },
    headingAndIcon: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    content: {
        paddingVertical: Padding.p_xl,
    },
    integrationCardMobile: {
        backgroundColor: "#f8f8f8",
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
    },
    integrationCardMobileWrapper: {
        padding: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        alignSelf: "stretch",
        alignItems: "center",
    },
    heading3: {
        color: Color.colorGray_100,
    },
    integrationCardMobile1: {
        borderColor: Color.sparklightGray,
        backgroundColor: Color.sparklightWhite,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
    },
    integrationCardMobileContainer: {
        paddingBottom: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        alignItems: "center",
    },
    additionalSupport: {
        borderColor: Color.sparklightGray,
        borderRadius: Border.br_11xs,
        marginTop: 24,
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportingText4: {
        lineHeight: 20,
        fontSize: FontSize.textXsSemibold_size,
        textAlign: "left",
        flex: 1,
    },
    supportingTextWrapper: {
        marginTop: 10,
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportingText5: {
        marginTop: 10,
        color: Color.sparklightDarkGray,
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    supportingText6: {
        fontFamily: FontFamily.openSansRegular,
    },
    supportingText7: {
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    headingAndIcon4: {
        flexDirection: "row",
        flex: 1,
    },
    headingAndToggle4: {
        flexDirection: "row",
        alignSelf: "stretch",
    },
    mainContainer: {
        padding: Padding.p_5xl, // Ensure padding is responsive
        alignItems: "center", // Center children if needed
        alignSelf: 'stretch', // If you want to ensure it takes the full width of its parent
        marginBottom: '30%', // Use percentage for responsiveness or consider using flex to push it up
        top: '5%',
    },
    support: {
        backgroundColor: Color.colorWhitesmoke_200,
        overflow: "hidden",
        width: "100%",
        flex: 1,
    },
});

export default Support;
