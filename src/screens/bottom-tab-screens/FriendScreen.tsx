import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FriendRequestType = {
    id: string;
    name: string;
    image: string;
};

type FriendType = {
    id: string;
    name: string;
    image: string;
    active: boolean;
};

export default function FriendScreen() {
    const [search, setSearch] = useState('');

    const [friendRequests, setFriendRequests] =
        useState<FriendRequestType[]>([
            {
                id: '1',
                name: 'Rahul Sharma',
                image: 'https://i.pravatar.cc/150?img=11',
            },
            {
                id: '2',
                name: 'Priya Verma',
                image: 'https://i.pravatar.cc/150?img=12',
            },
        ]);

    const [friends, setFriends] = useState<FriendType[]>([
        {
            id: '3',
            name: 'Aman Gupta',
            image: 'https://i.pravatar.cc/150?img=13',
            active: true,
        },
        {
            id: '4',
            name: 'Sneha Kapoor',
            image: 'https://i.pravatar.cc/150?img=14',
            active: false,
        },
        {
            id: '5',
            name: 'Vikram Singh',
            image: 'https://i.pravatar.cc/150?img=15',
            active: true,
        },
        {
            id: '6',
            name: 'Neha Joshi',
            image: 'https://i.pravatar.cc/150?img=16',
            active: false,
        },
        {
            id: '7',
            name: 'Rohit Kumar',
            image: 'https://i.pravatar.cc/150?img=17',
            active: true,
        },
    ]);

    const confirmRequest = (
        request: FriendRequestType
    ) => {
        setFriends(prev => [
            {
                id: request.id,
                name: request.name,
                image: request.image,
                active: true,
            },
            ...prev,
        ]);

        setFriendRequests(prev =>
            prev.filter(item => item.id !== request.id)
        );
    };

    const cancelRequest = (id: string) => {
        setFriendRequests(prev =>
            prev.filter(item => item.id !== id)
        );
    };

    const filteredFriends = useMemo(() => {
        return friends.filter(friend =>
            friend.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, friends]);

    const renderFriendItem = ({
        item,
    }: {
        item: FriendType;
    }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.friendCard}
            >
                <View style={styles.friendLeft}>
                    <View>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.profileImage}
                        />

                        {item.active && (
                            <View
                                style={styles.activeDot}
                            />
                        )}
                    </View>

                    <View>
                        <Text style={styles.friendName}>
                            {item.name}
                        </Text>

                        <Text style={styles.friendStatus}>
                            {item.active
                                ? 'Online'
                                : 'Offline'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.messageButton}
                >
                    <Text
                        style={
                            styles.messageButtonText
                        }
                    >
                        Message
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderRequestItem = ({
        item,
    }: {
        item: FriendRequestType;
    }) => {
        return (
            <View style={styles.requestCard}>
                <View style={styles.friendLeft}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.requestImage}
                    />

                    <View>
                        <Text style={styles.requestName}>
                            {item.name}
                        </Text>

                        <Text
                            style={styles.requestText}
                        >
                            Sent you a request
                        </Text>
                    </View>
                </View>

                <View style={styles.requestButtons}>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={() =>
                            confirmRequest(item)
                        }
                    >
                        <Text
                            style={
                                styles.confirmButtonText
                            }
                        >
                            Confirm
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() =>
                            cancelRequest(item.id)
                        }
                    >
                        <Text
                            style={
                                styles.cancelButtonText
                            }
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#F4F6F8"
                barStyle="dark-content"
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Friends
                </Text>

                <Text style={styles.headerSubtitle}>
                    Connect and chat with friends
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search friends..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {friendRequests.length > 0 && (
                <View style={styles.requestSection}>
                    <Text style={styles.sectionTitle}>
                        Friend Requests
                    </Text>

                    <FlatList
                        data={friendRequests}
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                        keyExtractor={item => item.id}
                        renderItem={renderRequestItem}
                    />
                </View>
            )}

            <View style={styles.friendSection}>
                <Text style={styles.sectionTitle}>
                    Your Friends
                </Text>

                <FlatList
                    data={filteredFriends}
                    keyExtractor={item => item.id}
                    renderItem={renderFriendItem}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingBottom: 120,
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#111827',
    },

    headerSubtitle: {
        marginTop: 4,
        fontSize: 15,
        color: '#6B7280',
    },

    searchContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },

    searchInput: {
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 18,
        fontSize: 15,
        color: '#111827',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,

        elevation: 2,
    },

    requestSection: {
        marginTop: 10,
    },

    friendSection: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 16,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
        paddingHorizontal: 20,
    },

    requestCard: {
        width: 290,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 16,
        marginLeft: 20,
        marginBottom: 10,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,

        elevation: 3,
    },

    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    requestImage: {
        width: 58,
        height: 58,
        borderRadius: 29,
        marginRight: 14,
    },

    requestName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },

    requestText: {
        marginTop: 4,
        fontSize: 13,
        color: '#6B7280',
    },

    requestButtons: {
        flexDirection: 'row',
        marginTop: 16,
    },

    confirmButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        paddingVertical: 11,
        borderRadius: 12,
        alignItems: 'center',
        marginRight: 10,
    },

    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    cancelButton: {
        flex: 1,
        backgroundColor: '#FEE2E2',
        paddingVertical: 11,
        borderRadius: 12,
        alignItems: 'center',
    },

    cancelButtonText: {
        color: '#DC2626',
        fontWeight: '700',
    },

    friendCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,

        elevation: 2,
    },

    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
    },

    activeDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#22C55E',
        position: 'absolute',
        bottom: 4,
        right: 14,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    friendName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    friendStatus: {
        marginTop: 4,
        fontSize: 13,
        color: '#6B7280',
    },

    messageButton: {
        backgroundColor: '#E0E7FF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },

    messageButtonText: {
        color: '#4338CA',
        fontWeight: '700',
        fontSize: 14,
    },
});