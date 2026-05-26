import React from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyCodeScreen({ navigation }: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.flex}
            >

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

                {/* Main Content */}
                <View style={styles.content}>

                    {/* Heading */}
                    <View style={styles.headingContainer}>

                        <Text style={styles.title}>
                            Check your email
                        </Text>

                        <Text style={styles.subtitle}>
                            We sent a reset link to
                            <Text style={styles.emailText}>
                                {' '}contact@dscode...com
                            </Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            enter 5 digit code that mentioned in the email
                        </Text>

                    </View>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>

                        <TextInput
                            style={styles.activeOtpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value="8"
                        />

                        <TextInput
                            style={styles.activeOtpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value="6"
                        />

                        <TextInput
                            style={styles.activeOtpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value="3"
                        />

                        <TextInput
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                        />

                        <TextInput
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                        />

                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.9}
                        onPress={()=> navigation.navigate("PasswordReset" as never)}
                    >
                        <Text style={styles.buttonText}>
                            Verify Code
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom Text */}
                    <View style={styles.bottomContainer}>

                        <Text style={styles.bottomText}>
                            Haven’t got the email yet?
                        </Text>

                        <TouchableOpacity>
                            <Text style={styles.resendText}>
                                {' '}Resend email
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    flex: {
        flex: 1,
    },

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
        lineHeight: 26,
        fontWeight: '500',
    },

    emailText: {
        color: '#3A3A3A',
        fontWeight: '700',
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },

    activeOtpInput: {
        width: 62,
        height: 62,

        borderWidth: 2,
        borderColor: '#6487E8',

        borderRadius: 16,

        backgroundColor: '#FFFFFF',

        textAlign: 'center',

        fontSize: 28,
        fontWeight: '700',
        color: '#444',
    },

    otpInput: {
        width: 62,
        height: 62,

        borderWidth: 1.5,
        borderColor: '#D8D8D8',

        borderRadius: 16,

        backgroundColor: '#FFFFFF',

        textAlign: 'center',

        fontSize: 26,
        fontWeight: '700',
        color: '#444',
    },

    button: {
        backgroundColor: '#6487E8',

        paddingVertical: 18,

        borderRadius: 16,

        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 34,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomText: {
        fontSize: 15,
        color: '#9AA0AA',
        fontWeight: '500',
    },

    resendText: {
        fontSize: 15,
        color: '#6487E8',
        fontWeight: '700',
    },

});