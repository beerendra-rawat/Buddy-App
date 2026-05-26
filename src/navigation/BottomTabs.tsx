import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatScreen from '../screens/ChatScreen';
import PeopleScreen from '../screens/PeopleScreen';
import FriendScreen from '../screens/FriendScreen';
import CallsScreen from '../screens/CallsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: '#9CA3AF',

                tabBarHideOnKeyboard: true,

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 4,
                },

                tabBarStyle: {
                    position: 'absolute',

                    left: 14,
                    right: 14,

                    bottom: insets.bottom > 0
                        ? insets.bottom
                        : 10,

                    height: 68,

                    paddingTop: 8,
                    paddingBottom: 8,

                    borderRadius: 18,

                    backgroundColor: '#FFFFFF',

                    borderTopWidth: 0,

                    elevation: 8,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                },

                tabBarIcon: ({ color, focused }) => {
                    let iconName: any;

                    if (route.name === 'Chat') {
                        iconName = focused
                            ? 'chatbubble'
                            : 'chatbubble-outline';
                    } else if (route.name === 'People') {
                        iconName = focused
                            ? 'people'
                            : 'people-outline';
                    } else if (route.name === 'Friends') {
                        iconName = focused
                            ? 'person-add'
                            : 'person-add-outline';
                    } else if (route.name === 'Calls') {
                        iconName = focused
                            ? 'call'
                            : 'call-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused
                            ? 'person-circle'
                            : 'person-circle-outline';
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={22}
                            color={color}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="People" component={PeopleScreen} />
            <Tab.Screen name="Friends" component={FriendScreen} />
            <Tab.Screen name="Calls" component={CallsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}