import React, { useEffect, useRef, useState, useCallback } from "react";
import { StyleSheet, View, Image, ScrollView, RefreshControl, Platform, Text } from "react-native";

import { Border, Padding, Color, FontSize, FontFamily, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import PubSub from "pubsub-js";
import base64 from "react-native-base64";
import { startChatWithConfig, startChat, } from "../utility/RNZendeskChat";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";

const MyServices = ({ route }) => {
  const navigation = useNavigation();
  // const userData = useSelector((state) => state.combinedReducers.user.userData);
  const scrollViewRef = useRef(null);
  const [isAgentAvailable, setisAgentAvailable] = useState(false);
  const [istechAgentAvailable, setIstechAgentAvailable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAgentNotAvailable, setIsAgentNotAvailable] = useState(false);
  const [plans, setPlans] = React.useState([]);
  const [hasEeroDevice, setHasEeroDevice] = React.useState(false);
  const [networkId, setNetworkId] = React.useState(null);
  const [tvPlan, setTVPlan] = useState('');
  const [phonePlan, setPhonePlan] = useState([]);
  function getPhoneServiceDetails() {
    getUser().then((res) => {
      const request = `phone/api/phones/${res.userInfo.accountNumber}/phonelines`;
      GetApiRequest(request, onSuccessPhonePlan, onError);
    });
  }
  function getPhoneServicePlans(tgcCode) {
    getUser().then((res) => {
      const request = `phone/api/Plans/${tgcCode}`;
      GetApiRequest(request, onFetchedPlan, onError);
    });
  }
  const onFetchedPlan = (res) => {
    setPhonePlan(res);
  }
  const onSuccessPhonePlan = (res) => {
    if (res.length && res[0].tcgCode) {
      getPhoneServicePlans(res[0].tcgCode);
    }
  };
 const getTVServiceDetails = () => {
    getUser().then((res) => {
      const request = `sparklighttv/api/sparklighttv/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(request, onSuccessTVPlan, onError);
    });
  };
  const onSuccessTVPlan = (res) => {
    setTVPlan(res || '');
  };
  const onError = (error) => {
    console.log("error", error);
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

  const fetchNetworkId = async () => {
    try {
      const user = await getUser();
      const accountNumber = user?.userInfo?.accountNumber;
      const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${accountNumber}`;
      GetApiRequest(
        request,
        (response) => {
          const networks = response?.data?.networks;
          if (networks && networks.length > 0) {
            const networkId = networks[0].split("/").pop();
            setHasEeroDevice(!!networkId);
            setNetworkId(networkId || null);
          } else {
            setHasEeroDevice(false);
          }
        },
        (error) => {
          setHasEeroDevice(false);
        }
      );
    } catch (error) {
      setHasEeroDevice(false);
    }
  };

  const getInternetPlanDetails = () => {
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(
        request,
        (response) => {
          setPlans(response);
        },
        (error) => {
          console.error("Error", error);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      checkAgentAvailibilty("1500003304341");
      checkAgentAvailibilty("1500003312422");
      fetchNetworkId();
      getInternetPlanDetails();
      getPhoneServiceDetails();
      getTVServiceDetails();
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
            <Image
              style={[styles.lifeBuoy02IconLayout]}
              resizeMode="stretch"
              //source={require("../../../assets/right-actionable19.png")}
            />
          </View>
          <View style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}>
            <Text style={styles.wereHereTo}>Let's Connect</Text>
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
          {/* {userData?.isNormalUser && (
            <>
              <View
                style={[AppStyles.card, { marginTop: Padding.p_5xs }]}
              >
                <View
                  style={[
                    styles.headingContainer,
                    styles.headingContainerSpaceBlock,
                  ]}
                >
                  <Text style={[styles.heading, styles.headingTypo]}>
                    Equipment Support
                  </Text>
                </View>

                {
                  <Pressable
                    accessible={true}
                    accessibilityLabel={`Sparklight Smart Check`}
                    accessibilityRole="button"
                    style={[
                      styles.integrationCardMobileContainer,
                      styles.contentSpaceBlock,
                    ]}
                    onPress={() => {
                      navigation.navigate("DiagnosticFlow");
                    }}
                  >
                    <View
                      style={[
                        styles.integrationCardMobile1,
                        styles.integrationCardBorder,
                      ]}
                    >
                      <View
                        style={[
                          { paddingVertical: Padding.p_xl },
                          styles.contentSpaceBlock,
                        ]}
                      >
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
                            <Text
                              style={[
                                styles.supportingText,
                                styles.supportingTypo1,
                              ]}
                            >
                              Instant troubleshooting & outage check.
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                }

                <View
                  style={[
                    styles.integrationCardMobileContainer,
                    styles.contentSpaceBlock,
                  ]}
                >
                  <Pressable
                    accessible={true}
                    accessibilityLabel={`Equipment Management`}
                    accessibilityRole="button"
                    style={[
                      styles.integrationCardMobile1,
                      styles.integrationCardBorder,
                    ]}
                    onPress={() => {
                      navigation.navigate("ManageEquipment");
                    }}
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
                  </Pressable>
                </View>
              </View>


              <MyServicePlan
                plans={plans}
                hasEeroDevice={hasEeroDevice}
                networkId={networkId}
                navigation={navigation}
              />
              <MyDataUsage plans={plans} tvPlan={tvPlan} phonePlan={phonePlan} navigation={navigation} />
            </>
          )} */}
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
});

export default MyServices;
