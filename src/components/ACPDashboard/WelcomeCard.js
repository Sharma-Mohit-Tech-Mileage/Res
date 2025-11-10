// components/WelcomeCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import VideoPlayer from '../utility/VideoPlayer';


const WelcomeCard = () => {
  // YouTube video ID
  const videoId = 'C3cMQoWxv6I'; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We're Excited to Connect with you!</Text>
      
      <View style={styles.videoContainer}>
        <VideoPlayer videoId={videoId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  }
});

export default WelcomeCard;
