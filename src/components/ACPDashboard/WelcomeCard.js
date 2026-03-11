// components/WelcomeCard.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  Linking,
  Image,
  Pressable
} from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import VideoPlayer from "../utility/VideoPlayer";
import PlayIcon from '../../../assets/svgs/PlayIcon';

const WelcomeCard = () => {
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] =
    React.useState(false);

  //  useEffect(() => {
  //     AccessibilityInfo.isScreenReaderEnabled().then(setIsAccessibilityEnabled);
  //     const subscription = AccessibilityInfo.addEventListener(
  //       'screenReaderChanged',
  //       setIsAccessibilityEnabled
  //     );

  //     return () => subscription?.remove();
  //   }, []);
  // YouTube video ID
  const videoId = "C3cMQoWxv6I";

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {/* <VideoPlayer videoId={videoId} /> */}

        <Image
          source={require("../../../assets/welcome-banner-home.png")}
          style={{ width: "100%", height: "100%" }}
        />
        <View style={{
          position: "absolute",
          top: 170,
          width: "100%",
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
           <Pressable style={{ flexDirection: "row",  marginTop: 5 ,marginLeft: 40}}
            onPress={() => {
              Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
            }}
            accessibilityRole="button"
            accessibilityLabel="Watch welcome video"
            accessibilityHint="Double tap to watch on YouTube"
           >
            <Text style={styles.watchVideoButton}>Watch our welcome video</Text>
            <View style={{ marginLeft: 5, alignSelf: "center" ,marginTop: 3}}>
            <PlayIcon/>
            </View>
           </Pressable>
        </View>
        <Text
          style={[
            styles.title,
            { position: "absolute", top: 50, left: 20, width: 230 },
          ]}
          accessibilityRole="header"
          accessibilityLevel={1}
          accessible={true}
          accessibilityLabel="We’re excited to get you connected!"
        >
          We’re excited to get you connected!
        </Text>
      </View>
      {isAccessibilityEnabled && (
        <>
          <Text
            onPress={() => {
              Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
            }}
            style={[
              styles.accessibilityText,
              {
                textDecorationLine: "underline",
                textDecorationColor: Color.colorMidnightblue,
              },
            ]}
            accessibilityLabel="Video player loaded"
            accessibilityHint="Double tap to watch on YouTube"
          >
            Watch on YouTube
          </Text>
          <Text
            style={styles.accessibilityText}
            accessibilityLabel="Video player loaded"
            accessibilityHint="Double tap to watch on YouTube"
          >
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
    flexDirection: "column",
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_base,
  },
  title: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_5xl,
    lineHeight: 26,
    color: Color.colorMidnightblue,
    marginBottom: Padding.p_5xl,
    fontWeight: "700",
  },
  videoContainer: {
    overflow: "hidden",
    height: 200,
  },
  accessibilityText: {
    marginTop: Padding.p_sm,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
  },watchVideoButton: {
    marginVertical: Padding.p_sm,
    fontSize: FontSize.size_base ,
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
  },
});

export default WelcomeCard;
