import React,{useEffect , useRef} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView , AccessibilityInfo , findNodeHandle } from 'react-native';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
import OutageAreaIcon from '../../../res/svgIcons/troubleshooting/OutageAreaIcon';
import TroubleshootIcon from '../../../res/svgIcons/troubleshooting/TroubleshootIcon';
import ServiceIcon from '../../../res/svgIcons/troubleshooting/ServiceIcon';
import SuccessIcon from '../../../res/svgIcons/troubleshooting/SuccessIcon';
import WalletIcon from '../../../res/svgIcons/troubleshooting/WalletIcon';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const TroubleshootComponent = ({
    step, success, pageCount,loading,isError,item
}) => {
    let textRef = useRef(null);

    useEffect(() => {
        const announceText = () => {
          const textToRead = loading 
            ? item?.title ?? "Loading..." 
            : isError 
              ? item?.errorMsg ?? "An error occurred." 
              : item?.resultMsg ?? "Operation successful.";
          const description = item?.description ? ` ${item.description}` : '';
          const combinedText = textToRead + description;
          AccessibilityInfo.announceForAccessibility(combinedText);
          const reactTag = findNodeHandle(textRef.current);
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        };
        AccessibilityInfo.announceForAccessibility('');
        setTimeout(announceText, 100); 
      }, [loading, isError, item]);


    let IconComponent;
    switch (step) {
        case 0: IconComponent = <TroubleshootIcon />; break;
        case 1: IconComponent = <OutageAreaIcon />; break;
        case 2: IconComponent = <WalletIcon />; break;
        case 3: IconComponent = <ServiceIcon />; break;
        default: IconComponent = <TroubleshootIcon />;
    }
   
    return (
        <View style={styles.container}>
            {pageCount>0 ? <Text style={styles.topLeftText}>{pageCount} of 3</Text> : null}
            <View style={styles.content}>
                <View style={[styles.circle,{overflow:(step==1)?'hidden':'visible'}]}>
                    {IconComponent}
                </View>
                {success && (
                    <View style={styles.spinnerContainer}>
                        <SuccessIcon />
                    </View>
                )}
                <View 
                accessibilityLiveRegion="assertive"
                accessibility={true}
                accessibilityLabel={(loading ? item?.title ?? "Loading..." : isError ? item?.errorMsg ?? "An error occurred." : item?.resultMsg ?? "Operation successful.") + (item?.description ? ` ${item.description}` : '')}
                style={styles.spinnerContainer}>
                    <Text 
                    ref={textRef}
                    style={styles.title}>{loading ? item?.title ?? "Loading..." : isError ? item?.errorMsg ?? "An error occurred." : item?.resultMsg ?? "Operation successful."}</Text>
                    {item.description && <Text style={styles.description}>{item.description}</Text>}
                </View>
                <View style={styles.spinnerContainer}>

                    { loading ? <ActivityIndicator size="large" color="#8D3B90" style={styles.activityIndicator} /> :<></>}
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
    },
    circle: {
        width: windowWidth * 0.5,
        height: windowWidth * 0.5,
        borderRadius: (windowWidth * 0.5) / 2,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        marginBottom: 20,
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
        paddingVertical:8
    },
    activityIndicator: {
        transform: [{ scale: 2 }],
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
