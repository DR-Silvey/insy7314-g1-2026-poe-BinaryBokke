const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL ?? 'https://localhost:5000';

async function send(path, { method = 'GET', token, body } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('We could not reach the service. Please try again shortly.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Your request could not be completed. Please check your details and try again.');
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getTransactions(filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();

  try {
    const data = await send(`/transaction${query ? `?${query}` : ''}`);
    return data.transactions ?? [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

export async function createTransaction(token, { bookingID, gigID, usernamePerformer, amount }) {
  const data = await send('/transaction', { method: 'POST', token, body: { bookingID, gigID, usernamePerformer, amount } });
  return data.transaction;
}
