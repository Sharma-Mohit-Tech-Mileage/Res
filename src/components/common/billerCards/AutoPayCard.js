import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import DollerIconBg from "../../../res/svgIcons/DollerIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding ,Color} from "../../../../GlobalStyles";
import { Env }  from "../../../network/apis/account/Constants";
const AutoPayCard = ({ cardDigit, isAutoPayStatus, navigation }) => {
  return (
    <View style={styles.shadowContainer}>
      <View style={styles.card}>
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
              <Text style={[styles.dueDate, { fontWeight: '400' , color: colors.gray600 }]}>Account ending in  </Text>
              <Text style={[styles.dueDate]}>{cardDigit}</Text>
              </View>
              <Text style={styles.autoPayStatusText}>Auto Pay On</Text>
              <Text style={styles.thankYouText}>Thank you for choosing Auto Pay!</Text>
            </>
          ) : (
            <>
              <Text style={styles.autoPayStatusTextInActive}>Auto Pay Off</Text>
              <Text style={[styles.dueDate,{marginVertical:5}]}>Turn on Auto Pay today!</Text>
              <Text style={styles.subText}>Never miss a payment with peace of mind.</Text>
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AutoPayPCIConnector", {
                url: `${Env.URL}/billing`,
                name: "Billing Details",
              });
            }}
            accessible={true}
            accessibilityLabel="Manage Auto Pay"
            accessibilityRole="button"
            style={styles.paymentButton}
          >
            <Text style={styles.paymentButtonText}>Manage Auto Pay</Text>
            <View style={{ marginLeft: 2 }}>
              <RightArrow color={colors.snow_white} />
            </View>
          </TouchableOpacity>
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
    width: wp('90%'), // Adjust the width to fit properly
  },
  leftSection: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    height: '100%',
    position: 'relative',
  },
  circleContainerShadow: {
    position: 'absolute',
    top: '50%',
    left: -wp('38.75%') - 10,
    width: wp('84%'),
    height: wp('84%'),
    borderRadius: wp('41.5%'),
    backgroundColor: colors.grey,
    transform: [{ translateY: -wp('41.5%') }],
  },
  circleContainer: {
    position: 'absolute',
    top: '50%',
    left: -wp('38.75%') - 5,
    width: wp('77.5%'),
    height: wp('77.5%'),
    borderRadius: wp('38.75%'),
    backgroundColor: colors.sparklight_bright_purple,
    transform: [{ translateY: -wp('38.75%') }],
  },
  icon: {
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  leftTitle: {
    color: colors.snow_white,
    fontSize: 18,
    fontWeight: "400",
    textAlign: 'center',
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  cardContent: {
    flex: 1,
    padding: Padding.p_base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    alignContent: 'center',
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlign: 'center',
    fontWeight: "700",
    marginVertical: 20,
  },
  subText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginVertical: 5,
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
    marginVertical: 12,
  },
  autoPayStatusTextInActive: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark_grey,
    backgroundColor: Color.backgound_blue,
    textAlign: 'center',
    borderColor: colors.dark_grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: 12,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sparklight_purple_blue,
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 14,
    fontWeight: "600",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FontFamily.openSansRegular,
  },
});

export default AutoPayCard;
