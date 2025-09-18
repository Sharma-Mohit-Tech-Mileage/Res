import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../res/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
import AppStyles from "../styles/AppStyles";
import InfoIcon1 from "../../../res/svgIcons/InfoIcon1";
import Tooltip from "rn-tooltip";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const Card = ({ billAmt, dueDate, navigation, style }) => {
  const NotAvailable = () => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Tooltip
          backgroundColor="#4C5458"
          overlayColor="#00000000"
          width={180}
          height={100}
          popover={
            <Text style={{ color: "#FFF" }}>
              Your due date takes 10 business days to generate. Please check
              back later.
            </Text>
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.dueDate}>{"Due "}</Text>
            <Text
              style={[
                styles.dueDate,
                { fontWeight: "400", color: colors.dark_grey },
              ]}
            >
              {"on: "}
            </Text>
            <Text
              style={[
                styles.dueDate,
                { textDecorationLine: "underline", marginRight: 5 },
              ]}
            >
              {"Not Available"}
            </Text>
            <InfoIcon1 />
          </View>
        </Tooltip>
      </View>
    );
  };

  return (
    <View style={[AppStyles.card, style]}>
      <View style={styles.cardHreader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.leftTitle}>Bill Summary</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            marginVertical: 15,
          }}
        >
          <Text
            style={[
              styles.label,
              {
                fontWeight: "600",
                color: colors.sparklight_grey,
                fontSize: 14,
                paddingBottom: 5,
                alignSelf: "center",
              },
            ]}
          >
            Total Amount Due
          </Text>
          {billAmt == undefined ? (
            <View style={{ alignSelf: "center" }}>
              <SkeletonPlaceholder>
                <>
                  <View
                    style={{
                      width: wp("30%"),
                      height: 20,
                      alignSelf: "flex-end",
                      borderRadius: 4,
                      marginVertical: 5,
                    }}
                  />
                  <View
                    style={{
                      width: wp("30%"),
                      height: 20,
                      alignSelf: "flex-end",
                      borderRadius: 4,
                      marginVertical: 5,
                    }}
                  />
                </>
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Text style={styles.amount}>${billAmt}</Text>
          )}

          {dueDate != "Invalid date" && billAmt != undefined && (
            <Text
              accessible={true}
              accessibilityLabel={`${
                dueDate
                  ? dueDate == "Immediately"
                    ? "Due Immediately"
                    : `By ${dueDate}`
                  : "Due on Not Available"
              }`}
              style={[
                styles.dueDate,
                {
                  color:
                    dueDate == "Immediately"
                      ? colors.sparklight_red
                      : colors.sparklight_grey,
                  fontWeight: dueDate == "Immediately" ? "400" : "700",
                },
              ]}
            >
              {dueDate ? (
                dueDate == "Immediately" ? (
                  "Due"
                ) : (
                  "By"
                )
              ) : (
                <NotAvailable />
              )}
              <Text
                style={[
                  styles.dueDate,
                  {
                    fontWeight: "600",
                    color:
                      dueDate == "Immediately"
                        ? colors.sparklight_red
                        : colors.sparklight_grey,
                  },
                ]}
              >
                {" " + dueDate}
              </Text>
            </Text>
          )}
        </View>
      </View>

      {billAmt != undefined ? (
        <View style={styles.cardFooter}>
          <TouchableOpacity
            onPress={() => {
              let billingURL = `${Env.ACP_BILLING}/billing`;
              console.log("Billing URL", billingURL);
              navigation.navigate("ArticalWindowUtility", {
                url: billingURL,
                name: "Billing Details",
              });
            }}
            accessible={true}
            accessibilityLabel="Make a Payment"
            accessibilityRole="button"
            style={styles.paymentButton}
          >
            <Text style={styles.paymentButtonText}>Make a Payment</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <SkeletonPlaceholder>
            <View
              style={{
                width: wp("70%"),
                height: 40,
                alignSelf: "center",
                borderRadius: 4,
                marginVertical: 10,
              }}
            />
          </SkeletonPlaceholder>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    width: wp("92%"),
  },
  leftTitle: {
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 10,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  amount: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    paddingBottom: 5,
    fontFamily: FontFamily.openSansRegular,
    color: colors.sp_black,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark_grey,
    alignSelf: "center",
    paddingBottom: 5,
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
  },
  label: {
    fontSize: 12,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    color: colors.gray600,
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: colors.sparklight_purple_blue,
    width: wp("80%"),
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    alignSelf: "center",
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
  },
  cardHreader: {
    flexDirection: "row",

    width: "100%",
    padding: 10,
  },
  cardFooter: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 10,
  },
});

export default Card;
