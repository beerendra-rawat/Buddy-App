import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F7FB"
            />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#F8FAFF', '#EEF3FF', '#F8FAFF']}
                style={styles.gradient}
            >
                {/* Top Circle */}
                <View style={styles.topCircle} />

                {/* Bottom Circle */}
                <View style={styles.bottomCircle} />

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/img/logo.png')}
                            style={styles.logo}
                        />
                    </View>

                    {/* App Name */}
                    <Text style={styles.title}>
                        Buddy
                    </Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Connect. Chat. Build Friendships.
                    </Text>

                   
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
    },

    topCircle: {
        position: 'absolute',
        top: -120,
        right: -100,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(79,124,247,0.06)',
    },

    bottomCircle: {
        position: 'absolute',
        bottom: -140,
        left: -120,
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: 'rgba(79,124,247,0.05)',
    },

    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    logoContainer: {
        width: width * 0.42,
        height: width * 0.42,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
    },

    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1D2A57',
        marginBottom: 12,
        letterSpacing: 0.5,
    },

    subtitle: {
        fontSize: 16,
        color: '#6C7A9C',
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: 20,
        marginBottom: 60,
    },
});