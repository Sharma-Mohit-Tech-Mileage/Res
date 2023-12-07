import * as React from "react";
import { StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, FontSize, Color, FontFamily, Border } from "../../../GlobalStyles";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader'

const ProfileSettingsEdit = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.profileSettingsEdit}>
      <ProfileSettingsHeader
        title="Edit Profile"
        onPressBack={() => navigation.navigate('ProfileSettings')}
      />
      <ScrollView >
        <View style={[styles.profileSettingsEditInner]}>
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <View style={[styles.generalInformationWrapper, styles.informationWrapperFlexBox]}>
              <Text style={styles.generalInformation} >
                General Information
              </Text>
            </View>
            <View style={styles.frameParent}>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    First Name
                  </Text>
                  <View >
                    <SparkLightInput placeholder="Enter text here" />
                  </View>
                </View>
              </View>
              <View
                style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Last Name
                  </Text>
                  <View >
                    <SparkLightInput placeholder="Enter text here" />
                  </View>
                </View>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View />
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Username
                  </Text>
                  <View >
                    <SparkLightInput placeholder="Enter text here" />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.rectangleWrapper}>
              <View style={styles.frameItem} />
            </View>
            <View style={{ marginTop: Padding.p_base }}>
              <View style={[styles.contactInformationWrapper, styles.informationWrapperFlexBox]}>
                <Text style={styles.generalInformation}>
                  Contact Information
                </Text>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>
                    Email
                  </Text>
                  <View >
                    <SparkLightInput placeholder="Enter text here" />
                  </View>
                </View>
              </View>
              <View style={[styles.textinputWrapper, styles.frameGroupSpaceBlock]}>
                <View style={styles.textinput}>
                  <Text style={[styles.firstTypo]}>Phone</Text>
                  <View ><SparkLightInput placeholder="Enter text here" />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: Padding.p_base }}>
            <Pressable style={[{ backgroundColor: Color.colorMidnightblue }, styles.buttonsLayout]} onPress={() => navigation.navigate("ProfileSettings")}>
              <Text style={[{ color: Color.sparklightWhite }, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable style={[styles.buttonsLayout]} onPress={() => navigation.navigate("ProfileSettings")}>
              <Text style={[styles.makeTypo, { color: Color.colorMidnightblue }]}>Cancel</Text>
            </Pressable>
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
    color: Color.sparklightaddGray,
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
  profileSettingsEditInner: {
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 200,
  },
  profileSettingsEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default ProfileSettingsEdit;
