import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform,Image, Pressable } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader'
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { getUser, getUpgradeToken } from "../../redux/utils/LocalStorage";
import { RefreshToken } from '../user/Session';
import { Env } from '../../network/apis/account/Constants';
import PDFViewModal from './PDFViewModal';
import { Color } from "../../../GlobalStyles";
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
    const user = useSelector(state => state.combinedReducers.user.userData);
    const webViewRef = useRef();

    const toggleModal = () => {
        setShowPDFModal(!showPDFModal);
    };

    const navigationChange = async (navState) => {
        if (navState.url.includes('/postlogout')
            || navState.url.includes(Env.SSO_LOGIN)) {
            if (!navStateReloading) {
                setModalOpen(false);
                setProgress(1);
                setNavStateReloading(true);
                await RefreshToken();
                setTimeout(async () => {
                    await userUpdate();
                }, 1000);
            }
        }
    }

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
    }

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
    }

    const userUpdateScript = async (user) => {
        const upgradeToken = await getUpgradeToken();
        console.log('userUpdateScript: ', user);
        console.log('upgradeToken.access_token: ', upgradeToken.access_token);
        if (user.token !== undefined) {
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
    }

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
    }, []);

    return (
        <View style={{ flex: 1, marginBottom: (Platform.OS == 'ios') ? 90 : 60 }}>
            <ProfileSettingsHeader onPressBack={() => { navigation.goBack(); setModalOpen(false); }} title={name} />
            {progress < 1 ? (
                <View style={{ ...styles.progressBar }}>
                    <View style={{ ...styles.progress, width: `${progress * 100}%` }} />
                </View>) : (<View />)}
            {modalOpen && (
                <WebView
                    ref={webViewRef}
                    key={url}
                    source={{ uri: url }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                    sharedCookiesEnabled={true}
                    injectedJavaScriptBeforeContentLoaded={initScript}
                    onNavigationStateChange={navigationChange}
                    //onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                    originWhitelist={['http://*', 'https://*', 'data:*']}
                    //setSupportMultipleWindows={false}
                    onMessage={onMessage}
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
    circleImage: {
        width: 32, 
        height: 32, 
    },
    errorText: {
        fontSize: width * 0.04, // 4% of screen width
        marginBottom: height * 0.02, // 2% of screen height
    },
    closeButton: {
        position: 'absolute',
        bottom: height * 0.02, // 2% of screen height
        right: width * 0.05, // 5% of screen width
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: width * 0.04, // 4% of screen width
    },
    container: {
        //flex: 1,
      //  marginBottom: (Platform.OS == 'ios') ? 90 : 60,
        alignItems: 'center', // Center children horizontally
    },
    linearGradientStyle: {
        width: '100%',
        height: 150, // Adjust the height as needed
    },
    circle: {
        position: 'absolute',
        top: 150 - 36, // Half of the circle's height (72 / 2)
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Color.colorMidnightblue,
        borderColor: Color.colorWhitesmoke_200,
        borderWidth: 4,
        zIndex:9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 100, // Adjust as needed
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        color: 'white', // Adjust as needed
        // Other styling for the title
    },
    closeButton: {
        marginRight: 10,
        // Other styling for the close button
    },
});

export default ArticalWindowUtility;
