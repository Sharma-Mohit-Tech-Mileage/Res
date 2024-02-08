import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
import ServiceIcon from '../../../res/svgIcons/troubleshooting/ServiceIcon';
import SuccessIcon from '../../../res/svgIcons/troubleshooting/SuccessIcon';
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import RightArrow from "../../../res/svgIcons/RightArrow";
import SettingsIcon from "../../../res/svgIcons/SettingsIcon"
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ModemHealthy = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
             <Text style={styles.topLeftText}>3 of 3</Text>
            <View style={styles.content}>
                <View style={styles.circle}>
                    <ServiceIcon />
                </View>
                
                    <View style={{ justifyContent: 'center', paddingVertical:8}}>
                        <SuccessIcon />
                    </View>
                
                <View style={{justifyContent:'center',paddingVertical:8}}>
                    <Text style={styles.title}>{'No service issues were detected.'}</Text>
                </View>
                <View style={{ flexDirection: "column", flex: 1 }}>
                    <View style={styles.card}>
                        <View style={styles.borderSec} />
                        <TouchableOpacity style={styles.pressableStyle} onPress={() => { }}>
                            <View style={styles.menuWrap}>
                                <SettingsIcon />
                                <Text style={styles.menuText}>
                                    Wi-Fi Issues
                                </Text>
                            </View>
                            <RightArrow />
                        </TouchableOpacity>
                        <View style={styles.borderSec} />

                        <TouchableOpacity style={styles.pressableStyle} onPress={() => { }}>
                            <View style={styles.menuWrap}>
                                <SettingsIcon />
                                <Text style={styles.menuText}>Surfing Issues</Text>
                            </View>
                            <RightArrow />
                        </TouchableOpacity>
                        <View style={styles.borderSec} />
                        <TouchableOpacity style={styles.pressableStyle} onPress={() => { navigation.navigate('PeriodicProblems') }}>
                            <View style={styles.menuWrap}>
                                <SettingsIcon />
                                <Text style={styles.menuText}>Intermittent Issues</Text>
                            </View>
                            <RightArrow />
                        </TouchableOpacity>
                        <View style={styles.borderSec} />
                        <TouchableOpacity style={styles.pressableStyle} onPress={() => { }}>
                            <View style={styles.menuWrap}>
                                <SettingsIcon />
                                <Text style={styles.menuText}>No Connection</Text>
                            </View>
                            <RightArrow />
                        </TouchableOpacity>
                        <View style={styles.borderSec} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: windowHeight * 0.05,
        backgroundColor: Color.sparklightWhite,
    },
    content: {
        flexGrow: 1, // This allows the content to expand
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressableStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        alignItems: "center",
        paddingVertical: 15,
    },
    circle: {
        width: windowWidth * 0.5,
        height: windowWidth * 0.5,
        borderRadius: (windowWidth * 0.5) / 2,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: 20,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    menuText: {
        color: Color.colorGray_200,
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        fontStyle: "normal",
        fontWeight: "400",
        marginLeft: 10,
    },
    menuWrap: {
        flexDirection: "row", 
        alignContent: "center"
    },
    borderSec: {
        width: "100%",
        height: 1,
        backgroundColor: Color.sparklightGray,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#292929',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '400',
    },
    topLeftText: {
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#292929',
        fontFamily: FontFamily.openSansRegular,
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 28,
        padding: 10, 
    },
    card: {
        paddingVertical: Padding.p_base,
        width: wp("92%"),
    },
});

export default ModemHealthy;
