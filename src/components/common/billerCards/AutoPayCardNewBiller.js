import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import DollerIconBg from "../../../res/svgIcons/DollerIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
const AutoPayCardNewBiller = ({ cardDigit, isAutoPayStatus, navigation, style }) => {
  return (
    <View style={styles.shadowContainer}>
      <View style={[styles.card, style]}>
        <View style={styles.leftSection}>
          <View style={styles.circleContainerShadow}></View>
          <View style={styles.circleContainer}></View>
          <View style={styles.icon}><DollerIconBg /></View>
          <Text style={styles.leftTitle}>Auto Pay</Text>
        </View>
        <View style={styles.cardContent}>
          {cardDigit ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.dueDate, { fontWeight: '400', color: colors.gray600 }]}>Account ending in  </Text>
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
          <View style={styles.statusRow}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AutoPayPCIConnector", {
                  url: Env.EASYPAYNEW,
                  name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
                  useNewPayment: true,
                  status: isAutoPayStatus
                });
              }}
              accessible={true}
              accessibilityLabel={isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay"}
              accessibilityRole="button"
              style={styles.paymentButton}
            >
              <Text style={styles.paymentButtonText}>{isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay"}</Text>
              <View style={{ marginLeft: 2 }}>
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
    width: wp('85%'),
  },
  leftSection: {
    paddingHorizontal: Padding.p_5xl,
    paddingBottom: Padding.p_xs,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    height: '100%',
    position: 'relative',
  },
  circleContainerShadow: {
    position: 'absolute',
    top: '50%',
    left: -wp('38.75%') - 20,
    width: wp('84%'),
    height: wp('84%'),
    borderRadius: wp('41.5%'),
    backgroundColor: 'rgba(71, 84, 103, 0.05)',
    transform: [{ translateY: -wp('41.5%') }],
  },

  circleContainer: {
    position: 'absolute',
    top: '50%',
    left: -wp('38.75%') - 15,
    width: wp('77.5%'),
    height: wp('77.5%'),
    borderRadius: wp('38.75%'),
    backgroundColor: colors.sparklight_bright_purple,
    transform: [{ translateY: -wp('38.75%') }],
  },
  icon: {
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    paddingRight: 24,
  },
  leftTitle: {
    color: colors.snow_white,
    fontSize: 18,
    fontWeight: "400",
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    paddingRight: 24,
  },
  cardContent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    paddingRight: Padding.p_base,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('60%'),
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
    marginTop: 13,
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
    marginVertical: Padding.p_base,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sparklight_purple_blue,
    paddingLeft: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 14,
    fontWeight: "600",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    fontFamily: FontFamily.openSansRegular,
  },
});

export default AutoPayCardNewBiller;
