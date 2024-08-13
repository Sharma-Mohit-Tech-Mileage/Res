import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
const { height } = Dimensions.get('window');

const AutoPayPCIConnector = ({ navigation, route }) => {
    const [initScript, setInitScript] = useState('');
    const [progress, setProgress] = useState(0);
    const [url, setUrl] = useState(route.params?.url || 'https://customer.uat.sparklight.com/residential');
    const [currentUser, setCurrentUser] = useState({});
    const [useNewPayment, setuseNewPayment] = useState(route.params?.useNewPayment || false);
    const [status, setStatus] = useState(route.params?.status || false);
    const [name, setTitle] = useState(route.params?.name);
    const [navStateReloading, setNavStateReloading] = useState(false);
    const user = useSelector(state => state.combinedReducers.user.userData);
    const webViewRef = useRef();
    const [html, setHtml] = useState('');

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

    const getPaymentObj = (token, user, paymentId, easyPayId) => {
        return {
            AccountNumber: user.accountNumber || '',
            FirstName: user.firstName || '',
            LastName: user.lastName || '',
            TotalDue: '0',
            CustomerType: user.customerType || '',
            PastDueAmount: '',
            PaymentDueDate: '',
            Email: user.email || '',
            EasyPayId: easyPayId || '',
            EasyPayEnabled: '',
            TokenCookie: token || '',
            PaymentId: paymentId || '',
        };
    };

    const redirectToEBillpay = (paymentObj, makePaymentUrl) => {
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

    const initializePayment = async () => {
        try {
            const userLocal = await getUser();
            const accountNumber = userLocal.userInfo.accountNumber;

            GetApiRequest(
                `account/api/account/${accountNumber}/easypay`,
                (res) => {
                    const paymentObj = getPaymentObj(userLocal.token, userLocal.userInfo, res?.paymentId, res?.EasyPayId);
                    redirectToEBillpay(paymentObj, useNewPayment ? (status ? Env.URL_EASYPAY_MANAGE_V3 : Env.URL_EASYPAY_SETUP_V3) : (status ? Env.URL_EASYPAY_MANAGE_V2 : Env.URL_EASYPAY_SETUP_V2));
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
        initializePayment();
    }, []);

    const navigationChange = async (navState) => {
        if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
            if (!navStateReloading) {
                setProgress(1);
                setNavStateReloading(true);
                await RefreshToken();
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
    }, [user]);

    return (
        <View style={{ flex: 1, marginBottom: (Platform.OS === 'ios') ? 90 : 60 }}>
            <ProfileSettingsHeader onPressBack={() => { navigation.goBack(); }} title={name} />
            {progress < 1 && (
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                </View>
            )}
            {html && (
                <WebView
                    ref={webViewRef}
                    source={{ html }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
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
                    }}
                />

            )}
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
});
export default AutoPayPCIConnector;
