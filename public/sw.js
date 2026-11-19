/* CareConnect service worker: shows call notifications (Web Push) and
 * brings the app to the front when one is tapped. Plain JS, served as-is. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'CareConnect', body: event.data ? event.data.text() : '' };
  }
  const ringing = data.type === 'call';

  event.waitUntil(
    self.registration.showNotification(data.title || 'CareConnect', {
      body: data.body || '',
      tag: data.tag || 'careconnect',
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      // Ringing calls stay up and buzz; a later "missed" notice silently replaces them.
      renotify: ringing,
      requireInteraction: ringing,
      vibrate: ringing ? [800, 400, 800, 400, 800, 400, 800] : undefined,
      data: { url: data.url || '/' },
      actions: ringing ? [{ action: 'open', title: 'Open to answer' }] : [],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const open = windows.find((c) => new URL(c.url).origin === self.location.origin);
      // An open tab already has the live call screen: just bring it forward.
      if (open) return open.focus();
      return self.clients.openWindow(target);
    })()
  );
});
