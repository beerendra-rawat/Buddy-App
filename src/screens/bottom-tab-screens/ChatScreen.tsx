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
    updateDoc,
    where,
    getDocs,
} from 'firebase/firestore';

import {
    uploadImageToCloudinary,
} from '../../services/cloudinary';

import {
    useNavigation,
} from '@react-navigation/native';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    auth,
    db,
} from '../../services/firebase';

import AppContainer from '../../components/common/AppContainer';

import SkeletonLoader from '../../components/common/SkeletonLoader';

import UserAvatar from '../../components/common/UserAvatar';

import ChatItem from '../../components/chat/ChatItem';

import { COLORS, } from '../../constants/colors';

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

    const navigation =
        useNavigation<any>();

    const currentUser =
        auth.currentUser;

    const [stories, setStories] =
        useState<StoryType[]>([]);

    const [chats, setChats] =
        useState<ChatType[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [myData, setMyData] =
        useState<any>(null);

    // ==========================
    // GET CURRENT USER
    // ==========================

    useEffect(() => {

        if (!currentUser?.uid) {
            return;
        }

        const unsubscribe =
            onSnapshot(
                doc(
                    db,
                    'users',
                    currentUser.uid
                ),
                snapshot => {

                    if (snapshot.exists()) {

                        setMyData(
                            snapshot.data()
                        );
                    }
                }
            );

        return () =>
            unsubscribe();

    }, []);

    // ==========================
    // STORIES
    // ==========================

    // ==========================
    // STORIES
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

                const groupedStories: any = {};

                for (const item of snapshot.docs) {

                    const data = item.data();

                    const expireTime =
                        data?.expiresAt
                            ?.toDate()
                            ?.getTime?.() || 0;

                    // AUTO DELETE EXPIRED STORY
                    if (expireTime <= now) {

                        await deleteDoc(
                            doc(db, 'stories', item.id)
                        );

                        continue;
                    }

                    let profileImage = '';

                    try {

                        const userSnap = await getDoc(
                            doc(
                                db,
                                'users',
                                data.userId
                            )
                        );

                        if (userSnap.exists()) {

                            const userData =
                                userSnap.data();

                            profileImage =
                                userData?.photoURL ||
                                userData?.profileImage ||
                                '';
                        }

                    } catch (error) {

                        console.log(
                            'Story User Error:',
                            error
                        );
                    }

                    // GROUP SAME USER STORIES
                    if (
                        groupedStories[data.userId]
                    ) {

                        groupedStories[
                            data.userId
                        ].media.push(
                            ...(data.media || [])
                        );

                    } else {

                        groupedStories[
                            data.userId
                        ] = {

                            id: item.id,

                            userId: data.userId,

                            userName:
                                data.userName ||
                                'User',

                            userImage:
                                profileImage,

                            media:
                                data.media || [],
                        };
                    }
                }

                setStories(
                    Object.values(
                        groupedStories
                    ) as StoryType[]
                );
            }
        );

        return () => unsubscribe();

    }, []);

    // ==========================
    // CHATS
    // ==========================

    useEffect(() => {

        if (!currentUser?.uid) {
            return;
        }

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
                            ChatType[] = [];

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

                            if (!receiverId) {
                                continue;
                            }

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
                            ) {
                                continue;
                            }

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
                                    userData?.photoURL ||
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

                    } catch (error) {

                        console.log(
                            'Chat Error:',
                            error
                        );

                    } finally {

                        setLoading(false);
                    }
                }
            );

        return () =>
            unsubscribe();

    }, []);

    // ==========================
    // PICK STORY
    // ==========================

    // ==========================
    // PICK STORY
    // ==========================

    const pickStory = async () => {

        try {

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:
                        ImagePicker.MediaTypeOptions.All,

                    allowsMultipleSelection: true,

                    quality: 1,
                });

            if (result.canceled) {
                return;
            }

            const newMedia: MediaType[] = [];

            for (const asset of result.assets) {

                let mediaUrl = asset.uri;

                if (asset.type !== 'video') {

                    mediaUrl =
                        await uploadImageToCloudinary(
                            asset.uri
                        );
                }

                newMedia.push({

                    type:
                        asset.type === 'video'
                            ? 'video'
                            : 'image',

                    url: mediaUrl,

                    duration:
                        asset.type === 'video'
                            ? 30
                            : 5,
                });
            }

            // CHECK EXISTING STORY
            const q = query(
                collection(db, 'stories'),
                where(
                    'userId',
                    '==',
                    currentUser?.uid
                )
            );

            const querySnapshot =
                await getDocs(q);

            // IF STORY EXISTS -> UPDATE
            if (!querySnapshot.empty) {

                const existingDoc =
                    querySnapshot.docs[0];

                const oldMedia =
                    existingDoc.data().media || [];

                await updateDoc(
                    doc(
                        db,
                        'stories',
                        existingDoc.id
                    ),
                    {

                        media: [
                            ...oldMedia,
                            ...newMedia,
                        ],

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

            } else {

                // CREATE NEW STORY
                await addDoc(
                    collection(db, 'stories'),
                    {

                        userId:
                            currentUser?.uid,

                        userName:
                            myData?.name ||
                            'User',

                        userImage:
                            myData?.photoURL ||
                            myData?.profileImage ||
                            '',

                        media: newMedia,

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
            }

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
    // STORY DATA
    // ==========================

    const storyData =
        useMemo(() => {

            return [

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
                        myData?.name ||
                        'Your Story',

                    userImage:
                        myData?.photoURL ||
                        myData?.profileImage ||
                        '',

                    media:
                        stories.find(
                            item =>
                                item.userId ===
                                currentUser?.uid
                        )?.media || [],
                },

                ...stories.filter(
                    item =>
                        item.userId !==
                        currentUser?.uid
                ),
            ];

        }, [stories, myData]);

    // ==========================
    // STORY ITEM
    // ==========================

    // ==========================
    // STORY ITEM
    // ==========================

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
                activeOpacity={0.8}
                style={styles.storyItem}
                onPress={() => {

                    // ADD STORY
                    if (
                        isMine &&
                        item.media.length === 0
                    ) {

                        pickStory();
                        return;
                    }

                    // OPEN STORY
                    if (
                        item.media &&
                        item.media.length > 0
                    ) {

                        navigation.navigate(
                            'Story',
                            {
                                stories:
                                    item.media.map(
                                        media => ({
                                            ...media,

                                            storyId:
                                                item.id,

                                            userId:
                                                item.userId,

                                            userName:
                                                item.userName,

                                            userImage:
                                                item.userImage,
                                        })
                                    ),

                                user:
                                    item.userName,

                                image:
                                    item.userImage,

                                storyId:
                                    item.id,

                                isMine:
                                    isMine,
                            }
                        );
                    }
                }}
            >

                <View
                    style={
                        styles.storyWrapper
                    }
                >

                    <View
                        style={
                            styles.storyBorder
                        }
                    >

                        <UserAvatar
                            image={
                                item.userImage
                            }
                            size={68}
                        />

                    </View>

                    {/* ADD STORY BUTTON */}

                    {
                        isMine && (

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={
                                    styles.addButton
                                }
                                onPress={
                                    pickStory
                                }
                            >

                                <Ionicons
                                    name="add"
                                    size={16}
                                    color="#FFFFFF"
                                />

                            </TouchableOpacity>

                        )
                    }

                </View>

                <Text
                    numberOfLines={1}
                    style={styles.storyName}
                >
                    {
                        isMine
                            ? 'Your Story'
                            : item.userName
                    }
                </Text>

            </TouchableOpacity>
        );
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    return (

        <AppContainer>

            <View style={styles.storyContainer}>

                <FlatList
                    horizontal
                    data={storyData}
                    renderItem={
                        renderStoryItem
                    }
                    keyExtractor={item =>
                        item.id
                    }
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.storyList
                    }
                />

            </View>

            <FlatList
                data={chats}
                keyExtractor={item =>
                    item.id
                }
                renderItem={({ item }) => (
                    <ChatItem item={item} />
                )}
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.chatList
                }
            />

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    storyContainer: {
        height: 118,
        paddingTop: 14,
    },

    storyList: {
        paddingHorizontal: 16,
    },

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

    addButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor:
            COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor:
            COLORS.white,
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 99,
    },

    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        borderWidth: 2,
        borderColor: COLORS.white,
        zIndex: 99,
    },

    storyName: {
        marginTop: 6,
        fontSize: 12,
        color:
            COLORS.textPrimary,
        maxWidth: 74,
        textAlign: 'center',
    },

    chatList: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 120,
    },

});