import React from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

type Props = {
    onPress: () => void;
};

export default function BackButton({
    onPress,
}: Props) {

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Image
                source={require('../../assets/img/leftArrow.png')}
                style={styles.icon}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        width: 48,
        height: 48,

        borderRadius: 16,

        backgroundColor: '#EEF0F4',

        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        width: 20,
        height: 20,

        resizeMode: 'contain',

        tintColor: '#1F2937',
    },

});