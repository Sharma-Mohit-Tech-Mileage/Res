import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform, AppState, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
import { navigationRef } from '../../navigations/UserNavigations';
const { height, width } = Dimensions.get('window');

const AutoPayPCIConnector = ({ navigation, route }) => {
    const [initScript, setInitScript] = useState('');
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(route.params?.url || 'https://customer.uat.sparklight.com/residential');
    const [currentUser, setCurrentUser] = useState({});
    const [useNewPayment, setuseNewPayment] = useState(route.params?.useNewPayment || false);
    const [paymentDetails, setPaymentDetails] = useState(route.params?.paymentDetails || {});
    const [status, setStatus] = useState(route.params?.status || false);
    const [name, setTitle] = useState(route.params?.name);
    const [navStateReloading, setNavStateReloading] = useState(false);
    const user = useSelector(state => state.combinedReducers.user.userData);
    const webViewRef = useRef();
    const [html, setHtml] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
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

        const param = { guid: gui, key: ix, PaymentObj: baX, RefererUrl: makePaymentUrl };
        post(param, useNewPayment ? Env.PAYMENTURL_V3 : Env.PAYMENTURL_V2);
    };

    const post = (obj, url) => {
        const html = `
            <html>
                <body>
                    <form id="paymentForm" action="${url}" method="POST">
                        ${Object.keys(obj).map(key => `<input type="hidden" name="${key}" value="${obj[key]}" />`).join('')}
                    </form>
                    <script>
                        document.getElementById("paymentForm").submit();
                    </script>
                </body>
            </html>
        `;
        setHtml(html);
    };

    const setDynamicCookie = () => {
        user.userInfo['customerType']= "Residential";
        const script = `(function() {
            var cookieValue = "MobileApp";
            var customerType = "Residential";
            var domain = document.location.hostname; 
            var expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
            document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
            document.cookie = "CustomerType=" + customerType + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
            
            localStorage.setItem('jwt_token', '${currentUser.token}');
            localStorage.setItem('user_info', '${JSON.stringify(currentUser.userInfo)}');
            var upgradeToken = '${currentUser.upgradeToken}';
            localStorage.setItem('upgrades_token', upgradeToken);
        })();`;

        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(script);
        } else {
            console.warn('WebView reference is not available to inject JavaScript.');
        }
    };

    const initializePayment = async () => {
        try {
            const userLocal = await getUser();
            const accountNumber = userLocal.userInfo.accountNumber;

            GetApiRequest(
                `account/api/account/${accountNumber}/easypay`,
                (res) => {
                    console.log("Payment details fetched successfully:", res);
                    const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.isEasyPay, res?.easyPayId);
                    const payURL = useNewPayment
                        ? (status ? Env.URL_EASYPAY_MANAGE_V3 : Env.URL_EASYPAY_SETUP_V3)
                        : (status ? Env.URL_EASYPAY_MANAGE_V2 : Env.URL_EASYPAY_SETUP_V2);
                    console.log("Payment details fetched successfully:", payURL);
                    redirectToEBillpay(paymentObj, payURL);
                },
                (error) => {
                    console.error("Error fetching payment details:", error);
                }
            );
        } catch (error) {
            console.error("Error initializing payment:", error);
        }
    };

    useEffect(() => {
        const refreshAndInitialize = async () => {
            try {
                await RefreshToken();
                await initializePayment();
            } catch (error) {
                console.error("Error during navigation change token refresh", error);
                if (navigationRef.current) {
                    navigationRef.current.navigate('Splash');  // Navigate to Splash screen on error
                }
            }
        };

        refreshAndInitialize();
    }, []);

    const navigationChange = async (navState) => {
        //setDynamicCookie();  // Update cookie on any navigation change

        if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
            if (!navStateReloading) {
                navigation.navigate('Dashboard');
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
            setUrl(route.params?.url || 'https://customer.uat.sparklight.com/residential');
            setProgress(0);
            setCurrentUser(userLocal);
        }
    };

    const userUpdateScript = async (user) => {
        const upgradeToken = await getUpgradeToken();
        if (user.token) {
            const SAVE_FROM_RN = `(function() {
                localStorage.setItem('jwt_token', '${user.token}');
                localStorage.setItem('user_info', '${JSON.stringify(user.userInfo)}');
                localStorage.setItem('upgrades_token', '${upgradeToken.access_token}');
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
                        if (this.responseURL.match('/account/.*/statements/') !== null) {
                            var message = {"status" : this.status, "responseURL" : this.responseURL, "response" : this.response}
                            window.ReactNativeWebView.postMessage(JSON.stringify(message));
                        }
                    });
                    open.apply(this, arguments);
                };
            })();`;
            setInitScript(SAVE_FROM_RN);
        }
    };

    useEffect(() => {
        setProgress(0);
    }, [url]);

    useEffect(() => {
        setCurrentUser(user);
        userUpdateScript(user);
        setDynamicCookie();  // Set cookie when user is updated
    }, [user]);

    useEffect(() => {
        const handleAppStateChange = nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                setTimeout(() => {
                    if (webViewRef.current && !webViewRef.current.loading) {
                        webViewRef.current.reload();
                    } else {
                        console.warn('WebView ref is not available for reload or is still loading.');
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
        setDynamicCookie();  // Push cookie when component is first mounted
    }, [url, appState]);

    return (
        <View style={{ flex: 1, marginBottom: (Platform.OS === 'ios') ? 90 : 60 }}>
            <ProfileSettingsHeader onPressBack={() => { navigation.goBack(); }} title={name} />
            {progress < 1 && (
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                </View>
            )}
            {html ? (
                <WebView
                    ref={webViewRef}
                    source={{ html }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                    onLoadEnd={() => setProgress(1)}  // Set progress to 1 when load ends
                    sharedCookiesEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={initScript}
                    onNavigationStateChange={navigationChange}
                    originWhitelist={['http://*', 'https://*', 'data:*']}
                    incognito={true}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView error: ', nativeEvent);
                    }}
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView HTTP error: ', nativeEvent);
                        if (!navStateReloading) {
                            navigation.navigate('Dashboard');
                        }
                    }}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="rgba(141, 59, 144, 1)" />
                    <Text style={styles.loadingText}>Preparing content...</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(141, 59, 144, 1)',
        textAlign: 'center',
    },
    progressBar: {
        height: height * 0.004, // 0.4% of screen height
        backgroundColor: 'lightgrey',
    },
    progress: {
        height: '100%',
        backgroundColor: 'rgba(141, 59, 144, 1)',
    },
});

export default AutoPayPCIConnector;

