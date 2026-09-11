importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);

importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

firebase.initializeApp({
      apiKey: "AIzaSyD6rTuUd1QAR4hAnQfotWg0aDAfjPrHsHs",
  authDomain: "coachinghub-9727f.firebaseapp.com",
  projectId: "coachinghub-9727f",
  storageBucket: "coachinghub-9727f.firebasestorage.app",
  messagingSenderId: "311133154977",
  appId: "1:311133154977:web:fcea3d6047292e3ae84ae0",
  measurementId: "G-2N0821RMDM",
  vapidKey:"BEQ5KsXM8TqqamYG2EHj0m6CgcoNdZ_QTNNmF_dFPWsK1vOWg5DpZv4RO1asZejNkOp4V4ystxRFDqtGh5g46K0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Background message:',
    payload
  );

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title =
    notification.title ||
    data.title ||
    'CoachHub';

  const body =
    notification.body ||
    data.body ||
    '';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    data
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  const targetUrl =
    data.route ||
    data.url ||
    '/';

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return undefined;
      })
  );
});