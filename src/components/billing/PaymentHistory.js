import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import moment from "moment";
import Icon from "../common/Icon";
import { Hyperlink } from "../common/customui/Typography";
import NotificationAlert from "../common/customui/NotificationAlert";
import PDFViewModal from "../utility/PDFViewModal";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  fetchPaymentHistory,
  downloadPaymentReceipt,
  setSortDirection,
  setSearchQuery,
  loadMorePayments,
  clearDownloadedReceipt
} from "../../redux/actions/paymentHistoryActions";
import {
  selectDisplayedPayments,
  selectLoading,
  selectError,
  selectDownloading,
  selectDownloadError,
  selectSortDirection,
  selectSearchQuery,
  selectHasMore,
  selectDownloadedReceipt
} from "../../redux/selectors/paymentHistorySelectors";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import SmallLoader from "../common/customui/SmallLoader";
import AppStyles from "../../styles/AppStyles";

const CLEAR_PAYMENT_HISTORY_ERROR = 'CLEAR_PAYMENT_HISTORY_ERROR';
const CLEAR_DOWNLOAD_ERROR = 'CLEAR_DOWNLOAD_ERROR';

/**
 * Payment History Screen Component
 * Displays the user's payment history with search and sort functionality
 */
const PaymentHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [downloadingPaymentId, setDownloadingPaymentId] = useState(null);
  // Local state to control error visibility
  const [showFetchError, setShowFetchError] = useState(false);
  const [showDownloadError, setShowDownloadError] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  
  // Get state from Redux store
  const payments = useSelector(selectDisplayedPayments);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const downloading = useSelector(selectDownloading);
  const downloadError = useSelector(selectDownloadError);
  const sortDirection = useSelector(selectSortDirection);
  const searchQuery = useSelector(selectSearchQuery);
  const hasMore = useSelector(selectHasMore);
  const downloadedReceipt = useSelector(selectDownloadedReceipt);
  
  // Fetch payment history when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchPaymentHistory());
      dispatch(clearDownloadedReceipt()); // Clear downloaded receipt when component is mounted
    }, [dispatch])
  );

  // Update local error state when Redux errors change
  useEffect(() => {
    setShowFetchError(!!error);
    setShowDownloadError(!!downloadError);
  }, [error, downloadError]);

  // Clear errors and reset downloaded receipt when component unmounts
  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_PAYMENT_HISTORY_ERROR });
      dispatch({ type: CLEAR_DOWNLOAD_ERROR });
      dispatch(clearDownloadedReceipt());
    };
  }, [dispatch]);

  // Show PDF modal when downloaded receipt changes
  useEffect(() => {
    if (downloadedReceipt) {
      setPdfData(downloadedReceipt.fileBinary);
      setShowPDFModal(true);
      setDownloadingPaymentId(null); // Reset downloading payment ID
    }
  }, [downloadedReceipt]);
  
  // Handle closing fetch error notification
  const handleCloseFetchError = useCallback(() => {
    setShowFetchError(false);
    dispatch({ type: CLEAR_PAYMENT_HISTORY_ERROR });
  }, [dispatch]);

  // Handle closing download error notification
  const handleCloseDownloadError = useCallback(() => {
    setShowDownloadError(false);
    dispatch({ type: CLEAR_DOWNLOAD_ERROR });
  }, [dispatch]);

  // Handle closing PDF modal
  const handleClosePDFModal = () => {
    setShowPDFModal(false);
    dispatch(clearDownloadedReceipt());
  };

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    dispatch(setSortDirection(newDirection));
  };

  // Function to handle search input change
  const handleSearchChange = (text) => {
    dispatch(setSearchQuery(text));
  };

  // Function to handle load more
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(loadMorePayments());
    }
  };

  // Function to handle download receipt (if implemented)
  const handleDownloadReceipt = (paymentId) => {
    setDownloadingPaymentId(paymentId);
    dispatch(downloadPaymentReceipt(paymentId));
  };

  // Render payment item
  const renderPaymentItem = ({ item, index }) => {
    // Alternate background color for rows
    const backgroundColor = index % 2 === 0 ? Color.sparklightWhite :  '#F8F8F8';
    const isDownloading = downloading && downloadingPaymentId === item.extTransactionId;

    return (
      <View 
        style={[styles.paymentRow, { backgroundColor }]}
        accessible={true}
      >
        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Date</Text>
            <Text style={styles.detailValue}>
              {moment(item.pymtDate).format("MM/DD/YY")}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>
              ${parseFloat(item.pymtAmount).toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{item.pymtType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Confirmation ID</Text>
            <Text style={styles.detailValue}>{item.extTransactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>{item.pymtStatus}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render footer (load more button or loading indicator)
  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <Touchable
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={loading}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Load more payments"
      >
        {loading ? (
          <SmallLoader />
        ) : (
          <Hyperlink style={styles.hyperlink}>Load more</Hyperlink>
        )}
      </Touchable>
    );
  };

  return (
    <View style={styles.container} accessibilityLabel="Payment History screen">
      <ProfileSettingsHeader
        title="Payment History"
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.contentContainer}>
        {/* Display error notifications */}
        <View style={styles.notificationsContainer}>
          {error && showFetchError && (
            <NotificationAlert
              type="error"
              title="Error"
              message="Failed to load payment history. Please try again."
              onClose={handleCloseFetchError}
              isVisible={true}
              autoFocusTitle={true}
            />
          )}
          
          {downloadError && showDownloadError && (
            <NotificationAlert
              type="error"
              title="Download Error"
              message="Failed to download receipt. Please try again."
              onClose={handleCloseDownloadError}
              isVisible={true}
              autoFocusTitle={true}
            />
          )}
        </View>
        
        {/* Search and Sort */}
        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color={Color.sparklightWhite} style={styles.searchIcon} />
            <View style={{ flex: 1 }} accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Search by Confirmation ID, text field, double tap to edit">
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Confirmation ID"
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholderTextColor={Color.sparklightGray1}
              accessible={false}
              importantForAccessibility="no"
            />
            </View>
          </View>
          
          <View style={styles.sortContainer}>
            <Touchable
              style={styles.sortButton}
              onPress={toggleSortDirection}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="sort by payment date"
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

        {/* Payment History List */}
         <View style={{ flex: 1,...AppStyles.card }}>
        {loading && payments.length === 0 ? (
          <LoadingOverlay
          loading={loading}/>
        ) : payments.length > 0 ? (
          <FlatList
            data={payments}
            renderItem={renderPaymentItem}
            keyExtractor={(item, index) => item.extTransactionId + index}
            style={styles.paymentsList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onEndReached={null} // Remove automatic loading on end reach
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No records found
            </Text>
          </View>
        )}
        </View>
      </View>

      {showPDFModal && (
        <PDFViewModal
          url={pdfData}
          onClose={handleClosePDFModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray300,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Padding.p_base,
    marginBottom: hp("8%"),
  },
  notificationsContainer: {
    marginBottom: 16,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10, // Add some gap between the elements
  },
  searchContainer: {
    width: "65%", // Increased width from 48% to 65%
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.sparklightWhite,
    borderWidth: 1,
    borderColor: Color.sparklightGray1, // Changed from colorGainsboro_200 to sparklightGray1 for better visibility
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: A11Y.minTouch,
  },
  sortContainer: {
    width: "30%", // Adjusted to take the remaining width (after gap)
    alignItems: "flex-end", // Align content to the right side
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    minHeight: A11Y.minTouch,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Align items to the right
    minHeight: A11Y.minTouch,
    paddingHorizontal: Padding.p_5xs,
  },
  sortText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    marginRight: 1,
  },
  paymentsList: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    ...AppStyles.card, // Use card style from AppStyles
    marginBottom: 20,
  },
  paymentRow: {
    padding: Padding.p_base,
    borderBottomWidth: 1,
    borderBottomColor: Color.Gray300,
  },
  paymentDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    fontWeight: "700",
  },
  detailValue: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...AppStyles.card, // Use card style from AppStyles
  },
  emptyContainer: {
    ...AppStyles.card, // Use card style from AppStyles
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    textAlign: "center",
  },
  loadMoreButton: {
    alignItems: 'center',
    padding: Padding.p_xs,
    marginTop: 10,
    marginBottom: 20,
  },
  loadMoreText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    color: Color.sparklightPrimaryPurple,
    textDecorationLine: 'underline',
  },
});

export default PaymentHistoryScreen;