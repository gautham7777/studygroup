import { useState, useEffect, useCallback } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue, set, push, serverTimestamp } from 'firebase/database';
import { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useGroupChat = (groupId: number) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!groupId) return;

        const chatRef = ref(database, `chats/${groupId}`);
        
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList: Message[] = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Sort messages by timestamp
                messageList.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                setMessages(messageList);
            } else {
                setMessages([]);
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [groupId]);

    const sendMessage = useCallback((text: string) => {
        if (!user || !text.trim()) return;

        const chatRef = ref(database, `chats/${groupId}`);
        const newMessageRef = push(chatRef);
        
        const newMessage: Omit<Message, 'id'> = {
            senderId: user.id,
            senderUsername: user.username,
            groupId,
            text,
            timestamp: new Date().toISOString() // Using client time for simplicity
        };
        
        set(newMessageRef, newMessage);

    }, [groupId, user]);

    return { messages, sendMessage };
};
