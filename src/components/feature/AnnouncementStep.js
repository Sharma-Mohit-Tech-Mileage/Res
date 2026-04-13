import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, AccessibilityInfo, findNodeHandle, Image } from 'react-native';
import { theme } from '../../styles/theme';
import { typography } from '../../styles/utilities';

const AnnouncementStep = ({ step, currentIndex, totalSteps, isActive, navigationRef }) => {
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

  const handleNavigation = (navConfig) => {
    if (!navConfig) return;

    const { type, destination, params, childScreen } = navConfig;

    try {
      switch (type) {
        case 'tab':
          if (navigationRef?.current) {
            if (childScreen) {
              // First navigate to the tab to ensure the stack is mounted
              navigationRef.current.navigate('MyTab', {
                screen: destination,
              });
              // Then navigate to the child screen after the tab stack initializes
              setTimeout(() => {
                if (navigationRef?.current) {
                  navigationRef.current.navigate('MyTab', {
                    screen: destination,
                    params: {
                      screen: childScreen,
                      ...(params && { params }),
                    },
                  });
                }
              }, 400);
            } else {
              navigationRef.current.navigate('MyTab', {
                screen: destination,
                ...(params && { params }),
              });
            }
          }
          break;
        case 'screen':
          if (navigationRef?.current) {
            navigationRef.current.navigate(destination, params);
          }
          break;
        case 'external':
        case 'deep_link':
          Linking.openURL(destination);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('[AnnouncementStep] Navigation error:', error);
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
          <Pressable 
            key={index}
            onPress={() => handleNavigation(link)}
            style={styles.learnMoreContainer}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={link.text || 'Learn more'}
          >
            <Text style={styles.learnMoreText}>
              {link.text || 'Learn more'}
            </Text>
          </Pressable>
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