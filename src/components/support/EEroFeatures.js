import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Platform, Linking } from "react-native";
import { FontFamily, Padding, Color, FontSize, Border, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useNavigation} from "@react-navigation/native";
import { useDispatch} from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import WifiScheduling from "../../res/svgIcons/WifiScheduling";
import AdvanceSecurity from "../../res/svgIcons/AdvanceSecurity";
import MultiAdmin from "../../res/svgIcons/MultiAdmin";
import SparkLightButton from "../common/customui/PrimaryButton";

const EEroFeatures = (props) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const eeroFeatures = [
    {
      title: "Wifi Scheduling",
      icon: <WifiScheduling />
    },
    // {
    //   title: "Internet Backup",
    //   icon: <InternetBackUp />
    // },
    {
      title: "Multi-Admin",
      icon: <MultiAdmin />
    },
    {
      title: "Advanced Security",
      icon: <AdvanceSecurity />
    }
  ]

  return (
    <View style={styles.viewBackground}>
      <ProfileSettingsHeader
        title={"eero Features"}
        onPressBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: '15%'}}
      style={{marginBottom: '25%'}}
      >
        <View style={styles.viewBackgroundContainer}>
          <View style={{ height: 180 }}>
          <Image style={{width: '100%',height: '100%',resizeMode: 'cover'}} source={require('../../../assets/eero_device.png')} />
            {/* <EEroDevice /> */}
          </View>
          <Text style={styles.eeroText}>{`always connected.`}</Text>
          <Text style={[styles.reliabilityText,{color: '#8D3B90'}]}>{`Always working for you.`}</Text>

          <View style={{
            paddingVertical: Padding.p_13xl
          }}>
            {eeroFeatures.map((item, index) => {
              return (
                <View 
                accessible={true}
                accessibilityLabel={item.title}
                justifyContent="flex-start"
                height= {60}
                style={{
                  flexDirection: 'row',
                  justifyContent: "space-between",
                  paddingHorizontal: Padding.p_5xl,
                  paddingVertical: Padding.p_5xs,
                  backgroundColor: index % 2 == 0 ? Color.colorWhitesmoke_100 : Color.sparklightWhite
                }}>
                  <View style={{
                    flexDirection: "row",
                    alignItems :"center"
 }}>
                  <View style={{ width: 60}}>
                    {item.icon}
                    </View>
                    <Text style={{
                      fontFamily: FontFamily.openSansRegular,
                      color: Color.sparklightGray1,
                      fontSize: FontSize.size_base,
                    }}>{`${item.title}`}</Text>
                  </View>
                  <Image style={styles.lockIcon} source={require('../../../assets/checkcircle.png')} />
                </View>
              )
            })}
            <Text style={[styles.reliabilityText,{paddingTop: Padding.p_13xl}]}>{`And much more!`}</Text>
          </View>
        </View>
        <View
          style={styles.buttonContainer}>
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Open the eero App"
            style={[styles.button, styles.buttonsLayout]}
            onPress={() => { 
              if (Platform.OS === 'android') {
                Linking.openURL('https://play.google.com/store/apps/details?id=com.eero.android');
              } else {
                Linking.openURL('https://apps.apple.com/us/app/eero-wifi-system/id1023499075');
              }
            }}
          >
            <Text style={[styles.accept]}>
              {`Open the eero App`}
            </Text>
          </Pressable>
        </View>
        <View style={{ paddingHorizontal: Padding.p_5xl }} >
          <SparkLightButton title='Cancel' onPress={() => navigation.goBack()} 
            accessibilityLabel="Cancel button" 
            accessibilityHint="Goes back to the previous screen" 
            accessibilityRole="button" />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBackgroundContainer: {
    paddingTop: Padding.p_base,
    backgroundColor: Color.sparklightWhite,
    margin: Padding.p_5xl
  },
  viewBackground: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  titleText: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontSize: FontSize.size_3xl,
  },
  inputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    padding: 20
  },
  focusedContainer: {
    color: Color.sparklightBrightPurple
  },
  image: {
    width: 24,
    height: 24,
  },
  textInput: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: Padding.p_5xl
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    width: '100%',
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  reliabilityText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.interBold,
    textAlign: "center",
    color: Color.colorMidnightblue,
  },
  eeroText: {
    fontSize: FontSize.size_6xl,
    fontFamily: FontFamily.interBold,
    textAlign: "center",
    color: Color.colorGray_100,
    marginTop: 5
  },
  errorText: {
    color: 'red',
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  firstName1: {
    color: Color.sparklightGray1,
    fontSize: FontSize.textXsSemibold_size,
    alignSelf: "stretch",
  },
  firstTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_base,
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: 10,
    paddingVertical: Padding.p_5xs
  },
  notificationsSentFrom: {
    marginLeft: 8,
    color: Color.colorGray_100,
    fontWeight: '400',
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_200,
    marginLeft: 8,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  text: {
    color: Color.colorMidnightblue,
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
  infoCircleIcon: {
    width: 18,
    height: 18,
    marginTop: -3
  },
  infoCircleWrapper: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    alignSelf: "center"
  }
});



export default EEroFeatures;

