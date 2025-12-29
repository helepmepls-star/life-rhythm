import React, { useState } from "react";
import "./Journey.css";

const prayers = [
  { id: 1, title: "Healing", testimony: "God restored my health.", x: 30, y: 40 },
  { id: 2, title: "Provision", testimony: "Received unexpected financial help.", x: 70, y: 20 },
];

const achievements = {
  dailyStrike: 12,
  badges: ["First Prayer", "7-Day Streak", "Answered Prayer"],
  milestones: ["Shared an Affirmation", "Completed Daily Guide"]
};

export default function Journey() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="journey-container">
      <h1>The Milky Way</h1>
      <p className="subtitle">Your journey mapped across the stars</p>

      {/* Constellation */}
      <svg className="constellation" viewBox="0 0 100 100">
        {prayers.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={2.5}
            className="star"
            onClick={() => setSelected(p)}
          />
        ))}
      </svg>

      {/* Testimony popup */}
      {selected && (
        <div className="testimony-card">
          <h2>{selected.title}</h2>
          <p>{selected.testimony}</p>
          <button onClick={() => setSelected(null)}>Close</button>
        </div>
      )}

      {/* Achievements section */}
      <div className="achievements">
        <h2>Achievements</h2>
        <p><strong>Daily Strike:</strong> {achievements.dailyStrike} days</p>
        <div className="badges">
          {achievements.badges.map((b, i) => (
            <span key={i} className="badge">{b}</span>
          ))}
        </div>
        <ul className="milestones">
          {achievements.milestones.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
