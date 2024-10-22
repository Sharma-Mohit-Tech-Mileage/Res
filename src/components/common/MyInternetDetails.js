import React, { useState, useEffect,useCallback } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Carousel from 'react-native-snap-carousel';
import Card from "./billerCards/BillerSummary";
import AutoPayCard from "./billerCards/AutoPayCard";
import PeperLessCard from "./billerCards/PeperLessCard";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillingPaper, fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import { Padding } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import { useFocusEffect } from "@react-navigation/native";

const { width: viewportWidth } = Dimensions.get('window');

const MyInternetDetails = ({ plans, billAmt, dueDate, paymentDetails,navigation }) => {
  const dispatch = useDispatch();
  const [paperlessStatus, setPaperlessStatus] = useState(false);
  const [cardDigit, setCardDigit] = useState("");
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const paperLessInfo = profile.paperLessInfo || {};
  const profileDetails = profile.profileDetails || {};

  const getStatus = () => {
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      GetApiRequest(
        `account/api/account/${accountNumber}/easypay`,
        (res) => {
          setIsAutoPayStatus(res?.isEasyPay);
          setCardDigit(res?.epLastfour);
        },
        onError
      );
      GetApiRequest(
        `account/api/account/${accountNumber}/paperless/status`,
        setPaperlessStatus,
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

  useEffect(() => {
    getStatus();
    dispatch(fetchBillingPaper());
    dispatch(fetchProfileDetails());
  }, []);

  const renderCard = ({ item, index }) => {
    const isActive = index === activeSlide;
  
    if (index === 1) {
      return (
        <AutoPayCard
          billAmt={billAmt}
          cardDigit={cardDigit}
          isAutoPayStatus={isAutoPayStatus}
          paperlessStatus={paperlessStatus}
          paymentDetails={paymentDetails}
          navigation={navigation}
          style={styles.card}
          accessible={true}
          accessibilityLabel="Auto Pay Card"
          accessibilityState={{ selected: isActive }}
        />
      );
    }
    if (index === 2) {
      return (
        <PeperLessCard
          billAmt={billAmt}
          paperLessInfo={paperLessInfo}
          isAutoPayStatus={isAutoPayStatus}
          paperlessStatus={paperlessStatus}
          navigation={navigation}
          style={styles.card}
          accessible={true}
          accessibilityLabel="Paperless Billing Card"
          accessibilityState={{ selected: isActive }}
        />
      );
    }
    return (
      <Card
        billAmt={billAmt}
        dueDate={''}
        isAutoPayStatus={isAutoPayStatus}
        paperlessStatus={paperlessStatus}
        navigation={navigation}
        style={styles.card}
        accessible={true}
        accessibilityLabel="Billing Summary Card"
        accessibilityState={{ selected: isActive }}
      />
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollView} style={{ marginStart: -24 }}>
      <View style={styles.container}>
        <Carousel
          data={[{}, {}, {}]}
          renderItem={renderCard}
          sliderWidth={viewportWidth}
          itemWidth={wp('87%')}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={[styles.carousel, { marginRight: 0 }]} // Ensure no margin on right
          contentContainerCustomStyle={[styles.carouselContentContainer, { paddingEnd: 0 }]} // Ensure no padding at the end
          onSnapToItem={(index) => setActiveSlide(index)}
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

export default MyInternetDetails;
