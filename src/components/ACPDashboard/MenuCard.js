// components/MenuCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';
import { useNavigation } from '@react-navigation/native';

const MenuCard = ({ item, style }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (item.screenName) {
      navigation.navigate(item.screenName);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint={`Navigate to ${item.title} screen`}
    >
      <View style={styles.content}>
        <Icon name={item.icon} size={24} color={item.color || Color.sparklightBrightPurple} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_5xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    minHeight: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.sparklightBrightPurple,
    marginTop: Padding.p_5xs,
    textAlign: 'center',
  },
});

export default MenuCard;