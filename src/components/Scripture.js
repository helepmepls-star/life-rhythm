import React, { useEffect, useState } from "react";
import { projectId } from "../firebaseConfig";

// Fetch scripture via serverless proxy (Cloud Function) which caches in Firestore
export default function Scripture({ reference }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = reference || "John 3:16";
    setLoading(true);
    setError(null);

    // Cloud Function URL (deployed) — use local emulator when running on localhost
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const funcUrl = isLocal
      ? `http://localhost:5001/${projectId}/us-central1/scripture?ref=${encodeURIComponent(ref)}`
      : `https://us-central1-${projectId}.cloudfunctions.net/scripture?ref=${encodeURIComponent(ref)}`;

    fetch(funcUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch scripture from proxy");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setText(data.text || "");
      })
      .catch((err) => {
        console.error("Scripture proxy error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) return <p>Loading scripture...</p>;
  if (error) return <p>Error loading scripture: {error}</p>;
  return (
    <div className="scripture">
      <h3>Scripture</h3>
      <p>{text || "No scripture available."}</p>
      {reference && <p className="ref">{reference}</p>}
    </div>
  );
}
