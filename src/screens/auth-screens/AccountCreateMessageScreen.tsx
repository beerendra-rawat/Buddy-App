import { SafeAreaView } from 'react-native-safe-area-context';

import SuccessMessage from '../../components/auth/SuccessMessage';

export default function AccountCreateMessageScreen({
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
                title="Account Created"
                subtitle="Congratulations! Your account has been created successfully. Click continue."
                buttonText="Continue"
                onPress={() => navigation.navigate('SignIn')}
            />

        </SafeAreaView>
    );
}