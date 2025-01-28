import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Pdf from 'react-native-pdf';
import sharePDF from 'react-native-share-pdf';
import { Padding, Color, FontFamily, Border, FontSize } from '../../../GlobalStyles';

const PDFViewModal = ({ url, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [iconPressed, setIconPressed] = useState(false);
  const convertUrl = 'data:application/pdf;base64,' + url;

  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  const loadAndSharePDF = async () => {
    const showError = await sharePDF(url, 'billinghistory.pdf');
    if (showError !== undefined) {
      console.log(showError);
    }
  };  

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <LinearGradient
          style={[styles.profileSettingsChild, { paddingTop: 40 }]}
          locations={[0, 1]}
          colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
          useAngle={true}
          angle={90}
      ></LinearGradient>      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            <LinearGradient
                style={[styles.profileSettingsChild, { paddingTop: 40 }]}
                locations={[0, 1]}
                colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
                useAngle={true}
                angle={90}
            >
                <View style={[styles.navBar]}>
                    <Pressable
                        style={[styles.navIcon, styles.chevronLayout]}
                        onPress={closeModal}
                        accessibilityLabel="Back"
                        accessibilityHint="Go back to the previous screen"
                        accessibilityRole="button"
                        accessible={true}
                        hitSlop={20}
                        onPressIn={() => setIconPressed(true)}
                        onPressOut={() => setIconPressed(false)}
                    >
                      <Image
                          style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                          resizeMode="cover"
                          source={require("../../../assets/xclose.png")}
                          accessible={false}
                      />
                    </Pressable>
                    <Text style={styles.title}>Billing History</Text>
                    <Pressable
                        style={[styles.navIcon, styles.chevronLayout]}
                        onPress={loadAndSharePDF}
                        accessibilityLabel="Share"
                        accessibilityHint="Share your Billing History"
                        accessibilityRole="button"
                        accessible={true}
                        hitSlop={20}
                        onPressIn={() => setIconPressed(true)}
                        onPressOut={() => setIconPressed(false)}
                    >
                        <Image
                            style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                            resizeMode="cover"
                            source={require("../../../assets/share.png")}
                            accessible={false}
                        />
                    </Pressable>                 
                </View>
          </LinearGradient>      
          <View style={{width:'100%',height:'100%',}}>
            <Pdf
                source={{uri: convertUrl}}
                style={styles.pdf}/>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    alignSelf:'flex-end',
    color: "white",
    fontSize: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  closeBtn: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  }, buttonsLayout: {
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
  pdf: {
    flex:1,
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
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
      fontFamily: FontFamily.openSansSemiBold,
      padding: 8,
  },
  chevronLeft: {
      position: 'absolute',
      left: 18,
  },
  chevronRight: {
      position: 'absolute',
      right: 18,
  },
  chevronLayout: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 24,
      width: 24,
      zIndex: 1
  },
  chevronLeftLayout: {
      height: 24,
      width: 24,
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
