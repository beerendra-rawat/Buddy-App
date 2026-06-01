import React, { useEffect, useMemo, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
    doc,
} from 'firebase/firestore';

import { auth, db } from '../../services/firebase';

type UserItem = {
    id: string;
    name: string;
    image: string;
    status: 'none' | 'pending' | 'friend';
    requestId?: string;
};

export default function PeopleScreen() {
    const currentUser = auth.currentUser;

    const currentUserId = currentUser?.uid;

    const [search, setSearch] = useState('');

    const [users, setUsers] = useState<UserItem[]>([]);

    const [loading, setLoading] = useState(true);

    const [sendingId, setSendingId] =
        useState<string>('');

    // =========================
    // REALTIME USERS + REQUESTS
    // =========================

    useEffect(() => {
        if (!currentUserId) return;

        let usersData: UserItem[] = [];

        const unsubscribeUsers = onSnapshot(
            collection(db, 'users'),
            snapshot => {
                const tempUsers: UserItem[] = [];

                snapshot.forEach(document => {
                    if (document.id !== currentUserId) {
                        const data = document.data();

                        tempUsers.push({
                            id: document.id,
                            name:
                                data.name ||
                                data.username ||
                                'Unknown',
                            image:
                                data.image ||
                                data.photoURL ||
                                '',
                            status: 'none',
                        });
                    }
                });

                usersData = tempUsers;
            }
        );

        const unsubscribeRequests = onSnapshot(
            collection(db, 'friendRequests'),
            snapshot => {
                const updatedUsers = usersData.map(
                    user => {
                        let status:
                            | 'none'
                            | 'pending'
                            | 'friend' = 'none';

                        let requestId = '';

                        snapshot.docs.forEach(docItem => {
                            const request =
                                docItem.data();

                            const isCurrentUserRequest =
                                request.senderId ===
                                currentUserId &&
                                request.receiverId ===
                                user.id;

                            const isFriend =
                                (request.senderId ===
                                    currentUserId &&
                                    request.receiverId ===
                                    user.id) ||
                                (request.senderId ===
                                    user.id &&
                                    request.receiverId ===
                                    currentUserId);

                            // PENDING REQUEST
                            if (
                                isCurrentUserRequest &&
                                request.status ===
                                'pending'
                            ) {
                                status = 'pending';

                                requestId = docItem.id;
                            }

                            // FRIEND
                            if (
                                isFriend &&
                                request.status ===
                                'accepted'
                            ) {
                                status = 'friend';

                                requestId = docItem.id;
                            }
                        });

                        return {
                            ...user,
                            status,
                            requestId,
                        };
                    }
                );

                // REMOVE DUPLICATES
                const uniqueUsers =
                    updatedUsers.filter(
                        (item, index, self) =>
                            index ===
                            self.findIndex(
                                t => t.id === item.id
                            )
                    );

                setUsers(uniqueUsers);

                setLoading(false);
            }
        );

        return () => {
            unsubscribeUsers();

            unsubscribeRequests();
        };
    }, [currentUserId]);

    // =========================
    // SEND REQUEST
    // =========================

    const sendRequest = async (
        receiverId: string
    ) => {
        if (!currentUserId) return;

        try {
            setSendingId(receiverId);

            // CHECK REQUEST EXIST
            const q1 = query(
                collection(db, 'friendRequests'),
                where('senderId', '==', currentUserId),
                where('receiverId', '==', receiverId)
            );

            const q2 = query(
                collection(db, 'friendRequests'),
                where('senderId', '==', receiverId),
                where('receiverId', '==', currentUserId)
            );

            const [snapshot1, snapshot2] =
                await Promise.all([
                    getDocs(q1),
                    getDocs(q2),
                ]);

            // PREVENT MULTIPLE REQUEST
            if (
                !snapshot1.empty ||
                !snapshot2.empty
            ) {
                setSendingId('');

                return;
            }

            await addDoc(
                collection(db, 'friendRequests'),
                {
                    senderId: currentUserId,
                    receiverId,
                    status: 'pending',
                    createdAt: serverTimestamp(),
                }
            );
        } catch (error) {
            console.log(error);

            Alert.alert(
                'Error',
                'Failed to send request'
            );
        } finally {
            setSendingId('');
        }
    };

    // =========================
    // CANCEL REQUEST
    // =========================

    const cancelRequest = async (
        requestId?: string
    ) => {
        if (!requestId) return;

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

            Alert.alert(
                'Error',
                'Failed to cancel request'
            );
        }
    };

    // =========================
    // FILTER USERS
    // =========================

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, users]);

    // =========================
    // PROFILE IMAGE
    // =========================

    const renderProfileImage = (
        image?: string
    ) => {
        if (image) {
            return (
                <Image
                    source={{ uri: image }}
                    style={styles.profileImage}
                />
            );
        }

        return (
            <View style={styles.dummyAvatar}>
                <Ionicons
                    name="person"
                    size={22}
                    color="#FFFFFF"
                />
            </View>
        );
    };

    // =========================
    // BUTTON UI
    // =========================

    const renderButton = (
        item: UserItem
    ) => {
        // FRIEND
        if (item.status === 'friend') {
            return (
                <View style={styles.friendButton}>
                    <Ionicons
                        name="checkmark-circle"
                        size={15}
                        color="#16A34A"
                    />

                    <Text style={styles.friendText}>
                        Friends
                    </Text>
                </View>
            );
        }

        // PENDING
        if (item.status === 'pending') {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.cancelButton}
                    onPress={() =>
                        cancelRequest(item.requestId)
                    }
                >
                    <Text style={styles.cancelText}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            );
        }

        // ADD
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.addButton}
                disabled={sendingId === item.id}
                onPress={() =>
                    sendRequest(item.id)
                }
            >
                {sendingId === item.id ? (
                    <ActivityIndicator
                        size="small"
                        color="#FFFFFF"
                    />
                ) : (
                    <>
                        <Ionicons
                            name="person-add"
                            size={15}
                            color="#FFFFFF"
                        />

                        <Text style={styles.addText}>
                            Add
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        );
    };

    // =========================
    // USER ITEM
    // =========================

    const renderItem = ({
        item,
    }: {
        item: UserItem;
    }) => {
        return (
            <View style={styles.userRow}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.leftSection}
                >
                    <View>
                        {renderProfileImage(
                            item.image
                        )}

                        <View style={styles.onlineDot} />
                    </View>

                    <Text style={styles.name}>
                        {item.name}
                    </Text>
                </TouchableOpacity>

                {renderButton(item)}
            </View>
        );
    };

    // =========================
    // UI
    // =========================

    return (
        <SafeAreaView
            edges={['top']}
            style={styles.container}
        >
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <Text style={styles.headerTitle}>
                Find Friends
            </Text>

            {/* SEARCH */}
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={18}
                    color="#9CA3AF"
                />

                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#6487E8"
                    />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingBottom: 120,
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111827',
        marginTop: 10,
        marginBottom: 18,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        height: 48,
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 18,
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#111827',
    },

    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEF2F7',
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },

    dummyAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6487E8',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderColor: '#FFFFFF',
    },

    name: {
        marginLeft: 14,
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    addButton: {
        height: 38,
        minWidth: 92,
        borderRadius: 12,
        backgroundColor: '#6487E8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },

    addText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
    },

    cancelButton: {
        height: 38,
        minWidth: 92,
        borderRadius: 12,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
    },

    cancelText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '700',
    },

    friendButton: {
        height: 38,
        minWidth: 100,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },

    friendText: {
        color: '#16A34A',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 5,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});