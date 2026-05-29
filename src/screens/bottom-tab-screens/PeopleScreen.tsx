import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';

type UserType = {
    id: string;
    name: string;
    image: string;
    isFriendAdded: boolean;
};

export default function PeopleScreen() {
    const [users, setUsers] = useState<UserType[]>([
        {
            id: '1',
            name: 'Rahul Sharma',
            image: 'https://i.pravatar.cc/150?img=1',
            isFriendAdded: false,
        },
        {
            id: '2',
            name: 'Priya Verma',
            image: 'https://i.pravatar.cc/150?img=5',
            isFriendAdded: false,
        },
        {
            id: '3',
            name: 'Aman Gupta',
            image: 'https://i.pravatar.cc/150?img=8',
            isFriendAdded: false,
        },
        {
            id: '4',
            name: 'Sneha Kapoor',
            image: 'https://i.pravatar.cc/150?img=9',
            isFriendAdded: false,
        },
        {
            id: '5',
            name: 'Vikram Singh',
            image: 'https://i.pravatar.cc/150?img=11',
            isFriendAdded: false,
        },
        {
            id: '6',
            name: 'Neha Joshi',
            image: 'https://i.pravatar.cc/150?img=16',
            isFriendAdded: false,
        },
    ]);

    const toggleFriendRequest = (id: string) => {
        const updatedUsers = users.map(user =>
            user.id === id
                ? {
                    ...user,
                    isFriendAdded: !user.isFriendAdded,
                }
                : user
        );

        setUsers(updatedUsers);
    };

    const renderItem = ({ item }: { item: UserType }) => {
        return (
            <View style={styles.card}>
                <View style={styles.leftSection}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.profileImage}
                    />

                    <View>
                        <Text style={styles.name}>
                            {item.name}
                        </Text>

                        <Text style={styles.subText}>
                            Suggested Friend
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        toggleFriendRequest(item.id)
                    }
                    style={[
                        styles.button,
                        item.isFriendAdded &&
                        styles.cancelButton,
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            item.isFriendAdded &&
                            styles.cancelButtonText,
                        ]}
                    >
                        {item.isFriendAdded
                            ? 'Cancel'
                            : 'Add Friend'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor="#F4F6F8"
                barStyle="dark-content"
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Find Friends
                </Text>

                <Text style={styles.headerSubtitle}>
                    Connect with new people
                </Text>
            </View>

            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.listContainer
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },

    headerSubtitle: {
        marginTop: 4,
        fontSize: 15,
        color: '#6B7280',
    },

    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        marginBottom: 14,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4.65,

        elevation: 4,
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
    },

    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    subText: {
        marginTop: 4,
        fontSize: 13,
        color: '#6B7280',
    },

    button: {
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 12,
        minWidth: 110,
        alignItems: 'center',
    },

    cancelButton: {
        backgroundColor: '#FEE2E2',
    },

    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },

    cancelButtonText: {
        color: '#DC2626',
    },
});