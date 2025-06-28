import React, { useEffect, useState } from "react";
import { apiMe, apiCreateGame, apiListGames, apiGameState, apiSubmitMove, apiJoinGame } from "../api";

// Helper: "XOX     O" → ['X','O','X','','','','','O','']
function stringToBoard(str) {
  return str.padEnd(9).split("").map(x => (x === " " ? "" : x));
}

// Square Component (minimalist, accent colors on winning squares)
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={"square" + (highlight ? " highlight" : "")}
      onClick={onClick}
      aria-label={value ? value : "empty"}
      tabIndex="0"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
export default function Game({ authUser }) {
  /* Main game area: lets user create/join game, see games, play board */
  const [userInfo, setUserInfo] = useState(null);
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null);
  const [status, setStatus] = useState("");
  const [moveInProgress, setMoveInProgress] = useState(false);

  // Load info & games on component mount
  useEffect(() => {
    if (!authUser) return;
    (async () => {
      try {
        setUserInfo(await apiMe());
        setGames(await apiListGames());
      } catch (e) {
        setStatus(e.message);
      }
    })();
  }, [authUser]);

  // Create new game
  async function handleNewGame(as_player, opponent_type) {
    setStatus("");
    try {
      const newGame = await apiCreateGame(as_player, opponent_type);
      setGame(newGame);
    } catch (e) {
      setStatus(e.message);
    }
  }
  // Join existing waiting game
  async function handleJoinGame(gameId) {
    setStatus("");
    try {
      const joined = await apiJoinGame(gameId);
      setGame(joined);
    } catch (e) {
      setStatus(e.message);
    }
  }
  // Load a game that's already in history
  async function selectGame(gameId) {
    setStatus("");
    try {
      setGame(await apiGameState(gameId));
    } catch (e) {
      setStatus(e.message);
    }
  }

  // Move for current game
  async function handleMove(pos) {
    if (!game) return;
    setMoveInProgress(true);
    setStatus("");
    try {
      await apiSubmitMove(game.id, pos, userInfo.id);
      setGame(await apiGameState(game.id));
    } catch (e) {
      setStatus(e.message);
    }
    setMoveInProgress(false);
  }

  // Board rendering and highlight win
  const board = game ? stringToBoard(game.board_state) : Array(9).fill("");
  function isPlayersTurn() {
    if (!game || !userInfo) return false;
    // Simplified: X always first, turns alternate, status==IN_PROGRESS
    const turnNum = board.filter(x => x).length;
    return (
      game.status === "IN_PROGRESS" &&
      ((game.player_x_id === userInfo.id && turnNum % 2 === 0) ||
        (game.player_o_id === userInfo.id && turnNum % 2 === 1))
    );
  }

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <b>Welcome, {authUser || "guest"}</b>
        <hr />
        {userInfo && (
          <div>
            <div>User: {userInfo.username}</div>
            <div>Joined: {userInfo.created_at.slice(0, 10)}</div>
          </div>
        )}
        <hr />
        <b>My Games</b>
        <ul className="game-list">
          {games.map((g) => (
            <li key={g.id}>
              <button className="btn game-btn" onClick={() => selectGame(g.id)}>
                Game #{g.id} ({g.status})
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="gamepane">
        <h2>Tic Tac Toe Game</h2>
        {!game ? (
          <div>
            <button className="btn primary" onClick={() => handleNewGame("X", "ai")}>
              New vs AI
            </button>
            <button className="btn secondary" onClick={() => handleNewGame("X", "human")}>
              New vs Human
            </button>
            <ul>
              {games.filter(g => g.status === "WAITING").map(g => (
                <li key={g.id}>
                  <button className="btn accent" onClick={() => handleJoinGame(g.id)}>
                    Join Game #{g.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <div className="board">
              {board.map((x, i) => (
                <Square
                  key={i}
                  value={x}
                  highlight={false}
                  onClick={() => isPlayersTurn() && !x && !moveInProgress && handleMove(i)}
                />
              ))}
            </div>
            <div>
              <b>Status:</b> {game.status}
            </div>
            {game.status === "IN_PROGRESS" && (
              <div>It's {isPlayersTurn() ? "your" : "opponent's"} turn.</div>
            )}
          </div>
        )}
        {status && <div className="error">{status}</div>}
      </main>
    </div>
  );
}
