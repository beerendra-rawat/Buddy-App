// ==========================
// FINAL FRIEND SCREEN FIXED
// ==========================

import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { onAuthStateChanged } from 'firebase/auth';

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

import { auth, db } from '../../services/firebase';

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
};

export default function FriendScreen() {

    const navigation = useNavigation<any>();

    const [search, setSearch] = useState('');

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
            onAuthStateChanged(auth, user => {

                if (user) {
                    setCurrentUserId(user.uid);
                }
            });

        return unsubscribe;

    }, []);

    // ==========================
    // FRIEND REQUESTS
    // ==========================

    useEffect(() => {

        if (!currentUserId) return;

        const q = query(
            collection(db, 'friendRequests'),
            where('receiverId', '==', currentUserId),
            where('status', '==', 'pending')
        );

        const unsubscribe = onSnapshot(
            q,
            async snapshot => {

                const uniqueUsers = new Set();

                const requests: FriendRequest[] = [];

                for (const item of snapshot.docs) {

                    const data = item.data();

                    const senderId = data.senderId;

                    // ==========================
                    // REMOVE DUPLICATE REQUESTS
                    // ==========================

                    if (
                        uniqueUsers.has(senderId)
                    ) {

                        // AUTO DELETE DUPLICATE
                        await deleteDoc(
                            doc(
                                db,
                                'friendRequests',
                                item.id
                            )
                        );

                        continue;
                    }

                    uniqueUsers.add(senderId);

                    const userSnap = await getDoc(
                        doc(db, 'users', senderId)
                    );

                    if (!userSnap.exists()) continue;

                    const userData = userSnap.data();

                    requests.push({
                        requestId: item.id,
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

                setFriendRequests(requests);
            }
        );

        return unsubscribe;

    }, [currentUserId]);

    // ==========================
    // FRIENDS
    // ==========================

    useEffect(() => {

        if (!currentUserId) return;

        const q = query(
            collection(db, 'friendRequests'),
            where('status', '==', 'accepted')
        );

        const unsubscribe = onSnapshot(
            q,
            async snapshot => {

                const uniqueFriends =
                    new Set();

                const friendList: Friend[] = [];

                for (const item of snapshot.docs) {

                    const data = item.data();

                    let friendId = '';

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

                    // REMOVE DUPLICATE

                    if (
                        uniqueFriends.has(
                            friendId
                        )
                    ) {
                        continue;
                    }

                    uniqueFriends.add(friendId);

                    const userSnap = await getDoc(
                        doc(
                            db,
                            'users',
                            friendId
                        )
                    );

                    if (!userSnap.exists())
                        continue;

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
                    });
                }

                setFriends(friendList);
            }
        );

        return unsubscribe;

    }, [currentUserId]);

    // ==========================
    // ACCEPT REQUEST
    // ==========================

    const acceptRequest = async (
        item: FriendRequest
    ) => {

        try {

            const batch =
                writeBatch(db);

            // UPDATE REQUEST

            const requestRef = doc(
                db,
                'friendRequests',
                item.requestId
            );

            batch.update(requestRef, {
                status: 'accepted',
                updatedAt:
                    serverTimestamp(),
            });

            await batch.commit();

        } catch (error) {
            console.log(error);
        }
    };

    // ==========================
    // REMOVE REQUEST
    // ==========================

    const removeRequest = async (
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
        friends.filter(item =>
            item.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    // ==========================
    // AVATAR
    // ==========================

    const renderAvatar = (
        image: string
    ) => {

        if (image) {

            return (
                <Image
                    source={{ uri: image }}
                    style={
                        styles.profileImage
                    }
                />
            );
        }

        return (
            <View
                style={styles.dummyAvatar}
            >
                <Ionicons
                    name="person"
                    size={24}
                    color="#FFFFFF"
                />
            </View>
        );
    };

    // ==========================
    // REQUEST ITEM
    // ==========================

    const renderFriendRequest = ({
        item,
    }: any) => (

        <View style={styles.requestCard}>

            {renderAvatar(item.image)}

            <View style={{ flex: 1 }}>

                <Text
                    style={styles.userName}
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

            <View style={styles.buttonRow}>

                <TouchableOpacity
                    style={
                        styles.acceptBtn
                    }
                    onPress={() =>
                        acceptRequest(item)
                    }
                >
                    <Text
                        style={
                            styles.acceptText
                        }
                    >
                        Accept
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.removeBtn
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
            style={styles.friendItem}
            activeOpacity={0.8}
        >

            <View
                style={styles.friendLeft}
            >

                {renderAvatar(item.image)}

                <Text
                    style={styles.userName}
                >
                    {item.name}
                </Text>

            </View>

            <TouchableOpacity
                style={styles.messageBtn}
                onPress={() =>
                    navigation.navigate(
                        'Message',
                        {
                            receiverId: item.id,
                            name: item.name,
                            image: item.image,
                        }
                    )
                }
            >
                <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color="#2563EB"
                />
            </TouchableOpacity>

        </TouchableOpacity>
    );

    return (

        <SafeAreaView
            style={styles.container}
        >

            <StatusBar
                barStyle="dark-content"
            />

            {/* SEARCH */}

            <View style={styles.searchBox}>

                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#9CA3AF"
                />

                <TextInput
                    placeholder="Search friends"
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.input}
                />

            </View>

            <FlatList
                data={filteredFriends}
                renderItem={renderFriend}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
                ListHeaderComponent={
                    <>
                        {friendRequests.length >
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
                            )}

                        <Text
                            style={styles.heading}
                        >
                            Friends
                        </Text>
                    </>
                }
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    searchBox: {
        height: 54,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 16,
        borderRadius: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#111827',
    },

    heading: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 6,
    },

    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
    },

    requestText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },

    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    acceptBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 18,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    removeBtn: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 18,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    acceptText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },

    removeText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 14,
    },

    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
        marginHorizontal: 16,
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
    },

    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    messageBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 14,
    },

    dummyAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#5B7FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },

});