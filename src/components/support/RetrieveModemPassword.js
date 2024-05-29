import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
const RetrieveModemPassword = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Retrieve Modem Password</Text>
      
      <Text style={styles.label}>SSID</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue="CODA-A200"
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => console.log(itemValue)}
        >
          <Picker.Item label="CODA-A200" value="CODA-A200" />
          {/* Add more items if needed */}
        </Picker>
      </View>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value="25220C012918"
        editable={false}
      />

      <Text style={styles.howToHeader}>How To</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Connect Android Device</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Connect iPhone Device</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Connect PC/Mac</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
  },
  howToHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3E4A89',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default RetrieveModemPassword;
