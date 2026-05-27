import React from 'react';

import {
    View,
    StyleSheet,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function UpdatePasswordScreen({
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
                            title="Set a new password"
                            subtitle="Create a new password. Ensure it differs from previous ones for security."
                        />

                        {/* Password */}
                        <PasswordInput
                            label="Password"
                        />

                        {/* Confirm Password */}
                        <PasswordInput
                            label="Confirm Password"
                        />

                        {/* Button */}
                        <PrimaryButton
                            title="Update Password"
                            onPress={() =>
                                navigation.navigate('Success')
                            }
                        />

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

});