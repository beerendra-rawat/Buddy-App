import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';

import ChatScreen from '../screens/bottom-tab-screens/ChatScreen';
import PeopleScreen from '../screens/bottom-tab-screens/PeopleScreen';
import FriendScreen from '../screens/bottom-tab-screens/FriendScreen';
import CallsScreen from '../screens/bottom-tab-screens/CallsScreen';
import ProfileScreen from '../screens/bottom-tab-screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress, accessibilityState }: any) {
    const isSelected = accessibilityState?.selected ?? false;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.tabButtonContainer}
        >
            <View style={[styles.tabButton, isSelected && styles.tabButtonActive]}>
                {children}
            </View>
        </TouchableOpacity>
    );
}

export default function BottomTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#5B60FF',
                tabBarInactiveTintColor: '#8F97B6',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    marginHorizontal: 4,
                    borderRadius: 18,
                },
                tabBarStyle: {
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: insets.bottom > 0 ? insets.bottom + 6 : 14,
                    height: 72,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'android' ? 12 : 14,
                    borderRadius: 24,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.08,
                    shadowRadius: 16,
                },
                tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
                        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                            <Ionicons
                                name={iconName}
                                size={22}
                                color={focused ? '#4F46E5' : color}
                            />
                        </View>
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

const styles = StyleSheet.create({
    tabButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 4,
        borderRadius: 20,
    },
    tabButtonActive: {
        backgroundColor: '#EEF2FF',
    },
    iconWrapper: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        marginBottom: 4,
    },
    iconWrapperActive: {
        backgroundColor: '#EDE9FE',
    },
});