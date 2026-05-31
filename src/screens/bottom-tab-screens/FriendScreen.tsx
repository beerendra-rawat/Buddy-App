import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';

import { auth, db } from '../../services/firebase';

type FriendRequest = {
    requestId: string;
    senderId: string;
    name?: string;
    image?: string;
};

type Friend = {
    id: string;
    name?: string;
    image?: string;
};

export default function FriendScreen() {

    const [search, setSearch] = useState('');

    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

    const [friends, setFriends] = useState<Friend[]>([]);

    const [currentUserId, setCurrentUserId] = useState<string | null>(
        auth.currentUser?.uid ?? null
    );

    const navigation = useNavigation<any>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUserId(user?.uid ?? null);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        loadFriendRequests();
        loadFriends();
    }, [currentUserId]);

    // LOAD FRIEND REQUESTS
    const loadFriendRequests = async () => {

        if (!currentUserId) return;

        try {

            const q = query(
                collection(db, 'friendRequests'),
                where('receiverId', '==', currentUserId),
                where('status', '==', 'pending')
            );

            const snapshot = await getDocs(q);

            const requests: FriendRequest[] = [];

            for (const requestDoc of snapshot.docs) {

                const requestData = requestDoc.data();
                const senderId = requestData.senderId as string;

                if (!senderId) continue;

                const userDocRef = doc(db, 'users', senderId);
                const userSnapshot = await getDoc(userDocRef);

                if (!userSnapshot.exists()) continue;

                const userData = userSnapshot.data();

                requests.push({
                    requestId: requestDoc.id,
                    senderId,
                    name: (userData?.name as string) || 'No Name',
                    image: (userData?.image as string) || '',
                });
            }

            setFriendRequests(requests);

        } catch (error) {
            console.log('REQUEST ERROR:', error);
        }
    };

    // LOAD FRIENDS
    const loadFriends = async () => {

        if (!currentUserId) return;

        try {

            const q = query(
                collection(db, 'friendRequests'),
                where('status', '==', 'accepted')
            );

            const snapshot = await getDocs(q);

            const friendList: Friend[] = [];

            for (const friendDoc of snapshot.docs) {

                const data = friendDoc.data();

                let friendId = '';

                // CHECK FRIEND ID
                if (data.senderId === currentUserId) {

                    friendId = data.receiverId;

                } else if (data.receiverId === currentUserId) {

                    friendId = data.senderId;

                } else {
                    continue;
                }

                // GET USER DATA
                const userDocRef = doc(db, 'users', friendId);
                const userSnapshot = await getDoc(userDocRef);

                if (!userSnapshot.exists()) continue;

                const userData = userSnapshot.data();

                friendList.push({
                    id: friendId,
                    name: (userData?.name as string) || 'No Name',
                    image: (userData?.image as string) || '',
                });
            }

            setFriends(friendList);

        } catch (error) {
            console.log('FRIEND ERROR:', error);
        }
    };

    // ACCEPT REQUEST
    const acceptRequest = async (requestId: string) => {

        try {

            await updateDoc(
                doc(db, 'friendRequests', requestId),
                {
                    status: 'accepted',
                }
            );

            Alert.alert('Success', 'Friend Request Accepted');

            loadFriendRequests();
            loadFriends();

        } catch (error) {
            console.log(error);
        }
    };

    // DELETE REQUEST
    const deleteRequest = async (requestId: string) => {

        try {

            await deleteDoc(
                doc(db, 'friendRequests', requestId)
            );

            loadFriendRequests();

        } catch (error) {
            console.log(error);
        }
    };

    // SEARCH FILTER
    const filteredFriends = friends.filter(item =>
        item.name
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    // FRIEND REQUEST CARD
    const renderFriendRequest = ({ item }: any) => (

        <View style={styles.requestCard}>

            <Image
                source={{
                    uri:
                        item.image ||
                        'https://i.pravatar.cc/300',
                }}
                style={styles.requestImage}
            />

            <Text style={styles.requestName}>
                {item.name}
            </Text>

            <Text style={styles.requestText}>
                Sent you request
            </Text>

            <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() =>
                    acceptRequest(item.requestId)
                }
            >
                <Text style={styles.acceptText}>
                    Accept
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                    deleteRequest(item.requestId)
                }
            >
                <Text style={styles.deleteText}>
                    Delete
                </Text>
            </TouchableOpacity>

        </View>
    );

    // FRIEND CARD
    const renderFriend = ({ item }: any) => (

        <View style={styles.friendCard}>

            <View style={styles.friendLeft}>

                <Image
                    source={{
                        uri:
                            item.image ||
                            'https://i.pravatar.cc/300',
                    }}
                    style={styles.friendImage}
                />

                <View style={{ marginLeft: 12 }}>

                    <Text style={styles.friendName}>
                        {item.name}
                    </Text>

                    <Text style={styles.friendStatus}>
                        Friend
                    </Text>

                </View>

            </View>

            <TouchableOpacity
                style={styles.messageBtn}
                onPress={() =>
                    navigation.navigate('Message', {
                        userName: item.name,
                        userImage: item.image,
                        receiverId: item.id,
                    })
                }
            >
                <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color="#2563EB"
                />
            </TouchableOpacity>

        </View>
    );

    return (

        <SafeAreaView style={styles.container}>

            <StatusBar barStyle="dark-content" />

            {/* SEARCH */}
            <View style={styles.searchBox}>

                <Ionicons
                    name="search-outline"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 10 }}
                />

                <TextInput
                    placeholder="Search friends..."
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
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {/* FRIEND REQUEST */}
                        <Text style={styles.heading}>
                            Friend Requests
                        </Text>

                        <FlatList
                            horizontal
                            data={friendRequests}
                            renderItem={renderFriendRequest}
                            keyExtractor={item =>
                                item.requestId
                            }
                            showsHorizontalScrollIndicator={
                                false
                            }
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                            }}
                        />

                        {/* FRIEND LIST */}
                        <Text style={styles.heading}>
                            Your Friends
                        </Text>
                    </>
                }
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },

    searchBox: {
        height: 54,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },

    heading: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
        paddingHorizontal: 20,
    },

    requestCard: {
        width: 170,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginRight: 14,
        alignItems: 'center',
        marginBottom: 28,
    },

    requestImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
        marginBottom: 12,
    },

    requestName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    requestText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
        marginBottom: 14,
    },

    acceptBtn: {
        width: '100%',
        height: 40,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    acceptText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },

    deleteBtn: {
        width: '100%',
        height: 40,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    deleteText: {
        color: '#111827',
        fontWeight: '700',
        fontSize: 14,
    },

    friendCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 18,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    friendImage: {
        width: 58,
        height: 58,
        borderRadius: 29,
    },

    friendName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },

    friendStatus: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },

    messageBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

});
