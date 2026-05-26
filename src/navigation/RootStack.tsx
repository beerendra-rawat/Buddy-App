import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/log-in-screens/SignInScreen';
import BottomTabs from './BottomTabs';
import ForgetPasswordScreen from '../screens/log-in-screens/ForgetPasswordScreen';
import VerifyCodeScreen from '../screens/log-in-screens/VerifyCodeScreen';
import PasswordResetScreen from '../screens/log-in-screens/PasswordResetScreen';
import UpdatePasswordScreen from '../screens/log-in-screens/UpdatePasswordScreen';
import SuccessfulMessageScreen from '../screens/log-in-screens/SuccessfulMessageScreen';
import SignUpScreen from '../screens/log-in-screens/SignUpScreen';
import AccountCreateMessageScreen from '../screens/log-in-screens/AccountCreateMessageScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashNavigator} />

                <Stack.Screen name="SignIn" component={SignInScreen} />

                <Stack.Screen name="MainTabs" component={BottomTabs} />

                <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
                <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
                <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
                <Stack.Screen name="updatepassword" component={UpdatePasswordScreen} />
                <Stack.Screen name="Success" component={SuccessfulMessageScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Message" component={AccountCreateMessageScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

/* Splash Screen Navigation */
function SplashNavigator({ navigation }: any) {

    useEffect(() => {

        const timer = setTimeout(() => {

            navigation.replace('SignIn');

        }, 3000);

        return () => clearTimeout(timer);

    }, []);

    return <SplashScreen />;
}