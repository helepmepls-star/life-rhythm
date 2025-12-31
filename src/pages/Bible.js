import React, { useState } from "react";
import "./Bible.css";
import Scripture from "../components/Scripture";

export default function Bible() {
  const [reference, setReference] = useState("John 3:16");

  const handleDecree = () => {
    // Get the text from the Scripture component somehow, but for now, just alert
    alert("Declare the word aloud!");
  };

  return (
    <div className="bible-container">
      <h1>The Scroll</h1>
      <div className="verse-input">
        <input
          type="text"
          placeholder="Enter Bible reference (e.g., John 3:16)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
      <div className="verse-card">
        <Scripture reference={reference} />
        <button onClick={handleDecree}>One‑Tap Decree</button>
      </div>
    </div>
  );
}
