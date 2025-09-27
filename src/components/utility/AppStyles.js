import { StyleSheet } from 'react-native';

const AppStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 2,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 1.84,
        elevation: 2,
    },
});

export default AppStyles;