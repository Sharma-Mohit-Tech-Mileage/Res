// CustomText.js
import React from 'react';
import { Text as RNText } from 'react-native';

const Text = ({ style, ...props }) => {
    return (
        <RNText style={style} {...props} maxFontSizeMultiplier={2}>
            {props.children}
        </RNText>
    );
};

export default Text;
