import * as React from "react";
import { Image, StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, FontFamily, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";

const ProfileSettings = () => {
  const navigation = useNavigation();
  return (
    <View style={{ zIndex: 1 }}>
      <ProfileSettingsHeader
        title="Profile Settings"
        onPressBack={() => navigation.navigate('Account')}
        accessibilityHint="Navigate back to the Account page."
      />
      <ScrollView accessibilityLabel="Profile settings page.">
        <View style={styles.frameParent}>
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <View style={[styles.generalInformationParent]}
              accessible={true}
              accessibilityLabel="General Information section."
            >
              <Text style={[styles.generalInformation, styles.melissaTypo]}>
                General Information
              </Text>
              <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={() => navigation.navigate("ProfileSettingsEdit")}
                accessibilityRole="button"
                accessibilityLabel="Edit General Information"
              >
                <Text style={[styles.makePayment, styles.text1Clr]}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.frameContainer}>
              <View style={styles.frameContainer}>
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel="First Name: Melissa">
                  <Text style={styles.firstName}>First Name</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    Melissa
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Last Name: Smith">
                  <Text style={styles.firstName}>Last Name</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>Smith</Text>
                </View>
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Username: MelSmith">
                  <Text style={styles.firstName}>Username</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    MelSmith
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Member Type: PRIMARY ADMIN">
                  <Text style={styles.firstName}>Member Type</Text>
                  <View style={styles.badgeWrapper}>
                    <View style={[styles.badge, styles.badgeBorder]}>
                      <Text style={[styles.text, styles.textTypo]}>
                        PRIMARY ADMIN
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.notificationsWrapper}>
                  <View style={[styles.notifications, styles.badgeBorder]}>
                    <Image
                      style={styles.notificationsChild}
                      resizeMode="cover"
                      source={require("../../../assets/rectangle-528.png")}
                      accessibilityLabel="Notification image."
                    />
                    <View style={styles.bannerWarning}>
                      <View style={styles.rightActionableParent}>
                        <Image
                          style={styles.rightIconLayout}
                          resizeMode="cover"
                          source={require("../../../assets/right-actionable3.png")}
                          accessibilityLabel="Right actionable icon."
                        />
                        <View style={styles.creditCardWillExpireSoonParent}>
                          <Text style={styles.creditCardWill} accessible={true} 
                          accessibilityLabel="Primary Admin Notification">Primary Admin</Text>
                          <Text style={[styles.yourSavedCard]} accessible={true} accessibilityLabel="Primary admin account information.">
                            You are currently the primary admin
                            account. You can make another account
                            the primary admin account. By doing so
                            you will become an admin user under the
                            new primary admin account.
                          </Text>
                        </View>
                      </View>
                      <Image
                        style={[
                          styles.rightActionableIcon1,
                          styles.rightIconLayout,
                        ]}
                        resizeMode="cover"
                        source={require("../../../assets/right-actionable1.png")}
                        accessibilityLabel="Right actionable icon."
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={[styles.rectangleWrapper, styles.frameParent1SpaceBlock]}
              >
                <View style={styles.frameChild} />
              </View>
              <View style={styles.frameParent1SpaceBlock}>
                <View style={styles.contactInformationWrapper}>
                  <Text style={[styles.generalInformation, styles.melissaTypo]}>
                    Contact Information
                  </Text>
                </View>
                <View style={styles.firstNameParent} accessible={true} accessibilityLabel="Email: melissa@gmail.com">
                  <Text style={styles.firstName}>Email</Text>
                  <Text style={[styles.melissa, styles.melissaTypo]}>
                    melissa@gmail.com
                  </Text>
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
  frameGroupSpaceBlock: {
    paddingVertical: Padding.p_13xl,
    alignSelf: "stretch",
    marginBottom: 200,
  },
  melissaTypo: {
    color: Color.sparklightGray1,
    lineHeight: 28,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  buttonsLayout: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  text1Clr: {
    color: Color.colorWhitesmoke_200,
    textAlign: "center",
  },
  badgeBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  textTypo: {
    lineHeight: 18,
    fontSize: FontSize.textXsSemibold_size,
    fontWeight: "600",
  },
  rightIconLayout: {
    height: 18,
    width: 18,
    overflow: "hidden",
  },
  frameParent1SpaceBlock: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    flex: 1,
    fontWeight: '400'
  },
  makePayment: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  generalInformationParent: {
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    flexDirection: "row",
  },
  firstName: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.sparklightGray1,
    lineHeight: 28/* 200% */,
  },
  melissa: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: '400'
  },
  firstNameParent: {
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  text: {
    color: Color.success700,
    fontFamily: FontFamily.openSansSemiBold,
    textAlign: "center",
  },
  badge: {
    backgroundColor: Color.success50,
    borderColor: Color.colorAquamarine,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignItems: "center",
    flexDirection: "row",
  },
  badgeWrapper: {
    marginTop: 6,
    alignItems: "center",
    flexDirection: "row",
  },
  notificationsChild: {
    width: 3,
    alignSelf: "stretch",
    //maxHeight: "100%",
  },
  creditCardWill: {
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.sparklightBrightPurple,
    fontSize: FontSize.size_sm,
    textAlign: "left",
  },
  yourSavedCard: {
    color: Color.sparklightDarkestGray,
    marginTop: 8,
    fontSize: FontSize.size_sm,
    textAlign: "left",
    alignSelf: "stretch",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
  },

  creditCardWillExpireSoonParent: {
    marginLeft: 10,
    flex: 1,
  },
  rightActionableParent: {
    flexDirection: "row",
    flex: 1,
  },
  rightActionableIcon1: {
    display: "none",
    marginLeft: 10,
  },
  bannerWarning: {
    borderTopRightRadius: Border.br_11xs,
    borderBottomRightRadius: Border.br_11xs,
    padding: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
    flex: 1,
  },
  notifications: {
    flexDirection: "row",
    borderColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  notificationsWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameContainer: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
  },
  contactInformationWrapper: {
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameGroup: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  frameParent: {
    paddingVertical: Padding.p_5xl,
    paddingHorizontal:Padding.p_base,
    width: '100%',
  },
});

export default ProfileSettings;
