// components/common/AccessibleYoutubePlayer.jsx
import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native'; // 🛑 ADD Dimensions
import YoutubeIframe from 'react-native-youtube-iframe'; 

const AccessibleYoutubePlayer = ({ videoId }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);
  
  const screenWidth = Dimensions.get('window').width;
  const playerWidth = screenWidth * 0.92; 
  
  const height = Math.max(playerWidth * (9 / 16), 150); 
  

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  return (
    <View 
      style={[styles.container, { height: height }]} 
      accessibilityRole="image"
      accessibilityLabel={`YouTube Video Player for SparkLight welcome video`}
      importantForAccessibility="yes"
    >
      <YoutubeIframe
        ref={playerRef}
        height={height} // Pass the calculated dynamic height
        play={playing} 
        videoId={videoId}
        onChangeState={onStateChange}
        playerParams={{
          controls: 1, 
          rel: 0, 
          playsinline: 1,
          showClosedCaptions: true, 
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000', 
  },
});

export default AccessibleYoutubePlayer;