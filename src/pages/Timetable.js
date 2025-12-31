import React from "react";
import { timetable, weekendProtocol } from "../data/timetable";

export default function Timetable() {
  const now = new Date();
  const isConsecrationPeriod = now.getFullYear() === 2026 && now.getMonth() === 0 && now.getDate() <= 15;
  const currentDay = isConsecrationPeriod ? now.getDate() : null;

  const renderDecree = (decree, isDaySpecific = false) => {
    if (isDaySpecific && Array.isArray(decree)) {
      return (
        <ul>
          {decree.map((d, i) => (
            <li key={i} style={{ fontWeight: currentDay === i + 1 ? 'bold' : 'normal' }}>
              Day {i + 1}: {d}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{decree}</span>;
  };

  const renderSchedule = (schedule, title) => (
    <div>
      <h2>{title}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Title</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Scripture</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Worship</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rhythm</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Decree</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((seg, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{seg.time}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{seg.title}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{seg.scripture}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{seg.worship}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{seg.rhythm}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {renderDecree(seg.decree, seg.time === "12 AM" || seg.time === "12 PM")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>15-Day Consecration Corridor Timetable</h1>
      {isConsecrationPeriod && <p>Today is Day {currentDay} of the consecration.</p>}
      {renderSchedule(timetable, "Weekday Schedule (Mon-Fri)")}
      <br />
      {renderSchedule(weekendProtocol, "Weekend Protocol (Sat-Sun)")}
    </div>
  );
}