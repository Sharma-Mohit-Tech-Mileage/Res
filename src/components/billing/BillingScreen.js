import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import BillingIconWhite from "../../res/svgIcons/BillingIconWhite";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/RestApiClient";
import { getEndpoint , ENDPOINTS} from "../../network/apis/endpoints/Endpoints";
import Card from "../common/billerCards/BillerSummary";
import { useDispatch, useSelector } from "react-redux";
import AutoPayCard from "../common/billerCards/AutoPayCard";
import PeperLessCard from "../common/billerCards/PeperLessCard";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import moment from "moment";
import Icon from "../common/Icon";
import Config from "react-native-config";
import colors from "../../res/Colors";
import { card } from "../../styles/utilities";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { getPrimaryEmail } from "../utility/constant";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import RightIcon from "../../../assets/svgs/Chevonright";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import AppStyles from "../../styles/AppStyles";
import { SectionTitle,Title,MenuText } from "../common/customui/Typography";

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
    console.warn("error on Billing auto pay", error);
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
        console.warn("Error getting user status:", error);
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
    <View style={styles.account} accessibilityLabel="Billing Services screen"accessibilityRole='Header' accessibilityLevel={1}>
      <ProfileSettingsHeader
        title=""
        iconAlignment="right"
        showIcon={false}
      />
      <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
      <ZendeskChatIcon />
      </View>
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 3, y: 1}}
        colors={["rgba(141, 59, 144, 1)", "rgba(53, 48, 145, 1)"]}
      />
      <View style={styles.frameParent}>
        <View style={styles.rightActionableParent}>
          <View
            style={[
              styles.rightActionable,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <BillingIconWhite isSelected={false} />
          </View>
          <Title style={styles.melissaSmith}
          accessibilityLabel="Billing Services" accessibilityRole='Header'
           accessibilityLevel={1} 
           nativeID="Billing Services-header"
           //accessibilityHint="Header"
           >
          Billing Services</Title>
        </View>

        <ScrollView
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
                <Card
                  billAmt={billAmt}
                  dueDate={dueDate}
                  navigation={navigation}
                  style={styles.card}
                  
                />
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
                <View style={[AppStyles.card, { marginBottom: 16 }]}>
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
                        navigation.navigate("ArticleWindowUtility", {
                          url: `${Config.PORTAL_BASE_URL}/portals/app-secure/billing-payment`,
                          name: "Manage Payment Method",
                          injectPaymentObj: true,
                        });
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

                    <View style={styles.frameLayout} />
                    {
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
                    }
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
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },cardsContainer: {
    paddingBottom: heightPercentageToDP("25%"),
    marginTop: Padding.p_base,
    marginHorizontal: 16,
  },
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
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  melissaSmith: {
    width: 210,
    lineHeight: 28,
    textAlign: "center",
  },
  rightActionableParent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  frameParent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  card: {
    minHeight: 230,
  },
  myModemSpaceBlock: {
    paddingTop: Padding.p_base,
    alignSelf: "stretch",
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
    lineHeight: 28,
    flex: 1,
  },
});

export default BillingScreen;
