import { View, Text, StyleSheet } from 'react-native';

export default function NotificationScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>NotificationScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
    },
});