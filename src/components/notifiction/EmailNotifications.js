import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import { useDispatch } from 'react-redux';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import { updateEmailNotification,updateExistingEmailNotification, unsubscribePaperless } from '../../redux/actions/ProfileActionSuite'
const EmailNotifications = () => {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [initialize, setInitializeSettings] = useState({});
  const route = useRoute(); // Use the useRoute hook
  const paperlessdata = route.params?.additionalData;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    console.log('paperlessdata',e)
    setInitializeSettings(paperlessdata => {
      const updatedSettings = {
        ...paperlessdata,
        [name]: value
      };
      return updatedSettings;
    });
  };
  useEffect(() => {
    if (paperlessdata) {
      setInitializeSettings(paperlessdata);
    }
  }, [paperlessdata]);
  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  const handleSave = () => {
    if (initialize.status) {
      if (initialize.isNew)
        dispatch(updateEmailNotification(initialize.email, navigation));
      else {
        dispatch(updateExistingEmailNotification(initialize.email, navigation));
      }
    } else {
      dispatch(unsubscribePaperless(navigation));
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title="Edit Email Notifications"
        onPressBack={() => navigation.navigate('Notifications')}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <View style={styles.emailNotificationsInner}>
        
        <View style={styles.frameParent}>
        
          <View style={[styles.frameContainer, styles.navigationBorder]} accessible >
            <View style={styles.frameGroup}>
              <View style={[styles.frameView, styles.frameFlexBox]}>
                <View style={styles.frameParent1} >
                  <NotificationAlert
                    type="error"
                    title="Failed"
                    message="Notifications updated failed."
                    showCloseIcon={true}
                    isVisible={showErrorAlert}
                    onClose={() => setShowErrorAlert(false)}
                  />
                  <View style={[styles.paperlessBillingParent, styles.frameFlexBox,]}>
                    <Text style={styles.paperlessBilling}>
                      Paperless Billing
                    </Text>
                    <View>
                      <Toggle name="status"
                        initialValue={initialize.status}
                        onToggle={handleToggleChange} />
                    </View>
                  </View>
                  <Text style={[styles.receiveBillingStatements, styles.receiveTypo,]}
                  >
                    Receive billing statements via email and no longer receive
                    paper statements in the mail.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonsParent} accessible >
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={handleSave}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("Notifications")}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Cancels the action and returns to Notifications screen"
            >
              <Text style={[styles.makePayment1, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  navigationBorder: {
    borderColor: Color.sparklightGray,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  frameFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },

  receiveTypo: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightaddGray,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    width: '100%',
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  paperlessBilling: {
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    lineHeight: 28,
    flex: 1,
  },
  paperlessBillingParent: {
    alignItems: "center",
  },
  receiveBillingStatements: {
    color: Color.colorGray_100,
    lineHeight: 28,
  },
  frameParent1: {
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    flex: 1,
  },
  frameView: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  receiveMarketingEmails: {
    lineHeight: 28,
  },
  promotions: {
    lineHeight: 22,
  },
  receiveMarketingEmailsContainer: {
    color: Color.colorGray_100,
  },
  frameWrapper1: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  frameGroup: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameContainer: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    borderColor: Color.sparklightGray,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  frameParent: {
    alignSelf: "stretch",
  },
  makePayment: {
    color: Color.sparklightWhite,
    width: 282,
  },
  buttons: {
    backgroundColor: Color.colorMidnightblue,
  },
  makePayment1: {
    color: Color.colorMidnightblue,
  },
  buttons1: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
    width: 382,
  },
  buttonsParent: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  emailNotificationsInner: {
    marginTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: '100%',
    overflow: "hidden",
  },
});

export default EmailNotifications;
