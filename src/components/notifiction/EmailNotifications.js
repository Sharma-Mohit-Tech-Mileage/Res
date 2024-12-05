import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, Pressable, View, FlatList, Image, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import { deleteSVEmailRequest, fetchSvEmailAssociation, updateEmailAssociations ,fetchBillingPaper} from '../../redux/actions/ProfileActionSuite';
import LoadingOverlay from '../common/LoadingOverlay';
import  {extractAcknowledgementEmail } from '../../components/utility/constant';

const EmailNotifications = () => {
  const scrollViewRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteSVEmail, setDeleteSVEmail] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [toggleStates, setToggleStates] = useState({});
  const initialToggleStatesRef = useRef({});
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const { allSvEmailAssociated = [] } = profile;
  const paperLessInfo = profile.paperLessInfo || {};
  const acknowledgement = extractAcknowledgementEmail(paperLessInfo);
  const paperlessEmails = allSvEmailAssociated.filter(email => email.invoice);
  const marketingEmails = allSvEmailAssociated.filter(email => email.marketing && !email.invoice);
  const sparklightTvEmails = allSvEmailAssociated.filter(email => email.iptv);
  const additionalEmails = allSvEmailAssociated.filter(email => !email.marketing && !email.invoice && !email.iptv && !email.collection && !email.tiVo);
  const emailsWithOnSettings = [];
  allSvEmailAssociated.forEach(setting => {
    if (setting.invoice || setting.marketing || setting.iptv) {
      setting.emailAddress && emailsWithOnSettings.push(setting.emailAddress);
    }
  });

  useEffect(() => {
    const initializeToggleStates = () => {
      const initialStates = {};
      allSvEmailAssociated.forEach(email => {
        initialStates[email.emailAddress] = {
          paperless: email.invoice,
          marketing: email.marketing,
          iptv: email.iptv,
        };
      });
      console.log('initialStates>>>>>>>>>>>>>', initialStates);
      setToggleStates(initialStates);
      initialToggleStatesRef.current = initialStates;
    };
    initializeToggleStates();
  }, [allSvEmailAssociated]);

  const handleToggleChange = (event, section) => {
    const { name, value } = event.target;
    setToggleStates(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [section]: value
      }
    }));
  };

  const hasChanges = useCallback(() => (
    Object.keys(toggleStates).some(email => {
      const current = toggleStates[email];
      const initial = initialToggleStatesRef.current[email];
      return current.paperless !== initial.paperless || current.marketing !== initial.marketing;
    })
  ), [toggleStates]);

  const saveChanges = useCallback(async () => {
    if (!hasChanges()) {
      setErrorMsg('No changes to update.');
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const paperlessPayload = paperlessEmails
        .find(email => !toggleStates[email.emailAddress]?.paperless)?.emailAddress || null;

      const marketingPayload = marketingEmails
        .filter(email => !toggleStates[email.emailAddress]?.marketing)
        .map(email => email.emailAddress);

      await dispatch(updateEmailAssociations(paperlessPayload, marketingPayload, navigation));

      setShowSuccessAlert(true);
      setSuccessMsg('Changes updated successfully.');
      await dispatch(fetchSvEmailAssociation());

      const updatedInitialStates = {};
      allSvEmailAssociated.forEach(email => {
        updatedInitialStates[email.emailAddress] = {
          paperless: toggleStates[email.emailAddress]?.paperless || false,
          marketing: toggleStates[email.emailAddress]?.marketing || false,
        };
      });
      initialToggleStatesRef.current = updatedInitialStates;

    } catch (error) {
      setShowErrorAlert(true);
      setErrorMsg('Something went wrong. Please try again.');
    }
  }, [dispatch, toggleStates, paperlessEmails, marketingEmails, navigation, hasChanges, allSvEmailAssociated]);

  const handleSave = useCallback(async () => {
    await saveChanges();
  }, [saveChanges]);

  const handleDelete = useCallback((email) => {
    if (hasChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save these changes before deleting the email?',
        [
          {
            text: 'Save Changes',
            onPress: async () => {
              await saveChanges();
              setEmailToDelete(email);
              setDeleteSVEmail(true);
            }
          },
          {
            text: 'Don’t Save',
            onPress: () => {
              setEmailToDelete(email);
              setDeleteSVEmail(true);
            },
            style: 'destructive'
          },
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    } else {
      setEmailToDelete(email);
      setDeleteSVEmail(true);
    }
  }, [hasChanges, saveChanges]);

  const confirmDelete = useCallback(() => {
    setIsDeleting(true);
    setDeleteSVEmail(false);
    dispatch(deleteSVEmailRequest(emailToDelete, navigation));
  }, [dispatch, emailToDelete, navigation]);

  useEffect(() => {
    if (route.params?.updateFailed || route.params?.updateSuccess) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      setIsSubmitting(false);
      setIsDeleting(false);
      isSubmittingRef.current = false;
      if (route.params?.updateFailed) {
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
        setErrorMsg('Something went wrong. Please try again.');
      } else if (route.params?.updateSuccess) {
        setShowErrorAlert(false);
        setShowSuccessAlert(true);
        setSuccessMsg(route.params.successMessage || 'Operation completed successfully.');
        dispatch(fetchSvEmailAssociation());
        dispatch(fetchBillingPaper());
      }
    }
  }, [route.params, dispatch]);

  const cancelDelete = () => {
    setEmailToDelete(null);
    setDeleteSVEmail(false);
  };

  const renderEmailItem = ({ item, section,disabled }) => (
    <View key={item.emailAddress} style={styles.emailItem}>
      <Text style={styles.infoTitle}>Email address</Text>
      <View style={styles.emailAddressContainer}>
        <Text style={styles.emailText}>{item.emailAddress.toLowerCase()}</Text>
        <Toggle
          name={item.emailAddress}
          initialValue={toggleStates[item.emailAddress]?.[section] || false}
          onToggle={(event) => handleToggleChange(event, section)}
          disabled={disabled}
          label={`${section} email`}
        />
      </View>
    </View>
  );

  const renderEmailItemWithTrash = ({ item }) => (
    <View key={item.emailAddress} style={styles.emailItem}>
      <Text style={styles.infoTitle}>Email address</Text>
      <View style={styles.emailAddressContainer}>
        <Text style={styles.emailText}>{item.emailAddress.toLowerCase()}</Text>
        <Pressable onPress={() => handleDelete(item.emailAddress)}>
          <Image source={require("../../../assets/right-actionable6.png")} />
        </Pressable>
      </View>
    </View>
  );

  const ListHeaderComponent = () => {
    const maxEmails = 5;
    const showAddButton = allSvEmailAssociated.length < maxEmails;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionBox}>
          {showSuccessAlert && (
            <NotificationAlert
              type="success"
              title="Success"
              message={successMsg}
              showCloseIcon={true}
              onClose={() => setShowSuccessAlert(false)}
            />
          )}
          {showErrorAlert && (
            <NotificationAlert
              type="error"
              title="Error"
              message={errorMsg}
              showCloseIcon={true}
              onClose={() => setShowErrorAlert(false)}
            />
          )}
          {(showSuccessAlert || showErrorAlert) && <View style={{ marginBottom: Padding.p_base }} />}
          {showAddButton && (
            <Pressable
              style={styles.addButton}
              onPress={() => navigation.navigate('AddEmailNotification', { newEmail: paperlessEmails.length === 0 })}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.sectionBox_info}>
        <View style={styles.emailItem}>
            <Text style={[styles.emailText,{fontWeight:'600'}]}>Critical Notifications</Text>
            {emailsWithOnSettings.length > 0 ? <Image
              style={styles.icon}
              resizeMode="contain"
              source={require("../../../assets/checkcircle.png")}
            /> : <Image
              style={styles.icon}
              resizeMode="contain"
              source={require("../../../assets/checkcircle1.png")}
            />}
          </View>
          <Text style={[styles.infoText,{color:Color.colorGray_200}]}>
            We'll keep you informed without overwhelming your inbox. By providing your email address, you're signing up for critical notifications.
          </Text>
        </View>
        {(paperlessEmails.length > 0||acknowledgement) &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Paperless Billing</Text>
            <Text style={styles.infoText}> Opt for email statements and say goodbye to paper clutter. It’s convenient, eco-friendly, and keeps your information at your fingertips. By signing up for Paperless Billing, you’ll also receive occasional updates and offers via email.</Text>
            <FlatList
              data={paperlessEmails}
              renderItem={(item) => renderEmailItem({ ...item, section: 'paperless',disabled:acknowledgement })}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
            {acknowledgement&& 
            <View style={{marginVertical:8}}>
            <NotificationAlert
            type="warning"
            title=""
            resentemail={true}
            showCloseIcon={false}
            splitKey="Resend Confirmation Email"
            nextRow={true}
            message={`To continue with Paperless Billing, please confirm your email address (${acknowledgement}) with the verification link sent to your inbox.`}
          />
          </View>}
          </View>}
        {sparklightTvEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Sparklight TV</Text>
            <Text style={styles.infoText}>This email address is tied to your TV service and can only be managed via the Sparklight TV Interface.</Text>
            <FlatList
              data={sparklightTvEmails}
              //renderItem={renderEmailItem}
              renderItem={(item) => renderEmailItem({ ...item, section: 'iptv' ,disabled:true})}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>}
        {marketingEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Marketing Communications</Text>
            <Text style={styles.infoText}>
              Be the first to know about our latest offers, promotions, and news.
            </Text>
            <FlatList
              data={marketingEmails}
              renderItem={(item) => renderEmailItem({ ...item, section: 'marketing' })}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>}
        {additionalEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Additional Email Addresses</Text>
            <FlatList
              data={[...new Set(additionalEmails)]}
              renderItem={renderEmailItemWithTrash}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Edit Email Notifications"
        onPressBack={() => navigation.goBack()}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <ScrollView ref={scrollViewRef}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={
            <View style={styles.footer}>
              <View style={styles.buttonsParent}>
                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={handleSave}
                  accessibilityRole="button"
                  accessibilityLabel="Save"
                >
                  <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Save'}</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => navigation.navigate("Notifications")}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                  accessibilityHint="Cancels the action and returns to Notifications screen"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          }
          contentContainerStyle={styles.scrollContainer}
        />
      </ScrollView>
      {(isSubmitting || isDeleting) && (
        <LoadingOverlay isLoading={true} message={isDeleting ? "Deleting..." : "Saving..."} />
      )}
      <CustomerErrorPage
        visible={deleteSVEmail}
        message={`Do you want to continue deleting ${emailToDelete}?`}
        title={"Delete Email Id"}
        onActionTxt={"Yes"}
        onAction={confirmDelete}
        onClose={cancelDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  scrollContainer: {
    paddingVertical: Padding.p_xl,
    paddingBottom: 100,
  },
  footer: {
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: Padding.p_base,
    borderTopWidth: 1,
    borderTopColor: Color.colorWhitesmoke_300,
  },
  addButton: {
    backgroundColor: Color.colorMidnightblue,
    borderRadius: Border.br_11xs,
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: 'flex-end',
    marginBottom: Padding.p_base,
  },
  addButtonText: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    marginHorizontal: Padding.p_base,
  },
  sectionBox: {
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
    padding: Padding.p_base,
  },
  sectionBox_info: {
    backgroundColor: Color.backgroundBlur,
    padding: Padding.p_base,
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Padding.p_5xs,
    flexWrap: 'wrap',
  },
  emailAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    marginRight: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  infoTitle: {
    fontWeight: "400",
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    marginVertical: 2,
  },
  infoText: {
    fontSize: FontSize.size_sm,
    color: Color.sparklightDarkGray,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    marginVertical: 2
  },
  submitButton: {
    backgroundColor: Color.colorMidnightblue,
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
    marginBottom: Padding.p_base,
  },
  submitButtonText: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: Color.colorWhitesmoke_200,
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  cancelButtonText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  buttonsParent: {
    marginTop: Padding.p_base,
  },
});

export default EmailNotifications;