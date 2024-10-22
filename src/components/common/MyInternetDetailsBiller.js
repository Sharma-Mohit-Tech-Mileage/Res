import React, { useState, useEffect,useCallback } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Carousel from 'react-native-snap-carousel';
import Card from "./billerCards/NewBillerSummary";
import AutoPayCard from "./billerCards/AutoPayCardNewBiller";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import { useFocusEffect } from "@react-navigation/native";

const { width: viewportWidth } = Dimensions.get('window');

const MyInternetDetailsBiller = ({ plans, billAmt, dueDate,pastPaymentDue,paymentDetails, navigation }) => {
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [accountNumber,setAccountNumber]=useState(undefined)

  const getStatus = () => {
    console.log('Get Status********************************************************************************************************************************')
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      setAccountNumber(accountNumber)
      GetApiRequest(
        `accountsvc/api/accounts/${accountNumber}/easypay`,
        (res) => {
          console.log('Get Status resonse********************************************************************************************************************************',res)
          setIsAutoPayStatus(res?.isEasyPay);
          setCardDigit(res?.epLastfour);
        },
        onError
      );
    });
  };

  const onError = (error) => {
    console.log("error", error);
  };

  useFocusEffect(
    useCallback(() => {
      getStatus();
      console.log('Refresh Auto pay Data')
      return () => {
      };
    }, [])
  );

  const renderCard = ({ item, index }) => {
    if (index === 1) {
      return (
        <AutoPayCard
          billAmt={billAmt}
          dueDate={dueDate}
          pastPaymentDue={pastPaymentDue}
          cardDigit={cardDigit}
          isAutoPayStatus={isAutoPayStatus}
          paperlessStatus={paperlessStatus}
          paymentDetails={paymentDetails}
          navigation={navigation}
          style={styles.card}
        />
      );
    }
    
    return (
      <Card
        billAmt={billAmt}
        dueDate={(accountNumber=='8160360050011425')? '': dueDate}
        isAutoPayStatus={isAutoPayStatus}
        paperlessStatus={paperlessStatus}
        navigation={navigation}
        style={styles.card}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView} style={{ marginStart: -24 }}>
      <View style={styles.container}>
        <Carousel
          data={[{}, {}]}
          renderItem={renderCard}
          sliderWidth={viewportWidth}
          itemWidth={wp('85%')}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.carousel}
          contentContainerCustomStyle={styles.carouselContentContainer}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    paddingVertical: 16,
    flex: 1, // Ensure the container takes up full height
  },
  carousel: {
    overflow: 'visible',
  },
  carouselContentContainer: {
    paddingHorizontal: wp('2.5%'),
  },
  card: {
    height: 230,  // Set the height for the cards
  },
});

export default MyInternetDetailsBiller;
