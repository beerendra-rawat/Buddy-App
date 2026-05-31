import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import { useEffect, useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { onAuthStateChanged, signOut } from 'firebase/auth';

import {
    doc,
    getDoc,
} from 'firebase/firestore';

import { auth, db, } from '../../services/firebase'; // update path

export default function ProfileScreen() {

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

            if (user) {

                try {

                    const userRef = doc(
                        db,
                        'users',
                        user.uid
                    );

                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {

                        const userData = userSnap.data();

                        setUsername(
                            userData.name || 'No Name'
                        );
                    }

                } catch (error) {

                    console.log(
                        'USER DATA ERROR:',
                        error
                    );
                }
            }

            setLoading(false);
        });

        return unsubscribe;

    }, []);

    const handleLogout = async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.log(
                'LOGOUT ERROR:',
                error
            );
        }
    };


    const settings = [
        {
            title: 'Account Settings',
            icon: 'person-outline',
        },
        {
            title: 'Notification Preferences',
            icon: 'notifications-none',
        },
        {
            title: 'Help & Support',
            icon: 'help-outline',
        },
    ];

    if (loading) {

        return (

            <SafeAreaView style={styles.loaderContainer}>

                <ActivityIndicator
                    size="large"
                    color="#4F46E5"
                />

            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F7F8FA"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >

                {/* Profile */}
                <View style={styles.profileContainer}>

                    <View style={styles.imageWrapper}>

                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                            }}
                            style={styles.profileImage}
                        />

                        <View style={styles.onlineDot} />

                    </View>

                    {/* Firebase Username */}
                    <Text style={styles.name}>
                        {username}
                    </Text>

                    <Text style={styles.bio}>
                        Always learning
                    </Text>

                    <Text style={styles.friendText}>
                        1.2k Friends
                    </Text>

                    <TouchableOpacity style={styles.editButton}>

                        <MaterialIcons
                            name="edit"
                            size={18}
                            color="#4F46E5"
                        />

                        <Text style={styles.editButtonText}>
                            Edit Profile
                        </Text>

                    </TouchableOpacity>

                </View>

                {/* Settings */}
                <View style={styles.settingsContainer}>

                    {settings.map((item, index) => (

                        <TouchableOpacity
                            key={index}
                            style={styles.settingButton}
                            activeOpacity={0.7}
                        >

                            <View style={styles.settingLeft}>

                                <MaterialIcons
                                    name={item.icon as any}
                                    size={22}
                                    color="#4F46E5"
                                />

                                <Text style={styles.settingText}>
                                    {item.title}
                                </Text>

                            </View>

                            <MaterialIcons
                                name="chevron-right"
                                size={22}
                                color="#9CA3AF"
                            />

                        </TouchableOpacity>

                    ))}

                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >

                    <MaterialIcons
                        name="logout"
                        size={20}
                        color="#EF4444"
                    />

                    <Text style={styles.logoutText}>
                        Log Out
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },

    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    profileContainer: {
        alignItems: 'center',
        marginTop: 60,
    },

    imageWrapper: {
        position: 'relative',
        marginBottom: 20,
    },

    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FFFFFF',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },

    onlineDot: {
        position: 'absolute',
        right: 5,
        bottom: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#22C55E',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },

    name: {
        fontSize: 25,
        fontWeight: '700',
        color: '#111827',
    },

    bio: {
        marginTop: 6,
        fontSize: 15,
        color: '#6B7280',
    },

    friendText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '700',
        color: '#4F46E5',
    },

    editButton: {
        marginTop: 24,
        width: '100%',
        height: 52,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    editButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#4F46E5',
    },

    settingsContainer: {
        marginTop: 40,
    },

    settingButton: {
        height: 58,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },

    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    settingText: {
        marginLeft: 14,
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },

    logoutButton: {
        marginTop: 40,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoutText: {
        marginLeft: 8,
        fontSize: 17,
        fontWeight: '700',
        color: '#EF4444',
    },

});