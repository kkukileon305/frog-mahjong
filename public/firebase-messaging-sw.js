// /public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm service worker가 실행되었습니다.");
});

// self.addEventListener("push", function (event) {
//   const payload = event.data?.json(); // 메시지 데이터 가져오기
//   const notificationOptions = {
//     body: payload.notification.body,
//     data: payload.data,
//   };
//
//   event.waitUntil(
//     self.registration.showNotification(
//       payload.notification.title,
//       notificationOptions
//     )
//   );
// });

self.addEventListener("notificationclick", function (event) {
  const url =
    event.notification.data.FCM_MSG.data.link ||
    "https://www.frog-mahjong.xyz/";
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

const firebaseConfig = {
  apiKey: "AIzaSyDnpmMSU1wFfp7p-F-ycK3M0a0HhbKyyPU",
  authDomain: "frog-f72a1.firebaseapp.com",
  projectId: "frog-f72a1",
  storageBucket: "frog-f72a1.firebasestorage.app",
  messagingSenderId: "197309547466",
  appId: "1:197309547466:web:cb4f49370fd261b5b8c533",
  measurementId: "G-XT4Y1VV05G",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (payload.title) {
    const notificationTitle = payload.title;
    const notificationOptions = {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
