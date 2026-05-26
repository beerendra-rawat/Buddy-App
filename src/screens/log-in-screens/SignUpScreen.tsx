import React from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen({ navigation }: any) {

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

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
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

                    {/* Heading */}
                    <View style={styles.headingContainer}>

                        <Text style={styles.title}>
                            Create Account
                        </Text>

                        <Text style={styles.subtitle}>
                            Create your account and start chatting with your friends
                        </Text>

                    </View>

                    {/* Full Name */}
                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Full Name
                        </Text>

                        <TextInput
                            placeholder="Enter your full name"
                            placeholderTextColor="#A0A4AB"
                            style={styles.input}
                        />

                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Email Address
                        </Text>

                        <TextInput
                            placeholder="Enter your email"
                            placeholderTextColor="#A0A4AB"
                            keyboardType="email-address"
                            style={styles.input}
                        />

                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Create Password
                        </Text>

                        <View style={styles.passwordWrapper}>

                            <TextInput
                                placeholder="••••••••••"
                                placeholderTextColor="#A0A4AB"
                                secureTextEntry
                                style={styles.passwordInput}
                            />

                            <TouchableOpacity>
                                <Image
                                    source={require('../../assets/img/eye.png')}
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                    {/* Phone */}
                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Phone Number
                        </Text>

                        <TextInput
                            placeholder="+91 9876543210"
                            placeholderTextColor="#A0A4AB"
                            keyboardType="phone-pad"
                            style={styles.input}
                        />

                    </View>

                    {/* Create Button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.9}
                        onPress={()=> navigation.navigate("Message")}
                    >
                        <Text style={styles.buttonText}>
                            Create Account
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom Text */}
                    <View style={styles.bottomContainer}>

                        <Text style={styles.bottomText}>
                            Already have an account?
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignIn')}
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

    flex: {
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 24,
    },

    scrollContainer: {
        paddingBottom: 40,
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

    headingContainer: {
        marginTop: 34,
        marginBottom: 34,
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1D2433',

        marginBottom: 12,
    },

    subtitle: {
        fontSize: 15,
        color: '#8B93A7',

        lineHeight: 26,

        fontWeight: '500',

        paddingRight: 20,
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',

        marginBottom: 10,
        marginLeft: 2,
    },

    input: {
        backgroundColor: '#FFFFFF',

        borderWidth: 1.5,
        borderColor: '#E5E7EB',

        borderRadius: 18,

        paddingVertical: 18,
        paddingHorizontal: 18,

        fontSize: 15,
        color: '#111827',

        fontWeight: '500',
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

    passwordInput: {
        flex: 1,

        paddingVertical: 18,

        fontSize: 15,
        color: '#111827',

        fontWeight: '500',
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

        shadowColor: '#6487E8',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.18,
        shadowRadius: 10,

        elevation: 5,
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
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