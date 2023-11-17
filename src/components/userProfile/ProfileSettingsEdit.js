import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader'

const ProfileSettingsEdit = () => {
  const [firstName, setFirstName] = useState('Melissa');
  const [lastName, setLastName] = useState('Melissa');
  const [username, setUsername] = useState('MelSmith');
  const [email, setEmail] = useState('melissa@gmail.com');

  const navigation = useNavigation();

  return (
      <View style={styles.profileSettingsEdit}>
        <ProfileSettingsHeader
          title="Edit Profile"
          onPressBack={() => navigation.navigate('ProfileSettings')}
          accessible={true}
          accessibilityLabel="Edit Profile Header"
          accessibilityRole="header"
          accessibilityHint="Navigate back to profile settings"
        />
      <ScrollView accessible={true} accessibilityLabel="Profile settings edit screen">
        <View style={[styles.profileSettingsEditInner]}>
          <View style={styles.frameParent}>
            <View style={styles.frameParent}>
              <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
                <View
                  style={[
                    styles.generalInformationWrapper,
                    styles.informationWrapperFlexBox,
                  ]}
                >
                  <Text style={styles.generalInformation} accessibilityRole="header">
                    General Information
                  </Text>
                </View>
                <View style={styles.frameParent}>
                  <View style={styles.frameParent}>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.frameGroupSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstTypo]}>
                          First Name
                        </Text>
                        <View >
                          <SparkLightInput
                            placeholder="Enter text here"
                            accessible={true}
                            accessibilityLabel="First Name Input"
                            //accessibilityRole="textbox"
                            accessibilityHint="Edit your first name"
                          // onChangeText={handleTextChange}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.frameGroupSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstTypo]}>
                          Last Name
                        </Text>
                        <View >
                          <SparkLightInput
                            placeholder="Enter text here"
                            accessible={true}
                            accessibilityLabel="Last Name Input"
                            //accessibilityRole="textbox"
                            accessibilityHint="Edit your last name"
                          // onChangeText={handleTextChange}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.frameGroupSpaceBlock,
                      ]}
                    >
                      <View />
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstTypo]}>
                          Username
                        </Text>
                        <View >
                          <SparkLightInput
                            placeholder="Enter text here"
                            accessible={true}
                            accessibilityLabel="Username Input"
                           // accessibilityRole="textbox"
                            accessibilityHint="Edit your username"
                          // onChangeText={handleTextChange}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.rectangleWrapper}>
                    <View style={styles.frameItem} />
                  </View>
                  <View style={styles.frameParent2}>
                    <View
                      style={[
                        styles.contactInformationWrapper,
                        styles.informationWrapperFlexBox,
                      ]}
                    >
                      <Text style={styles.generalInformation}>
                        Contact Information
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.frameGroupSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstTypo]}>
                          Email
                        </Text>
                        <View >
                          <SparkLightInput
                            placeholder="Enter text here"
                            accessible={true}
                            accessibilityLabel="Contact Username Input"
                            //accessibilityRole="textbox"
                            accessibilityHint="Edit your contact username"
                          // onChangeText={handleTextChange}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.frameParent2}>

              <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={() => navigation.navigate("ProfileSettings")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Save button"
                accessibilityHint="Press to save changes"
              >
                <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.buttons1, styles.buttonsLayout]}
                onPress={() => navigation.navigate("ProfileSettings")}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Cancel button"
                accessibilityHint="Press to cancel changes"
              >
                <Text style={[styles.makePayment1, styles.makeTypo]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  frameGroupSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  informationWrapperFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  firstTypo: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  buttonsLayout: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    lineHeight: 28,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  generalInformationWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  textinput: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  textinputWrapper: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParent: {
    alignSelf: "stretch",
  },
  frameItem: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    paddingVertical: 0,
    marginTop: 16,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  contactInformationWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParent2: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  frameGroup: {
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    paddingVertical: Padding.p_base,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  makePayment: {
    color: Color.sparklightWhite,
    width: 282,
  },
  buttons: {
    backgroundColor: Color.sparkLightPurple,
  },
  makePayment1: {
    color: Color.sparkLightPurple,
  },
  buttons1: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
    width: 382,
  },
  profileSettingsEditInner: {
    top: 100,
    height: '100%',
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 200,
  },
  profileSettingsEdit: {
    zIndex: 1,
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default ProfileSettingsEdit;
