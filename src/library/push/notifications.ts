import { api } from '@/library/api/axios';

/**
 * Browser notifications + Web Push for incoming calls.
 *
 * - Local notifications: shown by the open app when its tab is hidden.
 * - Web Push: the server wakes this device when the site is closed.
 *   On iPhone/iPad this only works once the site is added to the Home Screen.
 */

export const isNotificationSupported = () => typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

export const isPushSupported = () => isNotificationSupported() && 'PushManager' in window;

export const notificationPermission = (): NotificationPermission | 'unsupported' =>
  isNotificationSupported() ? Notification.permission : 'unsupported';

let registration: Promise<ServiceWorkerRegistration | null> | null = null;

/** Registers /sw.js once; resolves null where unsupported or on failure. */
export const getServiceWorker = () => {
  if (!registration) {
    registration =
      typeof navigator !== 'undefined' && 'serviceWorker' in navigator
        ? navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('[push] service worker registration failed', err);
            return null;
          })
        : Promise.resolve(null);
  }
  return registration;
};

const urlBase64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

/** Subscribes this browser and registers it with the server. Safe to call repeatedly. */
export const subscribeToPush = async (): Promise<boolean> => {
  if (!isPushSupported() || Notification.permission !== 'granted') return false;
  const reg = await getServiceWorker();
  if (!reg) return false;

  const { data } = await api.get<{ publicKey: string | null }>('/push/public-key');
  if (!data.publicKey) return false; // push not configured on the server

  const key = urlBase64ToUint8Array(data.publicKey);
  let sub = await reg.pushManager.getSubscription();
  // Server keys changed: the old subscription can't be used any more.
  const currentKey = sub?.options.applicationServerKey;
  if (sub && currentKey && !new Uint8Array(currentKey).every((b, i) => b === key[i])) {
    await sub.unsubscribe();
    sub = null;
  }
  sub ??= await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });

  await api.post('/push/subscribe', sub.toJSON());
  return true;
};

/** Stops pushes to this browser (on logout, so the next user doesn't get them). */
export const unsubscribeFromPush = async () => {
  if (!isPushSupported()) return;
  const reg = await getServiceWorker();
  const sub = await reg?.pushManager.getSubscription();
  await sub?.unsubscribe().catch(() => undefined);
};

/** Asks for permission (must run from a click) and subscribes if granted. */
export const enableCallNotifications = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  const result = await Notification.requestPermission();
  if (result === 'granted') await getServiceWorker();
  if (result === 'granted' && isPushSupported()) await subscribeToPush().catch(() => false);
  return result;
};

/** Shows a notification from the open app; returns a function that closes it. */
export const showLocalNotification = async (
  title: string,
  options: NotificationOptions & { tag: string; url?: string; vibrate?: number[] }
): Promise<() => void> => {
  if (notificationPermission() !== 'granted') return () => undefined;
  const reg = await getServiceWorker();
  if (!reg) return () => undefined;
  const { url, ...rest } = options;
  await reg
    .showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      requireInteraction: true,
      ...rest,
      data: { url: url ?? window.location.pathname + window.location.search },
    } as NotificationOptions)
    .catch(() => undefined);
  return () => {
    void reg.getNotifications({ tag: options.tag }).then((list) => list.forEach((n) => n.close()));
  };
};
