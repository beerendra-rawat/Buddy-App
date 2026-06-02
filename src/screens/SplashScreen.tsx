import React, {
    useEffect,
    useRef,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Animated,
    Pressable,
} from 'react-native';

import {
    LinearGradient,
} from 'expo-linear-gradient';

import AppContainer from
    '../components/common/AppContainer';

import {
    COLORS,
} from '../constants/colors';

const { width } =
    Dimensions.get('window');

export default function SplashScreen() {

    const scaleAnim =
        useRef(
            new Animated.Value(0.9)
        ).current;

    // ==========================
    // ANIMATION
    // ==========================

    useEffect(() => {

        Animated.loop(

            Animated.sequence([

                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1,

                        duration: 900,

                        useNativeDriver: true,
                    }
                ),

                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 0.94,

                        duration: 900,

                        useNativeDriver: true,
                    }
                ),

            ])

        ).start();

    }, []);

    // ==========================
    // PRESS ANIMATION
    // ==========================

    const handleLogoPress =
        () => {

            Animated.sequence([

                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1.08,

                        duration: 120,

                        useNativeDriver: true,
                    }
                ),

                Animated.timing(
                    scaleAnim,
                    {
                        toValue: 1,

                        duration: 120,

                        useNativeDriver: true,
                    }
                ),

            ]).start();
        };

    // ==========================
    // UI
    // ==========================

    return (

        <AppContainer>

            <LinearGradient
                colors={[
                    '#EEF3FF',
                    '#F9FBFF',
                    '#FFFFFF',
                ]}
                start={{
                    x: 0,
                    y: 0,
                }}
                end={{
                    x: 1,
                    y: 1,
                }}
                style={styles.gradient}
            >

                <View
                    style={
                        styles.contentContainer
                    }
                >

                    {/* LOGO */}

                    <Pressable
                        onPress={
                            handleLogoPress
                        }
                        style={
                            styles.logoWrapper
                        }
                    >

                        <Animated.Image
                            source={require('../assets/img/logo.png')}
                            style={[
                                styles.logo,
                                {
                                    transform: [
                                        {
                                            scale:
                                                scaleAnim,
                                        },
                                    ],
                                },
                            ]}
                        />

                    </Pressable>

                    {/* TITLE */}

                    <Text
                        style={
                            styles.title
                        }
                    >
                        Buddy
                    </Text>

                    {/* SUBTITLE */}

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Connect with friends,
                        share moments, and
                        discover new people
                        effortlessly.
                    </Text>

                    {/* HINT */}

                    <Text
                        style={
                            styles.hintText
                        }
                    >
                        Tap the logo to feel
                        the motion.
                    </Text>

                </View>

            </LinearGradient>

        </AppContainer>
    );
}

const styles = StyleSheet.create({

    gradient: {
        flex: 1,

        justifyContent:
            'center',

        alignItems:
            'center',

        paddingHorizontal: 20,
    },

    contentContainer: {
        width: '100%',

        maxWidth: 380,

        alignItems:
            'center',

        paddingVertical: 40,
        paddingHorizontal: 28,
    },

    logoWrapper: {
        width: width * 0.34,
        height: width * 0.34,

        borderRadius:
            (width * 0.34) / 2,

        backgroundColor:
            '#F5F7FB',

        justifyContent:
            'center',

        alignItems:
            'center',

        marginBottom: 26,

        shadowColor:
            COLORS.primary,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.08,

        shadowRadius: 16,

        elevation: 6,
    },

    logo: {
        width: '62%',
        height: '62%',

        resizeMode:
            'contain',
    },

    title: {
        fontSize: 34,
        fontWeight: '800',

        color: '#1D2A57',

        marginBottom: 12,

        letterSpacing: 0.2,
    },

    subtitle: {
        fontSize: 15,

        lineHeight: 24,

        textAlign: 'center',

        color: '#5D6A8F',

        marginBottom: 14,

        paddingHorizontal: 10,
    },

    hintText: {
        fontSize: 13,

        textAlign: 'center',

        color: '#7F87A8',
    },

});
