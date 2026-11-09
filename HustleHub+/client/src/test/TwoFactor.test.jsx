import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { classifyDevice, loginUser, registerUser, resendLoginCode, verifyEmail, verifyLoginOtp } from '../services/authApi';
import { getGigs } from '../services/gigApi';
import createToken from './createToken';

vi.mock('../services/authApi');
vi.mock('../services/bookingApi');
vi.mock('../services/gigApi');
vi.mock('../services/transactionApi');
vi.mock('../services/taxApi');

async function signIn(user) {
  await user.type(screen.getByLabelText('Username'), 'johndoe');
  await user.type(screen.getByLabelText('Password'), 'Secret#Pass123');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

async function enterCode(user, code) {
  await user.type(await screen.findByLabelText('Verification code'), code);
  await user.click(screen.getByRole('button', { name: 'Verify code' }));
}

describe('Two-step sign in', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getGigs.mockResolvedValue([]);
    loginUser.mockResolvedValue({ message: 'Please verify your login using the OTP sent to your email.', requiresTwoFactor: true, temporaryToken: 'temporary-token' });
  });

  it('asks for the email code after registering and then returns to sign in', async () => {
    registerUser.mockResolvedValue({ message: 'Registration successful.', requiresEmailVerification: true });
    verifyEmail.mockResolvedValue({ message: 'Email address successfully verified. You can now log in.', emailVerified: true });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'Create account' }));
    await user.type(screen.getByLabelText('Username'), 'johndoe');
    await user.type(screen.getByLabelText('Full name'), 'JohnDoe');
    await user.type(screen.getByLabelText('Email address'), 'john@example.com');
    await user.type(screen.getByLabelText('Age'), '21');
    await user.click(screen.getByLabelText(/^Client/));
    await user.type(screen.getByLabelText('Password'), 'Secret#Pass123');
    await user.type(screen.getByLabelText('Confirm password'), 'Secret#Pass123');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify email' }));

    expect(verifyEmail).toHaveBeenCalledWith({ username: 'johndoe', otp: '123456' });
    expect(await screen.findByText('Your email address is verified. You can now sign in.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in to HustleHub+' })).toBeInTheDocument();
  });

  it('signs in after the login code and only keeps the final token', async () => {
    const token = createToken({ username: 'johndoe', role: 'client' });
    verifyLoginOtp.mockResolvedValue({ message: 'Login successful', requiresTwoFactor: false, token });
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await enterCode(user, '654321');

    expect(verifyLoginOtp).toHaveBeenCalledWith({ otp: '654321', temporaryToken: 'temporary-token' });
    expect(await screen.findByRole('heading', { name: 'Gigs' })).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBe(token);
  });

  it('asks a new browser to choose Home, Work or Away before signing in', async () => {
    const token = createToken({ username: 'johndoe', role: 'freelancer' });
    verifyLoginOtp.mockResolvedValue({ message: 'OTP verified. Please classify this browser.', requiresDeviceClassification: true, classificationToken: 'classification-token' });
    classifyDevice.mockResolvedValue({ message: 'Device successfully classified. Login successful.', location: 'HOME', token });
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await enterCode(user, '654321');
    await user.click(await screen.findByLabelText(/^Home/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(classifyDevice).toHaveBeenCalledWith({ classificationToken: 'classification-token', location: 'HOME' });
    expect(await screen.findByRole('heading', { name: 'Gigs' })).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBe(token);
  });

  it('shows how many attempts are left after a wrong code', async () => {
    verifyLoginOtp.mockRejectedValue(Object.assign(new Error('Incorrect OTP'), { status: 401, data: { error: 'Incorrect OTP', attemptsRemaining: 4 } }));
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await enterCode(user, '000000');

    expect(await screen.findByText('Incorrect OTP. 4 attempts left.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Enter your sign-in code' })).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBeNull();
  });

  it('sends a new login code when asked', async () => {
    resendLoginCode.mockResolvedValue({ message: 'A new login verification code has been sent to your email.' });
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(await screen.findByRole('button', { name: 'Send a new code' }));

    expect(resendLoginCode).toHaveBeenCalledWith({ temporaryToken: 'temporary-token' });
    expect(await screen.findByText('A new login verification code has been sent to your email.')).toBeInTheDocument();
  });

  it('explains when the chosen browser slot is already used', async () => {
    verifyLoginOtp.mockResolvedValue({ requiresDeviceClassification: true, classificationToken: 'classification-token' });
    classifyDevice.mockRejectedValue(Object.assign(new Error('You already have a recognised HOME browser.'), { status: 409, data: { slotAlreadyUsed: true, occupiedLocation: 'HOME' } }));
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await enterCode(user, '654321');
    await user.click(await screen.findByLabelText(/^Home/));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByText('You already have a recognised HOME browser. Choose another option, or Away.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Where are you signing in from?' })).toBeInTheDocument();
  });
});
