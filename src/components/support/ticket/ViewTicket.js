import React,{useState,useEffect} from "react";
import { Image, StyleSheet, Text, ScrollView, View, Pressable } from "react-native";
import {
  Padding,
  Border,
  FontSize,
  Color,
  FontFamily,
} from "../../../../GlobalStyles";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { useNavigation } from "@react-navigation/native";
import { GetApiRequest } from "../../../network/APIClient";

const ViewTicket = ({route}) => {
  const navigation = useNavigation();
  const [data,setData]=useState({})

  const getTicketCommnets=(ticketNo)=>{
    const request = `support/api/TicketCommants/${ticketNo}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("getTicketCommnets", res);
        if (res) {
         // setData(res[0]);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  useEffect(()=>{
    let ticketNo=route?.params?.ticketId
    console.log('TicketNo',JSON.stringify(route))
    if(ticketNo){
      const request = `support/api/tickets/${ticketNo}`;
      GetApiRequest(
        request,
        (res) => {
          console.log("getTicketItem", res);
          if (res) {
            setData(res[0]);
            getTicketCommnets(res[0].ticketNumber)
          }
        },
        (error) => {
          console.log(error);
        }
      )
    }

  },[])


  const RenderComments=()=>{
    return(
      <>
      </>
    )
  }


  return (
    <View style={styles.ticketSupport}>
      <ProfileSettingsHeader
        title="View Ticket"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={[styles.ticketSupportInner]}>
          <View style={[styles.frameParent, styles.parentSpaceBlock]}>
            <View style={[styles.ticket101Parent, styles.parentSpaceBlock]}>
              <Text style={styles.ticket101}>Ticket # {data?.ticketNumber}</Text>
              <View style={styles.badgeWrapper}>
                <Pressable style={[styles.closeBtn,styles.badgeBorder]}>
                  <Text style={[styles.text, styles.textTypo]}>Close Ticket</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.frameWrapper}>
              <View style={styles.frameContainer}>
                <View style={styles.frameContainer}>
                  <View style={styles.frameGroup}>
                    <View style={styles.frameWrapperBorder}>
                      <View style={styles.frameParent1}>
                        <View style={styles.rightActionableParent}>
                          <View style={[styles.icon]}></View>

                          <Text style={[styles.agentResponse, styles.pmTypo]}>
                            Agent Response
                          </Text>
                          <Text style={[styles.pm, styles.billingTypo]}>
                            10/06/23 2:12pm
                          </Text>
                        </View>
                        <Text style={[styles.yesYouCan, styles.billingTypo]}>
                          Yes you can set up automatic billing, please do (xyz).
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[styles.frameWrapper2, styles.frameWrapperBorder]}
                    >
                      <View style={styles.frameParent1}>
                        <View style={styles.rightActionableParent}>
                          <View
                            style={[styles.rightActionable, styles.iconLayout]}
                          >
                            <View
                              style={[
                                styles.avatarContrastInnerBorder,
                                styles.homeIndicator1Position,
                              ]}
                            />
                            <Text style={[styles.text1, styles.textTypo]}>
                              MS
                            </Text>
                          </View>
                          <Text style={[styles.agentResponse, styles.pmTypo]}>
                            Melissa Smith
                          </Text>
                          <Text style={[styles.pm, styles.billingTypo]}>
                            10/06/23 11:32am
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.frameWrapper3,
                            styles.frameWrapperSpaceBlock,
                          ]}
                        >
                          <View style={styles.frameParent1}>
                            <Text style={styles.issueType}>Issue Type</Text>
                            <Text style={styles.billingTypo}>Billing</Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.frameWrapper4,
                            styles.frameWrapperSpaceBlock,
                          ]}
                        >
                          <View style={styles.frameParent1}>
                            <Text style={styles.issueType}>
                              Issue Description
                            </Text>
                            <Text style={styles.billingTypo}>
                              Can I set up automatic billing?
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    height: 32,
    width: 32,
  },
  icon: {
    height: 32,
    width: 32,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderColor: Color.sparklightGreen, // Border color from Figma design
    backgroundColor: Color.sparklightGreen, // Background color from Figma design
    borderRadius: Border.br_181xl, // If you need a border radius
    backgroundColor: Color.sparklightGreen, // If the background color is required
    // Remove any additional styles that may distort the original image appearance
  },
  parentSpaceBlock: {
    paddingBottom: Padding.p_5xl,
    paddingTop: Padding.p_base,
    alignSelf: "stretch",
  },
  badgeBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  textTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 18,
  },
  pmTypo: {
    marginLeft: 8,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
  },
  billingTypo: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  frameWrapperBorder: {
    padding: Padding.p_base,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
  },
  homeIndicator1Position: {
    bottom: 0,
    position: "absolute",
  },
  frameWrapperSpaceBlock: {
    paddingTop: Padding.p_5xs,
    alignSelf: "stretch",
  },
  ticket101: {
    fontSize: 22,
    textAlign: "left",
    color: Color.sparklightGray1,
    lineHeight: 28,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  text: {
    color: Color.colorGray_200,
    padding:Padding.p_9xs,
    fontFamily: FontFamily.openSansSemiBold,
  },
  badge: {
    backgroundColor: Color.success50,
    borderColor: Color.colorAquamarine,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignItems: "center",
    flexDirection: "row",
  },
  closeBtn: {
    backgroundColor: Color.colorGainsboro_200,
    borderColor: '#000',
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    
    borderWidth:1,
    alignItems: "center",
    flexDirection: "row",
  },
  badgeWrapper: {
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  ticket101Parent: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  rightActionableIcon: {
    borderRadius: Border.br_181xl,
    backgroundColor: Color.sparklightGreen,
  },
  agentResponse: {
    fontFamily: FontFamily.openSansSemiBold,
    marginLeft: 8,
    fontWeight: "600",
    flex: 1,
  },
  pm: {
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 8,
  },
  rightActionableParent: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  yesYouCan: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  frameParent1: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  avatarContrastInnerBorder: {
    right: 0,
    borderColor: Color.colorGray_200,
    borderWidth: 0.5,
    opacity: 0.08,
    borderRadius: Border.br_181xl,
    borderStyle: "solid",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  text1: {
    marginLeft: -12,
    fontFamily: FontFamily.textXsSemibold,
    width: 24,
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightWhite,
    left: "50%",
    top: "50%",
    marginTop: -9,
    position: "absolute",
  },
  rightActionable: {
    backgroundColor: Color.colorMidnightblue,
    borderRadius: Border.br_181xl,
  },
  issueType: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  frameWrapper3: {
    marginTop: 8,
    justifyContent: "center",
  },
  frameWrapper4: {
    borderBottomRightRadius: Border.br_11xs,
    borderBottomLeftRadius: Border.br_11xs,
    marginTop: 8,
    justifyContent: "center",
  },
  frameWrapper2: {
    marginTop: 16,
  },
  frameGroup: {
    alignSelf: "stretch",
  },
  frameContainer: {
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  frameParent: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  ticketSupportInner: {
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200,
  },
  ticketSupport: {
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
    flex: 1,
    overflow: "hidden",
  },
});

export default ViewTicket;
