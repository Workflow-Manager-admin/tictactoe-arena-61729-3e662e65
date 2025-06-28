import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../api";

// PUBLIC_INTERFACE
export default function Login({ setAuthUser }) {
  /** Login screen: form for username/password, sets auth context on success */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    try {
      await apiLogin(username, password);
      setAuthUser(username);
      nav("/"); // Redirect to home/game page
    } catch (err) {
      setMsg("Login failed: " + (err?.message || "Try again."));
    }
  }

  return (
    <div className="center-container">
      <div className="pane auth-pane">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn primary">Login</button>
        </form>
        {msg && <div className="error">{msg}</div>}
        <div className="auth-links">
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
