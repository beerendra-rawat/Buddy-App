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
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

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

import {
    auth,
    db,
} from '../services/firebase';

import BackButton from '../components/auth/BackButton';

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

const DummyAvatar = ({
    size = 50,
}: {
    size?: number;
}) => (

    <View
        style={[
            styles.dummyAvatar,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
            },
        ]}
    >

        <Ionicons
            name="person"
            size={size * 0.5}
            color="#FFFFFF"
        />

    </View>
);

export default function MessageScreen() {

    const navigation = useNavigation();

    const route = useRoute();

    const { receiverId } =
        route.params as RouteParams;

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

    // GET USER DATA
    useEffect(() => {

        if (!receiverId) return;

        const getUserData = async () => {

            try {

                const userSnap = await getDoc(
                    doc(db, 'users', receiverId)
                );

                if (userSnap.exists()) {

                    const data = userSnap.data();

                    setUserName(
                        data?.name || 'User'
                    );

                    setUserImage(
                        data?.profileImage || ''
                    );
                }

            } catch (error) {

                console.log(
                    'Get User Error:',
                    error
                );
            }
        };

        getUserData();

    }, [receiverId]);

    // GET MESSAGES
    useEffect(() => {

        const q = query(
            collection(
                db,
                'chats',
                chatId,
                'messages'
            ),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe =
            onSnapshot(q, (snapshot) => {

                const allMessages =
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as MessageItem[];

                setMessages(allMessages);

                setTimeout(() => {

                    flatListRef.current?.scrollToEnd({
                        animated: true,
                    });

                }, 200);
            });

        return unsubscribe;

    }, []);

    // CLOUDINARY IMAGE UPLOAD
    const uploadImageToCloudinary = async (
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

            const response = await fetch(
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

            if (data.secure_url) {

                return data.secure_url;
            }

            throw new Error(
                data?.error?.message ||
                'Upload failed'
            );

        } catch (error) {

            console.log(
                'Cloudinary Upload Error:',
                error
            );

            throw error;
        }
    };

    // SEND TEXT MESSAGE
    // SEND TEXT MESSAGE
    const sendMessage = async () => {

        if (!message.trim()) return;

        try {

            const newMessage =
                message.trim();

            // =========================
            // UPDATE CHAT DOCUMENT
            // =========================

            await setDoc(
                doc(db, 'chats', chatId),
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
                { merge: true }
            );

            // =========================
            // UPDATE CURRENT USER
            // =========================

            await setDoc(
                doc(db, 'users', currentUserId),
                {
                    lastMessage:
                        newMessage,

                    lastMessageTime:
                        serverTimestamp(),
                },
                { merge: true }
            );

            // =========================
            // UPDATE RECEIVER USER
            // =========================

            await setDoc(
                doc(db, 'users', receiverId),
                {
                    lastMessage:
                        newMessage,

                    lastMessageTime:
                        serverTimestamp(),
                },
                { merge: true }
            );

            // =========================
            // SAVE MESSAGE
            // =========================

            await addDoc(
                collection(
                    db,
                    'chats',
                    chatId,
                    'messages'
                ),
                {
                    text: newMessage,

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
                'Send Message Error:',
                error
            );

            Alert.alert(
                'Error',
                'Message not sent'
            );
        }
    };

    // PICK IMAGE
    const pickImage = async () => {

        try {

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (
                permission.status !==
                'granted'
            ) {

                Alert.alert(
                    'Permission Required',
                    'Please allow gallery permission.'
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

            if (result.canceled)
                return;

            setSelectedImage(
                result.assets[0].uri
            );

        } catch (error) {

            console.log(
                'Pick Image Error:',
                error
            );
        }
    };

    // SEND IMAGE
    // SEND IMAGE
    const sendImageMessage =
        async () => {

            if (!selectedImage)
                return;

            try {

                setUploading(true);

                const imageUrl =
                    await uploadImageToCloudinary(
                        selectedImage
                    );

                // =========================
                // UPDATE CHAT DOCUMENT
                // =========================

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
                    { merge: true }
                );

                // =========================
                // UPDATE CURRENT USER
                // =========================

                await setDoc(
                    doc(
                        db,
                        'users',
                        currentUserId
                    ),
                    {
                        lastMessage:
                            '📷 Photo',

                        lastMessageTime:
                            serverTimestamp(),
                    },
                    { merge: true }
                );

                // =========================
                // UPDATE RECEIVER USER
                // =========================

                await setDoc(
                    doc(
                        db,
                        'users',
                        receiverId
                    ),
                    {
                        lastMessage:
                            '📷 Photo',

                        lastMessageTime:
                            serverTimestamp(),
                    },
                    { merge: true }
                );

                // =========================
                // SAVE IMAGE MESSAGE
                // =========================

                await addDoc(
                    collection(
                        db,
                        'chats',
                        chatId,
                        'messages'
                    ),
                    {
                        image: imageUrl,

                        senderId:
                            currentUserId,

                        receiverId,

                        createdAt:
                            serverTimestamp(),
                    }
                );

                setSelectedImage(null);

            } catch (error) {

                console.log(
                    'Image Upload Error:',
                    error
                );

                Alert.alert(
                    'Error',
                    'Image not sent'
                );

            } finally {

                setUploading(false);
            }
        };

    // RENDER MESSAGE
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

                {!isMe &&
                    (userImage ? (
                        <Image
                            source={{
                                uri: userImage,
                            }}
                            style={
                                styles.messageAvatar
                            }
                        />
                    ) : (
                        <DummyAvatar
                            size={40}
                        />
                    ))}

                <View
                    style={
                        styles.messageContent
                    }
                >

                    {!isMe && (
                        <Text
                            style={
                                styles.userName
                            }
                        >
                            {userName}
                        </Text>
                    )}

                    <View
                        style={[
                            styles.messageBubble,

                            isMe
                                ? styles.myMessage
                                : styles.otherMessage,
                        ]}
                    >

                        {item.text && (
                            <Text
                                style={[
                                    styles.messageText,
                                    {
                                        color:
                                            isMe
                                                ? '#FFF'
                                                : '#111',
                                    },
                                ]}
                            >
                                {item.text}
                            </Text>
                        )}

                        {item.image && (
                            <Image
                                source={{
                                    uri: item.image,
                                }}
                                style={
                                    styles.chatImage
                                }
                            />
                        )}

                    </View>

                </View>

            </View>
        );
    };

    return (

        <SafeAreaView
            style={styles.container}
            edges={[
                'top',
                'bottom',
            ]}
        >

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS ===
                        'ios'
                        ? 'padding'
                        : undefined
                }
            >

                {/* HEADER */}
                <View
                    style={styles.header}
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

                        {userImage ? (
                            <Image
                                source={{
                                    uri: userImage,
                                }}
                                style={
                                    styles.profileImage
                                }
                            />
                        ) : (
                            <DummyAvatar
                                size={50}
                            />
                        )}

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
                    keyExtractor={(
                        item
                    ) => item.id}
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
                {selectedImage && (

                    <View
                        style={
                            styles.previewContainer
                        }
                    >

                        <Image
                            source={{
                                uri: selectedImage,
                            }}
                            style={
                                styles.previewImage
                            }
                        />

                        <TouchableOpacity
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
                                color="#FFF"
                            />

                        </TouchableOpacity>

                    </View>
                )}

                {/* UPLOADING */}
                {uploading && (

                    <View
                        style={
                            styles.uploadingContainer
                        }
                    >

                        <ActivityIndicator
                            size="small"
                            color="#6487E8"
                        />

                        <Text
                            style={
                                styles.uploadingText
                            }
                        >
                            Uploading image...
                        </Text>

                    </View>
                )}

                {/* INPUT */}
                <View
                    style={
                        styles.inputContainer
                    }
                >

                    <TouchableOpacity
                        onPress={pickImage}
                    >

                        <Ionicons
                            name="image"
                            size={24}
                            color="#555"
                        />

                    </TouchableOpacity>

                    <View
                        style={styles.inputBox}
                    >

                        <TextInput
                            placeholder="Write message..."
                            placeholderTextColor="#999"
                            value={message}
                            onChangeText={
                                setMessage
                            }
                            style={
                                styles.input
                            }
                            multiline
                        />

                    </View>

                    <TouchableOpacity
                        style={
                            styles.sendButton
                        }
                        onPress={
                            selectedImage
                                ? sendImageMessage
                                : sendMessage
                        }
                    >

                        {uploading ? (

                            <ActivityIndicator
                                size="small"
                                color="#FFF"
                            />

                        ) : (

                            <Ionicons
                                name="send"
                                size={20}
                                color="#FFF"
                            />

                        )}

                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    flex: {
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor:
            '#F7F8FA',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor:
            '#F1F1F1',
    },

    profileSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 14,
    },

    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    dummyAvatar: {
        backgroundColor:
            '#6487E8',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerInfo: {
        marginLeft: 12,
    },

    headerName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    activeText: {
        fontSize: 13,
        color: '#22C55E',
        marginTop: 2,
    },

    chatContainer: {
        paddingTop: 20,
        paddingBottom: 10,
    },

    messageWrapper: {
        paddingHorizontal: 16,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'flex-end',
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
    },

    messageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },

    userName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#555',
        marginBottom: 6,
    },

    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
    },

    myMessage: {
        backgroundColor:
            '#6487E8',
        borderBottomRightRadius: 6,
    },

    otherMessage: {
        backgroundColor: '#FFF',
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
        position: 'absolute',
        top: -8,
        right: -8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor:
            '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },

    inputBox: {
        flex: 1,
        minHeight: 50,
        backgroundColor:
            '#F2F3F5',
        borderRadius: 16,
        justifyContent: 'center',
        paddingHorizontal: 14,
        marginHorizontal: 12,
    },

    input: {
        fontSize: 16,
        color: '#111',
        paddingVertical: 10,
    },

    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor:
            '#6487E8',
        justifyContent: 'center',
        alignItems: 'center',
    },

    uploadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    uploadingText: {
        marginLeft: 10,
        color: '#555',
        fontSize: 14,
    },
});
