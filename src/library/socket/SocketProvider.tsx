import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { refreshToken } from '@/library/api/refreshToken';
import { AppSocket, getSocketUrl } from './events';
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

    let s: AppSocket | null = null;
    let cancelled = false;

    // socket.io-client is only downloaded once a patient or doctor is signed in,
    // so guests (and every first visit) don't pay for it.
    import('socket.io-client').then(({ io }) => {
      if (cancelled) return;

      const sock: AppSocket = io(getSocketUrl(), {
        auth: (cb) => cb({ token: useAuthStore.getState().token }),
        transports: ['websocket', 'polling'],
        reconnectionDelayMax: 10_000,
      });
      s = sock;

      let refreshedSinceConnect = false;

      sock.on('connect', () => {
        refreshedSinceConnect = false;
        setIsConnected(true);
      });
      sock.on('disconnect', () => setIsConnected(false));

      // The server rejects expired tokens in its auth middleware; Socket.IO
      // does not retry those on its own. Refresh once, then reconnect.
      sock.on('connect_error', async (err) => {
        if (sock.active || !AUTH_ERROR.test(err.message) || refreshedSinceConnect) return;
        refreshedSinceConnect = true;
        try {
          await refreshToken();
          sock.connect();
        } catch {
          // refreshToken() already logs out and redirects to /login.
        }
      });

      setSocket(sock);
    });

    return () => {
      cancelled = true;
      if (s) {
        s.removeAllListeners();
        s.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [canChat, userId]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
