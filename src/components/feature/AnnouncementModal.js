import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AnnouncementStep from './AnnouncementStep';
import AnnouncementProgress from './AnnouncementProgress';
import { theme } from '../../styles/theme';
import { button } from '../../styles/utilities';
import { trackStepViewed } from '../../utils/announcementHelpers';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnnouncementModal = ({ visible = false, campaign = null, onComplete, onDismiss, navigationRef }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime] = useState(Date.now());

  const overlayFade = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Safe getters
  const steps = campaign?.content?.steps || [];
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep] || null;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    if (visible && campaign) {
      Animated.parallel([
        Animated.timing(overlayFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalSlide, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Track first step view safely
      try {
        if (steps[0]?.title) {
          trackStepViewed(campaign.id, 1, steps[0].title);
        }
      } catch (error) {
        console.warn('[AnnouncementModal] Error tracking step view:', error);
      }
    }
  }, [visible, campaign]);

  useEffect(() => {
    if (visible && campaign && currentStepData?.title) {
      try {
        trackStepViewed(campaign.id, currentStep + 1, currentStepData.title);
      } catch (error) {
        console.warn('[AnnouncementModal] Error tracking step view:', error);
      }
    }
  }, [currentStep, visible, campaign, currentStepData]);

  // Reset step when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
    }
  }, [visible]);

  const handleNext = () => {
    if (totalSteps === 0) {
      handleComplete();
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  const handleSkip = () => {
    handleDismiss();
  };

  const handleComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    exitAnimation(() => {
      if (onComplete && typeof onComplete === 'function') {
        try {
          onComplete(timeSpent);
        } catch (error) {
          console.warn('[AnnouncementModal] Error in onComplete callback:', error);
        }
      }
    });
  };

  const handleDismiss = () => {
    exitAnimation(() => {
      if (onDismiss && typeof onDismiss === 'function') {
        try {
          onDismiss(currentStep);
        } catch (error) {
          console.warn('[AnnouncementModal] Error in onDismiss callback:', error);
        }
      }
    });
  };

  const exitAnimation = (callback) => {
    Animated.parallel([
      Animated.timing(overlayFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalSlide, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep(0);
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  };

  // Don't render if no campaign, not visible, or no steps
  if (!visible || !campaign || totalSteps === 0) {
    return null;
  }

  // Don't render if current step data is invalid
  if (!currentStepData) {
    console.warn('[AnnouncementModal] Invalid step data at index:', currentStep);
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      <Animated.View style={[styles.overlay, { opacity: overlayFade.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.4]
      })}]}>
        <Pressable style={styles.overlayPressable} onPress={handleDismiss} />
      </Animated.View>

      <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalSlide }] }]}>
        <View style={styles.modal}>
          {/* Header with NEW FEATURE badge on left and Skip on right */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#8D3B90', '#353091']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newFeatureBadge}
            >
              <Text style={styles.badgeText}>NEW FEATURE</Text>
            </LinearGradient>

            <Pressable onPress={handleSkip} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <AnnouncementStep
              step={currentStepData}
              currentIndex={currentStep}
              totalSteps={totalSteps}
              isActive={true}
              navigationRef={navigationRef}
            />
          </ScrollView>

          <View style={styles.footer}>
            {totalSteps > 1 && (
              <AnnouncementProgress totalSteps={totalSteps} currentStep={currentStep} />
            )}
            {totalSteps <= 1 && <View style={{ flex: 1 }} />}

            <View style={styles.actions}>
              {currentStep > 0 && (
                <Pressable style={styles.buttonSecondary} onPress={handleBack}>
                  <Text style={styles.buttonSecondaryText}>Back</Text>
                </Pressable>
              )}

              <Pressable style={styles.buttonPrimary} onPress={handleNext}>
                <Text style={styles.buttonPrimaryText}>
                  {isLastStep ? 'Got it' : 'Next'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  overlayPressable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.xl,
    maxHeight: SCREEN_HEIGHT * 0.85,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  newFeatureBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#8D3B90',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  skipText: {
    ...button.smallButtonText,
    color: theme.colors.primaryDark,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.base,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  buttonSecondary: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.primaryDark,
  },
  buttonSecondaryText: {
    ...button.smallButtonText,
    color: theme.colors.primaryDark,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.xs,
  },
  buttonPrimaryText: {
    ...button.smallButtonText,
  },
});

export default AnnouncementModal;