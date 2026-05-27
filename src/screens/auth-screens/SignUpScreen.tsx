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
import CustomInput from '../../components/auth/CustomInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function SignUpScreen({
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

                    {/* Header */}
                    <AuthHeader
                        title="Create Account"
                        subtitle="Create your account and start chatting with your friends"
                    />

                    {/* Full Name */}
                    <CustomInput
                        label="Full Name"
                        placeholder="Enter your full name"
                    />

                    {/* Email */}
                    <CustomInput
                        label="Email Address"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                    />

                    {/* Password */}
                    <PasswordInput
                        label="Create Password"
                    />

                    {/* Phone */}
                    <CustomInput
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        keyboardType="phone-pad"
                    />

                    {/* Button */}
                    <PrimaryButton
                        title="Create Account"
                        onPress={() =>
                            navigation.navigate('Message')
                        }
                    />

                    {/* Bottom */}
                    <View style={styles.bottomContainer}>

                        <Text style={styles.bottomText}>
                            Already have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('SignIn')
                            }
                        >
                            <Text style={styles.signInText}>
                                {' '}Sign In
                            </Text>
                        </TouchableOpacity>

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

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 30,
    },

    bottomText: {
        fontSize: 15,
        color: '#8B93A7',
        fontWeight: '500',
    },

    signInText: {
        fontSize: 15,
        color: '#6487E8',
        fontWeight: '700',
    },

});