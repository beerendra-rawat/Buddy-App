import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    View,
    Image,
    Dimensions,
    Animated,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Text,
    Alert,
} from 'react-native';

import Video from 'react-native-video';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    auth,
    db,
} from '../services/firebase';

import {
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
} from 'firebase/firestore';

import AppContainer from '../components/common/AppContainer';

const {
    width,
    height,
} = Dimensions.get('window');

export default function Story({
    route,
    navigation,
}: any) {

    const {
        stories,
    } = route.params;

    const [index, setIndex] =
        useState(0);

    const progress =
        useRef(
            new Animated.Value(0)
        ).current;

    const currentStory =
        stories[index];

    useEffect(() => {

        progress.setValue(0);

        Animated.timing(
            progress,
            {
                toValue: 1,
                duration:
                    (currentStory?.duration ||
                        5) * 1000,
                useNativeDriver:
                    false,
            }
        ).start();

        const timer =
            setTimeout(() => {

                if (
                    index <
                    stories.length - 1
                ) {

                    setIndex(
                        prev =>
                            prev + 1
                    );

                } else {

                    navigation.goBack();
                }

            },
                (currentStory?.duration ||
                    5) * 1000
            );

        return () =>
            clearTimeout(timer);

    }, [index]);

    // ==========================
    // DELETE STORY
    // ==========================

    const deleteStory =
        async () => {

            Alert.alert(
                'Delete Story',
                'Delete this story?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },

                    {
                        text: 'Delete',

                        style: 'destructive',

                        onPress:
                            async () => {

                                try {

                                    const storyRef =
                                        doc(
                                            db,
                                            'stories',
                                            currentStory.storyId
                                        );

                                    const snap =
                                        await getDoc(
                                            storyRef
                                        );

                                    if (
                                        !snap.exists()
                                    ) {
                                        return;
                                    }

                                    const data =
                                        snap.data();

                                    const updatedMedia =
                                        data.media.filter(
                                            (
                                                item: any
                                            ) =>
                                                item.url !==
                                                currentStory.url
                                        );

                                    // DELETE FULL DOC
                                    // IF NO STORY LEFT

                                    if (
                                        updatedMedia.length === 0
                                    ) {

                                        await deleteDoc(
                                            storyRef
                                        );

                                    } else {

                                        // UPDATE REMAINING STORIES

                                        await updateDoc(
                                            storyRef,
                                            {
                                                media:
                                                    updatedMedia,
                                            }
                                        );
                                    }

                                    navigation.goBack();

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

    return (
        <AppContainer>

            <View
                style={
                    styles.container
                }
            >

                <StatusBar
                    hidden
                />

                {/* TOP */}

                <View
                    style={
                        styles.topContainer
                    }
                >

                    {stories.map(
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

                                {i ===
                                    index && (

                                        <Animated.View
                                            style={[
                                                styles.progress,
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
                                    )}
                            </View>
                        )
                    )}

                </View>

                {/* HEADER */}

                <View
                    style={
                        styles.header
                    }
                >

                    <View
                        style={{
                            flexDirection:
                                'row',
                            alignItems:
                                'center',
                        }}
                    >

                        <Image
                            source={{
                                uri:
                                    currentStory.userImage,
                            }}
                            style={
                                styles.userImage
                            }
                        />

                        <Text
                            style={
                                styles.name
                            }
                        >

                            {
                                currentStory.userName
                            }

                        </Text>

                    </View>

                    <View
                        style={{
                            flexDirection:
                                'row',
                            alignItems:
                                'center',
                        }}
                    >

                        {/* DELETE BUTTON */}

                        {
                            currentStory.userId ===
                            auth.currentUser
                                ?.uid && (

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={
                                        deleteStory
                                    }
                                    style={
                                        styles.deleteBtn
                                    }
                                >

                                    <Ionicons
                                        name="trash"
                                        size={24}
                                        color="#6487E8"
                                    />

                                </TouchableOpacity>
                            )
                        }

                        {/* CLOSE BUTTON */}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.goBack()
                            }
                            style={
                                styles.iconBtn
                            }
                        >

                            <Ionicons
                                name="close"
                                size={28}
                                color="#6487E8"
                            />

                        </TouchableOpacity>

                    </View>

                </View>

                {/* MEDIA */}

                {currentStory.type ===
                    'image' ? (

                    <Image
                        source={{
                            uri:
                                currentStory.url,
                        }}
                        style={
                            styles.media
                        }
                        resizeMode="contain"
                    />

                ) : (

                    <Video
                        source={{
                            uri:
                                currentStory.url,
                        }}
                        style={
                            styles.media
                        }
                        resizeMode="contain"
                        paused={false}
                        repeat={false}
                    />

                )}

                {/* TOUCH */}

                <View
                    style={
                        styles.touch
                    }
                >

                    <TouchableOpacity
                        style={{
                            flex: 1,
                        }}
                        onPress={() => {

                            if (
                                index > 0
                            ) {

                                setIndex(
                                    index - 1
                                );
                            }
                        }}
                    />

                    <TouchableOpacity
                        style={{
                            flex: 1,
                        }}
                        onPress={() => {

                            if (
                                index <
                                stories.length - 1
                            ) {

                                setIndex(
                                    index + 1
                                );

                            } else {

                                navigation.goBack()
                            }
                        }}
                    />

                </View>

            </View>

        </AppContainer>
    );
}

const styles =
    StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor:
                '#000',
        },

        topContainer: {
            position: 'absolute',
            top: 55,
            left: 10,
            right: 10,
            flexDirection: 'row',
            zIndex: 999,
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

        progress: {
            height: '100%',
            backgroundColor:
                '#fff',
        },

        header: {
            position: 'absolute',
            top: 72,
            left: 14,
            right: 14,
            zIndex: 999,
            flexDirection: 'row',
            justifyContent:
                'space-between',
            alignItems:
                'center',
        },

        userImage: {
            width: 42,
            height: 42,
            borderRadius: 21,
        },

        name: {
            color: '#fff',
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
        },

        media: {
            width,
            height,
        },

        touch: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            flexDirection: 'row',
        },

        iconBtn: {
            marginLeft: 14,
        },

        deleteBtn: {
            marginLeft: 14,
        },
    });