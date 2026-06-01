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

import {
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons';

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
    ref,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';

import {
    auth,
    db,
    storage,
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

type UserData = {
    name?: string;
    image?: string;
};

export default function MessageScreen() {

    const navigation = useNavigation<any>();

    const route = useRoute<any>();

    const flatListRef =
        useRef<FlatList<MessageItem>>(null);

    const receiverId =
        route.params?.receiverId || '';

    const currentUser = auth.currentUser;

    const currentUserId =
        currentUser?.uid || '';

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

    const chatId =
        currentUserId && receiverId
            ? [currentUserId, receiverId]
                .sort()
                .join('_')
            : null;

    // GET USER DATA
    useEffect(() => {

        const getUserData = async () => {

            try {

                const userRef = doc(
                    db,
                    'users',
                    receiverId
                );

                const userSnap =
                    await getDoc(userRef);

                if (userSnap.exists()) {

                    const data =
                        userSnap.data() as UserData;

                    setUserName(
                        data?.name || 'User'
                    );

                    setUserImage(
                        data?.image || ''
                    );
                }

            } catch (error) {
                console.log(error);
            }
        };

        if (receiverId) {
            getUserData();
        }

    }, [receiverId]);

    // GET MESSAGES
    useEffect(() => {

        if (!chatId) return;

        const q = query(
            collection(
                db,
                'chats',
                chatId,
                'messages'
            ),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(
            q,
            snapshot => {

                const allMessages =
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as MessageItem[];

                setMessages(allMessages);

                setTimeout(() => {

                    flatListRef.current?.scrollToEnd({
                        animated: true,
                    });

                }, 200);
            }
        );

        return unsubscribe;

    }, [chatId]);

    // SEND TEXT MESSAGE
    const sendMessage = async () => {

        try {

            if (!message.trim()) return;

            const newMessage =
                message.trim();

            await setDoc(
                doc(db, 'chats', chatId!),
                {
                    users: [
                        currentUserId,
                        receiverId,
                    ],

                    lastMessage: newMessage,

                    lastMessageTime:
                        serverTimestamp(),
                },
                { merge: true }
            );

            await addDoc(
                collection(
                    db,
                    'chats',
                    chatId!,
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

            console.log(error);

            Alert.alert(
                'Error',
                'Message not sent'
            );
        }
    };

    // UPLOAD IMAGE TO FIREBASE STORAGE
    const uploadImageToFirebase =
        async (uri: string) => {

            const response =
                await fetch(uri);

            const blob =
                await response.blob();

            const fileName =
                `chatImages/${Date.now()}`;

            const storageRef =
                ref(storage, fileName);

            await uploadBytes(
                storageRef,
                blob
            );

            const downloadURL =
                await getDownloadURL(
                    storageRef
                );

            return downloadURL;
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
                    'Please allow gallery access'
                );

                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:
                        ImagePicker.MediaTypeOptions.Images,

                    allowsEditing: true,

                    quality: 0.7,
                });

            if (!result.canceled) {

                setUploading(true);

                const imageUri =
                    result.assets[0].uri;

                // UPLOAD IMAGE
                const imageUrl =
                    await uploadImageToFirebase(
                        imageUri
                    );

                // SAVE MESSAGE
                await setDoc(
                    doc(db, 'chats', chatId!),
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

                await addDoc(
                    collection(
                        db,
                        'chats',
                        chatId!,
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

                setUploading(false);
            }

        } catch (error) {

            console.log(error);

            setUploading(false);

            Alert.alert(
                'Error',
                'Image not uploaded'
            );
        }
    };

    // DUMMY AVATAR
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

    // RENDER MESSAGE
    const renderMessage = ({
        item,
    }: {
        item: MessageItem;
    }) => {

        const isMe =
            item.senderId === currentUserId;

        return (
            <View
                style={[
                    styles.messageWrapper,

                    isMe
                        ? styles.myWrapper
                        : styles.otherWrapper,
                ]}
            >

                {!isMe && (
                    <>
                        {userImage ? (
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
                        )}
                    </>
                )}

                <View
                    style={{
                        maxWidth: '78%',
                    }}
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

                        {item.text ? (
                            <Text
                                style={[
                                    styles.messageText,

                                    {
                                        color: isMe
                                            ? '#fff'
                                            : '#111',
                                    },
                                ]}
                            >
                                {item.text}
                            </Text>
                        ) : null}

                        {item.image ? (
                            <Image
                                source={{
                                    uri: item.image,
                                }}
                                style={
                                    styles.chatImage
                                }
                            />
                        ) : null}

                    </View>

                </View>

            </View>
        );
    };

    return (

        <SafeAreaView
            style={styles.container}
            edges={['top', 'bottom']}
        >

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >

                {/* HEADER */}
                <View style={styles.header}>

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
                            style={{
                                marginLeft: 12,
                            }}
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
                    renderItem={renderMessage}
                    showsVerticalScrollIndicator={
                        false
                    }
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 10,
                    }}
                />

                {/* LOADING */}
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
                            style={styles.input}
                            multiline
                        />

                        <TouchableOpacity>
                            <MaterialIcons
                                name="emoji-emotions"
                                size={22}
                                color="#777"
                            />
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                        style={
                            styles.sendButton
                        }
                        onPress={sendMessage}
                    >

                        <Ionicons
                            name="send"
                            size={20}
                            color="#fff"
                        />

                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
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
        backgroundColor: '#6487E8',
        justifyContent: 'center',
        alignItems: 'center',
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

    messageWrapper: {
        paddingHorizontal: 16,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    myWrapper: {
        justifyContent: 'flex-end',
    },

    otherWrapper: {
        justifyContent: 'flex-start',
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
        backgroundColor: '#6487E8',
        borderBottomRightRadius: 6,
    },

    otherMessage: {
        backgroundColor: '#FFFFFF',
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

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },

    inputBox: {
        flex: 1,
        minHeight: 50,
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        marginHorizontal: 12,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
        paddingVertical: 10,
    },

    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6487E8',
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