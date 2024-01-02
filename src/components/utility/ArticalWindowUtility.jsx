import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader'
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
const ArticalWindowUtility = ({ navigation, route }) => {
    const [initScript, setInitScript] = useState('');
    const [progress, setProgress] = useState(0);
    const [name, setTitle] = useState(route.params?.name);
    const [isError, setIsError] = useState(false);
    const [url, setUrl] = useState(route.params?.url);
    const [modalOpen, setModalOpen] = useState(true);
    const user = useSelector(state => state.combinedReducers.user.userData);

    // Reset progress and error states when URL changes or modal closes
    useEffect(() => {
        setProgress(0);
        setIsError(false);
    }, [url, name, modalOpen]);

    // Optionally, if you want to reset state when the modal is re-opened
    useEffect(() => {
        if (modalOpen) {
            // The modal has been opened again, reset the URL if needed
            setUrl(route.params?.url);
            setTitle(route.params?.name);
        }
    }, [modalOpen]);

    useEffect(() => {

        console.log('ArticalWindowUtilityUser: ', user);

        const SAVE_FROM_RN = `(function() {
            localStorage.setItem('jwt_token', '${user.token}');
            localStorage.setItem('upgrades_token', '${user.refreshToken}');
            localStorage.setItem('user_info', '${JSON.stringify(user.userInfo)}');
          })();`;        

        // const SAVE_FROM_RN = `(function() {
        //     ${allKeys.map((key) => `localStorage.setItem(${key}, ${AsyncStorage.getItem(key)});`)}
        //   })();`;

        console.log('SAVE_FROM_RN: ', SAVE_FROM_RN);
      
        setInitScript(SAVE_FROM_RN);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ProfileSettingsHeader onPressBack={() => { navigation.goBack(); setModalOpen(false); }} title={name} />
            {progress < 1 ? (
                <View style={{ ...styles.progressBar}}>
                    <View style={{ ...styles.progress, width: `${progress * 100}%` }} />
                </View>) : (<View >
                </View>)}
            {modalOpen && (

                <WebView
                    key={url}
                    source={{ uri: url }}
                    onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                    onError={() => setIsError(true)}
                    sharedCookiesEnabled={true}
                    injectedJavaScript={initScript}
                    //onNavigationStateChange={(navState) => setUrl(navState.url)}
                />            
            )}
            {isError ? (
                <View style={[styles.errorContainer, { marginTop: '23%' }]}>
                    <Text style={styles.errorText}>Failed to load. Please try again later.</Text>
                </View>
            ) : null}
            
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
