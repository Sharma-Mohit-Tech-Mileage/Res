import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, AccessibilityInfo, TouchableWithoutFeedback, Platform } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

const AccessibleYoutubePlayer = ({
  height = 185,
  videoId,
  play: initialPlayState = false,
  videoTitle = 'YouTube video',
  onError,
  onPlaybackStateChange,
}) => {
  const [playing, setPlaying] = useState(initialPlayState);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    setPlaying(initialPlayState);
  }, [initialPlayState]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const announcePlaybackState = useCallback(() => {
    const stateAnnouncement = playing ? 'Playing' : 'Paused';
    const timeAnnouncement = duration > 0 ? 
      `Time: ${formatTime(currentTime)} of ${formatTime(duration)}` : '';
    AccessibilityInfo.announceForAccessibility(
      `${videoTitle}. ${stateAnnouncement}. ${timeAnnouncement}`
    );
  }, [playing, currentTime, duration, videoTitle]);

  const handlePlayPauseToggle = useCallback(() => {
    setPlaying(prev => !prev);
    if (onPlaybackStateChange) {
      onPlaybackStateChange(!playing);
    }
  }, [playing, onPlaybackStateChange]);

  const onStateChange = useCallback((state) => {
    switch (state) {
      case 'playing':
        setPlaying(true);
        AccessibilityInfo.announceForAccessibility(`${videoTitle} playing`);
        break;
      case 'paused':
        setPlaying(false);
        AccessibilityInfo.announceForAccessibility(`${videoTitle} paused`);
        break;
      case 'ended':
        setPlaying(false);
        AccessibilityInfo.announceForAccessibility(`${videoTitle} ended`);
        break;
    }
  }, [videoTitle]);

  const onReady = useCallback(() => {
    setPlayerReady(true);
    playerRef.current?.getDuration().then(duration => {
      setDuration(duration);
      AccessibilityInfo.announceForAccessibility(
        `${videoTitle} ready. Duration: ${formatTime(duration)}`
      );
    });
  }, [videoTitle]);

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        playerRef.current?.getCurrentTime().then(time => {
          setCurrentTime(time);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <TouchableWithoutFeedback
      onPress={handlePlayPauseToggle}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${videoTitle}. ${playing ? 'Playing' : 'Paused'}`}
      accessibilityHint="Double tap to play or pause"
      accessibilityState={{
        busy: !playerReady,
        disabled: !playerReady
      }}
      accessibilityActions={[
        { name: 'activate', label: 'Toggle play/pause' },
        { name: 'longpress', label: 'Show current position' },
      ]}
      onAccessibilityAction={({ nativeEvent: { actionName }}) => {
        switch (actionName) {
          case 'activate':
            handlePlayPauseToggle();
            break;
          case 'longpress':
            announcePlaybackState();
            break;
        }
      }}
      importantForAccessibility="yes"
    >
      <View
        style={{
          height,
          backgroundColor: '#000',
        }}
      >
        <YoutubePlayer
          ref={playerRef}
          height={height}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
          onReady={onReady}
          onError={(error) => {
            if (onError) onError(error);
            AccessibilityInfo.announceForAccessibility('Error playing video');
          }}
          webViewProps={{
            accessible: true,
            accessibilityLabel: videoTitle,
            accessibilityRole: "none",
            importantForAccessibility: "no",
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AccessibleYoutubePlayer;