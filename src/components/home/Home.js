import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../res/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import InternetHealthChart from "../common/InternetHealthChart";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DownArrow from "../../res/svgIcons/DownArrow";
import UpArrow from "../../res/svgIcons/UpArrow";
import NetworkDetails from "../common/NetworkDetails";
import strings from "../../res/Strings";
import MyInternetDetials from "../common/MyInternetDetails";
import MyServicePlan from "../common/MyServicePlan";
import { getUser, getPushNotificationStatus, storePushNotificationStatus, storeUpgradeToken } from "../../redux/utils/LocalStorage";
import { GetApiRequest, UserAuthorized } from "../../network/APIClient";
import moment from "moment";
import { Border, Color, FontFamily } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import {
  getFcmToken,
  requestUserPermission,
} from '../../firebase/FirebaseUtils';
import { updatePushNotifications } from '../../redux/actions/ProfileActionSuite';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshToken } from '../user/Session';

const HomeScreen = ({ navigation }) => {
  // const { email, name } = {
  //   email: route.params.data.params.email,
  //   name: route.params.data.params.name,
  // };
  const [isInternetDetails, setIsInternetDetails] = useState(false);
  const user = useSelector(state => state.combinedReducers.user.userData);
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [billAmt, setBillAmt] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [currentHealth, setCurrentHealth] = useState("Poor");
  const [billPaid, setBillPaid] = useState(false);
  const [accountStatus,setAccountStatus]=useState('Active')
  const [hasOutage,setHasOutage]=useState(false)
  const [isOutageAlert,setIsOutageAlert]=useState(false)
  const [estimatedRestoreTime,setEstimatedRestoreTime]=useState('')
  const getInternetHealth = (type) => {
    var currentHealth = {
      Offline: 20,
      Poor: 50,
      Optimal: 80,
      default: 80,
    };
    return currentHealth[type] || currentHealth["default"];
  };

  

  const getInternetPlanDetails = () => {
     getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(request, onSuccessPlan, onError);
    });
  };

  const getUpgradeToken = async () => {
    const url = 'https://publicservices.sparklight.com/ShoppingCart/api/UpgradeOrder/token';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'password',
          'username': 'upgr4d3s0rd3rus3r',
          'password': 'upgr4d3s0rd3rp4ssw0rd'
        }).toString()
    });

    let json = {};

    if (response !== undefined) {
      json = response.json();
    }

    console.log('getUpgradeToken:', json);

    return json;
  };

  const checkModemOutagStatus=()=>{
     getUser().then((res) => {
     const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${res.userInfo.accountNumber}`;
     GetApiRequest(request, (response)=>{
      console.log('checkModemOutagStatus',response)
           if(response.hasOutage===true){
            let time=moment(response.estimatedTimeOfResolution).format('LT'); 
            setEstimatedRestoreTime(time)
             setAccountStatus('Disconnect')
             setIsInternetDetails(true)
             setHasOutage(true)
             setIsOutageAlert(true)

           }
           
     }, (error)=>{
         console.log(error)   
     });
   });
   }

  const onSuccessPlan = (res) => {
    console.log("getInternetPlanDetails", res);
    if (res) {
      setPlans(res);
    }
  };
  const onError = (error) => {
    console.log("error", error);
  };

  const getUserAccountDetails = () => {
     getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}`;
      GetApiRequest(request, (res)=>{
        console.log("getUserAccountDetails", res);
        if (res) {
          if(res.currentCollectionStep=='Soft Disconnect'){
            setAccountStatus('Disconnect')
            setIsInternetDetails(true)
          
          }else{
            updateInternetHealth(res.currentBalance);
          }
          let dueDate = moment(res.paymentDueDate).format("ll");
          setDueDate(dueDate);
          setBillAmt(res.currentBalance);
          

        }
      }, onErrorBill);
    });
  };

  const updateInternetHealth = (dueAmount) => {
    if(dueAmount<=0){
     setCurrentHealth('Optimal')
     setIsInternetDetails(false)
     setBillPaid(true)
    }else{
      setCurrentHealth('Poor')
      setIsInternetDetails(true)
    }
   
  };

  const onErrorBill = (error) => {
    console.log("error", error);
  };

  const checkNotifications = async () => {
    const pushNotification = await getPushNotificationStatus();
    let askNotification = false;
    if (pushNotification === null) {
      askNotification = true;
    } else {
      if (pushNotification.permanentSkip) {
        askNotification = false;
      } else {
        if (pushNotification.status === 'skip') {
          const now = moment();
          const days = now.diff(pushNotification.date, "days");

          if (days > 15) {
            askNotification = true;
          } else {
            askNotification = false;
          }
        }
      }
    }

    if (askNotification) {
      const enabledPermission = await requestUserPermission();

      if (enabledPermission) {
          const token = await getFcmToken();
          const data = {
              accountNumber: user.userInfo.accountNumber,
              deviceToken: token,
              deviceTokenTimestamp: moment().format(),
              optOut: false,
              outageOptOut: false,
              billingOptOutStatus: false,
              userName: user.userInfo.userName,
              isAndroid: Platform.OS == "android",
          };
          const localData = {
              status: 'accepted',
              date: new Date()
          };            
          storePushNotificationStatus(localData);
          await dispatch(updatePushNotifications(data, null));
      } else {
        const localData = {
          status: 'skip',
          date: new Date(),
          permanentSkip: true
        };            
        storePushNotificationStatus(localData);        
      }
    }
  };

  useEffect(() => {
    checkModemOutagStatus();
    getInternetPlanDetails();
    getUserAccountDetails();
    checkNotifications();
    
  }, []);

  useEffect(()=>{
   if(accountStatus==='Disconnect'){
    setCurrentHealth('Offline')
   }
  },[accountStatus])

  useEffect(() => {
    if (!UserAuthorized) {
      RefreshToken();
    }
  }, [UserAuthorized]);

  useEffect(async () => {
    try {
      const result = await getUpgradeToken();
      console.log('getUpgradeTokenResult: ', JSON.stringify(result));
      storeUpgradeToken(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, []);  

  const OutageAlert=({estimatedTime})=>{
    return(
      <View style={styles.errorBox}>
        <View style={{ flexDirection: "row",width:'90%' }}>
          <View style={{ backgroundColor: "#F88700", width: 4 }} />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{alignSelf:'center'}}
                resizeMode="contain"
                tintColor={"#F88700"}
                source={require("../../../assets/info-circle.png")}
              />
              <Text style={styles.modemError1}>
                Outage Alert
              </Text>
            </View>
            <Text style={styles.modemError2}>
              Our systems show that you may be experiencing an outage related to your Internet service. We are working to restore service as soon as possible.
              <Text style={[styles.modemError2,{fontWeight:'700'}]}>Estimated Time to Restore: {estimatedTime}</Text>
            </Text>
          </View>
          
          <TouchableOpacity style={{marginTop:10}} onPress={()=>{
            setIsOutageAlert(false)
          }}>
          <CloseIcon/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: Platform.OS == "ios" ? 60 : 50,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: Platform.OS == "ios" ? 0 : 20,
          }}
        >
          <Image
            resizeMode="contain"
            style={{ width: 120, height: 30.324, flexShrink: 0 }}
            source={require("../../../assets/SparklightEntryLogo.png")}
          />
          {/* <View>
            <BellIcon />
          </View> */}
        </View>
        <ScrollView style={{ height: "100%", paddingBottom: 100 }}>
          <View
            style={{
              backgroundColor: colors.backgound_blue,
              flex: 2,
              alignItems: "center",
              marginTop: 50,
            }}
          >
             {(isOutageAlert)?<OutageAlert estimatedTime={estimatedRestoreTime}/>:<></>}
            <View style={[styles.card, styles.shadowProp, { marginTop: -40 }]}>
              <Text style={styles.internetHealth}>Internet Health</Text>
              <InternetHealthChart
                currentValue={getInternetHealth(currentHealth)}
                 key={currentHealth}
              />
              <View style={styles.internetStatusSection}>
                <View style={{ marginTop: 5 }}>
                  <InfoIcon />
                </View>
                <Text style={styles.internetStatusTxt}>
                  {" "}
                  {(billPaid && !hasOutage)?strings.internetStatus:strings.internetStatusIssue}
                </Text>
              </View>

              <View
                style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 20 }}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsInternetDetails(!isInternetDetails);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                  marginVertical: 5,
                  marginHorizontal: 25,
                }}
              >
                <Text style={styles.hideShowDetails}>
                  {isInternetDetails ? strings.collapseTxt : strings.expandTxt}
                </Text>
                <View style={{ marginTop: 15 }}>
                  {isInternetDetails ? (
                    <View style={{ marginTop: -10 }}>
                      <UpArrow />
                    </View>
                  ) : (
                    <DownArrow />
                  )}
                </View>
              </TouchableOpacity>
              {isInternetDetails ? (
                <NetworkDetails billPaid={billPaid} hasOutage={hasOutage} navigation={navigation} accountStatus={accountStatus} />
              ) : (
                <></>
              )}
            </View>
            <ScrollView horizontal={true} style={{ marginStart: 20 }}>
              <View >
                <MyInternetDetials
                  plans={plans}
                  billAmt={billAmt}
                  dueDate={dueDate}
                  navigation={navigation}
                />
              </View>
            </ScrollView>

            <MyServicePlan plans={plans} navigation={navigation} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    borderRadius:2,
    paddingTop: 45,
    width: wp("92%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  internetHealth: {
    color: colors.darkest_grey,
    fontSize: 22,
    marginTop: -20,
    fontFamily:FontFamily.openSansRegular,
    paddingHorizontal: 25,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22 /* 100% */,
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    flexDirection: "row",
    justifyContent:'center',
    marginHorizontal: 25,
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    fontFamily:FontFamily.openSansRegular,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 28,
    paddingHorizontal: 5,
  },
  hideShowDetails: {
    fontFamily:FontFamily.openSansRegular,
    fontSize: 16,
    marginVertical: 5,
    color: colors.sparklight_purple_blue,
    lineHeight: 20,
    fontWeight: "600",
  },modemError1: {
    color: Color.sparkLightInfo,
    FontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 5,
    marginRight: 5,
  },
  modemError2: {
    color: Color.colorGray_200,
    FontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  },
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 20,
    borderColor: Color.sparklightGray,
    backgroundColor:Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    marginBottom:wp('15%'),
    marginTop:wp('-10%'),
  },
});

export default HomeScreen;
