import React from 'react';
import { View, Text } from 'react-native';

const ShopScreen = () => {
  // useEffect(() => {
  //   // Navigate to 'ArticalWindowUtility' as soon as the screen loads
  //   navigation.navigate('ArticalWindowUtility', {
  //     url: 'https://support.sparklight.com/hc/en-us/articles/115009159707-Data-Plans',
  //     name: 'Shop'
  //   });
  // }, []); // Empty dependency array ensures this runs on every mount

  return (
    <View>
      <Text>No content will be displayed since the screen will navigate away immediately</Text>
    </View>
  );
};

export default ShopScreen;
