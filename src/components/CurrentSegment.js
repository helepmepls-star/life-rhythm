import React from "react";
import { radiantSchedule } from "../radiantSchedule";
import { timetable, weekendProtocol } from "../data/timetable";
import Scripture from "./Scripture";

export default function CurrentSegment() {
  const now = new Date();
  const currentHour = now.getHours();
  const isConsecrationPeriod = now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() <= 15;

  let currentSeg = null;
  let reference = "";

  if (isConsecrationPeriod) {
    // Use consecration timetable
    const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
    const schedule = (dayOfWeek === 0 || dayOfWeek === 6) ? weekendProtocol : timetable;
    const hourMap = { "12 AM": 0, "3 AM": 3, "6 AM": 6, "9 AM": 9, "12 PM": 12, "3 PM": 15, "6 PM": 18, "9 PM": 21 };
    currentSeg = schedule.find(seg => hourMap[seg.time] === currentHour);
    if (currentSeg) {
      reference = currentSeg.scripture;
      // Handle decree
      let decree = currentSeg.decree;
      if (Array.isArray(decree)) {
        const dayOfMonth = now.getDate();
        decree = decree[dayOfMonth - 1] || decree[0]; // Fallback to first if out of range
      }
      currentSeg = { ...currentSeg, decree };
    }
  } else {
    // Use regular radiant schedule
    let currentIndex = -1;
    if (currentHour >= 0 && currentHour < 3) currentIndex = 0;
    else if (currentHour >= 3 && currentHour < 6) currentIndex = 1;
    else if (currentHour >= 6 && currentHour < 9) currentIndex = 2;
    else if (currentHour >= 9 && currentHour < 12) currentIndex = 3;
    else if (currentHour >= 12 && currentHour < 15) currentIndex = 4;
    else if (currentHour >= 15 && currentHour < 18) currentIndex = 5;
    else if (currentHour >= 18 && currentHour < 21) currentIndex = 6;
    else currentIndex = 6;

    currentSeg = radiantSchedule[currentIndex];
    if (currentSeg) {
      reference = currentSeg.scripture.split(' — ')[0];
    }
  }

  if (!currentSeg) return <p>No current segment.</p>;

  return (
    <div className="dashboard-card">
      <h3>Current Radiant Segment: {currentSeg.time} — {currentSeg.title}</h3>
      <Scripture reference={reference} />
      <p><strong>Worship:</strong> {currentSeg.worship}</p>
      <p><strong>The Rhythm:</strong> {currentSeg.rhythm}</p>
      <p><strong>Decree:</strong> {currentSeg.decree}</p>
    </div>
  );
}