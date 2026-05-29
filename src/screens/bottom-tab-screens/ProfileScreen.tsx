import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';

import {
    Ionicons,
    Feather,
    MaterialIcons,
} from '@expo/vector-icons';

export default function ProfileScreen() {

    const [isEdit, setIsEdit] =
        useState(false);

    const [name, setName] =
        useState('Beerendra');

    const [bio, setBio] = useState(
        'React Native Developer 🚀'
    );

    const [birthday, setBirthday] =
        useState('10 April 2002');

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >

            {/* Header */}
            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.headerBtn}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#111827"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Profile
                </Text>

                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() =>
                        setIsEdit(!isEdit)
                    }
                >
                    <Feather
                        name={
                            isEdit
                                ? 'check'
                                : 'edit-2'
                        }
                        size={20}
                        color="#4F46E5"
                    />
                </TouchableOpacity>

            </View>

            {/* Profile Card */}
            <View style={styles.card}>

                {/* Profile Image */}
                <View style={styles.imageContainer}>

                    <Image
                        source={{
                            uri:
                                'https://randomuser.me/api/portraits/men/32.jpg',
                        }}
                        style={styles.image}
                    />

                    <TouchableOpacity
                        style={styles.cameraBtn}
                    >
                        <Ionicons
                            name="camera"
                            size={18}
                            color="#fff"
                        />
                    </TouchableOpacity>

                </View>

                {/* Name */}
                {
                    isEdit ? (
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            placeholder="Name"
                        />
                    ) : (
                        <Text style={styles.name}>
                            {name}
                        </Text>
                    )
                }

                {/* Online Status */}
                <View style={styles.onlineRow}>

                    <View
                        style={styles.onlineDot}
                    />

                    <Text
                        style={styles.onlineText}
                    >
                        Online
                    </Text>

                </View>

                {/* Bio */}
                {
                    isEdit ? (
                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            style={[
                                styles.input,
                                {
                                    height: 80,
                                },
                            ]}
                            placeholder="Bio"
                        />
                    ) : (
                        <Text style={styles.bio}>
                            {bio}
                        </Text>
                    )
                }

                {/* Birthday */}
                <View style={styles.birthdayBox}>

                    <Ionicons
                        name="gift-outline"
                        size={22}
                        color="#4F46E5"
                    />

                    {
                        isEdit ? (
                            <TextInput
                                value={birthday}
                                onChangeText={
                                    setBirthday
                                }
                                style={
                                    styles.birthdayInput
                                }
                                placeholder="Birthday"
                            />
                        ) : (
                            <Text
                                style={
                                    styles.birthdayText
                                }
                            >
                                Birthday : {birthday}
                            </Text>
                        )
                    }

                </View>

                {/* Stats */}
                <View style={styles.statsRow}>

                    <View style={styles.statItem}>
                        <Text
                            style={styles.statNumber}
                        >
                            245
                        </Text>

                        <Text
                            style={styles.statLabel}
                        >
                            Friends
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text
                            style={styles.statNumber}
                        >
                            18
                        </Text>

                        <Text
                            style={styles.statLabel}
                        >
                            Groups
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text
                            style={styles.statNumber}
                        >
                            320
                        </Text>

                        <Text
                            style={styles.statLabel}
                        >
                            Chats
                        </Text>
                    </View>

                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>

                    <TouchableOpacity
                        style={styles.messageBtn}
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={20}
                            color="#fff"
                        />

                        <Text style={styles.btnText}>
                            Message
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                    >
                        <Ionicons
                            name="call-outline"
                            size={22}
                            color="#4F46E5"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                    >
                        <Ionicons
                            name="videocam-outline"
                            size={22}
                            color="#4F46E5"
                        />
                    </TouchableOpacity>

                </View>

                {/* Save Button */}
                {
                    isEdit && (
                        <TouchableOpacity
                            style={styles.saveBtn}
                        >
                            <Text
                                style={styles.saveText}
                            >
                                Save Profile
                            </Text>
                        </TouchableOpacity>
                    )
                }

            </View>

            {/* Logout */}
            <TouchableOpacity
                style={styles.logoutBtn}
            >

                <MaterialIcons
                    name="logout"
                    size={22}
                    color="#EF4444"
                />

                <Text style={styles.logoutText}>
                    Logout
                </Text>

            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    /* Header */
    header: {
        paddingTop: 65,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerBtn: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },

    /* Card */
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 30,
        padding: 22,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    imageContainer: {
        position: 'relative',
    },

    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },

    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
    },

    name: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
        marginTop: 18,
    },

    onlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },

    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#22C55E',
        marginRight: 6,
    },

    onlineText: {
        color: '#22C55E',
        fontSize: 14,
        fontWeight: '500',
    },

    bio: {
        marginTop: 14,
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },

    input: {
        width: '100%',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
        marginTop: 16,
    },

    /* Birthday */
    birthdayBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 22,
    },

    birthdayText: {
        marginLeft: 10,
        color: '#111827',
        fontSize: 15,
        fontWeight: '500',
    },

    birthdayInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#111827',
    },

    /* Stats */
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 28,
    },

    statItem: {
        flex: 1,
        alignItems: 'center',
    },

    statNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },

    statLabel: {
        marginTop: 4,
        color: '#6B7280',
        fontSize: 14,
    },

    /* Buttons */
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
    },

    messageBtn: {
        flex: 1,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#4F46E5',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    actionBtn: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },

    /* Save Button */
    saveBtn: {
        width: '100%',
        height: 54,
        borderRadius: 18,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    /* Logout */
    logoutBtn: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        borderRadius: 24,
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },

    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

});
