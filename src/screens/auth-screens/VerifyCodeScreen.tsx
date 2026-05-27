import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import OTPInput from '../../components/auth/OTPInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function VerifyCodeScreen({
    navigation,
}: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
                style={{ flex: 1 }}
            >

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >

                    {/* Back Button */}
                    <BackButton
                        onPress={() => navigation.goBack()}
                    />

                    {/* Content */}
                    <View style={styles.content}>

                        {/* Header */}
                        <AuthHeader
                            title="Check your email"
                            subtitle="We sent a reset link to contact@dscode...com. Enter the 5 digit code mentioned in the email."
                        />

                        {/* OTP */}
                        <OTPInput />

                        {/* Button */}
                        <PrimaryButton
                            title="Verify Code"
                            onPress={() =>
                                navigation.navigate('PasswordReset')
                            }
                        />

                        {/* Bottom */}
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

                </ScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',

        paddingHorizontal: 24,
    },

    scrollContainer: {
        paddingBottom: 40,
    },

    content: {
        marginTop: 24,
    },

    bottomContainer: {
        flexDirection: 'row',

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 6,
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