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

export async function getGigs(filters = {}) {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();

  try {
    const data = await send(`/gig${query ? `?${query}` : ''}`);
    return data.gigs ?? [];
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

export async function createGig(token, { gigType, description, stageName, costPerHour, isAvailable }) {
  const data = await send('/gig', { method: 'POST', token, body: { gigType, description, stageName, costPerHour, isAvailable } });
  return data.gig;
}

export async function updateGig(token, { gigID, usernamePerformer, gigType, description, stageName, costPerHour, isAvailable }) {
  const data = await send('/gig', { method: 'PUT', token, body: { gigID, usernamePerformer, gigType, description, stageName, costPerHour, isAvailable } });
  return data.gig;
}

export async function deleteGig(token, gigID) {
  await send(`/gig?${new URLSearchParams({ gigID })}`, { method: 'DELETE', token });
}
