import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/auth-screens/SignInScreen';
import BottomTabs from './BottomTabs';
import ForgetPasswordScreen from '../screens/auth-screens/ForgetPasswordScreen';
import VerifyCodeScreen from '../screens/auth-screens/VerifyCodeScreen';
import PasswordResetScreen from '../screens/auth-screens/PasswordResetScreen';
import UpdatePasswordScreen from '../screens/auth-screens/UpdatePasswordScreen';
import SuccessfulMessageScreen from '../screens/auth-screens/SuccessfulMessageScreen';
import SignUpScreen from '../screens/auth-screens/SignUpScreen';
import AccountCreateMessageScreen from '../screens/auth-screens/AccountCreateMessageScreen';

const Stack = createNativeStackNavigator();

function SplashNavigator({ navigation }: { navigation: any }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('SignIn');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return <SplashScreen />;
}

export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashNavigator} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
                <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
                <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
                <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
                <Stack.Screen name="Success" component={SuccessfulMessageScreen} />
                <Stack.Screen name="Message" component={AccountCreateMessageScreen} />
                <Stack.Screen name="MainTabs" component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
