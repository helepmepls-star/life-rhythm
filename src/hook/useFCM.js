import { useEffect, useState } from 'react';
import { messaging } from '../firebaseConfig';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function useFCM(user) {
  const [token, setToken] = useState(null);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (!user) return;

    // Request permission and get token
    const requestPermission = async () => {
      try {
        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your actual VAPID key from Firebase Console
          });
          if (currentToken) {
            setToken(currentToken);
            console.log('FCM Token:', currentToken);

            // Store token in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
              fcmToken: currentToken
            });
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
  }, [user]);

  return { token, permission };
}