import { useEffect, useState } from 'react';
import { messaging } from '../firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';

export default function useFCM() {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Request permission and get token
    const requestPermission = async () => {
      try {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY_HERE' // You'll need to generate this in Firebase Console
          });
          if (currentToken) {
            setToken(currentToken);
            console.log('FCM Token:', currentToken);
            // Here you could send the token to your server to store for sending notifications
          } else {
            console.log('No registration token available.');
          }
        }
      } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
      }
    };

    requestPermission();

    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Show notification
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/logo192.png'
      });
    });

    return unsubscribe;
  }, []);

  return { token, permission };
}