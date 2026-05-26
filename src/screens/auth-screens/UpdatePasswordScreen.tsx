import React from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdatePasswordScreen({ navigation }: any) {

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

                {/* Heading */}
                <View style={styles.headingContainer}>

                    <Text style={styles.title}>
                        Set a new password
                    </Text>

                    <Text style={styles.subtitle}>
                        Create a new password. Ensure it differs from
                        previous ones for security
                    </Text>

                </View>

                {/* Password Field */}
                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        Password
                    </Text>

                    <View style={styles.passwordWrapper}>

                        <TextInput
                            placeholder="••••••••••"
                            placeholderTextColor="#A5A5A5"
                            secureTextEntry
                            style={styles.input}
                        />

                        <TouchableOpacity>
                            <Image
                                source={require('../../assets/img/eye.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* Confirm Password */}
                <View style={styles.inputContainer}>

                    <Text style={styles.label}>
                        Confirm Password
                    </Text>

                    <View style={styles.passwordWrapper}>

                        <TextInput
                            placeholder="••••••••••"
                            placeholderTextColor="#A5A5A5"
                            secureTextEntry
                            style={styles.input}
                        />

                        <TouchableOpacity>
                            <Image
                                source={require('../../assets/img/eye.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* Button */}
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={()=> navigation.navigate("Success")}
                >
                    <Text style={styles.buttonText}>
                        Update Password
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

        marginTop: 8,
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

    headingContainer: {
        marginBottom: 34,
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

        lineHeight: 28,

        fontWeight: '500',

        paddingRight: 8,
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',

        marginBottom: 10,
    },

    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: '#FFFFFF',

        borderWidth: 1.5,
        borderColor: '#E5E7EB',

        borderRadius: 18,

        paddingHorizontal: 18,
    },

    input: {
        flex: 1,

        paddingVertical: 18,

        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },

    eyeIcon: {
        width: 22,
        height: 22,

        tintColor: '#C7C7C7',
        resizeMode: 'contain',
    },

    button: {
        backgroundColor: '#6487E8',

        paddingVertical: 18,

        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 12,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

});