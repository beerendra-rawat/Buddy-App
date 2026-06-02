import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    getDoc,
} from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from
    'expo-file-system/legacy';

import {
    auth,
    db,
} from '../services/firebase';

import AppContainer from
    '../components/common/AppContainer';

import AppInput from
    '../components/common/AppInput';

import UserAvatar from
    '../components/common/UserAvatar';

import {
    COLORS,
} from '../constants/colors';

import BackButton from
    '../components/auth/BackButton';

type MessageItem = {
    id: string;
    text?: string;
    image?: string;
    senderId: string;
    receiverId?: string;
    createdAt?: any;
};

type RouteParams = {
    receiverId: string;
};

export default function MessageScreen() {

    const navigation =
        useNavigation<any>();

    const route =
        useRoute();

    const {
        receiverId,
    } = route.params as RouteParams;

    const currentUserId =
        auth.currentUser?.uid || '';

    const chatId = [
        currentUserId,
        receiverId,
    ]
        .sort()
        .join('_');

    const flatListRef =
        useRef<FlatList>(null);

    const [message, setMessage] =
        useState('');

    const [messages, setMessages] =
        useState<MessageItem[]>([]);

    const [userName, setUserName] =
        useState('User');

    const [userImage, setUserImage] =
        useState('');

    const [uploading, setUploading] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState<string | null>(null);

    // ==========================
    // GET USER DATA
    // ==========================

    useEffect(() => {

        if (!receiverId) {
            return;
        }

        const getUserData =
            async () => {

                try {

                    const userSnap =
                        await getDoc(
                            doc(
                                db,
                                'users',
                                receiverId
                            )
                        );

                    if (
                        userSnap.exists()
                    ) {

                        const data =
                            userSnap.data();

                        setUserName(
                            data?.name ||
                            'User'
                        );

                        setUserImage(
                            data?.profileImage ||
                            data?.photoURL ||
                            data?.image ||
                            ''
                        );
                    }

                } catch (error) {

                    console.log(
                        error
                    );
                }
            };

        getUserData();

    }, [receiverId]);

    // ==========================
    // GET MESSAGES
    // ==========================

    useEffect(() => {

        const q = query(
            collection(
                db,
                'chats',
                chatId,
                'messages'
            ),
            orderBy(
                'createdAt',
                'asc'
            )
        );

        const unsubscribe =
            onSnapshot(
                q,
                snapshot => {

                    const allMessages =
                        snapshot.docs.map(
                            doc => ({
                                id: doc.id,
                                ...doc.data(),
                            })
                        ) as MessageItem[];

                    setMessages(
                        allMessages
                    );

                    setTimeout(() => {

                        flatListRef.current?.scrollToEnd(
                            {
                                animated: true,
                            }
                        );

                    }, 200);
                }
            );

        return unsubscribe;

    }, []);

    // ==========================
    // CLOUDINARY
    // ==========================

    const uploadImageToCloudinary =
        async (
            imageUri: string
        ) => {

            try {

                const base64 =
                    await FileSystem.readAsStringAsync(
                        imageUri,
                        {
                            encoding:
                                FileSystem.EncodingType.Base64,
                        }
                    );

                const base64Img =
                    `data:image/jpeg;base64,${base64}`;

                const response =
                    await fetch(
                        'https://api.cloudinary.com/v1_1/dbtjsq1pm/image/upload',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json',
                            },

                            body: JSON.stringify({
                                file: base64Img,

                                upload_preset:
                                    'buddychat',
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (
                    data.secure_url
                ) {

                    return data.secure_url;
                }

                throw new Error(
                    data?.error
                        ?.message ||
                        'Upload failed'
                );

            } catch (error) {

                console.log(
                    error
                );

                throw error;
            }
        };

    // ==========================
    // SEND TEXT
    // ==========================

    const sendMessage =
        async () => {

            if (
                !message.trim()
            ) {
                return;
            }

            try {

                const newMessage =
                    message.trim();

                await setDoc(
                    doc(
                        db,
                        'chats',
                        chatId
                    ),
                    {
                        users: [
                            currentUserId,
                            receiverId,
                        ],

                        lastMessage:
                            newMessage,

                        lastMessageTime:
                            serverTimestamp(),
                    },
                    {
                        merge: true,
                    }
                );

                await addDoc(
                    collection(
                        db,
                        'chats',
                        chatId,
                        'messages'
                    ),
                    {
                        text:
                            newMessage,

                        senderId:
                            currentUserId,

                        receiverId,

                        createdAt:
                            serverTimestamp(),
                    }
                );

                setMessage('');

            } catch (error) {

                console.log(
                    error
                );

                Alert.alert(
                    'Error',
                    'Message not sent'
                );
            }
        };

    // ==========================
    // PICK IMAGE
    // ==========================

    const pickImage =
        async () => {

            try {

                const permission =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (
                    permission.status !==
                    'granted'
                ) {

                    Alert.alert(
                        'Permission Required'
                    );

                    return;
                }

                const result =
                    await ImagePicker.launchImageLibraryAsync(
                        {
                            mediaTypes:
                                ImagePicker.MediaTypeOptions.Images,

                            allowsEditing:
                                true,

                            aspect: [4, 4],

                            quality: 0.7,
                        }
                    );

                if (
                    result.canceled
                ) {
                    return;
                }

                setSelectedImage(
                    result.assets[0]
                        .uri
                );

            } catch (error) {

                console.log(
                    error
                );
            }
        };

    // ==========================
    // SEND IMAGE
    // ==========================

    const sendImageMessage =
        async () => {

            if (
                !selectedImage
            ) {
                return;
            }

            try {

                setUploading(
                    true
                );

                const imageUrl =
                    await uploadImageToCloudinary(
                        selectedImage
                    );

                await setDoc(
                    doc(
                        db,
                        'chats',
                        chatId
                    ),
                    {
                        users: [
                            currentUserId,
                            receiverId,
                        ],

                        lastMessage:
                            '📷 Photo',

                        lastMessageTime:
                            serverTimestamp(),
                    },
                    {
                        merge: true,
                    }
                );

                await addDoc(
                    collection(
                        db,
                        'chats',
                        chatId,
                        'messages'
                    ),
                    {
                        image:
                            imageUrl,

                        senderId:
                            currentUserId,

                        receiverId,

                        createdAt:
                            serverTimestamp(),
                    }
                );

                setSelectedImage(
                    null
                );

            } catch (error) {

                console.log(
                    error
                );

                Alert.alert(
                    'Error',
                    'Image not sent'
                );

            } finally {

                setUploading(
                    false
                );
            }
        };

    // ==========================
    // RENDER MESSAGE
    // ==========================

    const renderMessage = ({
        item,
    }: {
        item: MessageItem;
    }) => {

        const isMe =
            item.senderId ===
            currentUserId;

        return (

            <View
                style={[
                    styles.messageWrapper,

                    isMe
                        ? styles.myWrapper
                        : styles.otherWrapper,
                ]}
            >

                {
                    !isMe && (

                        <UserAvatar
                            image={
                                userImage
                            }
                            size={40}
                        />

                    )
                }

                <View
                    style={
                        styles.messageContent
                    }
                >

                    {
                        !isMe && (

                            <Text
                                style={
                                    styles.userName
                                }
                            >
                                {userName}
                            </Text>

                        )
                    }

                    <View
                        style={[
                            styles.messageBubble,

                            isMe
                                ? styles.myMessage
                                : styles.otherMessage,
                        ]}
                    >

                        {
                            item.text && (

                                <Text
                                    style={[
                                        styles.messageText,

                                        {
                                            color:
                                                isMe
                                                    ? '#FFFFFF'
                                                    : COLORS.textPrimary,
                                        },
                                    ]}
                                >
                                    {
                                        item.text
                                    }
                                </Text>

                            )
                        }

                        {
                            item.image && (

                                <Image
                                    source={{
                                        uri:
                                            item.image,
                                    }}
                                    style={
                                        styles.chatImage
                                    }
                                />

                            )
                        }

                    </View>

                </View>

            </View>
        );
    };

    // ==========================
    // UI
    // ==========================

    return (

        <AppContainer>

            <KeyboardAvoidingView
                style={
                    styles.flex
                }
                behavior={
                    Platform.OS ===
                    'ios'
                        ? 'padding'
                        : undefined
                }
            >

                {/* HEADER */}

                <View
                    style={
                        styles.header
                    }
                >

                    <BackButton
                        onPress={() =>
                            navigation.goBack()
                        }
                    />

                    <View
                        style={
                            styles.profileSection
                        }
                    >

                        <UserAvatar
                            image={
                                userImage
                            }
                            size={50}
                        />

                        <View
                            style={
                                styles.headerInfo
                            }
                        >

                            <Text
                                style={
                                    styles.headerName
                                }
                            >
                                {userName}
                            </Text>

                            <Text
                                style={
                                    styles.activeText
                                }
                            >
                                Online
                            </Text>

                        </View>

                    </View>

                </View>

                {/* CHAT */}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item =>
                        item.id
                    }
                    renderItem={
                        renderMessage
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.chatContainer
                    }
                />

                {/* IMAGE PREVIEW */}

                {
                    selectedImage && (

                        <View
                            style={
                                styles.previewContainer
                            }
                        >

                            <Image
                                source={{
                                    uri:
                                        selectedImage,
                                }}
                                style={
                                    styles.previewImage
                                }
                            />

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={
                                    styles.closePreview
                                }
                                onPress={() =>
                                    setSelectedImage(
                                        null
                                    )
                                }
                            >

                                <Ionicons
                                    name="close"
                                    size={20}
                                    color="#FFFFFF"
                                />

                            </TouchableOpacity>

                        </View>

                    )
                }

                {/* UPLOADING */}

                {
                    uploading && (

                        <View
                            style={
                                styles.uploadingContainer
                            }
                        >

                            <ActivityIndicator
                                size="small"
                                color={
                                    COLORS.primary
                                }
                            />

                            <Text
                                style={
                                    styles.uploadingText
                                }
                            >
                                Uploading image...
                            </Text>

                        </View>

                    )
                }

                {/* INPUT */}

                <View
                    style={
                        styles.inputContainer
                    }
                >

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={
                            pickImage
                        }
                    >

                        <Ionicons
                            name="image"
                            size={24}
                            color="#555"
                        />

                    </TouchableOpacity>

                    <View
                        style={
                            styles.inputWrapper
                        }
                    >

                        <AppInput
                            placeholder="Write message..."
                            value={message}
                            onChangeText={
                                setMessage
                            }
                            multiline
                        />

                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={
                            styles.sendButton
                        }
                        onPress={
                            selectedImage
                                ? sendImageMessage
                                : sendMessage
                        }
                    >

                        {
                            uploading ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />

                            ) : (

                                <Ionicons
                                    name="send"
                                    size={20}
                                    color="#FFFFFF"
                                />

                            )
                        }

                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    flex: {
        flex: 1,
    },

    header: {
        flexDirection:
            'row',

        alignItems:
            'center',

        paddingHorizontal: 16,
        paddingVertical: 14,

        backgroundColor:
            COLORS.white,

        borderBottomWidth: 1,

        borderBottomColor:
            '#F1F1F1',
    },

    profileSection: {
        flex: 1,

        flexDirection:
            'row',

        alignItems:
            'center',

        marginLeft: 14,
    },

    headerInfo: {
        marginLeft: 12,
    },

    headerName: {
        fontSize: 17,
        fontWeight: '700',

        color:
            COLORS.textPrimary,
    },

    activeText: {
        marginTop: 2,

        fontSize: 13,

        color:
            '#22C55E',
    },

    chatContainer: {
        paddingTop: 20,
        paddingBottom: 10,
    },

    messageWrapper: {
        paddingHorizontal: 16,

        marginBottom: 18,

        flexDirection:
            'row',

        alignItems:
            'flex-end',
    },

    myWrapper: {
        justifyContent:
            'flex-end',
    },

    otherWrapper: {
        justifyContent:
            'flex-start',
    },

    messageContent: {
        maxWidth: '78%',

        marginLeft: 10,
    },

    userName: {
        marginBottom: 6,

        fontSize: 13,
        fontWeight: '700',

        color: '#555',
    },

    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,

        borderRadius: 18,
    },

    myMessage: {
        backgroundColor:
            COLORS.primary,

        borderBottomRightRadius: 6,
    },

    otherMessage: {
        backgroundColor:
            COLORS.white,

        borderBottomLeftRadius: 6,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },

    chatImage: {
        width: 220,
        height: 220,

        borderRadius: 16,

        marginTop: 6,
    },

    previewContainer: {
        marginLeft: 16,
        marginBottom: 10,

        position: 'relative',
    },

    previewImage: {
        width: 120,
        height: 120,

        borderRadius: 16,
    },

    closePreview: {
        width: 28,
        height: 28,

        borderRadius: 14,

        backgroundColor:
            '#000000',

        justifyContent:
            'center',

        alignItems:
            'center',

        position: 'absolute',

        top: -8,
        right: -8,
    },

    uploadingContainer: {
        flexDirection:
            'row',

        alignItems:
            'center',

        justifyContent:
            'center',

        marginBottom: 10,
    },

    uploadingText: {
        marginLeft: 10,

        fontSize: 14,

        color: '#555',
    },

    inputContainer: {
        flexDirection:
            'row',

        alignItems:
            'center',

        paddingHorizontal: 14,
        paddingVertical: 12,

        backgroundColor:
            COLORS.white,

        borderTopWidth: 1,

        borderTopColor:
            '#EEEEEE',
    },

    inputWrapper: {
        flex: 1,
        marginHorizontal: 12,
    },

    sendButton: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor:
            COLORS.primary,

        justifyContent:
            'center',

        alignItems:
            'center',
    },

});
