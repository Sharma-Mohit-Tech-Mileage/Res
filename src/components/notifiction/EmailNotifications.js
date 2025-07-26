import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, Pressable, View, FlatList, Image, ScrollView, Alert } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import { deleteSVEmailRequest, fetchSvEmailAssociation, updateEmailAssociations, fetchBillingPaper } from '../../redux/actions/ProfileActionSuite';
import LoadingOverlay from '../common/customui/CustomLoading';
import { extractAcknowledgementEmail } from '../../components/utility/constant';

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

  const renderEmailItem = ({ item, section, disabled }) => (
    <View
      style={styles.emailItem}
      accessibilityLabel={`${section === 'paperless' ? 'Paperless billing' : section === 'marketing' ? 'Marketing' : 'Sparklight TV'} email: ${item.emailAddress.toLowerCase()}. ${disabled ? 'Settings cannot be modified.' : 'Toggle switch available to modify settings.'}`}
    >
      <View style={styles.emailAddressContainer}>
        <Text style={styles.emailText}>
          {item.emailAddress.toLowerCase()}
        </Text>
        <Toggle
          name={item.emailAddress}
          initialValue={toggleStates[item.emailAddress]?.[section] || false}
          onToggle={(event) => handleToggleChange(event, section)}
          disabled={disabled}
          section={section}
        />
      </View>
    </View>
  );

  const renderEmailItemWithTrash = ({ item }) => (
    <View
      style={styles.emailItem}
      accessibilityLabel={`Additional email address: ${item.emailAddress.toLowerCase()}. Double tap delete button to remove this email.`}
    >
      <View style={styles.emailAddressContainer}>
        <Text style={styles.emailText}>
          {item.emailAddress.toLowerCase()}
        </Text>
        <Pressable
          onPress={() => handleDelete(item.emailAddress)}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${item.emailAddress}`}
          accessibilityHint="Double tap to delete this email address"
          style={styles.deleteButton}
        >
          <Image
            //source={require("../../../assets/right-actionable6.png")}
            importantForAccessibility="no"
          />
        </Pressable>
      </View>
    </View>
  );

  const ListHeaderComponent = () => {
    const maxEmails = 5;
    const showAddButton = allSvEmailAssociated?.length < maxEmails;

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
              accessibilityLabel={`Success: ${successMsg}`}
              accessibilityLiveRegion="polite"
            />
          )}
          {showErrorAlert && (
            <NotificationAlert
              type="error"
              title="Error"
              message={errorMsg}
              showCloseIcon={true}
              onClose={() => setShowErrorAlert(false)}
              accessibilityLabel={`Error: ${errorMsg}`}
              accessibilityLiveRegion="assertive"
            />
          )}
          {showAddButton && (
            <Pressable
              style={styles.addButton}
              onPress={() => navigation.navigate('AddEmailNotification', { newEmail: paperlessEmails?.length === 0 })}
              accessibilityRole="button"
              accessibilityLabel="Add new email notification"
              accessibilityHint="Double tap to add a new email address"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.sectionBox_info}>
          <View 
            accessible={true}
            accessibilityRole="header"
            style={styles.emailItem}
          >
            <Text style={[styles.emailText, { fontWeight: '600' }]}>
              Critical Notifications
            </Text>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={emailsWithOnSettings?.length > 0 ?
                require("../../../assets/checkcircle.png") :
                require("../../../assets/checkcircle1.png")
              }
              importantForAccessibility="no"
            />
          </View>
          <Text
            style={[styles.infoText, { color: Color.colorGray_200 }]}
            accessible={true}
            accessibilityRole="text"
          >
            We'll keep you informed without overwhelming your inbox. By providing your email address, you're signing up for critical notifications.
          </Text>
        </View>

        {(paperlessEmails?.length > 0 || (allSvEmailAssociated?.length > 0 && acknowledgement)) && (
          <View style={styles.sectionBox}>
            <View accessible={true} accessibilityRole="header" >
              <Text style={styles.infoTitle}> Paperless Billing </Text>
            </View>
            <Text style={styles.infoText} accessible={true} accessibilityRole="text" >
              Opt for email statements and say goodbye to paper clutter. It's convenient, eco-friendly, and keeps your information at your fingertips. By signing up for Paperless Billing, you'll also receive occasional updates and offers via email.
            </Text>
            {paperlessEmails?.length > 0 && (
              <View accessible={true} accessibilityRole="header" >
                <Text style={styles.infoTitle}> Email address </Text>
              </View>
            )}
            <FlatList
              data={paperlessEmails}
              renderItem={(item) => renderEmailItem({ ...item, section: 'paperless', disabled: acknowledgement })}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
            {acknowledgement && (
              <View style={{ marginVertical: 8 }}>
                <NotificationAlert
                  type="warning"
                  title=""
                  resentemail={true}
                  showCloseIcon={false}
                  splitKey="Resend Confirmation Email"
                  nextRow={true}
                  message={`To continue with Paperless Billing, please confirm your email address (${acknowledgement}) with the verification link sent to your inbox.`}
                  accessibilityLabel={`Email confirmation needed for ${acknowledgement}`}
                  accessibilityLiveRegion="polite"
                />
              </View>
            )}
          </View>
        )}

        {marketingEmails?.length > 0 && (
          <View style={styles.sectionBox}>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Marketing Communications
              </Text>
            </View>
            <Text
              style={styles.infoText}
              accessible={true}
              accessibilityRole="text"
            >
              Be the first to know about our latest offers, promotions, and news.
            </Text>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Email address
              </Text>
            </View>
            <FlatList
              data={marketingEmails}
              renderItem={(item) => renderEmailItem({ ...item, section: 'marketing' })}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>
        )}

        {sparklightTvEmails?.length > 0 && (
          <View style={styles.sectionBox}>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Sparklight TV
              </Text>
            </View>
            <Text
              style={styles.infoText}
              accessible={true}
              accessibilityRole="text"
            >
              This email address is tied to your TV service and can only be managed via the Sparklight TV Interface.
            </Text>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Email address
              </Text>
            </View>
            <FlatList
              data={sparklightTvEmails}
              renderItem={(item) => renderEmailItem({ ...item, section: 'iptv', disabled: true })}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>
        )}

        {additionalEmails?.length > 0 && (
          <View style={styles.sectionBox}>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Additional Email Addresses
              </Text>
            </View>
            <View 
              accessible={true}
              accessibilityRole="header"
            >
              <Text style={styles.infoTitle}>
                Email address
              </Text>
            </View>
            <FlatList
              data={[...new Set(additionalEmails)]}
              renderItem={renderEmailItemWithTrash}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Edit Email Notifications" onPressBack={() => navigation.goBack()} />
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
                  accessibilityLabel={isSubmitting ? "Saving changes" : "Save changes"}
                  accessibilityState={{ disabled: isSubmitting }}
                  accessibilityHint="Double tap to save all changes"
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? 'Submitting...' : 'Save'}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                  onPress={() => navigation.navigate("Notifications")}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel changes"
                  accessibilityHint="Double tap to discard changes and return to notifications"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          }
          contentContainerStyle={styles.scrollContainer}
        />
      </ScrollView>

      <LoadingOverlay
        loading={isSubmitting || isDeleting}
        loadingTxt={isDeleting ? "Deleting..." : "Saving..."}
        accessibilityLabel={isDeleting ? "Deleting email address" : "Saving changes"}
        accessibilityLiveRegion="polite"
      />

      <CustomerErrorPage
        visible={deleteSVEmail}
        message={`Do you want to continue deleting ${emailToDelete}?`}
        title="Delete Email Id"
        onActionTxt="Yes"
        onAction={confirmDelete}
        onClose={cancelDelete}
        accessibilityLabel={`Confirm deletion of ${emailToDelete}`}
        accessibilityLiveRegion="assertive"
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
    marginVertical: 12,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: 'flex-end',
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
    marginTop: 16,
  },
  infoText: {
    fontSize: FontSize.size_sm,
    color: Color.sparklightDarkGray,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    marginVertical: 2
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
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