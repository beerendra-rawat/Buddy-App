import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
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
} from 'firebase/firestore';

import { auth, db } from '../../services/firebase';

type UserItem = {
    id: string;
    name?: string;
    image?: string;
    isFriendAdded: boolean;
};

export default function PeopleScreen() {
    const [search, setSearch] = useState('');

    const [users, setUsers] = useState<UserItem[]>([]);

    const currentUser = auth.currentUser;
    const currentUserId = currentUser?.uid;

    useEffect(() => {
        if (!currentUserId) return;
        loadUsers();
    }, [currentUserId]);

    const loadUsers = async () => {
        if (!currentUserId) return;

        try {
            const snapshot = await getDocs(
                collection(db, 'users')
            );

            const userList: UserItem[] = [];

            snapshot.forEach(doc => {
                if (doc.id !== currentUserId) {
                    const data = doc.data();

                    userList.push({
                        id: doc.id,
                        name: data.name as string | undefined,
                        image: data.image as string | undefined,
                        isFriendAdded: false,
                    });
                }
            });

            setUsers(userList);
        } catch (error) {
            console.log(error);
        }
    };

    const sendFriendRequest = async (receiverId: string) => {
        if (!currentUserId) {
            Alert.alert('Error', 'Unable to send request without logged in user');
            return;
        }

        try {
            const q = query(
                collection(db, 'friendRequests'),
                where('senderId', '==', currentUserId),
                where('receiverId', '==', receiverId)
            );

            const existingRequest = await getDocs(q);

            if (!existingRequest.empty) {
                Alert.alert('Already Sent', 'Friend request already exists');
                return;
            }

            await addDoc(collection(db, 'friendRequests'), {
                senderId: currentUserId,
                receiverId,
                status: 'pending',
                createdAt: new Date(),
            });

            const updatedUsers = users.map(user =>
                user.id === receiverId
                    ? {
                          ...user,
                          isFriendAdded: true,
                      }
                    : user
            );

            setUsers(updatedUsers);

            Alert.alert('Success', 'Friend request sent');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to send request');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ?? false
    );

    const renderItem = ({ item }: { item: UserItem }) => {
        return (
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.profileImage}
                    />

                    <View>
                        <Text style={styles.name}>
                            {item.name}
                        </Text>

                        <Text style={styles.subText}>
                            Suggested Friend
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        sendFriendRequest(item.id)
                    }
                    disabled={item.isFriendAdded}
                    style={[
                        styles.button,
                        item.isFriendAdded &&
                        styles.cancelButton,
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            item.isFriendAdded &&
                            styles.cancelButtonText,
                        ]}
                    >
                        {item.isFriendAdded
                            ? 'Sent'
                            : 'Add'}
                    </Text>
                </TouchableOpacity>
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
                    Find Friends
                </Text>

                <Text style={styles.headerSubtitle}>
                    Connect with new people
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#9CA3AF"
                />

                <TextInput
                    placeholder="Search friends..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.listContainer
                }
            />
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
        paddingTop: 10,
        paddingBottom: 10,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },

    headerSubtitle: {
        marginTop: 4,
        fontSize: 15,
        color: '#6B7280',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 14,
        paddingHorizontal: 14,
        height: 52,
        borderRadius: 16,
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#111827',
    },

    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    profileImage: {
        width: 58,
        height: 58,
        borderRadius: 29,
        marginRight: 14,
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },

    subText: {
        marginTop: 4,
        fontSize: 13,
        color: '#6B7280',
    },

    button: {
        backgroundColor: '#2563EB',
        paddingVertical: 9,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 90,
        alignItems: 'center',
    },

    cancelButton: {
        backgroundColor: '#DBEAFE',
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },

    cancelButtonText: {
        color: '#2563EB',
    },
});