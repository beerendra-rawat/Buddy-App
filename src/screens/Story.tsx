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
} from 'react-native';

import Video from
    'react-native-video';

import {
    Ionicons,
} from '@expo/vector-icons';

import AppContainer from
    '../components/common/AppContainer';

import {
    COLORS,
} from '../constants/colors';

const {
    width,
    height,
} = Dimensions.get('window');

type StoryItem = {
    type: 'image' | 'video';
    url: string;
    duration?: number;
};

export default function StoryScreen({
    route,
    navigation,
}: any) {

    const {
        stories = [],
    } = route.params || {};

    const [index, setIndex] =
        useState(0);

    const progress =
        useRef(
            new Animated.Value(0)
        ).current;

    // ==========================
    // EMPTY STATE
    // ==========================

    if (
        !stories ||
        stories.length === 0
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

    const currentStory:
        StoryItem =
            stories[index];

    // ==========================
    // ANIMATION
    // ==========================

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
                    stories.length - 1
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

            progress.stopAnimation();
        };

    }, [index]);

    // ==========================
    // NEXT STORY
    // ==========================

    const nextStory =
        () => {

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
        };

    // ==========================
    // PREVIOUS STORY
    // ==========================

    const previousStory =
        () => {

            if (index > 0) {

                setIndex(
                    prev =>
                        prev - 1
                );
            }
        };

    // ==========================
    // UI
    // ==========================

    return (

        <AppContainer>

            <View
                style={
                    styles.container
                }
            >

                {/* PROGRESS BAR */}

                <View
                    style={
                        styles.progressContainer
                    }
                >

                    {
                        stories.map(
                            (
                                _: any,
                                i: number
                            ) => {

                                return (

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
                                );
                            }
                        )
                    }

                </View>

                {/* CLOSE BUTTON */}

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
                        size={28}
                        color="#FFFFFF"
                    />

                </TouchableOpacity>

                {/* STORY MEDIA */}

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

                {/* TOUCH AREA */}

                <View
                    style={
                        styles.touchContainer
                    }
                >

                    <TouchableOpacity
                        activeOpacity={1}
                        style={
                            styles.touchLeft
                        }
                        onPress={
                            previousStory
                        }
                    />

                    <TouchableOpacity
                        activeOpacity={1}
                        style={
                            styles.touchRight
                        }
                        onPress={
                            nextStory
                        }
                    />

                </View>

            </View>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor:
            '#000000',

        justifyContent:
            'center',

        alignItems:
            'center',
    },

    loaderContainer: {
        flex: 1,

        backgroundColor:
            '#000000',

        justifyContent:
            'center',

        alignItems:
            'center',
    },

    // ==========================
    // PROGRESS
    // ==========================

    progressContainer: {
        position: 'absolute',

        top: 55,
        left: 10,
        right: 10,

        flexDirection:
            'row',

        zIndex: 999,
    },

    progressBg: {
        flex: 1,

        height: 3,

        backgroundColor:
            'rgba(255,255,255,0.3)',

        marginHorizontal: 2,

        borderRadius: 10,

        overflow: 'hidden',
    },

    progressFull: {
        width: '100%',
        height: 3,

        backgroundColor:
            '#FFFFFF',
    },

    progressAnimated: {
        height: 3,

        backgroundColor:
            '#FFFFFF',
    },

    // ==========================
    // MEDIA
    // ==========================

    storyMedia: {
        width,
        height,
    },

    // ==========================
    // CLOSE
    // ==========================

    closeButton: {
        position: 'absolute',

        top: 60,
        right: 18,

        zIndex: 999,

        width: 42,
        height: 42,

        borderRadius: 21,

        backgroundColor:
            'rgba(0,0,0,0.35)',

        justifyContent:
            'center',

        alignItems:
            'center',
    },

    // ==========================
    // TOUCH AREA
    // ==========================

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
