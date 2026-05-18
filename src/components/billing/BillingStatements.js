import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Touchable from "../common/customui/Touchable";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SparkLightDropdown from "../common/customui/SparkLightDropdown";
import moment from "moment";
import Icon from "../common/Icon";
import NotificationAlert from "../common/customui/NotificationAlert";
import PDFViewModal from "../utility/PDFViewModal";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { fetchBillingStatements, downloadStatement, setSelectedYear, setSortDirection, clearDownloadedStatement } from "../../redux/actions/billingStatementActions";
import { selectFilteredAndSortedStatements, selectLoading, selectError, selectDownloading, selectDownloadError, selectSelectedYear, selectSortDirection, selectAllStatements, selectDownloadedStatement } from "../../redux/selectors/billingStatementSelectors";
import SmallLoader from "../common/customui/SmallLoader";
const CLEAR_BILLING_ERROR = 'CLEAR_BILLING_ERROR';
const CLEAR_DOWNLOAD_ERROR = 'CLEAR_DOWNLOAD_ERROR';

const BillingStatementsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [yearOptions, setYearOptions] = useState([]);
  const [downloadingStatementId, setDownloadingStatementId] = useState(null);
  // Local state to control error visibility
  const [showFetchError, setShowFetchError] = useState(false);
  const [showDownloadError, setShowDownloadError] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  
  // Get state from Redux store
  const statements = useSelector(selectFilteredAndSortedStatements);
  const allStatements = useSelector(selectAllStatements);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const downloading = useSelector(selectDownloading);
  const downloadError = useSelector(selectDownloadError);
  const selectedYear = useSelector(selectSelectedYear);
  const sortDirection = useSelector(selectSortDirection);
  const downloadedStatement = useSelector(selectDownloadedStatement);
  
  // Generate year options based on statements data
  useEffect(() => {
    if (allStatements && allStatements.length > 0) {
      // Extract years from statement dates and remove duplicates
      const years = [...new Set(allStatements.map(item => 
        moment(item.date).format('YYYY')
      ))].sort((a, b) => b - a); // Sort in descending order
      
      setYearOptions(years);
    } else {
      // If no statements, just use current year
      setYearOptions([moment().format('YYYY')]);
    }
  }, [allStatements]);
  
  // Fetch billing statements when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchBillingStatements());
      dispatch(clearDownloadedStatement()); // Clear downloaded statement when component is mounted
    }, [dispatch])
  );

  // Update local error state when Redux errors change
  useEffect(() => {
    setShowFetchError(!!error);
    setShowDownloadError(!!downloadError);
  }, [error, downloadError]);

  // Clear errors and reset downloaded statement when component unmounts
  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_BILLING_ERROR });
      dispatch({ type: CLEAR_DOWNLOAD_ERROR });
      dispatch(clearDownloadedStatement());
    };
  }, [dispatch]);

  // Show PDF modal when downloaded statement changes
  useEffect(() => {
    if (downloadedStatement) {
      setPdfData(downloadedStatement.fileBinary);
      setShowPDFModal(true);
      setDownloadingStatementId(null); // Reset downloading statement ID
    }
  }, [downloadedStatement]);
  
  // Handle closing fetch error notification
  const handleCloseFetchError = useCallback(() => {
    setShowFetchError(false);
    dispatch({ type: CLEAR_BILLING_ERROR });
  }, [dispatch]);

  // Handle closing download error notification
  const handleCloseDownloadError = useCallback(() => {
    setShowDownloadError(false);
    dispatch({ type: CLEAR_DOWNLOAD_ERROR });
  }, [dispatch]);

  // Handle closing PDF modal
  const handleClosePDFModal = () => {
    setShowPDFModal(false);
    dispatch(clearDownloadedStatement());
  };

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    dispatch(setSortDirection(newDirection));
  };

  // Function to handle download action
  const handleDownload = (item) => {
    setDownloadingStatementId(item.id); // Set the currently downloading statement ID
    dispatch(downloadStatement(item.id));
  };

  // Function to handle year selection
  const handleYearChange = (year) => {
    dispatch(setSelectedYear(year));
  };

  // Render each billing statement item
  const renderStatementItem = ({ item, index }) => {
    // Alternate background color for rows
    const backgroundColor = index % 2 === 0 ? Color.sparklightWhite :  '#F8F8F8';
    const isDownloading = downloading && downloadingStatementId === item.id;

    return (
      <Touchable
        minSize={0}
        style={[styles.statementRow, { backgroundColor }]}
        onPress={() => handleDownload(item)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Billing statement from ${moment(item.date).format("YYYY-MM-DD")}, tap to download`}
        disabled={isDownloading}
      >
        <Text
          style={styles.statementDate}
        >
          {moment(item.date).format("YYYY-MM-DD")}
        </Text>
        <View style={styles.iconButtonsContainer}>
          {isDownloading ? (
            <View style={styles.downloadingContainer}>
              <SmallLoader />
            </View>
          ) : (
            <Text style={styles.uploadText}>Download</Text>
          )}
        </View>
      </Touchable>
    );
  };

  return (
    <View style={styles.account} accessibilityLabel="Billing Statements screen">
      <ProfileSettingsHeader
        title="Billing Statements"
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.contentContainer}>
        {/* Display error notifications with proper spacing */}
        <View style={styles.notificationsContainer}>
          {error && showFetchError && (
            <NotificationAlert
              type="error"
              title="Error"
              message="Failed to load statements. Please try again."
              onClose={handleCloseFetchError}
              isVisible={true}
              autoFocusTitle={true}
            />
          )}
          
          {downloadError && showDownloadError && (
            <NotificationAlert
              type="error"
              title="Download Error"
              message="Failed to download statement. Please try again."
              onClose={handleCloseDownloadError}
              isVisible={true}
              autoFocusTitle={true}
            />
          )}
        </View>
        
        <View style={styles.yearSelectorContainer}>
          <Text style={styles.yearLabel}>Year</Text>
          <View style={styles.controlsRow}>
            <View style={styles.dropdownContainer}>
              <SparkLightDropdown
                items={yearOptions}
                selectedValue={selectedYear}
                onValueChange={handleYearChange}
                style={styles.yearDropdown}
                dropDownStyle={styles.yearDropdownStyle}
                isDropDownOpen={() => {}}
                dropdownTitle="Select Year"
                accessibilityItemName="year"
                placeholder="Select year"
              />
            </View>

            <Touchable
              style={styles.sortButton}
              onPress={toggleSortDirection}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Sort by billing date"
              accessibilityHint={`Currently sorted ${
                sortDirection === "asc" ? "ascending" : "descending"
              }, tap to reverse sort order`}
            >
              <Text style={styles.sortText}>Sort date</Text>
              <Icon
                name="double-arrow"
                size={30}
                style={{
                  transform: [{ rotate: sortDirection === "asc" ? "0deg" : "180deg" }]
                }}
              />
            </Touchable>
          </View>
        </View>

        {loading ? (
          <LoadingOverlay
            loading={loading}/>
        ) : statements.length > 0 ? (
          <FlatList
            data={statements}
            renderItem={renderStatementItem}
            keyExtractor={(item) => item.id}
            style={styles.statementsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No records found
            </Text>
          </View>
        )}
      </View>

      {showPDFModal && (
        <PDFViewModal
          url={pdfData}
          onClose={handleClosePDFModal}
          title="Billing Statement"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Padding.p_5xl,

    marginBottom: hp("8%"),
  },
  notificationsContainer: {
    marginBottom: 16, // Add 16px spacing between notifications and Year label
  },
  yearSelectorContainer: {
    marginBottom: 24,
    gap: 10,
  },
  yearLabel: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontWeight: "700",
    paddingLeft: 5,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 32,
  },
  yearDropdown: {
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
  },
  yearDropdownStyle: {
    backgroundColor: Color.sparklightWhite,
    minHeight: A11Y.minTouch,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    minHeight: A11Y.minTouch,
    paddingHorizontal: Padding.p_5xs,
  },
  sortText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginRight: 1,
  },
  statementsList: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    marginBottom: 20,
  },
  statementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: Padding.p_base,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_300,
  },
  statementDate: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  iconButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginLeft: 15,
  },
  uploadText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.sparklightBrightPurple,
    marginRight: 5,
    textDecorationLine: 'underline', // Add underline to the text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
  },
  errorContainer: {
    padding: 10,
    backgroundColor: "#FFDDDD",
    borderRadius: Border.br_5xs,
    marginBottom: 10,
  },
  errorText: {
    color: "#FF0000",
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  emptyContainer: {
    backgroundColor: Color.sparklightWhite,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 4,
    height: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    textAlign: "center",
  },
  downloadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90, // Match the width of Download text + icon for consistent layout
  },
});

export default BillingStatementsScreen;