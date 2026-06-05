import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, AccessibilityInfo, findNodeHandle, Image } from 'react-native';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/utilities';
import Touchable from '../common/customui/Touchable';

const AnnouncementStep = ({ step, currentIndex, totalSteps, isActive, onLearnMoreNavigate }) => {
  const titleRef = useRef(null);

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

  const handleLearnMorePress = (navConfig) => {
    if (!navConfig) return;

    if (onLearnMoreNavigate) {
      onLearnMoreNavigate(navConfig);
    }
  };

  const renderLearnMoreLinks = () => {
    const { learnMore } = step;

    if (!learnMore) return null;

    // Support both single object and array of objects
    const links = Array.isArray(learnMore) ? learnMore : [learnMore];

    return (
      <View style={styles.learnMoreWrapper}>
        {links.map((link, index) => (
          <Touchable
            key={index}
            minSize={0}
            onPress={() => handleLearnMorePress(link)}
            style={styles.learnMoreContainer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={link.text || 'Learn more'}
          >
            <Text style={styles.learnMoreText}>
              {link.text || 'Learn more'}
            </Text>
          </Touchable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Image Support */}
        {step.imageUrl && (
          <Image
            source={{ uri: step.imageUrl }}
            style={styles.stepImage}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={step.imageAlt || 'Feature illustration'}
          />
        )}

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

        {/* Multiple Learn More Links */}
        {renderLearnMoreLinks()}
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
  stepImage: {
    width: '100%',
    height: 180,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.sm,
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
  learnMoreWrapper: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  learnMoreContainer: {
    marginRight: theme.spacing.sm,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primaryDark,
    textDecorationLine: 'underline',
  },
});

export default AnnouncementStep;
