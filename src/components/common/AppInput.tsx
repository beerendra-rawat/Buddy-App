import React from 'react';

import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';

import { COLORS } from '../../constants/colors';

type Props = TextInputProps & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
};

export default function AppInput({
    leftIcon,
    rightIcon,
    style,
    ...props
}: Props) {

    return (

        <View style={styles.container}>

            {leftIcon}

            <TextInput
                placeholderTextColor={
                    COLORS.textSecondary
                }
                style={[
                    styles.input,
                    style,
                ]}
                {...props}
            />

            {rightIcon}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        minHeight: 56,

        borderWidth: 1,
        borderColor:
            COLORS.border,

        borderRadius: 18,

        backgroundColor:
            COLORS.white,

        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,
    },

    input: {
        flex: 1,

        fontSize: 16,

        color:
            COLORS.textPrimary,

        paddingVertical: 14,
    },

});