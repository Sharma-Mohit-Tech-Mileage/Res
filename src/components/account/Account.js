import * as React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Padding, FontSize, Border } from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
const Account = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.account}>
      <LinearGradient
        style={[styles.accountChild]}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
        useAngle={true}
        angle={90}
      />
      <View style={[styles.iosstatusBarwhiteParent]}>
        <View style={styles.navBar}>
          <Text style={[styles.title, styles.textTypo]}>Account</Text>
          <Image
            style={[styles.chevronLeftIcon, styles.iconPosition]}
            resizeMode="cover"
            source={require("../../../assets/chevronleft.png")}
          />
        </View>
      </View>
      <View style={[styles.frameParent, styles.buttonsSpaceBlock]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <View
              style={[
                styles.avatarContrastInnerBorder,
                styles.avatarInnerBorder,
              ]}
            />
            <Text style={[styles.text, styles.textTypo]}>MS</Text>
          </View>
          <View style={styles.melissaSmithWrapper}>
            <Text style={[styles.melissaSmith, styles.melissaSmithClr]}>
              Melissa Smith
            </Text>
          </View>
        </View>
        <View style={styles.frameGroup}>
          <View style={[styles.frameContainer, styles.navigationBorder]}>
            <Pressable
              style={[styles.rightActionableGroup, styles.tabsFlexBox]}
              onPress={() => navigation.navigate("ProfileSettings")}
            >
              <Image
                style={styles.rightIconLayout}
                resizeMode="cover"
                source={require("../../../assets/right-actionable15.png")}
              />
              <Text style={[styles.profileSettings, styles.makePaymentTypo]}>
                Profile Settings
              </Text>
              <Image
                style={[styles.rightActionableIcon1, styles.rightIconLayout]}
                resizeMode="cover"
                source={require("../../../assets/chevronright.png")}
              />
            </Pressable>
            <View style={styles.frameChild} />
            <Pressable
              style={[styles.rightActionableGroup, styles.tabsFlexBox]}
              onPress={() => navigation.navigate("PasswordSecurity")}
            >
              <Image
                style={styles.rightIconLayout}
                resizeMode="cover"
                source={require("../../../assets/right-actionable16.png")}
              />
              <Text
                style={[styles.profileSettings, styles.makePaymentTypo]}
              >{`Password & Security`}</Text>
              <Image
                style={[styles.rightActionableIcon1, styles.rightIconLayout]}
                resizeMode="cover"
                source={require("../../../assets/chevronright.png")}
              />
            </Pressable>
            <View style={styles.frameChild} />
            <Pressable
              style={[styles.rightActionableGroup, styles.tabsFlexBox]}
              onPress={() => { navigation.navigate('Notifications') }}
            >
              <Image
                style={styles.rightIconLayout}
                resizeMode="cover"
                source={require("../../../assets/right-actionable17.png")}
              />
              <Text style={[styles.profileSettings, styles.makePaymentTypo]}>
                Notifications
              </Text>
              <Image
                style={[styles.rightActionableIcon1, styles.rightIconLayout]}
                resizeMode="cover"
                source={require("../../../assets/chevronright.png")}
              />
            </Pressable>
            <View style={styles.frameChild} />
            <Pressable
              style={[styles.rightActionableGroup, styles.tabsFlexBox]}
              onPress={() => { navigation.navigate('UserManagement') }}
            >
              <Image
                style={styles.rightIconLayout}
                resizeMode="cover"
                source={require("../../../assets/right-actionable18.png")}
              />
              <Text style={[styles.profileSettings, styles.makePaymentTypo]}>
                User Management
              </Text>
              <Image
                style={[styles.rightActionableIcon1, styles.rightIconLayout]}
                resizeMode="cover"
                source={require("../../../assets/chevronright.png")}
              />
            </Pressable>
          </View>
          <Pressable
            style={[styles.buttons, styles.buttonsSpaceBlock]}
            onPress={() => { }}
          >
            <Text style={[styles.makePayment, styles.makePaymentTypo]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  accountChildLayout: {
    maxWidth: "100%",
    overflow: "hidden",
    width: "100%",
  },
  parentPosition: {
    left: 0,
    width: 430,
    position: "absolute",
  },
  textTypo: {
    color: Color.sparklightWhite,
    fontWeight: "600",
    top: "50%",
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    left: "50%",
    position: "absolute",
  },
  iconPosition: {
    display: "none",
    marginTop: -12,
    top: "50%",
    position: "absolute",
  },
  iconLayout: {
    height: 32,
    width: 32,
    overflow: "hidden",
  },
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
  },
  avatarInnerBorder: {
    opacity: 0.08,
    borderColor: Color.sparklightDarkestGray,
    borderStyle: "solid",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  melissaSmithClr: {
    color: Color.sparklightDarkestGray,
    lineHeight: 28,
  },
  navigationBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderStyle: "solid",
    justifyContent: "center",
  },
  tabsFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  makePaymentTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  rightIconLayout: {
    height: 20,
    width: 20,
    overflow: "hidden",
  },
 
  accountChild: {
    height: "15.77%",
    top: "0%",
    right: "0%",
    bottom: "84.23%",
    left: "0%",
    maxHeight: "100%",
    position: "absolute",
    maxWidth: "100%",
  },
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
    textAlign: "center",
    lineHeight: 18,
    marginTop: -9,
    fontWeight: "600",
    top: "50%",
  },
  chevronLeftIcon: {
    left: 18,
    height: 24,
    display: "none",
    width: 24,
    marginTop: -12,
    overflow: "hidden",
  },
  settingsIcon: {
    right: 24,
    height: 24,
    display: "none",
    width: 24,
    marginTop: -12,
    overflow: "hidden",
  },
  heartIcon: {
    right: 52,
    display: "none",
    marginTop: -12,
    top: "50%",
    position: "absolute",
    height: 32,
    width: 32,
  },
  navBar: {
    height: 56,
    width: 430,
  },
  iosstatusBarwhiteParent: {
    width: 430,
    top: 0,
    left: 0,
  },
  avatarContrastInnerBorder: {
    right: 8,
    bottom: 8,
    borderWidth: 1,
    borderRadius: Border.br_381xl,
    opacity: 0.08,
    borderColor: Color.sparklightDarkestGray,
    position: "absolute",
  },
  text: {
    marginTop: -22,
    marginLeft: -28,
    fontSize: 24,
    lineHeight: 36,
    width: 48,
    textAlign: "center",
    fontWeight: "600",
    top: "50%",
  },
  rightActionable: {
    borderColor: Color.sparklightBlue,
    borderWidth: 4,
    width: 72,
    height: 72,
    borderStyle: "solid",
    backgroundColor: Color.sparkLightPurple,
    borderRadius: Border.br_381xl,
  },
  melissaSmith: {
    fontSize: 22,
    width: 210,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightDarkestGray,
    lineHeight: 28,
    textAlign: "center",
  },
  melissaSmithWrapper: {
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  rightActionableParent: {
    paddingBottom: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 10,
    color: Color.sparklightDarkestGray,
    lineHeight: 28,
    fontSize: FontSize.size_base,
    flex: 1,
  },
  rightActionableIcon1: {
    marginLeft: 10,
  },
  rightActionableGroup: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameChild: {
    width: 358,
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  frameContainer: {
    alignItems: "flex-end",
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  makePayment: {
    width: 282,
    color: Color.sparkLightPurple,
    textAlign: "center",
  },
  buttons: {
    width: 382,
    paddingHorizontal: 0,
    marginTop: 16,
    borderRadius: Border.br_11xs,
    justifyContent: "center",
    height: 56,
    paddingVertical: Padding.p_base,
    backgroundColor: Color.sparklightBlue,
  },
  frameGroup: {
    marginTop: 10,
    alignSelf: "stretch",
  },
  frameParent: {
    top: 100,
    height: 748,
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_base,
    width: '100%',
    left: 0,
    position: "absolute",
    overflow: "hidden",
  },
  home: {
    color: Color.sparklightDarkGray,
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansSemiBold,
  },
  tabs: {
    justifyContent: "center",
    flex: 1,
  },
  navigation: {
    top: 847,
    borderTopWidth: 1,
    height: 85,
    alignItems: "center",
    width: 430,
    left: 0,
    position: "absolute",
  },
  account: {
    height: 932,
    overflow: "hidden",
    width: "100%",
    flex: 1,
    backgroundColor: Color.sparklightBlue,
  },
});

export default Account;
