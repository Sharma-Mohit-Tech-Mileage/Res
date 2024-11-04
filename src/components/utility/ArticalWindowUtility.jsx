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
            // Navigate back to the Dashboard
            if (navigationRef.current) {
                navigationRef.current.navigate('Dashboard'); // Replace 'Dashboard' with your dashboard route name
            }
        }
    };
    

    const navigationChange = async (navState) => {
       // setDynamicCookie();  
        if (navState.url.includes('/postlogout') || navState.url.includes(Env.SSO_LOGIN)) {
            if (!navStateReloading) {
                setModalOpen(false);
                setProgress(1);
                setNavStateReloading(true);
                try {
                    await RefreshToken();  // Attempt to refresh the token
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
        }else if (navState.url.startsWith('data:application/octet-stream;base64,')) {
            console.log('PDF data URL detected in navigation change');
            const base64Data = navState.url.replace('data:application/octet-stream;base64,', '');
            setShowPDFUrl(base64Data);
            setShowPDFModal(true);  // Open the PDF modal to display the content
        }
    };

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data !== undefined && data.responseURL !== undefined && data.responseURL.includes('/statements/')) {
                const responseData = JSON.parse(data.response);
                setShowPDFUrl(responseData.fileBinary);
                setShowPDFModal(true);
            }
        } catch (error) {
            console.log('onMessageError: ', error);
        }
    };

    const userUpdate = async () => {
        const userLocal = await getUser();

        if (userLocal.token === currentUser.token) {
            console.log('tokens equal each other');
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
        console.log('userUpdateScript: ', user);
        console.log('upgradeToken.access_token: ', upgradeToken.access_token);
        user.userInfo['customerType']= "Residential";
        if (user.token !== undefined) {
            const SAVE_FROM_RN = `(function() {
                localStorage.setItem('jwt_token', '${user.token}');
                localStorage.setItem('user_info', '${JSON.stringify(user.userInfo)}');
                localStorage.setItem('upgrades_token', '${upgradeToken.access_token}');
                var cookieValue = "MobileApp";
            var domain = document.location.hostname; 
            var expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (365*24*60*60*1000)); 
            document.cookie = "Source=" + cookieValue + "; domain=" + domain + "; path=/; expires=" + expirationDate.toUTCString() + ";";
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

    // Reset progress and error states when URL changes or modal closes
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
        setDynamicCookie();  // Set cookie when user is updated
    }, [user]);

    useEffect(() => {
        const handleAppStateChange = nextAppState => {
            if (appState?.match(/inactive|background/) && nextAppState === 'active') {
                setTimeout(() => {
                    if (webViewRef?.current) {
                        webViewRef.current.reload();
                    } else {
                        console.warn('WebView ref is not available for reload. Navigating back to Dashboard.');
                        // Navigate back to the Dashboard
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
            } else {
                console.warn('AppState subscription is not available for removal.');
            }
        };
    }, [appState]);
    
    

    useEffect(() => {
        setDynamicCookie();  // Push cookie when component is first mounted
    }, [url, modalOpen, appState]);
    const Spinner = () => (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color={colors.sparklight_bright_purple} />
        </View>
    );

    return (
        <View style={{ flex: 1, marginBottom: (Platform.OS == 'ios') ? 90 : 60 }}>
            <ProfileSettingsHeader onPressBack={() => { 
                if(route.params?.isBilling){   
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "MyTab" }],
                      });
                     //navigation.goBack();
                }else{
                     navigation.goBack();
                }
                 setModalOpen(false);
                  }} 
                  title={name} />
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
    },activityContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000000',
        height: '100%',
        width: '100%'
      }
});

export default ArticalWindowUtility;