const TOKEN_KEY = 'hustlehub_token';

function decodePayload(token) {
  try {
    const [, payload] = token.split('.');
    const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function toSession(token) {
  const payload = decodePayload(token);
  if (!payload?.username || !payload.exp) return null;

  const expiresAt = payload.exp * 1000;
  if (expiresAt <= Date.now()) return null;

  return { token, username: payload.username, role: payload.role, expiresAt };
}

export function saveSession(token) {
  const session = toSession(token);
  if (!session) return null;

  sessionStorage.setItem(TOKEN_KEY, token);
  return session;
}

export function getSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const session = toSession(token);
  if (!session) sessionStorage.removeItem(TOKEN_KEY);
  return session;
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
}
