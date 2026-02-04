import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { dataUsageTabs } from "../../../../styles/compositions";

const HistoricalUsageTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "daily", label: "Daily Usage" },
    { id: "monthly", label: "Monthly Usage" }
  ];

  return (
    <View style={styles.container}>
      <Text
        style={styles.sectionTitle}
        accessible={true}
        accessibilityRole="header"
        accessibilityLevel={2}
      >
        Historical Usage
      </Text>
      
      <View
        style={styles.tabsContainer}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <Pressable
              key={tab.id}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.activeTab,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => onTabChange(tab.id)}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              accessibilityHint={isActive ? `Selected. Showing ${tab.label.toLowerCase()} data` : `Double tap to view ${tab.label.toLowerCase()} data`}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText
                ]}
                accessible={false}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: dataUsageTabs.container,
  sectionTitle: dataUsageTabs.sectionTitle,
  tabsContainer: dataUsageTabs.tabsContainer,
  tab: dataUsageTabs.tab,
  activeTab: dataUsageTabs.activeTab,
  tabText: dataUsageTabs.tabText,
  activeTabText: dataUsageTabs.activeTabText,
});

export default HistoricalUsageTabs;