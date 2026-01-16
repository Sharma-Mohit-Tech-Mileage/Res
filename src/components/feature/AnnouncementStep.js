import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, AccessibilityInfo, findNodeHandle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/utilities';

const AnnouncementStep = ({ step, currentIndex, totalSteps, isActive }) => {
  const titleRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      if (titleRef.current) {
        const node = findNodeHandle(titleRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [isActive, currentIndex]);

  const handleLearnMore = () => {
    if (!step.learnMore) return;

    const { type, destination } = step.learnMore;

    try {
      switch (type) {
        case 'tab':
          navigation.navigate('MyTab', { screen: destination });
          break;
        case 'screen':
          navigation.navigate(destination);
          break;
        case 'external':
        case 'deep_link':
          Linking.openURL(destination);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('[AnnouncementStep] Learn more navigation error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text 
          ref={titleRef} 
          style={styles.title} 
          accessible={true} 
          accessibilityRole="header"
        >
          {step.title}
        </Text>

        <Text style={styles.description} accessible={true}>
          {step.description}
        </Text>

        {step.learnMore && (
          <Pressable 
            onPress={handleLearnMore}
            style={styles.learnMoreContainer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.learnMoreText}>
              {step.learnMore.text || 'Learn more'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: theme.spacing.sm,
    lineHeight: 26,
  },
  description: {
    ...typography.body,
    lineHeight: 22,
    color: theme.colors.text.secondary,
  },
  learnMoreContainer: {
    marginTop: theme.spacing.md,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primaryDark,
    textDecorationLine: 'underline',
  },
});

export default AnnouncementStep;