import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import WebView from 'react-native-webview';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { Env } from '../../network/apis/account/Constants';
import { GetApiRequest } from '../../network/APIClient';
import { navigationRef } from '../../navigations/UserNavigations';
import analytics from '@react-native-firebase/analytics';
import { getPaymentUrl, getReferralUrl } from './PaymentUrlUtils';
import LoadingOverlay from '../common/customui/CustomLoading';
import MaintenanceAlert from './MaintenanceAlert';

const AutoPayPCIConnector = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [currentUser, setCurrentUser] = useState({});
    const [paymentDetails] = useState(route.params?.paymentDetails || {});
    const [status] = useState(route.params?.status || false);
    const [name] = useState(route.params?.name);
    const [isServiceDown, setIsServiceDown] = useState(false);
    const [html, setHtml] = useState('');
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);
    const user = useSelector(state => state.user.userData);
    const webViewRef = useRef();
    const customReferUrl = route.params?.customReferUrl || route.params?.customPaymentUrl || null;
    const aliveCheckResolver = useRef(null);
    const backgroundTimestamp = useRef(0);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const initialLoadComplete = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

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
            CustomerType: 'Residential',
            PastDueAmount: '',
            PaymentDueDate: '',
            Email: paymentDetails.email || '',
            EasyPayId: easyPayId || '',
            EasyPayEnabled: isEasyPay || false,
            TokenCookie: token || '',
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

        const param = { 
            guid: gui, 
            key: ix, 
            PaymentObj: baX, 
            RefererUrl: makePaymentUrl, 
            apiKey: Env.secretKey 
        };

        const paymentUrl = getPaymentUrl('V3');
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
                        window.addEventListener('message', function(e) {
                            if (e.data === 'PING') {
                                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'pong'}));
                            }
                        });
                        document.getElementById("paymentForm").submit();
                    </script>
                </body>
            </html>
        `;
        setHtml(html);
    };

    const showToastMessage = useCallback(() => {
        setShowToast(true);
        Animated.sequence([
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => setShowToast(false));
    }, [toastOpacity]);

    const setDynamicCookie = useCallback(async () => {
        if (!webViewRef.current) return;
        
        try {
            const currentUser = await getUser();
            const upgradeToken = await getUpgradeToken();
            
            const script = `(function() {
                try {
                    // Set cookies for portal identification
                    var domain = document.location.hostname; 
                    var expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
                    
                    document.cookie = "Source=MobileApp; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    document.cookie = "CustomerType=Residential; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                    
                    // Set tokens in localStorage
                    localStorage.setItem('jwt_token', '${currentUser.token || ""}');
                    localStorage.setItem('user_info', '${JSON.stringify(currentUser.userInfo || {}).replace(/'/g, "\\'")}');
                    localStorage.setItem('upgrades_token', '${upgradeToken?.access_token || ""}');
                    
                    console.log('PCI cookies and tokens set successfully');
                    return true;
                } catch(e) {
                    console.error('Cookie injection error:', e);
                    return false;
                }
            })();`;

            webViewRef.current.injectJavaScript(script);
        } catch (error) {
            console.warn('Cookie setting error:', error);
        }
    }, []);

    const checkWebViewAlive = useCallback(() => {
        return new Promise((resolve) => {
            if (aliveCheckResolver.current) {
                resolve(false);
                return;
            }
            
            aliveCheckResolver.current = resolve;
            
            const timeout = setTimeout(() => {
                if (aliveCheckResolver.current) {
                    aliveCheckResolver.current(false);
                    aliveCheckResolver.current = null;
                }
            }, 2000);
            
            webViewRef.current?.injectJavaScript(`
                window.postMessage('PING');
                true;
            `);
        });
    }, []);

    const recreateWebView = useCallback(() => {
        setTimeout(() => {
            setWebViewKey(Date.now());
            setContentLoaded(false);
            setProgress(0);
            initialLoadComplete.current = false;
        }, 100);
    }, []);

    const initializePayment = async () => {
        try {
            const userLocal = await getUser();
            if (!userLocal?.userInfo?.accountNumber) {
                navigation.navigate('Billing');
                return;
            }

            const accountNumber = userLocal.userInfo.accountNumber;
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("API timeout")), 15000);
            });
            
            const apiRequest = new Promise((resolve) => {
                GetApiRequest(
                    `api/Accounts/${accountNumber}/easypay`,
                    (res) => resolve(res),
                    (error) => {
                        if(error?.includes('503')) {
                            setIsServiceDown(true);
                        }
                        resolve(null);
                    }
                );
            });
            
            const res = await Promise.race([apiRequest, timeoutPromise]).catch(() => null);
            
            const freshUser = await getUser();
            
            const paymentObj = getPaymentObj(
                freshUser.token, 
                freshUser.userInfo, 
                res?.isEasyPay || false, 
                res?.easyPayId || ''
            );
            
            const type = status ? 'MANAGE' : 'SETUP';
            let referralUrl;
            
            try {
                referralUrl = getReferralUrl('V3', type, customReferUrl);
            } catch (error) {
                referralUrl = status ? Env.REFERRAL_URL_MANAGE_V3 : Env.REFERRAL_URL_SETUP_V3;
            }
            
            redirectToEBillpay(paymentObj, referralUrl);
        } catch (error) {
            navigation.navigate('Billing');
        }
    };

    useEffect(() => {
        initializePayment();
    }, []);

    const onShouldStartLoadWithRequest = useCallback((request) => {
        if (request.url.includes('/postlogout') || request.url.includes(Env.SSO_LOGIN)) {
            console.log('PCI session expired, going back');
            showToastMessage();
            navigation.goBack();
            return false;
        }
        return true;
    }, [navigation, showToastMessage]);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            if (contentLoaded) {
                setTimeout(() => setDynamicCookie(), 500);
            }
        }
    }, [user, contentLoaded, setDynamicCookie]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'background') {
                backgroundTimestamp.current = Date.now();
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const backgroundDuration = Date.now() - backgroundTimestamp.current;
                
                if (backgroundDuration > 300000) {
                    const isAlive = await checkWebViewAlive();
                    if (!isAlive) {
                        recreateWebView();
                    } else {
                        await setDynamicCookie();
                    }
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [checkWebViewAlive, recreateWebView, setDynamicCookie]);

    useEffect(() => {
        if (name) {
            analytics().logEvent('screen_view', {
                screen_name: name,
                screen_class: 'AutoPayPCIConnector'
            }).catch(console.error);
        }
    }, [name]);

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'pong' && aliveCheckResolver.current) {
                aliveCheckResolver.current(true);
                aliveCheckResolver.current = null;
            }
        } catch (error) {
            console.error("Message parsing error:", error);
        }
    };
    
    return (
        <View style={styles.container}>
            <ProfileSettingsHeader 
                onPressBack={() => navigation.goBack()} 
                title={isServiceDown ? 'Scheduled Maintenance' : name} 
            />
            
            <View style={styles.contentContainer}>
                {html && !isServiceDown && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ html }}
                        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                        onLoadStart={() => {
                            if (!initialLoadComplete.current) {
                                setContentLoaded(false);
                                setProgress(0);
                            }
                        }}
                        onLoadEnd={() => {
                            setProgress(1);
                            setTimeout(() => {
                                setContentLoaded(true);
                                initialLoadComplete.current = true;
                                setDynamicCookie();
                            }, 300);
                        }}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        sharedCookiesEnabled={true}
                        originWhitelist={['*']}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        scalesPageToFit={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        mixedContentMode="compatibility"
                        cacheEnabled={false}
                        androidLayerType="hardware"
                        nestedScrollEnabled={true}
                        overScrollMode="never"
                        style={styles.webView}
                        onError={(syntheticEvent) => {
                            console.error('WebView error:', syntheticEvent.nativeEvent);
                            setContentLoaded(true);
                        }}
                        onHttpError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            if (nativeEvent?.statusCode === 503) {
                                setIsServiceDown(true);
                            }
                            setContentLoaded(true);
                        }}
                    />
                )}

                {isServiceDown && (
                    <MaintenanceAlert/>
                )}

                {isLoading && !isServiceDown && (
                    <View style={styles.loadingOverlay}>
                        <LoadingOverlay loading={true} />
                    </View>
                )}

                {showToast && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Text style={styles.toastText}>Session expired</Text>
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: Platform.OS === 'ios' ? 90 : 60,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        zIndex: 1000,
    },
    toast: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 2000,
    },
    toastText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AutoPayPCIConnector;