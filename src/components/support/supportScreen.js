import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  ScrollView,
  Linking,
  RefreshControl,
  Platform,
  Text,
  Alert,
  PermissionsAndroid,
} from "react-native";
import { useSelector } from "react-redux";
import {
  Border,
  Padding,
  Color,
  FontSize,
  FontFamily,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import PubSub from "pubsub-js";
import base64 from "react-native-base64";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
//import ZendDesk from '@pagopa/io-react-native-zendesk';

import {
  startChatWithConfig,
  startChat,
} from "../utility/RNZendeskChat";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import AppStyles from "../common/styles/AppStyles";
import SupportIcon from "../../res/svgIcons/NewSupportIcon";
import RighIcon from "../../../assets/svgs/Chevonright";
import Searchmd from "../../../assets/svgs/Searchmd";

const Support = ({ route }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [department, setDepartment] = useState("");
  const userData = useSelector((state) => state.combinedReducers.user.userData);
  const scrollViewRef = useRef(null);
  const [isAgentAvailable, setisAgentAvailable] = useState(false);
  const [istechAgentAvailable, setIstechAgentAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAgentNotAvailable, setIsAgentNotAvailable] = useState(false);

  
  const makeCall = (number) => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
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
    }, 1000);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: `This app requires access to the camera to take photos for chat support.
                If you deny camera access to MySparklight, you can enable it later in Settings.`,
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission granted");
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const result = await check(PERMISSIONS.IOS.CAMERA);
      if (result !== RESULTS.GRANTED) {
        const granted = await request(PERMISSIONS.IOS.CAMERA);
        if (granted === RESULTS.GRANTED) {
          //Alert.alert('Camera permission granted');
        } else {
          Alert.alert(
            "Camera Permission",
            `This app requires access to the camera to take photos for chat support.
                If you deny camera access to MySparklight, you can enable it later in Settings.`,
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
            { cancelable: true }
          );
        }
      } else {
        // Alert.alert('Camera permission already granted');
      }
    }
  };

  const checkAgentAvailibilty = async (group_id, data) => {
    const username = "mobile-support@sparklight.biz/token";
    const password = "ek20PJEI1zZd4sm1LJr3JuYw7ujt1F1ic82b4Jjc";
    const auth = base64.encode(`${username}:${password}`);

    try {
      const response = await fetch(
        `https://cableone.zendesk.com/api/v2/account_groups/availability/${group_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      setRefreshing(false);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = await response.json();
      console.log(
        "Agent is availibility",
        data?.department,
        "Count=" + json.channel_group_statuses.chat.state_counts.online
      );
      console.log("Agent group_id", group_id);
      if (json.channel_group_statuses.chat.state_counts.online > 0) {
        if (group_id == "1500003312422") {
          setisAgentAvailable(true);
          if (data) {
            if (Platform.OS === "ios") {
              startChat(data);
            } else {
              startChatWithConfig(data);
            }
          }
        } else if (group_id == "1500003304341") {
          setIstechAgentAvailable(true);
          if (data) {
            if (Platform.OS === "ios") {
              startChat(data);
            } else {
              startChatWithConfig(data);
            }
          }
        }
      } else {
        if (group_id == "1500003312422") {
          setisAgentAvailable(false);
          if (data) {
            //PromptForAgentOffline()
            setIsAgentNotAvailable(true);
          }
        } else if (group_id == "1500003304341") {
          setIstechAgentAvailable(false);
          if (data) {
            //PromptForAgentOffline()
            setIsAgentNotAvailable(true);
          }
        }
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkAgentAvailibilty("1500003304341");
      checkAgentAvailibilty("1500003312422");
    }, [])
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        if (route.params?.isContactUs) {
          scrollViewRef.current?.scrollTo({ y: 0, x: 0, animated: true });
        }
      }, 500);
    });
    return unsubscribe;
  }, [navigation]);

  //const checkChatAvailability = () => {

  // const now = moment();
  // const nowUTC = now.tz('MST');

  // const currentHour = nowUTC.hour();

  // console.log('Current UTC Hour',currentHour)

  // // Define the time range when chat should be disabled (e.g., 10 PM to 6 AM)
  // const disableStart = 18;  // 10:00 PM
  // const disableEnd = 5;     // 6:00 AM

  // // Check if the current time is within the disabled range
  // if (currentHour >= disableStart || currentHour < disableEnd) {
  //   setisAgentAvailable(true);
  // } else {
  //   setisAgentAvailable(false);
  // }

  // }

  const items = [
    {
      key: "searchIssues",
      text: "Search",
      icon: Searchmd,
      iconAlignment: "left", // Icon to the left of the text
      navigateTo: "searchArticals",
    },
    {
      key: "Faqs",
      text: "FAQs",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the left of the text
      navigateTo: "ArticalWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/articles/18929657224855?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "Billing & Payments",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticalWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/categories/15840476056727-Billing-Payments?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "Internet Service",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticalWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/categories/115000833068-Internet?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "WiFi",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticalWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/categories/115001419607-WiFi?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "More...",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticalWindowUtility",
      url: "https://support.sparklight.com/hc/en-us?isMobile=true",
    },
  ];

  var mySubscriber = function (msg, data) {
    console.log(msg, data);
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (route.params?.isContactUs) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }

    var token = PubSub.subscribe("event.contactUsEvent", mySubscriber);
    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    checkAgentAvailibilty("1500003304341");
    checkAgentAvailibilty("1500003312422");
  };

  const PromptForAgentOffline = () => {
    Alert.alert(
      "Our agents are currently unavailable.",
      "Our agents are currently unavailable. Please reach out during our business hours, and we’ll be happy to assist you.Thank you for your understanding!",
      [
        {
          text: "Ok",
          onPress: () => null,
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handlePressOpenButton = (department, tags) => {
    const data = {
      name: "",
      email:
        userData.userInfo.email !== undefined &&
        userData.userInfo.email !== null
          ? userData.userInfo.email
          : "",
      phone: "2312345678",
      tags: ["pid:_" + userData.userInfo.accountNumber, ...tags],
      department: department,
    };
    if (department == "SPK Virtual Call Center") {
      checkAgentAvailibilty("1500003312422", data);
    } else if (department == "SPK TCC Residential") {
      checkAgentAvailibilty("1500003304341", data);
    }
    //requestCameraPermission();
  };

  return (
    <View style={styles.support}>
      <ProfileSettingsHeader
        title="Support"
        iconAlignment="right"
        showIcon={false}
      />
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
            {/* <Image
              style={[styles.lifeBuoy02IconLayout]}
              resizeMode="stretch"
              source={require("../../../assets/right-actionable19.png")}
            /> */}
            <SupportIcon white={'#fff'}/>
            
          </View>
          <View style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}>
            <Text style={styles.wereHereTo}>We’re Here to Help</Text>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={{ paddingHorizontal: Padding.p_base }}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              title="Pull to refresh"
              tintColor={Color.sparklightBrightPurple}
              titleColor={Color.colorMidnightblue}
            />
          }
        >
          <View style={[AppStyles.card,{marginTop:Padding.p_5xs}]}>
            <View
              style={[
                styles.headingContainer,
                styles.headingContainerSpaceBlock,
              ]}
            >
              <Text style={[styles.heading, styles.headingTypo]}>
                Knowledgebase
              </Text>
            </View>
            <View style={styles.frameChild} />
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <Pressable
                  key={index}
                  style={[styles.search, styles.navigationBorder]}
                  accessible={true}
                  accessibilityLabel={
                    item.text == `More...` ? "More" : item.text
                  }
                  accessibilityRole="button"
                  onPress={() => {
                    if (item.iconAlignment === "left") {
                      navigation.navigate(item.navigateTo);
                    } else {
                      navigation.navigate(item.navigateTo, {
                        url: item.url,
                        name: item.text,
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.pressableContent,
                      item.iconAlignment === "right" && {
                        flexDirection: "row-reverse",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconStyle,
                        item.iconAlignment === "right"
                          ? styles.iconRight
                          : styles.iconLeft,
                      ]}
                    >
                      <item.icon/>
                    </View>
                    {item.iconAlignment === "right" ? (
                      <Text style={[styles.searchChild, styles.textTypoRight]}>
                        {item.text}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          {
                            paddingHorizontal: Padding.p_3xs,
                            color: Color.sparklightGray1,
                            fontSize: FontSize.size_base,
                          },
                        ]}
                      >
                        {item.text}
                      </Text>
                    )}
                  </View>
                </Pressable>
                {index < items.length - 1 && <View style={styles.frameChild} />}
              </React.Fragment>
            ))}
          </View>
         
            <>
              <View
                style={[AppStyles.card,{marginBottom:150}]}
              >
                <View
                  style={[
                    styles.headingContainer,
                    styles.headingContainerSpaceBlock,
                    { flexDirection: "column", paddingHorizontal:0 },
                  ]}
                >
                  <Text style={[styles.heading, styles.headingTypo,{ paddingHorizontal: Padding.p_base}]}>
                    Contact Us
                  </Text>

                  <View style={styles.separator} />

                  <Pressable
                    accessibilityLabel="Sparklight Customer Support"
                    accessibilityRole="button"
                    onPress={() => {
                      navigation.navigate("ArticalWindowUtility", {
                        url: "https://support.sparklight.com/hc/en-us/articles/26787209205911-SPARKLIGHT-CUSTOMER-SUPPORT?isMobile=true",
                        name: "Sparklight Customer Support",
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: Padding.p_base,
                      }}
                    >
                      <View
                        style={[
                          {
                            width: 20,
                            height: 20,
                            alignSelf: "center",
                            resizeMode: "contain",
                            marginTop:10
                          },
                        ]}
                      >
                        <RighIcon/>
                      </View>
                      <Text
                        style={[
                          styles.textTypoRight,
                          { paddingVertical: Padding.p_xs, marginTop: 10 },
                        ]}
                      >
                        {"Sparklight Customer Support"}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </>
          
          <CustomerErrorPage
            visible={isAgentNotAvailable}
            message={
              "Our agents are currently unavailable. Please reach out during our business hours, and we’ll be happy to assist you.Thank you for your understanding!"
            }
            title={"Agent Unavailibity"}
            onActionTxt={"OK"}
            onAction={() => {
              setIsAgentNotAvailable(false);
            }}
            onClose={undefined}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
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
  separator: {
    backgroundColor: Color.sparklightGray,
    height: 1,
    width: '100%',
    marginTop: 16,
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
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F4F4F5",
    backgroundColor: "#F4F4F5",
  },
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 8,
  },
  chatbuttonBg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Color.colorMidnightblue,
    padding: 8,
    borderRadius: 5,
  },
  chatButtonText: {
    marginLeft: 10,
    color: Color.sparklightWhite,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansRegular,
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
  headingText: {
    textAlign: "auto",
    color: Color.colorGray_100,
    lineHeight: 18,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansRegular,
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
    lineHeight: 22,
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
    overflow: "hidden",
  },
  header: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingBottom: Padding.p_base,
  },
  searchChild: {
    flex: 1,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_base,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
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
    paddingTop: 2,
    paddingBottom: 2,
  },
  supportingText4: {
    lineHeight: 20,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    flex: 1,
  },
  supportingTextWrapper: {
    marginVertical: 15,
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
  },
  supportingText5: {
    color: Color.sparklightDarkGray,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
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
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
    marginBottom: 280,
  },
  support: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  cardHreader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width: wp("92%"),
    padding: 10,
  },
  cardFooter: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    padding: 10,
    alignItems: "center",
  },
});

export default Support;
