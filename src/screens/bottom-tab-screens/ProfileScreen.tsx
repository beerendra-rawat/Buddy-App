import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { MaterialIcons } from '@expo/vector-icons';

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

import {
    uploadImageToCloudinary,
} from '../../services/cloudinary';

import AppContainer from '../../components/common/AppContainer';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import UserAvatar from '../../components/common/UserAvatar';
import SkeletonLoader from '../../components/common/SkeletonLoader';

import { COLORS } from '../../constants/colors';

export default function ProfileScreen() {

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        bio: '',
        photoURL: '',
    });

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            async user => {

                if (!user) {
                    setLoading(false);
                    return;
                }

                try {

                    const userRef = doc(
                        db,
                        'users',
                        user.uid
                    );

                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {

                        const data = userSnap.data();

                        console.log(
                            'Firestore User Data:',
                            data
                        );

                        console.log(
                            'Photo URL:',
                            data.photoURL
                        );

                        setUserData({
                            username: data.name || '',
                            email: data.email || '',
                            bio: data.bio || '',
                            photoURL: data.photoURL || '',
                        });
                    }

                } catch (error) {

                    console.log(error);

                } finally {

                    setLoading(false);
                }
            }
        );

        return unsubscribe;

    }, []);

    const handleChange = (
        key: string,
        value: string,
    ) => {

        setUserData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const pickImage = async () => {

        try {

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {

                Alert.alert(
                    'Permission Required'
                );

                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:
                        ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });

            if (result.canceled) {
                return;
            }

            setSaving(true);

            const imageUrl =
                await uploadImageToCloudinary(
                    result.assets[0].uri
                );

            handleChange(
                'photoURL',
                imageUrl
            );

        } catch (error) {

            console.log(
                'Image Upload Error:',
                error
            );

            Alert.alert(
                'Error',
                'Failed to upload image'
            );

        } finally {

            setSaving(false);
        }
    };

    const handleUpdateProfile = async () => {

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
                    currentUser.uid,
                ),
                {
                    name: userData.username,
                    bio: userData.bio,
                    photoURL: userData.photoURL,
                },
            );

            Alert.alert(
                'Success',
                'Profile updated',
            );

            setIsEditing(false);

        } catch (error) {

            console.log(error);

            Alert.alert(
                'Error',
                'Failed to update profile',
            );

        } finally {

            setSaving(false);
        }
    };

    const handleLogout = async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.log(error);
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    return (

        <AppContainer>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >

                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.8}
                        onPress={() => {

                            if (isEditing) {

                                handleUpdateProfile();

                            } else {

                                setIsEditing(true);
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
                            color="#FFF"
                        />

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!isEditing}
                    onPress={pickImage}
                >

                    <View style={styles.imageWrapper}>

                        <UserAvatar
                            image={userData.photoURL}
                            size={110}
                        />

                        {isEditing && (

                            <View
                                style={
                                    styles.cameraButton
                                }
                            >

                                <MaterialIcons
                                    name="photo-camera"
                                    size={16}
                                    color="#FFF"
                                />

                            </View>
                        )}

                    </View>

                </TouchableOpacity>

                {isEditing ? (

                    <AppInput
                        placeholder="Username"
                        value={userData.username}
                        onChangeText={text =>
                            handleChange(
                                'username',
                                text,
                            )
                        }
                    />

                ) : (

                    <Text style={styles.name}>
                        {userData.username}
                    </Text>
                )}

                <Text style={styles.email}>
                    {userData.email}
                </Text>

                {isEditing ? (

                    <AppInput
                        multiline
                        placeholder="Write your bio..."
                        value={userData.bio}
                        onChangeText={text =>
                            handleChange(
                                'bio',
                                text,
                            )
                        }
                        style={styles.bioInput}
                    />

                ) : (

                    <Text style={styles.bio}>
                        {userData.bio ||
                            'No bio added yet'}
                    </Text>
                )}

                <View
                    style={styles.logoutContainer}
                >

                    <AppButton
                        title="Logout"
                        onPress={handleLogout}
                        loading={saving}
                    />

                </View>

            </ScrollView>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 120,
        alignItems: 'center',
    },

    header: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 20,
    },

    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageWrapper: {
        position: 'relative',
        marginBottom: 16,
    },

    cameraButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    name: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 8,
    },

    email: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },

    bio: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.textSecondary,
        paddingHorizontal: 10,
    },

    bioInput: {
        width: '100%',
        minHeight: 100,
        marginTop: 16,
    },

    logoutContainer: {
        width: '100%',
        marginTop: 300,
    },

});