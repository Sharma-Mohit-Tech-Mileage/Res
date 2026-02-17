import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, AppState } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
import { navigationRef } from '../../navigations/UserNavigations';
import analytics from '@react-native-firebase/analytics';
import { getPaymentUrl, getReferralUrl } from './PaymentUrlUtils';
import LoadingOverlay from '../common/customui/CustomLoading';
import MaintenanceAlert from './MaintenanceAlert';

const { height, width } = Dimensions.get('window');

const AutoPayPCIConnector = ({ navigation, route }) => {
    const [initScript, setInitScript] = useState('');
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(route.params?.url || Env.URL);
    const [currentUser, setCurrentUser] = useState({});
    const [paymentDetails, setPaymentDetails] = useState(route.params?.paymentDetails || {});
    const [status, setStatus] = useState(route.params?.status || false);
    const [name, setTitle] = useState(route.params?.name);
    const [navStateReloading, setNavStateReloading] = useState(false);
    const [ isServiceDown, setIsServiceDown ] = useState(false);
    const user = useSelector(state => state.user.userData);
    const webViewRef = useRef();
    const [html, setHtml] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
    const [hasTrackedInitialScreen, setHasTrackedInitialScreen] = useState(false);
    const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
    
    const customReferUrl = route.params?.customReferUrl || route.params?.customPaymentUrl || null;

    console.log('AutoPayPCIConnector', paymentDetails);
    
    const generateGuid = () => {
        const p8 = (s) => {
            const p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        };
        return p8(0) + p8(true) + p8(true) + p8(0);
    };

    const generateIV = (guiHex) => {
        let bytes = '';
        for (let c = 0; c <= guiHex.length - 1; c += 2) {
            bytes += guiHex.substr(c, 1);
        }
        return bytes;
    };

    const getPaymentObj = (token, user, isEasyPay, easyPayId) => {
        return {
            AccountNumber: user.accountNumber || '',
            FirstName: user.firstName || '',
            LastName: user.lastName || '',
            TotalDue: paymentDetails.billAmount,
            PastDue: paymentDetails.pastPaymentDue || 0,
            DueDate: paymentDetails.dueDate,
            CustomerType: 'Residential' || '',
            PastDueAmount: '',
            PaymentDueDate: '',
            Email: paymentDetails.email || '',
            EasyPayId: easyPayId || '',
            EasyPayEnabled: isEasyPay || false,
            TokenCookie: token || '',
        };
    };

    const redirectToEBillpay = (paymentObj, makePaymentUrl) => {
        console.log('Payment object:', paymentObj);
        const data = JSON.stringify(paymentObj);
        const gui = generateGuid();
        const guiTrim = gui.split('-').join('');

        const key = CryptoJS.enc.Utf8.parse(Env.encryptvalPassword);
        const ix = generateIV(guiTrim);
        const iv = CryptoJS.enc.Utf8.parse(ix);

        const baX = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
            keySize: 256,
            blockSize: 128,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

        const param = { guid: gui, key: ix, PaymentObj: baX, RefererUrl: makePaymentUrl, apiKey: Env.secretKey };

        const version = 'V3';
        const paymentUrl = getPaymentUrl(version);
        
        post(param, paymentUrl);
    };

    const post = (obj, url) => {
        const html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
                    <style>
                        html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <form id="paymentForm" action="${url}" method="POST">
                        ${Object.keys(obj).map(key => `<input type="hidden" name="${key}" value="${obj[key]}" />`).join('')}
                    </form>
                    <script>
                        // Simple script to immediately submit the form
                        document.getElementById("paymentForm").submit();
                    </script>
                </body>
            </html>
        `;
        setHtml(html);
    };

    const setDynamicCookie = () => {
        if (!webViewRef.current) return;
        
        try {
            const script = `(function() {
                try {
                    var cookieValue = "MobileApp";
                    var customerType = "Residential";
                    var domain = document.location.hostname; 
                    var expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
                    
                    // Set cookies
                    document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    document.cookie = "CustomerType=" + customerType + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    
                    // Set localStorage
                    localStorage.setItem('jwt_token', '${currentUser.token || ""}');
                    localStorage.setItem('user_info', '${JSON.stringify(currentUser.userInfo || {}).replace(/'/g, "\\'")}');
                    localStorage.setItem('upgrades_token', '${currentUser?.upgradeToken || ""}');
                    
                    return true;
                } catch(e) {
                    console.error("Error in cookie setting:", e);
                    return true;
                }
            })();`;

            webViewRef.current.injectJavaScript(script);
        } catch (error) {
            console.warn('WebView reference error:', error);
        }
    };

    const initializePayment = async () => {
        try {
            const userLocal = await getUser();
            if (!userLocal || !userLocal.userInfo || !userLocal.userInfo.accountNumber) {
                navigation.navigate('Billing');
                return;
            }

            const accountNumber = userLocal.userInfo.accountNumber;
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("API request timed out")), 15000);
            });
            
            const apiRequest = new Promise((resolve) => {
                GetApiRequest(
                   `api/Accounts/${accountNumber}/easypay`,
                    (res) => {
                        resolve(res);
                    },
                    (error) => {
                        console.error("Error fetching payment details:", error);
                        if(error?.includes('503')) {
                            setIsServiceDown(true);
                        }
                        resolve(null); 
                    }
                );
            });
            
            const res = await Promise.race([apiRequest, timeoutPromise]).catch(error => {
                console.error("API request failed:", error);
                return null;
            });
            
            if (!res) {
                const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, false, '');
                const version = 'V3';
                const type = status ? 'MANAGE' : 'SETUP';
                let referralUrl;
                
                try {
                    referralUrl = getReferralUrl(version, type, customReferUrl);
                } catch (error) {
                    if (version === 'V3') {
                        referralUrl = status ? (Env.REFERRAL_URL_MANAGE_V3 ) : (Env.REFERRAL_URL_SETUP_V3 );
                    } else {
                        referralUrl = status ? (Env.REFERRAL_URL_MANAGE_V2 ) : (Env.REFERRAL_URL_SETUP_V2 );
                    }
                }
                
                redirectToEBillpay(paymentObj, referralUrl);
                return;
            }
            
            const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.isEasyPay, res?.easyPayId);
            
            const version = 'V3';
            const type = status ? 'MANAGE' : 'SETUP';
            let referralUrl;
            
            try {
                referralUrl = getReferralUrl(version, type, customReferUrl);
            } catch (error) {
                if (version === 'V3') {
                    referralUrl = status ? (Env.REFERRAL_URL_MANAGE_V3 ) : (Env.REFERRAL_URL_SETUP_V3 );
                } else {
                    referralUrl = status ? (Env.REFERRAL_URL_MANAGE_V2 ) : (Env.REFERRAL_URL_SETUP_V2 );
                }
            }
            
            redirectToEBillpay(paymentObj, referralUrl);
        } catch (error) {
            navigation.navigate('Billing');
        }
    };

    useEffect(() => {
        const refreshAndInitialize = async () => {
            try {
                await RefreshToken();
                await initializePayment();
            } catch (error) {
                if (navigationRef.current) {
                    navigationRef.current.navigate('Splash');
                }
            }
        };

        refreshAndInitialize();
    }, []);


const navigationChange = async (navState) => {
    if (!navState || !navState.url) return;
    
    console.log("Navigation change to:", navState.url);
    
    if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
        if (!navStateReloading) {
            navigation.navigate('Billing');
        }
    }
};

    const userUpdate = async () => {
        const userLocal = await getUser();
        if (userLocal.token === currentUser.token) {
            setTimeout(userUpdate, 1000);
        } else {
            setNavStateReloading(false);
            userUpdateScript(userLocal);
            setUrl(route.params?.url || Env.URL);
            setProgress(0);
            setCurrentUser(userLocal);
        }
    };

    const userUpdateScript = async (user) => {
        const upgradeToken = await getUpgradeToken();
        if (user.token) {
            const SAVE_FROM_RN = `(function() {
                try {
                    localStorage.setItem('jwt_token', '${user.token}');
                    localStorage.setItem('user_info', '${JSON.stringify(user.userInfo || {}).replace(/'/g, "\\'")}');
                    localStorage.setItem('upgrades_token', '${upgradeToken?.access_token || ""}');
                    
                    var cookieValue = "MobileApp";
                    var customerType = "Residential";
                    var domain = document.location.hostname; 
                    var expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
                    
                    document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    document.cookie = "CustomerType=" + customerType + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    
                    var open = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function() {
                        this.addEventListener("load", function(event) {
                            if (this.responseURL && this.responseURL.match('/account/.*/statements/') !== null) {
                                var message = {"status" : this.status, "responseURL" : this.responseURL, "response" : this.response}
                                window.ReactNativeWebView.postMessage(JSON.stringify(message));
                            }
                        });
                        open.apply(this, arguments);
                    };
                } catch(e) {
                    console.error("Error updating session:", e);
                }
                return true;
            })();`;
            setInitScript(SAVE_FROM_RN);
        }
    };

    useEffect(() => {
        setProgress(0);
    }, [url]);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            userUpdateScript(user);
            if (isWebViewLoaded) {
                setTimeout(() => setDynamicCookie(), 500);
            }
        }
    }, [user, isWebViewLoaded]);

    useEffect(() => {
        const handleAppStateChange = nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                setTimeout(() => {
                    if (webViewRef.current && !webViewRef.current.loading) {
                        webViewRef.current.reload();
                    }
                }, 500);
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [appState]);

    useEffect(() => {
        console.log('PCI Screen Tracking useEffect triggered');

        const trackScreen = async () => {
            if (name && !hasTrackedInitialScreen) {
                try {
                    await analytics().logEvent('screen_view', {
                        screen_name: name,
                        screen_class: 'AutoPayPCIConnector'
                    });
                    setHasTrackedInitialScreen(true);
                } catch (error) {
                    console.error('PCI Analytics error:', error.message);
                }
            }
        };

        trackScreen();
    }, [name]);

    // Handler for WebView messages
    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("WebView message received:", data);
        } catch (error) {
            console.error("Error parsing WebView message:", error);
        }
    };
    
    return (
        <View style={styles.container}>
            <ProfileSettingsHeader onPressBack={() => { navigation.goBack(); }} title={isServiceDown?'Scheduled Maintenance':name} />
            {(!isServiceDown && progress < 1) && (
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                </View>
            )}
            {html ? (
                isServiceDown ? (
                    <View style={{ flex: 1, backgroundColor:'#ebeef1' }}> 
                        <MaintenanceAlert/>
                    </View>
                ) : (
                <WebView
                    ref={webViewRef}
                    source={{ html }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                    onLoadStart={() => {
                        console.log("WebView started loading");
                        setIsWebViewLoaded(false);
                    }}
                    onLoadEnd={() => {
                        console.log("WebView finished loading");
                        setProgress(1);
                        setIsWebViewLoaded(true);
                        setTimeout(() => setDynamicCookie(), 500);
                    }}
                    onMessage={onMessage}
                    sharedCookiesEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={initScript}
                    onNavigationStateChange={navigationChange}
                    originWhitelist={['*']}
                    incognito={false} // Changed to false to allow cookies
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    scalesPageToFit={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    mixedContentMode="compatibility"
                    cacheEnabled={false}
                    androidHardwareAccelerationDisabled={Platform.OS === 'android'}
                    onShouldStartLoadWithRequest={(request) => {
                        console.log("Load request:", request.url);
                        return true;
                    }}
                    style={styles.webView}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView error: ', nativeEvent);
                    }}
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView HTTP error: ', nativeEvent);
                        if (nativeEvent?.statusCode === 503) {
                                setIsServiceDown(true);
                            }
                    }}
                />
                )
            ) : (
                <View style={styles.loadingContainer}>
                    <LoadingOverlay
                        loading={true}
                       
                        
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: (Platform.OS === 'ios') ? 90 : 60,
    },
    webView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(141, 59, 144, 1)',
        textAlign: 'center',
    },
    progressBar: {
        height: height * 0.004,
        backgroundColor: 'lightgrey',
        width: '100%',
    },
    progress: {
        height: '100%',
        backgroundColor: 'rgba(141, 59, 144, 1)',
    },
});

export default AutoPayPCIConnector;