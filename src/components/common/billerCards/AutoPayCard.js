import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import DollerIconBg from "../../../res/svgIcons/DollerIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding ,Color} from "../../../../GlobalStyles";
import { Env }  from "../../../network/apis/account/Constants";
import { getUser } from "../../../redux/utils/LocalStorage";
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
const AutoPayCard = ({ cardDigit, isAutoPayStatus, paymentDetails,navigation ,style}) => {
  const [useNewPayment, setUseNewPayment] = useState(false);
  const getStatus = () => {
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      setUseNewPayment(accountNumber.toString().length >= 16);
    });
  };
  useEffect(() => {
    getStatus();
  }, []);

  return (
    <View style={styles.shadowContainer}>
      <View style={[styles.card,style]}>
        {/* <View style={styles.leftSection}>
          <View style={styles.circleContainerShadow}></View>
          <View style={styles.circleContainer}></View>
          <View style={styles.icon}><DollerIconBg /></View>
          <Text style={styles.leftTitle}>Auto Pay</Text>
        </View> */}
        <View style={styles.cardContent}>

        <View style={styles.cardHreader}>
            <View
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ alignSelf: "center" }}>
              <AutoPayIcon/>
              </View>

              <Text style={styles.leftTitle}>Auto Pay</Text>
            </View>
          </View>
          {isAutoPayStatus ? (
            <>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.dueDate, { fontWeight: '400' , color: colors.gray600 }]}>Account ending in  </Text>
              <Text style={[styles.dueDate]}>{cardDigit}</Text>
              </View>
              <Text style={styles.autoPayStatusText}>Auto Pay On</Text>
              <Text style={styles.thankYouText}>Thank you for choosing Auto Pay!</Text>
            </>
          ) : (
            <>
              <Text style={styles.autoPayStatusTextInActive}>Auto Pay Off</Text>
              <Text style={[styles.infoAuto]}>Turn on Auto Pay today!  <Text style={styles.subText}>Never miss a payment with peace of mind.</Text></Text>
            </>
          )}
          <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AutoPayPCIConnector", {
                url: `${Env.URL}/billing`,
                name: isAutoPayStatus ?"Manage Auto Pay":"Setup Auto Pay",
                useNewPayment: useNewPayment,
                status: isAutoPayStatus,
                paymentDetails:paymentDetails
              });
            }}
            accessible={true}
            accessibilityLabel={isAutoPayStatus ?"Manage Auto Pay":"Setup Auto Pay"}
            accessibilityRole="button"
            style={styles.paymentButton}
          >
            <Text style={styles.paymentButtonText}>{isAutoPayStatus?'Manage Auto Pay':'Setup Auto Pay'}</Text>
            <View style={{marginLeft:2}}>
                <RightArrow color={colors.snow_white} />
              </View>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    overflow: 'hidden',
    width: wp('92%'),
  },
  
  leftTitle: {
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginLeft: 10,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  cardContent: {
    alignItems:"center",
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    alignContent: 'center',
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: 'center',
    marginVertical: 5,
  },
  infoAuto: {
    fontSize: 14,
    fontWeight: "600",
    alignContent: 'center',
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: 'center',
    marginTop: Padding.p_xs,
    marginHorizontal:Padding.p_xs,
    marginBottom: 23,
  },
  thankYouText: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlign: 'center',
    fontWeight: "700",
    marginTop: Padding.p_xs,
    marginBottom: 23,
  },
  subText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
  },
  autoPayStatusText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.sparklight_green,
    backgroundColor: Color.success50,
    textAlign: 'center',
    borderColor: colors.sparklight_green,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop:13,
    marginBottom: Padding.p_base,
  },
  autoPayStatusTextInActive: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark_grey,
    backgroundColor: Color.sparklightGray,
    textAlign: 'center',
    borderColor: colors.dark_grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: Padding.p_xs,
    marginTop:Padding.p_xs,
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: colors.sparklight_purple_blue,
    width:wp("80%"),
    paddingVertical: 8,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    alignSelf: "center",
    marginLeft: wp("4%"),
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf:'center',
    fontFamily: FontFamily.openSansRegular,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },cardHreader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width:wp("92%"),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },cardFooter: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width:wp("92%"),
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default AutoPayCard;
