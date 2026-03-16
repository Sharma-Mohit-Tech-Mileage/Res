import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, AppState, Alert, AccessibilityInfo, Linking } from 'react-native';
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
    // Don't show loading spinner if coming from Bill Explainer redirect
    const [loading, setLoading] = useState(!route.params?.isBilling);
    const webViewRef = useRef();
    const [mainViewRef, setFocus] = useAccessibilityFocus();
    const isNavigatingAway = useRef(false);

    useEffect(() => {
    // Set focus when the component mounts (screen appears)
    setFocus();
  }, [setFocus]);

    useEffect(() => {
        // Open Bill Explainer outside the app in the mobile browser.
        if (name === 'Bill Explainer' && url) {
            setModalOpen(false);
            Linking.openURL(url)
                .catch((error) => {
                    console.error('Failed to open Bill Explainer in browser:', error);
                })
                .finally(() => {
                    navigation.goBack();
                });
        }
    }, [name, url, navigation]);

    // Reset navigation flag when component unmounts or name changes
    useEffect(() => {
        isNavigatingAway.current = false;
        return () => {
            isNavigatingAway.current = false;
        };
    }, [name]);

    // FIXED: Simplified and more compatible script
    const enhancedScript = `
        (function() {
            try {
                console.log('Sparklight script injection started');
                
                // Simple localStorage setup
                const token = '${user?.token || ''}';
                const userInfo = '${JSON.stringify(user?.userInfo || {})}';
                const screenName = '${name || ''}';
                const initialUrl = '${url || ''}';
                const isLegalPage =
                    screenName === 'Privacy Policy' ||
                    screenName === 'Terms & Conditions' ||
                    initialUrl.includes('/legal/');
                
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

                // Hide known consent overlays without touching normal page content.
                const hideCookieBanner = function() {
                    try {
                        const selectorList = [
                            '#onetrust-banner-sdk',
                            '#onetrust-consent-sdk',
                            '#onetrust-pc-sdk',
                            '.onetrust-pc-dark-filter',
                            '.ot-sdk-container',
                            '.ot-sdk-row',
                            '[id*="cookie"]',
                            '[class*="cookie"]',
                            '[id*="consent"]',
                            '[class*="consent"]'
                        ];

                        selectorList.forEach(function(selector) {
                            document.querySelectorAll(selector).forEach(function(node) {
                                const computedStyle = window.getComputedStyle(node);
                                const isOverlayLike =
                                    selector.startsWith('#onetrust') ||
                                    selector.startsWith('.ot-') ||
                                    computedStyle.position === 'fixed' ||
                                    computedStyle.position === 'sticky' ||
                                    computedStyle.zIndex === '2147483647' ||
                                    node.getAttribute('role') === 'dialog';

                                if (!isOverlayLike) {
                                    return;
                                }

                                node.style.setProperty('display', 'none', 'important');
                                node.style.setProperty('visibility', 'hidden', 'important');
                                node.style.setProperty('opacity', '0', 'important');
                                node.style.setProperty('pointer-events', 'none', 'important');
                            });
                        });

                        const blockers = [
                            'this website uses cookies',
                            'best experience on our website',
                            'cookie preferences',
                            'decline',
                            'dismiss'
                        ];

                        document.querySelectorAll('div, section, aside, footer, p, span, button, a').forEach(function(node) {
                            const text = (node.innerText || node.textContent || '').toLowerCase().trim();
                            if (!text) return;

                            const isCookieText = blockers.some(function(key) {
                                return text.includes(key);
                            });

                            if (isCookieText) {
                                // Hide full banner container when possible
                                let container = node;
                                let depth = 0;
                                while (container && depth < 6) {
                                    const containerText = (container.innerText || '').toLowerCase();
                                    const isBannerContainer =
                                        containerText.includes('this website uses cookies') ||
                                        containerText.includes('cookie preferences') ||
                                        container.id?.toLowerCase()?.includes('cookie') ||
                                        container.className?.toString()?.toLowerCase()?.includes('cookie') ||
                                        container.id?.toLowerCase()?.includes('consent') ||
                                        container.className?.toString()?.toLowerCase()?.includes('consent');

                                    const computedStyle = window.getComputedStyle(container);
                                    const isOverlayLike =
                                        computedStyle.position === 'fixed' ||
                                        computedStyle.position === 'sticky' ||
                                        Number(computedStyle.zIndex || 0) > 100;

                                    if (isBannerContainer && isOverlayLike) {
                                        container.style.setProperty('display', 'none', 'important');
                                        container.style.setProperty('visibility', 'hidden', 'important');
                                        container.style.setProperty('opacity', '0', 'important');
                                        container.style.setProperty('pointer-events', 'none', 'important');
                                        break;
                                    }
                                    container = container.parentElement;
                                    depth++;
                                }

                                node.style.setProperty('display', 'none', 'important');
                                node.style.setProperty('visibility', 'hidden', 'important');
                                node.style.setProperty('pointer-events', 'none', 'important');
                            }
                        });
                    } catch (cookieBannerError) {
                        console.log('Cookie banner hide failed:', cookieBannerError);
                    }
                };

                if (!isLegalPage) {
                    hideCookieBanner();
                    setTimeout(hideCookieBanner, 300);
                    setTimeout(hideCookieBanner, 1000);
                    setTimeout(hideCookieBanner, 2000);

                    if (!window.__cookieBannerObserverInstalled) {
                        const observer = new MutationObserver(function() {
                            hideCookieBanner();
                        });

                        observer.observe(document.documentElement || document.body, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });

                        window.__cookieBannerObserverInstalled = true;
                    }
                }
                
                // Only intercept clicks for Bill Explainer screen
                if (screenName === 'Bill Explainer') {
                    console.log('Bill Explainer detected - activating payment link interceptor');
                    
                    // Intercept ALL clicks to detect billing/payment navigation
                    document.addEventListener('click', function(e) {
                        let target = e.target;
                        console.log('Click detected on:', target.tagName, target.className, target.textContent?.substring(0, 50));
                        
                        // Check if clicked element or any parent contains billing/payment related text or attributes
                        let currentElement = target;
                        let maxDepth = 10;
                        let depth = 0;
                        
                        while (currentElement && depth < maxDepth) {
                            // Check text content
                            const textContent = currentElement.textContent?.toLowerCase() || '';
                            const className = currentElement.className?.toLowerCase() || '';
                            const id = currentElement.id?.toLowerCase() || '';
                            const href = currentElement.href?.toLowerCase() || '';
                            const onclick = currentElement.getAttribute('onclick')?.toLowerCase() || '';
                            
                            // Check for "Pay Now" or "Pay" text/attributes
                            if (textContent.includes('pay now') || 
                                textContent.includes('make payment') ||
                                textContent.includes('pay bill') ||
                                className.includes('pay') ||
                                id.includes('pay') ||
                                href.includes('billing') ||
                                href.includes('payment') ||
                                href.includes('app-secure') ||
                                onclick.includes('billing') ||
                                onclick.includes('payment')) {
                                
                                console.log('Payment/Billing element detected:', {
                                    tag: currentElement.tagName,
                                    text: textContent.substring(0, 100),
                                    className: className,
                                    id: id,
                                    href: href
                                });
                                
                                // Send message to React Native
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'billing_navigation',
                                    url: href || window.location.href,
                                    elementType: currentElement.tagName,
                                    text: textContent.substring(0, 100)
                                }));
                                
                                // Prevent default navigation
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                            
                            currentElement = currentElement.parentElement;
                            depth++;
                        }
                    }, true);
                    
                    // Intercept window.location changes
                    const originalLocationSetter = Object.getOwnPropertyDescriptor(window, 'location').set;
                    if (originalLocationSetter) {
                        Object.defineProperty(window, 'location', {
                            set: function(value) {
                                const url = value.toString().toLowerCase();
                                console.log('Location change detected:', url);
                                
                                if (url.includes('/billing') || 
                                    url.includes('/payment') || 
                                    url.includes('app-secure') ||
                                    url.includes('payment.sparklight.com')) {
                                    
                                    console.log('Billing URL detected in location change');
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                        type: 'billing_navigation',
                                        url: url
                                    }));
                                    return;
                                }
                                originalLocationSetter.call(window, value);
                            },
                            get: function() {
                                return window.location;
                            }
                        });
                    }
                } else {
                    console.log('Screen is not Bill Explainer (' + screenName + ') - payment interception disabled');
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

    // Handle navigation interception - prevent billing URLs from loading in Bill Explainer
    const onShouldStartLoadWithRequest = useCallback((request) => {
        console.log('Should start load with request:', request.url);
        
        // If we're already navigating away, block all new requests
        if (isNavigatingAway.current) {
            return false;
        }
        
        // Check for billing/payment URLs
        const isBillingUrl = request.url.includes('/billing') || 
            request.url.includes('/payment') || 
            request.url.includes('payment.sparklight.com') ||
            request.url.includes('/portals/app-secure/billing') ||
            request.url.includes('app-secure');
        
        if (isBillingUrl) {
            // If we're already on a billing page, allow the navigation
            if (url.includes('/billing') || name === 'Billing Details') {
                return true;
            }
            
            // If we're in Bill Explainer, intercept and navigate to Billing Details
            if (name === 'Bill Explainer') {
                console.log('Billing URL detected in Bill Explainer, redirecting to Billing Details');
                isNavigatingAway.current = true;
                
                // Stop the webview from loading
                if (webViewRef.current) {
                    webViewRef.current.stopLoading();
                }
                
                setModalOpen(false);
                
                setTimeout(() => {
                    navigation.replace('ArticalWindowUtility', {
                        url: `${Env.ACP_BILLING}/billing`,
                        name: 'Billing Details',
                        isBilling: true
                    });
                }, 150);
                
                return false; // Prevent the navigation in current webview
            }
        }
        
        return true; // Allow all other navigations
    }, [url, name, navigation, Env.ACP_BILLING]);

    const navigationChange = useCallback(async (navState) => {
        console.log('Navigation change:', navState.url, 'Current name:', name);
        
        // If we're already navigating away, don't process further
        if (isNavigatingAway.current) {
            return;
        }
        
        // Check for billing/payment URLs (for Android support)
        const isBillingUrl = navState.url.includes('/billing') || 
            navState.url.includes('/payment') || 
            navState.url.includes('payment.sparklight.com') ||
            navState.url.includes('/portals/app-secure/billing') ||
            navState.url.includes('app-secure');
        
        if (isBillingUrl && name === 'Bill Explainer') {
            // If we're already on a billing page, allow the navigation
            if (url.includes('/billing') || name === 'Billing Details') {
                return;
            }
            
            console.log('Billing URL detected in navigationChange for Bill Explainer, redirecting');
            isNavigatingAway.current = true;
            
            // Stop the webview from loading
            if (webViewRef.current) {
                webViewRef.current.stopLoading();
            }
            
            setModalOpen(false);
            
            setTimeout(() => {
                navigation.replace('ArticalWindowUtility', {
                    url: `${Env.ACP_BILLING}/billing`,
                    name: 'Billing Details',
                    isBilling: true
                });
            }, 150);
            
            return;
        }
        
        // Check for authentication redirects
        if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
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
        
    }, [navStateReloading, name, url, navigation, Env.ACP_BILLING, Env.SSO_LOGIN]);

    const onMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data.type);
            
            switch (data.type) {
                case 'billing_navigation':
                    // Handle billing/payment link clicks from Bill Explainer
                    if (name === 'Bill Explainer') {
                        console.log('Billing navigation message received from Bill Explainer, URL:', data.url);
                        isNavigatingAway.current = true;
                        
                        // Stop the webview from loading
                        if (webViewRef.current) {
                            webViewRef.current.stopLoading();
                        }
                        
                        setModalOpen(false);
                        
                        setTimeout(() => {
                            navigation.replace('ArticalWindowUtility', {
                                url: `${Env.ACP_BILLING}/billing`,
                                name: 'Billing Details',
                                isBilling: true
                            });
                        }, 100);
                    }
                    break;
                
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
    }, [name, navigation, Env.ACP_BILLING]);

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
                <View style={[styles.progressBar,{ height:0}]} ref={mainViewRef }
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
                    onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    
                    // Script injection
                    injectedJavaScript={enhancedScript}
                    // Add this property to the WebView (around line 330 where other props are)
                    injectedJavaScriptBeforeContentLoaded={Platform.OS === 'android' ? enhancedScript : undefined}
                    // FIXED: Don't show loading spinner when transitioning from Bill Explainer
                    startInLoadingState={!route.params?.isBilling}
                    renderLoading={!route.params?.isBilling ? LoadingComponent : undefined}
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