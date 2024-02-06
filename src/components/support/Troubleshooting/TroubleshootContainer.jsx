import React, { useState, useEffect } from 'react';
import AccountOutages from './AccountOutages';
import OutagesAlert from './OutagesAlert';
import TroubleshootComponent from './TroubleshootComponent'
import ModemHealthy from './ModemHealthy';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Color, Padding, Border, FontSize, FontFamily } from "../../../../GlobalStyles";
const stepsData = [
    { title: "Let's resolve your issues.", description: "Performing a system check...", success: false, pageCount: null },
    { title: "Checking for outages in your area...", description: null, success: false, pageCount: 1 },
    { title: "No outages were detected in your area...", description: null, success: true, pageCount: 1 },
    { title: "Checking for account issues...", description: null, success: false, pageCount: 2 },
    { title: "No account issues were detected.", description: null, success: true, pageCount: 2 },
    { title: "Checking for service issues...", description: null, success: false, pageCount: 3 },
];

const TroubleshootContainer = () => {
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prevStep) => (prevStep === 6 ? 1 : prevStep + 1));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const step = stepsData[currentStep - 1];

    return (
        <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
            <ProfileSettingsHeader
                title="Troubleshooting"
                onPressBack={() => navigation.navigate('Notifications')}
                accessibilityLabel="Back to Account"
                accessibilityHint="Navigates back to the Notifications screen"
            />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: Padding.p_base, paddingVertical: Padding.p_5xl, marginBottom: "15%" }}>
                <TroubleshootComponent
                    step={currentStep}
                    title={step.title}
                    description={step.description}
                    success={step.success}
                    pageCount={step.pageCount}
                />
            </SafeAreaView>
            {/* <ScrollView contentContainerStyle={{ flex: 1 }} style={{ marginBottom: "15%", paddingHorizontal: Padding.p_base, paddingTop: Padding.p_5xl }}>
                <ModemHealthy
                    step={currentStep}
                    title={'No service issues were detected.'}
                    description={null}
                    success={true}
                    pageCount={3}
                />
            </ScrollView> */}
        </View>
    );
};

export default TroubleshootContainer;
