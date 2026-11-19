import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  getServiceWorker,
  notificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/library/push/notifications';
import { unlockAudioOnFirstGesture } from './tones';

/**
 * App-wide, mounts once: primes audio for ringtones, registers the service
 * worker, keeps this device's push subscription tied to the logged-in user,
 * and drops it on logout so the next person on this browser isn't alerted.
 */
const CallAlertsSetup = () => {
  const userId = useAuthStore((s) => s.user?._id);
  const role = useAuthStore((s) => s.user?.role);
  const hasToken = useAuthStore((s) => Boolean(s.token));
  const previousUser = useRef<string | undefined>(undefined);

  useEffect(() => {
    unlockAudioOnFirstGesture();
    void getServiceWorker();
  }, []);

  useEffect(() => {
    const canCall = Boolean(userId && hasToken && (role === 'patient' || role === 'doctor'));
    if (canCall && notificationPermission() === 'granted') {
      subscribeToPush().catch((err) => console.warn('[push] subscribe failed', err));
    }
    if (previousUser.current && previousUser.current !== userId) void unsubscribeFromPush();
    previousUser.current = userId;
  }, [userId, role, hasToken]);

  return null;
};

export default CallAlertsSetup;
