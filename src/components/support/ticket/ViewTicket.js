import React, { useState, useEffect, useCallback, useRef} from "react";
import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Pressable,
  TextInput,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  Padding,
  Border,
  FontSize,
  Color,
  FontFamily,
} from "../../../../GlobalStyles";

import FileViewer from "react-native-file-viewer";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { useNavigation,useFocusEffect  } from "@react-navigation/native";
import {
  GetApiRequest,
  PostApiRequest,
  PutApiRequest,
  UploadMultipartData,
} from "../../../network/APIClient";
import ReactNativeBlobUtil from "react-native-blob-util";
import WarningIcon from "../../../../assets/alert-triangle.png";
import moment from "moment";
import DocumentPicker, { types } from "react-native-document-picker";
import AttachmentIcon from "../../../res/svgIcons/AttachmentIcon";
import colors from "../../../res/Colors";
import { Env } from "../../../network/apis/account/Constants";
import LoadingOverlay from "../../common/customui/CustomLoading";
import { getUser } from "../../../redux/utils/LocalStorage";
import { useSelector } from "react-redux";

const ViewTicket = ({ route }) => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [myComment, setMyCommnet] = useState("");
  const [isNoComment, setIsNoComment] = useState(false);
  const [isMaximumFileSize, setIsMaximumFileSize] = useState(false);
  const [comments, setComments] = useState([]);
  const [fileResponse, setFileResponse] = useState([]);
  const [upoadFileKey, setUploadFileKey] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
  const [isCommentLoading,setIsCommentLoading] =useState('')
  const [loadingTxt, setLoadingTxt] = useState("Creating Ticket...");
  const scrollViewRef = useRef(null);
  const user = useSelector((state) => state.combinedReducers.user.userData);

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

  const getTicketCommnets = async (ticketNo) => {
    setIsCommentLoading(true)
    const request = `support/api/TicketComments/${ticketNo}`;
    GetApiRequest(
      request,
      (res) => {
        console.log("getTicketCommnets", JSON.stringify(res));
        if (res.length > 0) {
          setComments(res);
          setIsCommentLoading(false)
        }
      },
      (error) => {
        console.log("GetComments", JSON.stringify(error));
        setIsCommentLoading(false)
      }
    );
  };

  const downloadCommentAttachment = async (item) => {
    setLoadingTxt("Please wait...");
    setLoading(true);
    const request = Env.API_BASEURL + `support/api/attachments/${item.token}`;
    let user = await getUser();

    let dirs = ReactNativeBlobUtil.fs.dirs;
    //var todayTime = Math.round((new Date()).getTime() / 1000);
    ReactNativeBlobUtil.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      //fileCache: true,
      //appendExt: item.filename,

      path: dirs.DocumentDir + "/" + item.filename,
    })
      .fetch("GET", request, {
        Authorization: `Bearer ${user.token}`,
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        setLoading(false);
        console.log("The file saved to ", res.path());
        setTimeout(() => {
          FileViewer.open(res.path(), { showOpenWithDialog: true })
            .then(() => {
              // success
            })
            .catch((error) => {
              // error
            });
        }, 500);
      });
  };

  // useEffect(() => {
  //   getTicketDetails();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getTicketDetails();
    }, [])
  );

  const uploadFiles = (data) => {
    setLoadingTxt("File Uploading...");
    setLoading(true);
    const request = `support/api/Attachments`;
    UploadMultipartData(
      request,
      data,
      (res) => {
        console.log("Data", res);
        if (res) {
          setUploadFileKey(res);
          setLoading(false);
        }
      },
      (error) => {
        console.log("File Upload Error", error);
        setLoading(false);
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
        setMyCommnet("");
        setFileResponse([]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
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
        //getTicketDetails();
        navigation.reset({
          index: 0,
          routes: [{ name: "SupportTicket" }],
        });
      }
    );
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [types.pdf, types.plainText, types.images],
      });

      let fileSize=response[0].size
      var sizeInMB = (fileSize / (1024*1024)).toFixed(2);
      if(sizeInMB<50){
      setIsMaximumFileSize(false)
      setFileResponse(response);
      uploadFiles(response[0]);
      console.log("File respose:", JSON.stringify(response));
      }else{
        setIsMaximumFileSize(true)
       // Alert.alert('Warning', 'Maximum 50 MB file size to allowed')
      }
      
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const capitalizeFirstLetter = (string) => {
    return (
      string != undefined && string.charAt(0).toUpperCase() + string.slice(1)
    );
  };

  const getStatusColor = (status) => {
    let color = "#067647";
    switch (status) {
      case "new":
        color = "#F88700";
        break;
      case "open":
        color = "#EF4E3E";
        break;
      case "pending":
        color = "#8D3B90";
        break;
      case "resolved":
        color = "#067647";
        break;
      case "closed":
        color = "#067647";
        break;
      default:
        color = "#F88700";
    }
    return color;
  };

  useFocusEffect(
    useCallback(() => {
      const firstName = user.userInfo?.firstName || "";
      const lastName = user.userInfo?.lastName || "";

      let initials = "";
      if (firstName.length > 0) {
        initials += firstName.charAt(0).toUpperCase();
      }
      if (lastName.length > 0) {
        initials += lastName.charAt(0).toUpperCase();
      }

      const fullNameCamelCase = [firstName, lastName]
        .map(
          (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        )
        .join(" ");

      setFullName(fullNameCamelCase);
      setInitials(initials);
      return () => {};
    }, [user?.userInfo])
  );

  const RenderComments = () => {
    return (
      <>
        {comments.map((item,index) => (
          <View key={item.id} style={styles.frameWrapperBorder}>
            <View style={styles.frameParent1}>
              <View style={styles.rightActionableParent}>
                <View style={[styles.icon,{backgroundColor:(item.name == "C1ServiceProxy" || index == 0 )?'#353091':Color.sparklightGreen}]}>
                  {item.name == "C1ServiceProxy" || index==0 ? (
                    <Text
                      style={styles.name}
                    >
                      {initials}
                    </Text>
                  ) : (
                    <Image
                      style={{ width: 24, height: 24 }}
                      source={require("../../../../assets/user-01.png")}
                    />
                  )}
                </View>
                <Text style={[styles.agentResponse, styles.pmTypo]}>
                  {item.name == "C1ServiceProxy" || index==0 ? fullName : "Agent Response"}
                </Text>
                <Text
                  style={[
                    styles.pm,
                    styles.billingTypo,
                    { fontSize: 12, color: Color.sparklightaddGray },
                  ]}
                >
                  {moment(item.created_at).format("LT") +
                    " on " +
                    moment(item.created_at).format("MMM, DD, YYYY")}
                </Text>
              </View>
              <Text
                style={[
                  styles.yesYouCan,
                  styles.billingTypo,
                  { color: Color.sparklightGray1 },
                ]}
              >
                {item.body}
              </Text>
              <Pressable
                onPress={() => {
                  //console.log('file',Env.API_BASEURL+item.attachments[0].content_url)
                  // Linking.openURL(
                  //   Env.API_BASEURL + item.attachments[0].content_url
                  // );
                  downloadCommentAttachment(item.attachments[0]);
                }}
              >
                {item.attachments.length > 0 && (
                  <Text
                    style={[
                      styles.yesYouCan,
                      styles.billingTypo,
                      { color: Color.colorMidnightblue },
                    ]}
                  >
                    Attachment: {item.attachments[0]?.filename?.replaceAll('+'," ")}
                  </Text>
                )}
              </Pressable>
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
      <ScrollView ref={scrollViewRef}>
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
                  <View
                    style={{
                      alignSelf: "flex-start",
                      marginTop: 5,
                      backgroundColor: getStatusColor(
                        data?.status?.toLowerCase()
                      ),
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.textTypo,
                        styles.badge,
                        { color: "#FFF" },
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
                  accessibilityLabel="Close Ticket button"
                  //accessibilityHint="Double-tap to close this ticket"
                  accessibilityRole="button"
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
                        <Text style={[styles.billingTypo, styles.melissaTypo]}>
                          {data?.subject}
                        </Text>
                      </View>

                      <View style={styles.frameParent1}>
                        <Text style={styles.issueType}>Category</Text>
                        <Text style={[styles.billingTypo, styles.melissaTypo]}>
                          {capitalizeFirstLetter(data?.category)}
                        </Text>
                      </View>
                    </View>
                    {data?.status != "close" && (
                      <View style={[styles.frameParent1, { paddingTop: 5 }]}>
                        <Text style={styles.issueType}>Comment</Text>
                        <View
                          style={{
                            flexDirection: "column",
                            paddingTop: Padding.p_5xs,
                          }}
                        >
                          <View style={{ borderWidth: 1 }}>
                            <TextInput
                              placeholder="Comment"
                              onChangeText={(text) => {
                                setMyCommnet(text);
                                if (text.length > 0) {
                                  setIsNoComment(false);
                                }
                                //console.log("test", text);
                              }}
                              multiline
                              numberOfLines={5}
                              value={myComment}
                              style={styles.textArea}
                            />
                          </View>
                          {isNoComment && (
                            <View style={styles.errorContainer}>
                              <Image
                                source={WarningIcon}
                                style={styles.errorIcon}
                              />
                              <Text style={styles.errorText}>
                                {"Comment is required"}
                              </Text>
                            </View>
                          )}
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
                                    : "Upload File (Optional)"}
                                </Text>
                              </View>
                              <Text style={styles.fileTxtSub}>
                                Acceptable formats:.pdf,.png, .jpeg, .gif, .txt
                              </Text>
                            </View>
                          </Pressable>
                          {isMaximumFileSize && (
                            <View style={[styles.errorContainer,{marginRight:10}]}>
                              <Image
                                source={WarningIcon}
                                style={styles.errorIcon}
                              />
                              <Text style={styles.errorText}>
                                {"File is larger than the maximum supported file size of 50 MB."}
                              </Text>
                            </View>
                          )}
                        </View>
                        {myComment.length != 0 && (
                          <View
                            style={{
                              alignSelf: "flex-end",
                              marginVertical: 10,
                            }}
                          >
                            <Pressable
                              style={[
                                styles.BtnContainer,
                                {
                                  backgroundColor:
                                    myComment.length > 0 ||
                                    fileResponse.length > 0
                                      ? colors.sparklight_purple_blue
                                      : colors.grey,
                                },
                              ]}
                              onPress={() => {
                                if (myComment.length > 0) {
                                  setIsNoComment(false);
                                  addNote();
                                } else {
                                  setIsNoComment(true);
                                }
                              }}
                            >
                              <Text
                                style={[
                                  styles.Btn,
                                  {
                                    color:
                                      myComment.length > 0 ||
                                      fileResponse.length > 0
                                        ? "white"
                                        : colors.dark_grey,
                                  },
                                ]}
                              >
                                Add Note
                              </Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  {isCommentLoading?
                  <ActivityIndicator
                  size="small"
                  color="#8D3B90"
                  style={[styles.activityIndicator]}
                />:<RenderComments />}
                  
                </View>
              </View>
            </View>
          </View>
          <LoadingOverlay
            loading={loading}
            loadingTxt={loadingTxt}
            onRequestClose={() => {
              setLoading(false);
            }}
          />
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
  },name:{
    fontSize: 14,
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
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
    paddingBottom: Padding.p_8xs,
    paddingTop: Padding.p_8xs,
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
    lineHeight: 20,
  },
  billingTypo: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: "400",
  },
  melissaTypo: {
    color: Color.sparklightGray1,
    lineHeight: 28,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
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
    fontSize: FontSize.size_lg,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "600",
  },
  text: {
    color: Color.colorGray_200,
    padding: Padding.p_9xs,
    fontFamily: FontFamily.openSansSemiBold,
  },
  badge: {
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
    fontWeight: "400",
    flex: 1,
    marginLeft: 5,
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
    paddingVertical: Padding.p_5xs,
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
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4, // Space between the input and the error message
  },
  errorIcon: {
    width: 20,
    height: 20,
    marginRight: Padding.p_xs,
  },
  errorText: {
    color: "red",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },activityIndicator: {
    transform: [{ scale: 2 }],
    marginVertical: 10,
    paddingVertical:5
  },
});

export default ViewTicket;
