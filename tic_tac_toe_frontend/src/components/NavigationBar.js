import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function NavigationBar({ authUser, onLogout }) {
  /** Main navigation bar, shows at the top. */
  return (
    <nav className="navbar">
      <span className="brand">TicTacToe Arena</span>
      <div>
        <Link className="nav-link" to="/">Game</Link>
        <Link className="nav-link" to="/history">History</Link>
        <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
        {authUser ? (
          <>
            <span className="nav-user">Hi, {authUser}</span>
            <button onClick={onLogout} className="btn logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-link btn" to="/login">Login</Link>
            <Link className="nav-link btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
