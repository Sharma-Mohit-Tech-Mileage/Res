import React, { useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  ScrollView,
  Pressable,
} from "react-native";
import {
  Padding,
  FontFamily,
  FontSize,
  Color,
  Border,
} from "../../../../GlobalStyles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import SparkLightDropdown from "../../../components/common/customui/SparkLightDropdown";
import PrimaryButtom from "../../common/customui/PrimaryButton";
import { useSelector } from 'react-redux';
import colors from "../../../res/Colors";
import { useNavigation } from "@react-navigation/native";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { userTicketSchema } from "../../utility/validationSchema";
import WarningIcon from "../../../../assets/alert-triangle.png";
import {
  UploadMultipartData,
  PostApiRequest,
} from "../../../network/APIClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import DocumentPicker, { types } from "react-native-document-picker";
import AttachmentIcon from "../../../res/svgIcons/AttachmentIcon";
import LoadingOverlay from "../../common/customui/CustomLoading";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SparkLightMobileInputField from "../../common/customui/SparklightMobileInputField";

const CreateTicket = () => {
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  const categories = ["Bill", "Support"];
  const [fileResponse, setFileResponse] = useState([]);
  const [upoadFileKey, setUploadFileKey] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTxt, setLoadingTxt] = useState("Creating Ticket...");
  var Data = {
    subject: "",
    comment: "",
    email: profileDetails.multipleEmails ? '' : profileDetails.svEmailAddress,
    accountNumber: "",
    category: "",
    uploads: [],
    PhoneNumber: ''
  };

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userTicketSchema()),
    defaultValues: Data,
  });

  const handleSave = (formData) => {
    setLoadingTxt("Creating Ticket...")
    setLoading(true);
    if (upoadFileKey.length>0) {
      formData?.uploads.splice(0, 0, upoadFileKey);
    }
    getUser().then((res) => {
      formData.accountNumber = res.userInfo.accountNumber;
      const request = `support/api/Tickets`;
      PostApiRequest(
        request,
        formData,
        (res) => {
          navigation.goBack();
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
        (error) => {}
      );
    });
  };

  const uploadFiles = (data) => {
    setLoadingTxt("File Uploading...")
    setLoading(true)
    const request = `support/api/Attachments`;
    UploadMultipartData(
      request,
      data,
      (res) => {
        console.log("Data", res);
        if (res) {
          setUploadFileKey(res);
          setLoading(false)
        }
      },
      (error) => {
        console.log("File Upload Error", error);
        setLoading(false)
      }
    );
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: "fullScreen",
        type: [types.pdf, types.plainText, types.images],
      });
      if (response.length > 0) {
        setFileResponse(response);
        uploadFiles(response[0]);
      }
      console.log("File respose:", JSON.stringify(response));
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const handleValidationError = () => {
    //scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    // setShowValidationAlert(true);
  };

  return (
    <View style={{ backgroundColor: colors.backgound_blue, flex: 1 }}>
      <View style={styles.ticketSupportNone}>
        <ProfileSettingsHeader
          title="Create Ticket"
          onPressBack={() => navigation.goBack()}
        />

        <ScrollView >
          <View style={{ flexDirection: "column", paddingBottom: hp("40%") }}>
            <View style={[styles.innerContainer]}>
              <View style={[styles.frameParent]}>
                <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
                  <View style={styles.ticketsParent}>
                    <Text style={styles.tickets}>Tickets Details</Text>
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.textView}>
                      <Text style={[styles.text,{paddingBottom:8}]}>Subject</Text>
                    </View>
                    <Controller
                      control={control}
                      name="subject"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <SparkLightInput
                            onBlur={onBlur}
                            placeholder={"Subject"}
                            onChangeText={onChange}
                            value={value}
                            error={error?.message}
                          />
                        </>
                      )}
                    />
                  </View>

                  <View style={styles.frameWrapper}>
                    <View style={styles.textView}>
                      <Text style={styles.text}>Category</Text>
                      </View>
                      <Controller
                        control={control}
                        name="category"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <SparkLightDropdown
                              items={categories}
                              selectedValue={selectedItem}
                              onValueChange={onChange}
                              error={error?.message}
                            />

                            {error && (
                              <View style={styles.errorContainer}>
                                <Image
                                  source={WarningIcon}
                                  style={styles.errorIcon}
                                />
                                <Text style={styles.errorText}>
                                  {error?.message}
                                </Text>
                              </View>
                            )}
                          </>
                        )}
                      />
                  </View>
                  <View style={styles.frameWrapper}>
                    <View style={styles.textView}>
                      <Text style={styles.text}>Issue Description</Text>
                    </View>
                    
                      <Controller
                        control={control}
                        name="comment"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <View style={[ { marginTop: 10 }]}>
                            <TextInput
                              placeholder="Issue Description"
                              onChangeText={onChange}
                              multiline
                              numberOfLines={5}
                              style={[styles.textArea,styles.frameBorder]}
                            />

                            {error && (
                              <View style={styles.errorContainer}>
                                <Image
                                  source={WarningIcon}
                                  style={styles.errorIcon}
                                />
                                <Text style={styles.errorText}>{error.message}</Text>
                              </View>
                            )}
                         </View>
                        )}
                      />
                    
                  </View>

                  <View style={styles.frameWrapper}>
                    <View style={styles.textView}>
                      <Text style={[styles.text,{paddingBottom:8}]}>Email</Text>
                    </View>
                    <Controller
                      control={control}
                      name="email"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <SparkLightInput
                          placeholder="Email Address"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value ? value.toLowerCase() : ""}
                          error={error?.message}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.frameWrapper}>
                    <View style={styles.textView}>
                      <Text style={[styles.text,{paddingBottom:8}]}>Phone Number (Optional)</Text>
                    </View>
                    <Controller
                      control={control}
                      name="PhoneNumber"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <SparkLightMobileInputField
                          placeholder="Phone Number"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          
                          error={error?.message}
                        />
                      )}
                    />
                  </View>

                </View>
                <View style={styles.fileContainer}>
                  <Pressable
                    style={styles.fileInnerContainer}
                    onPress={handleDocumentSelection}
                  >
                    <View
                      style={{
                        padding: 10,
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
              </View>
              <LoadingOverlay
                loading={loading}
                loadingTxt={loadingTxt}
                onRequestClose={() => {
                  setLoading(false);
                }}
              />
            </View>

            <View style={{ width: "90%", alignSelf: "center" }}>
              <PrimaryButtom
                title="Submit"
                onPress={handleSubmit(handleSave)}
                buttonType="submit"
              />
            </View>
            <View>
              <Pressable
                style={[styles.buttons2, styles.buttonsLayout]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.makePayment2, styles.makeTypo]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketSupportNone: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  innerContainer: {
    flexDirection: "column",
    marginVertical: Padding.p_5xl,
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
  },
  buttons2: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  makePayment2: {
    color: Color.colorMidnightblue,
  },
  buttonsLayout: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  buttons: {
    padding: Padding.p_base,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 32,
    display: "none",
    backgroundColor: Color.colorWhitesmoke_200,
  },
  makeTypo: {
    width: 282,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  frameGroupSpaceBlock: {
    paddingTop: Padding.p_8xs,
  },
  frameParent: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_5xl,
  },
  frameGroup: {
    //flex: 1,
    borderColor: Color.sparklightGray1,
    borderRadius: Border.br_11xs,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  textView: {
    display: "flex", // By default, display is flex in React Native
    flexDirection: "column", // Children are arranged in a column
    justifyContent: "center", // Children are centered vertically
    alignSelf: "stretch", // The element itself stretches to fill its container
    // width: 98.05
  },
  text: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular, // Ensure this font is loaded in your project
    fontSize: FontSize.textXsSemibold_size, // The font size from Figma
    fontWeight: "600", // The font weight from Figma
  },
  ticketsParent: {
    flexDirection: "row",
    alignItems: "center",

    paddingBottom: Padding.p_5xl,
  },
  tickets: {
    fontSize: FontSize.size_3xl,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
  },
  featuredIcon: {
    borderRadius: 24,
  },

  noTicketsCreated: {
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
  },
  createATicket: {
    color: Color.sparklightDarkGray,
    fontSize: FontSize.size_sm,
  },
  featuredIconParent: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameView: {
    //flex: 1, // This makes the view flexible in a flex container
    height: 180, // Set the height to 180 pixels
    paddingVertical: Padding.p_5xs, // Top and bottom padding of 8 pixels
    paddingHorizontal: Padding.p_xs, // Left and right padding of 12 pixels
    flexDirection: "column", // Layout the children in a column
    alignItems: "flex-start", // Align children to the start of the cross axis
    alignSelf: "stretch", // Stretch to the parent's cross size
  },
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.colorGray_100,
    borderRadius: Border.br_11xs,
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_5xs,
    paddingBottom: Padding.p_13xl,
  },
  frameChild: {
    marginTop: 10,
    borderRadius: Border.br_11xs,
    height: 24,
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
  },
  textArea: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlignVertical: "top",
    padding: Padding.p_xs,
    height: 150,
  },
  fileContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 20,
    marginBottom: 10,
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

export default CreateTicket;
