import React from 'react';

import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import { COLORS } from '../../constants/colors';

type Props = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export default function AppButton({
    title,
    onPress,
    loading = false,
    disabled = false,
}: Props) {

    return (

        <TouchableOpacity
            activeOpacity={0.8}
            style={[
                styles.button,

                disabled && {
                    opacity: 0.6,
                },
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >

            {
                loading ? (

                    <ActivityIndicator
                        color="#FFFFFF"
                    />

                ) : (

                    <Text style={styles.text}>
                        {title}
                    </Text>

                )
            }

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        height: 56,
        borderRadius: 18,

        backgroundColor:
            COLORS.primary,

        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

});