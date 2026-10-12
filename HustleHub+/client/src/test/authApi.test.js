import { afterEach, describe, expect, it, vi } from 'vitest';
import { loginUser, registerUser } from '../services/authApi';

function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('authApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('posts the login details as JSON and returns the token', async () => {
    const fetchMock = mockFetch(200, { message: 'LogIn attempt was SUCCESSFULL', token: 'abc' });

    const result = await loginUser({ username: 'johndoe', password: 'Secret#Pass123' });

    expect(result.token).toBe('abc');
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/login$/);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ username: 'johndoe', password: 'Secret#Pass123' });
  });

  it('posts only the registration fields the API expects', async () => {
    const fetchMock = mockFetch(201, { message: 'User Registartion occurred SUCCESSFULLY' });

    await registerUser({ username: 'johndoe', password: 'Secret#Pass123', fullname: 'JohnDoe', email: 'john@example.com', age: 21, confirmPassword: 'x' });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/register$/);
    expect(JSON.parse(options.body)).toEqual({ username: 'johndoe', password: 'Secret#Pass123', fullname: 'JohnDoe', email: 'john@example.com', age: 21 });
  });

  it('shows the error message returned by the API', async () => {
    mockFetch(409, { error: 'User already exists (if this is your account please LogIn)' });

    await expect(registerUser({})).rejects.toThrow('User already exists (if this is your account please LogIn)');
  });

  it('falls back to a safe message when the API gives no error text', async () => {
    mockFetch(500, {});

    await expect(loginUser({})).rejects.toThrow('Your request could not be completed. Please check your details and try again.');
  });

  it('shows a friendly message when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(loginUser({})).rejects.toThrow('We could not reach the service. Please try again shortly.');
  });
});
