import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SupportIcon from "../../../res/svgIcons/SupportIcon";
import SecondaryButton from "../../common/customui/PrimaryButton";

const RotatingCirclesAnimation = ({ isAnimating = false }) => {
  const rotation1 = useRef(new Animated.Value(0)).current;
  const rotation2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      const anim1 = Animated.loop(
        Animated.timing(rotation1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      const anim2 = Animated.loop(
        Animated.timing(rotation2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );

      anim1.start();
      anim2.start();

      return () => {
        anim1.stop();
        anim2.stop();
      };
    } else {
      rotation1.setValue(0);
      rotation2.setValue(0);
    }
  }, [isAnimating]);

  const rotate1 = rotation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotate2 = rotation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  if (!isAnimating) {
    return <SupportIcon color={theme.colors.primary} filled={true} size={28} />;
  }

  return (
    <View style={styles.animationContainer}>
      <Animated.View
        style={[
          styles.rotatingCircle,
          styles.outerCircle,
          { transform: [{ rotate: rotate1 }] },
        ]}
      >
      </Animated.View>

      <Animated.View
        style={[
          styles.rotatingCircle,
          styles.innerCircle,
          { transform: [{ rotate: rotate2 }] },
        ]}
      >
      </Animated.View>

      <View style={styles.centerIcon}>
        <SupportIcon color={theme.colors.primary} filled={true} size={28} />
      </View>
    </View>
  );
};


const StatusSection = ({
  onCheckStatus,
  outageData,
  checking,
  onCloseNotification,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckStatus = () => {
    setIsAnimating(true);

    if (onCheckStatus) {
      onCheckStatus();
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 30000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {outageData && (
          <View style={styles.alertInsideCard}>
            <NotificationAlert
              type={outageData.hasOutage ? "warning" : "error"}
              title={outageData.title}
              message={outageData.message}
              onClose={onCloseNotification}
              showCloseIcon={true}
              isVisible={true}
              splitKey="notification settings"
            />
          </View>
        )}

       
        <View style={styles.iconWrapper}>
          <View style={styles.iconBadge}>
            <RotatingCirclesAnimation
              isAnimating={isAnimating || checking}
            />
          </View>
        </View>

        
        <Text style={styles.title} accessible={true} accessibilityRole="header">
          Stay Connected with Confidence
        </Text>

        
        <Text style={styles.subtitle} accessible={true}>
          {isAnimating || checking
            ? "Checking your service status..."
            : "When your connection pauses, we hit play."}
        </Text>

        <SecondaryButton
          title="Check Service Status"
          buttonType="submit"
          onPress={handleCheckStatus}
          accessibilityLabel="Check Service Status"
          accessibilityRole="button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: statusSection.container, 
  card: statusSection.card,
  alertInsideCard: statusSection.alertInsideCard,
  iconWrapper: statusSection.iconWrapper,
  iconBadge: statusSection.iconBadge,
  title: statusSection.title,
  subtitle: statusSection.subtitle,

  animationContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rotatingCircle: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 9999,
  },
  
  outerCircle: {
    width: 90, 
    height: 90,
    borderTopColor: theme.colors.primary,
    borderRightColor: theme.colors.primary,
  },
  
  innerCircle: {
    width: 70, 
    height: 70,
    borderBottomColor: theme.colors.primary,
    borderLeftColor: theme.colors.primary,
  },
  
  centerIcon: {
    zIndex: 10,
  },
});

export default StatusSection;