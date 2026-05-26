import { View, Text, StyleSheet } from 'react-native';

export default function FriendScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Friends Screen</Text>
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