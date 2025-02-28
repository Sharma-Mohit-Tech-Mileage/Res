// components/common/Icon.js
import React from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Icon = ({ name, size = 24, color = '#000', style }) => {
  // Map of icon names to their respective libraries and icon names
  const iconMap = {
    // Menu icons
    'credit-card': { library: 'Feather', name: 'credit-card' },
    'wifi': { library: 'Feather', name: 'wifi' },
    'help-circle': { library: 'Feather', name: 'help-circle' },
    'user': { library: 'Feather', name: 'user' },
    
    // Feature icons
    'check-circle': { library: 'Feather', name: 'check-circle' },
    'check': { library: 'Feather', name: 'check' },
    
    // Banner icons
    'refresh-cw': { library: 'Feather', name: 'refresh-cw' },
    'info': { library: 'Feather', name: 'info' },
    'megaphone': { library: 'MaterialCommunityIcons', name: 'bullhorn-outline' },
  };

  const iconInfo = iconMap[name] || { library: 'Feather', name: 'help-circle' };

  const renderIcon = () => {
    switch (iconInfo.library) {
      case 'FontAwesome':
        return <FontAwesome name={iconInfo.name} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconInfo.name} size={size} color={color} />;
      case 'Feather':
      default:
        return <Feather name={iconInfo.name} size={size} color={color} />;
    }
  };

  return (
    <View style={style}>
      {renderIcon()}
    </View>
  );
};

export default Icon;