import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  
} from "react-native";

import colors from "../../res/Colors";
import SecondaryButton from "./customui/SecondaryButton";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import RightArrow from "../../res/svgIcons/RightArrow";
import TimerInfo from "../../res/svgIcons/TimerInfo";
import strings from "../../res/Strings";
import { getCurrentSpeed } from "../../redux/actions/DashboardAction";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/utils/LocalStorage"
import SpeedTestModal from "./customui/SpeedTestModal";
import moment from "moment";
import { GetApiRequest } from "../../network/APIClient";
import { FontFamily } from "../../../GlobalStyles";


const DataSpeedComponent = ({navigation}) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
    getCurrentSpeed();
  };

  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [downloadFrac, setDownloadFrac] = useState(0);
  const [uploadFrac, setUploadFrac] = useState(0);
  const [speed, setSpeed] = useState(false);
  const [testDate, setTestDate] = useState(0);

  const getCurrentSpeed = () => {
    let re = getUser().then((res) => {
      const request = `/Internet/api/internet/${res.userInfo.accountNumber}/speedTest/Get`;
      GetApiRequest(request, onSuccess, onError);
    });
  };
  const onSuccess = (res) => {
    console.log("getCurrentSpeed", res);
    if (res) {
      let downloadSpeed = res.download_Kbps;
      let uploadSpeed = res.upload_Kbps;
      let date = res.createdOn;
      let speedInMbps_download = (downloadSpeed / 1000).toFixed(2);
      let speedInMbps_upload = (uploadSpeed / 1000).toFixed(2);
      let upl = speedInMbps_upload.toString().split(".");
      let downl = speedInMbps_download.toString().split(".");
      const format1 = "MM/DD/YY hh:mma";
      setTestDate(moment(date).format(format1));
      setDownload(downl[0]);
      setDownloadFrac(downl[1]);
      setUpload(upl[0])
      setUploadFrac(upl[1]);
      setSpeed(true);
    }
  };

  const onError = (error) => {
    console.log("error", error);
  };
  useEffect(() => {
    getCurrentSpeed();
  }, []);


  const TestSpeedResultSection = () => {
    return (
      <>
        <View
          style={{
            borderColor: colors.grey,
            borderWidth: 1,
            borderRadius: 8,
            marginTop: 15,
            marginHorizontal:20
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <View style={[styles.downloadbg]}>
                <Image source={require("../../../assets/frame-1645.png")} />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.speedtextLarge}>{download}</Text>
                <Text style={[styles.speedtextLarge, { fontSize: 16 }]}>
                  .{downloadFrac}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.downloadText}>Download</Text>
                <Text
                  style={[
                    styles.downloadText,
                    {
                      color: colors.dark_grey,
                      fontWeight: "400",
                      marginLeft: 5,
                    },
                  ]}
                >
                  Mbps
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignContent: "center",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <View style={[styles.downloadbg]}>
                <Image source={require("../../../assets/frame-1646.png")} />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.speedtextLarge}>{upload}</Text>
                <Text style={[styles.speedtextLarge, { fontSize: 16 }]}>
                  .{uploadFrac}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.downloadText}>Upload</Text>
                <Text
                  style={[
                    styles.downloadText,
                    {
                      color: colors.dark_grey,
                      fontWeight: "400",
                      marginLeft: 5,
                    },
                  ]}
                >
                  Mbps
                </Text>
              </View>
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <SecondaryButton
              text={"Test Speed"}
              onPress={() => {
                toggleModal();
              }}
            />
          </View>
          <View
            style={{ backgroundColor: "#F4F4F5", height: 2, marginTop: 20 }}
          />

          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              paddingLeft: 10,
            }}
          >
            <TimerInfo />
            <Text style={styles.timerInfo1}>Last run</Text>
            <Text style={styles.timerInfo2}>{testDate}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={[styles.internetStatusSection,{marginHorizontal:20}]}>
        <View style={{ marginTop: 5 }}>
          <InfoIcon />
        </View>
        <View>
          <Text style={styles.internetStatusTxt}>
            {strings.test_speed_info}
          </Text>
          <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/115010349927-Can-I-Run-an-Internet-Speed-Test-', name: ' More Details' })
                // Linking.openURL(
                //   "https://support.sparklight.com/hc/en-us/articles/115010349927-Can-I-Run-an-Internet-Speed-Test-"
                // );
              }}
            >
              <Text style={styles.learnMore}>{strings.learn_more}</Text>
            </TouchableOpacity>
            {/* <View style={styles.verticle_saperator} />
            <TouchableOpacity>
              <Text style={styles.learnMore}>{strings.test_with_eero}</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
      <TestSpeedResultSection />
      <View
        style={{ backgroundColor: "#F4F4F5", height: 1, marginVertical: 10 }}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ArticalWindowUtility', { url: 'https://customer.uat.sparklight.com/residential/services/upgrade', name: 'Upgrade Plan' })
          // Linking.openURL(
          //   "https://customer.uat.sparklight.com/residential/services/upgrade"
          // );
        }}
        style={{
          minHeight: 30,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 4,
          marginHorizontal:20,
          
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.sparklight_purple_blue,
            fontFamily:FontFamily.openSansRegular,
          }}
        >
          Upgrade Plan
        </Text>
        <View style={{ marginTop: 5 }}>
          <RightArrow />
        </View>
      </TouchableOpacity>

      {showModal && (
        <SpeedTestModal
          url="https://cableone.speedtestcustom.com/" 
          onClose={()=>toggleModal()}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#EAECF0",
    alignContent: "center",
    alignItems: "center",
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    fontFamily:FontFamily.openSansRegular,
    fontSize: 14,
    marginLeft: 5,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
  },
  speedtextLarge: {
    color: colors.sparklight_bright_purple,
    fontFamily:FontFamily.openSansRegular,
    textAlign: "center",
    marginTop: 10,
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 28 /* 83.333% */,
  },
  downloadText: {
    color: colors.darkest_grey,
    fontFamily:FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 20 /* 142.857% */,
  },
  downloadbg: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  timerInfo1: {
    color: colors.dark_grey,
    marginLeft: 5,
    fontSize: 14,
    fontFamily:FontFamily.openSansRegular,
    fontWeight: "400",
  },
  timerInfo2: {
    marginLeft: 5,
    color: colors.darkest_grey,
    fontSize: 14,
    fontFamily:FontFamily.openSansRegular,
    fontWeight: "400",
  },
  learnMore: {
    color: colors.sparklight_purple_blue,
    fontSize: 14,
    fontFamily:FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
  },
  verticle_saperator: {
    marginHorizontal: 10,
    alignSelf:'center',
    height: 15,
    backgroundColor: colors.dark_grey,
    width: 1,
  },
});

export default DataSpeedComponent;
