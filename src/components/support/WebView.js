import * as React from 'react';
import { View } from 'react-native';
import SupportScreen from './supportScreen';
import Article from './ArticleModal';

const WebView = () => {
    const [showWebView, setShowWebView] = React.useState(false);
    const handlePress = () => {
        console.log("clicked");
        setShowWebView(true);
    };

    return (
        <View style={{ flex: 1 }}>
            {showWebView ? <Article /> : <SupportScreen onPress1={handlePress} />}
        </View>
    );
};

export default WebView;
