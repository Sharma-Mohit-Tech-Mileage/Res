import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  TextInput,
} from "react-native";
import {
  Padding,
  Border,
  FontSize,
  Color,
  FontFamily,
} from "../../../../GlobalStyles";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { useNavigation } from "@react-navigation/native";
import {
  GetApiRequest,
  PostApiRequest,
  PutApiRequest,
  UploadMultipartData,
} from "../../../network/APIClient";
import SparkLightButton from "../../common/customui/SparkLightButton";
import moment from "moment";
import DocumentPicker, { types } from "react-native-document-picker";
import AttachmentIcon from "../../../res/svgIcons/AttachmentIcon";
import colors from "../../../res/Colors";

const ViewTicket = ({ route }) => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [myComment, setMyCommnet] = useState("");
  const [comments, setComments] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);
  const [upoadFileKey, setUploadFileKey] = useState([]);

  const getTicketDetails = () => {
    let ticketNo = route?.params?.ticketId;
    if (ticketNo) {
      const request = `support/api/tickets/${ticketNo}`;
      GetApiRequest(
        request,
        (res) => {
          if (res) {
            setData(res[0]);
            getTicketCommnets(res[0].ticketNumber);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const getTicketCommnets = (ticketNo) => {
    const request = `support/api/TicketComments/${ticketNo}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("getTicketCommnets", JSON.stringify(res));
        if (res.length > 0) {
          setComments(res);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    getTicketDetails();
  }, []);

  const uploadFiles = (data) => {
    const request = `support/api/Attachments`;
    UploadMultipartData(
      request,
      data,
      (res) => {
        console.log("Data", res);
        if (res) {
          setUploadFileKey(res);
        }
      },
      (error) => {
        console.log("File Upload Error", error);
      }
    );
  };

  const addNote = () => {
    let ticketNo = route?.params?.ticketId;
    const data = {
      body: myComment,
      ticketId: `${ticketNo}`,
      type: "comment",
      uploads: [`${upoadFileKey}`],
    };

    const request = `support/api/TicketComments`;
    PostApiRequest(
      request,
      data,
      (res) => {
        console.log("Add Note", res);
        getTicketCommnets(ticketNo);
      },
      (error) => {
        console.log("add note error", error);
        getTicketCommnets(ticketNo);
      }
    );
  };

  const closeTicket = () => {
    let ticketNo = route?.params?.ticketId;
    const request = `support/api/Tickets`;
    PutApiRequest(
      request,
      ticketNo,
      (res) => {
        console.log("close ticket", res);
      },
      (error) => {
        console.log("close ticket error", error);
        getTicketDetails();
      }
    );
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [types.pdf, types.plainText, types.images],
      });
      setFileResponse(response);
      uploadFiles(response[0]);
      console.log("File respose:", JSON.stringify(response));
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const RenderComments = () => {
    return (
      <>
        {comments.map((item) => (
          <View key={item.id} style={styles.frameWrapperBorder}>
            <View style={styles.frameParent1}>
              <View style={styles.rightActionableParent}>
                {/* <View style={[styles.icon]}></View> */}
                <Text style={[styles.agentResponse, styles.pmTypo]}>
                  {item.id}
                </Text>
                <Text style={[styles.pm, styles.billingTypo]}>
                  {moment(item.created_at).format("MMM Do YY")}
                </Text>
              </View>
              <Text style={[styles.yesYouCan, styles.billingTypo]}>
                {item.body}
              </Text>
            { item.attachments.length>0 && (
              <Text style={[styles.yesYouCan, styles.billingTypo,{color:Color.colorMidnightblue}]}>
                Attachment: {item.attachments[0].filename}
              </Text>
               )}
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.ticketSupport}>
      <ProfileSettingsHeader
        title="View Ticket"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={[styles.ticketSupportInner]}>
          <View style={[styles.frameParent, styles.parentSpaceBlock]}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={[styles.ticket101Parent, styles.parentSpaceBlock]}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.ticket101}>
                    Ticket # {data?.ticketNumber}
                  </Text>
                  <View style={{ alignSelf: "flex-start", marginTop: 10 }}>
                    <Text
                      style={[
                        styles.text,
                        styles.textTypo,
                        styles.badge,
                        styles.badgeBorder,
                        { color: Color.success700 },
                      ]}
                    >
                      {data?.status}
                    </Text>
                  </View>
                </View>
              </View>
              {data?.status != "Closed" && (
                <Pressable
                  style={[
                    styles.closeBtn,
                    styles.badgeBorder,
                    { height: 30, marginRight: 10, marginTop: 10 },
                  ]}
                  onPress={() => {
                    closeTicket();
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      styles.textTypo,
                      { color: Color.colorMidnightblue },
                    ]}
                  >
                    Close Ticket
                  </Text>
                </Pressable>
              )}
            </View>

            <View style={styles.frameWrapper}>
              <View style={styles.frameContainer}>
                <View style={styles.frameContainer}>
                  <View style={styles.frameGroup}>
                    <View
                      style={[
                        styles.frameWrapper4,
                        styles.frameWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.frameParent1}>
                        <Text style={styles.issueType}>Subject</Text>
                        <Text style={styles.billingTypo}>{data?.subject}</Text>
                      </View>

                      <View style={styles.frameParent1}>
                        <Text style={styles.issueType}>Category</Text>
                        <Text style={styles.billingTypo}>{data?.category}</Text>
                      </View>

                    </View>
                    {data?.status != "close" && (
                      <View style={[{ marginTop: 10 }]}>
                        <Text style={styles.issueType}>Comment</Text>
                        <View style={{ borderWidth: 1 }}>
                          <TextInput
                            placeholder="Comment"
                            onChangeText={(text) => {
                              setMyCommnet(text);
                              //console.log("test", text);
                            }}
                            multiline
                            numberOfLines={5}
                            style={styles.textArea}
                          />
                        </View>

                        <View style={styles.fileContainer}>
                          <Pressable
                            style={styles.fileInnerContainer}
                            onPress={handleDocumentSelection}
                          >
                            <View
                              style={{
                                padding: 20,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View style={{ flexDirection: "row" }}>
                                <AttachmentIcon />
                                <Text style={styles.fileTxt}>
                                  {fileResponse.length > 0
                                    ? `Upload File: ${fileResponse[0].name}`
                                    : "Upload File(Optional)"}
                                </Text>
                              </View>
                              <Text style={styles.fileTxtSub}>
                                Acceptable formats:.pdf,.png, .jpeg, .gif, .txt
                              </Text>
                            </View>
                          </Pressable>
                        </View>
                        {comments.length != 0 && (
                          <View
                            style={{
                              alignSelf: "flex-end",
                              marginVertical: 10,
                            }}
                          >
                            <Pressable
                              style={[styles.BtnContainer,{backgroundColor:(myComment.length>0)?colors.sparklight_purple_blue:colors.grey}]}
                              onPress={() => {
                                if(myComment.length>0){
                                addNote();
                                }
                              }}
                            >
                              <Text style={[styles.Btn,{color:(myComment.length>0)?'white':colors.dark_grey}]}>Add Note</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <RenderComments />
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
  BtnContainer: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
  },
  Btn: {
    color: colors.snow_white,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    padding: 12,
    fontSize: 16,
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
    paddingBottom: Padding.p_5xs,
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
    padding: Padding.p_9xs,
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
    backgroundColor: Color.colorWhitesmoke_300,
    borderColor: Color.sparklightaddGray,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    borderWidth: 1,
  },
  badgeWrapper: {
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  ticket101Parent: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_base,
  },
  rightActionableIcon: {
    borderRadius: Border.br_181xl,
    backgroundColor: Color.sparklightGreen,
  },
  agentResponse: {
    fontFamily: FontFamily.openSansSemiBold,
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
  textArea: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlignVertical: "top",
    padding: Padding.p_xs,
    height: 180,
  },
  fileContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 20,
    marginBottom: 10,
    marginTop: 20,
    flexDirection: "column",
  },
  fileInnerContainer: {
    borderColor: Color.sparklightaddGray,
    borderWidth: 2,
    borderRadius: 10,

    borderStyle: "dashed",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
  },
  fileTxt: {
    color: "black",
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 5,
  },
  fileTxtSub: {
    color: "black",
    fontSize: FontSize.size_xs,
    marginTop: 10,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default ViewTicket;
