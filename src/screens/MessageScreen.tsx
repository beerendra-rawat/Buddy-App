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
} from 'react-native';

import {
    Ionicons,
    Feather,
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
} from 'firebase/firestore';

import {
    auth,
    db,
} from '../services/firebase';

type MessageItem = {
    id: string;
    text: string;
    senderId: string;
    receiverId?: string;
    createdAt?: any;
};

type MessageRouteParams = {
    userName?: string;
    userImage?: string;
    receiverId: string;
};

export default function MessageScreen() {

    const navigation = useNavigation<any>();

    const route = useRoute<any>();

    const flatListRef = useRef<FlatList<MessageItem>>(null);

    const {
        userName = 'User',
        userImage = 'https://i.pravatar.cc/150?img=12',
        receiverId = '',
    } = (route.params || {}) as MessageRouteParams;

    const currentUser = auth.currentUser;

    const currentUserId = currentUser?.uid || '';

    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState<MessageItem[]>([]);

    // FIXED CHAT ID
    const chatId =
        currentUserId && receiverId
            ? [currentUserId, receiverId]
                .sort()
                .join('_')
            : null;

    // GET ALL MESSAGES
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
            },
            error => {
                console.log(
                    'GET MESSAGE ERROR:',
                    error
                );
            }
        );

        return unsubscribe;

    }, [chatId]);

    // SEND MESSAGE
    const sendMessage = async () => {

        try {

            if (!currentUserId) {
                Alert.alert(
                    'Error',
                    'User not logged in'
                );
                return;
            }

            if (!receiverId) {
                Alert.alert(
                    'Error',
                    'Receiver not found'
                );
                return;
            }

            if (!message.trim()) {
                return;
            }

            const newMessage = message.trim();

            console.log({
                currentUserId,
                receiverId,
                chatId,
            });

            // CREATE CHAT
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

            // ADD MESSAGE
            await addDoc(
                collection(
                    db,
                    'chats',
                    chatId!,
                    'messages'
                ),
                {
                    text: newMessage,

                    senderId: currentUserId,

                    receiverId: receiverId,

                    createdAt:
                        serverTimestamp(),
                }
            );

            setMessage('');

            console.log('MESSAGE SENT');

        } catch (error) {

            console.log(
                'SEND MESSAGE ERROR:',
                error
            );

            Alert.alert(
                'Error',
                'Message not sent'
            );
        }
    };

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
                    <Image
                        source={{
                            uri:
                                userImage &&
                                    userImage.trim() !== ''
                                    ? userImage
                                    : 'https://i.pravatar.cc/150?img=12',
                        }}
                        style={styles.profileImage}
                    />
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

                    </View>

                </View>

            </View>
        );
    };

    return (

        <SafeAreaView style={styles.container}>

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

                    <TouchableOpacity
                        onPress={() =>
                            navigation.goBack()
                        }
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#111"
                        />
                    </TouchableOpacity>

                    <View
                        style={
                            styles.profileSection
                        }
                    >

                        <Image
                            source={{
                                uri: userImage,
                            }}
                            style={
                                styles.profileImage
                            }
                        />

                        <View>

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

                    <View
                        style={
                            styles.headerIcons
                        }
                    >

                        <TouchableOpacity
                            style={
                                styles.iconButton
                            }
                        >
                            <Feather
                                name="phone"
                                size={22}
                                color="#111"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={
                                styles.iconButton
                            }
                        >
                            <Feather
                                name="video"
                                size={22}
                                color="#111"
                            />
                        </TouchableOpacity>

                    </View>

                </View>

                {/* MESSAGES */}
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
                        paddingVertical: 20,
                    }}
                />

                {/* INPUT */}
                <View
                    style={
                        styles.inputContainer
                    }
                >

                    <TouchableOpacity>
                        <Feather
                            name="paperclip"
                            size={22}
                            color="#111"
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
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },

    profileSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },

    profileImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
    },

    headerName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
    },

    activeText: {
        fontSize: 13,
        color: '#22C55E',
        marginTop: 2,
    },

    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconButton: {
        marginLeft: 14,
    },

    messageWrapper: {
        paddingHorizontal: 16,
        marginBottom: 18,
        flexDirection: 'row',
    },

    myWrapper: {
        justifyContent: 'flex-end',
    },

    otherWrapper: {
        justifyContent: 'flex-start',
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
        marginTop: 22,
    },

    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },

    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 13,
        borderRadius: 18,
    },

    myMessage: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 5,
    },

    otherMessage: {
        backgroundColor: '#ECEFF3',
        borderBottomLeftRadius: 5,
    },

    messageText: {
        fontSize: 16,
        lineHeight: 22,
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
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

});