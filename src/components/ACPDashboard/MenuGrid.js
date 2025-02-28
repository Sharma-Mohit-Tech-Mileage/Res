// components/MenuGrid.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Padding ,Color} from '../../../GlobalStyles';
import MenuCard from './MenuCard';

const MenuGrid = () => {
  const menuItems = [
    {
      id: 'billing',
      title: 'Billing',
      icon: 'credit-card',
      screenName: 'BillingScreen',
      color: Color.sparklightBrightPurple,
    },
    {
      id: 'service',
      title: 'Service',
      icon: 'wifi',
      screenName: 'ServiceScreen',
      color: Color.sparklightDarkGray,
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'help-circle',
      screenName: 'SupportScreen',
      color: Color.sparklightBrightPurple,
    },
    {
      id: 'account',
      title: 'Account',
      icon: 'user',
      screenName: 'AccountScreen',
      color: Color.sparklightDarkGray,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <MenuCard item={menuItems[0]} style={styles.card} />
        <MenuCard item={menuItems[1]} style={styles.card} />
      </View>
      <View style={styles.row}>
        <MenuCard item={menuItems[2]} style={styles.card} />
        <MenuCard item={menuItems[3]} style={styles.card} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Padding.p_base,
    padding: Padding.p_5xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Padding.p_base,
  },
  card: {
    flex: 1,
    marginHorizontal: Padding.p_5xs,
  },
});

export default MenuGrid;