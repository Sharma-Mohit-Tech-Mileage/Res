import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import CheckStatusWrapper from './CheckStatusWrapper';

const DefaultCheck = ({ onComplete, step }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Let's resolve your issues.");

  return (
    <CheckStatusWrapper
      loading={loading}
      result={result}
      icon="TroubleshootIcon"
      description="Performing a system check"
      step={step}
      onComplete={onComplete}
      isFinished={true}
    />
  );
};

export default DefaultCheck;