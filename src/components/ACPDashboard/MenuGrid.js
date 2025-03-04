// components/MenuGrid.js
import React from 'react';
import { View, StyleSheet,Dimensions } from 'react-native';
import { Padding ,Color} from '../../../GlobalStyles';
import MenuCard from './MenuCard';
const { width } = Dimensions.get('window');
const MenuGrid = () => {
  const menuItems = [
    {
      id: 'billing',
      title: 'Billing',
      icon: 'credit-card',
      screenName: 'BillingTab',
      color: Color.sparklightBrightPurple,
    },
    {
      id: 'service',
      title: 'Service',
      icon: 'wifi',
      screenName: 'MyServices',
      color: Color.sparklightDarkGray,
    },
    {
      id: 'support',
      title: 'Support',
      icon: 'help-circle',
      screenName: 'Support',
      color: Color.sparklightBrightPurple,
    },
    {
      id: 'account',
      title: 'Account',
      icon: 'user',
      screenName: 'account',
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
    paddingVertical: Padding.p_5xl,
    paddingHorizontal: width*.04,
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