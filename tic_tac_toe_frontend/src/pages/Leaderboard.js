import React, { useEffect, useState } from "react";
import { apiLeaderboard } from "../api";

// PUBLIC_INTERFACE
export default function Leaderboard() {
  /** Table of top players/wins/draws/etc. */
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        setRows(await apiLeaderboard());
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);
  return (
    <div className="pane leaderboard-pane">
      <h2>Leaderboard</h2>
      {error && <div className="error">{error}</div>}
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Last Played</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.user_id}>
              <td>{r.username}</td>
              <td>{r.wins}</td>
              <td>{r.losses}</td>
              <td>{r.draws}</td>
              <td>{r.last_played ? r.last_played.slice(0, 10) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
