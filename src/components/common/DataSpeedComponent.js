import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import colors from "../../res/Colors";
import SecondaryButton from "./customui/SparkLightButton";
import SparkLightButton from "./customui/SecondaryButton";
import RightArrow from "../../res/svgIcons/RightArrow";
import TimerInfo from "../../res/svgIcons/TimerInfo";
import { getUser } from "../../redux/utils/LocalStorage";
import SpeedTestModal from "./customui/SpeedTestModal";
import moment from "moment";
import { GetApiRequest, PostApiRequest } from "../../network/APIClient";
import { FontFamily } from "../../../GlobalStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Env } from "../../network/apis/account/Constants";

const speedGif = require("../../../assets/Wifi-Speed-Animation.gif");
const wifiGif = require("../../../assets/Wifi-Speed-Only-Animation.gif");
const modemSpeedGif = require("../../../assets/Modem-Speed-Animation.gif");

const DataSpeedComponent = ({ navigation, speedType, hasEeroDevice }) => {
  const [showModal, setShowModal] = useState(false);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [downloadFrac, setDownloadFrac] = useState(0);
  const [uploadFrac, setUploadFrac] = useState(0);
  const [testDate, setTestDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [networkId, setNetworkId] = useState(null);
  const [speedLoading,setSpeedLoading] = useState(false);
  useEffect(() => {
    getCurrentSpeed();
  }, [speedType]);

  const toggleModal = () => {
    setShowModal(!showModal);
    getCurrentSpeed();
  };

  const getCurrentSpeed = () => {
    setDownload(0);
    setUpload(0);
    setDownloadFrac(0);
    setUploadFrac(0);
    setTestDate(0);

    getUser().then((res) => {
      if (speedType === 'wifi') {
        const request = `/Internet/api/internet/${res.userInfo.accountNumber}/speedTest/Get`;
        GetApiRequest(request, onSuccess, onError);
      } else {
        setSpeedLoading(true)
        const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${res.userInfo.accountNumber}`;
        GetApiRequest(request, (response) => {
          const networkId = response.data.networks[0].split('/').pop();
          setNetworkId(networkId);
          fetchModemSpeedDetails(res.userInfo.accountNumber, networkId);
        }, onError);
      }
    });
  };

  const fetchModemSpeedDetails = (accountNumber, networkId) => {
    const speedTestRequest = `/mobile/api/Eero/GetEeroSpeedTestDetails?accountnumber=${accountNumber}&networkId=${networkId}`;
    GetApiRequest(speedTestRequest, onSuccessModem, onError);
  };

  const onSuccess = (res) => {
    if (res) {
      const downloadSpeed = res.download_Kbps;
      const uploadSpeed = res.upload_Kbps;
      const date = res.createdOn;

      const speedInMbps_download = (downloadSpeed / 1000).toFixed(2);
      const speedInMbps_upload = (uploadSpeed / 1000).toFixed(2);
      const upl = speedInMbps_upload.toString().split(".");
      const downl = speedInMbps_download.toString().split(".");

      const format1 = "MM/DD/YY hh:mma";
      setTestDate(moment(date).format(format1));
      setDownload(downl[0]);
      setDownloadFrac(downl[1]);
      setUpload(upl[0]);
      setUploadFrac(upl[1]);
    }
    setLoading(false);
  };

  const onSuccessModem = (res) => {
    if (res && res.length > 0) {
      const latestResult = res[0];
      const downloadSpeed = latestResult.download_Result * 1000; // Convert to Kbps
      const uploadSpeed = latestResult.upload_Result * 1000; // Convert to Kbps
      const date = latestResult.tstamp;

      const speedInMbps_download = (downloadSpeed / 1000).toFixed(2);
      const speedInMbps_upload = (uploadSpeed / 1000).toFixed(2);
      const upl = speedInMbps_upload.toString().split(".");
      const downl = speedInMbps_download.toString().split(".");

      const format1 = "MM/DD/YY hh:mma";
      setTestDate(moment(date).format(format1));
      setDownload(downl[0]);
      setDownloadFrac(downl[1]);
      setUpload(upl[0]);
      setUploadFrac(upl[1]);
    }
    setSpeedLoading(false);
  };

  const onError = (error) => {
    console.log("error", error);
    setLoading(false);
    setSpeedLoading(false);
  };

  const handleTestSpeed = () => {
    setDownload(0);
    setUpload(0);
    setDownloadFrac(0);
    setUploadFrac(0);
    setTestDate(0);
    if (speedType === 'wifi') {
      toggleModal();
    } else {
      setLoading(true);
      getUser().then((res) => {
        const postRequest = `/mobile/api/eero/InsertSpeedTestResults?accountnumber=${res.userInfo.accountNumber}&networkId=${networkId}`;
        PostApiRequest(postRequest, {}, () => {
          setLoading(false);
          setSpeedLoading(true);
          fetchModemSpeedDetails(res.userInfo.accountNumber, networkId);
        }, onError);
      });
    }
  };

  const handleCancel = () => {
    setLoading(false);
  };

  const getGifSource = () => {
    if (speedType === 'wifi') {
      return hasEeroDevice ? speedGif : wifiGif;
    }
    return modemSpeedGif;
  };

  const TestSpeedResultSection = () => {
    return (
      <>
        <View style={styles.testSpeedResultContainer}>
          <View style={[styles.gifContainer, { marginHorizontal: wp('6%') }]}>
            <FastImage resizeMode={FastImage.resizeMode.contain} source={getGifSource()} style={styles.gif} />
          </View>
          {speedType !== 'wifi' && (
            <View style={styles.refreshContainer}>
              <Text style={styles.refreshText}><Text style={styles.speedRow}>Tap </Text> 
                <Text onPress={getCurrentSpeed} style={styles.refreshButton}>
                  <Text style={styles.refreshButtonText}>here</Text>
                </Text>
                <Text style={styles.speedRow}> to refresh for latest information </Text> 
              </Text>
            </View>
          )}
          {speedLoading?
            <ActivityIndicator size="large" color={colors.sparklight_bright_purple} />:null}
          <View style={styles.testSpeedInnerContainer}>
            <View style={styles.testSpeedColumn}>
              <View style={styles.speedRow} accessible={true} accessibilityLabel={`${download}.${downloadFrac}`}>
                <FastImage source={require("../../../assets/download.png")} style={styles.icon} />
                <View style={styles.speedValueContainer}>
                  <Text style={styles.speedtextLarge} numberOfLines={1} ellipsizeMode="tail">{download}</Text>
                  <Text style={[styles.speedtextLarge, styles.speedFracText]} numberOfLines={1} ellipsizeMode="tail">.{downloadFrac}</Text>
                </View>
              </View>
              <View style={styles.speedRow} accessible={true} accessibilityLabel={`Download Mbps`}>
                <Text style={styles.downloadText}>Download</Text>
                <Text style={[styles.downloadText, styles.downloadsupport]}> Mbps</Text>
              </View>
            </View>
  
            <View style={styles.uploadParent}>
              <View style={styles.speedRow} accessible={true} accessibilityLabel={`${upload}.${uploadFrac}`}>
                <FastImage source={require("../../../assets/upload.png")} style={styles.icon} />
                <View style={styles.speedValueContainer}>
                  <Text style={styles.speedtextLarge} numberOfLines={1} ellipsizeMode="tail">{upload}</Text>
                  <Text style={[styles.speedtextLarge, styles.speedFracText]} numberOfLines={1} ellipsizeMode="tail">.{uploadFrac}</Text>
                </View>
              </View>
              <View style={styles.speedRow} accessible={true} accessibilityLabel={`Upload Mbps`}>
                <Text style={styles.downloadText}>Upload</Text>
                <Text style={[styles.downloadText, styles.downloadsupport]}> Mbps</Text>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 16 }} accessible={true} accessibilityLabel={`Test Speed`} accessibilityRole="button">
            <SecondaryButton buttonText={"Test Speed"} onPress={handleTestSpeed} />
          </View>
          <View style={styles.divider} />
          <View style={styles.timer}>
            <TimerInfo />
            <Text style={styles.timerInfo1}>Last run</Text>
            <Text style={styles.timerInfo2}>{testDate}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size="large" color={colors.sparklight_bright_purple} />
            <Text style={[styles.loadingText, { fontSize: 24 }]}>Testing speed...</Text>
            <Text style={[styles.loadingText, { fontSize: 16 }]}>This process may take a while, so please check back in a minute.</Text>
          </View>
          <View accessible={true} accessibilityLabel={`Test Speed`} accessibilityRole="button">
            <SparkLightButton text={"Cancel"} onPress={handleCancel} />
          </View>
          <View style={styles.divider} />
          <View style={styles.timer}>
            <TimerInfo />
            <Text style={styles.timerInfo1}>Last run</Text>
            <Text style={styles.timerInfo2}>{testDate}</Text>
          </View>
        </View>
      )}
      {!loading ? <TestSpeedResultSection /> : null}
      <View style={styles.divider} />
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={`Upgrade Plan`}
        accessibilityRole="button"
        onPress={() => navigation.navigate('ArticalWindowUtility', { url: `${Env.URL}/services/upgrade`, name: 'Upgrade Plan' })}
        style={styles.result}
      >
        <Text style={styles.planUpgrade}>Upgrade Plan</Text>
        <View style={styles.rightArrowContainer}><RightArrow /></View>
      </TouchableOpacity>
      {showModal && <SpeedTestModal url="https://cableone.speedtestcustom.com/" onClose={toggleModal} />}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: wp('6%'),
    paddingHorizontal: 20,
    paddingTop: 16
  },
  loadingSpinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  testSpeedResultContainer: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 0, // Optional: Rounded corners
    marginHorizontal: wp('6%'),
    //padding: 16, // Added padding for better spacing
  },
  gifContainer: {
    alignItems: 'center',
    marginTop: 16,
    overflow: 'hidden',
    borderWidth: 1, // Border width for the GIF container
    borderColor: colors.grey, // Border color
    borderRadius: 10, // Optional: Rounded corners
  },
  gif: {
    width: wp('75%'),
    height: undefined, // Maintain aspect ratio
    aspectRatio: 3,
    marginVertical: -5
  },
  testSpeedInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  testSpeedColumn: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  speedRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  speedValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  speedtextLarge: {
    color: colors.sparklight_bright_purple,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
    maxWidth: 150, // Add maximum width to prevent overflow
  },
  speedFracText: {
    fontSize: 16,
    maxWidth: 50, // Add maximum width to prevent overflow
  },
  downloadText: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "600",
    lineHeight: 20,
  },
  downloadsupport: {
    color: colors.dark_grey,
    fontWeight: "400",
    marginLeft: 5,
  },
  uploadParent: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  divider: {
    backgroundColor: "#F4F4F5",
    height: 2,
    marginTop: 16,
  },
  timer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  timerInfo1: {
    color: colors.dark_grey,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
  },
  timerInfo2: {
    marginLeft: 5,
    color: colors.darkest_grey,
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
  },
  result: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    marginHorizontal: wp('6%'),
  },
  planUpgrade: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
  },
  speedTypeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.sparklight_grey,
    marginTop: 10,
  },
  refreshContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  refreshText: {
    textAlign: 'center',
  },
  refreshButton: {
    color: colors.sparklight_bright_purple,
    fontWeight: 'bold',
  },
  refreshButtonText: {
    color: colors.sparklight_bright_purple,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default DataSpeedComponent;
