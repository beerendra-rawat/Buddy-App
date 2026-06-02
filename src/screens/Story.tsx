import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    View,
    Image,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Text,
    Alert,
    StatusBar,
} from 'react-native';

import Video from 'react-native-video';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    deleteDoc,
    doc,
    getDoc,
} from 'firebase/firestore';

import {
    auth,
    db,
} from '../services/firebase';

const {
    width,
    height,
} = Dimensions.get('window');

type StoryItem = {
    id?: string;

    type: 'image' | 'video';

    url: string;

    duration?: number;

    username?: string;

    userImage?: string;

    userId?: string;
};

export default function Story({
    route,
    navigation,
}: any) {

    const {
        stories = [],
    } = route.params || {};

    const currentUserId =
        auth.currentUser?.uid;

    const [storyList, setStoryList] =
        useState(stories);

    const [index, setIndex] =
        useState(0);

    const [userImage, setUserImage] =
        useState(
            'https://i.pravatar.cc/300'
        );

    const [userName, setUserName] =
        useState('User');

    const progress =
        useRef(
            new Animated.Value(0)
        ).current;

    const currentStory =
        storyList[index];

    // =========================
    // GET USER DATA
    // =========================

    useEffect(() => {

        const getUserData =
            async () => {

                try {

                    if (
                        !currentStory?.userId
                    ) {
                        return;
                    }

                    const userSnap =
                        await getDoc(
                            doc(
                                db,
                                'users',
                                currentStory.userId
                            )
                        );

                    if (
                        userSnap.exists()
                    ) {

                        const data =
                            userSnap.data();

                        setUserName(
                            data?.name ||
                            data?.username ||
                            currentStory?.username ||
                            'User'
                        );

                        const image =
                            data?.photoURL ||
                            data?.profileImage ||
                            data?.image ||
                            currentStory?.userImage;

                        setUserImage(
                            image &&
                                image.trim() !== ''
                                ? image
                                : 'https://i.pravatar.cc/300'
                        );
                    }

                } catch (error) {

                    console.log(
                        'User Error:',
                        error
                    );
                }
            };

        getUserData();

    }, [index]);

    // =========================
    // STORY TIMER
    // =========================

    useEffect(() => {

        progress.setValue(0);

        const duration =
            (
                currentStory?.duration ||
                5
            ) * 1000;

        Animated.timing(
            progress,
            {
                toValue: 1,
                duration,
                useNativeDriver:
                    false,
            }
        ).start();

        const timer =
            setTimeout(() => {

                if (
                    index <
                    storyList.length - 1
                ) {

                    setIndex(
                        prev =>
                            prev + 1
                    );

                } else {

                    navigation.goBack();
                }

            }, duration);

        return () => {

            clearTimeout(
                timer
            );
        };

    }, [index]);

    // =========================
    // NEXT STORY
    // =========================

    const nextStory =
        () => {

            if (
                index <
                storyList.length - 1
            ) {

                setIndex(
                    prev =>
                        prev + 1
                );

            } else {

                navigation.goBack();
            }
        };

    // =========================
    // PREVIOUS STORY
    // =========================

    const previousStory =
        () => {

            if (index > 0) {

                setIndex(
                    prev =>
                        prev - 1
                );
            }
        };

    // =========================
    // DELETE STORY
    // =========================

    const handleDeleteStory =
        () => {

            Alert.alert(
                'Delete Story',
                'Are you sure?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },

                    {
                        text: 'Delete',

                        style:
                            'destructive',

                        onPress:
                            async () => {

                                try {

                                    if (
                                        currentStory?.id
                                    ) {

                                        await deleteDoc(
                                            doc(
                                                db,
                                                'stories',
                                                currentStory.id
                                            )
                                        );

                                        const updated =
                                            storyList.filter(
                                                (
                                                    item: StoryItem
                                                ) =>
                                                    item.id !==
                                                    currentStory.id
                                            );

                                        setStoryList(
                                            updated
                                        );

                                        if (
                                            updated.length ===
                                            0
                                        ) {

                                            navigation.goBack();

                                            return;
                                        }

                                        if (
                                            index >=
                                            updated.length
                                        ) {

                                            setIndex(
                                                updated.length -
                                                1
                                            );
                                        }
                                    }

                                } catch (error) {

                                    console.log(
                                        'Delete Error:',
                                        error
                                    );
                                }
                            },
                    },
                ]
            );
        };

    // =========================
    // LOADING
    // =========================

    if (
        !storyList ||
        storyList.length === 0
    ) {

        return (

            <View
                style={
                    styles.loaderContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color="#FFFFFF"
                />

            </View>
        );
    }

    // =========================
    // UI
    // =========================

    return (

        <View
            style={styles.container}
        >

            <StatusBar
                barStyle="light-content"
                backgroundColor="#000"
            />

            {/* ================= */}
            {/* PROGRESS */}
            {/* ================= */}

            <View
                style={
                    styles.progressContainer
                }
            >

                {
                    storyList.map(
                        (
                            _: any,
                            i: number
                        ) => (

                            <View
                                key={i}
                                style={
                                    styles.progressBg
                                }
                            >

                                {
                                    i <
                                        index ? (

                                        <View
                                            style={
                                                styles.progressFull
                                            }
                                        />

                                    ) : i ===
                                        index ? (

                                        <Animated.View
                                            style={[
                                                styles.progressAnimated,

                                                {
                                                    width:
                                                        progress.interpolate(
                                                            {
                                                                inputRange:
                                                                    [
                                                                        0,
                                                                        1,
                                                                    ],

                                                                outputRange:
                                                                    [
                                                                        '0%',
                                                                        '100%',
                                                                    ],
                                                            }
                                                        ),
                                                },
                                            ]}
                                        />

                                    ) : null
                                }

                            </View>
                        )
                    )
                }

            </View>

            {/* ================= */}
            {/* HEADER */}
            {/* ================= */}

            <View
                style={
                    styles.headerContainer
                }
                pointerEvents="box-none"
            >

                <View
                    style={
                        styles.userInfo
                    }
                >

                    <Image
                        source={{
                            uri:
                                userImage,
                        }}
                        style={
                            styles.profileImage
                        }
                    />

                    <Text
                        style={
                            styles.username
                        }
                        numberOfLines={1}
                    >

                        {userName}

                    </Text>

                </View>

                <View
                    style={
                        styles.rightButtons
                    }
                >

                    {
                        currentStory?.userId ===
                            currentUserId && (

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={
                                    styles.deleteButton
                                }
                                onPress={
                                    handleDeleteStory
                                }
                            >

                                <Ionicons
                                    name="trash"
                                    size={22}
                                    color="#FFFFFF"
                                />

                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={
                            styles.closeButton
                        }
                        onPress={() =>
                            navigation.goBack()
                        }
                    >

                        <Ionicons
                            name="close"
                            size={26}
                            color="#FFFFFF"
                        />

                    </TouchableOpacity>

                </View>

            </View>

            {/* ================= */}
            {/* STORY */}
            {/* ================= */}

            {
                currentStory?.type ===
                    'image' ? (

                    <Image
                        source={{
                            uri:
                                currentStory?.url,
                        }}
                        style={
                            styles.storyMedia
                        }
                        resizeMode="contain"
                    />

                ) : (

                    <Video
                        source={{
                            uri:
                                currentStory?.url,
                        }}
                        style={
                            styles.storyMedia
                        }
                        resizeMode="contain"
                        paused={false}
                        repeat={false}
                    />

                )
            }

            {/* ================= */}
            {/* TOUCH */}
            {/* ================= */}

            <View
                style={
                    styles.touchContainer
                }
                pointerEvents="box-none"
            >

                <TouchableOpacity
                    style={
                        styles.touchLeft
                    }
                    activeOpacity={1}
                    onPress={
                        previousStory
                    }
                />

                <TouchableOpacity
                    style={
                        styles.touchRight
                    }
                    activeOpacity={1}
                    onPress={
                        nextStory
                    }
                />

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor:
            '#000000',
    },

    loaderContainer: {
        flex: 1,
        justifyContent:
            'center',
        alignItems:
            'center',
        backgroundColor:
            '#000000',
    },

    // ======================
    // PROGRESS
    // ======================

    progressContainer: {
        position: 'absolute',
        top: 12,
        left: 10,
        right: 10,
        flexDirection: 'row',
        zIndex: 9999,
    },

    progressBg: {
        flex: 1,
        height: 4,
        backgroundColor:
            'rgba(255,255,255,0.3)',
        marginHorizontal: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },

    progressFull: {
        width: '100%',
        height: '100%',
        backgroundColor:
            '#FFFFFF',
    },

    progressAnimated: {
        height: '100%',
        backgroundColor:
            '#FFFFFF',
    },

    // ======================
    // HEADER
    // ======================

    headerContainer: {
        position: 'absolute',
        top: 35,
        left: 12,
        right: 12,

        flexDirection: 'row',

        justifyContent:
            'space-between',

        alignItems: 'center',

        zIndex: 99999,

        backgroundColor:
            'rgba(0,0,0,0.35)',

        paddingHorizontal: 10,
        paddingVertical: 8,

        borderRadius: 14,
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor:
            '#333',
    },

    username: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
        maxWidth: 160,
    },

    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deleteButton: {
        width: 42,
        height: 42,
        borderRadius: 21,

        justifyContent:
            'center',

        alignItems: 'center',

        backgroundColor:
            'rgba(255,0,0,0.6)',

        marginRight: 8,
    },

    closeButton: {
        width: 42,
        height: 42,
        borderRadius: 21,

        justifyContent:
            'center',

        alignItems: 'center',

        backgroundColor:
            'rgba(0,0,0,0.6)',
    },

    // ======================
    // MEDIA
    // ======================

    storyMedia: {
        width,
        height,
    },

    // ======================
    // TOUCH
    // ======================

    touchContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
    },

    touchLeft: {
        flex: 1,
    },

    touchRight: {
        flex: 1,
    },

});