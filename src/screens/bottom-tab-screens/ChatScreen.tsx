import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StoryType = {
    id: string;
    name: string;
    image: string;
    isYourStory?: boolean;
    online?: boolean;
};

type ChatType = {
    id: string;
    name: string;
    message: string;
    time: string;
    image: string;
    unread?: boolean;
};

const stories: StoryType[] = [
    {
        id: '1',
        name: 'Your story',
        image: '',
        isYourStory: true,
    },
    {
        id: '2',
        name: 'Joshua',
        image:
            'https://randomuser.me/api/portraits/men/32.jpg',
        online: true,
    },
    {
        id: '3',
        name: 'Martin',
        image:
            'https://randomuser.me/api/portraits/men/45.jpg',
        online: true,
    },
    {
        id: '4',
        name: 'Karen',
        image:
            'https://randomuser.me/api/portraits/women/44.jpg',
        online: true,
    },
    {
        id: '5',
        name: 'Martha',
        image:
            'https://randomuser.me/api/portraits/women/68.jpg',
        online: false,
    },
];

const chats: ChatType[] = [
    {
        id: '1',
        name: 'Martin Randolph',
        message: "You: What's man!",
        time: '9:40 AM',
        image:
            'https://randomuser.me/api/portraits/men/45.jpg',
        unread: true,
    },
    {
        id: '2',
        name: 'Andrew Parker',
        message: 'You: Ok, thanks!',
        time: '9:25 AM',
        image:
            'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
        id: '3',
        name: 'Karen Castillo',
        message: 'You: Ok, See you Tomorrow',
        time: 'Fri',
        image:
            'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: '4',
        name: 'Maisy Humphrey',
        message: 'Have a good day, Maisy!',
        time: 'Fri',
        image:
            'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
        id: '5',
        name: 'Joshua Lawrence',
        message: 'The business plan looks great',
        time: 'Thu',
        image:
            'https://randomuser.me/api/portraits/men/32.jpg',
    },
];

export default function ChatScreen() {
    const renderStoryItem = ({ item }: { item: StoryType }) => {
        return (
            <TouchableOpacity style={styles.storyItem}>
                {item.isYourStory ? (
                    <View style={styles.addStory}>
                        <Text style={styles.plus}>+</Text>
                    </View>
                ) : (
                    <View style={styles.storyImageWrapper}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.storyImage}
                        />

                        {item.online && <View style={styles.onlineDot} />}
                    </View>
                )}

                <Text style={styles.storyName} numberOfLines={1}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderChatItem = ({ item }: { item: ChatType }) => {
        return (
            <TouchableOpacity style={styles.chatItem}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.chatImage}
                />

                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={styles.chatName} numberOfLines={1}>
                            {item.name}
                        </Text>

                        <Text style={styles.chatTime}>
                            {item.time}
                        </Text>
                    </View>

                    <View style={styles.messageRow}>
                        <Text
                            style={styles.chatMessage}
                            numberOfLines={1}
                        >
                            {item.message}
                        </Text>

                        <View
                            style={[
                                styles.messageStatus,
                                item.unread && styles.unreadStatus,
                            ]}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Stories */}
            <View style={styles.storyContainer}>
                <FlatList
                    horizontal
                    data={stories}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStoryItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.storyList}
                />
            </View>

            {/* Recent Chats */}
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.chatList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    storyContainer: {
        paddingTop: 12,
    },

    storyList: {
        paddingHorizontal: 16,
    },

    storyItem: {
        alignItems: 'center',
        marginRight: 18,
        width: 72,
    },

    addStory: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
    },

    plus: {
        fontSize: 42,
        color: '#000',
        fontWeight: '300',
        marginTop: -4,
    },

    storyImageWrapper: {
        position: 'relative',
    },

    storyImage: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },

    onlineDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#5CD65C',
        borderWidth: 3,
        borderColor: '#FFF',
        position: 'absolute',
        bottom: 2,
        right: 2,
    },

    storyName: {
        marginTop: 8,
        fontSize: 14,
        color: '#7A7A7A',
    },

    chatList: {
        paddingTop: 18,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },

    chatImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
    },

    chatContent: {
        flex: 1,
        marginLeft: 14,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    chatName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
        flex: 1,
        marginRight: 10,
    },

    chatTime: {
        fontSize: 15,
        color: '#8E8E93',
    },

    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },

    chatMessage: {
        flex: 1,
        fontSize: 16,
        color: '#8E8E93',
    },

    messageStatus: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D1D6',
        marginLeft: 10,
    },

    unreadStatus: {
        borderColor: '#D1D1D6',
        backgroundColor: '#FFF',
    },
});