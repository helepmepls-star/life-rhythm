import React, { useState, useEffect } from "react";
import "./Affirmations.css";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Affirmations() {
  const [affirmations, setAffirmations] = useState([]);
  const [newAffirmation, setNewAffirmation] = useState("");

  // 🔹 Load affirmations in real-time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const affirmationsRef = collection(db, "users", user.uid, "affirmations");
    const unsubscribe = onSnapshot(affirmationsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAffirmations(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Add affirmation
  const addAffirmation = async () => {
    if (!newAffirmation.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "affirmations"), {
      content: newAffirmation,
      createdAt: serverTimestamp()
    });

    setNewAffirmation("");
  };

  return (
    <div className="affirmations-container">
      <h1>The Echo</h1>

      {/* Add new affirmation */}
      <div className="add-affirmation">
        <input
          type="text"
          placeholder="Write your affirmation..."
          value={newAffirmation}
          onChange={(e) => setNewAffirmation(e.target.value)}
        />
        <button onClick={addAffirmation}>Save Affirmation</button>
      </div>

      {/* Affirmation list */}
      <div className="affirmation-list">
        {affirmations.map((a) => (
          <div key={a.id} className="affirmation-card">
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
