import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../res/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding } from "../../../../GlobalStyles";
import Config from "react-native-config";
import InfoIcon1 from "../../../res/svgIcons/InfoIcon1";
import Tooltip from "rn-tooltip";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../../../styles/AppStyles";
import PrimaryButton from "../customui/PrimaryButton";
import { SectionTitle } from "../customui/Typography";
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
    <View style={[AppStyles.card,{marginBottom: 16}]}>
      <View style={styles.cardHreader}>
        <View
          style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}
        >
          {/* <View style={{ alignSelf: "center" }}>
            <WalletSummaryIcon />
          </View> */}

          <SectionTitle style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2}>
            Bill Summary
          </SectionTitle>
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
                fontWeight: "400",
                color: colors.Black_100,
                fontSize: 18,
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
                      : colors.darkest_grey,
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
                    fontWeight: "400",
                    color:
                      dueDate == "Immediately"
                        ? colors.sparklight_red
                        : colors.darkest_grey,
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
          <PrimaryButton
            title={"Make a Payment"}
            buttonType='submit'
            onPress={() => {
              navigation.navigate("MakePayment");
            }}
            accessible={true}
            accessibilityLabel="Make a Payment"
            accessibilityRole="button"
            minSize={0}
            style={{width:'100%'} }
          >
            
          </PrimaryButton>
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
  leftTitle: {
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
    color: colors.darkest_grey,
    alignSelf: "center",
    paddingBottom: 5,
    fontFamily: FontFamily.openSansRegular,
  },
  label: {
    fontSize: 12,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    color: colors.gray600,
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
    backgroundColor: "#F8F8F8",
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  cardFooter: {
    width: "90%",
    alignSelf: "center",
    margin: 10,
    paddingBottom: 10,
  },
});

export default Card;
