import React, { useState, useEffect } from "react";
import "./MyPrayers.css";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, serverTimestamp, doc, setDoc } from "firebase/firestore";

export default function MyPrayers({ user }) {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState("");
  const [visibility, setVisibility] = useState("private");

  // 🔹 Load prayers from Firestore in real-time (user-specific)
  useEffect(() => {
    // Use the `user` prop passed from App.js so we only subscribe when auth state is ready.
    if (!user) {
      setPrayers([]);
      return;
    }

    console.log("MyPrayers: subscribing for user", user.uid);
    try {
      const prayersRef = collection(db, "users", user.uid, "prayers");
      const unsubscribe = onSnapshot(
        prayersRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPrayers(data);
        },
        (err) => {
          console.error("onSnapshot error for", `users/${user.uid}/prayers`, err.code, err.message, err);
          if (err.code === 'permission-denied') {
            alert(
              "Could not load prayers: permission-denied.\n" +
                "Verify you're signed in and your UID matches the document path.\n" +
                "Client UID: " + (user.uid || 'null') + "\n" +
                "If this persists, check Firestore rules or deploy updated rules."
            );
          } else {
            alert("Could not load prayers: " + err.message + " (" + err.code + ")");
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to subscribe to prayers for", user?.uid, err.code, err.message, err);
    }
  }, [user]);

  // 🔹 Add prayer to Firestore (with mirroring for public prayers)
  const addPrayer = async () => {
    if (!newPrayer.trim()) return;
    if (!user) {
      alert("You must be signed in to save a prayer.");
      return;
    }
    try {
      console.log("Attempting to save prayer for user:", user.uid);
      console.log("Writing to:", `users/${user.uid}/prayers`);
      // Save to user's private prayers
      const prayerRef = await addDoc(collection(db, "users", user.uid, "prayers"), {
        title: "New Prayer",
        content: newPrayer,
        answered: false,
        visibility,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // If public, also mirror into publicPrayers
      if (visibility === "public") {
        try {
          console.log("Also attempting to write publicPrayers with ownerId:", user.uid);
          await setDoc(doc(db, "publicPrayers", prayerRef.id), {
            title: "New Prayer",
            content: newPrayer,
            answered: false,
            visibility,
            ownerId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Failed to write publicPrayers:", err.code, err.message, err);
          alert("Could not publish prayer publicly: " + err.message + " (" + err.code + ")");
        }
      }

      setNewPrayer("");
      setVisibility("private");
    } catch (err) {
      console.error("Failed to save prayer:", err.code, err.message, err.stack);
      alert("Failed to save prayer: " + err.message);
    }
  };

  return (
    <div className="prayers-container">
      <h1>The Vault</h1>

      {/* Add new prayer */}
      <div className="add-prayer">
        <textarea
          placeholder="Write your prayer..."
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
        />
        <div className="visibility-toggle">
          <label>
            <input
              type="radio"
              value="private"
              checked={visibility === "private"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Private
          </label>
          <label>
            <input
              type="radio"
              value="public"
              checked={visibility === "public"}
              onChange={(e) => setVisibility(e.target.value)}
            />
            Public
          </label>
        </div>
        <button onClick={addPrayer}>Save Prayer</button>
      </div>

      {/* Prayer cards */}
      <div className="prayer-grid">
        {prayers.map((p) => (
          <div key={p.id} className={`prayer-card ${p.answered ? "answered" : ""}`}>
            <div className="front">
              <h3>{p.title}</h3>
              <p>{p.content}</p>
              <span className="badge">{p.visibility}</span>
            </div>
            {p.answered && (
              <div className="back">
                <h3>Testimony</h3>
                <p>{p.testimony}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
