import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image, Pressable, ScrollView, Linking, Platform, Text,TouchableOpacity,Alert } from "react-native";
import { useSelector } from 'react-redux';
import { Border, Padding, Color, FontSize, FontFamily } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";

import PubSub from 'pubsub-js'
import { Env } from "../../network/apis/account/Constants";
import ChatSupportModal from "./ChatSupportModal";
import ChatIcon from "../../res/svgIcons/ChatIcon";
import { GetApiRequest } from "../../network/APIClient";
import CreateTicket from "./ticket/CreateTicket";
//import ZendDesk from '@pagopa/io-react-native-zendesk';
import { startChatWithConfig } from "../utility/RNZendeskChat";

const Support = ({ route }) => {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [department, setDepartment] = useState('');
    const userData = useSelector(state => state.combinedReducers.user.userData);
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

    const toggleModal = (department) => {
        setDepartment(department);
        setTimeout(() => {
            setShowModal(!showModal);
        }, 1000)

    };

    

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                if (route.params?.isContactUs) {
                    scrollViewRef.current?.scrollTo({ y: 0, x: 0, animated: true })
                }

            }, 500)


        });
        return unsubscribe;
    }, [navigation]);


    const items = [
        {
            key: 'searchIssues',
            text: 'Search issues',
            icon: require("../../../assets/search-md.png"),
            iconAlignment: 'left', // Icon to the left of the text
            navigateTo: 'searchArticals',
        },
        {
            key: 'Faqs',
            text: 'FAQs',
            icon: require("../../../assets/chevronright.png"),
            iconAlignment: 'right', // Icon to the left of the text
            navigateTo: 'ArticalWindowUtility',
            url: 'https://support.sparklight.com/hc/en-us/articles/18929657224855'
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

    var mySubscriber = function (msg, data) {
        console.log(msg, data);
        scrollViewRef.current?.scrollToEnd({ animated: true })
    };

    useEffect(() => {
        if (route.params?.isContactUs) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true })
            }, 500)
        }

        var token = PubSub.subscribe('event.contactUsEvent', mySubscriber);
        return () => {
            PubSub.unsubscribe(token);
        };
    }, []);

    const exitConfirmation=()=>{
        console.log('Wait exit')
        Alert.alert("Wait!", "Are you sure to go back?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => navigation.goBack() }
          ]);
    }


    const handlePressOpenButton = (department, tags) => {
        const data= {
            name: userData.userInfo.fullName !== undefined && userData.userInfo.fullName !== null ? userData.userInfo.fullName : '',
            email: userData.userInfo.email !== undefined && userData.userInfo.email !== null ? userData.userInfo.email : '',
            phone: userData.userInfo.phone !== undefined && userData.userInfo.phone !== null ? userData.userInfo.phone : '',
            tags:['pid:_' + userData.userInfo.accountNumber],
            department:department
        };
        startChatWithConfig(data)

    };


    return (
        <View style={styles.support}>
            <ProfileSettingsHeader title="Support" iconAlignment="right" showIcon={false}  />
            <LinearGradient
                style={styles.linearGradientStyle}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                useAngle={true}
                angle={90}
            />
            <View style={[styles.mainContainer]}>
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
                <ScrollView ref={scrollViewRef}>
                    <View style={styles.issuesFlexBox}>
                        <View style={[styles.headingContainer, styles.headingContainerSpaceBlock]}>
                            <Text style={[styles.heading, styles.headingTypo]}>
                                Knowledgebase
                            </Text>
                        </View>
                        <View style={styles.frameChild} />
                        {items.map((item, index) => (
                            <React.Fragment key={index}>

                                <Pressable key={index} style={[styles.search, styles.navigationBorder]}
                                     accessible={true}
                                     accessibilityLabel={item.text == `More...` ? 'More' : item.text}
                                     accessibilityRole="button"
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
                                            : <Text style={[{ paddingHorizontal: Padding.p_3xs, color: Color.sparklightGray1, fontSize: FontSize.size_base }]}>
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

                        {<Pressable 
                         accessible={true}
                         accessibilityLabel={`Sparklight Smart Check`}
                         accessibilityRole="button"
                        style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]} onPress={() => { navigation.navigate('DiagnosticFlow') }}>
                            <View style={[styles.integrationCardMobile1, styles.integrationCardBorder]}>
                                <View style={[{ paddingVertical: Padding.p_xl }, styles.contentSpaceBlock]}>
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
                                                    Sparklight Smart Check
                                                </Text>
                                                <Image
                                                    style={styles.chevronIconLayout}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/chevronright.png")}
                                                />
                                            </View>
                                            <Text style={[styles.supportingText, styles.supportingTypo1,]} >
                                            Instant Troubleshooting & Outage Check.
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>}

                                {/* <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]} >
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

                                */}
                        <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]}>
                            <Pressable
                             accessible={true}
                             accessibilityLabel={`Equipment Management`}
                             accessibilityRole="button"
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


                        <View style={[styles.integrationCardMobileContainer, styles.contentSpaceBlock]}>
                            <View style={[styles.integrationCardMobile1, styles.integrationCardBorder]}>
                                <View style={[styles.content, styles.contentSpaceBlock]}>

                                    <Pressable 
                                    accessible={true}
                                    accessibilityLabel={`Ticket Support`}
                                    accessibilityRole="button"
                                    style={styles.headingAndIcon4} onPress={()=>{
                                            navigation.navigate('TicketStackScreen')
                                    }}>
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
                                                    Ticket Support
                                                </Text>
                                                <Image
                                                    style={styles.chevronIconLayout}
                                                    resizeMode="stretch"
                                                    source={require("../../../assets/chevronright.png")}
                                                />
                                            </View>
                                            <Text style={[styles.supportingText5, styles.supportingTypo1,]}>
                                                Need help? Submit a support ticket and we'll respond within 48 hours.
                                            </Text>
                                            
                                        </View>
                                    </Pressable>
                                </View>
                            </View>
                        </View> 








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
                                                <Pressable
                                                    onPress={() => makeCall('877-692-2253')}
                                                    accessibilityLabel="Call Tech Support"
                                                    accessibilityRole="button"
                                                    accessibilityHint="Dials the tech support number on your phone">
                                                    <Image
                                                        style={styles.chevronIconLayout}
                                                        resizeMode="stretch"
                                                        source={require("../../../assets/phone-outgoing-01.png")}
                                                    />
                                                </Pressable>
                                            </View>
                                            <Pressable
                                                onPress={() => {
                                                    toggleModal("tech");
                                                }}
                                                accessibilityLabel="Chat Support"
                                                accessibilityRole="button"
                                                accessibilityHint="Chat with Tech Support">
                                                <View style={styles.supportChatText}>

                                                </View>
                                            </Pressable>
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
                                            <Text style={[{ fontFamily: FontFamily.openSansRegular }, styles.supportingTypo,]}>
                                                {`Call Center Hours: `}
                                            </Text>
                                            <Text style={[styles.supportingText7, styles.supportingTypo,]}>
                                                24h/7 days a week
                                            </Text>
                                            <TouchableOpacity
                                             accessibilityLabel="Chat"
                                             accessibilityRole="button"
                                             accessible={true}
                                                style={{
                                                    flexDirection: "row",
                                                    marginTop: 16,
                                                    alignItems: "center",
                                                }}
                                                onPress={() => {
                                                    //toggleModal("tech");
                                                    handlePressOpenButton("SPK TCC Residential", ['Residential', 'ContactUs'])
                                                }}
                                            >
                                                <ChatIcon />
                                                <Text
                                                    style={[styles.headingTypo, { marginLeft: 10, fontSize: 16 }]}
                                                >
                                                    Chat
                                                </Text>
                                            </TouchableOpacity>
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
                                                    <Pressable
                                                        onPress={() => makeCall('877-692-2253')}
                                                        accessibilityLabel="Call Billing Support"
                                                        accessibilityRole="button"
                                                        accessibilityHint="Dials the billing support number on your phone">
                                                        <Image
                                                            style={styles.chevronIconLayout}
                                                            resizeMode="stretch"
                                                            source={require("../../../assets/phone-outgoing-01.png")}
                                                        />
                                                    </Pressable>
                                                </View>
                                                <Pressable
                                                    //onPress={() => handlePressOpenButton("1500003312402", ['Residential', 'ContactUs'])}
                                                    onPress={() => {
                                                        //toggleModal("Bill");
                                                        //ZendDesk.initChat('ad791f41-3c05-490b-8bb3-55afe1751f92d')
                                                       
                                                    }}
                                                    accessibilityLabel="Chat Support"
                                                    accessibilityRole="button"
                                                    accessibilityHint="Chat with Billing Support">
                                                    <View style={styles.supportChatText}>

                                                    </View>
                                                </Pressable>
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
                                                <Text style={[{ fontFamily: FontFamily.openSansRegular }, styles.supportingTypo,]}>
                                                    {`Call Center Hours: `}
                                                </Text>
                                                <Text style={[styles.supportingText7, styles.supportingTypo,]} >
                                                    M-F 8:00 AM-5:00 PM MST
                                                </Text>
                                                <TouchableOpacity
                                                accessibilityLabel="Chat"
                                                accessibilityRole="button"
                                                accessible={true}
                                                    style={{
                                                        flexDirection: "row",
                                                        marginTop: 16,
                                                        alignItems: "center",
                                                    }}
                                                    onPress={() => {
                                                        //toggleModal("Bill");
                                                        handlePressOpenButton("mobiletest", ['Residential', 'ContactUs'])
                                                    }}
                                                >
                                                    <ChatIcon />
                                                    <Text
                                                        style={[styles.headingTypo, { marginLeft: 10, fontSize: 16 }]}
                                                    >
                                                        Chat
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.issuesFlexBox]} />

                    {showModal && (
                        <ChatSupportModal
                            department={department}
                            onClose={() => toggleModal()}
                        />
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pressableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    textTypoRight: {
        fontFamily: FontFamily.openSansRegular,
        fontWeight: 600,
        fontSize: FontSize.size_base,
        lineHeight: 20,
        color: Color.colorMidnightblue,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F4F4F5',
        backgroundColor: '#F4F4F5',
    },
    iconStyle: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 8,
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
    supportActiveText: {
        color: Color.colorMidnightblue,
        textAlign: "auto",
        lineHeight: 18,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        flex: 1,
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
        paddingBottom: Padding.p_base
    },
    searchChild: {
        flex: 1,
        paddingHorizontal: Padding.p_base,
        paddingVertical: Padding.p_base,
        fontSize: FontSize.size_lg,
        fontFamily: FontFamily.openSansRegular,
        fontWeight: '400'
    },
    search: {
        justifyContent: "center",
        alignSelf: "stretch",
        height: 58,
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
    supportChatText: {
        paddingTop: 5,
        paddingBottom: 5,
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
        alignSelf: 'stretch',
        marginBottom: 280
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
        height: 150,
    },
});

export default Support;
