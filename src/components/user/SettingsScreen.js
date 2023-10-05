import React,{useCallback} from 'react';
import { View, Text, Button,StyleSheet,Linking } from 'react-native';



const Settings = () => {
  
  return (
    <View style={styles.container}>
      <Text>{`Welcome Settings`}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: 'center',
    color: '#D8000C',
  },
});

export default Settings;