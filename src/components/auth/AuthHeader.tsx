import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

type Props = {
    title: string;
    subtitle: string;
};

export default function AuthHeader({
    title,
    subtitle,
}: Props) {

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.subtitle}>
                {subtitle}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginBottom: 34,
    },

    title: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1D2433',

        marginBottom: 12,
    },

    subtitle: {
        fontSize: 15,
        color: '#8B93A7',

        lineHeight: 26,
        fontWeight: '500',
    },

});