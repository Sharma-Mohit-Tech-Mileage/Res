import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ProgressCircle } from "react-native-svg-charts";
import colors from "../../res/Colors";
import RightArrow from "../../res/svgIcons/RightArrow";
import { FontFamily } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";
import MyPlanDetails from '../common/MyPlanDetails';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const DataUsageComponent = ({ navigation, data, plans, tvPlan, phonePlan }) => {
  const [progress, setProgress] = useState(0.0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [isUnlimitedPlan, setIsUnlimitedPlan] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (data) {
      const totalUsedGB = typeof data.totalUsedGB === "number" ? Math.round(data.totalUsedGB) : 0;
      const planData = typeof data.dataPlanGB === "number" ? Math.round(data.dataPlanGB) : 0;

      setTotalUsed(totalUsedGB);
      setIsUnlimitedPlan(planData === 15000);

      const progressValue = planData > 0 ? Math.round((totalUsedGB / planData) * 100 * 10) / 10 : 0;
      setProgress(progressValue / 100);
    } else {
      getDataUsage();
    }

    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, [data]);

  return (
    <View style={styles.container}>
      <ProgressCircle
        style={styles.progressCircle}
        progress={progress}
        progressColor={colors.sparklight_bright_purple}
        backgroundColor={colors.light_grey}
        cornerRadius={5}
        strokeWidth={12}
        startAngle={-Math.PI * 0.85}
        endAngle={Math.PI * 0.85}
      >
        <View style={styles.centeredView}>
          <View style={styles.rowCenteredView}>
            <Text style={styles.dataText}>{totalUsed}</Text>
            <Text style={[styles.dataText, styles.dataTextSmall]}>GB used</Text>
          </View>
          <Text
            style={styles.dateText}
            accessible={false}
            importantForAccessibility="no"
          >
            {''}
          </Text>
          <Text
            style={styles.dateText}
            accessible={false}
            importantForAccessibility="no"
          >
            {''}
          </Text>
        </View>
      </ProgressCircle>

      <TouchableOpacity
        accessible={true}
        accessibilityLabel={`Plan Details`}
        accessibilityRole="button"
        onPress={() => {
          setShowComment(true);
        }}
        style={[
          styles.dataPlanBorder,
          {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [
              { translateX: -55 },
              { translateY: -45 },
            ],
          },
        ]}
      >
        <Text style={styles.dataPlanTxt}>Plan Details</Text>
      </TouchableOpacity>

      <View style={styles.usageInfoContainer}>
        <View style={styles.rowCenteredView}>
          <View style={styles.dataUsageIndicator} />
          <Text style={styles.useLbl}>Used</Text>
          <Text style={styles.useDataLbl}>{` ${totalUsed} GB`}</Text>
        </View>
        <View style={styles.rowCenteredView}>
          <View style={[styles.dataUsageIndicator, styles.remainingIndicator]} />
          <Text style={styles.useLbl}>Remaining</Text>
          <Text style={styles.useDataLbl}>
            {plans[0]?.unlimited ? " Unlimited" : ` ${typeof data?.remainingGB === "number" ? Math.round(data.remainingGB) : 0} GB`}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <TouchableOpacity
        accessible={true}
        accessibilityLabel={`Historical Data Usage`}
        accessibilityRole="button"
        onPress={() => {
          navigation.navigate("ArticalWindowUtility", {
            url: `${Env.URL}/services/internet/internet-usage`,
            name: "Historical Data Usage",
          });
        }}
        style={styles.upgradeButton}
      >
        <Text style={styles.upgradeButtonText}>Historical Data Usage</Text>
        <RightArrow style={styles.rightArrow} />
      </TouchableOpacity>
      <MyPlanDetails
        showComment={showComment}
        setShowComment={setShowComment}
        plans={plans}
        tvPlan={tvPlan}
        phonePlan={phonePlan}
        accessible={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 16,
  },
  progressCircle: {
    height: 246,
  },
  centeredView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  rowCenteredView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dataText: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  dataTextSmall: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "400",
  },
  dateText: {
    color: colors.dark_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 14,
    marginTop: 10,
  },
  dataPlanBorder: {
    borderWidth: 1,
    borderColor: colors.sparklight_bright_purple,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
    elevation: 1,
  },
  dataPlanTxt: {
    color: colors.sparklight_bright_purple,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  usageInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginHorizontal: 16,
  },
  dataUsageIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.sparklight_bright_purple,
    borderWidth: 2,
    borderColor: "white",
    marginLeft: 5,
  },
  remainingIndicator: {
    backgroundColor: colors.backgound_blue,
    marginLeft: 5,
  },
  useLbl: {
    color: colors.dark_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    marginLeft: 5,
  },
  useDataLbl: {
    color: "#001321",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  separator: {
    backgroundColor: "#F4F4F5",
    height: 2,
    marginTop: 16,
  },
  upgradeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp('6%'),
    paddingTop: 10,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
    fontFamily: FontFamily.openSansRegular,
  },
  rightArrow: {
    marginTop: 5,
  },
});

export default DataUsageComponent;
