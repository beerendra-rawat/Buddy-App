import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessMessage from '../../components/auth/SuccessMessage';

export default function SuccessfulMessageScreen({
    navigation,
}: any) {

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#F7F8FA',
                paddingHorizontal: 24,
            }}
        >

            <SuccessMessage
                title="Successful"
                subtitle="Congratulations! Your password has been changed successfully. Click continue to sign in."
                buttonText="Continue"
                onPress={() => navigation.navigate('SignIn')}
            />

        </SafeAreaView>
    );
}