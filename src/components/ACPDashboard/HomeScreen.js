// HomeScreen.js
import React from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Platform 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Color, Padding} from './../../../GlobalStyles';

// Components
import WelcomeCard from './WelcomeCard';
import MenuGrid from './MenuGrid';
import PromoBanner from './PromoBanner';
import FeatureCard from './FeatureCard';
import InfoBanner from './InfoBanner';

const HomeScreen = ({ navigation }) => {
  const renderHeader = () => (
    <View
      accessibilityLabel="SparkLight"
      style={styles.headerContainer}
    >
      <Image
        accessible={true}
        accessibilityLabel="SparkLight"
        resizeMode="contain"
        style={styles.logoImage}
        source={require('../../../assets/SparklightEntryLogo.png')}
      />
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
          {renderHeader()}

          <ScrollView 
            style={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
          >
            {/* Content area with light gray background */}
            <View style={styles.parentContentWrapper}>
            <View style={styles.contentWrapper}>
              <WelcomeCard />
              <MenuGrid />
              <PromoBanner 
                title="Auto Pay + Paperless is a Winning Combination!" 
                showBonus={true}
              />
              <FeatureCard 
                title="Auto Pay"
                features={[
                  "Convenient",
                  "Timely Payments",
                  "Peace of Mind"
                ]}
                buttonText="Active"
                buttonVariant="success"
                isActive={true}
              />
              <FeatureCard 
                title="Paperless Billing"
                features={[
                  "Keeps you Organized",
                  "Cost Effective",
                  "Eco-Friendly"
                ]}
                buttonText="Go Paperless Today"
                buttonVariant="primary"
              />
              <InfoBanner 
                message="We are working diligently to enhance your experience"
                icon="megaphone"
              />
              </View>
            </View>
          </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50, // Space for tab bar
  },
  safeAreaContainer: {
    flex: 1,
  },
  parentContentWrapper: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200, 
    paddingHorizontal: Padding.p_5xl, 
  },
  headerContainer: {
    height: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 0 : 20,
  },
  logoImage: {
    width: 120,
    height: 30.324,
    flexShrink: 0,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    paddingHorizontal: Padding.p_5xl,
    paddingTop: 20,
    paddingBottom: 30,
  },
});

export default HomeScreen;