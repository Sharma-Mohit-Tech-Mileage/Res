import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from 'moment';
import { getUser } from "../../../redux/utils/LocalStorage";
import { GetApiRequest ,PostApiRequest} from "../../../network/APIClient";
import { Color, Padding, FontSize ,FontFamily} from '../../../../GlobalStyles';
import CheckCircleOutline from "../../../res/svgIcons/CheckCircleOutline";
import DownloadSpeed from "../../../res/svgIcons/DownloadSpeed";
import UploadSpeed from "../../../res/svgIcons/UploadSpeed";
import WatchIcon from "../../../res/svgIcons/WatchIcon";

const ModemSpeedTest = ({ navigation, route }) => {
  const { networkId } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [testDate, setTestDate] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (networkId) {
      handleTestSpeed();
    }
  }, [networkId]);

  const handleTestSpeed = () => {
    console.log("Test Speed initiated");
    setLoading(true);
    setDownload(0);
    setUpload(0);
    setTestDate(null);
    getUser().then((res) => {
      const postRequest = `mobile/api/eero/InsertSpeedTestResults?accountnumber=${res.userInfo.accountNumber}&networkId=${networkId}`;
      PostApiRequest(postRequest, {}, () => {
        // Put sleep for 1 minute to get the speed test results
        setTimeout(() => {
          fetchModemSpeedDetails(res.userInfo.accountNumber, networkId);
        }, 60000);
      }, onError);
    });
  };

  const fetchModemSpeedDetails = (accountNumber, networkId) => {
    const speedTestRequest = `mobile/api/Eero/GetEeroSpeedTest?accountnumber=${accountNumber}&networkId=${networkId}`;
    console.log("Speed Test Request URL:", speedTestRequest);
    setLoading(true); // Set loading state to true to show skeleton placeholders
    GetApiRequest(
      speedTestRequest,
      (res) => {
        if (res && res.data && res.data.length > 0) {
          const latestResult = res.data[0];
          const downloadSpeed = latestResult.down_Mbps.toFixed(2); // Limit to two decimal places
          const uploadSpeed = latestResult.up_Mbps.toFixed(2); // Limit to two decimal places
          const date = latestResult.date;
    
          console.log("Speed Test Results:", { downloadSpeed, uploadSpeed, date });
          setDownload(downloadSpeed);
          setUpload(uploadSpeed);
          setTestDate(moment(date).format("MM/DD/YY hh:mma"));
        } else {
          console.log("No speed test results found.");
        }
        setLoading(false); // Stop skeleton loading once data is fetched
        setTestCompleted(true);
        setRefreshing(false);
      },
      (error) => {
        console.log("Speed test fetch error:", error);
        setLoading(false);
        setTestCompleted(true);
        setRefreshing(false);
      }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUser().then((res) => {
      fetchModemSpeedDetails(res.userInfo.accountNumber, networkId);
    });
  };

  const onError = (error) => {
    console.log("An error occurred:", error);
    setLoading(false);
  };
  
  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Modem Speed Test"
        onPressBack={() => navigation.goBack()}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            title="Pull to refresh"
            tintColor={Color.sparklightBrightPurple}
            titleColor={Color.colorMidnightblue}
          />
        }
      >
        <View style={styles.speedTestContainer}>
          {/* Top Section */}
          <View style={styles.topSectionContainer}>
            <View style={styles.topSection}>
              {loading && !refreshing ? (
                <View style={styles.topSectionContent}>
                  <ActivityIndicator size="large" color={Color.sparklightBrightPurple} style={styles.indicatorIcon} />
                  <Text style={styles.topSectionText}>
                    Speed test in progress, one moment, please. This may take up to a minute to complete.
                  </Text>
                </View>
              ) : testCompleted ? (
                <View style={styles.topSectionContent}>
                  <View style={styles.indicatorIcon}>
                    <CheckCircleOutline />
                  </View>
                  <Text style={styles.topSectionText}>
                    <Text style={{fontWeight:'700',color:Color.sparklightGreen}}>Speed test complete.</Text> Thank you for your patience.
                  </Text>
                </View>
              ) : (
                <Text style={styles.topSectionText}>
                  Start the speed test to see your results.
                </Text>
              )}
            </View>
          </View>

          {/* Download and Upload Results */}
          <View style={styles.resultsContainer}>
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Download</Text>
              <View style={styles.resultIconContainer}>
                <DownloadSpeed />
                {(loading || refreshing) ? (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={styles.resultValue}>{download ? `${download} Mbps` : "---"}</Text>
                )}
              </View>
            </View>
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Upload</Text>
              <View style={styles.resultIconContainer}>
                <UploadSpeed/>
                {(loading || refreshing) ? (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={80} height={20} borderRadius={4} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={styles.resultValue}>{upload ? `${upload} Mbps` : "---"}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Updated Section */}
          <View style={styles.updatedContainer}>
            <Text style={styles.updatedTitle}>Updated</Text>
            <View style={styles.resultIconContainer}>
              {!loading && !refreshing && <View style={[styles.indicatorIcon, { marginTop: 10 }]}>
                <WatchIcon />
              </View>}
              {(loading || refreshing) ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
                </SkeletonPlaceholder>
              ) : (
                <Text style={styles.updatedValue}>{testDate || "---"}</Text>
              )}
            </View>
          </View>
            <View style={[styles.resultIconContainer,{marginTop:8}]}>
                <Text style={styles.updatedValue}><Text style={{fontWeight:'600',color:'#000000'}}>Tip:</Text> Pull screen down to update content.</Text>
            </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.runButton, loading && styles.disabledButton]}
          onPress={handleTestSpeed}
          disabled={loading || refreshing}
        >
          { (
            <Text style={styles.runButtonText}>
              {testCompleted ? "Run Speed Test Again" : "Run Speed Test"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  scrollView: {
    flexGrow: 1,
  },
  speedTestContainer: {
    backgroundColor: Color.sparklightWhite,
    margin: Padding.p_xl,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  topSectionContainer: {
    width: '100%',
    backgroundColor: Color.colorWhitesmoke_100, // Gray background for the top section
    padding: Padding.p_base,
    borderRadius: 8,
    marginBottom: 20,
  },
  topSection: {
    alignItems: 'center',
  },
  topSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorIcon: {
    marginRight: 10,
  },
  topSectionText: {
    fontSize: FontSize.size_sm,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: '400',
    textAlign: 'left',
    flex: 1,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  resultBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  resultTitle: {
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_lg,
    fontWeight: '600',
    fontFamily: FontFamily.openSansRegular,
    marginBottom: 8,
  },
  resultValue: {
    color: '#000000',
    fontSize: FontSize.size_lg,
    fontWeight: '400',
    fontFamily: FontFamily.openSansRegular,
  },
  updatedContainer: {
    marginTop: 16,
    alignItems: 'center',// Gray background for the top section
    padding: Padding.p_base,
    backgroundColor: Color.colorWhitesmoke_100, 
    borderRadius: 8,
    width: '100%',
  },
  updatedTitle: {
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_lg,
    fontWeight: '600',
    fontFamily: FontFamily.openSansRegular,
  },
  updatedValue: {
    color: '#292929',
    fontSize: FontSize.size_sm,
    fontWeight: '400',
    marginTop: 8,
  },
  runButton: {
    backgroundColor: Color.colorMidnightblue,
    paddingVertical: Padding.p_base,
    alignItems: 'center',
    margin: Padding.p_base,
    borderRadius: 1,
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
  runButtonText: {
    color: Color.sparklightWhite,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FontFamily.openSansRegular,
  },
  cancelButton: {
    paddingVertical: Padding.p_base,
    alignItems: 'center',
    margin: Padding.p_base,
    borderRadius: 1,
  },
  cancelButtonText: {
    color: Color.colorMidnightblue,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FontFamily.openSansRegular,
  },
});

export default ModemSpeedTest;
