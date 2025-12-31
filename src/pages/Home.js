import React, { useEffect, useState } from "react";
import "./Home.css";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CurrentSegment from "../components/CurrentSegment";
import { radiantSchedule } from "../radiantSchedule";

const schedule = radiantSchedule;

export default function Home({ user }) {
  const navigate = useNavigate();
  const [currentWatch, setCurrentWatch] = useState(schedule[0] || {});
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const updateWatch = () => {
      const now = new Date();
      const hours = now.getHours();
      const index = Math.floor(hours / 3);
      const adjustedIndex = Math.min(index, 6); // Max 6 for 7 segments
      setCurrentWatch(schedule[adjustedIndex]);

      const cycleStart = Math.floor(hours / 3) * 3;
      const cycleEnd = cycleStart + 3;
      const endTime = new Date();
      endTime.setHours(cycleEnd, 0, 0, 0);
      setTimeRemaining(Math.floor((endTime - now) / 1000));
    };

    updateWatch();
    const interval = setInterval(updateWatch, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const sec = Math.max(0, Math.floor(seconds));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="home-container">
      <div className="hero">
        <h1>
          Welcome{user ? `, ${user.displayName || user.email}` : ""} to your {currentWatch?.title ?? "Watch"}
        </h1>
        <p><strong>Focus:</strong> {currentWatch?.title ?? ""}</p>
        <div className="watch-ring">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${(timeRemaining / (3*3600)) * 100}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <p>{formatTime(timeRemaining)} remaining</p>
        </div>
      </div>

      <div className="live-card">
        <CurrentSegment />
      </div>

      <div className="quick-links">
        <button onClick={() => navigate('/guide')}>Daily Guide</button>
        <button onClick={() => navigate('/bible')}>Bible</button>
        <button onClick={() => navigate('/prayers')}>My Prayers</button>
        <button onClick={() => navigate('/affirmations')}>Affirmations</button>
      </div>

      {/* Logout button */}
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
}
