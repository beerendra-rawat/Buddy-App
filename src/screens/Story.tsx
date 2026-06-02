import React,
{
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
} from 'react-native';

import Video from 'react-native-video';

const {
    width,
    height,
} = Dimensions.get('window');

export default function Story({
    route,
    navigation,
}: any) {

    const { stories = [] } =
        route.params || {};

    const [index, setIndex] =
        useState(0);

    const progress =
        useRef(
            new Animated.Value(0)
        ).current;

    // ==========================
    // EMPTY
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
                    color="#FFF"
                />

            </View>
        );
    }

    const currentStory =
        stories[index];

    // ==========================
    // ANIMATION
    // ==========================

    useEffect(() => {

        progress.setValue(0);

        const duration =
            (currentStory?.duration ||
                5) * 1000;

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
    // UI
    // ==========================

    return (

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

                {stories.map(
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

                                {i < index ? (

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

                                ) : null}

                            </View>
                        );
                    }
                )}

            </View>

            {/* IMAGE */}

            {currentStory?.type ===
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

                // VIDEO

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

            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loaderContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ==========================
    // PROGRESS BAR
    // ==========================

    progressContainer: {
        position: 'absolute',
        top: 55,
        left: 10,
        right: 10,
        flexDirection: 'row',
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
        backgroundColor: '#FFF',
    },

    progressAnimated: {
        height: 3,
        backgroundColor: '#FFF',
    },

    // ==========================
    // STORY MEDIA
    // ==========================

    storyMedia: {
        width,
        height,
    },

});