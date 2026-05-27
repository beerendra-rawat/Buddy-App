import React from 'react';

import {
    View,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import CustomInput from '../../components/auth/CustomInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function ForgetPasswordScreen({
    navigation,
}: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >

                <BackButton
                    onPress={() => navigation.goBack()}
                />

                <View style={styles.content}>

                    <AuthHeader
                        title="Forgot Password"
                        subtitle="Please enter your email address to reset your password"
                    />

                    <CustomInput
                        label="Your Email"
                        placeholder="contact@dscodetech.com"
                        keyboardType="email-address"
                    />

                    <PrimaryButton
                        title="Reset Password"
                        onPress={() => navigation.navigate('VerifyCode')}
                    />

                </View>

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

    content: {
        marginTop: 24,
    },

});