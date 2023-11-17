import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

const ArticleModal1 = ({ navigation }) => {
    const [progress, setProgress] = useState(0);
    const [isError, setIsError] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {progress < 1 && (
                <View style={styles.progressBar}>
                    <View style={{ ...styles.progress, width: `${progress * 100}%` }} />
                </View>
            )}
            <WebView
                source={{ uri: 'https://support.sparklight.com/hc/en-us/articles/115009159707-Data-Plans' }}
                onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
                onError={() => setIsError(true)}
            />
            {isError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load. Please try again later.</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        height: 3,
        backgroundColor: 'lightgrey',
    },
    progress: {
        height: '100%',
        backgroundColor: 'blue',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ArticleModal1;
