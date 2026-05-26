import React from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function PasswordResetScreen({ navigation }: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require('../../assets/img/leftArrow.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.content}>

                {/* Title */}
                <Text style={styles.title}>
                    Password reset
                </Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Your password has been successfully reset.
                    click confirm to set a new password
                </Text>

                {/* Confirm Button */}
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={()=> navigation.navigate("updatepassword")}
                    
                >
                    <Text style={styles.buttonText}>
                        Confirm
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

    backButton: {
        width: 48,
        height: 48,

        borderRadius: 16,

        backgroundColor: '#EEF0F4',

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 10,
    },

    backIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#1F2937',
    },

    content: {
        marginTop: 34,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D2433',

        marginBottom: 14,
    },

    subtitle: {
        fontSize: 15,
        color: '#8B93A7',

        lineHeight: 30,

        fontWeight: '500',

        paddingRight: 10,

        marginBottom: 34,
    },

    button: {
        backgroundColor: '#6487E8',

        paddingVertical: 18,

        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

});