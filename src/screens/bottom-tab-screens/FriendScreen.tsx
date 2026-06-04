import React, {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    useNavigation,
} from '@react-navigation/native';

import {
    onAuthStateChanged,
} from 'firebase/auth';

import {
    collection,
    query,
    where,
    getDoc,
    doc,
    onSnapshot,
    deleteDoc,
    serverTimestamp,
    writeBatch,
} from 'firebase/firestore';

import {
    auth,
    db,
} from '../../services/firebase';

import AppContainer from
    '../../components/common/AppContainer';

import AppInput from
    '../../components/common/AppInput';

import AppButton from
    '../../components/common/AppButton';

import UserAvatar from
    '../../components/common/UserAvatar';

import SkeletonLoader from
    '../../components/common/SkeletonLoader';

import {
    COLORS,
} from '../../constants/colors';

type FriendRequest = {
    requestId: string;
    senderId: string;
    name: string;
    image: string;
};

type Friend = {
    id: string;
    name: string;
    image: string;
    online?: boolean;
};

export default function FriendScreen() {

    const navigation =
        useNavigation<any>();

    const [search, setSearch] =
        useState('');

    const [loading, setLoading] =
        useState(true);

    const [currentUserId, setCurrentUserId] =
        useState('');

    const [friendRequests, setFriendRequests] =
        useState<FriendRequest[]>([]);

    const [friends, setFriends] =
        useState<Friend[]>([]);

    // ==========================
    // AUTH
    // ==========================

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                user => {

                    if (user) {

                        setCurrentUserId(
                            user.uid
                        );
                    }
                }
            );

        return unsubscribe;

    }, []);

    // ==========================
    // FRIEND REQUESTS
    // ==========================

    useEffect(() => {

        if (!currentUserId) {
            return;
        }

        const q = query(
            collection(
                db,
                'friendRequests'
            ),
            where(
                'receiverId',
                '==',
                currentUserId
            ),
            where(
                'status',
                '==',
                'pending'
            )
        );

        const unsubscribe =
            onSnapshot(
                q,
                async snapshot => {

                    const uniqueUsers =
                        new Set();

                    const requests:
                        FriendRequest[] = [];

                    for (const item of snapshot.docs) {

                        const data =
                            item.data();

                        const senderId =
                            data.senderId;

                        if (
                            uniqueUsers.has(
                                senderId
                            )
                        ) {

                            await deleteDoc(
                                doc(
                                    db,
                                    'friendRequests',
                                    item.id
                                )
                            );

                            continue;
                        }

                        uniqueUsers.add(
                            senderId
                        );

                        const userSnap =
                            await getDoc(
                                doc(
                                    db,
                                    'users',
                                    senderId
                                )
                            );

                        if (
                            !userSnap.exists()
                        ) {
                            continue;
                        }

                        const userData =
                            userSnap.data();

                        requests.push({
                            requestId:
                                item.id,

                            senderId,

                            name:
                                userData?.name ||
                                userData?.username ||
                                'No Name',

                            image:
                                userData?.photoURL ||
                                userData?.image ||
                                userData?.profileImage ||
                                '',
                        });
                    }

                    setFriendRequests(
                        requests
                    );
                }
            );

        return unsubscribe;

    }, [currentUserId]);

    // ==========================
    // FRIENDS
    // ==========================

    useEffect(() => {

        if (!currentUserId) {
            return;
        }

        const q = query(
            collection(
                db,
                'friendRequests'
            ),
            where(
                'status',
                '==',
                'accepted'
            )
        );

        const unsubscribe =
            onSnapshot(
                q,
                async snapshot => {

                    try {

                        const uniqueFriends =
                            new Set();

                        const friendList:
                            Friend[] = [];

                        for (const item of snapshot.docs) {

                            const data =
                                item.data();

                            let friendId =
                                '';

                            if (
                                data.senderId ===
                                currentUserId
                            ) {

                                friendId =
                                    data.receiverId;

                            } else if (
                                data.receiverId ===
                                currentUserId
                            ) {

                                friendId =
                                    data.senderId;

                            } else {

                                continue;
                            }

                            if (
                                uniqueFriends.has(
                                    friendId
                                )
                            ) {
                                continue;
                            }

                            uniqueFriends.add(
                                friendId
                            );

                            const userSnap =
                                await getDoc(
                                    doc(
                                        db,
                                        'users',
                                        friendId
                                    )
                                );

                            if (
                                !userSnap.exists()
                            ) {
                                continue;
                            }

                            const userData =
                                userSnap.data();

                            friendList.push({
                                id: friendId,
                                name:
                                    userData?.name ||
                                    userData?.username ||
                                    'No Name',

                                image:
                                    userData?.photoURL ||
                                    userData?.image ||
                                    userData?.profileImage ||
                                    '',

                                online:
                                    userData?.online || false,
                            });
                        }

                        setFriends(
                            friendList
                        );

                    } catch (error) {

                        console.log(error);

                    } finally {

                        setLoading(false);
                    }
                }
            );

        return unsubscribe;

    }, [currentUserId]);

    // ==========================
    // ACCEPT REQUEST
    // ==========================

    const acceptRequest =
        async (
            item: FriendRequest
        ) => {

            try {

                const batch =
                    writeBatch(db);

                const requestRef =
                    doc(
                        db,
                        'friendRequests',
                        item.requestId
                    );

                batch.update(
                    requestRef,
                    {
                        status:
                            'accepted',

                        updatedAt:
                            serverTimestamp(),
                    }
                );

                await batch.commit();

            } catch (error) {

                console.log(error);
            }
        };

    // ==========================
    // REMOVE REQUEST
    // ==========================

    const removeRequest =
        async (
            requestId: string
        ) => {

            try {

                await deleteDoc(
                    doc(
                        db,
                        'friendRequests',
                        requestId
                    )
                );

            } catch (error) {

                console.log(error);
            }
        };

    // ==========================
    // FILTER FRIENDS
    // ==========================

    const filteredFriends =
        useMemo(() => {

            return friends.filter(
                item =>
                    item.name
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

        }, [friends, search]);

    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return <SkeletonLoader />;
    }

    // ==========================
    // REQUEST ITEM
    // ==========================

    const renderFriendRequest = ({
        item,
    }: any) => (

        <View
            style={
                styles.requestCard
            }
        >

            <View>

                <UserAvatar
                    image={item.image}
                    size={56}
                />

                {item.online && (
                    <View
                        style={styles.onlineDot}
                    />
                )}

            </View>

            <View
                style={
                    styles.requestContent
                }
            >

                <Text
                    style={
                        styles.userName
                    }
                >
                    {item.name}
                </Text>

                <Text
                    style={
                        styles.requestText
                    }
                >
                    Sent you request
                </Text>

            </View>

            <View
                style={
                    styles.buttonRow
                }
            >

                <View
                    style={
                        styles.acceptWrapper
                    }
                >

                    <AppButton
                        title="Accept"
                        onPress={() =>
                            acceptRequest(
                                item
                            )
                        }
                    />

                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={
                        styles.removeButton
                    }
                    onPress={() =>
                        removeRequest(
                            item.requestId
                        )
                    }
                >

                    <Text
                        style={
                            styles.removeText
                        }
                    >
                        Remove
                    </Text>

                </TouchableOpacity>

            </View>

        </View>
    );

    // ==========================
    // FRIEND ITEM
    // ==========================

    const renderFriend = ({
        item,
    }: any) => (

        <TouchableOpacity
            activeOpacity={0.8}
            style={styles.friendItem}
        >

            <View
                style={
                    styles.friendLeft
                }
            >

                <UserAvatar
                    image={item.image}
                    size={56}
                />

                <Text
                    style={
                        styles.userName
                    }
                >
                    {item.name}
                </Text>

            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                style={
                    styles.messageButton
                }
                onPress={() =>
                    navigation.navigate(
                        'Message',
                        {
                            receiverId:
                                item.id,

                            name:
                                item.name,

                            image:
                                item.image,
                        }
                    )
                }
            >

                <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color={
                        COLORS.primary
                    }
                />

            </TouchableOpacity>

        </TouchableOpacity>
    );

    // ==========================
    // UI
    // ==========================

    return (

        <AppContainer>

            {/* SEARCH */}

            <View
                style={
                    styles.searchContainer
                }
            >

                <AppInput
                    placeholder="Search friends"
                    value={search}
                    onChangeText={
                        setSearch
                    }
                    leftIcon={
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#9CA3AF"
                        />
                    }
                />

            </View>

            <FlatList
                data={filteredFriends}
                renderItem={
                    renderFriend
                }
                keyExtractor={item =>
                    item.id
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.listContent
                }
                ListHeaderComponent={
                    <>
                        {
                            friendRequests.length >
                            0 && (
                                <>
                                    <Text
                                        style={
                                            styles.heading
                                        }
                                    >
                                        Friend Requests
                                    </Text>

                                    <FlatList
                                        data={
                                            friendRequests
                                        }
                                        renderItem={
                                            renderFriendRequest
                                        }
                                        keyExtractor={
                                            item =>
                                                item.requestId
                                        }
                                        scrollEnabled={
                                            false
                                        }
                                    />
                                </>
                            )
                        }

                        <Text
                            style={
                                styles.heading
                            }
                        >
                            Friends
                        </Text>
                    </>
                }
            />

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 18,
    },

    listContent: {
        paddingBottom: 120,
    },

    heading: {
        fontSize: 22,
        fontWeight: '700',

        color:
            COLORS.textPrimary,

        paddingHorizontal: 16,

        marginBottom: 16,
        marginTop: 6,
    },

    requestCard: {
        flexDirection: 'row',

        alignItems: 'center',

        marginHorizontal: 16,

        paddingBottom: 18,
        marginBottom: 18,

        borderBottomWidth: 1,

        borderBottomColor:
            '#F1F5F9',
    },

    requestContent: {
        flex: 1,
        marginLeft: 14,
    },

    requestText: {
        marginTop: 4,

        fontSize: 13,

        color:
            COLORS.textSecondary,
    },

    buttonRow: {
        alignItems: 'center',
    },

    acceptWrapper: {
        width: 100,
    },

    removeButton: {
        height: 40,

        minWidth: 100,

        borderRadius: 12,

        backgroundColor:
            '#FEE2E2',

        justifyContent: 'center',
        alignItems: 'center',

        marginTop: 8,
    },

    removeText: {
        color: '#EF4444',

        fontSize: 14,
        fontWeight: '700',
    },

    friendItem: {
        flexDirection: 'row',

        alignItems: 'center',

        justifyContent:
            'space-between',

        marginHorizontal: 16,

        paddingBottom: 18,
        marginBottom: 18,

        borderBottomWidth: 1,

        borderBottomColor:
            '#F1F5F9',
    },

    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    messageButton: {
        width: 42,
        height: 42,

        borderRadius: 21,

        justifyContent: 'center',
        alignItems: 'center',
    },

    userName: {
        marginLeft: 14,

        fontSize: 16,
        fontWeight: '600',

        color:
            COLORS.textPrimary,
    },

    onlineDot: {
        width: 13,
        height: 13,

        borderRadius: 7,

        backgroundColor: '#22C55E',

        position: 'absolute',

        bottom: 1,
        right: 1,

        borderWidth: 2,
        borderColor: COLORS.white,
    },

});