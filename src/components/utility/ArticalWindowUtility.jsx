import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Alert, AccessibilityInfo } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RefreshToken } from '../user/Session';
//import { Env } from '../../network/apis/account/Constants';
import Config from 'react-native-config';
import PDFViewModal from './PDFViewModal';
import { navigationRef } from '../../navigations/UserNavigations';
import analytics from '@react-native-firebase/analytics';
import LoadingOverlay from '../common/customui/CustomLoading';
import LoadingSpinner from './LoadingSpinner';
import useAccessibilityFocus from '../../hooks/useAccessibilityFocus';


const ArticalWindowUtility = ({ navigation, route }) => {
    const [progress, setProgress] = useState(0);
    const [name] = useState(route.params?.name);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [url] = useState(route.params?.url);
    const [modalOpen, setModalOpen] = useState(true);
    const [navStateReloading, setNavStateReloading] = useState(false);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showPDFUrl, setShowPDFUrl] = useState('');
    const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    const [loadStartTime, setLoadStartTime] = useState(0);
    const [forceWebViewRecreation, setForceWebViewRecreation] = useState(false);
    const [appBackgroundTime, setAppBackgroundTime] = useState(0);
    const user = useSelector(state => state.user.userData);
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef();
    const [mainViewRef, setFocus] = useAccessibilityFocus();

    useEffect(() => {
    // Set focus when the component mounts (screen appears)
    setFocus();
  }, [setFocus]);

    // FIXED: Simplified and more compatible script
    const enhancedScript = `
        (function() {
            try {
                console.log('Sparklight script injection started');
                
                // Simple localStorage setup
                const token = '${user?.token || ''}';
                const userInfo = '${JSON.stringify(user?.userInfo || {})}';
                
                if (token) {
                    localStorage.setItem('jwt_token', token);
                    console.log('JWT token set');
                }
                
                if (userInfo && userInfo !== '{}') {
                    localStorage.setItem('user_info', userInfo);
                    console.log('User info set');
                }
                
                // Simplified cookie setting - removed problematic flags
                try {
                    const cookieValue = "Source=MobileApp; domain=" + location.hostname + "; path=/; max-age=31536000";
                    document.cookie = cookieValue;
                    console.log('Cookie set successfully');
                } catch (cookieError) {
                    console.error('Cookie setting failed:', cookieError);
                }
                
                // FIXED: Simplified PDF interceptor setup
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
                                } catch(parseError) {
                                    console.error('PDF parsing error:', parseError);
                                }
                            }
                        });
                        
                        this.addEventListener('error', function() {
                            console.error('XHR Error:', this.status, url);
                        });
                        
                        origOpen.apply(this, arguments);
                    };
                    
                    window.pdfInterceptorSetup = true;
                    console.log('PDF interceptor setup complete');
                }
                
                console.log('Script injection completed successfully');
                
            } catch(scriptError) {
                console.error('Script injection error:', scriptError);
            }
        })();
    `;

    const navigationChange = useCallback(async (navState) => {
        console.log('Navigation change:', navState.url);
        
        // Check for authentication redirects
        if (navState.url.includes('/postlogout') || navState.url.includes(Config.SSO_LOGIN)) {
            if (!navStateReloading) {
                setIsTokenRefreshing(true);
                setNavStateReloading(true);
                
                try {
                    await RefreshToken();
                    console.log('Token refresh successful');
                    setTimeout(() => {
                        webViewRef.current?.reload();
                        setIsTokenRefreshing(false);
                        setNavStateReloading(false);
                        console.log('WebView reload completed');
                    }, 500);
                } catch (error) {
                    console.log('Token refresh failed:', error);
                    setIsTokenRefreshing(false);
                    setNavStateReloading(false);
                    Alert.alert(
                        'Session Expired',
                        'Please log in again.',
                        [{ text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') }]
                    );
                }
            }
        }
        
    }, [navStateReloading]);

    const onMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data.type);
            
            switch (data.type) {
                case 'pdf':
                    if (data.data) {
                        setShowPDFUrl(data.data);
                        setShowPDFModal(true);
                        console.log('PDF modal opened');
                    }
                    break;
                    
                case 'xhr_error':
                    console.log('XHR Error:', data);
                    break;
                    
                case 'page_error':
                    console.log('Page Error:', data);
                    break;
                    
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.log('Message parsing error:', error);
        }
    }, []);

    const onLoadStart = useCallback((syntheticEvent) => {
        const startTime = Date.now();
        setLoadStartTime(startTime);
        setProgress(0.1);
        setIsError(false);
        setErrorMessage('');
        setLoading(true);
        console.log('WebView load started:', syntheticEvent.nativeEvent.url);
    }, []);

    const onLoadProgress = useCallback(({ nativeEvent }) => {
        setProgress(nativeEvent.progress);
        
    }, []);

    const onLoadEnd = useCallback((syntheticEvent) => {
        const endTime = Date.now();
        const loadTime = endTime - loadStartTime;
        
        setContentLoaded(true);
        setLoading(false);
        setTimeout(() => setProgress(1), 300);
        console.log(`Page loaded in: ${loadTime}ms (${(loadTime/1000).toFixed(2)}s)`);
        
        // Announce content loaded for accessibility
        //AccessibilityInfo.announceForAccessibility("Content loaded");
    }, [loadStartTime]);

    const onError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        setIsError(true);
        setErrorMessage(`Loading error: ${nativeEvent.description || 'Unknown error'}`);
    }, []);

    const onHttpError = useCallback((syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('HTTP error:', nativeEvent.statusCode);
        
        if (nativeEvent.statusCode === 404) {
            setIsError(true);
            setErrorMessage('Page not found (404). Please verify your account has access to this feature.');
        } else if (nativeEvent.statusCode === 403) {
            setIsError(true);
            setErrorMessage('Access denied (403). Please check your permissions.');
        } else if (nativeEvent.statusCode >= 500) {
            setIsError(true);
            setErrorMessage('Server error. Please try again later.');
        }
    }, []);

    // User validation
    useEffect(() => {
        if (!user?.token) {
            Alert.alert(
                'Authentication Required',
                'Please log in to continue.',
                [{ text: 'OK', onPress: () => navigationRef.current?.navigate('Splash') }]
            );
        }
    }, [user]);

    // Analytics tracking
    useEffect(() => {
        if (name) {
            analytics().logEvent('screen_view', {
                screen_name: name,
                screen_class: 'ArticalWindowUtility'
            }).catch(console.error);
        }
    }, [name]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            // Track when app goes to background
            setAppBackgroundTime(Date.now());
        } else if (nextAppState === 'active') {
            const backgroundDuration = Date.now() - appBackgroundTime;
            const wasBackgroundedLong = backgroundDuration > 300000; // 5 minutes
            
            if (wasBackgroundedLong || !contentLoaded) {
                // Force WebView recreation for long background periods
                console.log('App was backgrounded for', Math.round(backgroundDuration/1000), 'seconds - forcing WebView recreation');
                setForceWebViewRecreation(true);
                setModalOpen(false);
                
                // Recreate after brief delay
                setTimeout(() => {
                    setForceWebViewRecreation(false);
                    setModalOpen(true);
                    setContentLoaded(false);
                }, 100);
            } else if (contentLoaded) {
                // Short background - try gentle reload first
                setTimeout(() => {
                    if (webViewRef.current) {
                        webViewRef.current.reload();
                    }
                }, 500);
            }
        }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
}, [contentLoaded, appBackgroundTime]);

    const LoadingComponent = useCallback(() => (
        <View style={styles.loadingContainer} accessibilityRole='text' accessible={true} accessibilityLabel="Loading content" accessibilityHint="Content is loading, please wait">
            {name === 'Billing Details' ? (
                <LoadingSpinner />
            ) : (
                <LoadingOverlay loading={true} />
            )}
        </View>
    ), [name]);

    const TokenRefreshOverlay = useCallback(() => (
        <View style={styles.refreshOverlay}>
            <LoadingSpinner />
        </View>
    ), []);

    return (
        <View style={styles.container} 
        >
            <ProfileSettingsHeader 
                onPressBack={() => {
                    console.log('Back button pressed');
                    setModalOpen(false);
                    if (route.params?.isBilling) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "MyTab" }],
                        });
                    } else if (route.params?.isPayBill) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: "MyServices" }],
                        });
                    } else {
                        navigation.goBack();
                    }
                }} 
                title={name} 
            />
            
            {progress < 1 ? (
                <View style={styles.progressBar} ref={mainViewRef}
         accessible={true}
                    accessibilityLabel={`${name} content loading` }
                    accessibilityLiveRegion="polite"
                    accessibilityRole="text">
                    <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                </View>
            ): (
                <View style={[styles.progressBar,{ backgroundColor: '#8D3B90', width: '100%' }]} 
                    accessible={true}
                    accessibilityLabel={ `${name} content loaded`}
                    accessibilityRole='text'
                    accessibilityLiveRegion="polite"
                    >
                
                </View>
            )
            }
            
            {modalOpen && !isTokenRefreshing && !forceWebViewRecreation && (
                <WebView
                    key={forceWebViewRecreation ? Date.now() : undefined}
                    ref={webViewRef}
                   
                    style={styles.webView}
                    source={{ uri: url }}
                    // Event handlers
                    onLoadStart={onLoadStart}
                    onLoadProgress={onLoadProgress}
                    onLoadEnd={onLoadEnd}
                    onError={onError}
                    onHttpError={onHttpError}
                    onMessage={onMessage}
                    onNavigationStateChange={navigationChange}
                    
                    // Script injection
                    injectedJavaScript={enhancedScript}
                    // Add this property to the WebView (around line 330 where other props are)
                    injectedJavaScriptBeforeContentLoaded={Platform.OS === 'android' ? enhancedScript : undefined}
                    // FIXED: Simplified WebView settings to prevent first-load errors
                    startInLoadingState={true}
                    renderLoading={LoadingComponent}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    sharedCookiesEnabled={true}
                    cacheEnabled={true}
                    
                    // FIXED: Removed problematic props that cause first-load errors
                    originWhitelist={['https://*']}
                    mixedContentMode="compatibility"
                    allowsInlineMediaPlayback={true}
                    
                    // FIXED: Removed dataDetectorTypes and other problematic performance settings
                    allowsBackForwardNavigationGestures={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {(isTokenRefreshing || forceWebViewRecreation)&& <TokenRefreshOverlay />}
            
            {isError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Unable to Load Page</Text>
                    <Text style={styles.errorText}>{errorMessage || 'An error occurred while loading the page.'}</Text>
                    <Text style={styles.retryText} onPress={() => {
                        setIsError(false);
                        setErrorMessage('');
                        webViewRef.current?.reload();
                    }}>
                        Tap to Retry
                    </Text>
                </View>
            )}
            
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
    progressBar: {
        height: 3,
        backgroundColor: '#E0E0E0',
    },
    progress: {
        height: '100%',
        backgroundColor: '#8D3B90',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    refreshOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        top: 100,
    },
    refreshText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
});

export default ArticalWindowUtility;