import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
};

export default function SecondaryButton({
    title,
    onPress,
}: Props) {

    return (

        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={styles.button}
        >

            <Text style={styles.text}>
                {title}
            </Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    button: {
        backgroundColor: '#EF4444',

        paddingVertical: 18,

        borderRadius: 18,

        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#EF4444',

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.18,
        shadowRadius: 10,

        elevation: 5,
    },

    text: {
        color: '#FFFFFF',

        fontSize: 16,
        fontWeight: '700',
    },
});