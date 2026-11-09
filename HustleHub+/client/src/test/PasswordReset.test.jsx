import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { forgotPassword, resetPassword } from '../services/authApi';

vi.mock('../services/authApi');
vi.mock('../services/bookingApi');
vi.mock('../services/gigApi');
vi.mock('../services/transactionApi');
vi.mock('../services/taxApi');

const resetToken = 'a'.repeat(64);

describe('Password reset', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('sends a reset link to the email address', async () => {
    forgotPassword.mockResolvedValue({ message: 'If an account exists with that email, a password reset link will be sent.' });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Forgot password?' }));
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));

    expect(forgotPassword).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(await screen.findByText('If an account exists with that email, a password reset link will be sent.')).toBeInTheDocument();
  });

  it('sets a new password from the email link and returns to sign in', async () => {
    resetPassword.mockResolvedValue({ message: 'Password successfully reset. You can now log in.' });
    window.history.replaceState(null, '', `/reset-password?token=${resetToken}`);
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Choose a new password' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('New password'), 'short');
    await user.type(screen.getByLabelText('Confirm new password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Save new password' }));
    expect(screen.getByText('Choose a password with at least 13 characters.')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText('New password'));
    await user.clear(screen.getByLabelText('Confirm new password'));
    await user.type(screen.getByLabelText('New password'), 'Brand#NewPass2026');
    await user.type(screen.getByLabelText('Confirm new password'), 'Brand#NewPass2026');
    await user.click(screen.getByRole('button', { name: 'Save new password' }));

    expect(resetPassword).toHaveBeenCalledWith({ token: resetToken, newPassword: 'Brand#NewPass2026', confirmPassword: 'Brand#NewPass2026' });
    expect(await screen.findByText('Password successfully reset. You can now log in.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in to HustleHub+' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });

  it('lets the user request a new link when the reset link has expired', async () => {
    resetPassword.mockRejectedValue(Object.assign(new Error('Password reset link has expired. Please request another.'), { status: 400 }));
    window.history.replaceState(null, '', `/reset-password?token=${resetToken}`);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('New password'), 'Brand#NewPass2026');
    await user.type(screen.getByLabelText('Confirm new password'), 'Brand#NewPass2026');
    await user.click(screen.getByRole('button', { name: 'Save new password' }));
    expect(await screen.findByText('Password reset link has expired. Please request another.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Request a new link' }));

    expect(screen.getByRole('heading', { name: 'Reset your password' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
  });
});
