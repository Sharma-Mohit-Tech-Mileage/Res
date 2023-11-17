import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignupScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Implement your signup logic here
    console.log(`Full Name: ${fullName}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={'#c8c8c8c8'}
        onChangeText={(text) => setFullName(text)}
        value={fullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'#c8c8c8c8'}
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'#c8c8c8c8'}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#333333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color:'white',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    color:'white',
    marginBottom: 10,
    paddingLeft: 10,
  },
  signupButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default SignupScreen;
