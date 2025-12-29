import React, { useState, useEffect } from "react";
import "./Reflections.css";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Reflections() {
  const [reflections, setReflections] = useState([]);
  const [newReflection, setNewReflection] = useState("");

  // 🔹 Load reflections in real-time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const reflectionsRef = collection(db, "users", user.uid, "reflections");
    const unsubscribe = onSnapshot(reflectionsRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReflections(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Auto-save when typing stops
  const handleSave = async () => {
    if (!newReflection.trim()) return;
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "users", user.uid, "reflections"), {
      content: newReflection,
      createdAt: serverTimestamp()
    });

    setNewReflection("");
  };

  return (
    <div className="reflections-container">
      <h1>The Ink</h1>

      {/* Reflection input */}
      <textarea
        placeholder="Write your reflection..."
        value={newReflection}
        onChange={(e) => setNewReflection(e.target.value)}
        onBlur={handleSave} // auto-save when user leaves the field
      />

      {/* Past reflections */}
      <div className="reflection-list">
        {reflections.map((r) => (
          <div key={r.id} className="reflection-card">
            <p>{r.content}</p>
            <small>{r.createdAt?.toDate().toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
