import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

import {
    db,
} from './firebase';

type SendMessageProps = {
    chatId: string;
    currentUserId: string;
    receiverId: string;
    text?: string;
    image?: string;
};

export const sendChatMessage =
    async ({
        chatId,
        currentUserId,
        receiverId,
        text,
        image,
    }: SendMessageProps) => {

        try {

            // UPDATE CHAT

            await setDoc(
                doc(
                    db,
                    'chats',
                    chatId
                ),
                {
                    users: [
                        currentUserId,
                        receiverId,
                    ],

                    lastMessage:
                        text ||
                        '📷 Photo',

                    lastMessageTime:
                        serverTimestamp(),
                },
                {
                    merge: true,
                }
            );

            // SAVE MESSAGE

            await addDoc(
                collection(
                    db,
                    'chats',
                    chatId,
                    'messages'
                ),
                {
                    text: text || '',

                    image: image || '',

                    senderId:
                        currentUserId,

                    receiverId,

                    createdAt:
                        serverTimestamp(),
                }
            );

        } catch (error) {

            console.log(
                'Send Message Error:',
                error
            );

            throw error;
        }
    };