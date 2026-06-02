import {
    useEffect,
    useState,
} from 'react';

import {
    NavigationContainer,
} from '@react-navigation/native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
    onAuthStateChanged,
} from 'firebase/auth';

import {
    auth,
} from '../services/firebase';

import SplashScreen from '../screens/SplashScreen';

import SignInScreen from '../screens/auth-screens/SignInScreen';

import SignUpScreen from '../screens/auth-screens/SignUpScreen';

import ForgetPasswordScreen from '../screens/auth-screens/ForgetPasswordScreen';

import VerifyCodeScreen from '../screens/auth-screens/VerifyCodeScreen';

import PasswordResetScreen from '../screens/auth-screens/PasswordResetScreen';

import UpdatePasswordScreen from '../screens/auth-screens/UpdatePasswordScreen';

import SuccessfulMessageScreen from '../screens/auth-screens/SuccessfulMessageScreen';

import AccountCreateMessageScreen from '../screens/auth-screens/AccountCreateMessageScreen';

import BottomTabs from './BottomTabs';

import MessageScreen from '../screens/MessageScreen';

import Story from '../screens/Story';

const Stack =
    createNativeStackNavigator();

export default function RootStack() {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (
                    currentUser: any
                ) => {

                    setUser(
                        currentUser
                    );

                    setLoading(
                        false
                    );
                }
            );

        return unsubscribe;

    }, []);

    if (loading) {

        return <SplashScreen />;
    }

    return (

        <NavigationContainer>

            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >

                {user ? (

                    <>
                        {/* MAIN TABS */}

                        <Stack.Screen
                            name="MainTabs"
                            component={
                                BottomTabs
                            }
                        />

                        {/* MESSAGE */}

                        <Stack.Screen
                            name="Message"
                            component={
                                MessageScreen
                            }
                        />

                        {/* STORY */}

                        <Stack.Screen
                            name="Story"
                            component={
                                Story
                            }
                        />

                    </>

                ) : (

                    <>
                        <Stack.Screen
                            name="SignIn"
                            component={
                                SignInScreen
                            }
                        />

                        <Stack.Screen
                            name="SignUp"
                            component={
                                SignUpScreen
                            }
                        />

                        <Stack.Screen
                            name="ForgetPassword"
                            component={
                                ForgetPasswordScreen
                            }
                        />

                        <Stack.Screen
                            name="VerifyCode"
                            component={
                                VerifyCodeScreen
                            }
                        />

                        <Stack.Screen
                            name="PasswordReset"
                            component={
                                PasswordResetScreen
                            }
                        />

                        <Stack.Screen
                            name="UpdatePassword"
                            component={
                                UpdatePasswordScreen
                            }
                        />

                        <Stack.Screen
                            name="Success"
                            component={
                                SuccessfulMessageScreen
                            }
                        />

                        <Stack.Screen
                            name="AccountMessage"
                            component={
                                AccountCreateMessageScreen
                            }
                        />

                    </>

                )}

            </Stack.Navigator>

        </NavigationContainer>
    );
}