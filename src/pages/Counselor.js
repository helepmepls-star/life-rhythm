import React, { useState } from "react";
import "./Counselor.css";

export default function Counselor() {
  const [messages, setMessages] = useState([
    { from: "system", text: "Welcome to The Oracle. Share your heart, I am listening..." }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { from: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setListening(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "system", text: "I hear you. Your words matter, and healing is possible." }
      ]);
      setListening(false);
    }, 2000);
  };

  return (
    <div className="counselor-container">
      <h1>The Oracle</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {listening && <div className="pulse"></div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Pour out your heart..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
