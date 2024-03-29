import React, { useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Linking
} from "react-native";
import { FontFamily } from "../../../GlobalStyles";
import colors from "../../res/Colors";

const AppUpdateAlert = ({visible}) => {
  return (
    <SafeAreaView style={{flex:1}}>
      <Modal
        backdropPressToClose={false}
        style={{
          height: 230,
          width: 275,
          backgroundColor: "white",
          alignItems: "center",
          marginTop: "27%",
        }}
        position={"center"}
        visible={visible}
      >
        <View
          style={{ alignItems:'center', width: "100%", height: "100%",marginTop: "27%", }}
        >
          <Text
            style={{
              color: "#3d3d3d",
              fontSize: 20,
              fontFamily:FontFamily.openSansSemiBold,
              alignItems: "flex-start",
              marginTop: 20,
              marginLeft: 22,
              marginRight: 22,
            }}
          >
            New version available
          </Text>
          <Text
            style={{
              color: "#6b6b6b",
              fontSize: 16,
              fontFamily:FontFamily.openSansRegular,
              alignItems: "flex-start",
              marginTop: 20,
              marginLeft: 22,
              marginRight: 22,
            }}
          >
            Looks like you have an older version of the app. To get latest
            features and best experience you'll need to update now
          </Text>
          <TouchableOpacity
            onPress={() => {
                if (Platform.OS === 'android') {
                    Linking.openURL('https://play.google.com/store/apps/details?id=com.sparklight');
                  } else {
                    Linking.openURL('https://apps.apple.com/us/app/mysparklight/id6469003880');
                  }
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: Platform.OS == "ios" ? 40 : 50,
              height: 40,
              marginHorizontal:20,
              width: "100%",
              backgroundColor: colors.primary_color,
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.openSansRegular,
                fontSize: 16,
                color: "white",
              }}
            >
              UPDATE NOW
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer:{

  }
})

export default AppUpdateAlert;