import React, { useEffect, useState, useCallback, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import NotificationAlert from "../common/customui/NotificationAlert";
import moment from "moment";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import AppStyles from "../utility/AppStyles";
import { PostApiRequest } from "../../network/APIClient";
import { fetchBillingBreakdown , fetchBillExplainer} from "../../redux/actions/billingBreakdownActions";

import {
  selectBillingBreakDownLoading,
  selectBillingBreakDownData,
  selectBillingBreakDownError,
  selectBillExplainerData,
} from "../../redux/selectors/billingBreakdownSelectors";

import { InfoIcon } from "native-base";
import BillErrorIcon from "../../res/svgIcons/BillBreakDownErrorIcon";
import SecondaryButton from "../common/customui/PrimaryButton";
import LoadingOverlay from "../common/customui/CustomLoading";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


// Constants
const PLACEHOLDER_MESSAGE =
  "The bill breakdown reflects your latest monthly statement, showing last month's usage, charges, credits, and adjustments. It's a snapshot in time and might not capture recent account changes post-statement.";
const SERVICE_DISCOUNT = "Service Discount";
const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";
const MIN_DATE_PREFIX = "0001";
const ERROR_204 =
  "We’re sorry, your data could not be retrieved at this time. Please try again in a little while.";
const ERROR_404 =
  "We’re sorry, your data is not available at this time. Please check back after your current billing cycle.";

/**
     * 
      renderErrorMessage - Renders an error message if there is an error.
     */

const renderErrorMessage = (errorCode, navigation) => {
  console.log("Error Code:", errorCode);
  return (
    <View style={{ flexDirection: "column", margin: 8 }}>
      <View style={[AppStyles.card, { margin: 16 }]}>
        <View style={styles.errorContainer}>
          <BillErrorIcon color="red" size={24} style={{ marginBottom: 8 }} />
          <Text style={styles.errorTxt}>
            {errorCode.includes("404") ? ERROR_404 : ERROR_204}
          </Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: Color.colorMidnightblue },
          styles.buttonsLayout,
          { opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={() => {
          console.log("Return to Billing Services button pressed");
          navigation.goBack();
        }}
        accessibilityRole="button"
        accessibilityLabel="Return to Billing Services"
      >
        <Text style={[styles.makePayment, styles.makeTypo]}>
          {"Return to Billing Services"}
        </Text>
      </Pressable>
      <View style={styles.buttonsParent}>
        <SecondaryButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Cancel"
          accessibilityHint="Double tap to return to notifications screen"
        />
      </View>
    </View>
  );
};

const DetailItem = memo(({ detail }) => {
  const hasExpiryDate = !detail.endDate.startsWith(MIN_DATE_PREFIX);
  const isDiscount =
    detail.description === SERVICE_DISCOUNT ||
    detail.description.toLowerCase().includes("discount") ||
    (hasExpiryDate && parseFloat(detail.amount) < 0) || // BCP line with expiry date
    (detail.description.toLowerCase().includes("ridge") &&
      parseFloat(detail.amount) < 0); // Ridge discounts

  // Skip items with specific types AND promotional discount in description AND zero amount
  // Also skip items that contain "promotional discount will end" text with zero amount
  const shouldSkipItem =
    (detail.type &&
      ["300", "301", "CH", "CHG", "MMDTT"].includes(detail.type) &&
      detail.description &&
      detail.description.toLowerCase().includes("promotional discount") &&
      parseFloat(detail.amount) === 0) ||
    (detail.description &&
      detail.description.toLowerCase().includes("promotional discount will") &&
      parseFloat(detail.amount) === 0);

  // Skip rendering this item if it matches the filter criteria
  if (shouldSkipItem) return null;

  const textStyle = isDiscount ? { color: styles.colorGreen } : {};

  return (
    <View style={[styles.detailRow, styles.detailItemBorder]}>
      <View style={styles.detailLabelContainer80}>
        <Text
          style={[styles.detailLabelNormal, textStyle]}
          numberOfLines={2}
          ellipsizeMode="tail"
          accessible={true}
          accessibilityLabel={`${detail.description}`}
        >
          {detail.description}
        </Text>
        {hasExpiryDate && (
          <View style={styles.discountExpiryContainer}>
            <InfoIcon size="xs" color={Color.colorGray_200} />
            <Text
              style={styles.discountExpiryText}
              accessible={true}
              accessibilityLabel={`Discount expires on ${moment(
                detail.endDate,
              ).format(DEFAULT_DATE_FORMAT)}`}
            >
              Discount expires on{" "}
              {moment(detail.endDate).format(DEFAULT_DATE_FORMAT)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.detailValueContainer20}>
        <Text
          style={[styles.detailValueNormal, textStyle]}
          numberOfLines={2}
          ellipsizeMode="tail"
          accessible={true}
          accessibilityLabel={`${parseFloat(detail.amount).toFixed(2)}`}
        >
          ${parseFloat(detail.amount).toFixed(2)}
        </Text>
      </View>
    </View>
  );
});

/**
 * Break Down Item component
 * Renders a billing category with header and detail items
 */
const BreakDownItem = memo(({ item }) => {
  if (!item || !item.header) return null;

  return (
    <View style={styles.paymentRow}>
      {/* Header section */}
      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Text
              style={styles.detailLabel}
              numberOfLines={2}
              ellipsizeMode="tail"
              accessible={true}
              accessibilityRole="header"
              accessibilityLevel={2}
            >
              {item.header.description}
            </Text>
          </View>
          <View style={styles.detailValueContainer}>
            <Text
              style={[styles.detailValue, styles.boldText]}
              numberOfLines={2}
              ellipsizeMode="tail"
              accessible={true}
              accessibilityLabel={`${item.total.amount}`}
            >
              ${parseFloat(item.total.amount).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Detail items */}
      {item.details?.map((detailGroup, index) => (
        <React.Fragment key={`detail-group-${index}`}>
          {detailGroup?.detail.map((detailItem, subIndex) => (
            <DetailItem
              key={`detail-item-${index}-${subIndex}`}
              detail={detailItem}
            />
          ))}
        </React.Fragment>
      ))}
    </View>
  );
});

/**
 * Footer component showing the total balance due
 */
const TotalBalanceFooter = memo(({ totalAmount , showBillExplainer, renderBillExplainerLink , navigation, explainerLoading }) => (
  <>
    <View style={[styles.detailRow, styles.footerContainer]}>
      <Text
        style={styles.totalBalanceLabel}
        accessible={true}
        accessibilityLabel="Total Balance Due"
      >
        Total Balance Due
      </Text>
      <Text
        style={styles.totalBalanceValue}
        accessible={true}
        accessibilityLabel={`${totalAmount.toFixed(2)}`}
      >
        ${totalAmount.toFixed(2)}
      </Text>
      <View style={[styles.detailItemBorder, styles.totalBalanceSeparator]} />
    </View>
    {explainerLoading ? (
      <View style={styles.billPlanermainContainer}>
        <SkeletonPlaceholder>
          <View
            style={{
              width: wp("80%"),
              height: 20,
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              width: wp("60%"),
              height: 20,
              borderRadius: 4,
            }}
          />
        </SkeletonPlaceholder>
      </View>
    ) : showBillExplainer ? (
      <View style={styles.billPlanermainContainer}>
        <Text style={styles.billExplainerText}>
          Still have questions about your bill?
        </Text>
       <View style={{ flexDirection: "row" }}>
        <Text style={styles.billExplainerText}>
          Try our new{' '}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text
            accessibilityRole="link"
            accessibilityLabel="Open Bill Explainer"
            accessibilityHint="Double tap to open link"
            accessible={true}
            style={styles.billExplainerLinkText}
            onPress={() => renderBillExplainerLink(navigation)}
          >
            Bill Explainer
          </Text>
          <Text accessible={false} importantForAccessibility="no" style={[styles.billExplainerLinkText, { textDecorationLine: 'none' }]}>!</Text>
        </View>
        </View>
      </View>
    ) : null}
    <View style={[styles.detailItemBorder]} />
  </>
));

/**
 * Handler for Bill Explainer link press
 */
const renderBillExplainerLink = (data, navigation) => {
  if (!data?.be_url) {  
    console.error("Bill Explainer link is not available");
    return;
  }
  navigation.navigate('ArticalWindowUtility', {
    name: "Bill Explainer",
    url: data.be_url
  });
};

/**
 * Empty state component when no billing data is available
 */
const EmptyState = memo(() => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No records found</Text>
  </View>
));

/**
 * Loading indicator component
 */
const LoadingIndicator = memo(() => (
  <View style={styles.loadingContainer}>
    <LoadingOverlay
      size="large"
      loading={true}
      color={Color.sparklightBrightPurple}
      accessible={true}
      accessibilityLabel="Loading billing breakdown data"
    />
  </View>
));

/**
 * Billing Breakdown Screen Component
 * Displays the user's billing breakdown, charges, and balance details.
 */
const BillingBreakDownScreen = ({ navigation }) => {
  // Redux state and dispatch
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const accountDetails = useSelector((state) => state.profile?.accountDetails);
  
  const loading = useSelector(selectBillingBreakDownLoading);
  const billingData = useSelector(selectBillingBreakDownData);
  const error = useSelector(selectBillingBreakDownError)

  const billExplainerData = useSelector(selectBillExplainerData);
  //const [billExplainerData, setBillExplainerData] = useState(null);
  
  const [showBillExplainer, setShowBillExplainer] = useState(false);
  const [explainerLoading, setExplainerLoading] = useState(true);

 
  // Local state
  const [totalDue, setTotalDue] = useState(0);
  const [errorCode, setErrorCode] = useState("");
  const [userMsg] = useState(PLACEHOLDER_MESSAGE);

  // Calculate total due whenever billing data changes
  useEffect(() => {
    if (!billingData?.length) return;

    // Reset total first
    let calculatedTotal = 0;

    // Calculate total due from all sections
    billingData.forEach((item) => {
      if (item?.total?.amount) {
        calculatedTotal += parseFloat(item.total.amount);
      }
    });

    setTotalDue(calculatedTotal);
  }, [billingData]);


   useEffect(() => {
    console.log("Account Details1:", accountDetails);
    if (!accountDetails?.hierarchy?.hierarchy_id) {
      setShowBillExplainer(true);
      setExplainerLoading(true);
      let requestBody = {
          customer_type: accountDetails?.customer_type,
          hierarchy_id: accountDetails?.hierarchy?.hierarchy_id,    
          account: user?.userInfo?.accountNumber,
          utmMedium: "web",
          utmSource: "selfcare_mobile",
          video: accountDetails?.services?.video,
          homesPassedId: accountDetails?.homes_passed_id || null
    }
    dispatch(fetchBillExplainer(requestBody));
    //getBillExplainerData(requestBody);
    }else{
      setShowBillExplainer(false);
      setExplainerLoading(false);
    }
  }, [accountDetails]);



  useEffect(() => {
    console.log("Bill Explainer Data:", billExplainerData);
    if(!billExplainerData?.eligibility){
      setShowBillExplainer(false);
      setExplainerLoading(false);
    }else{
      setShowBillExplainer(true);
      setExplainerLoading(false);
    }
  }, [billExplainerData]);

  // const getBillExplainerData =(requestBody) => {  
  //   PostApiRequest("api/GetBillExplainer/Get", requestBody ,(res)=>{
  //     console.log("Bill Explainer Response:", res);
  //     setBillExplainerData(res);
  //     }, (error) => { 
  //       console.error("Bill Explainer Error:", error);
  //     }

  //   )
  // };

  // Fetch billing data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // if(user.userInfo.accountNumber=='8160440040034354'){
      //   setErrorCode("204");
      //   return;
      // }
      if (user?.userInfo?.accountNumber == "8160440040062702") {
        setErrorCode("404");
        return;
      }

      dispatch(fetchBillingBreakdown());
      setTotalDue(0); // Reset total due on screen focus

      return () => {
        // Cleanup if needed
      };
    }, [dispatch]),
  );
  useEffect(() => {
    console.log("Error:123", errorCode);

    if (error && error.length > 0) {
      console.log("Error:123", error.includes("204"));
      setErrorCode(error);
    }
  }, [error]);

  // Handle back button press
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Memoized key extractor for FlatList
  const keyExtractor = useCallback(
    (item, index) => `billing-item-${index}`,
    [],
  );

  // Render content based on state
  const renderContent = () => {
    if (loading && (!billingData || billingData.length === 0)) {
      return <LoadingIndicator />;
    }

    if (!billingData || billingData.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlatList
        data={billingData}
        renderItem={({ item, index }) => <BreakDownItem item={item} />}
        keyExtractor={keyExtractor}
        style={styles.paymentsList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={<TotalBalanceFooter totalAmount={totalDue} showBillExplainer={showBillExplainer} navigation={navigation} renderBillExplainerLink={() => renderBillExplainerLink(billExplainerData, navigation)} explainerLoading={loading} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    );
  };

  return (
    <View
      style={styles.container}
      accessibilityLabel="Billing Breakdown screen"
    >
      <ProfileSettingsHeader
        title="Billing Breakdown"
        onPressBack={handleBackPress}
      />
      {errorCode ? (
        renderErrorMessage(errorCode, navigation)
      ) : (
        <View
          style={[AppStyles.card, styles.cardContainer, { marginBottom: 32 }]}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Warning message */}
            <View style={styles.alertContainer}>
              <NotificationAlert
                type="info"
                title=""
                message={userMsg}
                showCloseIcon={false}
                isVisible={true}
                autoFocusTitle={true}
                accessibilityLabel={userMsg}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                customStyle={styles.warningAlert}
              />
            </View>
            {/* Main content */}
            {renderContent()}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// Styles for the Billing Breakdown Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  cardContainer: {
    margin: 16,
  },
  alertContainer: {
    margin: Padding.p_5xl,
  },
  listContainer: {
    paddingBottom: hp("45%"),
  },
  header: {
    backgroundColor: Color.white,
    paddingTop: hp(5),
  },
  headerText: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.poppinsBold,
    color: Color.black,
  },
  errorTxt: {
    color: "#001321",
    fontSize: FontSize.size_base,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    minHeight: 150,
  },
  emptyContainer: {
    backgroundColor: Color.sparklightWhite,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 4,
    height: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    textAlign: "center",
  },
  paymentsList: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: 4,
    marginBottom: 100,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderRadius: 2,
    padding: 24,
    alignItems: "center",
    margin: 24,
  },
  paymentRow: {
    paddingHorizontal: Padding.p_base,
  },
  paymentDetails: {
    flex: 1,
    backgroundColor: "#EFEFF6",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: Padding.p_xs,
  },
  detailLabelContainer: {
    flex: 7,
    flexShrink: 1,
    justifyContent: "flex-start",
  },
  detailValueContainer: {
    flex: 3,
    flexShrink: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  detailLabelContainer80: {
    flex: 8,
    flexShrink: 1,
    justifyContent: "flex-start",
  },
  detailValueContainer20: {
    flex: 2,
    flexShrink: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  detailItemBorder: {
    borderBlockColor: Color.colorWhitesmoke_100,
    borderBottomWidth: 1.5,
  },
  detailDescriptionContainer: {
    flexDirection: "column",
  },
  detailLabel: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "400",
    textAlign: "right",
  },
  detailLabelNormal: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    fontWeight: "400",
  },
  detailValueNormal: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "400",
    textAlign: "right",
  },
  boldText: {
    fontWeight: "500",
  },
  discountExpiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C8E9D0",
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
    borderRadius: 2,
  },
  discountExpiryText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "400",
    marginLeft: 4,
  },
  footerContainer: {
    marginHorizontal: 16,
  },
  totalBalanceLabel: {
    fontSize: 18,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_100,
    fontWeight: "700",
  },
  totalBalanceValue: {
    fontSize: 18,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    fontWeight: "700",
    flex: 3,
    textAlign: "right",
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
  totalBalanceSeparator: {
    marginBottom: Padding.p_13xl,
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
  billPlanermainContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",   
    padding: Padding.p_xs,
    borderColor: Color.sparklightGray,
    borderTopWidth: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },

  billExplainerText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: Color.colorGray_100,
  },

  billExplainerLinkText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
  },

  colorGreen: "#0C8306",
});

// Define color constants
styles.colorGreen = "#0C8306";

export default BillingBreakDownScreen;
