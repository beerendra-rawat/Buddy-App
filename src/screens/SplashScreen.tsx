import {
    StyleSheet,
    View,
    Text,
    StatusBar,
    Dimensions,
    Animated,
    Pressable,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.94,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [scaleAnim]);

    const handleLogoPress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.08,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 120,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

            <LinearGradient
                colors={['#EEF3FF', '#F9FBFF', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.contentContainer}>
                    <Pressable onPress={handleLogoPress} style={styles.logoWrapper}>
                        <Animated.Image
                            source={require('../assets/img/logo.png')}
                            style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
                        />
                    </Pressable>

                    <Text style={styles.title}>Buddy</Text>
                    <Text style={styles.subtitle}>
                        Connect with friends, share moments, and discover new people effortlessly.
                    </Text>
                    <Text style={styles.hintText}>Tap the logo to feel the motion.</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        paddingVertical: 38,
        paddingHorizontal: 28,
    },
    logoWrapper: {
        width: width * 0.34,
        height: width * 0.34,
        borderRadius: (width * 0.34) / 2,
        backgroundColor: '#F5F7FB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    logo: {
        width: '62%',
        height: '62%',
        resizeMode: 'contain',
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
        color: '#5D6A8F',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    hintText: {
        fontSize: 13,
        color: '#7F87A8',
        textAlign: 'center',
        marginBottom: 24,
    },
});
