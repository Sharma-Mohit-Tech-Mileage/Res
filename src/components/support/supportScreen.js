import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Button, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FontFamily, Border, Padding, Color, FontSize } from "../../../GlobalStyles";
import WebView from 'react-native-webview';
const Support = ({ navigation }) => {
   
    return (
        <ScrollView >
        <View style={styles.support}>
            <View style={[styles.mainContainer, styles.barContainerLayout]}>
                <LinearGradient
                    style={[styles.mainContainerChild, styles.barContainerLayout]}
                    locations={[0, 1]}
                    colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
                    useAngle={true}
                    angle={90}
                />
                <View style={[styles.container, styles.containerFlexBox]}>
                    <View style={styles.header}>
                        <View style={styles.featuredIcon}>
                            <Image
                                style={[styles.lifeBuoy02Icon, styles.iconLayout2]}
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
                        <Pressable style={styles.search} onPress={() => { }}>
                            <View
                                style={[styles.searchMdParent, styles.integrationCardBorder]}
                            >
                                <Image
                                    style={[styles.searchMdIcon, styles.iconLayout1]}
                                    resizeMode="cover"
                                    source={require("../../../assets/searchsm.png")}
                                />
                                <Text style={[styles.email, styles.headingTypo]}>
                                    Search issues
                                </Text>
                            </View>
                        </Pressable>
                        <View style={[styles.helpTopics, styles.helpTopicsPosition]}>
                            <View
                                style={[
                                    styles.headingWrapper,
                                    styles.headingContainerSpaceBlock,
                                ]}
                            >
                                <Text style={[styles.heading, styles.headingTypo]}>
                                    Help Topics
                                </Text>
                            </View>
                            <View style={[styles.accordion, styles.accordionLayout]}>
                                <Image
                                    style={[styles.dividerIcon, styles.iconLayout]}
                                    resizeMode="cover"
                                    source={require("../../../assets/divider.png")}
                                />
                                <View style={styles.content}>
                                    <View style={styles.button}>
                                        <Image
                                            style={[
                                                styles.placeholderIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                        <Text style={[styles.text, styles.textLayout]}>
                                            Learn more
                                        </Text>
                                        <Image
                                            style={[
                                                styles.placeholderIcon1,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                    </View>
                                    <View style={styles.actions}>
                                        <View style={styles.button1}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text, styles.textLayout]}>
                                                Tertiary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={[styles.button2, styles.buttonShadowBox]}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text2, styles.textLayout]}>
                                                Secondary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={styles.button3}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text3, styles.textTypo]}>
                                                General
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <Image
                                            style={[
                                                styles.chevronDownIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/chevrondown.png")}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.accordionLayout}>
                               
                                <View style={styles.content}>
                                    <View style={styles.button}>
                                        <Image
                                            style={[
                                                styles.placeholderIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                        <Text style={[styles.text, styles.textLayout]}>
                                            Learn more
                                        </Text>
                                        <Image
                                            style={[
                                                styles.placeholderIcon1,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                    </View>
                                    <View style={styles.actions}>
                                        <View style={styles.button1}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text, styles.textLayout]}>
                                                Tertiary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={[styles.button6, styles.buttonShadowBox]}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text2, styles.textLayout]}>
                                                Secondary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={styles.button3}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text3, styles.textTypo]}>
                                                Billing
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <Image
                                            style={[
                                                styles.chevronDownIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/chevrondown1.png")}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.accordionLayout}>
                                <Image
                                    style={[styles.dividerIcon, styles.iconLayout]}
                                    resizeMode="cover"
                                    source={require("../../../assets/divider.png")}
                                />
                                <View style={styles.content}>
                                    <View style={styles.button}>
                                        <Image
                                            style={[
                                                styles.placeholderIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                        <Text style={[styles.text, styles.textLayout]}>
                                            Learn more
                                        </Text>
                                        <Image
                                            style={[
                                                styles.placeholderIcon1,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                    </View>
                                    <View style={styles.actions}>
                                        <View style={styles.button1}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text, styles.textLayout]}>
                                                Tertiary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={[styles.button10, styles.buttonShadowBox]}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text2, styles.textLayout]}>
                                                Secondary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={styles.button3}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text3, styles.textTypo]}>
                                                Service
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <Image
                                            style={[
                                                styles.chevronDownIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/chevrondown.png")}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.accordion3, styles.accordionLayout]}>
                                <Image
                                    style={[styles.dividerIcon, styles.iconLayout]}
                                    resizeMode="cover"
                                    source={require("../../../assets/divider.png")}
                                />
                                <View style={styles.content}>
                                    <View style={styles.button}>
                                        <Image
                                            style={[
                                                styles.placeholderIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                        <Text style={[styles.text, styles.textLayout]}>
                                            Learn more
                                        </Text>
                                        <Image
                                            style={[
                                                styles.placeholderIcon1,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/placeholder.png")}
                                        />
                                    </View>
                                    <View style={styles.actions}>
                                        <View style={styles.button1}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text, styles.textLayout]}>
                                                Tertiary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={[styles.button14, styles.buttonShadowBox]}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text2, styles.textLayout]}>
                                                Secondary
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <View style={styles.button3}>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                            <Text style={[styles.text3, styles.textTypo]}>
                                                Popular Articles
                                            </Text>
                                            <Image
                                                style={[
                                                    styles.placeholderIcon1,
                                                    styles.placeholderIconLayout,
                                                ]}
                                                resizeMode="cover"
                                                source={require("../../../assets/placeholder.png")}
                                            />
                                        </View>
                                        <Image
                                            style={[
                                                styles.chevronDownIcon,
                                                styles.placeholderIconLayout,
                                            ]}
                                            resizeMode="cover"
                                            source={require("../../../assets/chevrondown.png")}
                                        />
                                    </View>
                                </View>
                            </View>
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
                                Additional Support
                            </Text>
                        </View>
                        <View style={styles.integrationCardMobileWrapper}>
                            <View
                                style={[
                                    styles.integrationCardMobile,
                                    styles.integrationCardBorder,
                                ]}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle}>
                                        <View style={styles.headingAndIcon}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                                <View style={styles.frameParent}>
                                                    <Pressable onPress={() => navigation.navigate('Support Article')} style={styles.pressable}>
                                                        <Text style={styles.linkText}>Support Article</Text>
                                                    </Pressable>
                                                 
                                                </View>

                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Pressable
                            style={[
                                styles.integrationCardMobileContainer,
                                styles.content4SpaceBlock,
                            ]}
                            onPress={() => { }}
                        >
                            <View
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle}>
                                        <View style={styles.headingAndIcon}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Troubleshooting
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text
                                                    style={[styles.supportingText, styles.textLayout]}
                                                >
                                                    Explore instant solutions to issues.
                                                </Text>
                                            </View>
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                        <View
                            style={[
                                styles.integrationCardMobileContainer,
                                styles.content4SpaceBlock,
                            ]}
                        >
                            <Pressable
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                                onPress={() => { }}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle}>
                                        <View style={styles.headingAndIcon}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Equipment Management
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text
                                                    style={[styles.supportingText, styles.textLayout]}
                                                >
                                                    View and manage equipment.
                                                </Text>
                                            </View>
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                        <View
                            style={[
                                styles.integrationCardMobileContainer,
                                styles.content4SpaceBlock,
                            ]}
                        >
                            <Pressable
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                                onPress={() => { }}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle}>
                                        <View style={styles.headingAndIcon}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Ticket Support
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text
                                                    style={[styles.supportingText, styles.textLayout]}
                                                >
                                                    Open a support ticket for us to help.
                                                </Text>
                                            </View>
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
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
                        <View
                            style={[
                                styles.integrationCardMobileContainer,
                                styles.content4SpaceBlock,
                            ]}
                        >
                            <View
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle4}>
                                        <View style={styles.headingAndIcon4}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Billing Support
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/phone-outgoing-01.png")}
                                                    />
                                                </View>
                                                <View style={styles.supportingTextWrapper}>
                                                    <Text
                                                        style={[styles.supportingText4, styles.textTypo]}
                                                    >
                                                        877-692-2253
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[styles.supportingText5, styles.textLayout]}
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
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.integrationCardMobileContainer,
                                styles.content4SpaceBlock,
                            ]}
                        >
                            <View
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle4}>
                                        <View style={styles.headingAndIcon4}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Tech Support
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/phone-outgoing-01.png")}
                                                    />
                                                </View>
                                                <View style={styles.supportingTextWrapper}>
                                                    <Text
                                                        style={[styles.supportingText4, styles.textTypo]}
                                                    >
                                                        877-692-2253
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[styles.supportingText5, styles.textLayout]}
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
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.integrationCardMobileWrapper}>
                            <View
                                style={[
                                    styles.integrationCardMobile1,
                                    styles.integrationCardBorder,
                                ]}
                            >
                                <View style={[styles.content4, styles.content4SpaceBlock]}>
                                    <View style={styles.headingAndToggle4}>
                                        <View style={styles.headingAndIcon4}>
                                            <Image
                                                style={styles.featuredIcon1}
                                                resizeMode="cover"
                                                source={require("../../../assets/featured-icon.png")}
                                            />
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.heading3, styles.headingTypo]}>
                                                        Sales Support
                                                    </Text>
                                                    <Image
                                                        style={[
                                                            styles.chevronRightIcon1,
                                                            styles.placeholderIconLayout,
                                                        ]}
                                                        resizeMode="cover"
                                                        source={require("../../../assets/phone-outgoing-01.png")}
                                                    />
                                                </View>
                                                <View style={styles.supportingTextWrapper}>
                                                    <Text
                                                        style={[styles.supportingText4, styles.textTypo]}
                                                    >
                                                        888-573-0441
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[styles.supportingText5, styles.textLayout]}
                                                >
                                                    Would you like to purchase new services? Our sales
                                                    team is here to assist you.
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
                                                    M-F 7:00 AM-7:00 PM MST
                                                </Text>
                                            </View>
                                            <View style={styles.badgeWrapper}>
                                                <View
                                                    style={[styles.badge, styles.integrationCardBorder]}
                                                >
                                                    <Text style={styles.text16}>CURRENT</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.containerChild, styles.issuesFlexBox]} />
                </View>
            </View>
            <Image
                style={[styles.supportChild, styles.iconLayout]}
                resizeMode="cover"
                source={require("../../../assets/rectangle-763.png")}
            />
            <View style={[styles.topBar, styles.topBarPosition]}>
                <Image
                    style={[styles.iosstatusBarwhiteIcon, styles.iconLayout]}
                    resizeMode="cover"
                    source={require("../../../assets/iosstatus-barwhite.png")}
                />
            </View>
            <View style={[styles.navBar, styles.barContainerLayout]}>
                <Text style={[styles.title, styles.titlePosition]}>Support</Text>
                <Image
                    style={[styles.chevronLeftIcon, styles.iconPosition]}
                    resizeMode="cover"
                    source={require("../../../assets/chevronleft.png")}
                />
                <Image
                    style={[styles.thumbsUpIcon, styles.iconPosition]}
                    resizeMode="cover"
                    source={require("../../../assets/thumbs-up.png")}
                />
                <Image
                    style={[styles.heartIcon, styles.iconPosition]}
                    resizeMode="cover"
                    source={require("../../../assets/heart.png")}
                />
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    barContainerLayout: {
        width: 430,
        position: "absolute",
    },
    containerFlexBox: {
        marginTop: 16,
        alignSelf: "stretch",
        alignItems: "center",
    },
    iconLayout2: {
        height: 32,
        width: 32,
    },
    integrationCardBorder: {
        borderWidth: 1,
        borderStyle: "solid",
    },
    iconLayout1: {
        height: 24,
        width: 24,
    },
    headingTypo: {
        textAlign: "left",
        fontFamily: FontFamily.openSansRegular,
    },
    helpTopicsPosition: {
        borderBottomLeftRadius: Border.br_11xs,
        borderBottomRightRadius: Border.br_11xs,
    },
    headingContainerSpaceBlock: {
        paddingBottom: Padding.p_base,
        backgroundColor: Color.baseWhite,
        alignItems: "center",
    },
    accordionLayout: {
        width: 382,
        paddingBottom: Padding.p_base,
        backgroundColor: Color.baseWhite,
        justifyContent: "center",
    },
    iconLayout: {
        maxWidth: "100%",
        overflow: "hidden",
        width: "100%",
    },
    placeholderIconLayout: {
        height: 20,
        width: 20,
        overflow: "hidden",
    },
    textLayout: {
        lineHeight: 20,
        textAlign: "left",
    },
    buttonShadowBox: {
        borderColor: Color.colorLightgray,
        shadowOpacity: 1,
        elevation: 2,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowColor: "rgba(16, 24, 40, 0.05)",
        marginLeft: 12,
        paddingVertical: Padding.p_3xs,
        paddingHorizontal: Padding.p_base,
        borderRadius: Border.br_5xs,
        display: "none",
        borderWidth: 1,
        backgroundColor: Color.baseWhite,
        justifyContent: "center",
        flexDirection: "row",
        borderStyle: "solid",
        alignItems: "center",
        overflow: "hidden",
    },
    textTypo: {
        color: Color.sparkLightPurple,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
    },
    content4SpaceBlock: {
        paddingHorizontal: Padding.p_base,
        alignSelf: "stretch",
    },
    supportingTypo: {
        lineHeight: 14,
        marginTop: 10,
        fontSize: FontSize.textSmSemibold_size,
        textAlign: "left",
        color: Color.sparklightDarkestGray,
        alignSelf: "stretch",
    },
    issuesFlexBox: {
        marginTop: 24,
        alignSelf: "stretch",
        alignItems: "center",
    },
    topBarPosition: {
        top: 0,
        left: 0,
    },
    titlePosition: {
        color: Color.baseWhite,
        top: "50%",
        marginTop: -9,
        left: "50%",
        fontWeight: "600",
        lineHeight: 18,
        textAlign: "center",
        position: "absolute",
    },
    iconPosition: {
        marginTop: -12,
        top: "50%",
        position: "absolute",
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
        top: -2,
        height: 59,
        backgroundColor: "transparent",
        zIndex: 0,
        left: 0,
        width: 430,
    },
    lifeBuoy02Icon: {
        overflow: "hidden",
    },
    featuredIcon: {
        backgroundColor: Color.sparkLightPurple,
        borderColor: Color.sparklightBlue,
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
        color: Color.sparklightDarkestGray,
        fontFamily: FontFamily.openSansRegular,
    },
    wereHereToHelpWrapper: {
        justifyContent: "center",
    },
    header: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    searchMdIcon: {
        overflow: "hidden",
    },
    email: {
        marginLeft: 10,
        color: Color.sparklightDarkGray,
        fontSize: FontSize.size_base,
    },
    searchMdParent: {
        height: 58,
        paddingHorizontal: Padding.p_xs,
        paddingVertical: Padding.p_5xs,
        borderColor: Color.sparklightGray,
        borderTopRightRadius: Border.br_11xs,
        borderTopLeftRadius: Border.br_11xs,
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
    },
    search: {
        backgroundColor: Color.baseWhite,
        borderRadius: Border.br_11xs,
        justifyContent: "center",
        alignSelf: "stretch",
    },
    heading: {
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        color: Color.sparklightDarkestGray,
        flex: 1,
    },
    headingWrapper: {
        display: "none",
        paddingTop: Padding.p_5xl,
        paddingBottom: Padding.p_base,
        paddingHorizontal: Padding.p_5xl,
        flexDirection: "row",
        alignSelf: "stretch",
    },
    dividerIcon: {
        height: 1,
        alignSelf: "stretch",
    },
    placeholderIcon: {
        display: "none",
    },
    text: {
        color: Color.gray600,
        marginLeft: 8,
        fontFamily: FontFamily.textXsSemibold,
        fontWeight: "600",
        fontSize: FontSize.textSmSemibold_size,
        lineHeight: 20,
    },
    placeholderIcon1: {
        marginLeft: 8,
        display: "none",
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 10,
    },
    button: {
        display: "none",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    button1: {
        paddingVertical: Padding.p_3xs,
        borderRadius: Border.br_5xs,
        paddingHorizontal: Padding.p_base,
        display: "none",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    text2: {
        color: Color.gray700,
        marginLeft: 8,
        fontFamily: FontFamily.textXsSemibold,
        fontWeight: "600",
        fontSize: FontSize.textSmSemibold_size,
        lineHeight: 20,
    },
    button2: {
        marginLeft: 12,
    },
    text3: {
        marginLeft: 8,
        lineHeight: 20,
        textAlign: "left",
        fontSize: FontSize.size_base,
    },
    button3: {
        marginLeft: 12,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        flex: 1,
    },
    chevronDownIcon: {
        marginLeft: 12,
    },
    actions: {
        marginLeft: 16,
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    content: {
        paddingVertical: 0,
        paddingHorizontal: Padding.p_5xl,
        flexDirection: "row",
        marginTop: 16,
        alignSelf: "stretch",
        alignItems: "center",
    },
    accordion: {
        borderTopRightRadius: Border.br_11xs,
        borderTopLeftRadius: Border.br_11xs,
    },
    button6: {
        marginLeft: 12,
    },
    button10: {
        marginLeft: 12,
    },
    button14: {
        marginLeft: 12,
    },
    accordion3: {
        borderBottomLeftRadius: Border.br_11xs,
        borderBottomRightRadius: Border.br_11xs,
    },
    helpTopics: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: Color.sparklightGray,
        alignItems: "center",
    },
    headingContainer: {
        paddingTop: Padding.p_5xl,
        paddingBottom: Padding.p_base,
        paddingHorizontal: Padding.p_5xl,
        flexDirection: "row",
        alignSelf: "stretch",
        borderTopRightRadius: Border.br_11xs,
        borderTopLeftRadius: Border.br_11xs,
    },
    featuredIcon1: {
        borderRadius: Border.br_5xl,
        width: 48,
        height: 48,
    },
    heading2: {
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        color: Color.sparklightDarkGray,
        flex: 1,
    },
    chevronRightIcon: {
        opacity: 0,
        marginLeft: 8,
    },
    headingAndToggle: {
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportingText: {
        marginTop: 8,
        fontSize: FontSize.textSmSemibold_size,
        lineHeight: 20,
        color: Color.sparklightDarkGray,
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    frameParent: {
        marginLeft: 12,
        justifyContent: "center",
        flex: 1,
    },
    text16: {
        color: Color.success700,
        fontSize: FontSize.textXsSemibold_size,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        lineHeight: 18,
        textAlign: "center",
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
    content4: {
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
        backgroundColor: Color.baseWhite,
        alignSelf: "stretch",
        alignItems: "center",
    },
    heading3: {
        color: Color.gray900,
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        flex: 1,
    },
    chevronRightIcon1: {
        marginLeft: 8,
    },
    integrationCardMobile1: {
        borderColor: Color.sparklightGray,
        backgroundColor: Color.baseWhite,
        borderRadius: Border.br_11xs,
        alignSelf: "stretch",
    },
    integrationCardMobileContainer: {
        paddingBottom: Padding.p_base,
        backgroundColor: Color.baseWhite,
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
        textAlign: "left",
        fontSize: FontSize.textSmSemibold_size,
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
        fontSize: FontSize.textSmSemibold_size,
        lineHeight: 20,
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
    containerChild: {
        height: 8,
        borderRadius: Border.br_11xs,
    },
    container: {
        zIndex: 1,
    },
    mainContainer: {
        top: 100,
        height: 748,
        padding: Padding.p_5xl,
        alignItems: "center",
        left: 0,
        width: 430,
    },
    supportChild: {
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
    topBar: {
        width: 430,
        position: "absolute",
    },
    title: {
        marginLeft: -35,
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_lg,
    },
    chevronLeftIcon: {
        left: 18,
        display: "none",
        height: 24,
        width: 24,
    },
    thumbsUpIcon: {
        right: 24,
        height: 24,
        width: 24,
    },
    heartIcon: {
        right: 52,
        display: "none",
        height: 32,
        width: 32,
    },
    navBar: {
        top: 44,
        height: 56,
        left: 0,
        width: 430,
    },
    home: {
        fontSize: FontSize.textXsSemibold_size,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        lineHeight: 18,
        color: Color.sparklightDarkGray,
        textAlign: "center",
    },
    support1: {
        fontSize: FontSize.textXsSemibold_size,
        lineHeight: 18,
        textAlign: "center",
    },
    avatarContrastInnerBorder: {
        right: 0,
        borderColor: Color.sparklightDarkestGray,
        borderWidth: 0.5,
        opacity: 0.08,
        borderRadius: Border.br_181xl,
        top: 0,
        left: 0,
        borderStyle: "solid",
        overflow: "hidden",
    },
    text23: {
        marginLeft: -12,
        fontSize: FontSize.textXsSemibold_size,
        fontFamily: FontFamily.textXsSemibold,
        width: 24,
        color: Color.baseWhite,
        top: "50%",
        marginTop: -9,
    },
    container: {
        flex: 1,
        marginTop: 20,
    },
    pressable: {
        margin: 10,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    rightActionable: {
        backgroundColor: Color.sparklightDarkGray,
        borderRadius: Border.br_181xl,
    },
    framePressable: {
        justifyContent: "center",
    },
    tabs: {
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "stretch",
        flex: 1,
    },
    homeIndicator1: {
        marginLeft: -67,
        backgroundColor: Color.sparklightGray,
        bottom: 0,
        position: "absolute",
        left: "50%",
        height: 4,
        width: 134,
        borderRadius: Border.br_81xl,
    },
    iphoneUi: {
        paddingBottom: Padding.p_5xs,
        marginTop: 10,
    },
    tabsParent: {
        justifyContent: "center",
        alignSelf: "stretch",
        alignItems: "center",
        flex: 1,
    },
    navigation: {
        top: 847,
        borderTopWidth: 1,
        height: 85,
        borderColor: Color.sparklightGray,
        backgroundColor: Color.baseWhite,
        justifyContent: "center",
        borderStyle: "solid",
        alignItems: "center",
        left: 0,
        width: 430,
    },
    support: {
        backgroundColor: Color.sparklightBlue,
        height: 932,
        overflow: "hidden",
        width: "100%",
        flex: 1,
    },
});

export default Support;
