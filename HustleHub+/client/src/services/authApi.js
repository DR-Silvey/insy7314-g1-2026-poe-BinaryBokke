const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:4000';

async function send(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not reach the service. Please try again shortly.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {

    throw new Error(data.error || data.message || 'Your request could not be completed. Please check your details and try again.');
  }

  return data;
}

export function registerUser({ username, password, fullname, email, age }) {
  return send('/register', { username, password, fullname, email, age });
}

export function loginUser({ username, password }) {
  return send('/login', { username, password });
}
