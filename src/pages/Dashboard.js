import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import CurrentSegment from "../components/CurrentSegment";
import usePrayerReminder from "../hook/usePrayerReminder";

export default function Dashboard({ user }) {
  const [latestPrayer, setLatestPrayer] = useState(null);
  const [latestReflection, setLatestReflection] = useState(null);
  const [latestAffirmation, setLatestAffirmation] = useState(null);
  const [featuredResource, setFeaturedResource] = useState(null);
  const [latestCounselor, setLatestCounselor] = useState(null);

  // Use prayer reminder hook
  const { testNotification } = usePrayerReminder();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Latest prayer
    const prayerRef = query(collection(db, "users", user.uid, "prayers"), orderBy("createdAt", "desc"), limit(1));
    onSnapshot(prayerRef, (snapshot) => {
      if (!snapshot.empty) setLatestPrayer(snapshot.docs[0].data());
    });

    // 🔹 Latest reflection
    const reflectionRef = query(collection(db, "users", user.uid, "reflections"), orderBy("createdAt", "desc"), limit(1));
    onSnapshot(reflectionRef, (snapshot) => {
      if (!snapshot.empty) setLatestReflection(snapshot.docs[0].data());
    });

    // 🔹 Latest affirmation
    const affirmationRef = query(collection(db, "users", user.uid, "affirmations"), orderBy("createdAt", "desc"), limit(1));
    onSnapshot(affirmationRef, (snapshot) => {
      if (!snapshot.empty) setLatestAffirmation(snapshot.docs[0].data());
    });

    // 🔹 Featured resource (global)
    const resourceRef = query(collection(db, "resources"), limit(1));
    onSnapshot(resourceRef, (snapshot) => {
      if (!snapshot.empty) setFeaturedResource(snapshot.docs[0].data());
    });

    // 🔹 Latest counselor entry
    const counselorRef = query(collection(db, "users", user.uid, "counselorSessions"), orderBy("createdAt", "desc"), limit(1));
    onSnapshot(counselorRef, (snapshot) => {
      if (!snapshot.empty) setLatestCounselor(snapshot.docs[0].data());
    });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>The Sanctuary</h1>
      <p>Your spiritual journey at a glance.</p>

      <div className="dashboard-grid">
        <CurrentSegment />
        <div className="dashboard-quicklinks">
          <button onClick={() => navigate('/guide')}>Daily Guide</button>
          <button onClick={() => navigate('/bible')}>Bible</button>
          <button onClick={() => navigate('/prayers')}>My Prayers</button>
          <button onClick={() => navigate('/affirmations')}>Affirmations</button>
          <button onClick={() => navigate('/journey')}>Journey</button>
          <button onClick={() => navigate('/reflections')}>Reflections</button>
          <button onClick={() => navigate('/resources')}>Resources</button>
          <button onClick={() => navigate('/counselor')}>Counselor</button>
          <button onClick={testNotification}>Test Notification</button>
        </div>
        <div className="dashboard-card">
          <h3>Latest Prayer</h3>
          <p>{latestPrayer?.content || "No prayers yet."}</p>
        </div>

        <div className="dashboard-card">
          <h3>Latest Reflection</h3>
          <p>{latestReflection?.content || "No reflections yet."}</p>
        </div>

        <div className="dashboard-card">
          <h3>Today’s Affirmation</h3>
          <p>{latestAffirmation?.content || "No affirmations yet."}</p>
        </div>

        <div className="dashboard-card">
          <h3>Featured Resource</h3>
          <p>{featuredResource?.description || "No resources available."}</p>
          {featuredResource?.link && (
            <a href={featuredResource.link} target="_blank" rel="noopener noreferrer">Open</a>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Latest Counselor Note</h3>
          <p>{latestCounselor?.content || "No counselor notes yet."}</p>
        </div>
      </div>
    </div>
  );
}
