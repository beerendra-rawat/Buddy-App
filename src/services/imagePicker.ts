import * as ImagePicker from
    'expo-image-picker';

import {
    Alert,
} from 'react-native';

export const pickGalleryImage =
    async () => {

        try {

            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (
                permission.status !==
                'granted'
            ) {

                Alert.alert(
                    'Permission Required',
                    'Please allow gallery permission.'
                );

                return null;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync(
                    {
                        mediaTypes:
                            ImagePicker.MediaTypeOptions.Images,

                        allowsEditing:
                            true,

                        aspect: [4, 4],

                        quality: 0.7,
                    }
                );

            if (result.canceled) {
                return null;
            }

            return result.assets[0].uri;

        } catch (error) {

            console.log(
                'Image Picker Error:',
                error
            );

            return null;
        }
    };