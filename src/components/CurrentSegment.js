import React from "react";
import { radiantSchedule } from "../radiantSchedule";

export default function CurrentSegment() {
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

  const currentSeg = radiantSchedule[currentIndex];

  if (!currentSeg) return <p>No current segment.</p>;

  return (
    <div className="dashboard-card">
      <h3>Current Radiant Segment: {currentSeg.time} — {currentSeg.title}</h3>
      <p><strong>Scripture:</strong> {currentSeg.scripture}</p>
      <p><strong>Worship:</strong> {currentSeg.worship}</p>
      <p><strong>The Rhythm:</strong> {currentSeg.rhythm}</p>
      <p><strong>Decree:</strong> {currentSeg.decree}</p>
    </div>
  );
}