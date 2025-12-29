const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // or the actual filename
const seed = require("./seed.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData() {
  const templates = seed.watchTemplates;
  for (const [watch, data] of Object.entries(templates)) {
    await db.collection("watchTemplates").doc(watch).set(data);
    console.log(`Imported ${watch}`);
  }
}

importData();
