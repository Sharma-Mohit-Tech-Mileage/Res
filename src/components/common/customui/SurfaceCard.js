import React from 'react';
import { View } from 'react-native';
import AppStyles from '../../../styles/AppStyles';

const SurfaceCard = ({ children, style, ...props }) => (
  <View style={[AppStyles.card, style]} {...props}>{children}</View>
);

export default SurfaceCard;
