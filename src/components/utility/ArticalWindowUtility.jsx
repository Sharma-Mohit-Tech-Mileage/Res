import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Animated } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import analytics from '@react-native-firebase/analytics';
import LoadingOverlay from '../common/customui/CustomLoading';
import LoadingSpinner from './LoadingSpinner';
import { getUser, getUpgradeToken } from '../../redux/utils/LocalStorage';

const ArticalWindowUtility = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [name] = useState(route.params?.name);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [url] = useState(route.params?.url);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [webViewKey, setWebViewKey] = useState(Date.now());
    const [showToast, setShowToast] = useState(false);
    const [webViewReady, setWebViewReady] = useState(false);
    const [injectionScript, setInjectionScript] = useState('');
    const user = useSelector(state => state.user.userData);
    const webViewRef = useRef();
    const aliveCheckResolver = useRef(null);
    const backgroundTimestamp = useRef(0);
    const toastOpacity = useRef(new Animated.Value(0)).current;
    const initialLoadComplete = useRef(false);
    const sessionInjected = useRef(false);

    const isLoading = !contentLoaded || progress < 1;

    // Prepare injection script with current user data
    const prepareInjectionScript = useCallback(async () => {
        try {
            const currentUser = await getUser();
            const upgradeToken = await getUpgradeToken();
            
            const script = `
                (function() {
                    try {
                        console.log('Session injection started');
                        
                        // Set tokens FIRST
                        const token = '${currentUser?.token || ''}';
                        const userInfo = '${JSON.stringify(currentUser?.userInfo || {})}';
                        const upgradeTokenValue = '${upgradeToken?.access_token || ''}';
                        
                        if (token) {
                            localStorage.setItem('jwt_token', token);
                            console.log('JWT token set');
                        }
                        if (userInfo && userInfo !== '{}') {
                            localStorage.setItem('user_info', userInfo);
                            console.log('User info set');
                        }
                        if (upgradeTokenValue) {
                            localStorage.setItem('upgrades_token', upgradeTokenValue);
                            console.log('Upgrade token set');
                        }
                        
                        // Set cookies SECOND
                        const domain = location.hostname;
                        const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
                        document.cookie = "Source=MobileApp; domain=" + domain + "; path=/; expires=" + expires + "; SameSite=Lax";
                        document.cookie = "CustomerType=Residential; domain=" + domain + "; path=/; expires=" + expires + "; SameSite=Lax";
                        console.log('Cookies set');
                        
                        // PDF interceptor
                        if (!window.pdfInterceptorSetup) {
                            const origOpen = XMLHttpRequest.prototype.open;
                            XMLHttpRequest.prototype.open = function(method, url) {
                                this.addEventListener('load', function() {
                                    if ((url.includes('/statements/') || url.includes('Statement')) && this.status === 200) {
                                        try {
                                            const data = JSON.parse(this.response);
                                            if (data.fileBinary) {
                                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                                    type: 'pdf',
                                                    data: data.fileBinary
                                                }));
                                            }
                                        } catch(e) {}
                                    }
                                });
                                origOpen.apply(this, arguments);
                            };
                            window.pdfInterceptorSetup = true;
                        }
                        
                        // Form state management
                        window.saveFormState = function() {
                            const formData = {};
                            document.querySelectorAll('input, select, textarea').forEach((el, i) => {
                                if (el.type !== 'password' && el.value) {
                                    formData['field_' + i] = {
                                        value: el.value,
                                        id: el.id,
                                        name: el.name
                                    };
                                }
                            });
                            localStorage.setItem('formState', JSON.stringify(formData));
                            localStorage.setItem('scrollPosition', window.scrollY);
                        };
                        
                        window.restoreFormState = function() {
                            const saved = localStorage.getItem('formState');
                            if (saved) {
                                try {
                                    const formData = JSON.parse(saved);
                                    document.querySelectorAll('input, select, textarea').forEach((el, i) => {
                                        const savedField = formData['field_' + i];
                                        if (savedField && el.type !== 'password') {
                                            el.value = savedField.value;
                                        }
                                    });
                                    
                                    const scrollPos = localStorage.getItem('scrollPosition');
                                    if (scrollPos) {
                                        window.scrollTo(0, parseInt(scrollPos));
                                    }
                                } catch(e) {}
                            }
                        };
                        
                        // Ping/pong for alive check
                        window.addEventListener('message', function(e) {
                            if (e.data === 'PING') {
                                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'pong'}));
                            } else if (e.data === 'SAVE_STATE') {
                                window.saveFormState();
                            }
                        });
                        
                        // Auto-save every 5 seconds
                        setInterval(window.saveFormState, 5000);
                        
                        // Restore on load
                        if (document.readyState === 'complete') {
                            window.restoreFormState();
                        } else {
                            window.addEventListener('load', window.restoreFormState);
                        }
                        
                        // Signal injection complete
                        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'injectionComplete'}));
                        console.log('Session injection completed');
                        
                    } catch(e) {
                        console.error('Session injection error:', e);
                        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'injectionError', error: e.toString()}));
                    }
                })();
                true;
            `;
            
            setInjectionScript(script);
            setWebViewReady(true);
        } catch (error) {
            console.error('Failed to prepare injection script:', error);
            setWebViewReady(true); // Proceed anyway
        }
    }, []);

    useEffect(() => {
        prepareInjectionScript();
    }, [prepareInjectionScript]);

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

    const refreshTokenInWebView = useCallback(async () => {
        try {
            const currentUser = await getUser();
            const upgradeToken = await getUpgradeToken();
            
            webViewRef.current?.injectJavaScript(`
                (function() {
                    const domain = location.hostname;
                    const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
                    document.cookie = "Source=MobileApp; domain=" + domain + "; path=/; expires=" + expires + "; SameSite=Lax";
                    document.cookie = "CustomerType=Residential; domain=" + domain + "; path=/; expires=" + expires + "; SameSite=Lax";
                    
                    localStorage.setItem('jwt_token', '${currentUser.token}');
                    localStorage.setItem('user_info', '${JSON.stringify(currentUser.userInfo)}');
                    localStorage.setItem('upgrades_token', '${upgradeToken?.access_token || ""}');
                    window.dispatchEvent(new Event('tokenRefreshed'));
                })();
                true;
            `);
        } catch(e) {
            console.error('Token refresh in WebView failed:', e);
        }
    }, []);

    const recreateWebView = useCallback(() => {
        webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
        setTimeout(() => {
            sessionInjected.current = false;
            setWebViewKey(Date.now());
            setContentLoaded(false);
            setProgress(0);
            initialLoadComplete.current = false;
        }, 100);
    }, []);

    const onShouldStartLoadWithRequest = useCallback((request) => {
        // Allow the initial load to proceed
        if (!sessionInjected.current && !request.url.includes('/postlogout') && !request.url.includes(Env.SSO_LOGIN)) {
            return true;
        }
        
        // Block logout/login redirects
        if (request.url.includes('/postlogout') || request.url.includes(Env.SSO_LOGIN)) {
            console.log('Blocked logout redirect:', request.url);
            showToastMessage();
            navigationRef.current?.navigate('Splash');
            return false;
        }
        
        return true;
    }, [showToastMessage]);

    const onMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            
            if (data.type === 'injectionComplete') {
                sessionInjected.current = true;
                console.log('Session injection confirmed');
            } else if (data.type === 'injectionError') {
                console.error('Injection error:', data.error);
            } else if (data.type === 'pong' && aliveCheckResolver.current) {
                aliveCheckResolver.current(true);
                aliveCheckResolver.current = null;
            } else if (data.type === 'pdf' && data.data) {
                setShowPDFUrl(data.data);
                setShowPDFModal(true);
            }
        } catch (error) {
            console.log('Message parsing error:', error);
        }
    }, []);

    const onLoadStart = useCallback(() => {
        if (!initialLoadComplete.current) {
            setProgress(0);
            setContentLoaded(false);
        }
        setIsError(false);
        setErrorMessage('');
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
    }, []);

    const onLoadEnd = useCallback(() => {
        setProgress(1);
        setTimeout(() => {
            setContentLoaded(true);
            initialLoadComplete.current = true;
        }, 300);
    }, []);

    const onError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        setIsError(true);
        setContentLoaded(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        
        if (nativeEvent.statusCode === 404) {
            setIsError(true);
            setContentLoaded(true);
            setErrorMessage('Page not found. Please verify your account has access to this feature.');
        } else if (nativeEvent.statusCode === 403) {
            setIsError(true);
            setContentLoaded(true);
            setErrorMessage('Access denied. Please check your permissions.');
        } else if (nativeEvent.statusCode >= 500) {
            setIsError(true);
            setContentLoaded(true);
            setErrorMessage('Server error. Please try again later.');
        }
    }, []);

    useEffect(() => {
        if (!user?.token) {
            Alert.alert(
                'Authentication Required',
                'Please log in to continue.',
                [{ text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') }]
            );
        }
    }, [user]);

    useEffect(() => {
        if (name) {
            analytics().logEvent('screen_view', {
                screen_name: name,
                screen_class: 'ArticalWindowUtility'
            }).catch(console.error);
        }
    }, [name]);

    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'background') {
                backgroundTimestamp.current = Date.now();
                webViewRef.current?.injectJavaScript(`window.postMessage('SAVE_STATE'); true;`);
            } else if (nextAppState === 'active' && backgroundTimestamp.current > 0) {
                const backgroundDuration = Date.now() - backgroundTimestamp.current;
                
                if (backgroundDuration > 300000) {
                    const isAlive = await checkWebViewAlive();
                    if (!isAlive) {
                        recreateWebView();
                    } else {
                        try {
                            await RefreshToken();
                            await refreshTokenInWebView();
                        } catch(e) {
                            recreateWebView();
                        }
                    }
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [checkWebViewAlive, recreateWebView, refreshTokenInWebView]);

    return (
        <View style={styles.container}>
            <ProfileSettingsHeader 
                onPressBack={() => {
                    if (route.params?.isBilling) {
                        navigation.reset({ index: 0, routes: [{ name: "MyTab" }] });
                    } else if (route.params?.isPayBill) {
                        navigation.reset({ index: 0, routes: [{ name: "MyServices" }] });
                    } else {
                        navigation.goBack();
                    }
                }} 
                title={name} 
            />
            
            <View style={styles.contentContainer}>
                {webViewReady && !isTokenRefreshing && (
                    <WebView
                        key={webViewKey}
                        ref={webViewRef}
                        source={{ uri: url }}
                        onLoadStart={onLoadStart}
                        onLoadProgress={onLoadProgress}
                        onLoadEnd={onLoadEnd}
                        onError={onError}
                        onHttpError={onHttpError}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        injectedJavaScriptBeforeContentLoaded={injectionScript}
                        injectedJavaScript={injectionScript}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        sharedCookiesEnabled={true}
                        cacheEnabled={true}
                        originWhitelist={['https://*']}
                        mixedContentMode="compatibility"
                        allowsInlineMediaPlayback={true}
                        allowsBackForwardNavigationGestures={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        androidLayerType="hardware"
                        nestedScrollEnabled={true}
                        overScrollMode="never"
                        style={styles.webView}
                    />
                )}

                {(isLoading || isTokenRefreshing || !webViewReady) && !isError && (
                    <View style={styles.loadingOverlay}>
                        {name === 'Billing Details' ? <LoadingSpinner /> : <LoadingOverlay loading={true} />}
                    </View>
                )}
                
                {isError && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Unable to Load Page</Text>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <Text style={styles.retryText} onPress={() => {
                            setIsError(false);
                            setErrorMessage('');
                            setContentLoaded(false);
                            setProgress(0);
                            initialLoadComplete.current = false;
                            sessionInjected.current = false;
                            webViewRef.current?.reload();
                        }}>
                            Tap to Retry
                        </Text>
                    </View>
                )}

                {showToast && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Text style={styles.toastText}>Session expired</Text>
                    </Animated.View>
                )}
            </View>
            
            {showPDFModal && (
                <PDFViewModal
                    url={showPDFUrl}
                    onClose={() => setShowPDFModal(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: Platform.OS === 'ios' ? 90 : 60,
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
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
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    retryText: {
        fontSize: 16,
        color: '#8D3B90',
        fontWeight: '600',
        textDecorationLine: 'underline',
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

export default ArticalWindowUtility;