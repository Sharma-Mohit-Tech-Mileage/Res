import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DownArrow from '../../res/svgIcons/DownArrow';
import UpArrow from '../../res/svgIcons/ModemInfo';
import ServiceIconNew from '../../res/svgIcons/ServiceIconNew';
import UserIcon from '../../res/svgIcons/UserIcon';
import creditCard from '../../res/svgIcons/creditCard';
import Support from '../../res/svgIcons/Support';
import AutoPaperless from '../../res/svgIcons/AutoPaperless';
import Announce from '../../res/svgIcons/Announce';
import ArrowIconup from '../../res/svgIcons/ArrowIconup';
import ArrowIcondown from '../../res/svgIcons/ArrowIcondown';
import DoubleArrowIcon from '../../res/svgIcons/DoubleArrowIcon';
import UploadIcon from '../../res/svgIcons/UploadIcon';
import BillingdocIcon from '../../res/svgIcons/BillingdocIcon';
import DocumentIcon from '../../res/svgIcons/DocumentIcon';
import SearchBookIcon from '../../res/svgIcons/SearchBookIcon';
import BuildingDocIcon from '../../res/svgIcons/BuildingDocIcon';
import GearIcon from '../../res/svgIcons/GearIcon';
import SearchIcon from '../../../assets/svgs/SearchIcon'; 
import Checkcircle from '../../../assets/Icon/CircleCheck.png';
import ChevronRight from '../../../assets/svgs/Chevonright';
const Icon = ({ name, size = 24, color = '#000', style }) => {
  const iconMap = {
    'credit-card': { library: 'SVG', source: creditCard },
    'wifi': { library: 'SVG', source: ServiceIconNew },
    'help-circle': { library: 'SVG', source: Support },
    'user': { library: 'SVG', source: UserIcon },
    'check-circle': { library: 'SVG', source: AutoPaperless },
    'check': { library: 'Feather', name: 'check' },
    'refresh-cw': { library: 'SVG', source: AutoPaperless },
    'info': { library: 'Feather', name: 'info' },
    'megaphone': { library: 'SVG', source: Announce },
    'arrow-up': { library: 'SVG', source: ArrowIconup },
    'arrow-down': { library: 'SVG', source: ArrowIcondown },
    'double-arrow': { library: 'SVG', source: DoubleArrowIcon },
    'upload': { library: 'SVG', source: UploadIcon },
    // Direct SVG icons
    'down-arrow': { library: 'SVG', source: DownArrow },
    'up-arrow': { library: 'SVG', source: UpArrow },
    'bill-paid': { library: 'SVG', source: BillingdocIcon },
    'document': { library: 'SVG', source: DocumentIcon },
    'search-book': { library: 'SVG', source: SearchBookIcon },
    'gear': { library: 'SVG', source: GearIcon },

    // Image asset example
    'building-doc': { library: 'SVG', source: BuildingDocIcon },
    'search': { library: 'SVG', source: SearchIcon},
    'green-checkcircle': { library: 'Image', source: Checkcircle },
    'down-chevron': { library: 'Image', source: DownArrow },
    'right-chevron': { library: 'SVG', source: ChevronRight },
  };

  // Fallback icon if the provided name isn't in the map
  const iconInfo = iconMap[name] || { library: 'Feather', name: 'help-circle' };

  const renderAsset = () => {
    switch (iconInfo.library) {
      case 'FontAwesome':
        return <FontAwesome name={iconInfo.name} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconInfo.name} size={size} color={color} />;
      case 'SVG': {
        // Use the direct SVG file (imported as a component) as the source
        const SvgIcon = iconInfo.source;
        return <SvgIcon width={size} height={size} fill={color} />;
      }
      case 'Image':
        return (
          <Image
            source={iconInfo.source}
            style={{ width: size, height: size, tintColor: color }}
            resizeMode="contain"
          />
        );
      case 'Feather':
      default:
        return <Feather name={iconInfo.name} size={size} color={color} />;
    }
  };

  return <View style={style}>{renderAsset()}</View>;
};
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Icon;