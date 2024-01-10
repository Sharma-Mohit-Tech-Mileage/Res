import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, ScrollView, Pressable, Alert, TouchableWithoutFeedback, Keyboard  } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import InfoIcon from "../../res/svgIcons/InfoIcon";
import BellIcon from "../../res/svgIcons/bellIcon";
import MailRingingIcon from "../../res/svgIcons/MailRingingIcon";
import EntryInput from "./EntryInput";
import { useSelector, useDispatch } from 'react-redux';
import { updateEmailNotification } from '../../redux/actions/ProfileActionSuite';

const EmailNotifications = ({ navigation }) => {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const user = useSelector(state => state.combinedReducers.user.userData);
    const profile = useSelector(state => state.combinedReducers.profile || {});    
    const [enableButton, setEnableButton] = useState(false);
    const [keyboardHidden, setKeyboardHidden] = useState(true);
    const [textInputLayout, setTextInputLayout] = useState({});
    const scrollRef = useRef();

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardHidden(false);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHidden(true);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {     
        if (profile.paperLessInfo !== undefined
            && profile.paperLessInfo.emailAddress !== undefined
            && profile.paperLessInfo.emailAddress.length > 0) {
            setInput(profile.paperLessInfo.emailAddress);
        } else {
            setInput(user.userInfo.email);
        }
    }, []);    
  
    useEffect(() => {
        if (!keyboardHidden) {
            scrollRef.current?.scrollTo({
                y: textInputLayout.y,
                animated: true,
            });
        }
    }, [keyboardHidden]); 

    const onChangeText = (text) => {
        setInput(text);
        if (input.length > 0) {
            setEnableButton(true);
        } else {
            setEnableButton(false);
        }        
    };    

    const keyboardDismiss = () => {
        Keyboard.dismiss();
    };

    const enableEmailNotifications = () => {
        console.log('enableEmailNotifications');
        dispatch(updateEmailNotification(input, null));
        navigation.navigate("MyTab");
    };
        
    
    const terms = [
        {
            title: 'Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin erat ipsum, quis feugiat mi tempor ac. In fermentum vehicula molestie. Mauris dignissim arcu nec commodo gravida. Donec quis efficitur ex. Nulla pharetra nunc justo, in mollis neque accumsan in. Phasellus gravida nisl id erat tempus, sit amet rutrum metus cursus. Curabitur iaculis sollicitudin massa, quis bibendum ante congue vel. Vestibulum et sem a felis aliquet vestibulum nec et odio. Vivamus laoreet mi quis diam dictum rhoncus. Nunc feugiat commodo turpis, ut mattis magna lacinia non. Aliquam nec justo ultrices, rhoncus dui vitae, condimentum urna. Sed sed ipsum tortor. Morbi euismod ipsum eu nisi maximus posuere. Donec sodales et mauris eu vestibulum. Fusce sed massa facilisis, ullamcorper dui sit amet, varius tortor.'
        },
        {
            title: 'Second Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin erat ipsum, quis feugiat mi tempor ac. In fermentum vehicula molestie. Mauris dignissim arcu nec commodo gravida. Donec quis efficitur ex. Nulla pharetra nunc justo, in mollis neque accumsan in. Phasellus gravida nisl id erat tempus, sit amet rutrum metus cursus. Curabitur iaculis sollicitudin massa, quis bibendum ante congue vel. Vestibulum et sem a felis aliquet vestibulum nec et odio. Vivamus laoreet mi quis diam dictum rhoncus. Nunc feugiat commodo turpis, ut mattis magna lacinia non. Aliquam nec justo ultrices, rhoncus dui vitae, condimentum urna. Sed sed ipsum tortor. Morbi euismod ipsum eu nisi maximus posuere. Donec sodales et mauris eu vestibulum. Fusce sed massa facilisis, ullamcorper dui sit amet, varius tortor.'
        },
        {
            title: 'Third Title',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin erat ipsum, quis feugiat mi tempor ac. In fermentum vehicula molestie. Mauris dignissim arcu nec commodo gravida. Donec quis efficitur ex. Nulla pharetra nunc justo, in mollis neque accumsan in. Phasellus gravida nisl id erat tempus, sit amet rutrum metus cursus. Curabitur iaculis sollicitudin massa, quis bibendum ante congue vel. Vestibulum et sem a felis aliquet vestibulum nec et odio. Vivamus laoreet mi quis diam dictum rhoncus. Nunc feugiat commodo turpis, ut mattis magna lacinia non. Aliquam nec justo ultrices, rhoncus dui vitae, condimentum urna. Sed sed ipsum tortor. Morbi euismod ipsum eu nisi maximus posuere. Donec sodales et mauris eu vestibulum. Fusce sed massa facilisis, ullamcorper dui sit amet, varius tortor.'
        }                
    ];

    return  (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={keyboardDismiss}>
                <ScrollView 
                    style={styles.inner}
                    contentContainerStyle={styles.innerContent}
                    ref={scrollRef}
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
                                    <MailRingingIcon />
                                </View>
                            </View>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Turn on Email Notifications</Text>
                            </View>         
                            <View style={styles.subHeader}>
                                <Text style={styles.subHeaderText}>Receive email alerts related to your account, updates and more from Sparklight.</Text>
                            </View>   
                        </View>     
                        <View 
                            style={styles.subInput}
                            onLayout={(event) => {
                                setTextInputLayout(event.nativeEvent.layout);
                            }}                            
                        >
                            <EntryInput
                                iconImage={require('../../../assets/mail.png')}
                                placeholder="Email Address"
                                input={input}
                                onChangeText={onChangeText}
                                onSubmitText={enableEmailNotifications}
                                keyboardType="email-address"
                            />                
                        </View>                          
                    </View>
                    <View style={styles.bottomContainer}>
                    </View>                                    
                    <View style={styles.bottomBar}>
                        <Pressable
                            disabled={!enableButton}
                            style={[styles.button, styles.buttonsLayout]}
                            onPress={enableEmailNotifications}
                        >
                            <Text style={styles.accept}>Enable Email Notifications</Text>
                        </Pressable>                
                        <View style={styles.buttonsParent} 
                            accessibilityLabel="Buttons Section">
                            <Pressable
                                style={[styles.buttonDecline, styles.buttonsLayout]}
                                onPress={() => {
                                    navigation.navigate("MyTab");
                                }}
                                accessibilityLabel="Decline Button"
                                accessibilityRole="button"
                                accessibilityHint="Decline Terms and Conditions"
                            >
                                <Text style={styles.decline}>
                                    Skip for now
                                </Text>
                            </Pressable>
                        </View>    
                    </View>
                    {
                        !keyboardHidden &&
                        (
                            <View style={styles.textBottomHeight} />
                        )
                    }                    
                </ScrollView>
            </TouchableWithoutFeedback>
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
        height: 50,
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
        //flex: 1
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
        backgroundColor: Color.colorMidnightblue,
        width: 100,
        height: 5,
        marginLeft: 10
    },
    headerTabThree: {
        backgroundColor: Color.colorMidnightblue,
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
        paddingHorizontal: 20,
        marginTop: 10
    }, 
    subInput: {
        marginTop: 20,
        marginBottom: 20
    },    
    viewContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 50
    },
    textBottomHeight: {
        height: 200
    },
    bottomContainer: {
        height: 170,
    },    
});

export default EmailNotifications;
