import * as FileSystem from
    'expo-file-system/legacy';

export const uploadImageToCloudinary =
    async (
        imageUri: string
    ) => {

        try {

            const base64 =
                await FileSystem.readAsStringAsync(
                    imageUri,
                    {
                        encoding:
                            FileSystem.EncodingType.Base64,
                    }
                );

            const base64Img =
                `data:image/jpeg;base64,${base64}`;

            const response =
                await fetch(
                    'https://api.cloudinary.com/v1_1/dbtjsq1pm/image/upload',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json',
                        },

                        body: JSON.stringify({
                            file: base64Img,

                            upload_preset:
                                'buddychat',
                        }),
                    }
                );

            const data =
                await response.json();

            if (data.secure_url) {

                return data.secure_url;
            }

            throw new Error(
                data?.error?.message ||
                'Upload failed'
            );

        } catch (error) {

            console.log(
                'Cloudinary Upload Error:',
                error
            );

            throw error;
        }
    };