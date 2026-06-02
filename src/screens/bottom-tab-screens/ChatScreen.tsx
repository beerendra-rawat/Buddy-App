import React, {
    useEffect,
    useState,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
    collection,
    onSnapshot,
    orderBy,
    query,
    addDoc,
    serverTimestamp,
    deleteDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    auth,
    db,
} from '../../services/firebase';

import {
    useNavigation,
} from '@react-navigation/native';

import {
    Ionicons,
} from '@expo/vector-icons';

// ==========================
// TYPES
// ==========================

type MediaType = {
    type: 'image' | 'video';
    url: string;
    duration: number;
};

type StoryType = {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    media: MediaType[];
};

type ChatType = {
    id: string;
    userId: string;
    name: string;
    image?: string;
    lastMessage?: string;
    lastMessageTime?: any;
    online?: boolean;
};

export default function ChatScreen() {

    const navigation = useNavigation<any>();

    const currentUser = auth.currentUser;

    const [stories, setStories] =
        useState<StoryType[]>([]);

    const [chats, setChats] =
        useState<ChatType[]>([]);

    const [loading, setLoading] =
        useState(true);

    // ==========================
    // GET STORIES
    // ==========================

    useEffect(() => {

        const q = query(
            collection(db, 'stories'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            async snapshot => {

                const now = Date.now();

                const tempStories:
                    StoryType[] = [];

                for (const item of snapshot.docs) {

                    const data = item.data();

                    const expireTime =
                        data?.expiresAt
                            ?.toDate()
                            ?.getTime?.() || 0;

                    // AUTO DELETE AFTER 24 HOURS

                    if (
                        expireTime > now
                    ) {

                        tempStories.push({
                            id: item.id,
                            userId:
                                data.userId,

                            userName:
                                data.userName,

                            userImage:
                                data.userImage,

                            media:
                                data.media ||
                                [],
                        });

                    } else {

                        await deleteDoc(
                            doc(
                                db,
                                'stories',
                                item.id
                            )
                        );
                    }
                }

                setStories(
                    tempStories
                );
            }
        );

        return () =>
            unsubscribe();

    }, []);

    // ==========================
    // GET CHATS
    // ==========================

    useEffect(() => {

        if (!currentUser?.uid)
            return;

        const q = query(
            collection(db, 'chats'),
            orderBy(
                'lastMessageTime',
                'desc'
            )
        );

        const unsubscribe =
            onSnapshot(
                q,
                async snapshot => {

                    try {

                        const tempChats:
                            ChatType[] =
                                [];

                        for (const chatDoc of snapshot.docs) {

                            const chatData =
                                chatDoc.data();

                            if (
                                !chatData?.users?.includes(
                                    currentUser.uid
                                )
                            ) {
                                continue;
                            }

                            const receiverId =
                                chatData.users.find(
                                    (
                                        id: string
                                    ) =>
                                        id !==
                                        currentUser.uid
                                );

                            if (
                                !receiverId
                            )
                                continue;

                            const userSnap =
                                await getDoc(
                                    doc(
                                        db,
                                        'users',
                                        receiverId
                                    )
                                );

                            if (
                                !userSnap.exists()
                            )
                                continue;

                            const userData =
                                userSnap.data();

                            tempChats.push({
                                id:
                                    chatDoc.id,

                                userId:
                                    receiverId,

                                name:
                                    userData?.name ||
                                    'User',

                                image:
                                    userData?.profileImage ||
                                    '',

                                lastMessage:
                                    chatData?.lastMessage ||
                                    'Start Chat',

                                lastMessageTime:
                                    chatData?.lastMessageTime,

                                online:
                                    userData?.isOnline ||
                                    false,
                            });
                        }

                        setChats(
                            tempChats
                        );

                        setLoading(
                            false
                        );

                    } catch (error) {

                        console.log(
                            'Chat Error:',
                            error
                        );

                        setLoading(
                            false
                        );
                    }
                }
            );

        return () =>
            unsubscribe();

    }, []);

    // ==========================
    // PICK STORY
    // ==========================

    const pickStory =
        async () => {

            try {

                const result =
                    await ImagePicker.launchImageLibraryAsync(
                        {
                            mediaTypes:
                                ImagePicker.MediaTypeOptions.All,

                            allowsMultipleSelection:
                                true,

                            quality: 1,
                        }
                    );

                if (
                    result.canceled
                )
                    return;

                const media:
                    MediaType[] = [];

                for (const asset of result.assets) {

                    // TEMP URI
                    // Replace with Cloudinary URL later

                    media.push({
                        type:
                            asset.type ===
                            'video'
                                ? 'video'
                                : 'image',

                        url:
                            asset.uri,

                        duration:
                            asset.type ===
                            'video'
                                ? 30
                                : 5,
                    });
                }

                await addDoc(
                    collection(
                        db,
                        'stories'
                    ),
                    {
                        userId:
                            currentUser?.uid,

                        userName:
                            currentUser?.displayName ||
                            'User',

                        userImage:
                            currentUser?.photoURL ||
                            '',

                        media,

                        createdAt:
                            serverTimestamp(),

                        expiresAt:
                            new Date(
                                Date.now() +
                                24 *
                                    60 *
                                    60 *
                                    1000
                            ),
                    }
                );

            } catch (error) {

                console.log(
                    'Story Error:',
                    error
                );
            }
        };

    // ==========================
    // DELETE STORY
    // ==========================

    const deleteStory =
        async (
            storyId: string
        ) => {

            Alert.alert(
                'Delete Story',
                'Delete this story?',
                [
                    {
                        text: 'Cancel',
                    },

                    {
                        text: 'Delete',

                        onPress:
                            async () => {

                                await deleteDoc(
                                    doc(
                                        db,
                                        'stories',
                                        storyId
                                    )
                                );
                            },
                    },
                ]
            );
        };

    // ==========================
    // FORMAT TIME
    // ==========================

    const formatTime = (
        time: any
    ) => {

        if (!time) return '';

        const date =
            time.toDate();

        return date.toLocaleTimeString(
            [],
            {
                hour: '2-digit',
                minute: '2-digit',
            }
        );
    };

    // ==========================
    // PROFILE IMAGE
    // ==========================

    const renderProfileImage =
        (
            image?: string,
            size: number = 65
        ) => {

            if (image) {

                return (
                    <Image
                        source={{
                            uri: image,
                        }}
                        style={{
                            width: size,
                            height: size,
                            borderRadius:
                                size / 2,
                        }}
                    />
                );
            }

            return (

                <View
                    style={[
                        styles.dummyImage,
                        {
                            width: size,
                            height: size,
                            borderRadius:
                                size / 2,
                        },
                    ]}
                >

                    <Ionicons
                        name="person"
                        size={
                            size / 2
                        }
                        color="#FFF"
                    />

                </View>
            );
        };

    // ==========================
    // STORY ITEM
    // ==========================

    const renderStoryItem = ({
        item,
    }: {
        item: StoryType;
    }) => {

        const isMine =
            item.userId ===
            currentUser?.uid;

        return (

            <TouchableOpacity
                style={
                    styles.storyItem
                }
                activeOpacity={0.8}
                onPress={() => {

                    // MY STORY

                    if (isMine) {

                        // NO STORY

                        if (
                            item.media.length === 0
                        ) {

                            pickStory();

                            return;
                        }
                    }

                    // OPEN STORY

                    navigation.navigate(
                        'Story',
                        {
                            stories:
                                item.media,

                            user:
                                item.userName,
                        }
                    );
                }}
                onLongPress={() => {

                    // DELETE OWN STORY

                    if (
                        isMine &&
                        item.media.length > 0
                    ) {

                        deleteStory(
                            item.id
                        );
                    }
                }}
            >

                <View
                    style={
                        styles.storyWrapper
                    }
                >

                    {/* STORY BORDER */}

                    <View
                        style={[
                            styles.storyBorder,

                            isMine &&
                                item.media
                                    .length === 0 && {
                                    borderColor:
                                        '#DDD',
                                },
                        ]}
                    >

                        {/* USER IMAGE */}

                        {item.userImage ? (

                            <Image
                                source={{
                                    uri:
                                        item.userImage,
                                }}
                                style={
                                    styles.storyImage
                                }
                            />

                        ) : (

                            <View
                                style={
                                    styles.dummyImage
                                }
                            >

                                <Ionicons
                                    name="person"
                                    size={32}
                                    color="#FFF"
                                />

                            </View>

                        )}

                    </View>

                    {/* ADD STORY BUTTON */}

                    {isMine && (

                        <TouchableOpacity
                            style={
                                styles.addStoryBtn
                            }
                            onPress={
                                pickStory
                            }
                        >

                            <Ionicons
                                name="add"
                                size={16}
                                color="#FFF"
                            />

                        </TouchableOpacity>

                    )}

                </View>

                {/* STORY NAME */}

                <Text
                    style={
                        styles.storyName
                    }
                    numberOfLines={1}
                >
                    {isMine
                        ? 'Your Story'
                        : item.userName}
                </Text>

            </TouchableOpacity>
        );
    };

    // ==========================
    // CHAT ITEM
    // ==========================

    const renderChatItem = ({
        item,
    }: {
        item: ChatType;
    }) => {

        return (

            <TouchableOpacity
                style={
                    styles.chatItem
                }
                activeOpacity={0.8}
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

                <View>

                    {renderProfileImage(
                        item.image,
                        65
                    )}

                    {item.online && (

                        <View
                            style={
                                styles.onlineDot
                            }
                        />

                    )}

                </View>

                <View
                    style={
                        styles.chatContent
                    }
                >

                    <View
                        style={
                            styles.topRow
                        }
                    >

                        <Text
                            style={
                                styles.chatName
                            }
                            numberOfLines={1}
                        >
                            {item.name}
                        </Text>

                        <Text
                            style={
                                styles.chatTime
                            }
                        >
                            {formatTime(
                                item.lastMessageTime
                            )}
                        </Text>

                    </View>

                    <Text
                        style={
                            styles.chatMessage
                        }
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>

                </View>

            </TouchableOpacity>
        );
    };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <View
                style={
                    styles.loader
                }
            >

                <ActivityIndicator
                    size="large"
                    color="#5B60FF"
                />

            </View>
        );
    }

    // ==========================
    // UI
    // ==========================

    return (

        <SafeAreaView
            style={
                styles.container
            }
        >

            {/* STORIES */}

            <View
                style={{
                    paddingTop: 14,
                    height: 115,
                }}
            >

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                    }}
                    data={[

                        // MY STORY

                        {
                            id:
                                stories.find(
                                    item =>
                                        item.userId ===
                                        currentUser?.uid
                                )?.id ||
                                'myStory',

                            userId:
                                currentUser?.uid ||
                                '',

                            userName:
                                currentUser?.displayName ||
                                'You',

                            userImage:
                                currentUser?.photoURL ||
                                '',

                            media:
                                stories.find(
                                    item =>
                                        item.userId ===
                                        currentUser?.uid
                                )?.media || [],
                        },

                        // OTHER STORIES

                        ...stories.filter(
                            item =>
                                item.userId !==
                                currentUser?.uid
                        ),
                    ]}
                    keyExtractor={item =>
                        item.id
                    }
                    renderItem={
                        renderStoryItem
                    }
                />

            </View>

            {/* CHATS */}

            <FlatList
                data={chats}
                keyExtractor={item =>
                    item.id
                }
                renderItem={
                    renderChatItem
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 120,
                }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ==========================
    // STORIES
    // ==========================

    storyItem: {
        width: 84,
        alignItems: 'center',
        marginRight: 16,
    },

    storyWrapper: {
        position: 'relative',
    },

    storyBorder: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 2.5,
        borderColor: '#FF006A',
        justifyContent: 'center',
        alignItems: 'center',
    },

    storyImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
    },

    storyName: {
        marginTop: 6,
        fontSize: 12,
        color: '#444',
        maxWidth: 74,
    },

    addStoryBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#5B60FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    // ==========================
    // CHAT
    // ==========================

    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 22,
    },

    chatContent: {
        flex: 1,
        marginLeft: 14,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent:
            'space-between',
        alignItems: 'center',
    },

    chatName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111',
        flex: 1,
        marginRight: 8,
    },

    chatTime: {
        fontSize: 12,
        color: '#999',
    },

    chatMessage: {
        marginTop: 4,
        fontSize: 14,
        color: '#777',
    },

    onlineDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#34C759',
        borderWidth: 2,
        borderColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },

    // ==========================
    // DUMMY IMAGE
    // ==========================

    dummyImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#7B61FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

});

