const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

// Helper to normalize doc id from reference
function refToId(ref) {
  return encodeURIComponent(ref.replace(/\s+/g, "_"));
}

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
