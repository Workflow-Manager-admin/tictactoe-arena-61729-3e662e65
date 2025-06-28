import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRegister, apiLogin } from "../api";

// PUBLIC_INTERFACE
export default function Register({ setAuthUser }) {
  /** Registration screen: form for username/password, logs user in on success */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("");
    try {
      await apiRegister(username, password);
      await apiLogin(username, password);
      setAuthUser(username);
      nav("/");
    } catch (err) {
      setMsg("Registration failed: " + (err?.message || "Try again."));
    }
  }

  return (
    <div className="center-container">
      <div className="pane auth-pane">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={username}
            placeholder="Username"
            minLength={3}
            maxLength={20}
            required
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            minLength={4}
            maxLength={100}
            required
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn primary">Register</button>
        </form>
        {msg && <div className="error">{msg}</div>}
        <div className="auth-links">
          Have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
