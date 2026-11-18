import { ReactNode, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { refreshToken } from '@/library/api/refreshToken';
import { AppSocket, SOCKET_URL } from './events';
import { SocketContext } from './socketContext';

const AUTH_ERROR = /jwt|token|expired|auth/i;

/**
 * Owns the single app-wide socket. Connects while a patient/doctor is logged
 * in and disconnects on logout. The token is read lazily on every
 * (re)connect, so a refreshed token is picked up automatically.
 */
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const userId = useAuthStore((s) => s.user?._id);
  const role = useAuthStore((s) => s.user?.role);
  const hasToken = useAuthStore((s) => Boolean(s.token));
  const canChat = Boolean(userId && hasToken && (role === 'patient' || role === 'doctor'));

  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!canChat) return;

    const s: AppSocket = io(SOCKET_URL, {
      auth: (cb) => cb({ token: useAuthStore.getState().token }),
      transports: ['websocket', 'polling'],
      reconnectionDelayMax: 10_000,
    });

    let refreshedSinceConnect = false;

    s.on('connect', () => {
      refreshedSinceConnect = false;
      setIsConnected(true);
    });
    s.on('disconnect', () => setIsConnected(false));

    // The server rejects expired tokens in its auth middleware; Socket.IO
    // does not retry those on its own. Refresh once, then reconnect.
    s.on('connect_error', async (err) => {
      if (s.active || !AUTH_ERROR.test(err.message) || refreshedSinceConnect) return;
      refreshedSinceConnect = true;
      try {
        await refreshToken();
        s.connect();
      } catch {
        // refreshToken() already logs out and redirects to /login.
      }
    });

    setSocket(s);
    return () => {
      s.removeAllListeners();
      s.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [canChat, userId]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
