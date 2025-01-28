import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Colors from "../../../res/Colors";

const SparkLightPasswordField = (props) => {
  const [focus, setFocus] = React.useState(props.focus);
  return (
    <View
      style={[
        styles.container,
        props.style,
        focus ? styles.focused : styles.notFocused,
      ]}
    >
      <TextInput
        setFocus={focus} //whatever focus state holds
        onChangeText={(text) => props.onChangeText(text)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={styles.textInput}
        placeholder={props.placeholder}
        secureTextEntry={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  focused: {
    fontSize: 12,
    color: Colors.sparklight_grey,
    backgroundColor: Colors.snow_white,
    borderColor: Colors.sparklight_bright_purple,
    borderWidth: 1,
  },
  textInput: {
    borderRadius: 5,
    paddingLeft: 15,
    width: 290,
  },
  notFocused: {
    fontSize: 12,
    color: Colors.sparklight_grey,
    backgroundColor: Colors.snow_white,
    borderColor: Colors.sparklight_grey,
  },
  container: {
    flexDirection: "row",
    borderRadius: 5,
    width: 312,
    justifyContent: "center",
    padding: 3,
    alignItems: "center",
    height: 50,
  },
  inputStyle: {
    flex: 1,
  },
});

export default SparkLightPasswordField;
