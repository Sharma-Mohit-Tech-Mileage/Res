import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel, { Pagination } from 'react-native-snap-carousel';
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
const { width: viewportWidth } = Dimensions.get('window');

const MyInternetDetails = ({ plans, billAmt, dueDate, navigation }) => {
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

  useEffect(() => {
    getStatus();
    dispatch(fetchBillingPaper());
    dispatch(fetchProfileDetails());
  }, []);

  const renderCard = ({ item, index }) => {
    if (index === 1) {
      return (
        <AutoPayCard
          billAmt={billAmt}
          cardDigit={cardDigit}
          isAutoPayStatus={isAutoPayStatus}
          paperlessStatus={paperlessStatus}
          navigation={navigation}
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
        />
      );
    }
    return (
      <Card
        billAmt={billAmt}
        dueDate={dueDate}
        isAutoPayStatus={isAutoPayStatus}
        paperlessStatus={paperlessStatus}
        navigation={navigation}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={[{}, {}, {}]}
        renderItem={renderCard}
        sliderWidth={viewportWidth}
        itemWidth={wp('90%')}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        containerCustomStyle={styles.carousel}
        contentContainerCustomStyle={styles.carouselContentContainer}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={3}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  carousel: {
    overflow: 'visible',
  },
  carouselContentContainer: {
    paddingHorizontal: wp('2.5%'),
  },
  paginationContainer: {
    paddingVertical: Padding.p_base,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sparklight_purple_blue,
  },
  inactiveDotStyle: {
    backgroundColor: colors.dark_grey,
  },
});

export default MyInternetDetails;
