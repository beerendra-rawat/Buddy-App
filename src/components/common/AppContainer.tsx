import React from 'react';

import {
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import { COLORS } from '../../constants/colors';

export default function AppContainer({
    children,
}: any) {

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            style={styles.container}
        >
            <StatusBar
                translucent={false}
                backgroundColor={COLORS.background}
                barStyle="dark-content"
            />

            <View style={styles.content}>
                {children}
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    content: {
        flex: 1,
    },
});