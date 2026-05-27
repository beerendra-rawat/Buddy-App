import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import CustomInput from '../../components/auth/CustomInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import SocialButton from '../../components/auth/SocialButton';
import AuthTabs from '../../components/auth/AuthTabs';

export default function SignInScreen({
    navigation,
}: any) {

    return (
        <SafeAreaView
            edges={['top']}
            style={styles.container}
        >

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FAFAFA"
            />

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
                style={{ flex: 1 }}
            >

                {/* Tabs */}
                <AuthTabs
                    activeTab="signin"
                    onSignInPress={() =>
                        navigation.navigate('SignIn')
                    }
                    onSignUpPress={() =>
                        navigation.navigate('SignUp')
                    }
                />

                {/* Form */}
                <View style={styles.formContainer}>

                    <CustomInput
                        label="Your Email"
                        placeholder="contact@dscodetech.com"
                        keyboardType="email-address"
                    />

                    <PasswordInput
                        label="Password"
                    />

                    {/* Forgot Password */}
                    <TouchableOpacity
                        style={styles.forgotContainer}
                        onPress={() =>
                            navigation.navigate('ForgetPassword')
                        }
                    >
                        <Text style={styles.forgotText}>
                            Forgot password?
                        </Text>
                    </TouchableOpacity>

                    {/* Button */}
                    <PrimaryButton
                        title="Continue"
                        onPress={() =>
                            navigation.navigate('MainTabs')
                        }
                    />

                    {/* Divider */}
                    <View style={styles.dividerContainer}>

                        <View style={styles.divider} />

                        <Text style={styles.orText}>
                            Or
                        </Text>

                        <View style={styles.divider} />

                    </View>

                    {/* Social Buttons */}
                    <SocialButton
                        icon={require('../../assets/img/apple.png')}
                        title="Login with Apple"
                    />

                    <SocialButton
                        icon={require('../../assets/img/google.png')}
                        title="Login with Google"
                    />

                    {/* Bottom */}
                    <View style={styles.bottomContainer}>

                        <Text style={styles.bottomText}>
                            Don’t have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('SignUp')
                            }
                        >
                            <Text style={styles.signUpText}>
                                {' '}Sign up
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 24,
    },

    formContainer: {
        flex: 1,
    },

    forgotContainer: {
        alignItems: 'flex-end',
        marginTop: 2,
        marginBottom: 28,
    },

    forgotText: {
        color: '#4F7CF7',
        fontSize: 14,
        fontWeight: '600',
    },

    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },

    orText: {
        marginHorizontal: 14,
        color: '#A0A0A0',
        fontSize: 13,
        fontWeight: '600',
    },

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 28,
    },

    bottomText: {
        color: '#9B9B9B',
        fontSize: 14,
        fontWeight: '500',
    },

    signUpText: {
        color: '#4F7CF7',
        fontSize: 14,
        fontWeight: '700',
    },

});