import React from 'react';

import {
    View,
    StyleSheet,
    StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function PasswordResetScreen({
    navigation,
}: any) {

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            {/* Back Button */}
            <BackButton
                onPress={() => navigation.goBack()}
            />

            {/* Content */}
            <View style={styles.content}>

                {/* Header */}
                <AuthHeader
                    title="Password reset"
                    subtitle="Your password has been successfully reset. Click confirm to set a new password."
                />

                {/* Button */}
                <PrimaryButton
                    title="Confirm"
                    onPress={() =>
                        navigation.navigate('UpdatePassword')
                    }
                />

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 24,
    },

    content: {
        marginTop: 24,
    },

});