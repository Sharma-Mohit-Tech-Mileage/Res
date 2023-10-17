import React, { useCallback, useState } from "react";
import { View, Text, Button, StyleSheet, Linking } from "react-native";
import CTAButton from "../common/customui/CTAButton";
import SparkLightInputField from "../common/customui/SparkLightInputField";
import SparkLightPasswordField from "../common/customui/SparkLightPasswordField";

const Settings = () => {
  const [email, setEmail] = useState("");
  return (
    <View style={styles.screenContainer}>
      <SparkLightInputField
        onChangeText={(value) => setEmail(value)} //update state onChange
        focus={true} //initial focus on this TextInput
        style={{ marginTop: 20 }}
        placeholder="Email"
      />

      <SparkLightPasswordField
        onChangeText={(value) => setEmail(value)} //update state onChange
        focus={true} //initial focus on this TextInput
        style={{ marginTop: 20 }}
        placeholder="Password"
      />
      <CTAButton title="Login" />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    padding: 16,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: "center",
    color: "#D8000C",
  },
});

export default Settings;
