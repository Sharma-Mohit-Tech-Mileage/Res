import React, { useState } from "react";
import { Modal, View, StyleSheet, Text, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_GRADIENT, NAV_BOTTOM, useInternalHeaderTop } from "../common/ProfileSettingsHeader";
import LinearGradient from 'react-native-linear-gradient';
import Pdf from 'react-native-pdf';
import sharePDF from 'react-native-share-pdf';
import { Color, FontFamily, FontSize } from '../../styles/GlobalStyles';
import { A11Y } from '../../styles/theme';
import Xclose from "../../../src/res/svgIcons/Xclose";
import Share from "../../../src/res/svgIcons/Share";
import Touchable from "../common/customui/Touchable";

const PDFViewModal = ({ url, onClose, title = "Billing History" }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [iconPressed, setIconPressed] = useState(false);
  const topInset = useInternalHeaderTop();
  const bottomInset = useSafeAreaInsets().bottom;
  const convertUrl = 'data:application/pdf;base64,' + url;

  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const loadAndSharePDF = async () => {
    await sharePDF(url, 'billinghistory.pdf');
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            {/* Same top spacing and bottom clearance as ProfileSettingsHeader so every internal nav matches. */}
            <LinearGradient
                style={[styles.profileSettingsChild, { paddingTop: topInset, paddingBottom: NAV_BOTTOM }]}
                {...HEADER_GRADIENT}
            >
                <View style={[styles.navBar]}>
                    <Touchable
                        style={[styles.navIcon, styles.chevronLayout]}
                        onPress={closeModal}
                        accessibilityLabel="Back"
                        accessibilityHint="Go back to the previous screen"
                        hitSlop={20}
                        onPressIn={() => setIconPressed(true)}
                        onPressOut={() => setIconPressed(false)}
                    >

                      <View  style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                          accessible={false} importantForAccessibility="no">
                         <Xclose/>
                      </View>
                    </Touchable>
                    <Text style={styles.title}>{title}</Text>
                    <Touchable
                        style={[styles.navIcon, styles.chevronLayout]}
                        onPress={loadAndSharePDF}
                        accessibilityLabel="Share"
                        accessibilityHint="Share your Billing History"
                        hitSlop={20}
                        onPressIn={() => setIconPressed(true)}
                        onPressOut={() => setIconPressed(false)}
                    >

                        <View  style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                          accessible={false} importantForAccessibility="no">
                         <Share color={Color.sparklightWhite}/>
                      </View>
                    </Touchable>                 
                </View>
          </LinearGradient>
          <View style={styles.pdfWrap}>
            <Pdf
                source={{uri: convertUrl}}
                enableTextSelection={false}
                style={styles.pdf}/>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdfWrap: {
    flex: 1,
    width: "100%",
  },
  pdf: {
    flex:1,
    width:"100%",
    height:"100%",
  },
  profileSettingsChild: {
    overflow: "hidden",
    width: "100%",
    zIndex: 1
  },
  navBar: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Center items in navBar
      paddingHorizontal: 8, // Added for spacing
  },
  title: {
      flex: 1,
      fontSize: FontSize.size_lg,
      textAlign: 'center',
      fontWeight: '600',
      color: Color.sparklightWhite,
      fontFamily: FontFamily.RadioCanadaSemiBold,
      padding: 8,
  },
  chevronLayout: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: A11Y.minTouch,
      minWidth: A11Y.minTouch,
      zIndex: 1
  },
  icon: {
      height: 24,
      width: 24,
  },
  iconPressed: { // Style for icon when pressed
      opacity: 0.5, // Change opacity on press
  },
  navIcon: {

  }
});

export default PDFViewModal;
