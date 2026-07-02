import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Platform,
  Text,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { useSelector } from "react-redux";
import {Title,MenuText, SectionTitle} from "../common/customui/Typography";
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
import { useAnnouncement } from '../../hooks/useAnnouncement';
import PubSub from "pubsub-js";
import base64 from "react-native-base64";
import { startChatWithConfig, startChat } from "../utility/RNZendeskChat";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import { card } from "../../styles/utilities";
import SupportIcon from "../../res/svgIcons/NewSupportIcon";
import RighIcon from "../../../assets/svgs/Chevonright";
import Searchmd from "../../../assets/svgs/Searchmd";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Support = ({ route }) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { triggerOnScreenEntry } = useAnnouncement();
  const [isAgentAvailable, setisAgentAvailable] = useState(false);
  const [istechAgentAvailable, setIstechAgentAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAgentNotAvailable, setIsAgentNotAvailable] = useState(false);

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
      console.warn("Error fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('SupportStack');
      const chatData = route?.params?.chatData;
      checkAgentAvailibilty("1500003304341", chatData);
      checkAgentAvailibilty("1500003312422", chatData);
    }, [triggerOnScreenEntry, route?.params?.chatData])
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

  const items = [
    {
      key: "searchIssues",
      text: "Search",
      accessibilityLabel: "Search Knowledgebase",
      icon: Searchmd,
      iconAlignment: "left", // Icon to the left of the text
      navigateTo: "searchArticals",
    },
    {
      key: "Faqs",
      text: "Getting Started",
      accessibilityLabel: "Getting Started",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the left of the text
      navigateTo: "ArticleWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/articles/21493968056343-How-Do-I-Get-Started-with-the-MySparklight-Mobile-App?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "Billing & Payments",
      accessibilityLabel: "Billing and Payments",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticleWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/sections/22829302944279-Billing?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "Contact Information & Alerts ",
      accessibilityLabel: "Contact Information & Alerts",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticleWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/sections/36871771193623-Profile-Settings?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "Internet Services",
      accessibilityLabel: "Internet Services",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticleWindowUtility",
      url: "https://support.sparklight.com/hc/en-us/categories/115000833068-Internet?isMobile=true",
    },
    {
      key: "moreOptions",
      text: "More...",
      accessibilityLabel: "More Support Options",
      icon: RighIcon,
      iconAlignment: "right", // Icon to the right of the text
      navigateTo: "ArticleWindowUtility",
      url: "https://support.sparklight.com/hc/en-us?isMobile=true",
    },
  ];

  var mySubscriber = function (msg, data) {
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
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.support]}>
        <LinearGradient
          style={[styles.linearGradientStyle, { paddingTop: insets.top + 88 }]}
          locations={[0, 1]}
          colors={["rgba(99, 41, 101, 1)", "rgba(141, 59, 144, 1)"]}
          useAngle={true}
          angle={90}
        />
        <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
      <ZendeskChatIcon />
      </View>
        <View style={[styles.mainContainer]}>
          <View style={[styles.header, { paddingTop: insets.top + 35 }]}>
            <View style={styles.featuredIcon}>
              <SupportIcon white={"#fff"} />
            </View>
            <View
              style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}>
              <Text style={styles.wereHereTo} accessible={true} accessibilityRole="header" accessibilityLevel={1} accessibilityLabel="We're Here to Help" >We’re Here to Help</Text>
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
            <View style={[card.elevated, { marginTop: Padding.p_5xs }]}>
              <View
                style={[
                  styles.headingContainer,
                  styles.headingContainerSpaceBlock,
                ]}
              >
                <Text style={[styles.heading, styles.headingTypo]} accessible={true}accessibilityRole="header" accessibilityLevel={2}>
                Knowledgebase
                </Text>
              </View>
              <View style={styles.frameChild} />
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <Touchable
                    key={index}
                    minSize={0}
                    style={[styles.search, styles.navigationBorder, { alignItems: 'stretch' }]}
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
                        <item.icon />
                      </View>
                      {item.iconAlignment === "right" ? (
                        <Text
                          style={[styles.searchChild, styles.textTypoRight]}
                        >
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
                  </Touchable>
                  {index < items.length - 1 && (
                    <View style={styles.frameChild} />
                  )}
                </React.Fragment>
              ))}
            </View>

            <>
              <View style={[card.elevated, { marginBottom: 150 }]}>
                <View
                  style={[
                    styles.headingContainer,
                    styles.headingContainerSpaceBlock,
                    { flexDirection: "column", paddingHorizontal: 0 },
                  ]}
                >
                  <Text
                    style={[
                      styles.heading,
                      styles.headingTypo,
                      { paddingHorizontal: Padding.p_base },
                    ]}
                    accessible={true}
                    accessibilityRole="header"
                    accessibilityLevel={2}
                  >
                    Contact Us
                  </Text>

                  <View style={styles.separator} />

                  <Touchable
                    minSize={0}
                    style={{ alignItems: 'stretch' }}
                    accessibilityLabel="Sparklight Customer Support"
                    accessibilityRole="button"
                    onPress={() => {
                      navigation.navigate("ArticleWindowUtility", {
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
                            marginTop: 10,
                          },
                        ]}
                      >
                        <RighIcon />
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
                  </Touchable>
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
    </SafeAreaProvider>
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
    width: "100%",
    marginTop: 16,
  },
  iconRight: {
    marginRight: Padding.p_xs,
  },
  containerFlexBox: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  supportIcon: {
    height: 24,
    width: 24,
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
  supportingTypo: {
    lineHeight: 14,
    marginTop: 10,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    color: Color.colorGray_100,
    alignSelf: "stretch",
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
  content: {
    paddingVertical: Padding.p_xl,
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
  },
});

export default Support;
