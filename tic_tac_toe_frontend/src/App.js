import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { getToken, clearToken, apiMe } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Game from "./pages/Game";
import MatchHistory from "./pages/MatchHistory";
import Leaderboard from "./pages/Leaderboard";
import NavigationBar from "./components/NavigationBar";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const [authUser, setAuthUser] = useState(null);
  // Check token on launch
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    async function check() {
      if (getToken()) {
        try {
          const me = await apiMe();
          setAuthUser(me.username);
        } catch {
          setAuthUser(null);
          clearToken();
        }
      }
    }
    check();
  }, []);

  function handleLogout() {
    clearToken();
    setAuthUser(null);
  }

  return (
    <BrowserRouter>
      <div className="App">
        <NavigationBar authUser={authUser} onLogout={handleLogout} />
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <Routes>
          <Route path="/" element={authUser ? <Game authUser={authUser} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/register" element={<Register setAuthUser={setAuthUser} />} />
          <Route path="/history" element={authUser ? <MatchHistory /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
