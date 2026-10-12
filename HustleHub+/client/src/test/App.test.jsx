import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { loginUser, registerUser } from '../services/authApi';
import { getBookings } from '../services/bookingApi';
import { getGigs } from '../services/gigApi';
import createToken from './createToken';

vi.mock('../services/authApi');
vi.mock('../services/bookingApi');
vi.mock('../services/gigApi');
vi.mock('../services/transactionApi');

async function openRegistration(user) {
  await user.click(screen.getByRole('tab', { name: 'Create account' }));
}

async function fillRegistration(user, values) {
  const fields = { username: 'Username', fullname: 'Full name', email: 'Email address', age: 'Age', password: 'Password', confirmPassword: 'Confirm password' };

  for (const [name, label] of Object.entries(fields)) {
    if (values[name] !== undefined) await user.type(screen.getByLabelText(label), values[name]);
  }

  if (values.role) await user.click(screen.getByLabelText(new RegExp(`^${values.role}`, 'i')));
}

const validRegistration = {
  username: 'johndoe',
  fullname: 'JohnDoe',
  email: 'john@example.com',
  age: '21',
  role: 'freelancer',
  password: 'Secret#Pass123',
  confirmPassword: 'Secret#Pass123',
};

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getGigs.mockResolvedValue([]);
    getBookings.mockResolvedValue([]);
  });

  it('shows the sign in form by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Sign in to HustleHub+' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('switches to the registration form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await openRegistration(user);

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
  });

  it('blocks registration details the API would reject', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    await fillRegistration(user, { username: 'john doe', fullname: 'John Doe', email: 'john@', age: '16', password: 'Short#1a', confirmPassword: 'Different' });
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText("Usernames cannot contain spaces, apostrophes (') or double dashes (--).")).toBeInTheDocument();
    expect(screen.getByText(/Enter your full name without spaces/)).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address, e.g. you@example.com.')).toBeInTheDocument();
    expect(screen.getByText('Enter an age between 17 and 119.')).toBeInTheDocument();
    expect(screen.getByText('Choose an account type.')).toBeInTheDocument();
    expect(screen.getByText('Choose a password with at least 13 characters.')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(screen.getByText('Please accept the terms to continue.')).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('asks for a stronger password when the complexity rules are not met', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    await fillRegistration(user, { ...validRegistration, password: 'alllowercase123', confirmPassword: 'alllowercase123' });
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText(/Use an uppercase letter, a lowercase letter, a number and a symbol/)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('registers a new user and returns to sign in', async () => {
    registerUser.mockResolvedValue({ message: 'User Registartion occurred SUCCESSFULLY' });
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    await fillRegistration(user, { ...validRegistration, username: ' johndoe ' });
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(registerUser).toHaveBeenCalledWith({ username: 'johndoe', fullname: 'JohnDoe', email: 'john@example.com', age: 21, role: 'freelancer', password: 'Secret#Pass123' });
    expect(await screen.findByText('Your account has been created. You can now sign in.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in to HustleHub+' })).toBeInTheDocument();
  });

  it('lets the user choose a client, freelancer or general account', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    const client = screen.getByLabelText(/^client/i);
    const freelancer = screen.getByLabelText(/^freelancer/i);
    const general = screen.getByLabelText(/^general/i);
    expect(client).not.toBeChecked();
    expect(freelancer).not.toBeChecked();
    expect(general).not.toBeChecked();

    await user.click(client);

    expect(client).toBeChecked();
    expect(freelancer).not.toBeChecked();
    expect(general).not.toBeChecked();
  });

  it('sends the general role to the API as GENERIC', async () => {
    registerUser.mockResolvedValue({ message: 'User Registartion occurred SUCCESSFULLY' });
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    await fillRegistration(user, { ...validRegistration, role: 'general' });
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(registerUser).toHaveBeenCalledWith(expect.objectContaining({ role: 'GENERIC' }));
  });

  it('shows the API error when registration fails', async () => {
    registerUser.mockRejectedValue(new Error('User already exists (if this is your account please LogIn)'));
    const user = userEvent.setup();
    render(<App />);
    await openRegistration(user);

    await fillRegistration(user, validRegistration);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('User already exists (if this is your account please LogIn)')).toBeInTheDocument();
  });

  it('shows the API error when the login details are wrong', async () => {
    loginUser.mockRejectedValue(new Error('Invalid Username or Password'));
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Username'), 'johndoe');
    await user.type(screen.getByLabelText('Password'), 'Wrong#Pass1234');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Invalid Username or Password')).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBeNull();
  });

  it('signs in, opens the gigs page and signs out again', async () => {
    const token = createToken({ username: 'johndoe', role: 'GENERIC' });
    loginUser.mockResolvedValue({ message: 'LogIn attempt was SUCCESSFULL', token });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Username'), 'johndoe');
    await user.type(screen.getByLabelText('Password'), 'Secret#Pass123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('heading', { name: 'Gigs' })).toBeInTheDocument();
    expect(await screen.findByText('No gigs are available yet.')).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBe(token);

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(screen.getByText('You have been signed out.')).toBeInTheDocument();
    expect(sessionStorage.getItem('hustlehub_token')).toBeNull();
  });

  it('moves between the gigs and account pages', async () => {
    sessionStorage.setItem('hustlehub_token', createToken({ username: 'johndoe', role: 'GENERIC' }));
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('No gigs are available yet.');

    await user.click(screen.getByRole('button', { name: 'My account' }));

    expect(screen.getByRole('heading', { name: 'My account' })).toBeInTheDocument();
    expect(screen.getByText('johndoe', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('General', { selector: 'dd' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Gigs' }));

    expect(screen.getByRole('heading', { name: 'Gigs' })).toBeInTheDocument();
  });

  it('opens the bookings page from the navigation', async () => {
    sessionStorage.setItem('hustlehub_token', createToken({ username: 'eventco', role: 'client' }));
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('No gigs are available yet.');

    await user.click(screen.getByRole('button', { name: 'Bookings' }));

    expect(screen.getByRole('heading', { name: 'My bookings' })).toBeInTheDocument();
    expect(await screen.findByText('You have not made any bookings yet. Book a gig from the Gigs page.')).toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledWith({ usernameClient: 'eventco' });
  });

  it('keeps the user signed in after a page refresh while the token is valid', async () => {
    sessionStorage.setItem('hustlehub_token', createToken({ username: 'johndoe' }));

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Gigs' })).toBeInTheDocument();
    expect(await screen.findByText('No gigs are available yet.')).toBeInTheDocument();
  });
});
