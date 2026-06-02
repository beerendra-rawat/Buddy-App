import React, {
    useEffect,
    useState,
} from 'react';

import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
    MaterialIcons,
} from '@expo/vector-icons';

import {
    onAuthStateChanged,
    signOut,
} from 'firebase/auth';

import {
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore';

import {
    auth,
    db,
} from '../../services/firebase';

import AppContainer from
    '../../components/common/AppContainer';

import AppInput from
    '../../components/common/AppInput';

import AppButton from
    '../../components/common/AppButton';

import UserAvatar from
    '../../components/common/UserAvatar';

import SkeletonLoader from
    '../../components/common/SkeletonLoader';

import {
    COLORS,
} from '../../constants/colors';

export default function ProfileScreen() {

    const [loading, setLoading] =
        useState(true);

    const [isEditing, setIsEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [userData, setUserData] =
        useState({
            username: '',
            email: '',
            bio: '',
            photoURL: '',
        });

    // ==========================
    // GET USER DATA
    // ==========================

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async user => {

                    if (!user) {

                        setLoading(false);

                        return;
                    }

                    try {

                        const userRef =
                            doc(
                                db,
                                'users',
                                user.uid
                            );

                        const userSnap =
                            await getDoc(
                                userRef
                            );

                        if (
                            userSnap.exists()
                        ) {

                            const data =
                                userSnap.data();

                            setUserData({
                                username:
                                    data.name ||
                                    '',

                                email:
                                    data.email ||
                                    '',

                                bio:
                                    data.bio ||
                                    '',

                                photoURL:
                                    data.photoURL ||
                                    '',
                            });
                        }

                    } catch (error) {

                        console.log(
                            error
                        );

                    } finally {

                        setLoading(false);
                    }
                }
            );

        return unsubscribe;

    }, []);

    // ==========================
    // HANDLE CHANGE
    // ==========================

    const handleChange = (
        key: string,
        value: string
    ) => {

        setUserData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // ==========================
    // PICK IMAGE
    // ==========================

    const pickImage =
        async () => {

            try {

                const permission =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (
                    !permission.granted
                ) {

                    Alert.alert(
                        'Permission Required'
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

                            aspect: [1, 1],

                            quality: 1,
                        }
                    );

                if (
                    !result.canceled
                ) {

                    handleChange(
                        'photoURL',
                        result.assets[0]
                            .uri
                    );
                }

            } catch (error) {

                console.log(error);
            }
        };

    // ==========================
    // UPDATE PROFILE
    // ==========================

    const handleUpdateProfile =
        async () => {

            try {

                setSaving(true);

                const currentUser =
                    auth.currentUser;

                if (!currentUser) {
                    return;
                }

                await updateDoc(
                    doc(
                        db,
                        'users',
                        currentUser.uid
                    ),
                    {
                        name:
                            userData.username,

                        bio:
                            userData.bio,

                        photoURL:
                            userData.photoURL,
                    }
                );

                Alert.alert(
                    'Success',
                    'Profile updated successfully'
                );

                setIsEditing(false);

            } catch (error) {

                console.log(error);

                Alert.alert(
                    'Error',
                    'Failed to update profile'
                );

            } finally {

                setSaving(false);
            }
        };

    // ==========================
    // LOGOUT
    // ==========================

    const handleLogout =
        async () => {

            try {

                await signOut(auth);

            } catch (error) {

                console.log(error);
            }
        };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return <SkeletonLoader />;
    }

    // ==========================
    // UI
    // ==========================

    return (

        <AppContainer>

            {/* HEADER */}

            <View
                style={
                    styles.header
                }
            >

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={
                        styles.editButton
                    }
                    onPress={() => {

                        if (
                            isEditing
                        ) {

                            handleUpdateProfile();

                        } else {

                            setIsEditing(
                                true
                            );
                        }
                    }}
                >

                    <MaterialIcons
                        name={
                            isEditing
                                ? 'check'
                                : 'edit'
                        }
                        size={20}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* PROFILE CARD */}

                <View
                    style={
                        styles.profileCard
                    }
                >

                    {/* IMAGE */}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={
                            !isEditing
                        }
                        onPress={
                            pickImage
                        }
                    >

                        <View
                            style={
                                styles.imageWrapper
                            }
                        >

                            <UserAvatar
                                image={
                                    userData.photoURL
                                }
                                size={130}
                            />

                            {
                                isEditing && (

                                    <View
                                        style={
                                            styles.cameraButton
                                        }
                                    >

                                        <MaterialIcons
                                            name="photo-camera"
                                            size={18}
                                            color="#FFFFFF"
                                        />

                                    </View>
                                )
                            }

                        </View>

                    </TouchableOpacity>

                    {/* USERNAME */}

                    {
                        isEditing ? (

                            <AppInput
                                placeholder="Username"
                                value={
                                    userData.username
                                }
                                onChangeText={text =>
                                    handleChange(
                                        'username',
                                        text
                                    )
                                }
                            />

                        ) : (

                            <Text
                                style={
                                    styles.name
                                }
                            >
                                {
                                    userData.username
                                }
                            </Text>
                        )
                    }

                    {/* EMAIL */}

                    <Text
                        style={
                            styles.email
                        }
                    >
                        {
                            userData.email
                        }
                    </Text>

                    {/* BIO */}

                    {
                        isEditing ? (

                            <AppInput
                                multiline
                                placeholder="Write your bio..."
                                value={
                                    userData.bio
                                }
                                onChangeText={text =>
                                    handleChange(
                                        'bio',
                                        text
                                    )
                                }
                                style={
                                    styles.bioInput
                                }
                            />

                        ) : (

                            <Text
                                style={
                                    styles.bio
                                }
                            >
                                {
                                    userData.bio ||
                                    'Add your bio here...'
                                }
                            </Text>
                        )
                    }

                </View>

            </ScrollView>

            {/* LOGOUT */}

            <View
                style={
                    styles.logoutContainer
                }
            >

                <AppButton
                    title="Logout"
                    onPress={
                        handleLogout
                    }
                    loading={saving}
                />

            </View>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    header: {
        paddingHorizontal: 20,
        paddingTop: 10,

        alignItems: 'flex-end',
    },

    editButton: {
        width: 48,
        height: 48,

        borderRadius: 18,

        backgroundColor:
            COLORS.primary,

        justifyContent:
            'center',

        alignItems:
            'center',
    },

    scrollContent: {
        flexGrow: 1,

        justifyContent:
            'center',

        paddingHorizontal: 20,

        paddingTop: 20,

        paddingBottom: 180,
    },

    profileCard: {
        backgroundColor:
            COLORS.white,

        borderRadius: 30,

        paddingHorizontal: 24,
        paddingVertical: 32,

        alignItems: 'center',

        borderWidth: 1,

        borderColor:
            COLORS.border,
    },

    imageWrapper: {
        position: 'relative',

        marginBottom: 20,
    },

    cameraButton: {
        width: 38,
        height: 38,

        borderRadius: 19,

        backgroundColor:
            COLORS.primary,

        justifyContent:
            'center',

        alignItems:
            'center',

        position: 'absolute',

        right: 0,
        bottom: 0,

        borderWidth: 3,

        borderColor:
            COLORS.white,
    },

    name: {
        marginTop: 8,

        fontSize: 28,
        fontWeight: '700',

        color:
            COLORS.textPrimary,
    },

    email: {
        marginTop: 8,

        fontSize: 15,

        color:
            COLORS.textSecondary,
    },

    bio: {
        marginTop: 18,

        fontSize: 15,

        lineHeight: 24,

        textAlign: 'center',

        color:
            COLORS.textSecondary,
    },

    bioInput: {
        minHeight: 110,

        marginTop: 18,

        textAlignVertical:
            'top',
    },

    logoutContainer: {
        position: 'absolute',

        left: 20,
        right: 20,

        bottom: 120,
    },

});