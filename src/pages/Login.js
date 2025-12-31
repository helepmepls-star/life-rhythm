import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // Store user profile in Firestore
        await setDoc(doc(db, "users", userCred.user.uid), {
          name: name.trim(),
          email: email.trim(),
          country: country.trim(),
          createdAt: new Date()
        });
        alert("Account created successfully!");
        if (onLogin) onLogin(userCred.user);
        navigate("/");
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        alert("Logged in successfully!");
        if (onLogin) onLogin(userCred.user);
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignup ? "Sign Up" : "Login"} to Life Rhythm</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>
      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => setIsSignup(!isSignup)} style={{color:"orange",cursor:"pointer"}}>
          {isSignup ? "Login here" : "Sign up here"}
        </span>
      </p>
    </div>
  );
}
