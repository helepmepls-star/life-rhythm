import React, { useState } from "react";
import "./Resources.css";

const sampleResources = [
  {
    id: 1,
    title: "Soaking Track 1",
    thumbnail: "https://via.placeholder.com/150/00ffcc/000000?text=Track+1",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Soaking Track 2",
    thumbnail: "https://via.placeholder.com/150/c850c0/ffffff?text=Track+2",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Soaking Track 3",
    thumbnail: "https://via.placeholder.com/150/4158d0/ffffff?text=Track+3",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function Resources() {
  const [currentTrack, setCurrentTrack] = useState(null);

  return (
    <div className="resources-container">
      <h1>The Library</h1>
      <div className="resource-grid">
        {sampleResources.map((res) => (
          <div
            key={res.id}
            className="resource-card"
            onClick={() => setCurrentTrack(res)}
          >
            <img src={res.thumbnail} alt={res.title} />
            <h3>{res.title}</h3>
          </div>
        ))}
      </div>

      {currentTrack && (
        <div className="player">
          <h2>Now Playing: {currentTrack.title}</h2>
          <audio controls autoPlay src={currentTrack.audio}></audio>
          <button onClick={() => setCurrentTrack(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
