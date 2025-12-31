import React from "react";
import { radiantSchedule } from "./radiantSchedule";

export default function RadiantSegments() {
  const now = new Date();
  const currentHour = now.getHours();

  // Determine current segment based on hour
  let currentIndex = -1;
  if (currentHour >= 0 && currentHour < 3) currentIndex = 0; // 12 AM
  else if (currentHour >= 3 && currentHour < 6) currentIndex = 1; // 3 AM
  else if (currentHour >= 6 && currentHour < 9) currentIndex = 2; // 6 AM
  else if (currentHour >= 9 && currentHour < 12) currentIndex = 3; // 9 AM
  else if (currentHour >= 12 && currentHour < 15) currentIndex = 4; // 12 PM
  else if (currentHour >= 15 && currentHour < 18) currentIndex = 5; // 3 PM
  else if (currentHour >= 18 && currentHour < 21) currentIndex = 6; // 6 PM? Wait, 9 PM is 21
  else currentIndex = 6; // 9 PM and beyond

  return (
    <div>
      <h1>The Radiant Segment Schedule</h1>
      {radiantSchedule.map((seg, index) => (
        <div
          key={index}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: index === currentIndex ? "2px solid gold" : "1px solid #ccc",
            backgroundColor: index === currentIndex ? "#fffacd" : "transparent"
          }}
        >
          <h2>{seg.time} — {seg.title} {index === currentIndex && "(Current)"}</h2>
          <p><strong>Scripture:</strong> {seg.scripture}</p>
          <p><strong>Segment 1 (Worship):</strong> {seg.worship}</p>
          <p><strong>The Rhythm:</strong> {seg.rhythm}</p>
          <p><strong>Segment 2 (Decree):</strong> {seg.decree}</p>
        </div>
      ))}
    </div>
  );
}