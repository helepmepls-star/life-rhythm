import React, { useState } from "react";
import "./Bible.css";

const sampleVerses = [
  { ref: "John 1:1", text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
  { ref: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
  { ref: "Isaiah 40:31", text: "They that wait upon the Lord shall renew their strength..." }
];

export default function Bible() {
  const [currentVerse, setCurrentVerse] = useState(sampleVerses[0]);

  const handleDecree = () => {
    navigator.clipboard.writeText(`${currentVerse.ref} — ${currentVerse.text}`);
    alert("Verse copied! Declare it aloud.");
  };

  return (
    <div className="bible-container">
      <h1>The Scroll</h1>
      <div className="verse-card">
        <h2>{currentVerse.ref}</h2>
        <p>{currentVerse.text}</p>
        <button onClick={handleDecree}>One‑Tap Decree</button>
      </div>

      <div className="verse-selector">
        {sampleVerses.map((v, i) => (
          <button key={i} onClick={() => setCurrentVerse(v)}>
            {v.ref}
          </button>
        ))}
      </div>
    </div>
  );
}
