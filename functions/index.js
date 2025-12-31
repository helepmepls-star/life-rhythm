const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

// Helper to normalize doc id from reference
function refToId(ref) {
  return encodeURIComponent(ref.replace(/\s+/g, "_"));
}

// Prayer schedule data
const prayerSchedule = [
  { time: '12 AM', title: 'Midnight Gate', scripture: 'Ps 24:7', worship: 'Duty Exchange: Praise the King who owns the night.', rhythm: 'Stand at the Gate: Stand at your door/window.', decree: 'Authority: Shut the door on 2025\'s failures; open 2026\'s success.' },
  { time: '3 AM', title: 'Vision Watch', scripture: 'Ps 24:3', worship: 'Worship the Light who reveals deep secrets.', rhythm: 'Visualize: Look at your VS Code files as \'Gold\'.', decree: 'Clarity: Decree that your mind is sharp and \'unknown errors\' vanish.' },
  { time: '6 AM', title: 'Morning Glory', scripture: 'Ps 24:5', worship: 'Praise the King for the Blessing of the Sun.', rhythm: 'Stretch: Expand your arms to receive favor.', decree: 'Command: Command the day\'s resources to find you in Kubwa.' },
  { time: '9 AM', title: 'Throne Room', scripture: 'Ps 24:9', worship: 'Worship the King on His throne.', rhythm: 'Kneel: Kneel in worship.', decree: 'Dominion: Decree authority over your domain.' },
  { time: '12 PM', title: 'Noon Gate', scripture: 'Ps 24:7', worship: 'Praise the King at midday.', rhythm: 'Stand: Stand in authority.', decree: 'Provision: Decree provision and breakthrough.' },
  { time: '3 PM', title: 'Afternoon Watch', scripture: 'Ps 24:4', worship: 'Worship the Pure One.', rhythm: 'Reflect: Reflect on purity.', decree: 'Purity: Decree purity in thoughts and actions.' },
  { time: '6 PM', title: 'Evening Glory', scripture: 'Ps 24:5', worship: 'Praise the King for the day\'s blessings.', rhythm: 'Rest: Sit and rest.', decree: 'Gratitude: Decree thanksgiving.' },
  { time: '9 PM', title: 'Night Watch', scripture: 'Ps 24:10', worship: 'Worship the King of hosts.', rhythm: 'Pray: Pray for the night.', decree: 'Protection: Decree protection over your household.' }
];

// Scheduled function to send prayer notifications every 3 hours
exports.sendPrayerNotification = functions.pubsub.schedule('0 */3 * * *').timeZone('UTC').onRun(async (context) => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const segmentIndex = [0, 3, 6, 9, 12, 15, 18, 21].indexOf(currentHour);

  if (segmentIndex === -1) return null;

  const segment = prayerSchedule[segmentIndex];

  // Get all users with FCM tokens
  const usersSnapshot = await db.collection('users').where('fcmToken', '!=', null).get();

  const tokens = [];
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.fcmToken) {
      tokens.push(data.fcmToken);
    }
  });

  if (tokens.length === 0) return null;

  // Send notification
  const message = {
    notification: {
      title: `${segment.time} — ${segment.title}`,
      body: `${segment.scripture} — ${segment.worship.split(':')[1].trim()}`,
    },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent message:', response);
    return { success: true };
  } catch (error) {
    console.log('Error sending message:', error);
    return { error: error.message };
  }
});

// Manual trigger function for testing
exports.testPrayerNotification = functions.https.onCall(async (data, context) => {
  const { hour } = data; // e.g., 0 for 12 AM
  const segmentIndex = [0, 3, 6, 9, 12, 15, 18, 21].indexOf(hour);

  if (segmentIndex === -1) throw new functions.https.HttpsError('invalid-argument', 'Invalid hour');

  const segment = prayerSchedule[segmentIndex];

  const usersSnapshot = await db.collection('users').where('fcmToken', '!=', null).get();

  const tokens = [];
  usersSnapshot.forEach(doc => {
    tokens.push(doc.data().fcmToken);
  });

  const message = {
    notification: {
      title: `${segment.time} — ${segment.title}`,
      body: `${segment.scripture} — ${segment.worship.split(':')[1].trim()}`,
    },
    tokens: tokens,
  };

  const response = await admin.messaging().sendMulticast(message);
  return { success: true, sent: response.successCount };
});

exports.scripture = functions
  .runWith({ memory: "256MB", timeoutSeconds: 30 })
  .https.onRequest(async (req, res) => {
    try {
      const ref = req.query.ref || "John 3:16";
      const id = refToId(ref);
      const docRef = db.collection("scriptures").doc(id);
      const docSnap = await docRef.get();

      const now = Date.now();
      const ttlMs = 1000 * 60 * 60 * 24; // 24 hours

      if (docSnap.exists) {
        const data = docSnap.data();
        if (data.fetchedAt) {
          // data.fetchedAt is a Firestore Timestamp
          const fetchedMs = data.fetchedAt.toMillis ? data.fetchedAt.toMillis() : data.fetchedAt;
          if (now - fetchedMs < ttlMs) {
            // return cached
            res.json({ source: "cache", reference: ref, text: data.text });
            return;
          }
        }
      }

      // call bible-api.com
      const url = "https://bible-api.com/" + encodeURIComponent(ref);
      const r = await fetch(url);
      if (!r.ok) {
        const txt = await r.text();
        res.status(502).json({ error: "Bible API error", details: txt });
        return;
      }
      const json = await r.json();
      const text = json.text || (json.verses ? json.verses.map(v=>v.text).join(" ") : "");

      // write cache
      await docRef.set({ reference: ref, text, fetchedAt: admin.firestore.Timestamp.fromMillis(now) }, { merge: true });

      res.json({ source: "api", reference: ref, text });
    } catch (err) {
      console.error("scripture function error:", err);
      res.status(500).json({ error: err.message });
    }
  });
