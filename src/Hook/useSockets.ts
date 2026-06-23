import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { refreshToken } from '@/library/api/refreshToken';

let socketInstance: Socket | null = null;

const prodURL = import.meta.env.VITE_PROD_BASE_URL
const devURL = import.meta.env.VITE_DEV_BASE_URL
const baseUrl = import.meta.env.MODE === 'production' ? prodURL : devURL;


export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (socketInstance) {
            socketRef.current = socketInstance;
            return;
        }

        const token = useAuthStore.getState().token;

        socketInstance = io(baseUrl, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket']
        });

        socketRef.current = socketInstance;

        socketInstance.on("connect_error", async (err) => {
            const isAuthError =
                err.message === "Unauthorized" || err.message.includes("jwt");

            if (!isAuthError) return;

            try {
                // ── same utility, no wheel reinvention ────────────────────────
                const newToken = await refreshToken();
                // ensure socketRef.current is used (safer null check in closure)
                const sock = socketRef.current;
                if (!sock) return;
                sock.auth = { token: newToken };
                socketRef.current?.connect();

            } catch {
                // refreshToken already handled logout + redirect
            }
        });

        return () => {
            socketRef.current?.off("connect_error");
        }

    }, []);

    const joinRoom = useCallback((otherUserId: string) => {
        socketRef.current?.emit('room:join', { otherUserId });
    }, []);

    const sendMessage = useCallback((otherUserId: string, content: string) => {
        socketRef.current?.emit('message:send', { otherUserId, content });
    }, []);

    const sendTyping = useCallback((otherUserId: string, isTyping: boolean) => {
        const event = isTyping ? 'typing:start' : 'typing:stop';
        socketRef.current?.emit(event, { otherUserId });
    }, []);

    return { socket: socketRef.current, joinRoom, sendMessage, sendTyping };
};