//
// API utility for all REST calls to the backend.
//

const BACKEND_BASE = "https://vscode-internal-031-dev.dev01.cloud.kavia.ai:3001";

// Helper to get/set local token
export function getToken() {
  return localStorage.getItem('access_token');
}
export function setToken(token) {
  localStorage.setItem('access_token', token);
}
export function clearToken() {
  localStorage.removeItem('access_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { "Authorization": "Bearer " + token } : {};
}

// PUBLIC_INTERFACE
export async function apiRegister(username, password) {
  /** Registers a user with provided username and password. */
  const resp = await fetch(`${BACKEND_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!resp.ok) throw new Error("Registration failed");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiLogin(username, password) {
  /** Log in a user, returns access_token string if successful. */
  const resp = await fetch(`${BACKEND_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const json = await resp.json();
  if (!resp.ok) throw new Error(json?.detail || "Login failed");
  setToken(json.access_token);
  return json;
}

// PUBLIC_INTERFACE
export async function apiMe() {
  /** Get info on current user. */
  const resp = await fetch(`${BACKEND_BASE}/me`, {
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Not authenticated");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiCreateGame(as_player, opponent_type) {
  /** Create a new game (vs human/AI) */
  const resp = await fetch(`${BACKEND_BASE}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ as_player, opponent_type })
  });
  if (!resp.ok) throw new Error("Game creation failed");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiListGames() {
  /** List recent games for current user. */
  const resp = await fetch(`${BACKEND_BASE}/games`, {
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Unable to list games");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiJoinGame(gameId) {
  /** Join a waiting game. */
  const resp = await fetch(`${BACKEND_BASE}/games/${gameId}/join`, {
    method: "POST",
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Join game failed");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiGameState(gameId) {
  /** Get state of the specified game. */
  const resp = await fetch(`${BACKEND_BASE}/games/${gameId}`, {
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Unable to fetch game state");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiSubmitMove(gameId, position, player_id) {
  /** Submit a Tic Tac Toe move (0-8) for this user. */
  const resp = await fetch(`${BACKEND_BASE}/games/${gameId}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ position, player_id })
  });
  if (!resp.ok) throw new Error("Move submission failed");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiGameMoves(gameId) {
  /** Get moves history for particular game. */
  const resp = await fetch(`${BACKEND_BASE}/games/${gameId}/moves`, {
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Unable to fetch moves");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiLeaderboard() {
  /** Fetch the whole leaderboard. */
  const resp = await fetch(`${BACKEND_BASE}/leaderboard`);
  if (!resp.ok) throw new Error("Unable to fetch leaderboard");
  return resp.json();
}

// PUBLIC_INTERFACE
export async function apiHistory() {
  /** Get a user's match history. */
  const resp = await fetch(`${BACKEND_BASE}/history`, {
    headers: { ...authHeaders() }
  });
  if (!resp.ok) throw new Error("Unable to fetch match history");
  return resp.json();
}
