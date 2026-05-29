import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    Image,
} from 'react-native';
import {
    Ionicons,
    Feather,
    MaterialIcons,
    AntDesign,
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type MessageType = {
    id: string;
    text?: string;
    time: string;
    sender: 'me' | 'other';
    audio?: boolean;
};

const messages: MessageType[] = [
    {
        id: '1',
        text: 'Hello! Jhon Abraham',
        time: '09:25 AM',
        sender: 'me',
    },
    {
        id: '2',
        text: 'Hello ! Nazrul How are you?',
        time: '09:25 AM',
        sender: 'other',
    },
    {
        id: '3',
        text: 'You did your job well!',
        time: '09:25 AM',
        sender: 'me',
    },
    {
        id: '4',
        text: 'Have a great working week!!',
        time: '09:25 AM',
        sender: 'other',
    },
    {
        id: '5',
        text: 'Hope you like it',
        time: '09:25 AM',
        sender: 'other',
    },
    {
        id: '6',
        time: '09:25 AM',
        sender: 'me',
        audio: true,
    },
];

export default function MessageScreen() {
    const [message, setMessage] = useState('');

    const renderMessage = ({ item }: { item: MessageType }) => {
        const isMe = item.sender === 'me';

        return (
            <View
                style={[
                    styles.messageWrapper,
                    isMe ? styles.myWrapper : styles.otherWrapper,
                ]}
            >
                {!isMe && (
                    <Image
                        source={{
                            uri: 'https://i.pravatar.cc/150?img=12',
                        }}
                        style={styles.avatar}
                    />
                )}

                <View style={{ maxWidth: '78%' }}>
                    {!isMe && (
                        <Text style={styles.userName}>Jhon Abraham</Text>
                    )}

                    {item.audio ? (
                        <View style={styles.audioBubble}>
                            <TouchableOpacity style={styles.playButton}>
                                <AntDesign
                                    name="caret-right"
                                    size={18}
                                    color="#fff"
                                />
                            </TouchableOpacity>

                            <View style={styles.waveContainer}>
                                {Array.from({ length: 22 }).map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.wave,
                                            {
                                                height:
                                                    Math.random() * 16 + 8,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>

                            <Text style={styles.audioTime}>
                                00:16
                            </Text>
                        </View>
                    ) : (
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
                                            : '#222',
                                    },
                                ]}
                            >
                                {item.text}
                            </Text>
                        </View>
                    )}

                    <Text
                        style={[
                            styles.timeText,
                            {
                                textAlign: isMe
                                    ? 'right'
                                    : 'left',
                            },
                        ]}
                    >
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>

                <View style={styles.profileSection}>
                    <View>
                        <Image
                            source={{
                                uri: 'https://i.pravatar.cc/150?img=12',
                            }}
                            style={styles.profileImage}
                        />

                        <View style={styles.onlineDot} />
                    </View>

                    <View>
                        <Text style={styles.headerName}>
                            Jhon Abraham
                        </Text>
                        <Text style={styles.activeText}>
                            Active now
                        </Text>
                    </View>
                </View>

                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather
                            name="phone"
                            size={22}
                            color="#111"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton}>
                        <Feather
                            name="video"
                            size={22}
                            color="#111"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Today */}
            <View style={styles.todayContainer}>
                <Text style={styles.todayText}>Today</Text>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TouchableOpacity>
                    <Feather
                        name="paperclip"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>

                <View style={styles.inputBox}>
                    <TextInput
                        placeholder="Write your message"
                        placeholderTextColor="#999"
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                    />

                    <TouchableOpacity>
                        <MaterialIcons
                            name="emoji-emotions"
                            size={22}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.bottomIcon}>
                    <Feather
                        name="camera"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bottomIcon}>
                    <Feather
                        name="mic"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>
            </View>
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

    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#18D26E',
        position: 'absolute',
        right: 10,
        bottom: 2,
        borderWidth: 2,
        borderColor: '#fff',
    },

    headerName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
    },

    activeText: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },

    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconButton: {
        marginLeft: 14,
    },

    todayContainer: {
        alignItems: 'center',
        marginVertical: 18,
    },

    todayText: {
        backgroundColor: '#ECECEC',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 14,
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
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
        marginTop: 28,
    },

    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
        marginBottom: 8,
    },

    messageBubble: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 20,
    },

    myMessage: {
        backgroundColor: '#20C5B5',
        borderBottomRightRadius: 6,
    },

    otherMessage: {
        backgroundColor: '#ECEFF3',
        borderBottomLeftRadius: 6,
    },

    messageText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
    },

    timeText: {
        fontSize: 13,
        color: '#888',
        marginTop: 8,
        paddingHorizontal: 6,
    },

    audioBubble: {
        backgroundColor: '#20C5B5',
        borderRadius: 20,
        borderBottomRightRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    playButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },

    wave: {
        width: 3,
        backgroundColor: '#A5F2EA',
        marginHorizontal: 1,
        borderRadius: 3,
    },

    audioTime: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
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
        height: 52,
        backgroundColor: '#F2F3F5',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginHorizontal: 12,
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#111',
    },

    bottomIcon: {
        marginLeft: 12,
    },
});