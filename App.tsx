import 'react-native-gesture-handler';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import RootStack from './src/navigation/RootStack';

export default function App() {

  return (

    <SafeAreaProvider>

      <RootStack />

    </SafeAreaProvider>

  );
}