import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DailyGuide from "./pages/DailyGuide";
import Journey from "./pages/Journey";
import Bible from "./pages/Bible";
import Resources from "./pages/Resources";
import Counselor from "./pages/Counselor";
import MyPrayers from "./pages/MyPrayers";
import Reflections from "./pages/Reflections";
import Affirmations from "./pages/Affirmations";

import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* Protected routes */}
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/guide" element={user ? <DailyGuide user={user} /> : <Navigate to="/login" />} />
        <Route path="/journey" element={user ? <Journey user={user} /> : <Navigate to="/login" />} />
        <Route path="/bible" element={user ? <Bible user={user} /> : <Navigate to="/login" />} />
        <Route path="/resources" element={user ? <Resources user={user} /> : <Navigate to="/login" />} />
        <Route path="/counselor" element={user ? <Counselor user={user} /> : <Navigate to="/login" />} />
        <Route path="/prayers" element={user ? <MyPrayers user={user} /> : <Navigate to="/login" />} />
        <Route path="/reflections" element={user ? <Reflections user={user} /> : <Navigate to="/login" />} />
        <Route path="/affirmations" element={user ? <Affirmations user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
