import * as React from 'react';
import { View } from 'react-native';
import supportScreen from './supportScreen';
import Article from './ArticleModal';

const WebView = () => {
    const [showWebView, setShowWebView] = React.useState(false);

    const handlePress = () => {
        console.log("clicked");
        setShowWebView(true);
    };

    return (
        <View style={{ flex: 1 }}>
            {showWebView ? <Article /> : <supportScreen onPress1={handlePress} />}
        </View>
    );
};

export default WebView;
