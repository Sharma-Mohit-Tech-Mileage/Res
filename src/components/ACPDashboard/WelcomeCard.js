// components/WelcomeCard.js
import React,{useEffect} from 'react';
import { View, Text, StyleSheet,AccessibilityInfo , Linking} from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import VideoPlayer from '../utility/VideoPlayer';


const WelcomeCard = () => {
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = React.useState(false);

  //  useEffect(() => {
  //     AccessibilityInfo.isScreenReaderEnabled().then(setIsAccessibilityEnabled);
  //     const subscription = AccessibilityInfo.addEventListener(
  //       'screenReaderChanged',
  //       setIsAccessibilityEnabled
  //     );
  
  //     return () => subscription?.remove();
  //   }, []);
  // YouTube video ID
  const videoId = 'C3cMQoWxv6I'; 

  return (
    <View style={styles.container}> 
      <Text style={styles.title} accessibilityRole="header" accessibilityLevel={1} accessible={true} accessibilityLabel="We're Excited to Connect with you!">We're Excited to Connect with you!</Text>
      
      <View style={styles.videoContainer} >
        <VideoPlayer videoId={videoId} />
        
      </View>
      {isAccessibilityEnabled && (
        <>
        <Text onPress={()=>{
          Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
        }}
         style={[styles.accessibilityText,{textDecorationLine: 'underline',textDecorationColor: Color.colorMidnightblue}]} accessibilityLabel="Video player loaded" accessibilityHint="Double tap to watch on YouTube">
          Watch on YouTube
        </Text>
        <Text style={styles.accessibilityText} accessibilityLabel="Video player loaded" accessibilityHint="Double tap to watch on YouTube">
          {`Welcomo to Sparklight Veo Transcription
            What is great intemet? Is it strong? Is it fast? Is liable?
            At Sparklight, we know connection goes way beyond technology. From Monday morning meetings to Friday • nights with friends-and everything in between-the best connections are always there right when you nee d them.
            So how do you know it's great internet? Because it works.
            Were Sparklight, and we're always working for you.`}
        </Text>
        </>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_base,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_5xl,
    color: Color.colorGray_200,
    marginBottom: Padding.p_5xl,
    fontWeight: '700',
  },
  videoContainer: {
    borderRadius: Border.br_5xs,
    overflow: 'hidden',
    height: 200,
  },accessibilityText: {
    marginTop: Padding.p_sm,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default WelcomeCard;
