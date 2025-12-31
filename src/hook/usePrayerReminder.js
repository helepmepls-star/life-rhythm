import { useEffect, useRef } from "react";
import { radiantSchedule } from "../radiantSchedule";

// Map schedule times to hours (24-hour format)
const scheduleHours = radiantSchedule.map(segment => {
  const time = segment.time;
  if (time === "12 AM") return 0;
  if (time === "3 AM") return 3;
  if (time === "6 AM") return 6;
  if (time === "9 AM") return 9;
  if (time === "12 PM") return 12;
  if (time === "3 PM") return 15;
  if (time === "6 PM") return 18;
  if (time === "9 PM") return 21;
  return -1; // Fallback
});

export default function usePrayerReminder() {
  const lastNotifiedRef = useRef(null);

  // Function to play a simple beep sound using Web Audio API
  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency in Hz
      oscillator.type = 'sine'; // Waveform

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5); // Fade out

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5); // Duration 0.5 seconds
    } catch (err) {
      console.log("Web Audio API not supported:", err);
    }
  };

  useEffect(() => {
    // Request notification permission on mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Only notify at the start of the hour (minute 0)
      if (currentMinute === 0) {
        const segmentIndex = scheduleHours.indexOf(currentHour);
        if (segmentIndex !== -1 && lastNotifiedRef.current !== currentHour) {
          const segment = radiantSchedule[segmentIndex];

          // Show notification
          if (Notification.permission === "granted") {
            new Notification("Prayer Time Reminder", {
              body: `${segment.time} — ${segment.title}: ${segment.scripture.split(' — ')[0]}`,
              icon: "/favicon.ico" // Or your app icon
            });
          }

          // Play alarm sound
          playBeep();

          // Mark as notified
          lastNotifiedRef.current = currentHour;
        }
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to manually test notification (optional)
  const testNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Test Prayer Reminder", {
        body: "This is a test notification.",
        icon: "/favicon.ico"
      });
    }
    playBeep();
  };

  return { testNotification };
}