import * as React from "react";
import { View, Text } from "react-native";

const AccountIcon = (props) => {
  const Fname = props.data && props.data.firstName ? props.data.firstName.charAt(0) : '';
  const Lname = props.data && props.data.lastName ? props.data.lastName.charAt(0) : '';

  return (
    <View
      style={{
        backgroundColor: props.focused ? "#353091" : "#767676",
        padding: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text allowFontScaling={false} style={{color:'white',fontWeight:'600'}}>
        {Fname}{Lname}
      </Text>
    </View>
  );
};
export default AccountIcon;
