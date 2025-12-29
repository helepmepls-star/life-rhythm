import React, { useEffect, useState } from "react";
import "./DailyGuide.css";

const schedule = [
  {
    time: "12 AM",
    name: "The Midnight Gate",
    focus: "Thresholds & Deliverance",
    worship: "Exalt the 'Key of David' who opens doors no man can shut.",
    rhythm: "Stand at your door or window and face the new day.",
    decree: "Decree the dismantling of every barrier to your 2026 entry.",
    scripture: "Revelation 3:7 — He who opens and no one shuts, and shuts and no one opens."
  },
  // ... include all 8 Watches here (same as Home.js)
];

export default function DailyGuide() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateActive = () => {
      const now = new Date();
      const hours = now.getHours();
      const index = Math.floor(hours / 3) % 8;
      setActiveIndex(index);
    };

    updateActive();
    const interval = setInterval(updateActive, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="daily-guide-container">
      <h1>Daily Guide</h1>
      <div className="timeline">
        {schedule.map((watch, index) => (
          <div
            key={index}
            className={`guide-card ${index === activeIndex ? "active" : ""}`}
          >
            <h2>{watch.time} — {watch.name}</h2>
            <p><strong>Focus:</strong> {watch.focus}</p>
            <p><strong>Worship:</strong> {watch.worship}</p>
            <p><strong>Rhythm:</strong> {watch.rhythm}</p>
            <p><strong>Decree:</strong> {watch.decree}</p>
            <p><em>Scripture:</em> {watch.scripture}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
