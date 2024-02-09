import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Pressable,
  ActivityIndicator
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
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import {
  getFcmToken,
  requestUserPermission,
} from '../../firebase/FirebaseUtils';
import { updatePushNotifications } from '../../redux/actions/ProfileActionSuite';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshToken } from '../user/Session';
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import { Env } from '../../network/apis/account/Constants';
const tabWidth = Number(Dimensions.get('window').width/4);

const HomeScreen = ({ navigation }) => {
  // const { email, name } = {
  //   email: route.params.data.params.email,
  //   name: route.params.data.params.name,
  // };
  const [isInternetDetails, setIsInternetDetails] = useState(false);
  const user = useSelector(state => state.combinedReducers.user.userData);
  const home = useSelector(state => state.combinedReducers.home);
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [billAmt, setBillAmt] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [currentHealth, setCurrentHealth] = useState("Optimal");
  const [billPaid, setBillPaid] = useState(false);
  const [accountStatus,setAccountStatus]=useState('Active')
  const [hasOutage,setHasOutage]=useState(false)
  const [isOutageAlert,setIsOutageAlert]=useState(false)
  const [checkModemStatus,setCheckModemStatus]=useState(false)
  const [estimatedRestoreTime,setEstimatedRestoreTime]=useState('')
  const [walkThroughStep, setWalkThroughStep] = useState(0);
  const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [internetHealths,setInternetHealths]= useState([])

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
    const url = Env.API_SHOPPING_CART_BASEURL + '/api/UpgradeOrder/token';

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
             setInternetHealths(oldArray => [...oldArray,'Red'] );

           }else{
            setInternetHealths(oldArray => [...oldArray,'Green'] );
           }
           
     }, (errorCode)=>{
         console.log("checkModemOutagStatus erro",errorCode) 
         if(errorCode===204) {
          setInternetHealths(oldArray => [...oldArray,'Green'] ); 
         }
         
     });
   });
   }

  const onSuccessPlan = (res) => {
    console.log("getInternetPlanDetails", res);
    if (res) {
      setPlans(res);
      if(res.length>0){
      let macAddress=res[0].macAddress
      var mac=macAddress;
      if(user.userInfo.accountNumber==='128387263'){
        mac="ac:db:48:21:f2:21"
      }else if(user.userInfo.accountNumber==='133370775'){
        mac="04:bc:9f:17:02:b8"
      }
      checkModemDetails(mac)
      }else{
        setCheckModemStatus(true)
      }
    }
  };
  const onError = (error) => {
    console.log("error", error);
  };

  /**
   * get modem details
   */

  const checkModemDetails = (macAddress) => {
    const request = `mobile/api/modem/getmodemdetails?macId=${macAddress}`;
    GetApiRequest(
      request,
      (res) => {
        setCheckModemStatus(true)
        console.log("checkModemDetails", res);
        if (res) {
          let temt = [];
          if (res.equipmentType === "DOCSIS") {
            temt.push(res.uTxP_State);
            temt.push(res.uRxL_State);
            temt.push(res.usnR_State);
            temt.push(res.dsnR_State);
            temt.push(res.dRxL_State);
            updateModemStatus(temt);
          }else if(res.equipmentType === "ONU"){
            temt.push(res.onutP_State);
            temt.push(res.oltrP_State);
            temt.push(res.onurP_State);
            updateModemStatus(temt)
          }
          
        }
      },
      (error) => {
        setCheckModemStatus(true)
        setInternetHealths(oldArray => [...oldArray,'yellow'] );
        console.log("Modem details", error);
      }
    );
  };

  const updateModemStatus = (temt) => {
    const allGreen = temt.every((v) => v === "Green");
    console.log('modem status',allGreen)
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed) {
        setInternetHealths(oldArray => [...oldArray,'Red'] );
      } else if (checkYellow) {
        setInternetHealths(oldArray => [...oldArray,'Yellow'] );
      }
    } else {
      setInternetHealths(oldArray => [...oldArray,'Green'] );
    }
    
  };

  const refreshInternetHealth=()=>{
   
    const checkYellow = internetHealths.includes('Yellow');
    const checkRed = internetHealths.includes('Red');
    const checkGreen = internetHealths.includes('Green');
    if(checkRed){
      console.log('Internet Health is Red')
      setCurrentHealth('Offline');
      setIsInternetDetails(true);
    }else if(checkYellow){
      console.log('Internet Health is yellow')
      setCurrentHealth('Poor');
      setIsInternetDetails(true);
    }else{
      console.log('Internet Health is Green')
      setCurrentHealth('Optimal');
      setIsInternetDetails(false);
    }

  }

  const getUserAccountDetails = () => {
     getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}`;
      GetApiRequest(request, (res)=>{
        console.log("getUserAccountDetails", res);
        if (res) {
          if(res.currentCollectionStep=='Soft Disconnect'){
            setAccountStatus('Disconnect')
            setIsInternetDetails(true)
            setInternetHealths(oldArray => [...oldArray,'Red'] );
          }else{
            updateInternetHealth(res.currentBalance);

          }
          let dueDate = moment(res.paymentDueDate).format("ll");
          setDueDate(dueDate);
          setBillAmt(res.currentBalance);
          
           getInternetPlanDetails();
           
        }
      }, onErrorBill);
    });
  };

  const updateInternetHealth = (dueAmount) => {
    if(dueAmount<=0){
     setBillPaid(true)
     setInternetHealths(oldArray => [...oldArray,'Green'] );
    }else{
      setInternetHealths(oldArray => [...oldArray,'Yellow'] );
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

  useEffect(()=>{

    console.log('Health',internetHealths.length)
    if(internetHealths.length>=3){
      refreshInternetHealth()
    }
   
  },[internetHealths]);

  useEffect(() => {
    checkModemOutagStatus();
    getUserAccountDetails();
    checkNotifications();

    const fetchData = async () => {
      console.log('FetchData: ');
      try {
        const result = await getUpgradeToken();
        console.log('getUpgradeTokenResult: ', JSON.stringify(result));
        storeUpgradeToken(result);
      } catch (error) {
        console.error("Error fetching data", error);
      }

      if (home.walkThroughStep !== null) {
        setShowWalkThrough(true);
      }
    };

    fetchData();    
    
  }, []);

  const changeWalkThroughStep = (step) => {
    console.log("walkThroughStep: ", step);
    if (step > 2) {
      dispatch(updateWalkThroughStep(null));
      setShowWalkThrough(false);
    } else {
      dispatch(updateWalkThroughStep(step));
      setWalkThroughStep(step);
    }
  };

  const walkthroughModal = () => {

    const walkThroughScreens = [
      {
        title: 'Home',
        description: 'View information related to your internet health, billing, service and more.',
        buttonText: 'Next'
      },
      {
        title: 'Support',
        description: 'View our FAQ, check in on your modem or troubleshoot your issues.',
        buttonText: 'Next'
      },
      {
        title: 'Account',
        description: 'Manage your profile settings, notifications, users and more.',
        buttonText: 'Let\'s Go!'
      },            
    ];

    const walkThrough = walkThroughScreens[walkThroughStep];
    const bottomCarotStyles = [styles.bottomCarot];

    if (walkThroughStep === 1) {
      bottomCarotStyles.push(styles.bottomCarotStep2);
    } else if (walkThroughStep === 2) {
      bottomCarotStyles.push(styles.bottomCarotStep3);
    }

    return (
      <>
        <View style={styles.walkThroughBubble}>
          <View>
            <View style={styles.title}>
              <Text style={styles.titleText}>{walkThrough.title}</Text>
            </View>
            <View style={styles.description}>
              <Text style={styles.descriptionText}>{walkThrough.description}</Text>
            </View>
          </View>
          <View style={styles.walkThroughBottomArea}>
              <View style={styles.circlePaging}>
                <View style={styles.circle}></View>
                <View style={walkThroughStep < 1 ? [styles.circle, styles.circleUnselected] : styles.circle}></View>
                <View style={walkThroughStep < 2 ? [styles.circle, styles.circleUnselected] : styles.circle}></View>
              </View>
              <View style={styles.walkThroughButtons}>
                <View style={styles.walkThroughSubButtons}>
                  {
                    walkThroughStep > 0 &&
                    (
                      <Pressable
                          style={[styles.button, styles.buttonsLayout, styles.buttonPrevious]}
                          onPress={() => changeWalkThroughStep(walkThroughStep - 1)}
                      >
                          <Text style={styles.decline}>Previous</Text>
                      </Pressable> 
                    )
                  }                    
                  <Pressable
                      style={[styles.button, styles.buttonsLayout, styles.buttonNext]}
                      onPress={() => changeWalkThroughStep(walkThroughStep + 1)}
                  >
                      <Text style={styles.accept}>{walkThrough.buttonText}</Text>
                  </Pressable>   
                </View>                
              </View>
          </View>
          <View>
            <Image
              style={bottomCarotStyles}
              tintColor={"#FFF"}
              source={require("../../../assets/polygon.png")}
            />
          </View>
        </View>         
      </>

    )
  }

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
      {showWalkThrough && (<View style={styles.shadowFullScreen} />)}
      {showWalkThrough && walkthroughModal()}
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
              <Text style={styles.internetHealth}>Service Health</Text>
              {/* <InternetHealthChart
                currentValue={getInternetHealth(currentHealth)}
                 key={currentHealth}
              /> */}
              { (checkModemStatus) ?
              <InternetHealthChart
                currentValue={getInternetHealth(currentHealth)}
                 key={currentHealth}
              />
                : <ActivityIndicator
                  size="large"
                  color='#8D3B90'

                />}
              <View style={styles.internetStatusSection}>
                <View style={{ marginTop: 5 }}>
                  <InfoIcon />
                </View>
                <Text style={styles.internetStatusTxt}>
                  {" "}
                  {(currentHealth!='Optimal')?strings.internetStatusIssue:strings.internetStatus}
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
                <NetworkDetails billPaid={billPaid} hasOutage={hasOutage} currentHealth={currentHealth} navigation={navigation} accountStatus={accountStatus} />
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
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  bottomCarot: {
    width: 18,
    height: 13,
    position: 'absolute',
    top: 20
  },
  bottomCarotStep2: {
    left: tabWidth * 2
  },
  bottomCarotStep3: {
    left: tabWidth * 3
  },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 8,
    marginLeft: 10
  },
  circleUnselected: {
    backgroundColor: '#D9D9D9'
  },
  circlePaging: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16
  },
  walkThroughBottomArea: {
    flexDirection: 'row',
    flex: 1
  },
  walkThroughButtons: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  walkThroughSubButtons: {
    width: 195,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  title: {
    marginBottom: 5
  },
  titleText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,        
  },  
  description: {

  },
  descriptionText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,    
    lineHeight: 24,    
  },
  decline: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,        
    color: Color.colorMidnightblue,
    textAlign: "center",
  },  
  button: {
    backgroundColor: Color.colorMidnightblue,
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200
  },
  buttonDisabledText: {
    color: Color.sparklightaddGray
  },    
  buttonNext: {
    justifyContent: 'flex-end',
    marginLeft: 10
  },
  buttonPrevious: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  buttonsLayout: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 32,
    textAlign: 'center'
  },  
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
  shadowFullScreen: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 5,
    opacity: .7
  },
  walkThroughBubble: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 90,
    height: 180,
    width: Dimensions.get('window').width - 40,
    left: 20,
    opacity: 1,
    zIndex: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 20
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
  },
  modemError1: {
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
