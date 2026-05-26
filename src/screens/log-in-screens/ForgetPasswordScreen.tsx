import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgetPasswordScreen({ navigation }: any) {

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

                {/* Content */}
                <View style={styles.content}>

                    {/* Heading */}
                    <View style={styles.headingContainer}>

                        <Text style={styles.title}>
                            Forgot Password
                        </Text>

                        <Text style={styles.subtitle}>
                            Please enter your email address to reset your password
                        </Text>

                    </View>

                    {/* Input Section */}
                    <View style={styles.formContainer}>

                        <Text style={styles.label}>
                            Your Email
                        </Text>

                        <TextInput
                            placeholder="contact@dscodetech.com"
                            placeholderTextColor="#A0A4AB"
                            keyboardType="email-address"
                            style={styles.input}
                        />

                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate('VerifyCode' as never)}
                    >
                        <Text style={styles.buttonText}>
                            Reset Password
                        </Text>
                    </TouchableOpacity>

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
        marginTop: 32,
    },

    headingContainer: {
        marginBottom: 34,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D2433',
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 15,
        color: '#8B93A7',
        lineHeight: 22,
        fontWeight: '500',
        paddingRight: 20,
    },

    formContainer: {
        marginBottom: 28,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
        marginLeft: 2,
    },

    input: {
        backgroundColor: '#FFFFFF',

        borderWidth: 1.4,
        borderColor: '#E5E7EB',

        borderRadius: 16,

        paddingVertical: 16,
        paddingHorizontal: 18,

        fontSize: 15,
        color: '#111827',
    },

    button: {
        backgroundColor: '#6487E8',

        paddingVertical: 17,

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