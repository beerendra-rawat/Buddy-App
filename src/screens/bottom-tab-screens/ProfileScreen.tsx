import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {
    Ionicons,
    Feather,
    MaterialIcons,
} from '@expo/vector-icons';

export default function ProfileScreen() {
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#111"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Profile</Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <Feather
                        name="more-horizontal"
                        size={22}
                        color="#111"
                    />
                </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
                <Image
                    source={{
                        uri: 'https://randomuser.me/api/portraits/men/32.jpg',
                    }}
                    style={styles.profileImage}
                />

                <Text style={styles.name}>
                    Joshua Lawrence
                </Text>

                <Text style={styles.username}>
                    @joshua_lawrence
                </Text>

                <Text style={styles.bio}>
                    UI/UX Designer • Love music, coffee and
                    chatting with friends.
                </Text>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            245
                        </Text>
                        <Text style={styles.statLabel}>
                            Friends
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            1.2K
                        </Text>
                        <Text style={styles.statLabel}>
                            Followers
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            348
                        </Text>
                        <Text style={styles.statLabel}>
                            Following
                        </Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.messageBtn}
                    >
                        <Text style={styles.messageText}>
                            Message
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.callBtn}
                    >
                        <Ionicons
                            name="call-outline"
                            size={22}
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Account
                </Text>

                <MenuItem
                    icon="person-outline"
                    title="Edit Profile"
                />

                <MenuItem
                    icon="notifications-outline"
                    title="Notifications"
                />

                <MenuItem
                    icon="lock-closed-outline"
                    title="Privacy"
                />

                <MenuItem
                    icon="moon-outline"
                    title="Dark Mode"
                />
            </View>

            {/* More Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    More
                </Text>

                <MenuItem
                    icon="help-circle-outline"
                    title="Help Center"
                />

                <MenuItem
                    icon="settings-outline"
                    title="Settings"
                />

                <MenuItem
                    icon="log-out-outline"
                    title="Logout"
                    danger
                />
            </View>
        </ScrollView>
    );
}

type MenuProps = {
    icon: any;
    title: string;
    danger?: boolean;
};

function MenuItem({
    icon,
    title,
    danger,
}: MenuProps) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                    <Ionicons
                        name={icon}
                        size={20}
                        color={
                            danger ? '#FF4D4F' : '#6B7280'
                        }
                    />
                </View>

                <Text
                    style={[
                        styles.menuText,
                        danger && { color: '#FF4D4F' },
                    ]}
                >
                    {title}
                </Text>
            </View>

            <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="#9CA3AF"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },

    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },

    profileCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        padding: 24,
    },

    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },

    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
    },

    username: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 4,
    },

    bio: {
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 24,
        color: '#6B7280',
        marginTop: 16,
        paddingHorizontal: 10,
    },

    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 28,
    },

    statBox: {
        flex: 1,
        alignItems: 'center',
    },

    statNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },

    statLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 4,
    },

    buttonRow: {
        flexDirection: 'row',
        marginTop: 28,
    },

    messageBtn: {
        flex: 1,
        height: 54,
        backgroundColor: '#6C63FF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    messageText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    callBtn: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    section: {
        marginTop: 24,
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        paddingVertical: 10,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },

    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    menuIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },

    menuText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
});