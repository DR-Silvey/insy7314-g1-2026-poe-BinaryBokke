import { describe, expect, it } from 'vitest';
import { clearSession, getSession, saveSession } from '../services/session';
import createToken from './createToken';

describe('session', () => {
  it('saves a valid token and reads the user details from it', () => {
    const token = createToken({ username: 'johndoe', role: 'GENERIC' });

    const session = saveSession(token);

    expect(session).toMatchObject({ token, username: 'johndoe', role: 'GENERIC' });
    expect(sessionStorage.getItem('hustlehub_token')).toBe(token);
    expect(getSession()).toMatchObject({ username: 'johndoe' });
  });

  it('rejects an expired token and removes it from storage', () => {
    sessionStorage.setItem('hustlehub_token', createToken({ expiresInSeconds: -60 }));

    expect(getSession()).toBeNull();
    expect(sessionStorage.getItem('hustlehub_token')).toBeNull();
  });

  it('rejects a malformed token', () => {
    expect(saveSession('not-a-token')).toBeNull();
    expect(sessionStorage.getItem('hustlehub_token')).toBeNull();
  });

  it('clears the stored token', () => {
    saveSession(createToken());

    clearSession();

    expect(getSession()).toBeNull();
  });
});
