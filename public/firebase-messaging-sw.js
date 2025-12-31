// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDP5cY3vHzLBXv3lNx1QfXJ0nXGJidO64g",
  authDomain: "life-rhythm-bd91d.firebaseapp.com",
  projectId: "life-rhythm-bd91d",
  storageBucket: "life-rhythm-bd91d.firebasestorage.app",
  messagingSenderId: "320404958954",
  appId: "1:320404958954:web:ebbe311f9e8277292d7193",
  measurementId: "G-P5BPLCB888"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});