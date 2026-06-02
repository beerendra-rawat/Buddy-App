import React from 'react';

import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

type Props = {
    image?: string;
    size?: number;
};

export default function UserAvatar({
    image,
    size = 56,
}: Props) {

    if (image) {
        return (
            <Image
                source={{ uri: image }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                }}
            />
        );
    }

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                },
            ]}
        >
            <Ionicons
                name="person"
                size={size * 0.45}
                color="#FFFFFF"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: '#6487E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
});