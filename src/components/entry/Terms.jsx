import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, ScrollView, Pressable, Dimensions } from "react-native";
import WebView from 'react-native-webview';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useSelector, useDispatch } from 'react-redux';
import { getSsoToken, cleanUserData, storeSsoToken, storeUser } from "../../redux/utils/LocalStorage";
import { updateTermsAndConditions, fetchSMSSelection, fetchBillingStatus, fetchPushNotifications, fetchBillingPaper, fetchProfileDetails } from '../../redux/actions/ProfileActionSuite';
import * as Zendesk from 'react-native-zendesk-messaging';
import { logout } from 'react-native-app-auth';
import { SetClearTimer } from '../user/Session';
import { saveUserInfo } from "../../redux/actions/UserAction";
import { Env } from "../../network/apis/account/Constants";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";

const config = {
    issuer: Env.SSO_LOGIN,
    iosPrefersEphemeralSession: true,
};

const { width, height } = Dimensions.get('window');

const Terms = ({ navigation }) => {
    const [initScript, setInitScript] = useState('');
    const [loading, setLoading] = useState(true);
    const [nextScreen, setNextScreen] = useState('EntryPushNotifications');
    const [progress, setProgress] = useState(0);
    const [profileLoadCount, setProfileLoadCount] = useState(0);
    const [isError, setIsError] = useState(false);
    const dispatch = useDispatch();
    const stateData = useSelector(state => state);
    const combinedReducers = useSelector(state => state.combinedReducers);
    const userData = useSelector(state => state.combinedReducers.user.userData);
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const url = 'https://www.sparklight.com/legal/mobile-app-terms-and-conditions';
    console.log('userData: ', userData);
    console.log('combinedReducers: ', combinedReducers);
    console.log('stateData: ', JSON.stringify(stateData));

    useEffect(() => {
        //Add incase the api call fails
        setTimeout(() => {
            setLoading(false);
        }, 10000);
    }, []); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchBillingStatus());
                dispatch(fetchBillingPaper());
                dispatch(fetchSMSSelection());
                dispatch(fetchPushNotifications());
                dispatch(fetchProfileDetails());
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [dispatch]); 

    useEffect(() => {
        let goToPhoneScreen = false;
        let optOutCount = 0;
        let goToPushNotificationScreen = false;
        let optOutCountPushNotification = 0;

        
        if (profile.pushNotifications.length > 0) {
            const messageTypes = profile.pushNotifications[0].pushMessageType;
            messageTypes.forEach((messageType) => {
                if (messageType.optOutFlag) {
                    goToPushNotificationScreen = optOutCountPushNotification + 1;
                }
            });
            if (optOutCountPushNotification > 2) {
                goToPushNotificationScreen = true;
            }
        } else {
            goToPushNotificationScreen = true;
        }
        
        if (profile.smsSubscription.length > 0) {
            const firstSubscription = profile.smsSubscription[0];
            firstSubscription.smsMessageType.forEach((messageType) => {
                console.log('messageType.optOutFlag: ', messageType.optOutFlag);
                console.log('optOutCount: ', optOutCount);
                if (messageType.optOutFlag) {
                    optOutCount = optOutCount + 1;
                }
            });
            console.log('optOutCountAfterLoop: ', optOutCount);
            if (optOutCount > 2) {
                goToPhoneScreen = true;
            }
        } else {
            goToPhoneScreen = true;
        }

        if (goToPushNotificationScreen) {
            setNextScreen('EntryPushNotifications'); 
        } else if (goToPhoneScreen) {
            setNextScreen('EntryTextNotifications');  
        } else {
            if (profile.paperLessInfo !== undefined
                && profile.paperLessInfo.accountNumber !== undefined
                && profile.paperLessInfo.accountNumber.length > 0
                && profile.paperLessInfo.paperlessStatus !== undefined
                && (profile.paperLessInfo.paperlessStatus.toLowerCase() === 'approved'
                    || profile.paperLessInfo.paperlessStatus.toLowerCase() === 'active')
                ) {
                setNextScreen('MyTab');                  
            } else {
                setNextScreen('EntryEmailNotifications');  
            }
        }

        
        if (profile.profileDetails !== undefined
            && profile.profileDetails.memberType === "Admin") {
            if (goToPushNotificationScreen) {
                setNextScreen('EntryPushNotifications'); 
            } else {
                setNextScreen('MyTab');
            }
        }

        setProfileLoadCount(profileLoadCount + 1);
    }, [profile]);
    

    useEffect(() => {
        console.log('profileLoadCount: ', profileLoadCount);
        if (profileLoadCount > 4) {
            setLoading(false);
            console.log('profileAfterLoad: ', JSON.stringify(profile));
        }
    }, [profileLoadCount]);
    

    const termsAccepted = async () => {
        await dispatch(updateTermsAndConditions(true, null));
        await dispatch(updateWalkThroughStep(0));
        console.log('termsAccepted: ', nextScreen);
        navigation.reset({
            index: 0,
            routes: [{ name: nextScreen }],
        });

    };

    const termsCanceled = () => {
        let re = getSsoToken().then((res) => {
            console.log('token', res)
            let token = res.idToken;
            logout(config, {
              idToken: token,
              postLogoutRedirectUrl: 'com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback',
            }).then((result) => {
                storeUser({});
                storeSsoToken({});
                saveUserInfo({});
                cleanUserData();
                SetClearTimer();
                Zendesk.logout();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Splash' }]
                })
            });
        });
    };    

    return  (
        <View style={styles.container}>
            <ProfileSettingsHeader 
                showIcon={false}
                title={'Terms'}
            />
            {
                progress < 1 &&
                (
                    <View style={{...styles.progressBar}}>
                        <View style={{...styles.progress, width: `${progress * 100}%` }} />
                    </View>
                )
            }            
            <WebView
                key={url}
                source={{ uri: url }}
                onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                onError={() => setIsError(true)}
                //sharedCookiesEnabled={true}
                //injectedJavaScriptBeforeContentLoaded={initScript}
                //onNavigationStateChange={(navState) => setUrl(navState.url)}
            />  
            {isError && (
                <View style={[styles.errorContainer, { marginTop: '23%' }]}>
                    <Text style={styles.errorText}>Failed to load. Please try again later.</Text>
                </View>
            )}                           
            <View style={styles.bottomBar}>
                <View style={styles.buttonsParent} 
                    accessibilityLabel="Buttons Section">
                    <Pressable
                        style={[styles.buttonDecline, styles.buttonsLayout]}
                        onPress={termsCanceled}
                        accessibilityLabel="Decline Button"
                        accessibilityRole="button"
                        accessibilityHint="Decline Terms and Conditions"
                    >
                        <Text style={styles.decline}>
                            Decline
                        </Text>
                    </Pressable>
                    {
                        loading ?
                        (
                            <View style={[styles.buttons, styles.buttonsLayout]}>
                                <ActivityIndicator size="small" color={"white"} /> 
                            </View>  
                        )                      
                        :
                        (
                            <Pressable
                                style={[styles.buttons, styles.buttonsLayout]}
                                onPress={termsAccepted}
                            >
                                <Text style={styles.accept}>Accept</Text>
                            </Pressable>
                        )
                    }                
                </View>    
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        height: height * 0.004, // 0.4% of screen height
        backgroundColor: 'lightgrey',
    },
    progress: {
        height: '100%',
        backgroundColor: 'rgba(141, 59, 144, 1)',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: width * 0.05, // 5% of screen width
    },
    errorText: {
        fontSize: width * 0.04, // 4% of screen width
        marginBottom: height * 0.02, // 2% of screen height
    },    
    bottomBar: {
        height: 150,
        backgroundColor: '#FFF',
        borderTopColor: '#CCC',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,     
    },
    buttonDecline: {
        backgroundColor: Color.colorWhitesmoke_300,
    },    
    buttons: {
        backgroundColor: Color.colorMidnightblue,
    },
    buttonsLayout: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        minHeight: 50,
        width: '45%',
    },    
    buttonsParent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '90%',
    },    
    accept: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    decline: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,        
        color: Color.colorMidnightblue,
        textAlign: "center",
    },    
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        padding: 20,
        marginBottom: 0
    },
    scrollViewContentContainer: {
        paddingBottom: 30
    },
    sparklightImageView: {
        width: 100,
        height: 25,
        marginBottom: 10,
        marginTop: 10
    },
    sparklightImage: {
        tintColor: '#999',
        width: '100%',
        height: '100%'
    },  
    termsHeader: {
        paddingTop: 10,
    },    
    termsHeaderText: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: 22,
        color: Color.colorGray_100
    },
    termsTitle: {
        paddingTop: 10
    },    
    termsTitleText: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: 16,
        color: Color.colorGray_100,  
        marginVertical: 10              
    },
    termsDescription: {
        paddingTop: 10,
    },
    termsDescriptionText: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        lineHeight: 25,
        color: Color.colorGray_100,        
    }, 
});

export default Terms;
