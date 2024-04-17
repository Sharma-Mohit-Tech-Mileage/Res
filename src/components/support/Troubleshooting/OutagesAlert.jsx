import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
import NotificationAlert from "../../common/customui/NotificationAlert";
import OutageAreaIcon from '../../../res/svgIcons/troubleshooting/OutageAreaIcon';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TroubleshootComponent = ({
    step, title, description, success, pageCount
}) => {

    return (
        <View style={styles.container}>
            {pageCount ? <Text style={styles.topLeftText}>1/3</Text> : null}
            <View style={styles.content}>
                <View style={styles.circle}>
                    <OutageAreaIcon />
                </View>
                <View style={styles.spinnerContainer}>
                    <NotificationAlert
                        type="warning"
                        title={(<Text style={{flexDirection:'column'}}><Text style={styles.textStyle}>Uh oh. You may be experiencing an outage in your area.</Text>
                        <Text style={styles.textStyle1} >{'Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. '}<Text style={styles.textStyle}> Estimated Time to Restore: {description}</Text></Text>
                        </Text>)}
                        showCloseIcon={false}
                        //message={(<Text >{'Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. '}<Text style={styles.textStyle}> Estimated Time to Restore: {description}</Text></Text>)}
                    />
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
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: Padding.p_base
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '50%',
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
        overflow: 'hidden',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#292929',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '400',
    },
    description: {
        lineHeight: 28,
        fontWeight: '400',
        fontSize: 16,
        color: '#4C5458',
        textAlign: 'center',
    },
    button: {
        backgroundColor: Color.colorMidnightblue,
        marginBottom: 20,
        paddingVertical: Padding.p_base,
    },

    accept: {
        fontSize: FontSize.size_base,
        fontFamily: FontFamily.openSansRegular,
        textAlign: "center",
        color: Color.sparklightWhite,
    },
    textStyle: {
        color: '#292929',
        fontFamily: FontFamily.interBold, // Make sure 'Inter' font is linked in your project
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'bold', 
    },
    textStyle1: {
        color: '#292929',
        fontFamily: FontFamily.openSansRegular, // Make sure 'Inter' font is linked in your project
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: 'normal', 
    },
    topLeftText: {
        position: 'absolute',
        top: 0,
        left: 0,
        color: '#292929',
        fontFamily: 'Open Sans',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 28,
        padding: 10, // Add some padding around the text
    },
});

export default TroubleshootComponent;
