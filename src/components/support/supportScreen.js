import React, { useState,useEffect,useRef } from "react";
import { StyleSheet, View, Image, Pressable, ScrollView, Linking, Platform } from "react-native";
import { Border, Padding, Color, FontSize, FontFamily } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import Text from '../common/customui/CustomText';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import * as Zendesk from 'react-native-zendesk-messaging';
import {DeviceEventEmitter} from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";

const Support = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const makeCall = (number) => {
        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }

        Linking.openURL(phoneNumber);
    };



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
            text: 'More...',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the right of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us'
        }
    ];

    useEffect(() => {
        DeviceEventEmitter.addListener("event.contactUsEvent", (eventData) => {
           console.log('Callback',eventData)
           scrollViewRef.current?.scrollToEnd({animated: true})
        })

        initZendesk();
          return () => {
            DeviceEventEmitter.removeAllListeners("event.contactUsEvent")
          };

      }, []);


      const initZendesk=()=>{
        Zendesk.initialize({ channelKey:  Platform.OS === 'android'
        ? 'eyJzZXR0aW5nc191cmwiOiJodHRwczovL2NhYmxlb25lMTYxNTQwMjg1MS56ZW5kZXNrLmNvbS9tb2JpbGVfc2RrX2FwaS9zZXR0aW5ncy8wMUhKSkQyQ0VZUko5RUFNRVgxR1NHQlg2MC5qc29uIn0='
        : 'eyJzZXR0aW5nc191cmwiOiJodHRwczovL2NhYmxlb25lMTYxNTQwMjg1MS56ZW5kZXNrLmNvbS9tb2JpbGVfc2RrX2FwaS9zZXR0aW5ncy8wMUhKSkM2QVNWNFNDTkZGVFdYRVFYNjJQNC5qc29uIn0=' })
          .then(() => {
            
          })
          .catch((error) =>{
    
          });
      }
    
      const handlePressOpenButton = () => {
       
        Zendesk.openMessagingView();
        Zendesk.addEventListener()
      };
    

    return (
        <View style={styles.support}>
            <ProfileSettingsHeader
                title="Support"
                iconAlignment="right"
                showIcon={false} // New prop to control icon visibility
            />
            
                <LinearGradient
                    style={styles.linearGradientStyle}
                    locations={[0, 1]}
                    colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                    useAngle={true}
                    angle={90}
                />
                <View style={[styles.mainContainer]}>
                    <View style={[styles.containerFlexBox]}>
                        <View style={styles.header}>
                            <View style={styles.featuredIcon}>
                                <Image
                                    style={[styles.lifeBuoy02IconLayout]}
                                    resizeMode="stretch"
                                    source={require("../../../assets/right-actionable19.png")}
                                />
                            </View>
                            <View style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}>
                                <Text style={styles.wereHereTo}>We’re Here to Help</Text>
                            </View>
                        </View>
                        <ScrollView style={{width:'100%',marginBottom:hp('30%')}}>
                        <View >
                        
                        <View style={styles.issuesFlexBox}>
                            {items.map((item, index) => (
                                <React.Fragment key={item.name}>
                                    <Pressable key={item.key} style={[styles.search, styles.navigationBorder]}
                                        onPress={() => {
                                            if (item.iconAlignment === 'left') {
                                                navigation.navigate(item.navigateTo)
                                            } else {
                                                navigation.navigate(item.navigateTo, { url: item.url, name: item.text })
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
                                                : <Text style={[{ paddingHorizontal: Padding.p_3xs,color: Color.sparklightGray1,fontSize:FontSize.size_base }]}>
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
                            {/*
                            <Pressable style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]} onPress={() => { }}>
                                <View style={[styles.integrationCardMobile1, styles.integrationCardBorder]}>
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon}>
                                            <View style={[styles.icon]}>
                                                <Image
                                                    style={styles.supportIcon}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/tool-02.png")}
                                                />
                                            </View>
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.headingTypo]}>
                                                        Troubleshooting
                                                    </Text>
                                                    <Image
                                                        style={styles.chevronIconLayout}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text style={[styles.supportingText, styles.supportingTypo1,]} >
                                                    Explore instant solutions to issues.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                            */}
                            <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]} >
                                <Pressable
                                    style={[styles.integrationCardMobile1, styles.integrationCardBorder,]}
                                    onPress={() => { navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/18929657224855', name: 'FAQ' }) }}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon}>
                                            <View style={[]}>
                                                <Image
                                                    style={styles.icon}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/icon-faq.png")}
                                                /></View>
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.headingTypo]}>
                                                        FAQ
                                                    </Text>
                                                    <Image
                                                        style={styles.chevronIconLayout}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text style={[styles.supportingText, styles.supportingTypo1]}>
                                                    Review common questions.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]}>
                                <Pressable
                                    style={[styles.integrationCardMobile1, styles.integrationCardBorder]}
                                    onPress={() => { navigation.navigate('ManageEquipment') }}
                                >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon}>
                                            <View style={[styles.icon]}>
                                                <Image
                                                    style={styles.supportIcon}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/modem-02.png")}
                                                />
                                            </View>
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.headingTypo]}>
                                                        Equipment Management
                                                    </Text>
                                                    <Image
                                                        style={styles.chevronIconLayout}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text style={[styles.supportingText, styles.supportingTypo1,]}>
                                                    View and manage equipment.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>

                        </View>
                        <View style={[styles.additionalSupport, styles.integrationCardBorder]}>
                            <View style={[styles.headingContainer, styles.headingContainerSpaceBlock]} >
                                <Text style={[styles.heading, styles.headingTypo]}>
                                    Contact Us
                                </Text>
                            </View>
                            {/*<View style={styles.integrationCardMobileWrapper}>
                                <View
                                    style={[styles.integrationCardMobile1, styles.integrationCardBorder]}>
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon}>
                                            <View style={[styles.icon]}>
                                                <Image
                                                    style={styles.supportIcon}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/message-text-square-01.png")}
                                                />
                                            </View>
                                            <View style={styles.frameParent}>
                                                <Pressable style={styles.headingAndToggle}
                                                onPress={()=>{
                                                   // navigation.navigate('LiveChatTicketSupport') 
                                                   handlePressOpenButton()
                                                }}
                                                >
                                                    <Text style={[styles.supportingText, styles.headingTypo1]}>
                                                        Live Support
                                                    </Text>
                                                </Pressable>
                                                <Text style={[styles.supportingText, styles.supportingTypo1]} >
                                                    No agents available right now. Agents are typically
                                                    available from 5:00am- 9:00pm PST
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock,]}> 
                                <Pressable
                                    style={[styles.integrationCardMobile1, styles.integrationCardBorder,]}
                                    onPress={() => { navigation.navigate('TicketSupport') }} >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon}>
                                            <View style={[styles.icon]}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/ticket-02.png")}
                                                /></View>
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.headingTypo]}>
                                                        Ticket Support
                                                    </Text>
                                                    <Image
                                                        style={styles.chevronIconLayout}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/chevronright.png")}
                                                    />
                                                </View>
                                                <Text style={[styles.supportingText, styles.supportingTypo1,]}>
                                                    Open a support ticket for us to help.
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            </View>
                            */}
                            <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]}>
                                <View style={[styles.integrationCardMobile1, styles.integrationCardBorder]}>
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndIcon4}>
                                            <View style={[styles.icon]}>
                                                <Image
                                                    style={styles.supportIcon}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/tool-02.png")}
                                                />
                                            </View>
                                            <View style={styles.frameParent}>
                                                <View style={styles.headingAndToggle}>
                                                    <Text style={[styles.headingTypo]}>
                                                        Tech Support
                                                    </Text>
                                                    <Pressable onPress={() => makeCall('877-692-2253')}>
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="stretch"
                                                            source={require("../../../assets/phone-outgoing-01.png")}
                                                        />
                                                    </Pressable>
                                                </View>
                                                <Pressable onPress={() => makeCall('877-692-2253')}>
                                                    <View style={styles.supportingTextWrapper}>
                                                        <Text style={[styles.supportingText4, styles.support1Typo,]}>
                                                            877-692-2253
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                                <Text style={[styles.supportingText5, styles.supportingTypo1,]}>
                                                    Need a little help with your Sparklight® service? We're here 24 hours a day, seven days a week to support you.
                                                </Text>
                                                <Text style={[styles.supportingText6, styles.supportingTypo,]}>
                                                    {`Call Center Hours: `}
                                                </Text>
                                                <Text style={[styles.supportingText7, styles.supportingTypo,]}>
                                                    24h/7 days a week
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock,]}>
                                <View style={[styles.integrationCardMobile1, styles.integrationCardBorder,]} >
                                    <View style={[styles.content, styles.contentSpaceBlock]}>
                                        <View style={styles.headingAndToggle}>
                                            <View style={styles.headingAndIcon4}>
                                                <View style={[styles.icon]}>
                                                    <Image
                                                        style={styles.supportIcon}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/wallet-03.png")}
                                                    /></View>
                                                <View style={styles.frameParent}>
                                                    <View style={styles.headingAndToggle}>
                                                        <Text style={[styles.headingTypo]}>
                                                            Billing Support
                                                        </Text>
                                                        <Pressable onPress={() => makeCall('877-692-2253')}>
                                                            <Image
                                                                style={styles.chevronIconLayout}
                                                                resizeMode="stretch"
                                                                source={require("../../../assets/phone-outgoing-01.png")}
                                                            />
                                                        </Pressable>
                                                    </View>
                                                    <Pressable onPress={() => makeCall('877-692-2253')}>
                                                        <View style={styles.supportingTextWrapper}>
                                                            <Text style={[styles.supportingText4, styles.support1Typo,]}>
                                                                877-692-2253
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                    <Text style={[styles.supportingText5, styles.supportingTypo1,]}>
                                                        Want to upgrade your service, make a change, or have a
                                                        billing question? Give us a call for assistance.
                                                    </Text>
                                                    <Text style={[styles.supportingText6, styles.supportingTypo,]}>
                                                        {`Call Center Hours: `}
                                                    </Text>
                                                    <Text style={[styles.supportingText7, styles.supportingTypo,]} >
                                                        M-F 8:00 AM-5:00 PM MST
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
                        </ScrollView>
                    </View>
                </View>
            
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
        fontFamily: FontFamily.openSansRegular,
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
    containerFlexBox: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    lifeBuoy02IconLayout: {
        height: 32,
        width: 32,
    },
    supportIcon: {
        height: 24,
        width: 24,
    },
    integrationCardBorder: {
        borderWidth: 1,
        borderStyle: "solid",
    },
    icon: {
        width: 48, // Width as per Figma design
        height: 48, // Height as per Figma design
        borderRadius: 24, // This will make it a circle
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        borderColor: '#F4F4F5', // Border color from Figma design
        backgroundColor: '#F4F4F5', // Background color from Figma design
    },
    iconStyle: {
        width: 20, // Set according to your icon size
        height: 20, // Set according to your icon size
        resizeMode: 'contain',
        marginRight: 8, // Add some margin if needed
    },
    headingContainerSpaceBlock: {
        paddingBottom: Padding.p_base,
        backgroundColor: Color.sparklightWhite,
        alignItems: "flex-start",
    },
    headingTypo: {
        textAlign: "auto",
        color: Color.colorGray_100,
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        flex: 1,
    },
    headingTypo1: {
        textAlign: "auto",
        color: Color.sparklightaddGray,
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        flex: 1,
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
    support1Typo: {
        color: Color.colorMidnightblue,
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "700",
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
    mainContainerChild: {
        position: 'absolute',
        height: '4%',
        flex: 1,
        backgroundColor: "transparent",
        left: 0, // Ensure it takes the full width
        right: 0,
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
        fontSize: FontSize.size_3xl,
        width: 210,
        fontFamily: FontFamily.openSansRegular,
        color: Color.colorGray_200,
        lineHeight: 28,
        textAlign: "center",
    },
    wereHereToHelpWrapper: {
        justifyContent: "center",
        overflow: 'hidden',
    },
    header: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    searchChild: {
        flex: 1,
        paddingHorizontal: Padding.p_base,
        paddingVertical: Padding.p_base,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        fontWeight:'400'
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
        paddingHorizontal: Padding.p_base,
        paddingBottom: Padding.p_base,
        flexDirection: "row",
        alignSelf: "stretch",
        borderTopRightRadius: Border.br_11xs,
        borderTopLeftRadius: Border.br_11xs,
    },
    headingAndToggle: {
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center",
    },
    supportingText: {
        marginTop: 8,
        color: Color.sparklightaddGray,
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    frameParent: {
        marginLeft: Padding.p_xs,
        flex: 1,
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
        backgroundColor: Color.colorWhitesmoke_100,
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
        color: Color.sparklightaddGray,
        fontFamily: FontFamily.openSansRegular,
        alignSelf: "stretch",
    },
    supportingText6: {
        fontFamily: FontFamily.openSansRegular,
    },
    supportingText7: {
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "700",
    },
    headingAndIcon4: {
        flexDirection: "row",
        flex: 1,
    },
    mainContainer: {
        padding: Padding.p_base,
        alignItems: "center",
        alignSelf: 'stretch',
        marginBottom: '20%',
    },
    support: {
        flex: 1,
        backgroundColor: Color.colorWhitesmoke_200,
        width: "100%",
    },
    linearGradientStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: hp('18%'),
    },
});

export default Support;
