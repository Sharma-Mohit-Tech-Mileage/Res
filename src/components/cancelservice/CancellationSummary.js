import React, { useState } from "react";
import { View, Text, Pressable, ScrollView , Image} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";

import {
  Color,
  Padding,
  FontFamily,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";
import SecondaryButton from "../common/customui/SecondaryButton";
import ConfimationPopup from "./ConfirmationPopup";
import SuccessIcon from "../..//res/svgIcons/troubleshooting/SuccessIcon";


const CancellationSummary = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const[isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState(true);
  
   const renderSuccessMessage = () => {
    return (
      <View style={{ padding: 24, backgroundColor:'#F0F9F2', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../../assets/success.png')} size={48} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 22, fontWeight:'600', fontFamily:FontFamily.openSansRegular, color: Color.colorGray_200, textAlign:'center', marginHorizontal:24 }}>
          Your Sparklight Services Have Been Cancelled 
        </Text>
        <Text style={{textAlign:'center',marginTop:24,textDecorationLine:'underline', fontSize:14, fontWeight:'400',color:'#353091'}}> Print Confimation</Text>
      </View>
    );
   }


  const renderDeviceList = () => {
    // This function can be used to render a list of devices 
    const devices = [
        { name: "Modem", qty: 1, price: 5.0 },
        { name: "Router", qty: 2, price: 7.5 },
    ];

    const total = devices.reduce((sum, d) => sum + d.qty * d.price, 0);

    return (
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
            {/* Header Row */}
            <View style={{ flexDirection: "row", marginBottom: 8 ,backgroundColor:"#8D3B90", paddingVertical: 10}}>
                <Text style={{ flex: 1, fontWeight: "600", color: Color.sparklightWhite }}>  {'  Device'}</Text>
                <Text style={{ flex: 1, fontWeight: "600", color: Color.sparklightWhite, textAlign: "center",paddingHorizontal: 4 }}>Qty</Text>
                <Text style={{ flex: 1, fontWeight: "600", color: Color.sparklightWhite, textAlign: "right" ,paddingHorizontal: 4}}>{'Price per unit ' }</Text>
            </View>
            {/* Device Rows */}
            {devices.map((device, idx) => (
                <View key={idx} style={{ flexDirection: "row", marginBottom: 4, paddingVertical: 8, borderBottomWidth:(idx!=devices.length-1) ?1:0, borderBottomColor: Color.sparklightGray }}>
                    <Text style={{ flex: 1, color: Color.colorGray_200 }}>{device.name}</Text>
                    <Text style={{ flex: 1, color: Color.colorGray_200, textAlign: "center" }}>{device.qty}</Text>
                    <Text style={{ flex: 1, color: Color.colorGray_200, textAlign: "right" }}>${(device.price * device.qty).toFixed(2)}</Text>
                </View>
            ))}
            {/* Total Row */}
             <View style={{height: 1,backgroundColor: Color.sparklightGray,}} />
             <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: Color.sparklightBrightPurple, paddingVertical: 8, backgroundColor:"#F8F8F8" ,width:"60%", alignSelf:'flex-end'}}>
                
                <Text style={{ flex: 1, fontWeight: "700", color: Color.colorGray_200 }}>Total</Text>
                <Text style={{ flex: 1, fontWeight: "700", color: Color.colorGray_200, textAlign: "right" }}>${total.toFixed(2)}</Text>
            </View>
        </View>
    );

  }

  onCancel = () => {
    navigation.navigate("account", { screen: "Account" });
  };

  return (
    <View style={styles.rootContainer}>
      <ProfileSettingsHeader
        title="Cancellation Summary"
        iconAlignment="right"
        onPressBack={onCancel}
        showIcon={true}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <ScrollView style={{ flex: 1 , marginBottom:100}}>
      <View style={[AppStyles.card, { margin: 16 }]}>
        {renderSuccessMessage()}
        <Text style={styles.header}>We’re Sad To See You Go</Text>
        <View style={styles.seperator} />
        <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
          <Text style={styles.lableTxt}>Disconnection date</Text>
          <Text style={styles.valueTxt}>10/10/2023</Text>
        </View>
        <View style={styles.seperator} />
        <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
          <Text style={styles.lableTxt}>Services</Text>
          <Text style={styles.valueTxt}>Internet - 300 Mbps Internet </Text>
          <View  style={{ flexDirection: "row", marginTop: 5 }}>
           <Text style={{fontSize:16, fontWeight:'400' }}>Change Plan intead? Call </Text>
            <Text style={{color:Color.colorMidnightblue, textDecorationLine:'underline', fontSize:16, fontWeight:'700'}}>866-888-8888 </Text>
          </View>
        </View>
        <View style={styles.seperator} />
        <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
          <Text style={styles.lableTxt}>Monthly Price Plan</Text>
          <Text style={styles.valueTxt}>$XX.XX</Text>
        </View>

        <View style={styles.seperator} />
        <View style={{ paddingVertical: 5, paddingHorizontal: 24 }}>
          <Text style={styles.lableTxt}>Equipment</Text>
          <Text style={styles.valueTxt}>Leased Equipment Returns</Text>
        </View>
         <View style={styles.seperator} />
        {renderDeviceList()}

      </View>
      <View>
        <Pressable
          style={({ pressed }) => [
            { backgroundColor: Color.colorMidnightblue },
            styles.buttonsLayout,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => {
            // TODo
            onContinue(selectedOption);
          }}
          accessibilityRole="button"
          accessibilityLabel="Continue to Cancel   the service"
        >
          <Text style={[styles.makePayment, styles.makeTypo]}>
            {"Continue to cancel"}
          </Text>
        </Pressable>
        <View style={styles.buttonsParent}>
          <SecondaryButton
            text="Don't Cancel"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Don't Cancel"
            accessibilityHint="Double tap to return to Profile Settings"
          />
        </View>
         <ConfimationPopup
            visible={isConfirmationPopupVisible}
            message={"Please review before continuing. Changes can’t be made after submission."}
            title={"Is your information correct? "}
            onActionTxt={"Confirm Cancellation"}
            onAction={() => {
              setIsConfirmationPopupVisible(false);
            }}
            onClose={() => {
                setIsConfirmationPopupVisible(false);
            }}
          />
      </View>
      </ScrollView>
    </View>
  );
};
const styles = {
  rootContainer: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    marginHorizontal: 16,
    marginTop: 16,
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
  makePayment: {
    color: Color.sparklightWhite,
    width: 282,
  },
  buttons1: {
    marginTop: Padding.p_base,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
    width: 382,
  },
  buttonsParent: {
    marginTop: Padding.p_base,
    alignSelf: "stretch",
  },
  lableTxt: {
    fontSize: FontSize.size_sm,
    fontWeight: "600",
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight:16
  },
  valueTxt: {
    fontSize: FontSize.size_base,
    fontWeight: "700",
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight:18,
    marginTop:5
  },
  seperator: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    marginVertical: Padding.p_base,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    selfAlign: "center",
    fontWeight: "700",
    marginVertical: 24,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
};

export default CancellationSummary;
