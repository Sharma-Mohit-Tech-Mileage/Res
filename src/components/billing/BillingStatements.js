import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SparkLightDropdown from "../common/customui/SparkLightDropdown";
import moment from "moment";
import Icon from "../common/Icon";

const BillingStatementsScreen = ({ navigation }) => {
  // State for the dropdown/year selector
  const [selectedYear, setSelectedYear] = useState("2023");
  const [sortDirection, setSortDirection] = useState("desc");

  // Available years for the dropdown
  const yearOptions = ["2025", "2024", "2023", "2022", "2021"];

  // Dummy data for billing statements (would come from API)
  const [billingStatements, setBillingStatements] = useState([
    { id: 1, date: "2025-02-08" },
    { id: 2, date: "2025-02-08" },
    { id: 3, date: "2025-02-08" },
    { id: 4, date: "2025-02-08" },
    { id: 5, date: "2025-02-08" },
    { id: 6, date: "2025-02-08" },
    { id: 7, date: "2025-02-08" },
    { id: 8, date: "2025-02-08" },
    { id: 9, date: "2025-02-01" },
  ]);

  // Fetch billing statements when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Here you would fetch billing statements from API
      // For now using dummy data
    }, [])
  );

  // Function to toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    // Sort the billing statements by date
    const sortedStatements = [...billingStatements].sort((a, b) => {
      if (newDirection === "asc") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

    setBillingStatements(sortedStatements);
  };

  // Function to handle download action
  const handleDownload = (item) => {
    // Will handle download functionality once API is available
    console.log(`Downloading statement from ${item.date}`);
  };

  // Function to handle upload action
  const handleUpload = (item) => {
    // Will handle upload functionality once API is available
    console.log(`Uploading statement from ${item.date}`);
  };

  // Render each billing statement item
  const renderStatementItem = ({ item, index }) => {
    // Alternate background color for rows
    const backgroundColor = index % 2 === 0 ? "#FFFAF0" : "#FFFFFF";

    return (
      <View style={[styles.statementRow, { backgroundColor }]}>
        <Text
          style={styles.statementDate}
          accessibilityLabel={`Statement date ${moment(item.date).format(
            "YYYY-MM-DD"
          )}`}
        >
          {moment(item.date).format("YYYY-MM-DD")}
        </Text>
        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handleUpload(item)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`download statement from ${moment(
              item.date
            ).format("YYYY-MM-DD")}`}
            accessibilityHint="download this billing statement"
          >
            <Text style={styles.uploadText}>Download</Text>
            <Icon name="upload" size={18} color={Color.sparklightBrightPurple} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.account} accessibilityLabel="Billing Statements screen">
      <ProfileSettingsHeader
        title="Billing Statements"
        iconAlignment="right"
        showIcon={false}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={styles.frameParent}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <Text
              accessibilityLabel="Billing statements icon"
              style={[styles.text, { alignSelf: "center" }]}
            >
              <Icon name="credit-card" size={43} color="#fff" />
            </Text>
          </View>
          <Text style={styles.melissaSmith}>Billing Statements</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.yearSelectorContainer}>
            <Text style={styles.yearLabel}>Year</Text>
            <View style={styles.controlsRow}>
              <View style={styles.dropdownContainer}>
                <SparkLightDropdown
                  items={yearOptions}
                  selectedValue={selectedYear}
                  onValueChange={(value) => setSelectedYear(value)}
                  style={styles.yearDropdown}
                  dropDownStyle={styles.yearDropdownStyle}
                  isDropDownOpen={() => {}}
                  dropdownTitle="Select Year"
                  accessibilityItemName="year"
                  placeholder="Select year"
                />
              </View>

              <TouchableOpacity
                style={styles.sortButton}
                onPress={toggleSortDirection}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Sort date"
                accessibilityHint={`Currently sorted ${
                  sortDirection === "asc" ? "ascending" : "descending"
                }, tap to reverse sort order`}
              >
                <Text style={styles.sortText}>Sort date</Text>
                <Icon name="double-arrow" size={26} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={billingStatements}
            renderItem={renderStatementItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.statementsList}
            showsVerticalScrollIndicator={false}
            accessible={true}
            accessibilityLabel="List of billing statements"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
    marginBottom: "10%",
  },
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  frameParent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  rightActionableParent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
  },
  melissaSmith: {
    fontSize: FontSize.size_3xl,
    width: 210,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 28,
    textAlign: "center",
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    marginTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_5xl,
  },
  yearSelectorContainer: {
    marginBottom: 15,
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
    alignItems: "center",
  },
  dropdownContainer: {
    flex: 1,
  },
  yearDropdown: {
    borderColor: Color.colorGainsboro_200,
    borderRadius: Border.br_5xs,
  },
  yearDropdownStyle: {
    backgroundColor: Color.sparklightWhite,
    height: 42,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  sortText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginRight: 5,
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
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  downloadText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.sparklightBrightPurple,
    marginRight: 5,
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
  },
});

export default BillingStatementsScreen;