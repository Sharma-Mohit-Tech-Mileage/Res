import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import PaperIconBg from "../../../res/svgIcons/PaperIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import { CommonActions } from '@react-navigation/native';
const PeperLessCard = ({ billAmt, paperLessInfo, isAutoPayStatus, paperlessStatus, navigation, style }) => {

  return (
    <View style={styles.shadowContainer}>
      <View style={[styles.card, style]}>
        <View style={styles.leftSection}>
          <View style={styles.circleContainerShadow}></View>
          <View style={styles.circleContainer}></View>
          <View style={styles.icon}><PaperIconBg /></View>
          <Text style={styles.leftTitle}>Paperless Billing</Text>
        </View>
        <View style={styles.cardContent}>
          {paperlessStatus ? (
            <>
              <Text style={[styles.dueDate, { fontWeight: '400', color: colors.gray600 }]}>Email Associated: </Text>
              <Text style={[styles.dueDate]}>{paperLessInfo.emailAddress}</Text>
              <Text style={styles.autoPayStatusText}>Paperless Billing On</Text>
              <Text style={styles.thankYouText}>Thank you for choosing Paperless Billing!</Text>
            </>
          ) : (
            <>
              <Text style={styles.autoPayStatusTextInActive}>Paperless Billing Off</Text>
              <View style={styles.headerContainer}>
                <Text style={[styles.dueDate]}>Turn on Paperless Billing today! <Text style={styles.subText}>Statements delivered via email.</Text></Text>
              </View>
            </>
          )}
          <View style={styles.statusRow}>
            <TouchableOpacity
             onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'account', params: { screen: 'Notifications' } },
                  ],
                })
              );
            }}
              accessible={true}
              accessibilityLabel="Manage Paperless"
              accessibilityRole="button"
              style={styles.paymentButton}
            >
              <Text style={styles.paymentButtonText}>Manage Paperless</Text>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Padding.p_xs,
    marginBottom: 23
  },
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
    width: wp('39%'),
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
    paddingVertical: Padding.p_base,
    paddingRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
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
    FontFamily: FontFamily.openSansRegular,
    marginTop: Padding.p_xs,
    marginBottom: 19,
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
    marginBottom: 12,
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

export default PeperLessCard;
