import React, { useEffect, useState } from "react";
import { apiHistory } from "../api";

// PUBLIC_INTERFACE
export default function MatchHistory() {
  /** Shows user's list of past matches */
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    (async () => {
      try {
        setRows(await apiHistory());
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);
  return (
    <div className="pane history-pane">
      <h2>Match History</h2>
      {error && <div className="error">{error}</div>}
      <table className="history-table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Status</th>
            <th>Winner</th>
            <th>Started</th>
            <th>Finished</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.game_id}>
              <td>{g.game_id}</td>
              <td>{g.status}</td>
              <td>{g.winner || "Draw"}</td>
              <td>{g.created_at?.slice(0, 10)}</td>
              <td>{g.finished_at?.slice(0, 10) || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
