import * as React from "react";
import { Image, StyleSheet, Text, Pressable, View, SafeAreaView, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";

const UserManagement = () => {

  const navigation = useNavigation();
  const users = [
    {
      initials: 'MS',
      name: 'Melissa Smith',
      status: 'Logged In',
      username: 'MelSmith',
      memberType: 'PRIMARY ADMIN',
      email: 'melissa@gmail.com',
    },
    {
      initials: 'TN',
      name: 'Taylor Nickum',
      status:null,
      username: 'Taylor123',
      memberType: 'ADMIN',
      email: 'taylor123@gmail.com',
    },
    // Add more user objects as needed
  ];
  const renderUserCard = (user) => (
    <View style={[styles.frameParent3, styles.frameBorder]}>
      <View style={[styles.frameParent1, styles.navigationBorder]}>
        <View style={styles.rightActionableParent}>
          <View style={[styles.rightActionable1, styles.rightLayout]}>
            <View style={styles.avatarContrastInnerBorder} />
            <Text style={[styles.text, styles.textClr]}>{user.initials}</Text>
          </View>
          <View>
          <Text style={[styles.taylorNickum, styles.melissaSmithTypo]}>
            {user.name}
          </Text>
            {user.status && (
              <View style={styles.userParent}>
              <Text style={[styles.loggedIn, styles.usersFlexBox]}>
                {user.status}
              </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.frameParent2}>
          <Pressable
            style={styles.rightFlexBox}
            onPress={() => navigation.navigate("UserManagementEdit")}
          >
            <Image
              style={styles.rightActionableIcon}
              resizeMode="cover"
              source={require("../../../assets/right-actionable5.png")}
            />
          </Pressable>
          <Pressable
            style={[
              styles.rightActionableContainer,
              styles.rightFlexBox,
            ]}
            onPress={() => navigation.navigate("UserManagementEdit")}
          >
            <Image
              style={styles.rightActionableIcon}
              resizeMode="cover"
              source={require("../../../assets/right-actionable6.png")}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.frameWrapper}>
        <View style={styles.usernameParent}>
          <Text style={[styles.username, styles.usersFlexBox]}>
            Username
          </Text>
          <Text style={styles.melsmith}>{user.username}</Text>
        </View>
      </View>
      <View style={styles.frameWrapper}>
        <View style={styles.usernameParent}>
          <Text style={[styles.username, styles.usersFlexBox]}>
            Member Type
          </Text>
          <View style={styles.badgeWrapper}>
            <View style={[user.memberType === 'PRIMARY ADMIN' ? styles.badge : styles.badge1, styles.badgeBorder]}>
              <Text style={[styles.text3, styles.textTypo]}>
                {user.memberType}
              </Text>

            </View>
          </View>

        </View>
      </View>
      <View style={[styles.frameWrapper2, styles.frameSpaceBlock]}>
        <View style={styles.usernameParent}>
          <Text style={[styles.username, styles.usersFlexBox]}>
            Email
          </Text>
          <Text style={styles.melsmith}>{user.email}</Text>
        </View>
      </View>
    </View>
  );
  return (

    <View style={{ flex: 1 }}>
      <ProfileSettingsHeader
        title="User Management"
        onPressBack={() => navigation.navigate('Account')}
      />
        <ScrollView>
          <View style={[styles.frameParent, styles.frameSpaceBlock1]}>
            <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
              <View style={[styles.usersParent, styles.frameGroupSpaceBlock]}>
                <Text style={[styles.users, styles.usersFlexBox]}>Users</Text>
                <Pressable
                  style={[styles.buttons, styles.buttonsBg]}
                  onPress={() => navigation.navigate("UserManagementEdit")}
                >
                  <Text style={[styles.makePayment, styles.textClr]}>Add User</Text>
                </Pressable>
              </View>
              <View style={styles.frameContainer}>
                {users.map((user, index) => (
                  <React.Fragment key={index}>
                    {renderUserCard(user)}
                  </React.Fragment>
                ))}
              </View>
            </View>
            <View style={styles.frameChild} />
          </View>
        </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  textClr: {
    color: Color.sparklightWhite,
    textAlign: "center",
  },
  frameSpaceBlock1: {
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  frameGroupSpaceBlock: {
    paddingBottom: Padding.p_5xl,
    paddingTop: Padding.p_base,
    alignSelf: "stretch",
  },
  usersFlexBox: {
    textAlign: "left",
    color: Color.colorDimgray,
  },
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  badgeWrapper: {
    marginTop: 6,
    alignItems: "center",
    flexDirection: "row",
  },
  userParent: {
    marginLeft: 8,
    justifyContent: "center",
  },
  navigationBorder: {
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    alignItems: "center",
  },
  rightLayout: {
    borderRadius: Border.br_181xl,
    height: 32,
    width: 32,
  },
  melissaSmithTypo: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  rightFlexBox: {
    padding: Padding.p_9xs,
    borderRadius: Border.br_81xl,
    alignItems: "center",
    flexDirection: "row",
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
  frameSpaceBlock: {
    paddingTop: Padding.p_5xs,
    alignSelf: "stretch",
  },
  users: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    flex: 1,
  },
  makePayment: {
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  buttonsBg: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.sparkLightPurple,
  },
  usersParent: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  avatarContrastInnerBorder: {
    right: 0,
    borderColor: Color.colorGray_200,
    borderWidth: 0.5,
    opacity: 0.08,
    bottom: 0,
    borderRadius: Border.br_181xl,
    borderStyle: "solid",
    left: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  text: {
    marginLeft: -12,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_xs,
    width: 24,
    textAlign: "center",
    fontWeight: "600",
    color: Color.sparklightWhite,
    lineHeight: 18,
    left: "50%",
    top: "50%",
    marginTop: -9,
    position: "absolute",
  },
  rightActionable: {
    backgroundColor: Color.colorMidnightblue,
  },
  melissaSmith: {
    lineHeight: 16,
  },
  loggedIn: {
    lineHeight: 12,
    marginTop: 4,
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.openSansRegular,
  },
  rightActionableParent: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  rightActionableIcon: {
    height: 24,
    width: 24,
    overflow: "hidden",
  },
  rightActionableContainer: {
    marginLeft: 16,
  },
  frameParent2: {
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent1: {
    borderBottomWidth: 1,
    paddingVertical: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  username: {
    fontSize: FontSize.textXsSemibold_size,
    lineHeight: 28,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  melsmith: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.colorDimgray,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  usernameParent: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameWrapper: {
    paddingBottom: Padding.p_5xs,
    justifyContent: "center",
    paddingTop: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
 
  badgeWrapper: {
    marginTop: 2,
    alignItems: "center",
    flexDirection: "row",
  },
  frameWrapper2: {
    borderBottomRightRadius: Border.br_11xs,
    borderBottomLeftRadius: Border.br_11xs,
    justifyContent: "center",
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
  },
  rightActionable1: {
    backgroundColor: Color.sparklightBrightPurple,
  },
  taylorNickum: {
    marginLeft: 8,
    lineHeight: 28,
  },
  text3: {
    color: Color.sparklightGray1,
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
  badge1: {
    backgroundColor: Color.colorWhitesmoke_200,
    borderColor: Color.sparklightWhite,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent3: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  frameContainer: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  frameGroup: {
    borderWidth: 1,
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  frameChild: {
    marginTop: 10,
    borderRadius: Border.br_11xs,
    height: 24,
    alignSelf: "stretch",
  },
  frameParent: {
    top: 100,
    paddingTop: Padding.p_base,
    width: '100%',
    marginBottom: 200
  },
});

export default UserManagement;
