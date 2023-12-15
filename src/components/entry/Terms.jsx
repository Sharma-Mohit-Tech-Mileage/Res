import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';

const Terms = ({ navigation }) => {

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
            <ProfileSettingsHeader 
                showIcon={false}
                title={'Terms'}
            />
            <ScrollView 
                contentContainerStyle={styles.scrollViewContentContainer}
                style={styles.scrollViewContainer}>
                <View>
                    <View style={styles.sparklightImageView}>
                        <Image 
                            style={styles.sparklightImage}
                            source={require("../../../assets/nn-1.png")} 
                        />
                    </View>
                    <View style={styles.termsHeader}>
                        <Text style={styles.termsHeaderText}>Terms and Conditions</Text>
                    </View>            
                </View>
                {terms.map((term, index) => (
                    <View key={index}>
                        <View style={styles.termsTitle}>
                            <Text style={styles.termsTitleText}>{term.title}</Text>
                        </View>
                        <View style={styles.termsDescription}>
                            <Text style={styles.termsDescriptionText}>{term.description}</Text>
                        </View>                        
                    </View>
                ))}                
            </ScrollView>
            <View style={styles.bottomBar}>
                <View style={styles.buttonsParent} 
                    accessibilityLabel="Buttons Section">
                    <Pressable
                        style={[styles.buttonDecline, styles.buttonsLayout]}
                        onPress={() => navigation.navigate("PushNotifications")}
                        accessibilityLabel="Decline Button"
                        accessibilityRole="button"
                        accessibilityHint="Decline Terms and Conditions"
                    >
                        <Text style={styles.decline}>
                            Decline
                        </Text>
                    </Pressable>                
                    <Pressable
                        style={[styles.buttons, styles.buttonsLayout]}
                        onPress={() => navigation.navigate("PushNotifications")}
                    >
                        <Text style={styles.accept}>Accept</Text>
                    </Pressable>
                </View>    
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        height: 100,
        backgroundColor: '#FFF',
        borderTopColor: '#CCC',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,     
    },
    buttonDecline: {
        backgroundColor: Color.colorWhitesmoke_300,
    },    
    buttons: {
        backgroundColor: Color.colorMidnightblue,
    },
    buttonsLayout: {
        paddingVertical: Padding.p_base,
        paddingHorizontal: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Border.br_11xs,
        height: 50,
        width: '45%',
    },    
    buttonsParent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
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
    container: {
        flex: 1,
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
        tintColor: '#999',
        width: '100%',
        height: '100%'
    },  
    termsHeader: {
        paddingTop: 10,
    },    
    termsHeaderText: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: 22,
        color: Color.colorGray_100
    },
    termsTitle: {
        paddingTop: 10
    },    
    termsTitleText: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: 16,
        color: Color.colorGray_100,  
        marginVertical: 10              
    },
    termsDescription: {
        paddingTop: 10,
    },
    termsDescriptionText: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        lineHeight: 25,
        color: Color.colorGray_100,        
    }, 
});

export default Terms;
