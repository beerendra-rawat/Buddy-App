import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import {
    useNavigation,
} from '@react-navigation/native';

import UserAvatar from
    '../common/UserAvatar';

import {
    formatTime,
} from '../../utils/formatTime';

import {
    COLORS,
} from '../../constants/colors';

type Props = {
    item: {
        id: string;
        userId: string;
        name: string;
        image?: string;
        lastMessage?: string;
        lastMessageTime?: any;
        online?: boolean;
    };
};

export default function ChatItem({
    item,
}: Props) {

    const navigation =
        useNavigation<any>();

    return (

        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.container}
            onPress={() =>
                navigation.navigate(
                    'Message',
                    {
                        receiverId:
                            item.userId,

                        receiverName:
                            item.name,

                        receiverImage:
                            item.image,
                    }
                )
            }
        >

            {/* AVATAR */}

            <View style={styles.avatarWrapper}>

                <UserAvatar
                    image={item.image}
                    size={64}
                />

                {
                    item.online && (

                        <View
                            style={
                                styles.onlineDot
                            }
                        />

                    )
                }

            </View>

            {/* CONTENT */}

            <View style={styles.content}>

                {/* TOP */}

                <View style={styles.topRow}>

                    <Text
                        numberOfLines={1}
                        style={styles.name}
                    >
                        {item.name}
                    </Text>

                    <Text style={styles.time}>
                        {
                            formatTime(
                                item.lastMessageTime
                            )
                        }
                    </Text>

                </View>

                {/* MESSAGE */}

                <Text
                    numberOfLines={1}
                    style={styles.message}
                >
                    {
                        item.lastMessage ||
                        'Start chatting'
                    }
                </Text>

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 12,

        borderBottomWidth: 1,
        borderBottomColor:
            '#F3F4F6',
    },

    avatarWrapper: {
        position: 'relative',
    },

    onlineDot: {
        width: 15,
        height: 15,

        borderRadius: 8,

        backgroundColor:
            '#22C55E',

        position: 'absolute',

        bottom: 1,
        right: 1,

        borderWidth: 2,
        borderColor:
            COLORS.white,
    },

    content: {
        flex: 1,
        marginLeft: 14,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
    },

    name: {
        flex: 1,

        fontSize: 17,
        fontWeight: '700',

        color:
            COLORS.textPrimary,

        marginRight: 10,
    },

    time: {
        fontSize: 12,

        color:
            COLORS.textSecondary,
    },

    message: {
        marginTop: 4,

        fontSize: 14,

        color:
            COLORS.textSecondary,
    },

});