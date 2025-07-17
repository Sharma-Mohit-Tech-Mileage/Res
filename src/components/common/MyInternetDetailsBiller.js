import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Card from "./billerCards/NewBillerSummary";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
const MyInternetDetailsBiller = ({  billAmt, dueDate,navigation }) => {
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [accountNumber, setAccountNumber] = useState(undefined)
  const paperlessStatusAcp = useSelector(state => state.combinedReducers.profile?.paperlessStatusAcp);
  const getStatus = () => {
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      setAccountNumber(accountNumber)
      GetApiRequest(
        `api/accounts/${accountNumber}/easypay`,
        (res) => { setIsAutoPayStatus(res?.isEasyPay); setCardDigit(res?.epLastfour); },
        onError
      );
    });
  };

  const onError = (error) => { console.log("error", error); };

  useFocusEffect(useCallback(() => { getStatus(); return () => { }; }, []));

  return (

    <View style={styles.container}>
      <Card
        billAmt={billAmt}
        dueDate={dueDate}
        isAutoPayStatus={isAutoPayStatus}
        paperlessStatus={paperlessStatusAcp}
        navigation={navigation}
        style={styles.card}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1, },
  container: { paddingVertical: 16, flex: 1 },
  carousel: { overflow: 'visible', },
  carouselContentContainer: { paddingHorizontal: wp('2.5%'), },
  card: { height: 230, },
});
export default MyInternetDetailsBiller;
