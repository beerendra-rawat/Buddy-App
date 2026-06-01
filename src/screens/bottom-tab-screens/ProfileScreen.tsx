import {
    useEffect,
    useState,
} from 'react';

import {
    View,
    Text,
    Image,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

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

import { COLORS } from '../../constants/colors';
import SecondaryButton from '../../components/SecondaryButton';

export default function ProfileScreen() {

    const [loading, setLoading] =
        useState(true);

    const [isEditing, setIsEditing] =
        useState(false);

    const [userData, setUserData] =
        useState({
            username: '',
            email: '',
            bio: '',
            photoURL: '',
        });

    // GET USER DATA
    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (user) => {

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
                            await getDoc(userRef);

                        if (
                            userSnap.exists()
                        ) {

                            const data =
                                userSnap.data();

                            setUserData({
                                username:
                                    data.name || '',

                                email:
                                    data.email || '',

                                bio:
                                    data.bio || '',

                                photoURL:
                                    data.photoURL || '',
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

    // HANDLE INPUT CHANGE
    const handleChange = (
        key: string,
        value: string
    ) => {

        setUserData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    // PICK IMAGE
    const pickImage =
        async () => {

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

                    quality: 1,
                });

            if (!result.canceled) {

                handleChange(
                    'photoURL',
                    result.assets[0].uri
                );
            }
        };

    // UPDATE PROFILE
    const handleUpdateProfile =
        async () => {

            try {

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
            }
        };

    // LOGOUT
    const handleLogout =
        async () => {

            try {

                await signOut(auth);

            } catch (error) {

                console.log(error);
            }
        };

    if (loading) {

        return (

            <SafeAreaView
                style={
                    styles.loaderContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

            </SafeAreaView>
        );
    }

    return (

        <SafeAreaView
            style={styles.container}
            edges={['top']}
        >

            <StatusBar
                barStyle="dark-content"
                backgroundColor={
                    COLORS.background
                }
            />

            {/* EDIT BUTTON */}
            <View style={styles.topContainer}>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.editButton}
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
                        color="#FFFFFF"
                    />

                </TouchableOpacity>

            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.scrollContainer
                }
            >

                {/* PROFILE CARD */}
                <View style={styles.profileCard}>

                    {/* PROFILE IMAGE */}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={!isEditing}
                        onPress={pickImage}
                    >

                        <View style={styles.imageWrapper}>

                            {
                                userData.photoURL ? (

                                    <Image
                                        source={{
                                            uri: userData.photoURL,
                                        }}
                                        style={styles.profileImage}
                                    />

                                ) : (

                                    <View style={styles.dummyAvatar}>

                                        <MaterialIcons
                                            name="person"
                                            size={55}
                                            color="#FFFFFF"
                                        />

                                    </View>
                                )
                            }

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

                            <TextInput
                                value={
                                    userData.username
                                }
                                onChangeText={text =>
                                    handleChange(
                                        'username',
                                        text
                                    )
                                }
                                placeholder="Username"
                                placeholderTextColor={
                                    COLORS.textSecondary
                                }
                                style={styles.input}
                            />

                        ) : (

                            <Text style={styles.name}>
                                {
                                    userData.username
                                }
                            </Text>
                        )
                    }

                    {/* EMAIL */}
                    <Text style={styles.email}>
                        {userData.email}
                    </Text>

                    {/* BIO */}
                    {
                        isEditing ? (

                            <TextInput
                                multiline
                                value={
                                    userData.bio
                                }
                                onChangeText={text =>
                                    handleChange(
                                        'bio',
                                        text
                                    )
                                }
                                placeholder="Write your bio..."
                                placeholderTextColor={
                                    COLORS.textSecondary
                                }
                                style={
                                    styles.bioInput
                                }
                            />

                        ) : (

                            <Text style={styles.bio}>
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
            <View style={styles.logoutContainer}>

                <SecondaryButton
                    title="Logout"
                    onPress={handleLogout}
                />

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:
            COLORS.background,
    },

    loaderContainer: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor:
            COLORS.background,
    },

    topContainer: {
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

        justifyContent: 'center',
        alignItems: 'center',

        elevation: 5,
    },

    scrollContainer: {
        flexGrow: 1,

        justifyContent: 'center',

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

        elevation: 4,
    },

    dummyAvatar: {
        width: 130,
        height: 130,

        borderRadius: 65,

        backgroundColor: COLORS.primary,

        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 4,
        borderColor: COLORS.lightBlue,
    },

    imageWrapper: {
        position: 'relative',

        marginBottom: 18,
    },

    profileImage: {
        width: 130,
        height: 130,

        borderRadius: 65,

        borderWidth: 4,

        borderColor:
            COLORS.lightBlue,
    },

    cameraButton: {
        position: 'absolute',

        bottom: 4,
        right: 4,

        width: 38,
        height: 38,

        borderRadius: 19,

        backgroundColor:
            COLORS.primary,

        justifyContent: 'center',
        alignItems: 'center',

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

    input: {
        width: '100%',

        height: 56,

        marginTop: 18,

        borderRadius: 18,

        backgroundColor:
            COLORS.inputBg,

        borderWidth: 1,

        borderColor:
            COLORS.border,

        paddingHorizontal: 18,

        fontSize: 16,
        fontWeight: '600',

        color:
            COLORS.textPrimary,
    },

    bioInput: {
        width: '100%',

        minHeight: 110,

        marginTop: 18,

        borderRadius: 18,

        backgroundColor:
            COLORS.inputBg,

        borderWidth: 1,

        borderColor:
            COLORS.border,

        paddingHorizontal: 18,
        paddingTop: 16,

        fontSize: 15,

        color:
            COLORS.textPrimary,

        textAlignVertical: 'top',
    },

    logoutContainer: {
        position: 'absolute',

        left: 20,
        right: 20,

        bottom: 150,
    },

    logoutButtonWrapper: {
        borderRadius: 18,

        overflow: 'hidden',

        backgroundColor: '#EF4444',
    },
});