import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FAFAFA"
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                {/* Top Tabs */}
                <View style={styles.topTabContainer}>
                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => navigation.navigate('SignIn' as never)}
                    >
                        <Text style={styles.activeTabText}>
                            Log in
                        </Text>

                        <View style={styles.activeLine} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tabButton}
                        onPress={() => navigation.navigate('SignUp' as never)}
                    >
                        <Text style={styles.inactiveTabText}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Your Email
                        </Text>

                        <TextInput
                            placeholder="contact@dscodetech.com"
                            placeholderTextColor="#999"
                            style={styles.input}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Password
                        </Text>

                        <View style={styles.passwordWrapper}>
                            <TextInput
                                placeholder="••••••••••"
                                placeholderTextColor="#999"
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

                    {/* Forgot Password */}
                    <View style={styles.rowBetween}>
                        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword' as never)}>
                            <Text style={styles.forgotText}>
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity style={styles.continueButton}
                    onPress={() => navigation.navigate('MainTabs' as never)}
                    >   
                        <Text style={styles.continueText}>
                            Continue
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />

                        <Text style={styles.orText}>Or</Text>

                        <View style={styles.divider} />
                    </View>

                    {/* Apple Button */}
                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('../../assets/img/apple.png')}
                            style={styles.socialIcon}
                        />

                        <Text style={styles.socialText}>
                            Login with Apple
                        </Text>
                    </TouchableOpacity>

                    {/* Google Button */}
                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={require('../../assets/img/google.png')}
                            style={styles.socialIcon}
                        />

                        <Text style={styles.socialText}>
                            Login with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Bottom */}
                    <View style={styles.bottomContainer}>
                        <Text style={styles.bottomText}>
                            Don’t have an account?
                        </Text>

                        <TouchableOpacity 
                        onPress={()=> navigation.navigate("SignUp" as never)}>
                            <Text style={styles.signUpText}>
                                {' '}
                                Sign up
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

    topTabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 45,
        paddingHorizontal: 10,
    },

    tabButton: {
        flex: 1,
        alignItems: 'center',
    },

    activeTabText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4F7CF7',
        marginBottom: 10,
    },

    inactiveTabText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#B7B7B7',
    },

    activeLine: {
        width: 55,
        height: 3,
        backgroundColor: '#4F7CF7',
        borderRadius: 20,
    },

    formContainer: {
        flex: 1,
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginBottom: 10,
        marginLeft: 4,
    },

    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        fontSize: 15,
        color: '#111',
    },

    passwordWrapper: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 16,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    passwordInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 15,
        color: '#111',
    },

    eyeIcon: {
        width: 22,
        height: 22,
        tintColor: '#999',
        resizeMode: 'contain',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 28,
    },

    forgotText: {
        color: '#4F7CF7',
        fontSize: 14,
        fontWeight: '600',
    },

    continueButton: {
        backgroundColor: '#4F7CF7',
        paddingVertical: 17,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#4F7CF7',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,

        elevation: 4,
    },

    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
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

    socialButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    socialIcon: {
        width: 22,
        height: 22,
        marginRight: 12,
        resizeMode: 'contain',
    },

    socialText: {
        fontSize: 15,
        color: '#222',
        fontWeight: '600',
    },

    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 10,
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