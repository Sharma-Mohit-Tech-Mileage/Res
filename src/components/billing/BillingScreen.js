import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { ScreenScroll } from "../common/customui/Screen";
import ResponsiveRow from "../common/customui/ResponsiveRow";
import { container } from "../../styles/utilities";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import {
  Color,
  Padding,
  Border,
} from "../../styles/GlobalStyles";
import TabRootHeader from "../common/TabRootHeader";
import BillingIconWhite from "../../res/svgIcons/BillingIconWhite";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/RestApiClient";
import { getEndpoint , ENDPOINTS} from "../../network/apis/endpoints/Endpoints";
import Card from "../common/billerCards/BillerSummary";
import { useDispatch, useSelector } from "react-redux";
import AutoPayCard from "../common/billerCards/AutoPayCard";
import PeperLessCard from "../common/billerCards/PeperLessCard";
import PaymentPlanCard from "../common/billerCards/PaymentPlanCard";
import WebViewWarmup from "../common/WebViewWarmup";
import { getPaymentPlanInfo } from "../../utils/paymentPlan";
import { useBillExplainerLink } from "../../hooks/useBillExplainerLink";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import moment from "moment";
import { getPrimaryEmail } from "../utility/constant";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import RightIcon from "../../../assets/svgs/Chevonright";
import AppStyles from "../../styles/AppStyles";
import { SectionTitle, MenuText } from "../common/customui/Typography";
import { logWarn } from "../../utils/logger";

// Bill Breakdown menu option is hidden per design feedback; flip to true to bring it back.
const SHOW_BILL_BREAKDOWN = false;

const BillingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { triggerOnScreenEntry } = useAnnouncement();

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('BillingStackScreen');
    }, [triggerOnScreenEntry])
  );
  const accountDetails = useSelector(
    (state) => state.profile?.accountDetails
  );
  const paymentPlan = getPaymentPlanInfo(accountDetails);
  const accountNumber = useSelector((state) => state.user?.userData?.userInfo?.accountNumber);
  const { url: explainerUrl, loading: explainerLoading } = useBillExplainerLink(accountDetails, accountNumber);
  const paperlessStatusAcp = useSelector(
    (state) => state.profile?.paperlessStatusAcp
  );

  const paperlessLoadingFromStore = useSelector(
    (state) => state.profile?.isPaperLessStatusLoading
  );
  const paperlessLoading = paperlessLoadingFromStore || paperlessStatusAcp === undefined;

  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState();

  const [isAutoPayStatus, setIsAutoPayStatus] = useState(undefined);
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({
    dueDate: null,
    billAmount: 0,
    pastPaymentDue: 0,
    email: null,
  });

  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isAutoPayStatusLoad, setIsAutoPayStatusLoad] = useState(true);

  const handleError = (error) => {
    logWarn("error on Billing auto pay", error);
    setIsContentLoading(false);
    setIsAutoPayStatusLoad(false);
  };

  const getStatus = () => {
    setIsAutoPayStatusLoad(true);
    getUser()
      .then((res) => {
        const accountNumber = res.userInfo.accountNumber;
        const endpoint = getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber });
        GetApiRequest(
          endpoint,
          (res) => {
            setIsAutoPayStatus(res?.isEasyPay);
            setIsAutoPayStatusLoad(false);
          },
          handleError
        );
      })
      .catch((error) => {
        logWarn("Error getting user status:", error);
        setIsContentLoading(false);
        setIsAutoPayStatusLoad(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      setIsContentLoading(false);
      getStatus();
      dispatch(fetchACPUserAccountDetails());

      return () => {
        setIsAutoPayStatus(undefined);
        setIsAutoPayStatusLoad(true);
      };
    }, [])
  );
  useEffect(() => {
    if (accountDetails) {
      const p_email = getPrimaryEmail(accountDetails);
      const userBillAmt =
        accountDetails.past_due_amount === 0
          ? accountDetails.current_balance
          : accountDetails.past_due_amount;
      setBillAmt(userBillAmt?.toFixed(2));
      const formattedDueDate =
        accountDetails.past_due_amount !== 0
          ? "Immediately"
          : moment(accountDetails.payment_due_date).format("ll");
      setDueDate(formattedDueDate);

      setDefaultPaymentDetails({
        dueDate: accountDetails.payment_due_date,
        billAmount: accountDetails.past_due_amount,
        pastPaymentDue: accountDetails.past_due_amount,
        email: p_email,
      });
      setIsContentLoading(false);
    }
  }, [accountDetails]);

  return (
    <View style={styles.account} accessibilityLabel="Billing Services screen" accessibilityRole='header' accessibilityLevel={1}>
      <TabRootHeader
        chatScreenName="Billing"
        icon={<BillingIconWhite isSelected={false} />}
        title="Billing Services"
        titleProps={{ accessibilityLabel: "Billing Services", accessibilityRole: "header", accessibilityLevel: 1, nativeID: "Billing Services-header" }}
      />
      <View style={styles.frameParent}>
        <ScreenScroll
          framed
          showsVerticalScrollIndicator={false}
          
        >
          <View style={styles.cardsContainer}>
            {isContentLoading ? (
              <View style={styles.loadingContainer}>
                <LoadingOverlay
                  loading={isContentLoading}
                  onRequestClose={() => {
                    setIsContentLoading(false);
                  }}
                />
              </View>
            ) : (
              <>
                <WebViewWarmup url={explainerUrl} />
                <Card
                  billAmt={billAmt}
                  dueDate={dueDate}
                  navigation={navigation}
                  explainerUrl={explainerUrl}
                  explainerLoading={explainerLoading}
                  style={styles.card}
                  
                />
                {paymentPlan.isEnrolled && (
                  <PaymentPlanCard navigation={navigation} />
                )}
                <ResponsiveRow>
                  <AutoPayCard
                    isAutoPayStatus={isAutoPayStatus}
                    paymentDetails={defaultPaymentDetails}
                    navigation={navigation}
                    isStatusLoading={isAutoPayStatusLoad}
                  />
                  <PeperLessCard
                    paperlessStatus={paperlessStatusAcp}
                    navigation={navigation}
                    isStatusLoading={paperlessLoading}
                  />
                </ResponsiveRow>
                <View style={[AppStyles.card, { paddingBottom: 16 }]}>
                  <>
                  <View
                    style={[
                      styles.myModemWrapper,
                      styles.frameParentSpaceBlock1,
                    ]}
                  >
                    <SectionTitle style={[styles.leftTitle]} 
                    accessible={true}
                    accessibilityLabel="Billing Options"
                    accessibilityRole="header" accessibilityLevel={2}>
                      Billing Options
                      </SectionTitle>
                  </View>
                  <View
                    style={[
                      styles.supportAccordionParent,
                      styles.supportParentFlexBox,
                    ]}
                  >
                    <View style={styles.frameLayout} />
                    <Touchable
                      minSize={0}
                      style={[styles.frame9defaultSpaceBlock, { alignItems: 'stretch' }]}
                      onPress={() => {
                        navigation.navigate("PaymentMethods");
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Manage Payment Method"
                    >
                     
                      <MenuText style={styles.modemHealthSupport}>
                        Manage Payment Method
                      </MenuText>
                      <View
                        style={styles.rightIconLayout}
                      >
                        <RightIcon />
                      </View>
 
                    </Touchable>

                    {SHOW_BILL_BREAKDOWN && (
                      <>
                      <View style={styles.frameLayout} />
                      <Touchable
                        minSize={0}
                        style={[styles.frame9defaultSpaceBlock, { alignItems: 'stretch' }]}
                        onPress={() => {
                          navigation.navigate("BillingBreakDown");
                        }}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="View Bill Breakdown"
                      >
                        
                        <MenuText style={styles.modemHealthSupport}>
                          {"View Bill Breakdown"}
                        </MenuText>
                        <View
                          style={styles.rightIconLayout}
                        >
                          <RightIcon />
                        </View>
                      </Touchable>
                      </>
                    )}
                    <View style={styles.frameLayout} />
                    <Touchable
                      minSize={0}
                      style={[styles.frame9defaultSpaceBlock, { alignItems: 'stretch' }]}
                      onPress={() => {
                        navigation.navigate("PaymentHistory");
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="View Payment History"
                    >

                      <MenuText style={styles.modemHealthSupport}>
                        View Payment History
                      </MenuText>
                      <View
                        style={styles.rightIconLayout}
                      >
                        <RightIcon />
                      </View>
 
                    </Touchable>
                    <View style={styles.frameLayout} />

                    <Touchable
                      minSize={0}
                      style={[styles.frame9defaultSpaceBlock, { alignItems: 'stretch' }]}
                      onPress={() => {
                        navigation.navigate("BillingStatements");
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="View Billing Statements"
                    >
                      
                      <MenuText style={styles.modemHealthSupport}>
                        View Billing Statements
                      </MenuText>
                      <View
                        style={styles.rightIconLayout}
                      >
                        <RightIcon />
                      </View>
 
                    </Touchable>
                  </View>
                  </>
                </View>
              </>
            )}
          </View>
        </ScreenScroll>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: container.stack,
  leftTitle: {
    alignContent: "flex-start",
    alignSelf: "center",
  },
  loadingContainer: {
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  frameParent: {
    flex: 1,
    // Top spacing now comes from TabRootHeader.
    paddingBottom: Padding.p_base,
    alignSelf: "stretch",
  },
  account: {
    flex: 1,
    backgroundColor: Color.Gray300,
    width: "100%",
  },
  card: {
    minHeight: 230,
  },
  myModemWrapper: {
    paddingTop: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParentSpaceBlock1: {
    paddingBottom: Padding.p_base,
    
  },
  rightIconLayout: {
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  frame9defaultSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  supportParentFlexBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  frameLayout: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  supportAccordionParent: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  modemHealthSupport: {
    textAlign: "left",
    // No lineHeight: on Android it makes some labels measure an extra blank line at certain display sizes
    flex: 1,
  },
});

export default BillingScreen;
