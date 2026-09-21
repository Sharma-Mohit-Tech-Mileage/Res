import React, { useRef, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Touchable from "../common/customui/Touchable";
import { useSelector } from "react-redux";
import {
  Border,
  Padding,
  Color,
  FontSize,
  FontFamily,
  Alert,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { hp } from "../../utils/responsive";

import CustomerErrorPage from "../utility/SystemErrorPopup";
import SupportIcon from "../../res/svgIcons/NewSupportIcon";
import RighIcon from "../../../assets/svgs/Chevonright";
import Searchmd from "../../../assets/svgs/Searchmd";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import {Title,MenuText, SectionTitle} from "../common/customui/Typography";
import AppStyles from "../../styles/AppStyles";
import { ScreenScroll } from "../common/customui/Screen";

const Support = ({ route }) => {
  const navigation = useNavigation();
  const [isAgentNotAvailable, setIsAgentNotAvailable] = useState(false);
  const scrollViewRef = useRef(null);
  
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

  
   React.useEffect(() => {
       const unsubscribe = navigation.addListener("focus", () => {
         // The screen is focused
         // Call any action
         setTimeout(() => {
           if (route.params?.isContactUs) {
             scrollViewRef.current?.scrollTo({ y: 200, x: 0, animated: true });
           }else{
            scrollViewRef.current?.scrollTo({ y: 0, x: 0, animated: true });
           }
         }, 500);
       });
   
       // Return the function to unsubscribe from the event so it gets removed on unmount
       return unsubscribe;
     }, [navigation]);



  
  return (
    <View style={styles.support}>
      <ProfileSettingsHeader
        title=""
        iconAlignment="right"
        showIcon={false} // New prop to control icon visibility
      />

      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.3, y: 0}}
        colors={["rgba(141, 59, 144, 1)", "rgba(53, 48, 145, 1)"]}
      />
      <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
        <ZendeskChatIcon  screenName="Support" />
      </View>
      <View style={[styles.mainContainer]}>
        <View style={[styles.containerFlexBox]}>
          <View style={styles.header}>
            <View style={styles.featuredIcon}>
              {/* <Image
                style={[styles.lifeBuoy02IconLayout]}
                resizeMode="contain"
                tintColor={"#FFF"}
                source={require("../../../assets/phone-outgoing-03.png")}
              /> */}
              <SupportIcon white={'#fff'}/>
            </View>
            <View
              style={[styles.wereHereToHelpWrapper, styles.containerFlexBox]}
            >
              <Title style={styles.wereHereTo} accessible={true} accessibilityRole="header" accessibilityLevel={1} accessibilityLabel="Let's Connect!">Let's Connect!</Title>
            </View>
          </View>
          <ScreenScroll
            style={{ width: "100%", padding: Padding.p_base,marginBottom:hp('42%') }}
            ref={scrollViewRef}
           
          >
          
              <View style={styles.supportCard}>
                <View
                  style={[
                    styles.headingContainer,
                    styles.headingContainerSpaceBlock,
                  ]}
                >
                  <SectionTitle style={{flex: 1}} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Knowledgebase">
                    Knowledgebase
                  </SectionTitle>
                </View>
                <View style={styles.frameChild} />
                {items.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <Touchable
                      key={index+item.key}
                      minSize={0}
                      style={[styles.search, styles.navigationBorder, { alignItems: 'stretch' }]}
                      accessibilityRole="button"
                      accessibilityLabel={item.accessibilityLabel}
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
                      <View style={styles.pressableContent}>
                        {item.iconAlignment === "left" && (
                          <View
                            style={[
                              styles.iconStyle,
                              styles.iconLeft,
                            ]}
                          >
                            <item.icon />
                          </View>
                        )}
                        <MenuText
                          style={
                            item.iconAlignment === "right"
                              ? [styles.searchChild, styles.textTypoRight]
                              : [
                                  {
                                    paddingHorizontal: Padding.p_3xs,
                                  },
                                ]
                          }
                        >
                          {item.text}
                        </MenuText>
                        {item.iconAlignment === "right" && (
                          <View style={styles.rightIconLayout}>
                            <item.icon />
                          </View>
                        )}
                      </View>
                    </Touchable>
                    {index < items.length - 1 && (
                      <View key={index + 1} style={[styles.frameChild]} />
                    )}
                  </React.Fragment>
                ))}
              </View>
              
            
              <View style={[styles.supportCardWithSpacing]}>
                <View
                  style={[
                    styles.headingContainer,
                    styles.headingContainerSpaceBlock,
                    { flexDirection: "column",paddingHorizontal:0 },
                  ]}
                >
                  <SectionTitle style={[{  paddingHorizontal: Padding.p_5xl}]} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Contact Us">
                    Contact Us
                  </SectionTitle>
                  <View style={styles.separator} />
                  <Touchable
                    minSize={0}
                    style={[styles.search, styles.navigationBorder, { alignItems: 'stretch' }]}
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
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingRight: Padding.p_5xl,
                        marginTop: Padding.p_3xs,
                      }}
                    >
                      <MenuText
                        style={[
                          styles.textTypoRight,
                          { paddingVertical: Padding.p_xs, paddingHorizontal: Padding.p_5xl },
                        ]}
                      >
                        {"Sparklight Customer Support"}
                      </MenuText>
                      <View style={[styles.rightIconLayout]}> 
                        <RighIcon />
                      </View>
                    </View>
                  </Touchable>
                </View>
              </View>
           
          
            
            
            <CustomerErrorPage
              visible={isAgentNotAvailable}
              message={
                "Our agents are currently unavailable. Please reach out during our business hours, and we’ll be happy to assist you. Thank you for your understanding!"
              }
              title={"Agent Unavailibity"}
              onActionTxt={"OK"}
              onAction={() => {
                setIsAgentNotAvailable(false);
              }}
              onClose={undefined}
            />
          </ScreenScroll>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressableContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingLeft: Padding.p_5xl,
    paddingRight: Padding.p_5xl,
  },
  textTypoRight: {
    lineHeight: 20,
  },rightIconLayout: {
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
  }, 
  frameChild: {
    paddingHorizontal: Padding.p_5xl,
    height: 1,
    width: "100%",
    backgroundColor: Color.sparklightGray,
  },
  navigationBorder: {
   
    borderStyle: "solid",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: Padding.p_3xs,
  },
  iconRight: {
    marginRight: Padding.p_5xs,
  },
  containerFlexBox: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  lifeBuoy02IconLayout: {
    height: 32,
    width: 32,
  },
  iconStyle: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headingContainerSpaceBlock: {
    paddingBottom: Padding.p_base,
    alignItems: "flex-start",
  },
  headingTypo: {
    textAlign: "auto",
    color: Color.colorGray_100,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaRegular,
    flex: 1,
  },
  featuredIcon: {
    backgroundColor: Color.colorMidnightblue,
    borderColor: Color.Gray300,
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
    width: 210,
    lineHeight: 28,
    paddingBottom: Padding.p_5xs,
    textAlign: "center",
  },
  wereHereToHelpWrapper: {
    justifyContent: "center",
    overflow: "hidden",
  },
  header: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  searchChild: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_base,
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
    paddingHorizontal: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    flexDirection: "row",
   
   
  },
  mainContainer: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    
  },
  support: {
    flex: 1,
    backgroundColor: Color.Gray300,
    width: "100%",
  },
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  separator: {
    backgroundColor: Color.sparklightGray,
    height: 1,
    width: '100%',
    marginTop: 16,
  },
  supportCard: {
    ...AppStyles.card,
   
  },
  supportCardWithSpacing: {
    ...AppStyles.card,
    marginTop: 16,
    marginBottom: 150,
    

  },
});

export default Support;
