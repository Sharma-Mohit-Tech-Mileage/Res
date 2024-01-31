import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, ScrollView, Pressable, Platform } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import InfoIcon from "../../res/svgIcons/InfoIcon";
import BellIcon from "../../res/svgIcons/bellIcon";
import BellRingingIcon from "../../res/svgIcons/BellRingingIcon";
import {
  getFcmToken,
  requestUserPermission,
} from '../../firebase/FirebaseUtils';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { updatePushNotifications } from '../../redux/actions/ProfileActionSuite';
import { storePushNotificationStatus } from "../../redux/utils/LocalStorage";

const PushNotifications = ({ navigation }) => {
    const [nextScreen, setNextScreen] = useState('EntryTextNotifications');
    const dispatch = useDispatch();
    const profile = useSelector(state => state.combinedReducers.profile || {});
    const user = useSelector(state => state.combinedReducers.user.userData);

    useEffect(() => {
        let goToPhoneScreen = false;
        let optOutCount = 0;
  
        if (profile.smsSubscription.length > 0) {
            const firstSubscription = profile.smsSubscription[0];
            firstSubscription.smsMessageType.forEach((messageType) => {
                if (messageType.optOutFlag) {
                    optOutCount = optOutCount + 1;
                }
            });
            console.log('optOutCountAfterLoop: ', optOutCount);
            if (optOutCount > 2) {
                goToPhoneScreen = true;
            }
        } else {
            goToPhoneScreen = true;
        }

        if (goToPhoneScreen) {
            setNextScreen('EntryTextNotifications');  
        } else {
            if (profile.paperLessInfo !== undefined
                && profile.paperLessInfo.accountNumber !== undefined
                && profile.paperLessInfo.accountNumber.length > 0
                && profile.paperLessInfo.paperlessStatus !== undefined
                && (profile.paperLessInfo.paperlessStatus.toLowerCase() === 'approved'
                    || profile.paperLessInfo.paperlessStatus.toLowerCase() === 'active')
                ) {
                setNextScreen('MyTab');                  
            } else {
                setNextScreen('EntryEmailNotifications');  
            }
        }

        if (profile.profileDetails.memberType === "Admin") {
            setNextScreen('MyTab');
        }
    }, []);
    
    const enableNotifications = async () => {
        const enabledPermission = await requestUserPermission();

        if (enabledPermission) {
            const token = await getFcmToken();
            const data = {
                accountNumber: user.userInfo.accountNumber,
                deviceToken: token,
                deviceTokenTimestamp: moment().format(),
                optOut: false,
                outageOptOut: false,
                billingOptOutStatus: false,
                userName: user.userInfo.userName,
                isAndroid: Platform.OS == "android",
            };
            console.log('enableNotifications: ', data);
            console.log('enableNotifications navigation: ', navigation);
            const localData = {
                status: 'accepted',
                date: new Date()
            };            
            storePushNotificationStatus(localData);
            await dispatch(updatePushNotifications(data, null));
            navigation.reset({
                index: 0,
                routes: [{ name: nextScreen }],
            });
        } else {
            const localData = {
                status: 'skip',
                date: new Date(),
                permanentSkip: true
            };            
            storePushNotificationStatus(localData);
                navigation.reset({
                    index: 0,
                    routes: [{ name: nextScreen }],
                });

        }
    };

    const skipNotifications = async () => {
        const data = {
            status: 'skip',
            date: new Date(),
            permanentSkip: false
        };
        storePushNotificationStatus(data);
        navigation.reset({
            index: 0,
            routes: [{ name: nextScreen }],
        });
    };    

    return  (
        <View style={styles.container}>
            <ScrollView 
                style={styles.inner}
                contentContainerStyle={styles.innerContent}
            >                    
                <ProfileSettingsHeader 
                    showIcon={false}
                    title={'Notifications'}
                />
                <View style={styles.headerTabView}>
                    <View style={styles.headerTabOne} />
                    <View style={styles.headerTabTwo} />
                    <View style={styles.headerTabThree} />
                </View>
                <View style={styles.viewContainer}>
                    <View>
                        <View style={styles.headerIconViewContainer}>
                            <View style={styles.headerIconView}>
                                <BellRingingIcon />
                            </View>
                        </View>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Turn on App Notifications</Text>
                        </View>         
                        <View style={styles.subHeader}>
                            <Text style={styles.subHeaderText}>Receive app alerts related to your account, updates and more from Sparklight.</Text>
                        </View>                         
                    </View>            
                </View>
                <View style={styles.bottomBar}>
                    <Pressable
                        style={[styles.button, styles.buttonsLayout]}
                        onPress={enableNotifications}
                    >
                        <Text style={styles.accept}>Allow Notifications</Text>
                    </Pressable>                
                    <View style={styles.buttonsParent} 
                        accessibilityLabel="Buttons Section">
                        <Pressable
                            style={[styles.buttonDecline, styles.buttonsLayout]}
                            onPress={skipNotifications}
                            accessibilityLabel="Decline Button"
                            accessibilityRole="button"
                            accessibilityHint="Decline Push Notifications"
                        >
                            <Text style={styles.decline}>
                                Skip for now
                            </Text>
                        </Pressable>
                    </View>    
                </View>
            </ScrollView>                
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',  
    },
    buttonDecline: {
        marginBottom: 50
    },    
    button: {
        backgroundColor: Color.colorMidnightblue,
        marginBottom: 20,
        width: '90%',
    },
    buttonsLayout: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        minHeight: 50,
    },    
    buttonsParent: {
        width: '90%',
    },    
    accept: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    decline: {
        color: Color.colorMidnightblue,
        textAlign: "center",
    },
    inner: {
        flex: 1,
    },    
    innerContent: {
        justifyContent: 'space-around',
        flex: 1
    },       
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    scrollViewContainer: {
        padding: 20,
        marginBottom: 0
    },
    scrollViewContentContainer: {
        paddingBottom: 30
    },
    sparklightImageView: {
        width: 100,
        height: 25,
        marginBottom: 10,
        marginTop: 10
    },
    sparklightImage: {
        tintColor: '#CCC',
        width: '100%',
        height: '100%'
    },  
    headerIconViewContainer: {
        alignItems: 'center',
    },
    headerIconView: {
        backgroundColor: '#FEFEFE',
        padding: 20,
        borderRadius: 100,
        borderColor: '#EEE',
        borderWidth: 1,
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        marginBottom: 10,     
    },
    headerTabView: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
        justifyContent: 'center'
    },
    headerTabOne: {
        backgroundColor: Color.colorMidnightblue,
        width: 100,
        height: 5,
    },
    headerTabTwo: {
        backgroundColor: Color.colorWhitesmoke_300,
        width: 100,
        height: 5,
        marginLeft: 10
    },
    headerTabThree: {
        backgroundColor: Color.colorWhitesmoke_300,
        width: 100,
        height: 5,
        marginLeft: 10
    },            
    header: {
        paddingTop: 10,
    },    
    headerText: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: 22,
        textAlign: 'center',
        color: Color.colorGray_100,
    },
    subHeader: {
        paddingTop: 10,
    },
    subHeaderText: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        lineHeight: 25,
        textAlign: 'center',
        color: Color.colorGray_100,
        paddingHorizontal: 20
    }, 
    viewContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 50
    }
});

export default PushNotifications;
