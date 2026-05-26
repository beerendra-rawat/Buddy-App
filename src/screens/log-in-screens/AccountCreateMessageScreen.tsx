import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountCreateMessageScreen({ navigation }: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            {/* Main Content */}
            <View style={styles.content}>

                {/* Success Icon */}
                <View style={styles.iconContainer}>

                    <Image
                        source={require('../../assets/img/check.png')}
                        style={styles.icon}
                    />

                </View>

                {/* Title */}
                <Text style={styles.title}>
                    Account Created
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Congratulations! Your account has been created successfully.
                    Click to continue.
                </Text>

                {/* Button */}
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text style={styles.buttonText}>
                        Continue
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 24,
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 70,
    },

    iconContainer: {
        width: 120,
        height: 120,

        borderRadius: 60,

        backgroundColor: '#EEF4FF',

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 36,
    },

    icon: {
        width: 58,
        height: 58,

        resizeMode: 'contain',
        tintColor: '#6487E8',
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1D2433',

        marginBottom: 18,
    },

    subtitle: {
        fontSize: 16,
        color: '#8B93A7',

        textAlign: 'center',

        lineHeight: 28,

        fontWeight: '500',

        paddingHorizontal: 8,

        marginBottom: 42,
    },

    button: {
        width: '100%',

        backgroundColor: '#6487E8',

        paddingVertical: 18,

        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#6487E8',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 12,

        elevation: 5,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

});