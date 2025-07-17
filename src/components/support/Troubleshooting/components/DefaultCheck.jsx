import React, {useState } from 'react';

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
      step={null}
      onComplete={onComplete}
      isFinished={true}
    />
  );
};

export default DefaultCheck;