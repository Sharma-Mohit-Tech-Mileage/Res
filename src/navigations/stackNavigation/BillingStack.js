import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ArticleWindowUtility from "../../components/utility/ArticleWindowUtility";
import BillingScreen from "../../components/billing/BillingScreen";
import BillingStatements from "../../components/billing/BillingStatements";
import PaymentHistoryScreen from "../../components/billing/PaymentHistory";
import BillingBreakDownScreen from "../../components/billing/BillingBreakDownScreen";
import AutoPayScreen from "../../components/billing/payments/AutoPayScreen";
import AutoPayReviewScreen from "../../components/billing/payments/AutoPayReviewScreen";
import AutoPayDeactivateScreen from "../../components/billing/payments/AutoPayDeactivateScreen";
import PaymentMethodsScreen from "../../components/billing/payments/PaymentMethodsScreen";
import MakePaymentScreen from "../../components/billing/payments/MakePaymentScreen";
import MakePaymentMethodScreen from "../../components/billing/payments/MakePaymentMethodScreen";
import MakePaymentReviewScreen from "../../components/billing/payments/MakePaymentReviewScreen";
import PaymentConfirmationScreen from "../../components/billing/payments/PaymentConfirmationScreen";
const BillingStack = createNativeStackNavigator();

function BillingStackScreen({ route }) {
  return (
    <BillingStack.Navigator defaultNavigationOptions={{ gestureEnabled: true }}>
      <BillingStack.Screen
        name="Billing"
        initialParams={{ isWeb: route?.params?.isWeb }}
        component={BillingScreen}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <BillingStack.Screen
        name="BillingStatements"
        component={BillingStatements}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <BillingStack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <BillingStack.Screen
        name="BillingBreakDown"
        component={BillingBreakDownScreen}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <BillingStack.Screen
        name="ArticleWindowUtility"
        component={ArticleWindowUtility}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="AutoPay"
        component={AutoPayScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="AutoPayReview"
        component={AutoPayReviewScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="AutoPayDeactivate"
        component={AutoPayDeactivateScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="MakePayment"
        component={MakePaymentScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="MakePaymentMethod"
        component={MakePaymentMethodScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="MakePaymentReview"
        component={MakePaymentReviewScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />
      <BillingStack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={{ headerBackVisible: false, headerShown: false }}
      />

    </BillingStack.Navigator>
  );
}

export default BillingStackScreen;
