import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import AppContainer from '../../components/common/AppContainer';

interface NotificationItem {
    id: string;
    userName: string;
    userImage: string;
    message: string;
    unread: boolean;
    group: string;
    time: string;
}

export default function NotificationScreen() {

    const notifications: NotificationItem[] = [
        {
            id: '1',
            userName: 'Rahul Sharma',
            userImage: 'https://i.pravatar.cc/150?img=11',
            message: 'sent you a message',
            unread: true,
            group: 'Today',
            time: '2m',
        },
        {
            id: '2',
            userName: 'Priya Singh',
            userImage: 'https://i.pravatar.cc/150?img=12',
            message: 'sent you a friend request',
            unread: true,
            group: 'Today',
            time: '10m',
        },
        {
            id: '3',
            userName: 'Aman Verma',
            userImage: 'https://i.pravatar.cc/150?img=13',
            message: 'accepted your friend request',
            unread: false,
            group: 'Yesterday',
            time: '',
        },
        {
            id: '4',
            userName: 'Neha Kapoor',
            userImage: 'https://i.pravatar.cc/150?img=14',
            message: 'replied to your message',
            unread: false,
            group: '2 Days Ago',
            time: '',
        },
        {
            id: '5',
            userName: 'Rohit Kumar',
            userImage: 'https://i.pravatar.cc/150?img=15',
            message: 'wants to connect with you',
            unread: false,
            group: '1 Week Ago',
            time: '',
        },
    ];

    const groupedData = useMemo(() => {

        const result: any[] = [];

        const groups = [...new Set(
            notifications.map(item => item.group)
        )];

        groups.forEach(group => {

            result.push({
                id: `header-${group}`,
                type: 'header',
                title: group,
            });

            notifications
                .filter(item => item.group === group)
                .forEach(item =>
                    result.push({
                        ...item,
                        type: 'item',
                    }),
                );
        });

        return result;

    }, []);

    const renderItem = ({ item }: any) => {

        if (item.type === 'header') {
            return (
                <Text style={styles.sectionTitle}>
                    {item.title}
                </Text>
            );
        }

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.notificationItem}
            >
                <Image
                    source={{ uri: item.userImage }}
                    style={styles.avatar}
                />

                <View style={styles.content}>

                    <View style={styles.topRow}>

                        <Text
                            numberOfLines={1}
                            style={styles.name}
                        >
                            {item.userName}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            {!!item.time && (
                                <Text style={styles.time}>
                                    {item.time}
                                </Text>
                            )}

                            {item.unread && (
                                <View
                                    style={styles.unreadDot}
                                />
                            )}
                        </View>

                    </View>

                    <Text style={styles.message}>
                        {item.message}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <AppContainer>
            <FlatList
                data={groupedData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: 12,
                }}
            />
        </AppContainer>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6B7280',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },

    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    name: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },

    message: {
        marginTop: 3,
        fontSize: 14,
        color: '#6B7280',
    },

    time: {
        fontSize: 12,
        color: '#9CA3AF',
        marginRight: 8,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2563EB',
    },

});