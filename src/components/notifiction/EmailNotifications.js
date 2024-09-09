import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, Pressable, View, FlatList, Image } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import NotificationAlert from "../common/customui/NotificationAlert";
import CustomerErrorPage from "../utility/SystemErrorPopup";
import { deleteSVEmailRequest, fetchSvEmailAssociation } from '../../redux/actions/ProfileActionSuite';

const EmailNotifications = () => {
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteSVEmail, setDeleteSVEmail] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const allSvEmailAssociated = profile.allSvEmailAssociated || [];

  // Categorize emails by settings
  const paperlessEmails = allSvEmailAssociated.filter(email => email.invoice);
  const marketingEmails = allSvEmailAssociated.filter(email => email.marketing);
  const sparklightTvEmails = allSvEmailAssociated.filter(email => email.iptv);
  const additionalEmails = allSvEmailAssociated.filter(email => !email.marketing && !email.invoice && !email.iptv);

  const handleSave = useCallback(() => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    // Simulate saving process...
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  }, [dispatch]);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      setErrorMsg('Something went wrong. Please try again.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    } else if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      setSuccessMsg(route.params?.successMessage || 'Operation completed successfully.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      dispatch(fetchSvEmailAssociation());
    }
  }, [route.params]);

  const handleDelete = (email) => {
    setEmailToDelete(email);
    setDeleteSVEmail(true);
  };

  const confirmDelete = () => {
    dispatch(deleteSVEmailRequest(emailToDelete, navigation));
    setDeleteSVEmail(false);
  };

  const cancelDelete = () => {
    setEmailToDelete(null);
    setDeleteSVEmail(false);
  };

  const renderEmailItem = ({ item }) => (
    <View key={item.emailAddress} style={styles.emailItem}>
      <Text style={styles.infoTitle}>Email address</Text>
      <View style={styles.emailAddressContainer}>
        <Text style={styles.emailText}>{item.emailAddress.toLowerCase()}</Text>
        <Toggle initialValue={true} />
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
    const maxEmails = 5; // Define the maximum number of allowed emails
    const showAddButton = allSvEmailAssociated.length < maxEmails;

    return (
      <View style={styles.sectionContainer}>


        <View style={styles.sectionBox}>
          {showSuccessAlert && (
            <NotificationAlert
              type="success"
              title="Success"
              message={route.params.successMessage || "Operation completed successfully."}
              showCloseIcon={true}
              onClose={() => setShowSuccessAlert(false)} // Optional: Reset success state if needed
            />
          )}
          {showErrorAlert && (
            <NotificationAlert
              type="error"
              title="Error"
              message="Something went wrong. Please try again."
              showCloseIcon={true}
              onClose={() => setShowErrorAlert(false)} // Optional: Reset error state if needed
            />
          )}
          {showAddButton && (
            <Pressable
              style={styles.addButton}
              onPress={() => navigation.navigate('AddEmailNotification', { newEmail: paperlessEmails.length === 0 })}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          )}
          <NotificationAlert
            type="warning"
            title="Critical Notifications"
            showCloseIcon={false}
            message="We'll keep you informed without overwhelming your inbox. By providing your email address, you're signing up for critical notifications."
          />
        </View>
        {paperlessEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Paperless Billing</Text>
            <Text style={styles.infoText}>Opt for email statements and say goodbye to paper clutter. It's convenient, eco-friendly, and keeps your information secure.</Text>
            <FlatList
              data={paperlessEmails}
              renderItem={renderEmailItem}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>}
        {sparklightTvEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Sparklight TV</Text>
            <Text style={styles.infoText}>This email address is tied to your TV service and can only be managed via the Sparklight TV Interface.</Text>
            <FlatList
              data={sparklightTvEmails}
              renderItem={renderEmailItem}
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
              renderItem={renderEmailItem}
              keyExtractor={(item, index) => `${item.emailAddress}-${index}`}
            />
          </View>}
        {additionalEmails.length > 0 &&
          <View style={styles.sectionBox}>
            <Text style={styles.infoTitle}>Additional Email Addresses</Text>
            <FlatList
              data={[...new Set(additionalEmails)]} // Ensure unique emails
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
        } // Moved footer inside FlatList for better positioning
        contentContainerStyle={styles.scrollContainer}
      />

      {/* Notification Alerts */}
      {showSuccessAlert && (
        <NotificationAlert
          type="success"
          title="Success"
          message={successMsg}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
      {showErrorAlert && (
        <NotificationAlert
          type="error"
          title="Error"
          message={errorMsg}
          onClose={() => setShowErrorAlert(false)}
        />
      )}

      {/* Confirmation Modal */}
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
    paddingVertical: Padding.p_base,
    paddingBottom: 100,
  },
  footer: {
    backgroundColor: Color.colorWhitesmoke_200,
    paddingVertical: Padding.p_base,
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
    margin: Padding.p_base,
  },
  sectionBox: {
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
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