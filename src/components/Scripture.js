import React, { useEffect, useState } from "react";

// Fetch scripture directly from bible-api.com (public API)
export default function Scripture({ reference }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = reference || "John 3:16";
    setLoading(true);
    setError(null);

    // Direct API call to bible-api.com
    const apiUrl = `https://bible-api.com/${encodeURIComponent(ref)}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch scripture: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setText(data.text || (data.verses ? data.verses.map(v => v.text).join(" ") : ""));
      })
      .catch((err) => {
        console.error("Scripture fetch error:", err);
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
