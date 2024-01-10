import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const ShopScreen = ({ navigation }) => {
  useEffect(() => {
    // Reset the stack to have Home and then navigate to ArticalWindowUtility
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'MyTab' }, // Replace 'Home' with the actual name of your home screen
          {
            name: 'ArticalWindowUtility',
            params: {
              url: 'https://support.sparklight.com/hc/en-us/articles/115009159707-Data-Plans',
              name: 'Shop'
            }
          },
        ],
      })
    );
  }, [navigation]);

  return (
    <View>
      <Text>The screen will navigate away immediately to ArticalWindowUtility</Text>
    </View>
  );
};

export default ShopScreen;
