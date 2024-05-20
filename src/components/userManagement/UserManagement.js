import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, ScrollView,Pressable,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import { ROLE_COLORS, getUserType } from '../utility/constant';
import { executeUserList } from '../../redux/actions/ProfileActionSuite'
import { removeUser } from "../../redux/actions/ProfileActionSuite";
import NotificationAlert from '../common/customui/NotificationAlert';

const UserManagement = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const userList = profile.userList || [];
  const userData = useSelector(state => state.combinedReducers.user.userData);
  const [showError,setShowError]=useState(false)
  const acNumber=userData?.userInfo?.accountNumber;
  useEffect(() => {
    dispatch(executeUserList(0));
  }, [dispatch]);

const deleteUser=(user)=>{
  const data={accountNumber:acNumber,userName:user?.userName}
  dispatch(removeUser(data,(isSuccess)=>{
    if(isSuccess){
       dispatch(executeUserList(0));
    }else{
      setShowError(true)
    }
  }))
  
}


  const renderUserCard = (user) => {
    const convertedRole = getUserType(user.memberType);
    const normalizedRole = convertedRole.replace(/\s+/g, '').toLowerCase();
    const avatarColor = ROLE_COLORS[normalizedRole] || Color.sparklightGreen;
    const isLoggedInUser = user?.userName === userData.userInfo?.userName;
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';

    let initials = '';
    if (firstName.length > 0) {
      initials += firstName.charAt(0).toUpperCase();
    }
    if (lastName.length > 0) {
      initials += lastName.charAt(0).toUpperCase();
    }
    // Camel Case Full Name
    const fullNameCamelCase = [firstName, lastName]
      .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
      .join(' ');

    return (
      <View style={[styles.frameParent3, styles.frameBorder]}>
        <View style={[styles.frameParent1, styles.navigationBorder]}>
          <View style={styles.rightActionableParent}>
            <View style={[{ backgroundColor: avatarColor }, styles.rightLayout]}>
              <View style={styles.avatarContrastInnerBorder} />
              <Text style={[styles.text, styles.textClr]}>{initials}</Text>
            </View>
            <View>
              <Text style={[styles.taylorNickum, styles.melissaSmithTypo]}>
                {fullNameCamelCase}
              </Text>
              {isLoggedInUser && (
                <View style={styles.userParent}>
                  <Text style={[styles.loggedIn, styles.usersFlexBox]}>
                    {'Logged In'}
                  </Text>
                </View>
              )}
            </View>
          </View>
           <View style={styles.frameParent2}>
            <Pressable
              style={styles.rightFlexBox}
              onPress={() => navigation.navigate("UserManagementEdit",{User:user,acno:acNumber})}
            >
              <Image
                style={styles.rightActionableIcon}
                resizeMode="cover"
                source={require("../../../assets/right-actionable5.png")}
              />
            </Pressable>
            <Pressable style={[styles.rightActionableContainer,styles.rightFlexBox, ]}
              onPress={() => deleteUser(user)}
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
            <Text style={styles.melsmith}>{user.userName}</Text>
          </View>
        </View>
        <View style={styles.frameWrapper}>
          <View style={styles.usernameParent}>
            <Text style={[styles.username, styles.usersFlexBox]}>
              Member Type
            </Text>
            <View style={styles.badgeWrapper}>
              <View style={[styles.badge, styles.badgeBorder, isLoggedInUser ? styles.login : styles.loginOut]}>
                <Text style={[styles.text3]}>{getUserType(user.memberType)}</Text>
              </View>
            </View>
          </View>
        </View>
        {/* <View style={[styles.frameWrapper2, styles.frameSpaceBlock]}>
          { <View style={styles.usernameParent}>
            <Text style={[styles.username, styles.usersFlexBox]}>
              Email
            </Text>
            <Text style={styles.melsmith}>{user.email}</Text>
          </View>}
        </View> */}
      </View>
    )
  };
  return (
    <View style={{ flex: 1 }}>
      <ProfileSettingsHeader
        title="User Management"
        onPressBack={() => navigation.navigate('Account')}
      />
      <ScrollView>
        <View style={[styles.frameParent, styles.frameSpaceBlock1]}>

        <NotificationAlert
                    type="error"
                    title="Failed"
                    message={"Something went wrong! Please try again"}
                    showCloseIcon={true}
                    isVisible={showError}
                    onClose={()=>{
                      setShowError(false)
                    }}
                    
                  />
          <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
            <View style={[styles.usersParent, styles.frameGroupSpaceBlock]}>
              <Text style={[styles.users, styles.usersFlexBox]}>Users</Text>
               <Pressable
                  style={[styles.buttons, styles.buttonsBg]}
                  onPress={() => navigation.navigate("UserManagementEdit",{acno:acNumber})}
                >
                  <Text style={[styles.makePayment, styles.textClr]}>Add User</Text>
                </Pressable> 
            </View>
            <View style={styles.frameContainer}>
              {userList.map((user, index) => (
                <React.Fragment key={index}>
                  {renderUserCard(user)}
                  {index < userList.length - 1 && <View style={styles.boxspace} />}
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
    color: Color.sparklightGray1,
  },
  login:
  {
    backgroundColor: Color.success50,
    borderColor: Color.colorAquamarine
  },
  loginOut:
  {
    backgroundColor: Color.colorWhitesmoke_200,
    borderColor: Color.colorWhitesmoke_200
  },
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.sparklightGray,
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
    borderColor: Color.sparklightGray,
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
  boxspace: {
    paddingTop: Padding.p_base,
    height: 1,
    backgroundColor: Color.sparklightWhite,
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
    backgroundColor: Color.colorMidnightblue,
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
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  usernameParent: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameWrapper: {
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },

  frameWrapper2: {
    borderBottomRightRadius: Border.br_11xs,
    borderBottomLeftRadius: Border.br_11xs,
    justifyContent: "center",
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
  },
  taylorNickum: {
    marginLeft: 8,
    lineHeight: 28,
  },
  text3: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansSemiBold,
    textAlign: "center",
    lineHeight: 18,
    fontSize: FontSize.size_xs,
    fontWeight: "600",

  },
  badge: {
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignItems: "center",
    flexDirection: "row",
  },

  frameParent3: {
    paddingVertical: 16,
    alignSelf: "stretch",
  },
  frameContainer: {
    paddingHorizontal: Padding.p_base,
    paddingBottom: 0,
    alignSelf: "stretch",
  },
  frameGroup: {
    borderWidth: 1,
    borderColor: Color.sparklightGray,
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
    paddingTop: Padding.p_5xl,
    width: '100%',
    marginBottom: 200
  },
});

export default UserManagement;
