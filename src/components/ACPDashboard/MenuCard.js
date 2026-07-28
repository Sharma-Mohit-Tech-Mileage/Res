import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { FontFamily, FontSize, Color, Padding } from '../../../GlobalStyles';
import Icon from '../common/Icon';
import { useNavigation } from '@react-navigation/native';
import Touchable from '../common/customui/Touchable';

const MenuCard = ({ item, style }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (item.id === 'service') {
      Alert.alert("Coming Soon", "This feature is not yet available.", [{ text: "Close", style: "cancel" }]);
    } else if (item.screenName) {
      navigation.reset({
        index: 0,
        routes: [{ name: item.screenName }],
      });
    }
  };

  return (
    <Touchable
      style={[styles.container, style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint={`Navigate to ${item.title} screen`}
    >
      <View style={styles.content}>
        <Icon name={item.icon} size={30} color={ Color.sparklightBrightPurple} />
        <Text
          style={[
            styles.title,
            item.id === 'service' && styles.disabledText
          ]}
        >
          {item.title}
        </Text>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: 10,
    paddingVertical: Padding.p_5xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.sparklightBrightPurple,
    marginTop: Padding.p_5xs,
    textAlign: 'center',
    fontWeight: '600',
  },
  disabledText: {
    color: Color.sparklightDarkGray, 
    opacity: 0.6,
  },
});

export default MenuCard;