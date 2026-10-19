import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { wp } from "../../../utils/responsive";
import { FontFamily, Color } from "../../../styles/GlobalStyles";
import InfoIcon1 from "../../../res/svgIcons/InfoIcon1";
import Tooltip from "rn-tooltip";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../../../styles/AppStyles";
import PrimaryButton from "../customui/PrimaryButton";
import { SectionTitle, FieldTitle, Hyperlink } from "../customui/Typography";
import Touchable from "../customui/Touchable";
import RightIcon from "../../../../assets/svgs/Chevonright";
import { theme } from "../../../styles/theme";
const Card = ({ billAmt, dueDate, navigation, style, explainerUrl, explainerLoading }) => {
  const NotAvailable = () => {
    return (
      <View style={{ flexDirection: "column" }}>
        <Tooltip
          backgroundColor={Color.sparklightGray1}
          overlayColor="#00000000"
          width={180}
          height={100}
          popover={
            <Text style={{ color: Color.sparklightWhite }}>
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
                { fontWeight: "400", color: Color.sparklightGray1 },
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
    <View style={AppStyles.card}>
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
                color: Color.colorblack_100,
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
                      ? Color.sparkLightRed
                      : Color. colorGray_200,
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
                        ? Color.sparkLightRed
                        : Color. colorGray_200,
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

      {explainerLoading && billAmt != undefined && (
        <View style={styles.explainerRow} accessible accessibilityLabel="Loading bill explainer" accessibilityState={{ busy: true }}>
          <View style={styles.explainerText}>
            <SkeletonPlaceholder>
              <View>
                <View style={styles.explainerSkeletonTitle} />
                <View style={styles.explainerSkeletonLine} />
              </View>
            </SkeletonPlaceholder>
          </View>
        </View>
      )}

      {!explainerLoading && explainerUrl && billAmt != undefined && (
        <Touchable
          style={styles.explainerRow}
          minSize={0}
          onPress={() => navigation.navigate("ArticleWindowUtility", { name: "Bill Explainer", url: explainerUrl, quickPayToNative: true })}
          accessibilityRole="link"
          accessibilityLabel="Understand your bill. Get instant clarity on every charge."
          accessibilityHint="Double tap to open the Bill Explainer."
        >
          <View style={styles.explainerText}>
            <FieldTitle accessible={false}>Understand your bill</FieldTitle>
            <Hyperlink accessible={false}>Get instant clarity on every charge.</Hyperlink>
          </View>
          <RightIcon />
        </Touchable>
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
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.Black_100,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    color: Color. colorGray_200,
    alignSelf: "center",
    paddingBottom: 5,
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  label: {
    fontSize: 12,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.sparklightGray1,
  },
  
  paymentButtonText: {
    color: Color.sparklightWhite,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  cardHreader: {
   flexDirection: "row",
    backgroundColor: Color.colorWhitesmoke_100,
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  explainerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: Color.dividerLight,
  },
  explainerText: { flex: 1, marginRight: theme.spacing.sm },
  explainerSkeletonTitle: { width: "50%", height: 16, borderRadius: 4 },
  explainerSkeletonLine: { width: "80%", height: 14, borderRadius: 4, marginTop: theme.spacing.xs },
  cardFooter: {
    width: "90%",
    alignSelf: "center",
    margin: 10,
    paddingBottom: 10,
  },
});

export default Card;
