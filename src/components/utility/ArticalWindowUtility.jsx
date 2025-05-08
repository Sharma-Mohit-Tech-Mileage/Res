import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, AppState, ActivityIndicator } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import colors from '../../res/Colors';
import analytics from '@react-native-firebase/analytics';
import LoadingOverlay from '../common/customui/CustomLoading';
const { width, height } = Dimensions.get('window');

const ArticalWindowUtility = ({ navigation, route }) => {
    const [initScript, setInitScript] = useState('');
    const [progress, setProgress] = useState(0);
    const [name, setTitle] = useState(route.params?.name);
    const [isExpandable, setIsExpandable] = useState(route.params?.isExpandable ?? false);
    const [isError, setIsError] = useState(false);
    const [url, setUrl] = useState(route.params?.url);
    const [currentUser, setCurrentUser] = useState({});
    const [modalOpen, setModalOpen] = useState(true);
    const [navStateReloading, setNavStateReloading] = useState(false);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [appState, setAppState] = useState(AppState.currentState);
    const user = useSelector(state => state.combinedReducers.user.userData);
    const webViewRef = useRef();
    const [hasTrackedInitialScreen, setHasTrackedInitialScreen] = useState(false);

    const toggleModal = () => {
        setShowPDFModal(!showPDFModal);
    };

    const setDynamicCookie = () => {
        if (webViewRef?.current) {
            const script = `(function() {
                var cookieValue = "MobileApp";
                var domain = document.location.hostname; 
                var expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
                
                document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
                
                localStorage.setItem('jwt_token', '${currentUser.token}');
                localStorage.setItem('user_info', '${JSON.stringify(currentUser?.userInfo)}');
                var upgradeToken = '${currentUser.upgradeToken}';
                localStorage.setItem('upgrades_token', upgradeToken);
            })();`;
            webViewRef.current.injectJavaScript(script);
        } else {
            console.warn('WebView ref is not available for injecting JavaScript. Navigating back to Dashboard.');
            if (navigationRef.current) {
                navigationRef.current.navigate('Dashboard');
            }
        }
    };


    const navigationChange = async (navState) => {
        if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
            if (!navStateReloading) {
                setModalOpen(false);
                setProgress(1);
                setNavStateReloading(true);
                try {
                    await RefreshToken();
                    setTimeout(async () => {
                        await userUpdate();
                    }, 1000);
                } catch (error) {
                    console.error("Error during navigation change token refresh", error);
                    if (navigationRef.current) {
                        navigationRef.current.navigate('Splash');
                    }
                }
            }
        }
    };

    const onMessage = (event) => {

        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('File Data', JSON.stringify(data))
            if (data.type === "XMLHttpRequest" && data.status === 200) {
                if ((data.responseURL.includes("/statements/") || data.responseURL.includes("/api/Statement")|| data.responseURL.includes("/api/Statement"))) {
                const responseData = JSON.parse(data.response);
                
                    if (responseData.fileBinary) {
                        const base64Data = responseData.fileBinary;
                        setShowPDFUrl(base64Data);
                        setShowPDFModal(true);
                    } else {
                        console.log('fileBinary is missing, modal will not open');
                    }
                }
            }
        } catch (error) {
            console.log('onMessageError: ', error);
        }
    };

    const userUpdate = async () => {
        const userLocal = await getUser();

        if (userLocal.token === currentUser.token) {
            console.log('Tokens match, retrying user update');
            setTimeout(async () => {
                await userUpdate();
            }, 1000);
        } else {
            setNavStateReloading(false);
            userUpdateScript(userLocal);
            setUrl(route.params?.url);
            setModalOpen(true);
            setProgress(0);
            setCurrentUser(userLocal);
        }
    };

    const userUpdateScript = async (user) => {
        const upgradeToken = await getUpgradeToken();
        user.userInfo['customerType'] = "Residential";

        if (user.token !== undefined) {
            const SAVE_FROM_RN = `(function() {
                localStorage.setItem('jwt_token', '${user.token}');
                localStorage.setItem('user_info', '${JSON.stringify(user.userInfo)}');
                localStorage.setItem('upgrades_token', '${upgradeToken?.access_token}');
    
                var cookieValue = "MobileApp";
                var domain = document.location.hostname; 
                var expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (365 * 24 * 60 * 60 * 1000)); 
                document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
    
                var originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url) {
                    this.addEventListener("load", function(event) {
                        console.log('Intercepted URL:', url); // Log for debugging
                        if (url.includes("/statements/") || url.includes("Statement")) {
                            var message = {
                                "type": "XMLHttpRequest",
                                "status": this.status,
                                "responseURL": this.responseURL,
                                "response": this.response
                            };
                            console.log('Sending message:', message); // Debug log
                            window.ReactNativeWebView.postMessage(JSON.stringify(message));
                        }
                    }); 
                    originalOpen.apply(this, arguments);
                };
    
                var originalFetch = window.fetch;
                window.fetch = function() {
                    return originalFetch.apply(this, arguments).then(function(response) {
                        console.log('Intercepted fetch URL:', response.url); // Log for debugging
                        if (response.url.includes("/statements/") || response.url.includes("Statement")) {
                            response.clone().text().then(function(responseText) {
                                var message = {
                                    "type": "fetch",
                                    "status": response.status,
                                    "responseURL": response.url,
                                    "response": responseText
                                };
                                console.log('Sending fetch message:', message); // Debug log
                                window.ReactNativeWebView.postMessage(JSON.stringify(message));
                            });
                        }
                        return response;
                    });
                };
            })();`;

            setInitScript(prevScript => `${prevScript}\n${SAVE_FROM_RN}`);
        }
    };

    useEffect(() => {
        console.log('Screen Tracking useEffect triggered');
        console.log('Current name:', name);
        console.log('hasTrackedInitialScreen:', hasTrackedInitialScreen);

        const trackScreen = async () => {
            if (name && !hasTrackedInitialScreen) {
                console.log('Attempting to track screen with name:', name);
                try {
                    await analytics().logEvent('screen_view', {
                        screen_name: name,
                        screen_class: name
                    });
                    console.log('Successfully tracked screen_view event:', {
                        screen_name: name,
                        screen_class: 'ArticalWindowUtility'
                    });
                    setHasTrackedInitialScreen(true);
                    console.log('Set hasTrackedInitialScreen to true');
                } catch (error) {
                    console.error('Analytics error details:', {
                        error: error.message,
                        name: name,
                        stack: error.stack
                    });
                }
            } else {
                console.log('Skipped tracking because:', {
                    hasName: !!name,
                    name: name,
                    hasTrackedInitialScreen: hasTrackedInitialScreen
                });
            }
        };

        trackScreen();
    }, [name]);

    useEffect(() => {
        setProgress(0);
        setIsError(false);
    }, [url, name, modalOpen]);

    useEffect(() => {
        if (modalOpen) {
            setUrl(route.params?.url);
            setTitle(route.params?.name);
            setIsExpandable(route.params?.isExpandable);
        }
    }, [modalOpen]);

    useEffect(() => {
        setCurrentUser(user);
        userUpdateScript(user);
        setDynamicCookie();
    }, [user]);

    useEffect(() => {
        const handleAppStateChange = nextAppState => {
            if (appState?.match(/inactive|background/) && nextAppState === 'active') {
                setTimeout(() => {
                    if (webViewRef?.current) {
                        webViewRef.current.reload();
                    } else {
                        if (navigationRef.current) {
                            navigationRef.current.navigate('Dashboard');
                        }
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
        setDynamicCookie();
    }, [url, modalOpen, appState]);


    const Spinner = () => (
        <View style={styles.activityContainer}>
            <LoadingOverlay loading={true} />
        </View>
    );
    return (
        <View style={{ flex: 1, marginBottom: (Platform.OS == 'ios') ? 90 : 60 }}>
            <ProfileSettingsHeader onPressBack={() => {
                if (route.params?.isBilling) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "MyTab" }],
                    });
                }else if (route.params?.isPayBill) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "MyServices" }],
                    });
                }
                 else {
                    navigation.goBack();
                }
                setModalOpen(false);
            }} title={name} />
            {progress < 1 ? (
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                </View>
            ) : null}
            {modalOpen && (
                <WebView
                    ref={webViewRef}
                    key={url}
                    source={{ uri: url }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                    sharedCookiesEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={initScript}
                    onNavigationStateChange={navigationChange}
                    onMessage={onMessage}
                    originWhitelist={['http://*', 'https://*', 'data:*']}
                    startInLoadingState={true}
                    renderLoading={Spinner}
                    incognito={true}
                />
            )}
            {isError ? (
                <View style={[styles.errorContainer, { marginTop: '23%' }]}>
                    <Text style={styles.errorText}>Failed to load. Please try again later.</Text>
                </View>
            ) : null}
            {showPDFModal && (
                <PDFViewModal
                    url={showPDFUrl}
                    onClose={() => toggleModal()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        height: height * 0.004,
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
        padding: width * 0.05,
    },
    errorText: {
        fontSize: width * 0.04,
        marginBottom: height * 0.02,
    },
    activityContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000000',
        height: '100%',
        width: '100%',
    }
});

export default ArticalWindowUtility;