import { useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
    createUserWithEmailAndPassword,
} from 'firebase/auth';

import {
    doc,
    setDoc,
} from 'firebase/firestore';

import { auth, db } from '../../services/firebase';

import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import CustomInput from '../../components/auth/CustomInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function SignUpScreen({ navigation }: any) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {

        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {

            setLoading(true);

            // Create account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            // Save user data in Firestore
            await setDoc(
                doc(db, 'users', user.uid),
                {
                    name,
                    email,
                    phone,
                    online: true,
                    createdAt: Date.now(),
                }
            );

            setLoading(false);

            Alert.alert(
                'Success',
                'Account created successfully'
            );

            navigation.navigate('Message');

        } catch (error: any) {

            setLoading(false);

            Alert.alert(
                'Signup Error',
                error.message
            );
        }
    };

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
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Email */}
                    <CustomInput
                        label="Email Address"
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password */}
                    <PasswordInput
                        label="Create Password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Phone */}
                    <CustomInput
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    {/* Button */}
                    <PrimaryButton
                        title={
                            loading
                                ? 'Creating Account...'
                                : 'Create Account'
                        }
                        onPress={handleSignUp}
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