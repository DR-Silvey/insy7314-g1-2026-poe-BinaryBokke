const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:4000';

async function send(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('We could not reach the service. Please try again shortly.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || data.message || 'Your request could not be completed. Please check your details and try again.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function registerUser({ username, password, fullname, email, age, role }) {
  return send('/register', { username, password, fullname, email, age, role });
}

export function loginUser({ username, password }) {
  return send('/login', { username, password });
}

export function verifyEmail({ username, otp }) {
  return send('/register/verify-email', { username, otp });
}

export function verifyLoginOtp({ otp, temporaryToken }) {
  return send('/verify-login-otp', { otp, temporaryToken });
}

export function classifyDevice({ classificationToken, location }) {
  return send('/classify-device', { classificationToken, location });
}

export function forgotPassword({ email }) {
  return send('/forgot-password', { email });
}

export function resetPassword({ token, newPassword, confirmPassword }) {
  return send('/reset-password', { token, newPassword, confirmPassword });
}
