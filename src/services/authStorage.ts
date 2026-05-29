import * as SecureStore from 'expo-secure-store';

const formatKey = (key: string) => {
    return key.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const authStorage = {

    async setItem(key: string, value: string) {

        const safeKey = formatKey(key);

        await SecureStore.setItemAsync(
            safeKey,
            value
        );
    },

    async getItem(key: string) {

        const safeKey = formatKey(key);

        return await SecureStore.getItemAsync(
            safeKey
        );
    },

    async removeItem(key: string) {

        const safeKey = formatKey(key);

        await SecureStore.deleteItemAsync(
            safeKey
        );
    },
};