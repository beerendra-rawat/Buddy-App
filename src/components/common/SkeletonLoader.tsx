import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    StatusBar
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

// --- TYPES ---

interface User {
    id: string;
    name: string;
    lastMessage?: string;
    time?: string;
    avatar: string;
    status?: 'friends' | 'none';
}

interface SkeletonLoaderProps {
    count?: number;
}

// --- COMPONENTS ---

/**
 * High-fidelity Skeleton Loader matching the "Modern Message List Skeleton" UI.
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 7 }) => {
    return (
        <SkeletonPlaceholder
            speed={1200}
            backgroundColor="#E5E7EB"
            highlightColor="#F3F4F6"
            borderRadius={12}
        >
            <View style={styles.listContainer}>
                {Array.from({ length: count }).map((_, index) => (
                    <View key={index} style={styles.skeletonItem}>
                        <View style={styles.skeletonAvatar} />
                        <View style={styles.skeletonTextContainer}>
                            <View style={styles.skeletonNameLine} />
                            <View style={styles.skeletonMessageLine} />
                        </View>
                    </View>
                ))}
            </View>
        </SkeletonPlaceholder>
    );
};

/**
 * Main App Component implementing the 2-second loading logic.
 */
const MessageListScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Simulate data fetching with a 2-second delay as requested
        const timer = setTimeout(() => {
            const mockData: User[] = [
                {
                    id: '1',
                    name: 'Aman',
                    lastMessage: 'Photo',
                    time: '2:40 PM',
                    avatar: 'https://via.placeholder.com/150',
                    status: 'friends'
                },
                {
                    id: '2',
                    name: 'Niraj Rawat',
                    lastMessage: 'Photo',
                    time: '9:55 AM',
                    avatar: 'https://via.placeholder.com/150',
                    status: 'friends'
                },
                {
                    id: '3',
                    name: 'Beerendra Rawat',
                    lastMessage: 'React Native Developer',
                    time: 'Yesterday',
                    avatar: 'https://via.placeholder.com/150',
                    status: 'none'
                },
                {
                    id: '4',
                    name: 'Karan Mehra',
                    lastMessage: 'Let\'s catch up!',
                    time: 'Monday',
                    avatar: 'https://via.placeholder.com/150',
                    status: 'none'
                },
                // Adding more to simulate "large data"
                ...Array.from({ length: 10 }).map((_, i) => ({
                    id: `extra-${i}`,
                    name: `User ${i + 5}`,
                    lastMessage: 'Recent conversation content...',
                    time: 'Recently',
                    avatar: 'https://via.placeholder.com/150',
                    status: 'none' as const
                }))
            ];
            setUsers(mockData);
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const renderItem = ({ item }: { item: User }) => (
        <TouchableOpacity style={styles.userItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.contentContainer}>
                <View style={styles.row}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            {/* CONTENT */}
            {isLoading ? (
                <SkeletonLoader count={8} />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* BOTTOM NAV PLACEHOLDER */}
            <View style={styles.bottomNav}>
                <View style={[styles.navItem, styles.activeNav]} />
                <View style={styles.navItem} />
                <View style={styles.navItem} />
                <View style={styles.navItem} />
            </View>
        </SafeAreaView>
    );
};

// --- STYLES ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },
    header: {
        height: 60,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EFF4FF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3B82F6',
    },
    listContainer: {
        padding: 16,
    },
    listContent: {
        padding: 16,
    },
    // Skeleton Specific Styles
    skeletonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
    },
    skeletonAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
    },
    skeletonTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    skeletonNameLine: {
        width: '40%',
        height: 14,
        borderRadius: 7,
        marginBottom: 10,
    },
    skeletonMessageLine: {
        width: '85%',
        height: 12,
        borderRadius: 6,
    },
    // Actual Data Styles
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E5E7EB',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    timeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    lastMessage: {
        fontSize: 14,
        color: '#6B7280',
    },
    bottomNav: {
        height: 70,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EFF4FF',
        paddingBottom: 10,
    },
    navItem: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    activeNav: {
        backgroundColor: '#3B82F6',
    },
});

export default MessageListScreen;
