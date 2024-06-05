import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  Text,
  View,
  Keyboard,
  ScrollView,
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

import colors from "../../../res/Colors";
import { useNavigation } from "@react-navigation/native";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { userTicketSchema } from "../../utility/validationSchema";

const CreateTicket = () => {
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState();
  const [email, setEmail] = useState("");
  const categories = ["Bill", "Support"];

  var Data = {
    accountNumber: "",
    subject: "",
    category: "",
    comment: "",
    email: "",
    upload: [],
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

  const onChangeText = (text) => {
    setEmail(text);
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={{ backgroundColor: colors.backgound_blue, flex: 1 }}>
      <View style={styles.ticketSupportNone}>
        <ProfileSettingsHeader
          title="Create Ticket"
          onPressBack={() => navigation.navigate("support")}
        />

        <ScrollView>
          <View style={styles.innerContainer}>
            <View style={styles.frameParent}>
              <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
                <View style={styles.ticketsParent}>
                  <Text style={styles.tickets}>Tickets Details</Text>
                </View>
                <View style={styles.frameWrapper}>
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
                          label={"Subject"}
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
                    <Controller
                      control={control}
                      name="subject"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <SparkLightDropdown
                            items={categories}
                            selectedValue={selectedItem}
                            onValueChange={() => {}}
                            dropDownStyle={{ color: Color.sparklightDarkGray }}
                          />
                        </>
                      )}
                    />
                  </View>
                </View>
                <View style={styles.frameWrapper}>
                  <View style={styles.textView}>
                    <Text
                      style={[styles.text, { marginBottom: Padding.p_5xs }]}
                    >
                      Describe Issue
                    </Text>
                  </View>
                  <View style={styles.frameBorder}>
                    <Controller
                      control={control}
                      name="comment"
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextInput
                            style={{
                              textAlignVertical: "top",
                              color: "black", // Or any visible color
                              fontSize: 16, // Or appropriate size
                            }}
                            multiline={true}
                            numberOfLines={6}
                            minHeight={FontSize.size_base * 6 + 16}
                          />
                        </>
                      )}
                    />
                  </View>
                </View>

                <View style={styles.frameWrapper}>
                  <View style={styles.textView}>
                    <Text
                      style={[styles.text, { marginBottom: Padding.p_5xs }]}
                    >
                      Email
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SparkLightInput
                        placeholder="Email Address"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value.toLowerCase() : ""}
                        error={errors.email?.message}
                      />
                    )}
                  />
                </View>
              </View>
              <View>
                <PrimaryButtom
                  title="Submit"
                  //onPress={() => navigation.navigate("TicketView")}
                  buttonType="submit"
                />
              </View>
              <View>
                <PrimaryButtom
                  title="Cancel"
                  //onPress={() => navigation.navigate("TicketSupport")}
                  buttonType="cancel"
                />
              </View>
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
});

export default CreateTicket;
