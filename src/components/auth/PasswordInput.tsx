import React, { useState } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

type Props = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
};

export default function PasswordInput({
    label,
    value,
    onChangeText,
}: Props) {

    const [secure, setSecure] = useState(true);

    return (
        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <View style={styles.wrapper}>

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secure}
                    placeholder="••••••••"
                    placeholderTextColor="#A0A4AB"
                    style={styles.input}
                />

                <TouchableOpacity
                    onPress={() => setSecure(!secure)}
                >
                    <Image
                        source={require('../../assets/img/eye.png')}
                        style={styles.eye}
                    />
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginBottom: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },

    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#FFFFFF',

        borderWidth: 1.5,
        borderColor: '#E5E7EB',

        borderRadius: 18,

        paddingHorizontal: 18,
    },

    input: {
        flex: 1,
        paddingVertical: 18,
        fontSize: 15,
    },

    eye: {
        width: 22,
        height: 22,
        tintColor: '#C7C7C7',
    },

});